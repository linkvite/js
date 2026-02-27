import type {Endpoint} from '../rest';
type APIStatus = 'active' | 'inactive';

export type APIKey = {
	/**
	 * The public ID of the API key
	 *
	 * Always prefixed with `link_`
	 */
	id: string;

	/**
	 * The ID of the user who created the API key
	 */
	user_id: string;

	/**
	 * The name of the API key
	 */
	name: string;

	/**
	 * Current status of the API key
	 */
	status: APIStatus;

	/**
	 * Amount of requests made using the API key
	 */
	usage_count: number;

	/**
	 * The time the API key was created
	 */
	created_at: Date;

	/**
	 * The last time the API key was edited
	 */
	update_at: Date;

	/**
	 * The key prefix (first few characters of the key)
	 */
	prefix: string;

	/**
	 * The scopes/permissions granted to this API key
	 */
	scopes: string[];

	/**
	 * The last time the API key was used
	 *
	 * Updated whenever a call is made using the API key
	 */
	last_used_at: Date | null;

	/**
	 * The date the API key expires
	 *
	 * If null, the key never expires
	 */
	expires_at: Date | null;

	/**
	 * The date the API key was revoked
	 *
	 * This is only set when the API key is revoked
	 */
	revoked_at: Date | null;

	/**
	 * The secret key of the API key
	 *
	 * Always prefixed with `api_`
	 *
	 * This can only be viewed once when the API key is created
	 */
	secret?: string;
};

export type CreateOrUpdateAPIKeyEntry = {
	name: string;
	scopes?: string[];
};

export type APIKeyEndpoints =
	| Endpoint<'GET', 'v1/api-keys', APIKey[]>
	| Endpoint<'POST', 'v1/api-keys', APIKey, CreateOrUpdateAPIKeyEntry>
	| Endpoint<'PATCH', 'v1/api-keys/:id', APIKey, CreateOrUpdateAPIKeyEntry>;
