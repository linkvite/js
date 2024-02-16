import {DEFAULT_BASE_URL} from '../utils/constants';
import {createURLBuilder} from '../utils/url';
import {fetch, Headers, Request, setAuthHeader} from '../utils/fetch';
import type {ExtractRouteParams, Method} from '../types';
import type {APIResponse, Endpoints, ErroredAPIResponse} from './endpoints';

/**
 * Options passed to the API client.
 * This will usually come from Linkvite#constructor in most cases
 * @public
 */
export type APIClientOptions = {
	readonly baseUrl?: string;
} & (
	| {
			readonly key: string;
	  }
	| {
			readonly token: string;
	  }
);

/**
 * Pull all paths for a given method
 * @internal
 */
export type PathsFor<M extends Method> = Extract<
	Endpoints,
	{method: M}
>['path'];

/**
 * Extract an endpoint from a given method and path
 * @public
 */
export type ExtractEndpoint<
	Method extends string,
	Path extends string,
> = Extract<Endpoints, {path: Path; method: Method}>;

/**
 * Generate a query object that includes typed URL params
 * @public
 */
export type Query<Path extends string> = ExtractRouteParams<Path> &
	Record<string, string | number | undefined>;

/**
 * An error that occurred as a response from the Linkvite API.
 * @public
 */
export class LinkviteAPIError extends Error {
	public readonly ok: boolean;
	public readonly status: number;

	constructor(
		public readonly request: Request,
		public readonly response: Response,
		public readonly data: ErroredAPIResponse,
	) {
		super(data.message);

		this.status = response.status;
		this.ok = data?.ok ?? response.ok ?? false;
	}
}

/**
 * API Client that is responsible for handling all requests
 * @public
 */
export class APIClient {
	private readonly url;
	private readonly options;
	private agent: import('node:https').Agent | null;

	constructor(options: APIClientOptions) {
		this.options = options;
		this.url = createURLBuilder(options.baseUrl ?? DEFAULT_BASE_URL);

		// Be careful when using this property. It will only
		// have a value in Node.js environments. This is because
		// we add code at build time
		this.agent = null;
	}

	authType() {
		return 'key' in this.options ? 'key' : 'token';
	}

	async get<Path extends PathsFor<'GET'>, T>(
		path: Path,
		query: Query<Path>,
		init?: RequestInit,
	) {
		return this.request<
			T & Extract<Endpoints, {method: 'GET'; path: Path}>['res']['data']
		>('GET', path, undefined, query, init);
	}

	post<Path extends Extract<Endpoints, {method: 'POST'}>['path']>(
		path: Path,
		body: Extract<Endpoints, {path: Path; method: 'POST'}>['body'],
		query: Query<Path>,
		init?: RequestInit,
	) {
		return this.request<
			Extract<Endpoints, {path: Path; method: 'POST'}>['res']
		>('POST', path, body, query, init);
	}

	patch<Path extends Extract<Endpoints, {method: 'PATCH'}>['path']>(
		path: Path,
		body: Extract<Endpoints, {path: Path; method: 'PATCH'}>['body'],
		query: Query<Path>,
		init?: RequestInit,
	) {
		return this.request<
			Extract<Endpoints, {path: Path; method: 'PATCH'}>['res']
		>('PATCH', path, body, query, init);
	}

	delete<Path extends Extract<Endpoints, {method: 'DELETE'}>['path']>(
		path: Path,
		body: Extract<Endpoints, {path: Path; method: 'DELETE'}>['body'],
		query: Query<Path>,
		init?: RequestInit,
	) {
		return this.request<
			Extract<Endpoints, {path: Path; method: 'DELETE'}>['res']
		>('DELETE', path, body, query, init);
	}

	/**
	 * Make a request to the Linkvite API
	 * @param method - The HTTP method to use
	 * @param path - The path to request
	 * @param data - The data to send
	 */
	private async request<T>(
		method: Method,
		path: string,
		body: unknown,
		query: Record<string, string | number | undefined> = {},
		init: RequestInit = {},
	) {
		const url = this.url(path, query);
		const headers = setAuthHeader(new Headers(init.headers), this.options);

		if (body) {
			if (method === 'GET') {
				throw new Error('Cannot send a body with a GET request');
			}

			if (body instanceof FormData) {
				// for some reason, files won't upload
				// without removing the content type
				// see: https://stackoverflow.com/a/39281156
				headers.delete('Content-Type');
			} else {
				headers.set('Content-Type', 'application/json');
			}
		}

		const request = new Request(url, {
			method,
			headers,
			body: body
				? body instanceof FormData
					? body
					: JSON.stringify(body)
				: null,
			...init,
		});

		return this.executeRequest<T>(request);
	}

	private async executeRequest<T>(request: Request): Promise<T> {
		if (
			typeof process !== 'undefined' &&
			process.versions &&
			process.versions.node
		) {
			if (!this.agent) {
				const https = await import('https');
				this.agent = new https.Agent({keepAlive: true});
			}
		}

		const response = await fetch(request, {
			keepalive: true,
			headers: request.headers,

			// @ts-expect-error Targeting multiple runtimes, this will only work in node
			agent: this.agent,
		});

		if (
			response.status === 204 ||
			!response.headers.get('Content-Type')?.includes('application/json')
		) {
			// Probably a DELETE request with no body returned, so return undefined here
			// This cast is (prolly) safe because endpoints that return nothing
			// are typed as `Empty`
			return undefined as unknown as T;
		}

		const result = await (response.json() as Promise<APIResponse<T>>).catch(
			(error: Error): ErroredAPIResponse => {
				return {
					ok: false,
					message: error.message,
				};
			},
		);

		if (!result.ok) {
			throw new LinkviteAPIError(request, response, result);
		}

		return result.data;
	}
}
