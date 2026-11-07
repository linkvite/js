import {LinkviteError} from './errors';
import {DEFAULT_BASE_URL} from './transport';

/**
 * OAuth 2.1 (authorization code + PKCE) helpers for apps that act on behalf of
 * Linkvite users: browser extensions, desktop and mobile apps, and servers.
 * Public clients (no secret) must use PKCE; refresh tokens rotate on every use.
 *
 * @example
 * ```ts
 * const pkce = await oauth.createPkce();
 * location.href = oauth.authorizeUrl({clientId, redirectUri, scope: 'bookmarks:read bookmarks:write', state, codeChallenge: pkce.challenge});
 * // ...on the redirect back:
 * const tokens = await oauth.exchangeCode({clientId, redirectUri, code, codeVerifier: pkce.verifier});
 * const linkvite = new Linkvite({token: tokens.access_token});
 * ```
 */

export interface TokenResponse {
	access_token: string;
	token_type: 'Bearer' | string;
	/** Seconds until the access token expires. */
	expires_in: number;
	/** Single-use: store the new one returned by every refresh. */
	refresh_token: string;
	scope: string;
}

export interface OAuthOptions {
	baseUrl?: string;
	fetch?: typeof fetch;
}

export interface AuthorizeUrlParams {
	clientId: string;
	redirectUri: string;
	/** Space-separated scopes, e.g. "bookmarks:read collections:read". */
	scope: string;
	/** Opaque value you check on the redirect back (CSRF protection). */
	state: string;
	/** From createPkce(). */
	codeChallenge: string;
	/** RFC 8707 resource, e.g. "https://api.linkvite.io". */
	resource?: string;
	/** "consent" to always show the consent screen. */
	prompt?: 'consent';
}

/** The URL to send the user to. */
export function authorizeUrl(
	p: AuthorizeUrlParams,
	opts: OAuthOptions = {},
): string {
	const u = new URL(base(opts) + '/v1/oauth/authorize');
	u.searchParams.set('response_type', 'code');
	u.searchParams.set('client_id', p.clientId);
	u.searchParams.set('redirect_uri', p.redirectUri);
	u.searchParams.set('scope', p.scope);
	u.searchParams.set('state', p.state);
	u.searchParams.set('code_challenge', p.codeChallenge);
	u.searchParams.set('code_challenge_method', 'S256');
	if (p.resource) u.searchParams.set('resource', p.resource);
	if (p.prompt) u.searchParams.set('prompt', p.prompt);
	return u.toString();
}

/** A PKCE verifier (keep it) and its S256 challenge (send it). */
export async function createPkce(): Promise<{
	verifier: string;
	challenge: string;
}> {
	const c = await webcrypto();
	const bytes = new Uint8Array(32);
	c.getRandomValues(bytes);
	const verifier = base64url(bytes);
	const digest = await c.subtle.digest(
		'SHA-256',
		new TextEncoder().encode(verifier),
	);
	return {verifier, challenge: base64url(new Uint8Array(digest))};
}

/** A random `state` value. */
export async function createState(): Promise<string> {
	const c = await webcrypto();
	const bytes = new Uint8Array(16);
	c.getRandomValues(bytes);
	return base64url(bytes);
}

export interface ExchangeCodeParams {
	clientId: string;
	redirectUri: string;
	code: string;
	codeVerifier: string;
	/** Confidential clients only. */
	clientSecret?: string;
	resource?: string;
}

/** Trade the `code` from the redirect for tokens. */
export function exchangeCode(
	p: ExchangeCodeParams,
	opts: OAuthOptions = {},
): Promise<TokenResponse> {
	return tokenRequest(
		{
			grant_type: 'authorization_code',
			code: p.code,
			redirect_uri: p.redirectUri,
			code_verifier: p.codeVerifier,
			client_id: p.clientId,
			client_secret: p.clientSecret,
			resource: p.resource,
		},
		opts,
	);
}

export interface RefreshParams {
	clientId: string;
	refreshToken: string;
	clientSecret?: string;
}

/**
 * Get a new access token. The refresh token is single-use: persist the new
 * one before using the access token. Reusing an old refresh token revokes the
 * whole session, so serialize refreshes (one in flight at a time).
 */
export function refresh(
	p: RefreshParams,
	opts: OAuthOptions = {},
): Promise<TokenResponse> {
	return tokenRequest(
		{
			grant_type: 'refresh_token',
			refresh_token: p.refreshToken,
			client_id: p.clientId,
			client_secret: p.clientSecret,
		},
		opts,
	);
}

/** Revoke an access or refresh token (sign out). */
export async function revoke(
	p: {clientId: string; token: string; clientSecret?: string},
	opts: OAuthOptions = {},
): Promise<void> {
	await post(
		'/v1/oauth/revoke',
		{token: p.token, client_id: p.clientId, client_secret: p.clientSecret},
		opts,
	);
}

/**
 * Wraps `refresh` so concurrent callers share one in-flight request: required
 * with rotating refresh tokens. `load`/`save` read and persist the tokens.
 */
export function singleFlightRefresher(p: {
	clientId: string;
	load: () => Promise<string | null | undefined> | string | null | undefined;
	save: (t: TokenResponse) => Promise<void> | void;
	onFailure?: (err: unknown) => void;
	opts?: OAuthOptions;
}): () => Promise<string | null> {
	let inflight: Promise<string | null> | null = null;
	return () => {
		inflight ??= (async () => {
			try {
				const rt = await p.load();
				if (!rt) return null;
				const t = await refresh(
					{clientId: p.clientId, refreshToken: rt},
					p.opts,
				);
				await p.save(t);
				return t.access_token;
			} catch (err) {
				p.onFailure?.(err);
				return null;
			} finally {
				inflight = null;
			}
		})();
		return inflight;
	};
}

async function tokenRequest(
	fields: Record<string, string | undefined>,
	opts: OAuthOptions,
): Promise<TokenResponse> {
	return (await post('/v1/oauth/token', fields, opts)) as TokenResponse;
}

async function post(
	path: string,
	fields: Record<string, string | undefined>,
	opts: OAuthOptions,
): Promise<unknown> {
	const url = base(opts) + path;
	const body = new URLSearchParams();
	for (const [k, v] of Object.entries(fields)) if (v) body.set(k, v);
	const f = opts.fetch ?? globalThis.fetch;
	const res = await f(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Accept': 'application/json',
		},
		body,
	});
	const json = (await res.json().catch(() => null)) as Record<
		string,
		string
	> | null;
	if (!res.ok) {
		throw new LinkviteError({
			status: res.status,
			message: json?.error_description ?? json?.error ?? res.statusText,
			code: json?.error,
			method: 'POST',
			url,
			body: json,
		});
	}
	return json;
}

const base = (o: OAuthOptions) =>
	(o.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, '');

function base64url(bytes: Uint8Array): string {
	let s = '';
	for (const b of bytes) s += String.fromCharCode(b);
	return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function webcrypto(): Promise<Crypto> {
	if (globalThis.crypto?.subtle) return globalThis.crypto;
	const {webcrypto: wc} = await import('node:crypto');
	return wc as unknown as Crypto;
}
