import type { Endpoint } from "../rest";
import type { UserProfile } from "./user";
import type {
    Empty,
    Pagination,
    PaginationRequest,
} from "./generic";

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

export type ParsedLinkData = {
    title: string;
    description: string;
    name: string;
    url: string;
    type: string;
    image: string;
    favicon: string;
    keywords: string;
}

type BookmarkEntry = {
    tags?: string;
    collection?: string;
    allowComments?: boolean;
}

export type ManualBookmarkEntry = BookmarkEntry & {
    url: string;
    title: string;
    cover?: string;
    starred?: boolean;
    description?: string;
    coverType?: "default";
}

export type BookmarkFileEntry = BookmarkEntry & {
    file: File;
    starred?: boolean;
}

export type UpdateBookmarksEntry = BookmarkEntry & {
    bookmarks: string[];
    type?: BookmarkType;
    status?: BookmarkStatus;
}

export type UpdateBookmarkEntry = BookmarkEntry & {
    name?: string;
    url?: string;
    status?: BookmarkStatus;
    description?: string;
    favicon?: string;
    type?: BookmarkType;
}

export type BookmarkEndpoints =
    Endpoint<'GET', 'v1/bookmarks/:id', { data: Bookmark; }>
    | Endpoint<'GET', 'v1/bookmarks/:id/article', { data: BookmarkArticle; }>
    | Endpoint<'GET', 'v1/bookmarks', {
        data: {
            bookmarks: Bookmark[];
            pagination: Pagination;
        }
    }>
    | Endpoint<'POST', 'v1/bookmarks/exists', boolean, { url: string; }>
    | Endpoint<'GET', 'v1/bookmarks/from-collection/:id', {
        data: {
            bookmarks: Bookmark[];
            pagination: Pagination;
            collection: string;
        }
    }>
    | Endpoint<'GET', 'v1/bookmarks/:id/archive', { data: string }>
    | Endpoint<'POST', 'v1/bookmarks/:id/archive', string>
    | Endpoint<'POST', 'v1/bookmarks', { data: Bookmark; }, {
        url: string;
        collection: string | null;
    }>
    | Endpoint<'POST',
        'v1/bookmarks/from-parsed-data',
        { data: Bookmark; },
        {
            data: ParsedLinkData;
            collection: string | null;
        }>
    | Endpoint<'POST', 'v1/bookmarks/manual', { data: Bookmark; }, ManualBookmarkEntry>
    | Endpoint<'POST', 'v1/bookmarks/file', { data: Bookmark[]; }, FormData>
    | Endpoint<'POST', 'v1/bookmarks/:id/re-parse', { data: ParsedLinkData; }>
    | Endpoint<'POST', 'v1/bookmarks/:id/like', Empty>
    | Endpoint<'POST', 'v1/bookmarks/batch-like', Empty, {
        value: boolean;
        bookmarks: string[];
    }>
    | Endpoint<'PATCH', 'v1/bookmarks/batch-edit', Empty, UpdateBookmarksEntry>
    | Endpoint<'PATCH', 'v1/bookmarks/:id', { data: Bookmark; }, UpdateBookmarkEntry>
    | Endpoint<'PATCH', 'v1/bookmarks/:id/cover', { data: Bookmark; }, FormData>
    | Endpoint<'DELETE', 'v1/bookmarks/:id', Empty>