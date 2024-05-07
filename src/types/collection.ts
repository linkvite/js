import type {UserProfile} from './user';
import type {Empty, Endpoint, OBJECT_ID} from '..';

export type RoleLevel = 'admin' | 'viewer';
export type CollectionStatus = 'active' | 'inactive';

export type Collection = {
	id: OBJECT_ID;
	info: {
		/**
		 * The name of the collection (aka title)
		 */
		name: string;

		/**
		 * A unique slug identifier for the collection
		 */
		slug: string;

		/**
		 * Status of the collection
		 */
		status: CollectionStatus;

		/**
		 * What the collection is about
		 */
		description?: string;
	};
	assets: {
		/**
		 * The icon of the collection
		 *
		 * Also known as favicon
		 */
		icon: string;

		/**
		 * The thumbnail of the collection
		 *
		 * This is the cover image of the collection
		 */
		thumbnail: string;
	};
	config: {
		/**
		 * Whether the collection is private or not
		 *
		 * If it's private, only the owner and the members can view it
		 */
		isPrivate: boolean;

		/**
		 * Whether the collection allows public join
		 *
		 * If it's true, anyone with can join the collection
		 *
		 * Only available if the collection is not private
		 */
		allowPublicJoin: boolean;
	};
	meta: {
		/**
		 * Number of times the collection has been viewed
		 *
		 * Updated whenever a call is made to the `/collections/:id` endpoint
		 */
		views: number;
	};

	/**
	 * The time the collection was created
	 */
	createdAt: Date;

	/**
	 * The last time the collection was updated
	 */
	updatedAt: Date;

	/**
	 * The last time the collection was opened
	 *
	 * Updated whenever a call is made to the `/collections/:id` endpoint
	 */
	lastOpened: Date;

	/**
	 * The ID of the user who created the collection
	 */
	owner: OBJECT_ID;

	/**
	 * The ID of the parent collection (if it's a sub-collection)
	 */
	parent: OBJECT_ID;

	/**
	 * The ID of the user who last updated the collection
	 */
	updatedBy: OBJECT_ID;

	/**
	 * Number of bookmarks in the collection (defaults to 0 if not present)
	 */
	bookmarkCount: number;

	/**
	 * Whether the collection has been liked by whoever fetches it
	 */
	isLiked: boolean;

	/**
	 * Role of the user who fetched the collection
	 */
	role: RoleLevel;

	/**
	 * (Optional) Profile of the user who created the collection
	 */
	ownerProfile?: UserProfile;
};

export type UpdateCollectionEntry = {
	name?: string;
	description?: string;
	isPrivate?: boolean;
	allowPublicJoin?: boolean;
	icon?: string;
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

export type EditUserRoleEntry = {
	userID: string;
	role: RoleLevel;
	remove?: boolean;
};

export type MoveOrRemoveCollectionEntry =
	| {
			parent: string;
	  }
	| {
			remove: boolean;
	  };

export type CollectionEndpoints =
	| Endpoint<'GET', 'v1/collections', {data: Collection[]}>
	| Endpoint<'GET', 'v1/collections/all', {data: Collection[]}>
	| Endpoint<'GET', 'v1/collections/:id', {data: Collection}>
	| Endpoint<
			'GET',
			'v1/collections/:id/members',
			{
				data: {
					owner: UserProfile;
					admins: UserProfile[];
					viewers: UserProfile[];
				};
			}
	  >
	| Endpoint<
			'POST',
			'v1/collections',
			{data: Collection},
			CreateCollectionEntry
	  >
	| Endpoint<'POST', 'v1/collections/:id/like', {data: boolean}>
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
	| Endpoint<
			'PATCH',
			'v1/collections/:id',
			{data: Collection},
			UpdateCollectionEntry
	  >
	| Endpoint<'PATCH', 'v1/collections/:id/cover', {data: Collection}, FormData>
	| Endpoint<'PATCH', 'v1/collections/:id/edit-role', Empty, EditUserRoleEntry>
	| Endpoint<'DELETE', 'v1/collections/:id', Empty>;
