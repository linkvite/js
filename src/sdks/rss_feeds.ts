import {sdk} from './create';
import type {CreateRSSFeedEntry, UpdateRSSFeedEntry} from '../types';

/**
 * RSS Feeds SDK client
 * @public
 */
export const rssFeeds = sdk(client => ({
	/**
	 * Get all RSS feed subscriptions for the current user
	 */
	async getAll(p: {q?: string; page?: number; limit?: number} = {}) {
		return await client.get('v1/rss-feeds', p);
	},

	/**
	 * Get items from an RSS feed
	 *
	 * @param {String} id - The ID of the RSS feed
	 */
	async getItems(id: string) {
		return await client.get('v1/rss-feeds/:id/items', {id});
	},

	/**
	 * Subscribe to an RSS feed
	 *
	 * @param {CreateRSSFeedEntry} data - The RSS feed data
	 */
	async create(data: CreateRSSFeedEntry) {
		return await client.post('v1/rss-feeds', data, {});
	},

	/**
	 * Update an RSS feed subscription
	 *
	 * @param {String} id - The ID of the RSS feed
	 * @param {UpdateRSSFeedEntry} data - The data to update
	 */
	async update(id: string, data: UpdateRSSFeedEntry) {
		return await client.patch('v1/rss-feeds/:id', data, {id});
	},

	/**
	 * Delete multiple RSS feed subscriptions at once
	 *
	 * @param {String[]} feedIds - The IDs of the feeds to delete
	 */
	async batchDelete(feedIds: string[]) {
		return await client.post('v1/rss-feeds/batch-delete', {feeds: feedIds}, {});
	},
}));
