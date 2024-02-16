import type { OBJECT_ID } from '.';
import type { UserProfile } from './user';
import type { BookmarkRole } from './bookmark';

export type CommentStatus = 'active' | 'hidden' | 'deleted';

export type Comment = {
    id: OBJECT_ID;
    status: CommentStatus;
    content: string;
    owner: OBJECT_ID;
    parent: OBJECT_ID;
    bookmark: OBJECT_ID;
    createdAt: Date;
    updatedAt: Date;
    isLiked: boolean;
    role: BookmarkRole;
    likesCount: number;
    repliesCount: number;

    ownerProfile?: UserProfile;
}

