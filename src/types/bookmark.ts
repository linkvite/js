import type { Endpoint } from '../rest';
import type { UserProfile } from './user';
import type { Empty, OBJECT_ID, Pagination, PaginationRequest } from './generic';

export type BookmarkPath = 'all' | 'starred' | 'trashed';
export type BookmarkStatus = 'active' | 'trashed' | 'deleted';
export type BookmarkRole = 'owner' | 'admin' | 'moderator' | 'viewer';
export type BookmarkArchiveStatus =
    | 'requested'
    | 'pending'
    | 'success'
    | 'failed';
export type BookmarkType =
    | 'image'
    | 'video'
    | 'audio'
    | 'music'
    | 'article'
    | 'application'
    | 'website';

export type BookmarkMimeType =
    | 'text/html'
    | 'text/plain'
    | 'image/jpg'
    | 'image/jpeg'
    | 'image/png'
    | 'image/gif'
    | 'image/webp'
    | 'image/svg+xml'
    | 'image/bmp'
    | 'audio/mpeg'
    | 'audio/wav'
    | 'audio/ogg'
    | 'audio/x-m4a'
    | 'audio/mp4'
    | 'video/mp4'
    | 'video/webm'
    | 'application/pdf'
    | 'application/zip' // no preview
    | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // no preview
    | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // no preview
    | 'application/vnd.openxmlformats-officedocument.presentationml.presentation'; // no preview

export type BookmarkPagination = PaginationRequest & {
    sort?: string;
    types?: string;
    status?: BookmarkStatus;
};

export type ImportItem = {
    url: string;
    title: string;
    description: string;
    tags: string;
    folder: string;
    cover: string;
    linkAction: 'unique' | 'merge';
};

export type Bookmark = {
    id: OBJECT_ID;
    info: {
        /**
         * The name of the bookmark (aka title)
         */
        name: string;

        /**
         * A unique slug identifier for the bookmark
         */
        slug: string;

        /**
         * The location of the bookmark
         *
         * if it's '0000000000000', it has no location
         */
        collection: OBJECT_ID;

        /**
         * Description of the bookmark
         */
        description?: string;

        /**
         * Status of the bookmark
         */
        status: BookmarkStatus;
    };

    /**
     * An array of tag names, eg: ['tag1', 'tag2']
     *
     * They should be unique.
     */
    tags: string[];

    assets: {
        /**
         * The icon of the bookmark
         * 
         * Also known as favicon
         */
        icon: string;

        /**
         * Cover image of the bookmark
         */
        thumbnail: string;
    };
    config: {
        /**
         * If it's not a file, and we can't access it,
         * then it's a broken bookmark
         *
         * Careful with this, our fetcher might not be able
         * to access it's content
         */
        isBroken: boolean;

        /**
         * Whether commenting is allowed for this bookmark
         */
        allowComments: boolean;
    };
    meta: {
        /**
         * The URL of the bookmark
         */
        url: string;

        /**
         * If it's a file, it has a key used to find the path
         * where it's stored in the cloud
         */
        key: string;

        /**
         * It's a file if the size is greater than 0
         *
         * Size in bytes.
         */
        size: number;

        /**
         * Number of times the bookmark has been opened
         *
         * Updated whenever a call is made to the `/bookmarks/:id` endpoint
         */
        views: number;

        /**
         * Linkvite's own type
         *
         * Used internally for filtering.
         */
        type: BookmarkType;

        /**
         * Generic mime type
         */
        mimeType: BookmarkMimeType;
    };
    archive: {
        /**
         * If it has been archived, it has a size
         *
         * Size in bytes.
         */
        size: number;

        /**
         * Date when it was archived
         */
        createdAt: Date;

        /**
         * Status of the archive
         *
         * Requested: The archive has been requested
         *
         * Pending: No action has been taken yet
         *
         * Success: The archive has been processed
         *
         * Failed: The archive failed
         */
        status: BookmarkArchiveStatus;
    };

    /**
     * Date when the bookmark was created
     */
    createdAt: Date;

    /**
     * Date when the bookmark was last updated
     */
    updatedAt: Date;

    /**
     * Last time the bookmark was opened
     *
     * Updated whenever a call is made to the `/bookmarks/:id` endpoint
     *
     * or anytime the bookmark was updated.
     */
    lastOpened: Date;

    /**
     * The ID of the user who last updated the bookmark
     */
    updatedBy: OBJECT_ID;

    /**
     * The ID of the user who created the bookmark
     */
    owner: OBJECT_ID;

    /**
     * Whether the bookmark has been liked by whoever fetches it
     */
    isLiked: boolean;

    /**
     * Role of the user who fetched the bookmark
     */
    role: BookmarkRole;

    /**
     * (Optional) Profile of the user who created the bookmark
     */
    ownerProfile?: UserProfile;
};

