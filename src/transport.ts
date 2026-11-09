import {LinkviteError} from './errors';

/** SDK version (package.json's, injected at build time). */
export const VERSION: string = __SDK_VERSION__;
export const DEFAULT_BASE_URL = 'https://api.linkvite.io';

/* ------------------------------------------------------------- type helpers -- */

type JsonContent<R> = R extends {content: {'application/json': infer B}}
	? B
	: R extends {content: {[k: string]: infer B}}
		? B
		: // biome-ignore lint/suspicious/noConfusingVoidType: no body, so methods resolve to Promise<void>
			void;

type SuccessBody<O> = O extends {responses: infer R}
	? 200 extends keyof R
		? JsonContent<R[200]>
		: 201 extends keyof R
			? JsonContent<R[201]>
			: 202 extends keyof R
				? JsonContent<R[202]>
				: // biome-ignore lint/suspicious/noConfusingVoidType: no body, so methods resolve to Promise<void>
					void
	: never;

/**
 * What a method resolves to: the `data` of the `{ok, message, data}` envelope
 * (undefined for message-only responses), or the body itself for endpoints
 * that don't use the envelope.
 */
export type Data<O> =
	SuccessBody<O> extends {ok: true}
		? 'data' extends keyof SuccessBody<O>
			? SuccessBody<O> extends {data: infer D}
				? D
				: SuccessBody<O> extends {data?: infer D}
					? D | undefined
					: never
			: undefined
		: SuccessBody<O>;

/** The request body of an operation (JSON or multipart). */
export type Body<O> = O extends {requestBody: {content: infer C}}
	? C extends {'application/json': infer B}
		? B
		: C extends {'multipart/form-data': infer B}
			? {[K in keyof B]: B[K] extends string ? string | Blob : B[K]}
			: never
	: O extends {requestBody?: {content: infer C}}
		? C extends {'application/json': infer B}
			? B
			: never
		: never;

/** The query parameters of an operation. */
export type Query<O> = O extends {parameters: {query?: infer Q}}
	? NonNullable<Q>
	: never;

/* ---------------------------------------------------------------- transport -- */

export type TokenSource =
	| string
	| (() => string | null | undefined | Promise<string | null | undefined>);

export interface ClientOptions {
	/** An API key (Settings → Developers). Sent as `x-api-key`. */
	apiKey?: string;
	/** @deprecated use `apiKey` */
	key?: string;
	/**
	 * An access token (OAuth or first-party), or a function returning the
	 * current one. Sent as `Authorization: Bearer`.
	 */
	token?: TokenSource;
	/**
	 * Called once when a request fails with 401: return a fresh access token to
	 * retry with (e.g. after an OAuth refresh), or null to give up.
	 */
	onUnauthorized?: () => Promise<string | null | undefined>;
	/** Defaults to https://api.linkvite.io. */
	baseUrl?: string;
	/** Retries for 429, 5xx and network errors on idempotent requests. Default 2. */
	maxRetries?: number;
	/** Per-request timeout in ms. Default 30000. */
	timeoutMs?: number;
	/** Extra headers on every request. */
	headers?: Record<string, string>;
	/** Custom fetch (tests, proxies). Defaults to globalThis.fetch. */
	fetch?: typeof fetch;
}

export interface RequestOptions {
	signal?: AbortSignal;
	headers?: Record<string, string>;
	timeoutMs?: number;
	maxRetries?: number;
}

interface RequestParts {
	path?: Record<string, string>;
	query?: object;
	body?: unknown;
	multipart?: boolean;
}

const IDEMPOTENT = new Set(['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS']);

export class Transport {
	readonly baseUrl: string;
	private readonly opts: ClientOptions;
	private readonly fetchFn: typeof fetch;

	constructor(opts: ClientOptions = {}) {
		this.opts = opts;
		this.baseUrl = (opts.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
		const f = opts.fetch ?? globalThis.fetch;
		if (!f) {
			throw new Error(
				'@linkvite/js: no fetch available; pass `fetch` in the client options (Node 18+ has one built in)',
			);
		}
		this.fetchFn = f.bind(globalThis);
	}

	url(template: string, parts: RequestParts = {}): string {
		const p = template.replace(/\{([^}]+)\}/g, (_, k: string) => {
			const v = parts.path?.[k];
			if (v === undefined || v === '') {
				throw new TypeError(
					`@linkvite/js: missing path parameter "${k}" for ${template}`,
				);
			}
			return encodeURIComponent(v);
		});
		const qs = new URLSearchParams();
		for (const [k, v] of Object.entries(parts.query ?? {})) {
			if (v === undefined || v === null) continue;
			if (Array.isArray(v)) {
				for (const x of v) qs.append(k, String(x));
			} else qs.set(k, String(v));
		}
		const q = qs.toString();
		return this.baseUrl + p + (q ? `?${q}` : '');
	}

