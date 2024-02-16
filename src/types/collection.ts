import type { UserProfile } from './user';
import type { Empty, Endpoint, OBJECT_ID } from '..';

export type CollectionRole = 'admin' | 'moderator' | 'viewer';
export type Collection = {
    id: OBJECT_ID;
    info: {
        name: string;
        slug: string;
        status: string;
        description?: string;
    },
    assets: {
        icon: string;
        thumbnail: string;
    },
    links: {
        url: string;
        inviteLink?: string;
    },
    config: {
        isPrivate: boolean;
        allowPublicJoin: boolean;
    };
    meta: {
        views: number;
    }
    createdAt: Date;
    updatedAt: Date;
    owner: OBJECT_ID;
    parent: OBJECT_ID;
    updatedBy: OBJECT_ID;
    bookmarkCount: number;
    isLiked: boolean;
    role: CollectionRole;

    ownerProfile?: UserProfile;
}

export type UpdateCollectionEntry = {
    name?: string;
    description?: string;
    isPrivate?: boolean;
    allowPublicJoin?: boolean;
    icon?: string;
}

export type CreateCollectionEntry = {
    name: string;
    description?: string;
    parent?: string;
}

export type InviteToCollectionEntry = {
    identifier: string;
    role: CollectionRole;
}

export type EditUserRoleEntry = {
    userID: string;
    role: CollectionRole;
    remove?: boolean
}

export type MoveOrRemoveCollectionEntry = {
    parent: string
} | {
    remove: boolean
}

export type CollectionEndpoints =
    Endpoint<'GET', 'v1/collections', { data: Collection[] }>
    | Endpoint<'GET', 'v1/collections/all', { data: Collection[] }>
    | Endpoint<'GET', 'v1/collections/:id', { data: Collection }>
    | Endpoint<'GET', 'v1/collections/:id/members', {
        data: {
            owner: UserProfile,
            admins: UserProfile[],
            moderators: UserProfile[],
            viewers: UserProfile[],
        }
    }>
    | Endpoint<'POST', 'v1/collections', { data: Collection }, CreateCollectionEntry>
    | Endpoint<'POST', 'v1/collections/:id/like', Empty>
    | Endpoint<'POST', 'v1/collections/:id/send-invite', Empty, InviteToCollectionEntry>
    | Endpoint<'POST', 'v1/collections/:id/leave', Empty>
    | Endpoint<'POST', 'v1/collections/:id/move', Empty, MoveOrRemoveCollectionEntry>
    | Endpoint<'PATCH', 'v1/collections/:id', { data: Collection }, UpdateCollectionEntry>
    | Endpoint<'PATCH', 'v1/collections/:id/cover', { data: Collection; }, FormData>
    | Endpoint<'PATCH', 'v1/collections/:id/edit-role', Empty, EditUserRoleEntry>
    | Endpoint<'DELETE', 'v1/collections/:id', Empty>