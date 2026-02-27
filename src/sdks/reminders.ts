import {sdk} from './create';
import type {CreateReminderEntry, UpdateReminderEntry} from '../types';

/**
 * Reminders SDK client
 * @public
 */
export const reminders = sdk(client => ({
	/**
	 * Get all reminders for the current user
	 */
	async getAll(p: {q?: string; page?: number; limit?: number} = {}) {
		return await client.get('v1/reminders', p);
	},

	/**
	 * Get a single reminder by ID
	 *
	 * @param {String} id - The ID of the reminder
	 */
	async get(id: string) {
		return await client.get('v1/reminders/:id', {id});
	},

	/**
	 * Create a new reminder
	 *
	 * @param {CreateReminderEntry} data - The reminder data
	 */
	async create(data: CreateReminderEntry) {
		return await client.post('v1/reminders', data, {});
	},

	/**
	 * Update a reminder
	 *
	 * @param {String} id - The ID of the reminder
	 * @param {UpdateReminderEntry} data - The data to update
	 */
	async update(id: string, data: UpdateReminderEntry) {
		return await client.patch('v1/reminders/:id', data, {id});
	},

	/**
	 * Delete a reminder
	 *
	 * @param {String} id - The ID of the reminder
	 */
	async delete(id: string) {
		return await client.delete('v1/reminders/:id', undefined, {id});
	},

	/**
	 * Batch update the completed status of multiple reminders
	 *
	 * @param {String[]} reminderIds - The IDs of the reminders
	 * @param {Boolean} completed - Whether to mark as completed or not
	 */
	async batchUpdate(reminderIds: string[], completed: boolean) {
		return await client.post(
			'v1/reminders/batch-edit',
			{reminders: reminderIds, completed},
			{},
		);
	},

	/**
	 * Delete multiple reminders at once
	 *
	 * @param {String[]} reminderIds - The IDs of the reminders to delete
	 */
	async batchDelete(reminderIds: string[]) {
		return await client.post(
			'v1/reminders/batch-delete',
			{reminders: reminderIds},
			{},
		);
	},

	/**
	 * Delete all reminders
	 */
	async clear() {
		return await client.post('v1/reminders/clear', undefined, {});
	},
}));
