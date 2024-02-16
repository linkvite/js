import {sdk} from './create';
import type {ImageUploadType, UpdateUserEntry, UserSettings} from '../types';

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
	 * Update the current user's profile
	 *
	 * @param {UpdateUserEntry} data - The data to update the user with
	 */
	async update(data: UpdateUserEntry) {
		return await client.patch('v1/user', data, {});
	},

	/**
	 * Update the current user's avatar
	 *
	 * @param {Object} data - The form data to update the user's avatar with
	 */
	async updateAvatar({
		file,
		avatar,
		type,
	}:
		| {
				file?: File;
				avatar?: never;
				type: Extract<ImageUploadType, 'custom'>;
		  }
		| {
				file?: never;
				avatar: string;
				type: Extract<ImageUploadType, 'default'>;
		  }
		| {
				file?: never;
				avatar?: never;
				type: Extract<ImageUploadType, 'remove'>;
		  }) {
		const formData = new FormData();
		formData.append('type', type);

		if (type === 'custom' && file) {
			formData.append('file', file);
		}

		if (type === 'default' && avatar) {
			formData.append('avatar', avatar);
		}

		return await client.patch('v1/user/avatar', formData, {});
	},

	/**
	 * Get the current user's settings
	 */
	async getSettings() {
		return await client.get('v1/user/settings', {});
	},

	/**
	 * Update the current user's settings
	 *
	 * @param {Partial<UserSettings>} data - The data to update the user's settings with
	 */
	async updateSettings(data: Partial<UserSettings>) {
		return await client.patch('v1/user/settings', data, {});
	},

	/**
	 * Empty the current user's trash
	 */
	async emptyTrash() {
		return await client.delete('v1/user/trash', undefined, {});
	},
}));
