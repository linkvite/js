import {sdk} from './create';

/**
 * Invites SDK client
 * @public
 */
export const invites = sdk(client => ({
	/**
	 * Get all pending invites for the current user
	 */
	async getAll() {
		return await client.get('v1/invites', {});
	},

	/**
	 * Get a single invite by ID
	 *
	 * @param {String} id - The ID of the invite
	 */
	async get(id: string) {
		return await client.get('v1/invites/:id', {id});
	},

	/**
	 * Accept an invite
	 *
	 * @param {String} id - The ID of the invite
	 */
	async accept(id: string) {
		return await client.post('v1/invites/:id/accept', undefined, {id});
	},

	/**
	 * Decline an invite
	 *
	 * @param {String} id - The ID of the invite
	 */
	async decline(id: string) {
		return await client.post('v1/invites/:id/decline', undefined, {id});
	},

	/**
	 * Accept multiple invites at once
	 *
	 * @param {String[]} inviteIds - The IDs of the invites to accept
	 */
	async batchAccept(inviteIds: string[]) {
		return await client.post(
			'v1/invites/batch-accept',
			{invites: inviteIds},
			{},
		);
	},

	/**
	 * Decline multiple invites at once
	 *
	 * @param {String[]} inviteIds - The IDs of the invites to decline
	 */
	async batchDecline(inviteIds: string[]) {
		return await client.post(
			'v1/invites/batch-decline',
			{invites: inviteIds},
			{},
		);
	},

	/**
	 * Decline all pending invites
	 */
	async declineAll() {
		return await client.post('v1/invites/decline/all', undefined, {});
	},
}));
