import type {Endpoint} from '../rest';
import type {Empty} from './generic';

export type RSSFeed = {
	id: string;
	user_id: string;
	title: string;
	url: string;
	description: string;
	collection_id: string | null;
	collection_name: string;
	item_count: number;
	last_fetch_at: Date | null;
	created_at: Date;
	updated_at: Date;
};

export type RSSFeedItem = {
	title: string;
	description: string;
	link: string;
	published: string;
	author: string;
};

export type CreateRSSFeedEntry = {
	url: string;
	collection_id?: string;
};

export type UpdateRSSFeedEntry = {
	title?: string;
	collection_id?: string | null;
};

export type RSSFeedEndpoints =
	| Endpoint<'GET', 'v1/rss-feeds', RSSFeed[]>
	| Endpoint<'GET', 'v1/rss-feeds/:id/items', RSSFeedItem[]>
	| Endpoint<'POST', 'v1/rss-feeds', RSSFeed, CreateRSSFeedEntry>
	| Endpoint<'POST', 'v1/rss-feeds/batch-delete', Empty, {feeds: string[]}>
	| Endpoint<'PATCH', 'v1/rss-feeds/:id', RSSFeed, UpdateRSSFeedEntry>;
