import type {Endpoint} from '../rest';
import type {Empty} from './generic';
import type {RoleLevel} from './collection';

export type Invite = {
	id: string;
	collection_id: string;
	inviter_id: string;
	invitee_id: string;
	role: RoleLevel;
	status: string;
	created_at: Date;
	updated_at: Date;
	collection_name: string;
	collection_thumbnail: string;
	inviter_name: string;
	inviter_username: string;
	inviter_avatar: string;
};

export type InviteEndpoints =
	| Endpoint<'GET', 'v1/invites', Invite[]>
	| Endpoint<'GET', 'v1/invites/:id', Invite>
	| Endpoint<'POST', 'v1/invites/:id/accept', Empty>
	| Endpoint<'POST', 'v1/invites/:id/decline', Empty>
	| Endpoint<'POST', 'v1/invites/batch-accept', Empty, {invites: string[]}>
	| Endpoint<'POST', 'v1/invites/batch-decline', Empty, {invites: string[]}>
	| Endpoint<'POST', 'v1/invites/decline/all', Empty>;
