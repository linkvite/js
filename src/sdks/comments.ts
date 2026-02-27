import {sdk} from './create';
import type {CreateCommentEntry} from '../types';

/**
 * Comments SDK client
 * @public
 */
export const comments = sdk(client => ({
	/**
	 * Get all comments for a bookmark
	 *
	 * @param {String} bookmarkID - The ID of the bookmark
	 */
	async getAll(bookmarkID: string) {
		return await client.get('v1/comments/:id', {id: bookmarkID});
	},

	/**
	 * Create a new comment on a bookmark
	 *
	 * @param {CreateCommentEntry} data - The comment data
	 */
	async create(data: CreateCommentEntry) {
		return await client.post('v1/comments', data, {});
	},

	/**
	 * Toggle the like status of a comment
	 *
	 * @param {String} id - The ID of the comment
	 */
	async toggleLike(id: string) {
		return await client.post('v1/comments/:id/like', undefined, {id});
	},

	/**
	 * Report a comment for moderation
	 *
	 * @param {String} id - The ID of the comment
	 */
	async report(id: string) {
		return await client.post('v1/comments/:id/report', undefined, {id});
	},

	/**
	 * Get users who liked a comment
	 *
	 * @param {String} id - The ID of the comment
	 */
	async getLikes(id: string) {
		return await client.get('v1/comments/:id/likes', {id});
	},

	/**
	 * Delete a comment
	 *
	 * @param {String} id - The ID of the comment
	 */
	async delete(id: string) {
		return await client.delete('v1/comments/:id', undefined, {id});
	},
}));
