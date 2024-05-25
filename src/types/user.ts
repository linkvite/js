import {type Empty} from './generic';
import type {RoleLevel} from './collection';
import {type Endpoint} from '../rest/endpoints';

export type UserAccountType = 'pro' | 'free' | 'enterprise';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export type SubProfile = {
	id: string;
	name: string;
	username: string;
	avatar: string;
	role: RoleLevel | null;
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

export type UpdateUserEntry = {
	name?: string;
	email?: string;
	username?: string;
	folderName?: string;
	privateAccount?: boolean;
};

export type UserEndpoints =
	| Endpoint<'GET', 'v1/user', User>
	| Endpoint<'GET', 'v1/user/storage', UserStorage>
	| Endpoint<'PATCH', 'v1/user', User, UpdateUserEntry>
	| Endpoint<'PATCH', 'v1/user/avatar', User, FormData>
	| Endpoint<'DELETE', 'v1/user/trash', Empty>;
