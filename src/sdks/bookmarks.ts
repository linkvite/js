import { sdk } from "./create";
import type { BookmarkPagination } from "../types";

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
        return await client.get("v1/bookmarks/:id", { id });
    },

    /**
     * Get all the user's bookmarks
     */
    async getAll(p: BookmarkPagination = {}) {
        return await client.get('v1/bookmarks', p);
    },

    /**
     * Get all the bookmarks in a collection
     * 
     * @param {String} id - The ID of the collection
     */
    async getFromCollection(id: string) {
        return await client.get(`v1/bookmarks/from-collection/:id`, { id });
    },

    /**
     * Check if a bookmark exists
     * 
     * @param {String} url - The URL of the bookmark
     */
    async exists(url: string) {
        return await client.post('v1/bookmarks/exists', { url }, {});
    },
}));