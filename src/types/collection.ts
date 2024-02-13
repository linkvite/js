import type { UserProfile } from "./user";

export type CollectionRole = 'admin' | 'moderator' | 'viewer';
export type Collection = {
    id: string;
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
    owner: string;
    parent: string;
    updatedBy: string;
    createdAt: Date | number;
    updatedAt: Date | number;
    bookmarkCount: number;
    isLiked: boolean;
    role: CollectionRole;

    ownerProfile?: UserProfile;
}