import type { UserProfile } from "./user";
import type { BookmarkRole } from "./bookmark";

export type Comment = {
    id: string;
    owner: string;
    status: string;
    parent: string;
    content: string;
    bookmark: string;
    createdAt: Date | number;
    updatedAt: Date | number;

    role?: BookmarkRole;
    isLiked?: boolean;
    likesCount?: number;
    repliesCount?: number;
    ownerProfile?: UserProfile;
}

