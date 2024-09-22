import type {SubProfile} from './user';
import type {Empty, Endpoint} from '..';

export type RoleLevel = 'admin' | 'viewer';
export type CollectionStatus = 'active' | 'inactive';

export type Collection = {
	/**
	 * The public ID of the collection
	 *
	 * Always prefixed with `coll_`
	 */
	id: string;

	/**
	 * The ID of the user who created the collection
	 */
	user_id: string;

	/**
	 * The name of the collection
	 */
	name: string;

	/**
	 * A description of the collection
	 *
	 * This can be an empty string
	 */
	description: string;

	/**
	 * The status of the collection
	 *
	 * - `active` - The collection is active
	 * - `inactive` - The collection is inactive, either waiting to be deleted or suspended
	 */
	status: CollectionStatus;

	/**
	 * Whether the collection is private
	 *
	 * If the collection is private, only members can view it
	 *
	 * If the collection is public, anyone can view via the user's profile
	 */
	is_private: boolean;

	/**
	 * If the collection is public, whether anyone can join
	 *
	 * Any user can join a public collection if this is true
	 */
	allow_public_join: boolean;

	/**
	 * The icon of the collection
	 *
	 * This can be an emoji or a URL to an image
	 */
	icon: string;

	/**
	 * A cover image for the collection
	 */
	thumbnail: string;

	/**
	 * The amount of times the collection has been viewed
	 */
	views: number;

	/**
	 * The ID of parent collection if this is a sub-collection (nested collection)
	 *
	 * If the collection is a root collection, this will be `null`
	 */
	parent_id: string | null;

	/**
	 * The ID of the user who last updated the collection
	 */
	updated_by_id: string | null;

	/**
	 * The date the collection was created
	 */
	created_at: Date;

	/**
	 * The date the collection was last updated
	 */
	updated_at: Date;

	/**
	 * The date the collection was last opened
	 */
	last_opened_at: Date | null;

	/**
	 * The role of the user who is viewing the collection
	 *
	 * Note that owners will always have a role of `admin`
	 *
	 * To check if the user is the owner, compare the user's id to `collection.user_id`
	 */
	role: RoleLevel;

	/**
	 * The ID of the user who owns the collection
	 */
	owner_id: string;

	/**
	 * The name of the user who owns the collection
	 */
	owner_name: string;

	/**
	 * The username of the user who owns the collection
	 */
	owner_username: string;

	/**
	 * The display picture of the user who owns the collection
	 */
	owner_avatar: string;

	/**
	 * The number of bookmarks in the collection
	 *
	 * This can be unstable and return 0
	 */
	bookmarks_count: number;
};

// TODO: allow file uploads
export type UpdateCollectionEntry = {
	name?: string;
	description?: string;
	is_private?: boolean;
	allow_public_join?: boolean;
	icon?: string;
	cover?: string;
};

export type CreateCollectionEntry = {
	name: string;
	description?: string;
	parent?: string;
};

export type InviteToCollectionEntry = {
	identifier: string;
	role: RoleLevel;
};

export type EditUserRoleEntry =
	| {
			user_id: string;
			remove: boolean;
	  }
	| {
			user_id: string;
			role: RoleLevel;
	  };

export type MoveOrRemoveCollectionEntry =
	| {
			parent: string;
	  }
	| {
			remove: boolean;
	  };

export type CollectionOnlinePresence = {
	total_members: number;
	online_clients: number;
	online_members: number;
};

export type CollectionEndpoints =
	| Endpoint<'GET', 'v1/collections/:id/presence', CollectionOnlinePresence>
	| Endpoint<'GET', 'v1/collections', Collection[]>
	| Endpoint<'GET', 'v1/collections/all', Collection[]>
	| Endpoint<'GET', 'v1/collections/:id', Collection>
	| Endpoint<
			'GET',
			'v1/collections/:id/members',
			{
				role: RoleLevel;
				owner_id: string;
				members: SubProfile[];
			}
	  >
	| Endpoint<'POST', 'v1/collections', Collection, CreateCollectionEntry>
	| Endpoint<
			'POST',
			'v1/collections/:id/send-invite',
			Empty,
			InviteToCollectionEntry
	  >
	| Endpoint<'POST', 'v1/collections/:id/leave', Empty>
	| Endpoint<
			'POST',
			'v1/collections/:id/move',
			Empty,
			MoveOrRemoveCollectionEntry
	  >
	| Endpoint<'PATCH', 'v1/collections/:id', Collection, UpdateCollectionEntry>
	| Endpoint<'PATCH', 'v1/collections/:id/edit-role', Empty, EditUserRoleEntry>
	| Endpoint<'DELETE', 'v1/collections/:id', Empty>;
