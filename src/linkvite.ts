import {createResources, type Resources} from './generated/resources';
import type {components} from './generated/schema';
import {LinkviteError} from './errors';
import {
	DEFAULT_BASE_URL,
	Transport,
	type ClientOptions,
	type RequestOptions,
} from './transport';

/**
 * The Linkvite API client. Every namespace (`bookmarks`, `collections`, ...)
 * is generated from the API's OpenAPI spec.
 *
 * @example
 * ```ts
 * const linkvite = new Linkvite('link_...');              // API key
 * const linkvite = new Linkvite({token: accessToken});    // OAuth access token
 * const bookmark = await linkvite.bookmarks.create({url: 'https://example.com'});
 * ```
 */
export interface Linkvite extends Resources {}

export class Linkvite {
	readonly transport: Transport;

	constructor(apiKeyOrOptions: string | ClientOptions = {}) {
		const opts =
			typeof apiKeyOrOptions === 'string'
				? {apiKey: apiKeyOrOptions}
				: apiKeyOrOptions;
		this.transport = new Transport(opts);
		Object.assign(this, createResources(this.transport));
	}

	/**
	 * Call any endpoint, including ones newer than this SDK.
	 * Resolves to the response's `data`.
	 */
	request<T = unknown>(
		method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
		path: string,
		parts: {
			path?: Record<string, string>;
			query?: object;
			body?: unknown;
			multipart?: boolean;
		} = {},
		options?: RequestOptions,
	): Promise<T> {
		return this.transport.request<T>(method, path, parts, options);
	}

	/**
	 * Every page of a paginated list. `fetchPage(page)` returns one page; pages
	 * are fetched until `last_page` is reached.
	 *
	 * @example
	 * ```ts
	 * for await (const b of linkvite.paginate(page => linkvite.bookmarks.getAll({page, limit: 100}), 'bookmarks')) { ... }
	 * ```
	 */
	async *paginate<K extends string, P extends {[k in K]?: unknown}>(
		fetchPage: (page: number) => Promise<P>,
		key: K,
	): AsyncGenerator<ItemOf<P[K]>> {
		for (let page = 1; ; page++) {
			const res = await fetchPage(page);
			const items = ((res[key] as unknown) ?? []) as ItemOf<P[K]>[];
			yield* items;
			const p = (res as {pagination?: {last_page?: number} | null}).pagination;
			if (page >= (p?.last_page ?? page) || items.length === 0) return;
		}
	}

	/**
	 * Sign in with a username/email and password (first-party apps). Third-party
	 * apps should use OAuth (`oauth.authorizeUrl` / `oauth.exchangeCode`) or an
	 * API key instead.
	 */
	static async fromCredentials(
		identifier: string,
		password: string,
		opts: ClientOptions = {},
	): Promise<Linkvite> {
		const s = await login(identifier, password, opts);
		return new Linkvite({...opts, token: s.access_token});
	}
}

type ItemOf<T> = NonNullable<T> extends readonly (infer I)[] ? I : never;

export type Session = components['schemas']['AuthResponse'];

/** First-party sign-in. Returns the user and an access/refresh token pair. */
export async function login(
	identifier: string,
	password: string,
	opts: ClientOptions = {},
): Promise<Session> {
	const t = new Transport({
		...opts,
		apiKey: undefined,
		key: undefined,
		token: undefined,
	});
	return t.request<Session>('POST', '/v1/auth/login', {
		body: {identifier, password},
	});
}

/**
 * Rotate a first-party session's refresh token. Single-use: store the new
 * refresh token; reusing an old one signs the session out everywhere.
 */
export async function refreshSession(
	refreshToken: string,
	opts: ClientOptions = {},
): Promise<Session> {
	const t = new Transport({
		...opts,
		apiKey: undefined,
		key: undefined,
		token: undefined,
	});
	return t.request<Session>('POST', '/v1/auth/token/refresh', {
		body: {refresh_token: refreshToken},
	});
}

export {DEFAULT_BASE_URL, LinkviteError};
