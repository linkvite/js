import type {
	BookmarkFileEntry,
	BookmarkPagination,
	BookmarkTabsEntry,
	ImageUploadType,
	ManualBookmarkEntry,
	ManualBookmarkEntryPayload,
	ParsedLinkData,
	UpdateBookmarkEntry,
	UpdateBookmarksEntry,
} from '../types';
import {sdk} from './create';

/**
 * Bookmarks SDK client
 * @public
 */
export const bookmarks = sdk(client => ({
	/**
	 * Get a bookmark by its ID
	 *
	 * @param {String} id - The ID of the bookmark
	 */
	async get(id: string) {
		return await client.get('v1/bookmarks/:id', {id});
	},

	/**
	 * Get the reader (article) content of a bookmark
	 *
	 * @param {String} id - The ID of the bookmark
	 */
	async getReader(id: string) {
		return await client.get('v1/bookmarks/:id/reader', {id});
	},

	/**
	 * Get all the user's bookmarks
	 */
	async getAll(p: BookmarkPagination = {}) {
		return await client.get('v1/bookmarks', p);
	},

	/**
	 * Check if a bookmark exists
	 *
	 * @param {String} url - The URL of the bookmark
	 */
	async exists(url: string, collection: string | null = null) {
		return await client.post('v1/bookmarks/exists', {url, collection}, {});
	},

	/**
	 * Get all the bookmarks in a collection
	 *
	 * @param {String} id - The ID of the collection
	 */
	async fromCollection(id: string) {
		return await client.get('v1/bookmarks/from-collection/:id', {id});
	},

	/**
	 * Get the archive of a bookmark
	 *
	 * @param {String} id - The ID of the bookmark
	 */
	async getArchive(id: string) {
		return await client.get('v1/bookmarks/:id/archive', {id});
	},

	/**
	 * Request to create an archive of a bookmark
	 *
	 * @param {String} id - id URL of the bookmark
	 */
	async createArchive(id: string) {
		return await client.post('v1/bookmarks/:id/archive', undefined, {id});
	},

	/**
	 * Create a new bookmark by URL
	 *
	 * @param {String} url - The URL of the bookmark
	 * @param {String} collection - The optional ID of the collection
	 */
	async create(url: string, collection: string | null = null) {
		return await client.post('v1/bookmarks', {url, collection}, {});
	},

	/**
	 * Create a new bookmark from parsed link data
	 */
	async createFromParsedData(
		data: ParsedLinkData,
		collection: string | null = null,
	) {
		return await client.post(
			'v1/bookmarks/from-parsed-link',
			{data, collection},
			{},
		);
	},

	/**
	 * Create a new bookmark from file upload
	 */
	async createFromFile(data: BookmarkFileEntry) {
		const formData = new FormData();
		formData.append('file', data.file);

		if (data.collection) {
			formData.append('collection', data.collection);
		}

		if (data.tags) {
			formData.append('tags', data.tags);
		}

		if (data.starred) {
			formData.append('starred', data.starred.toString());
		}

		if (data.allowComments) {
			formData.append('allowComments', data.allowComments.toString());
		}

		return await client.post('v1/bookmarks/file', formData, {});
	},

	/**
	 * Create a new bookmark from browser extension tabs upload
	 */
	async createFromTabs(data: BookmarkTabsEntry) {
		return await client.post('v1/bookmarks/tabs', data, {});
	},

	/**
	 * Create a new bookmark from manual data
	 */
	async createFromEntry(data: ManualBookmarkEntry) {
		let payload = {} as ManualBookmarkEntryPayload;

		data.tags
			? (payload = {...data, tags: data.tags.join(',')})
			: (payload = data as unknown as ManualBookmarkEntryPayload);

		if (data.cover) {
			payload = {...payload, coverType: 'default'};
		}

		return await client.post('v1/bookmarks/manual', payload, {});
	},

	/**
	 * Re-parse the data of a bookmark
	 *
	 * @param {String} id - The ID of the bookmark
	 */
	async reParse(id: string) {
		return await client.post('v1/bookmarks/:id/re-parse', undefined, {id});
	},

	/**
	 * Toggle the star status of a bookmark
	 *
	 * @param {String} id - The ID of the bookmark
	 */
	async toggleStar(id: string) {
		return await client.post('v1/bookmarks/:id/star', undefined, {id});
	},

	/**
	 * Batch toggle the star status of bookmarks
	 *
	 * @param {String[]} bookmarks - The IDs of the bookmarks
	 * @param {Boolean} star - Whether to star or unstar the bookmarks
	 */
	async batchToggleStar(bookmarks: string[], value: boolean) {
		return await client.post('v1/bookmarks/batch-star', {bookmarks, value}, {});
	},

	/**
	 * Batch update bookmarks
	 *
	 * @param {UpdateBookmarkEntry} data - The data to update the bookmarks with
	 */
	async batchUpdate(data: UpdateBookmarksEntry) {
		return await client.patch('v1/bookmarks/batch-edit', data, {});
	},

	/**
	 * Update a bookmark by its ID
	 *
	 * @param {String} id - The ID of the bookmark
	 * @param {UpdateBookmarkEntry} data - The data to update the bookmark with
	 */
	async update(id: string, data: UpdateBookmarkEntry) {
		return await client.patch('v1/bookmarks/:id', data, {id});
	},

	/**
	 * Update a bookmark's cover image
	 *
	 * @param {String} id - The ID of the bookmark
	 * @param {Object} data - The data to update the cover with
	 */
	async updateCover(
		id: string,
		{
			file,
			cover,
			type,
		}:
			| {
					file?: never;
					cover: string;
					type: Extract<ImageUploadType, 'default'>;
			  }
			| {
					file: File;
					cover?: never;
					type: Extract<ImageUploadType, 'custom'>;
			  },
	) {
		const formData = new FormData();
		formData.append('type', type);

		if (type === 'custom' && file) {
			formData.append('file', file);
		}

		if (type === 'default' && cover) {
			formData.append('cover', cover);
		}

		return await client.patch('v1/bookmarks/:id/cover', formData, {id});
	},

	/**
	 * Permanently delete a bookmark by its ID
	 *
	 * Use with caution, this action is irreversible
	 * To trash a bookmark, use the `update` method and set the status to `trashed`
	 *
	 * @param {String} id - The ID of the bookmark
	 */
	async delete(id: string) {
		return await client.delete('v1/bookmarks/:id', undefined, {id});
	},
}));