export type BookmarkArticle = {
    url: string;
    text: string;
    title: string;
    author: string;
    content: string;
};

export type ParsedLinkData = {
    title: string;
    description: string;
    name: string;
    url: string;
    type: string;
    image: string;
    favicon: string;
    keywords: string;
};

type BookmarkEntry = {
    tags?: string;
    collection?: string;
    allowComments?: boolean;
};

export type ManualBookmarkEntry = {
    url: string;
    title: string;
    cover?: string;
    tags?: string[];
    starred?: boolean;
    collection?: string;
    description?: string;
    allowComments?: boolean;
};

export type ManualBookmarkEntryPayload = Omit<ManualBookmarkEntry, 'tags'> & {
    tags?: string;
    coverType?: 'default';
};

export type BookmarkFileEntry = BookmarkEntry & {
    file: File;
    starred?: boolean;
};

export type UpdateBookmarksEntry = BookmarkEntry & {
    bookmarks: string[];
    type?: BookmarkType;
    status?: BookmarkStatus;
};

export type UpdateBookmarkEntry = BookmarkEntry & {
    name?: string;
    url?: string;
    status?: BookmarkStatus;
    description?: string;
    favicon?: string;
    type?: BookmarkType;
};

export type BookmarkEndpoints =
    | Endpoint<'GET', 'v1/bookmarks/:id', { data: Bookmark }>
    | Endpoint<'GET', 'v1/bookmarks/:id/article', { data: BookmarkArticle }>
    | Endpoint<
        'GET',
        'v1/bookmarks',
        {
            data: {
                bookmarks: Bookmark[];
                pagination: Pagination;
            };
        }
    >
    | Endpoint<'POST', 'v1/bookmarks/exists', boolean, { url: string }>
    | Endpoint<
        'GET',
        'v1/bookmarks/from-collection/:id',
        {
            data: {
                bookmarks: Bookmark[];
                pagination: Pagination;
                collection: string;
            };
        }
    >
    | Endpoint<'GET', 'v1/bookmarks/:id/archive', { data: string }>
    | Endpoint<'POST', 'v1/bookmarks/:id/archive', string>
    | Endpoint<
        'POST',
        'v1/bookmarks',
        { data: Bookmark },
        {
            url: string;
            collection: string | null;
        }
    >
    | Endpoint<
        'POST',
        'v1/bookmarks/from-parsed-data',
        { data: Bookmark },
        {
            data: ParsedLinkData;
            collection: string | null;
        }
    >
    | Endpoint<
        'POST',
        'v1/bookmarks/manual',
        { data: Bookmark },
        ManualBookmarkEntryPayload
    >
    | Endpoint<'POST', 'v1/bookmarks/file', { data: Bookmark[] }, FormData>
    | Endpoint<'POST', 'v1/bookmarks/:id/re-parse', { data: ParsedLinkData }>
    | Endpoint<'POST', 'v1/bookmarks/:id/like', Empty>
    | Endpoint<
        'POST',
        'v1/bookmarks/batch-like',
        Empty,
        {
            value: boolean;
            bookmarks: string[];
        }
    >
    | Endpoint<'PATCH', 'v1/bookmarks/batch-edit', Empty, UpdateBookmarksEntry>
    | Endpoint<'PATCH', 'v1/bookmarks/:id', { data: Bookmark }, UpdateBookmarkEntry>
    | Endpoint<'PATCH', 'v1/bookmarks/:id/cover', { data: Bookmark }, FormData>
    | Endpoint<'DELETE', 'v1/bookmarks/:id', Empty>;
