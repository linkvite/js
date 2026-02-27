import type {Endpoint} from '../rest';
import type {Empty, Pagination} from './generic';

export type Reminder = {
	id: string;
	user_id: string;
	bookmark_id: string;
	remind_at: Date;
	note: string;
	completed: boolean;
	created_at: Date;
	updated_at: Date;
	bookmark_title: string;
	bookmark_url: string;
	bookmark_thumbnail: string;
};

export type CreateReminderEntry = {
	bookmark_id: string;
	remind_at: Date;
	note?: string;
};

export type UpdateReminderEntry = {
	remind_at?: Date;
	note?: string;
	completed?: boolean;
};

export type ReminderEndpoints =
	| Endpoint<
			'GET',
			'v1/reminders',
			{reminders: Reminder[]; pagination: Pagination}
	  >
	| Endpoint<'GET', 'v1/reminders/:id', Reminder>
	| Endpoint<'POST', 'v1/reminders', Reminder, CreateReminderEntry>
	| Endpoint<
			'POST',
			'v1/reminders/batch-edit',
			Empty,
			{reminders: string[]; completed?: boolean}
	  >
	| Endpoint<'POST', 'v1/reminders/batch-delete', Empty, {reminders: string[]}>
	| Endpoint<'POST', 'v1/reminders/clear', Empty>
	| Endpoint<'PATCH', 'v1/reminders/:id', Reminder, UpdateReminderEntry>
	| Endpoint<'DELETE', 'v1/reminders/:id', Empty>;