	private async headers(extra?: Record<string, string>): Promise<Headers> {
		const h = new Headers({
			Accept: 'application/json',
			...this.opts.headers,
			...extra,
		});
		const apiKey = this.opts.apiKey ?? this.opts.key;
		if (apiKey) h.set('x-api-key', apiKey);
		const token =
			typeof this.opts.token === 'function'
				? await this.opts.token()
				: this.opts.token;
		if (token && !h.has('Authorization'))
			h.set('Authorization', `Bearer ${token}`);
		// browsers forbid setting User-Agent; cultus labels SDK traffic by it
		if (typeof (globalThis as {document?: unknown}).document === 'undefined') {
			h.set('User-Agent', `linkvite-js/${VERSION}`);
		}
		return h;
	}

	async request<T>(
		method: string,
		template: string,
		parts: RequestParts = {},
		options: RequestOptions = {},
	): Promise<T> {
		const url = this.url(template, parts);
		let body: BodyInit | undefined;
		const extra: Record<string, string> = {...options.headers};
		if (parts.body !== undefined) {
			if (parts.multipart) {
				body = toFormData(parts.body as Record<string, unknown>);
			} else {
				body = JSON.stringify(parts.body);
				extra['Content-Type'] = 'application/json';
			}
		}
		const maxRetries = IDEMPOTENT.has(method)
			? (options.maxRetries ?? this.opts.maxRetries ?? 2)
			: 0;
		const timeoutMs = options.timeoutMs ?? this.opts.timeoutMs ?? 30_000;
		let refreshed = false;

		for (let attempt = 0; ; attempt++) {
			const headers = await this.headers(extra);
			const timeout = AbortSignal.timeout(timeoutMs);
			const signal = options.signal
				? anySignal([options.signal, timeout])
				: timeout;
			let res: Response;
			try {
				res = await this.fetchFn(url, {method, headers, body, signal});
			} catch (err) {
				if (options.signal?.aborted) throw err;
				if (attempt < maxRetries) {
					await sleep(backoff(attempt));
					continue;
				}
				throw new LinkviteError({
					status: 0,
					message: `network error: ${(err as Error).message}`,
					method,
					url,
					cause: err,
				});
			}

			if (res.status === 401 && !refreshed && this.opts.onUnauthorized) {
				refreshed = true;
				const fresh = await this.opts.onUnauthorized();
				if (fresh) {
					extra.Authorization = `Bearer ${fresh}`;
					attempt--;
					continue;
				}
			}
			if ((res.status === 429 || res.status >= 500) && attempt < maxRetries) {
				await sleep(retryAfter(res) ?? backoff(attempt));
				continue;
			}
			return parse<T>(res, method, url);
		}
	}
}

async function parse<T>(
	res: Response,
	method: string,
	url: string,
): Promise<T> {
	const type = res.headers.get('content-type') ?? '';
	const requestId = res.headers.get('x-request-id') ?? undefined;
	if (!type.includes('json')) {
		const text = await res.text();
		if (!res.ok)
			throw new LinkviteError({
				status: res.status,
				message: text || res.statusText,
				method,
				url,
				requestId,
			});
		return (text === '' ? undefined : text) as T;
	}
	const json = (await res.json().catch(() => null)) as Record<
		string,
		unknown
	> | null;
	if (!res.ok || json?.ok === false) {
		throw new LinkviteError({
			status: res.status,
			message:
				(json?.error as string) ??
				(json?.error_description as string) ??
				res.statusText,
			code:
				typeof json?.error === 'string' && json?.error_description
					? (json.error as string)
					: undefined,
			errors: json?.errors as Record<string, string> | undefined,
			requestId: (json?.request_id as string) ?? requestId,
			method,
			url,
			body: json,
		});
	}
	if (json && json.ok === true) return json.data as T;
	return json as T;
}

function toFormData(body: Record<string, unknown>): FormData {
	const fd = new FormData();
	for (const [k, v] of Object.entries(body)) {
		if (v === undefined || v === null) continue;
		if (v instanceof Blob) fd.append(k, v, (v as File).name ?? k);
		else fd.append(k, typeof v === 'object' ? JSON.stringify(v) : String(v));
	}
	return fd;
}

function backoff(attempt: number): number {
	return Math.min(8000, 400 * 2 ** attempt) * (0.75 + Math.random() * 0.5);
}

function retryAfter(res: Response): number | undefined {
	const v = res.headers.get('retry-after');
	if (!v) return undefined;
	const s = Number(v);
	if (Number.isFinite(s)) return Math.min(s, 30) * 1000;
	const at = Date.parse(v);
	return Number.isNaN(at)
		? undefined
		: Math.max(0, Math.min(at - Date.now(), 30_000));
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

function anySignal(signals: AbortSignal[]): AbortSignal {
	const any = (
		AbortSignal as unknown as {any?: (s: AbortSignal[]) => AbortSignal}
	).any;
	if (any) return any(signals);
	const c = new AbortController();
	for (const s of signals) {
		if (s.aborted) {
			c.abort(s.reason);
			break;
		}
		s.addEventListener('abort', () => c.abort(s.reason), {once: true});
	}
	return c.signal;
}
