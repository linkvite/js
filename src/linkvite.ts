import {
    user,
    bookmarks,
    collections
} from './sdks';
import { APIClient, type APIClientOptions } from './rest';

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

    constructor(optionsOrKey: string | APIClientOptions) {
        if (!optionsOrKey || typeof optionsOrKey !== 'string' && !('key' in optionsOrKey) && !('token' in optionsOrKey)) {
            throw new Error(
                'Missing authentication token to `new Linkvite()` — please provide a valid API Key, or Personal Access Token'
            );
        }

        let options: APIClientOptions;
        if (typeof optionsOrKey === 'string') {
            options = { key: optionsOrKey };
        } else {
            options = optionsOrKey as APIClientOptions;
        }

        this.client = new APIClient(options);
        this.user = user(this.client);
        this.bookmarks = bookmarks(this.client);
        this.collections = collections(this.client);
    }
}