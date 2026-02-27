import {sdk} from './create';
import type {UpdateSettingsEntry, UpdateUserEntry} from '../types';

/**
 * Users SDK client
 * @public
 */
export const user = sdk(client => ({
	/**
	 * Get the current user
	 */
	async get() {
		return await client.get('v1/user', {});
	},

	/**
	 * Get the current user's storage usage.
	 */
	async getStorageUsage() {
		return await client.get('v1/user/storage', {});
	},

	/**
	 * Get a detailed breakdown of storage usage with paginated bookmark info
	 */
	async getDetailedStorageUsage(
		p: {q?: string; page?: number; limit?: number} = {},
	) {
		return await client.get('v1/user/storage/detailed', p);
	},

	/**
	 * Update the current user's profile
	 *
	 * @param {UpdateUserEntry} data - The data to update the user with
	 */
	async update(data: UpdateUserEntry) {
		return await client.patch('v1/user', data, {});
	},

	/**
	 * Update the current user's settings
	 *
	 * @param {UpdateSettingsEntry} data - The settings to update the user with
	 */
	async updateSettings(data: UpdateSettingsEntry) {
		return await client.patch('v1/user/settings', data, {});
	},

	/**
	 * Empty the current user's trash
	 */
	async emptyTrash() {
		return await client.delete('v1/user/trash', undefined, {});
	},
}));
