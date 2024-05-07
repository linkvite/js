import type {OBJECT_ID} from './generic';
export type APIStatus = 'active' | 'inactive';

export type APIKey = {
	id: string;

	/**
	 * The secret key of the API key
	 *
	 * This can only be fetched once.
	 */
	secret?: string;

	/**
	 * The last time the API key was used
	 *
	 * Updated whenever a call is made using the API key
	 */
	lastUsed: number;

	/**
	 * The last time the API key was edited
	 */
	updateAt: number;

	/**
	 * The time the API key was created
	 */
	createdAt: number;

	/**
	 * The ID of the user who created the API key
	 */
	owner: OBJECT_ID;

	/**
	 * Current status of the API key
	 */
	status: APIStatus;

	/**
	 * The name of the API key
	 */
	name: string;

	/**
	 * Amount of requests made using the API key
	 */
	usageCount: number;
};
