import {sdk} from './create';

/**
 * Search SDK client
 * @public
 */
export const search = sdk(client => ({
	/**
	 * Search across bookmarks, collections, and users
	 *
	 * @param {String} q - The search query
	 * @param {Object} params - Additional search parameters
	 */
	async search(
		q: string,
		params: {type?: string; page?: number; limit?: number} = {},
	) {
		return await client.get('v1/search', {q, ...params});
	},

	/**
	 * Search for photos on Unsplash
	 *
	 * @param {String} q - The search query
	 * @param {Number} page - The page number
	 */
	async searchUnsplash(q: string, page?: number) {
		return await client.get('v1/search/unsplash', {q, page});
	},

	/**
	 * Track an Unsplash photo download for attribution
	 *
	 * @param {String} photoId - The Unsplash photo ID
	 */
	async trackUnsplashDownload(photoId: string) {
		return await client.post(
			'v1/search/unsplash/track',
			{photo_id: photoId},
			{},
		);
	},

	/**
	 * Search for GIFs on Tenor
	 *
	 * @param {String} q - The search query
	 */
	async searchTenor(q: string) {
		return await client.get('v1/search/tenor', {q});
	},
}));
