import { type Empty, type ImageUploadType, type OBJECT_ID } from ".";
import { type Endpoint } from "..";

export type UserAccountType = "pro" | "free" | "enterprise";
export type UserStatus = "active" | "inactive" | "suspended";

export type UserProfile = Omit<User, "email" | "folderName" | "emailVerified" | "updatedAt" | "lastLogin"> & {
    isLiked?: boolean;
};

export interface User {
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
}

export interface UserStorage {
    used: number;
    total: number;
}

interface Notification {
    value: string;
    enabled: boolean;
}

interface Notifications {
    email: Notification;
    push: Notification;
    inApp: Notification;
}

interface AllowInvites {
    nobody: boolean;
    everyone: boolean;
    allowList: OBJECT_ID[];
}

export interface UserSettings {
    allowInvites: AllowInvites;
    notifications: Notifications;
    autoArchiveBookmarks: boolean;
}

export type UserEndpoints =
    Endpoint<'GET', 'v1/user', { data: User; }>
    | Endpoint<'GET', 'v1/user/storage', { data: UserStorage; }>
    | Endpoint<'GET', 'v1/user/settings', { data: UserSettings; }>
    | Endpoint<'PATCH', 'v1/user', { data: User; }, {
        name?: string;
        email?: string;
        username?: string;
        folderName?: string;
        privateAccount?: boolean;
    }>
    | Endpoint<'PATCH', 'v1/user/avatar', { data: User; }, {
        file?: File;
        avatar?: string;
        type: ImageUploadType;
    }>
    | Endpoint<'POST', 'v1/user/change-password', Empty, {
        oldPassword: string;
        newPassword: string;
    }>
    | Endpoint<'PATCH', 'v1/user/settings', { data: UserSettings; }, Partial<UserSettings>>
    | Endpoint<'DELETE', 'v1/user/trash', Empty>