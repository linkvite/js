import { sdk } from "./create";

/**
 * Users SDK client
 * @public
 */
export const user = sdk(client => ({
    /**
     * Get the current user
     */
    async get() {
        const user = await client.get("v1/user", {});
        return user;
    },

    /**
     * Get the current user's storage usage.
     */
    async getStorageUsage() {
        const usage = await client.get("v1/user/storage", {});
        return usage;
    }
}));