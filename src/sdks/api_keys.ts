import {sdk} from './create';
import type {CreateOrUpdateAPIKeyEntry} from '../types';

/**
 * API keys SDK client
 * @public
 */
export const apiKeys = sdk(client => ({
	/**
	 * Get all the user's API keys
	 */
	async getAll() {
		return await client.get('v1/api-keys', {});
	},

	/**
	 * Create a new API key
	 *
	 * @param {CreateOrUpdateAPIKeyEntry} data - Contains the name of the API key
	 */
	async create(data: CreateOrUpdateAPIKeyEntry) {
		return await client.post('v1/api-keys', data, {});
	},

	/**
	 * Update an API key
	 *
	 * @param {String} id - The ID of the API key
	 * @param {CreateOrUpdateAPIKeyEntry} data - Contains the name of the API key
	 */
	async update(id: string, data: CreateOrUpdateAPIKeyEntry) {
		return await client.patch(`v1/api-keys/:id`, data, {id});
	},
}));
