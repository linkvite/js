import {type Empty, type OBJECT_ID} from './generic';
import {type Endpoint} from '../rest/endpoints';

export type UserAccountType = 'pro' | 'free' | 'enterprise';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export type UserProfile = Omit<
	User,
	'email' | 'folderName' | 'emailVerified' | 'updatedAt' | 'lastLogin'
> & {
	isLiked?: boolean;
};

export type User = {
	id: OBJECT_ID;
	name: string;
	email: string;
	username: string;
	avatar: string;
	emailVerified: boolean;
	accountType: UserAccountType;
	status: UserStatus;
	verified: boolean;
	folderName: string;
	privateAccount: boolean;
	lastLogin: string;
	createdAt: string;
	updatedAt: string;
};

export type UserStorage = {
	used: number;
	total: number;
};

export type Notification = {
	value: string;
	enabled: boolean;
};

export type Notifications = {
	email: Notification;
	push: Notification;
	inApp: Notification;
};

export type AllowInvites = {
	nobody: boolean;
	everyone: boolean;
	allowList: OBJECT_ID[];
};

export type UserSettings = {
	allowInvites: AllowInvites;
	notifications: Notifications;
	autoArchiveBookmarks: boolean;
};

export type UpdateUserEntry = {
	name?: string;
	email?: string;
	username?: string;
	folderName?: string;
	privateAccount?: boolean;
};

export type UserEndpoints =
	| Endpoint<'GET', 'v1/user', {data: User}>
	| Endpoint<'GET', 'v1/user/storage', {data: UserStorage}>
	| Endpoint<'PATCH', 'v1/user', {data: User}, UpdateUserEntry>
	| Endpoint<'PATCH', 'v1/user/avatar', {data: User}, FormData>
	| Endpoint<'GET', 'v1/user/settings', {data: UserSettings}>
	| Endpoint<
			'PATCH',
			'v1/user/settings',
			{data: UserSettings},
			Partial<UserSettings>
	  >
	| Endpoint<'DELETE', 'v1/user/trash', Empty>;
