import {sdk} from './create';
import type {CreateHighlightEntry, UpdateHighlightEntry} from '../types';

/**
 * Highlights SDK client
 * @public
 */
export const highlights = sdk(client => ({
	/**
	 * Get all highlights for a bookmark
	 *
	 * @param {String} bookmarkID - The ID of the bookmark
	 */
	async getAll(bookmarkID: string) {
		return await client.get('v1/highlights/:id', {id: bookmarkID});
	},

	/**
	 * Create a new highlight
	 *
	 * @param {CreateHighlightEntry} data - The highlight data
	 */
	async create(data: CreateHighlightEntry) {
		return await client.post('v1/highlights', data, {});
	},

	/**
	 * Update a highlight
	 *
	 * @param {String} id - The ID of the highlight
	 * @param {UpdateHighlightEntry} data - The data to update
	 */
	async update(id: string, data: UpdateHighlightEntry) {
		return await client.patch('v1/highlights/:id', data, {id});
	},

	/**
	 * Delete a highlight
	 *
	 * @param {String} id - The ID of the highlight
	 */
	async delete(id: string) {
		return await client.delete('v1/highlights/:id', undefined, {id});
	},
}));
