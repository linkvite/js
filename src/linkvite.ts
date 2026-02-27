import {apiKeys} from './sdks/api_keys';
import {user, bookmarks, collections} from './sdks';
import {comments} from './sdks/comments';
import {highlights} from './sdks/highlights';
import {invites} from './sdks/invites';
import {reminders} from './sdks/reminders';
import {rssFeeds} from './sdks/rss_feeds';
import {search} from './sdks/search';
import {parser} from './sdks/parser';
import {APIClient, LinkviteAPIError, type APIClientOptions} from './rest';
import {fetch, Headers, Request} from './utils/fetch';
import {DEFAULT_BASE_URL} from './utils/constants';
import type {LoginResult} from './types/auth';
import type {APIResponse} from './rest/endpoints';

/**
 * Authenticate with an identifier (username or email) and password.
 * Returns tokens and the authenticated user.
 *
 * Use the returned tokens with `new Linkvite({ token })` to create
 * an authenticated client, or use `Linkvite.fromCredentials()` to do
 * both in one step.
 *
 * @example
 * ```ts
 * const result = await login('user@example.com', 'password');
 * const linkvite = new Linkvite({ token: result.access_token });
 * ```
 */
export async function login(
	identifier: string,
	password: string,
	options?: {baseUrl?: string},
): Promise<LoginResult> {
	const baseUrl = options?.baseUrl ?? DEFAULT_BASE_URL;
	const url = `${baseUrl}/v1/auth/login`;

	const request = new Request(url, {
		method: 'POST',
		headers: new Headers({'Content-Type': 'application/json'}),
		body: JSON.stringify({identifier, password}),
	});

	const response = await fetch(request);
	const result = (await response.json()) as APIResponse<LoginResult>;

	if (!result.ok) {
		throw new LinkviteAPIError(request, response, result);
	}

	return result.data;
}

/**
 * Root class containing all methods and types for interacting with the Linkvite platform.
 * This will be the entrypoint for most users of the Linkvte SDK.
 *
 * @public
 *
 * @example
 * ```ts
 * const linkvite = new Linkvite('my-api-key');
 * // or
 * const linkvite = new Linkvite({ token: 'eyJhbG...' });
 * // Create a new bookmark
 * await linkvite.bookmarks.create({ url: 'https://example.com' });
 * ```
 */
export class Linkvite {
	public readonly client: APIClient;

	public readonly user;
	public readonly bookmarks;
	public readonly collections;
	public readonly apiKeys;
	public readonly comments;
	public readonly highlights;
	public readonly invites;
	public readonly reminders;
	public readonly rssFeeds;
	public readonly search;
	public readonly parser;

	constructor(optionsOrKey: string | APIClientOptions) {
		if (
			!optionsOrKey ||
			(typeof optionsOrKey !== 'string' &&
				!('key' in optionsOrKey) &&
				!('token' in optionsOrKey))
		) {
			throw new Error(
				'Missing authentication token to `new Linkvite()` — please provide a valid API Key, or Personal Access Token',
			);
		}

		let options: APIClientOptions;
		if (typeof optionsOrKey === 'string') {
			options = {key: optionsOrKey};
		} else {
			options = optionsOrKey as APIClientOptions;
		}

		this.client = new APIClient(options);
		this.user = user(this.client);
		this.bookmarks = bookmarks(this.client);
		this.collections = collections(this.client);
		this.apiKeys = apiKeys(this.client);
		this.comments = comments(this.client);
		this.highlights = highlights(this.client);
		this.invites = invites(this.client);
		this.reminders = reminders(this.client);
		this.rssFeeds = rssFeeds(this.client);
		this.search = search(this.client);
		this.parser = parser(this.client);
	}

	/**
	 * Create a Linkvite client by logging in with an identifier and password.
	 *
	 * @example
	 * ```ts
	 * const linkvite = await Linkvite.fromCredentials('user@example.com', 'password');
	 * ```
	 */
	static async fromCredentials(
		identifier: string,
		password: string,
		options?: {baseUrl?: string},
	): Promise<Linkvite> {
		const result = await login(identifier, password, options);
		return new Linkvite({token: result.access_token, ...options});
	}

	/**
	 * Refresh the access token using a refresh token.
	 * Returns the new tokens and updated user — create a new `Linkvite` instance
	 * with the new `access_token` to continue making authenticated requests.
	 *
	 * @param {String} refreshToken - The refresh token from a previous login or refresh
	 *
	 * @example
	 * ```ts
	 * const result = await linkvite.refreshToken(myRefreshToken);
	 * const newClient = new Linkvite({ token: result.access_token });
	 * ```
	 */
	async refreshToken(refreshToken: string): Promise<LoginResult> {
		return await this.client.post(
			'v1/auth/token/refresh',
			{refresh_token: refreshToken},
			{},
		);
	}
}
