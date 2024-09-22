import type {Endpoint} from '../rest';
import type {RoleLevel} from './collection';
import type {Empty, Pagination, PaginationRequest} from './generic';

export type BookmarkPath = 'all' | 'starred' | 'trashed';
export type BookmarkStatus = 'active' | 'trashed' | 'deleted';
export type BookmarkArchiveStatus = 'pending' | 'success' | 'failed';
export type BookmarkType =
	| 'image'
	| 'video'
	| 'audio'
	| 'music'
	| 'article'
	| 'application'
	| 'website';

enum BookmarkMimeType {
	'text/html' = 0,
	'text/plain' = 1,
	'application/pdf' = 2,
	'application/zip' = 3,
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document' = 4,
	'application/vnd.openxmlformats-officedocument.presentationml.presentation' = 5,
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' = 6,
	'image/jpg' = 7,
	'image/jpeg' = 8,
	'image/png' = 9,
	'image/gif' = 10,
	'image/webp' = 11,
	'image/svg+xml' = 12,
	'image/bmp' = 13,
	'audio/mpeg' = 14,
	'audio/wav' = 15,
	'audio/ogg' = 16,
	'audio/x-m4a' = 17,
	'audio/mp4' = 18,
	'video/mp4' = 19,
	'video/webm' = 20,
}

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
	/**
	 * A prefixed string of the bookmark ID
	 *
	 * Always prefixed with `bmk_`
	 */
	id: string;

	/**
	 * The ID of the user who created the bookmark
	 */
	user_id: string;

	/**
	 * The title of the bookmark
	 */
	title: string;

	/**
	 * A description of the bookmark
	 *
	 * This can be empty
	 */
	description: string;

	/**
	 * The ID of the collection the bookmark is in
	 *
	 * If the bookmark is not in a collection, this will be `null`
	 */
	collection_id: string | null;

	/**
	 * Status of the bookmark
	 *
	 * - `active` - The bookmark is active
	 * - `trashed` - The bookmark is in the trash
	 * - `deleted` - The bookmark is deleted - waiting to be purged
	 */
	status: BookmarkStatus;

	/**
	 * Whether the bookmark is broken
	 *
	 * A bookmark is considered broken if the URL is not reachable
	 */
	is_broken: boolean;

	/**
	 * If comments are allowed on the bookmark
	 */
	allow_comments: boolean;

	/**
	 * A string of unique tags separated by commas
	 *
	 * ex. `tag1,tag2,tag3`
	 */
	tags: string;

	/**
	 * A small icon representing the bookmark
	 *
	 * Also used as the favicon
	 */
	icon: string;

	/**
	 * The cover image of the bookmark
	 */
	thumbnail: string;

	/**
	 * If the bookmark is currently being processed
	 *
	 * As in, the bookmark is being fetched and parsed
	 *
	 * Changes made while processing can be overwritten.
	 */
	processing: boolean;

	/**
	 * A string representing the type of bookmark
	 */
	type: BookmarkType;

	/**
	 * An internal ID representing the MIME type of the bookmark
	 *
	 * This is used to determine how the bookmark is displayed
	 */
	mime_type_id: BookmarkMimeType;

	/**
	 * A link to the bookmark
	 */
	url: string;

	/**
	 * Size of the bookmark in bytes
	 *
	 * If it's greater than 0, the bookmark is considered a file.
	 */
	size: number;

	/**
	 * Number of times the bookmark has been viewed
	 */
	views: number;

	/**
	 * ID of the user who last updated the bookmark
	 */
	updated_by_id: string | null;

	/**
	 * Date the bookmark was last updated
	 */
	updated_at: Date;

	/**
	 * Date the bookmark was created
	 */
	created_at: Date;

	/**
	 * Date the bookmark was last opened
	 */
	last_opened_at: Date | null;

	/**
	 * Archive status of the bookmark
	 *
	 * - `pending` - An archive has been requested or is in progress
	 * - `success` - The archive was successful, and the bookmark is archived
	 * - `failed` - The archive failed
	 */
	archive_status: BookmarkArchiveStatus;

	/**
	 * Size of the archive in bytes
	 */
	archive_size: number;

	/**
	 * If the bookmark is starred
	 */
	starred: boolean;

	/**
	 * The role of the user who is viewing the bookmark
	 *
	 * Note that owners will always have a role of `admin`
	 *
	 * To check if the user is the owner, compare the user's id to `bookmark.user_id`
	 */
	role: RoleLevel;

	/**
	 * The ID of the user who owns the bookmark
	 *
	 * This is the same as `user_id`
	 */
	owner_id: string;

	/**
	 * The name of the user who owns the bookmark
	 */
	owner_name: string;

	/**
	 * The username of the user who owns the bookmark
	 */
	owner_username: string;

	/**
	 * The display picture of the user who owns the bookmark
	 */
	owner_avatar: string;

	/**
	 * Name of the collection the bookmark is in
	 */
	collection_name: string | null;

	/**
	 * If the bookmark was recently moved to a different collection
	 *
	 * This will be the ID of the old collection
	 *
	 * This field will be removed after a short period, so it's best to use it immediately
	 */
	old_collection_id?: string;
};

