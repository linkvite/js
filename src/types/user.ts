import {type Empty, type Pagination} from './generic';
import type {RoleLevel} from './collection';
import {type Endpoint} from '../rest/endpoints';
import type {BookmarkMimeType, BookmarkStatus} from './bookmark';

export type UserAccountType = 'pro' | 'free' | 'enterprise';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export type SubProfile = {
	id: string;
	name: string;
	username: string;
	avatar: string;
	role: RoleLevel | null;
};

export type PublicProfile = {
	id: string;
	name: string;
	username: string;
	avatar: string;
	account_type: AccountType;
	status: UserStatus;
	verified: boolean;
	created_at: Date;
	private_account: boolean;
	role: RoleLevel | null;
};

export type BookmarkStorage = {
	id: string;
	title: string;
	description: string;
	thumbnail: string;
	icon: string;
	url: string;
	created_at: Date;
	updated_at: Date;
	user_id: string;
	collection_id: string | null;
	collection_name: string | null;
	size: number;
	mime_type_id: BookmarkMimeType;
	status: BookmarkStatus;
};

export type AccountType = 'free' | 'pro' | 'enterprise';

export type User = {
	/**
	 * The public ID of the user
	 *
	 * Always prefixed with `usr_`
	 */
	id: string;

	/**
	 * The name of the user
	 */
	name: string;

	/**
	 * The email address of the user
	 */
	email: string;

	/**
	 * The display picture of the user
	 */
	avatar: string;

	/**
	 * The username of the user
	 */
	username: string;

	/**
	 * If the user has been verified
	 *
	 * This is for internal users only
	 */
	verified: boolean;

	/**
	 * If the user has verified their email
	 */
	email_verified: boolean;

	/**
	 * The folder name of the user
	 *
	 * This is used for the folder's page
	 */
	folder_name: string;

	/**
	 * If the user has a private account
	 */
	private_account: boolean;

	/**
	 * The account type of the user
	 *
	 * - `free` for free accounts
	 * - `pro` for pro subscribers
	 * - `enterprise` for enterprise users
	 */
	account_type: AccountType;

	/**
	 * The status of the user
	 */
	status: UserStatus;

	/**
	 * The date the user was last updated
	 */
	updated_at: Date;

	/**
	 * The date the user joined Linkvite
	 */
	created_at: Date;

	/**
	 * The date the user last logged in
	 */
	last_login_at: Date | null;

	/**
	 * If the user has enabled push notifications
	 */
	push_enabled: boolean;

	/**
	 * If the user has enabled email notifications
	 */
	email_enabled: boolean;

	/**
	 * If the user has enabled in-app notifications
	 */
	in_app_enabled: boolean;

	/**
	 * If the user allows invites from everyone
	 */
	allow_invites_everyone: boolean;

	/**
	 * If the user allows invites from nobody
	 */
	allow_invites_nobody: boolean;
};

export type UserStorage = {
	used: number;
	total: number;
};

// TODO: allow file uploads
export type UpdateUserEntry = {
	name?: string;
	email?: string;
	username?: string;
	folder_name?: string;
	private_account?: boolean;
	avatar?: string;
};

export type UpdateSettingsEntry = {
	push_enabled?: boolean;
	email_enabled?: boolean;
	in_app_enabled?: boolean;
};

export type UserEndpoints =
	| Endpoint<'GET', 'v1/user', User>
	| Endpoint<'GET', 'v1/user/storage', UserStorage>
	| Endpoint<
			'GET',
			'v1/user/storage/detailed',
			{bookmarks: BookmarkStorage[]; pagination: Pagination}
	  >
	| Endpoint<'PATCH', 'v1/user', User, UpdateUserEntry>
	| Endpoint<'PATCH', 'v1/user/settings', User, UpdateSettingsEntry>
	| Endpoint<'DELETE', 'v1/user/trash', Empty>;
