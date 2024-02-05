import type { Endpoint } from "..";
import type { Pagination, PaginationRequest, UserProfile } from ".";

export type BookmarkPath = "all" | "starred" | "trashed";
export type BookmarkStatus = "active" | "trashed" | "deleted";
export type BookmarkRole = "owner" | "admin" | "moderator" | "viewer";
export type BookmarkType = "image"
    | "video"
    | "audio"
    | "music"
    | "article"
    | "application"
    | "website"

export type BookmarkMimeType = "text/html"
    | "text/plain"
    | "image/jpg"
    | "image/jpeg"
    | "image/png"
    | "image/gif"
    | "image/webp"
    | "image/svg+xml"
    | "image/bmp"
    | "audio/mpeg"
    | "audio/wav"
    | "audio/ogg"
    | "audio/x-m4a"
    | "audio/mp4"
    | "video/mp4"
    | "video/webm"
    | "application/pdf"
    | "application/zip" // no preview
    | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // no preview
    | "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // no preview
    | "application/vnd.openxmlformats-officedocument.presentationml.presentation" // no preview

export type BookmarkPagination = PaginationRequest & {
    sort?: string;
    types?: string;
    status?: BookmarkStatus;
}

export type ImportItem = {
    url: string;
    title: string;
    description: string;
    tags: string;
    folder: string;
    cover: string;
    linkAction: "unique" | "merge";
}

export type Bookmark = {
    id: string;
    info: {
        name: string;
        slug: string;
        collection: string;
        description?: string;
        status: BookmarkStatus;
    };
    tags: string[];
    assets: {
        icon: string;
        thumbnail: string;
        html: string;
    };
    config: {
        isBroken: boolean;
        allowComments: boolean;
    };
    meta: {
        url: string;
        key: string;
        size: number;
        views: number;
        type: BookmarkType;
        mimeType: BookmarkMimeType;
    };
    archive: {
        key: string;
    }
    createdAt: Date | number;
    updatedAt: Date | number;
    updatedBy: string;
    lastOpened: Date | number;
    owner: string;

    isLiked?: boolean;
    role?: BookmarkRole;
    ownerProfile?: UserProfile;
}

export type BookmarkArticle = {
    url: string;
    text: string;
    title: string;
    author: string;
    content: string;
}

export type BookmarkEndpoints =
    Endpoint<'GET', 'v1/bookmarks', {
        data: {
            bookmarks: Bookmark[];
            pagination: Pagination;
        }
    }>
    | Endpoint<'GET', `v1/bookmarks/:id`, { data: Bookmark; }>
    | Endpoint<'GET', `v1/bookmarks/from-collection/:id`, {
        data: {
            bookmarks: Bookmark[];
            pagination: Pagination;
            collection: string;
        }
    }>
    | Endpoint<'GET', `v1/bookmarks/:id/article`, { data: BookmarkArticle; }>
    | Endpoint<'POST', 'v1/bookmarks/', { data: Bookmark; }, {
        url: string;
        collection?: string;
    }>
    | Endpoint<'POST', 'v1/bookmarks/exists', { data: boolean; }, { url: string; }>