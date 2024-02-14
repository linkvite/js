import { sdk } from "./create";
import type {
    CreateCollectionEntry,
    EditUserRoleEntry,
    ImageUploadType,
    InviteToCollectionEntry,
    MoveOrRemoveCollectionEntry,
    UpdateCollectionEntry
} from "../types";

/**
 * Collections SDK client
 * @public
 */
export const collections = sdk(client => ({
    /**
     * Get all the user's collections
     */
    async getAll() {
        return await client.get('v1/collections/all', {});
    },

    /**
     * Get a collection by its ID
     * 
     * @param {String} id - The ID of the collection
     */
    async get(id: string) {
        return await client.get('v1/collections/:id', { id });
    },

    /**
     * Get the members of a collection
     * 
     * @param {String} id - The ID of the collection
     */
    async getMembers(id: string) {
        return await client.get('v1/collections/:id/members', { id });
    },

    /**
     * Create a new collection
     * 
     * @param {CreateCollectionEntry} data - Contains the name, parent or description of the collection
     */
    async create(data: CreateCollectionEntry) {
        return await client.post('v1/collections', data, {});
    },

    /**
    * Toggle the liking a collection
    * 
    * @param {String} id - The ID of the collection
    */
    async toggleLike(id: string) {
        return await client.post('v1/collections/:id/like', undefined, { id });
    },

    /**
     * Invite a user to a collection
     * 
     * @param {String} id - The ID of the collection
     * @param {InviteToCollectionEntry} data - This contains the identifier and the role
     */
    async invite(id: string, { identifier, role }: InviteToCollectionEntry) {
        return await client.post('v1/collections/:id/send-invite', { identifier, role }, { id });
    },

    /**
     * Leave a collection
     * 
     * @param {String} id - The ID of the collection
     */
    async leave(id: string) {
        return await client.post('v1/collections/:id/leave', undefined, { id });
    },

    /**
     * Move a collection or remove it from its parent
     * 
     * @param {String} id - The ID of the collection
     * @param {MoveOrRemoveCollectionEntry} data - Whether to remove the collection from its parent or move it
     */
    async move(id: string, data: MoveOrRemoveCollectionEntry) {
        return await client.post('v1/collections/:id/move', data, { id });
    },

    /**
     * Update a collection by its ID
     * 
     * @param {String} id - The ID of the collection
     * @param {UpdateCollectionEntry} data - The data to update the collection with
     */
    async update(id: string, data: UpdateCollectionEntry) {
        return await client.patch('v1/collections/:id', data, { id });
    },

    /**
     * Update a collection's cover image
     * 
     * @param {String} id - The ID of the collection
     * @param {Object} data - The data to update the cover with
     */
    async updateCover(id: string, { file, cover, type }: {
        file?: never;
        cover: string;
        type: Extract<ImageUploadType, 'default'>;
    } | {
        file: File;
        cover?: never;
        type: Extract<ImageUploadType, 'custom'>;
    }) {
        const formData = new FormData();
        formData.append('type', type);

        if (type === 'custom' && file) {
            formData.append('file', file);
        }

        if (type === 'default' && cover) {
            formData.append('cover', cover);
        }

        return await client.patch('v1/collections/:id/cover', formData, { id });
    },

    /**
     * Change the role of a user in a collection
     * 
     * Or remove the user from the collection
     * 
     * @param {String} id - The ID of the collection
     * @param {EditUserRoleEntry} data - The data to update the user's role with
     */
    async editRole(id: string, data: EditUserRoleEntry) {
        return await client.patch('v1/collections/:id/edit-role', data, { id });
    },

    /**
     * Delete a collection
     * 
     * @param {String} id - The ID of the collection
     */
    async delete(id: string) {
        return await client.delete('v1/collections/:id', undefined, { id });
    }
}));