export type BookmarkReader = {
	/**
	 * The URL of the article
	 */
	url: string;

	/**
	 * The title of the article
	 */
	title: string;

	/**
	 * The author of the article
	 *
	 * This can be an empty string
	 */
	byline: string;

	/**
	 * The HTML content of the article
	 *
	 * This is wrapped with a div with id `readability-page-1`
	 */
	content: string;

	/**
	 * The text content of the article
	 */
	text_content: string;
};

export type CreateBookmarkEntry = {
	collection?: string;
	title?: string;
	description?: string;
	starred?: boolean;
	tags?: string;
	cover?: string;
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
	allow_comments?: boolean;
};

export type ManualBookmarkEntryPayload = Omit<ManualBookmarkEntry, 'tags'> & {
	tags?: string;
};

export type BookmarkFileEntry = BookmarkEntry & {
	file: File;
	title?: string;
	starred?: boolean;
	description?: string;
};

export type BookmarkTabsEntry = {
	collection?: string;
	tabs: {
		url: string;
		title: string;
		description?: string;
		tags?: string;
	}[];
};

export type UpdateBookmarksEntry = Omit<BookmarkEntry, 'allowComments'> & {
	bookmarks: string[];
	type?: BookmarkType;
	status?: BookmarkStatus;
};

// TODO: allow file uploads
export type UpdateBookmarkEntry = BookmarkEntry & {
	name?: string;
	url?: string;
	status?: BookmarkStatus;
	description?: string;
	favicon?: string;
	type?: BookmarkType;
	starred?: boolean;
	cover?: string;
};

export type BookmarkEndpoints =
	| Endpoint<'GET', 'v1/bookmarks/:id', Bookmark>
	| Endpoint<'GET', 'v1/bookmarks/:id/reader', BookmarkReader>
	| Endpoint<
			'GET',
			'v1/bookmarks',
			{
				bookmarks: Bookmark[];
				pagination: Pagination;
			}
	  >
	| Endpoint<
			'POST',
			'v1/bookmarks/exists',
			{
				exists: boolean;
				bookmark: Bookmark;
			},
			{url: string; collection: string | null}
	  >
	| Endpoint<
			'GET',
			'v1/bookmarks/from-collection/:id',
			{
				bookmarks: Bookmark[];
				pagination: Pagination;
				collection_id: string;
			}
	  >
	| Endpoint<'GET', 'v1/bookmarks/:id/archive', string>
	| Endpoint<'POST', 'v1/bookmarks/:id/archive', string>
	| Endpoint<
			'POST',
			'v1/bookmarks',
			Bookmark,
			CreateBookmarkEntry & {url: string}
	  >
	| Endpoint<
			'POST',
			'v1/bookmarks/from-parsed-link',
			Bookmark,
			{
				data: ParsedLinkData;
				collection: string | null;
			}
	  >
	| Endpoint<'POST', 'v1/bookmarks/file', string, FormData>
	| Endpoint<'POST', 'v1/bookmarks/tabs', Bookmark, BookmarkTabsEntry>
	| Endpoint<
			'POST',
			'v1/bookmarks/manual',
			Bookmark,
			ManualBookmarkEntryPayload
	  >
	| Endpoint<'POST', 'v1/bookmarks/:id/re-parse', ParsedLinkData>
	| Endpoint<'POST', 'v1/bookmarks/:id/star', boolean>
	| Endpoint<
			'POST',
			'v1/bookmarks/batch-star',
			Empty,
			{
				value: boolean;
				bookmarks: string[];
			}
	  >
	| Endpoint<'PATCH', 'v1/bookmarks/batch-edit', Empty, UpdateBookmarksEntry>
	| Endpoint<'PATCH', 'v1/bookmarks/:id', Bookmark, UpdateBookmarkEntry>
	| Endpoint<'DELETE', 'v1/bookmarks/:id', Empty>;
