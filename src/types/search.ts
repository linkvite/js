import type {Endpoint} from '../rest';
import type {Empty, Pagination} from './generic';
import type {Bookmark} from './bookmark';
import type {Collection} from './collection';
import type {PublicProfile} from './user';

export type UnsplashPhoto = {
	id: string;
	description: string;
	urls: {
		raw: string;
		full: string;
		regular: string;
		small: string;
		thumb: string;
	};
	user: {
		name: string;
		username: string;
	};
	links: {
		download: string;
		html: string;
	};
};

export type TenorGIF = {
	id: string;
	title: string;
	media: {
		gif: {url: string};
		tinygif: {url: string};
	}[];
};

export type SearchResult = {
	bookmarks: Bookmark[];
	collections: Collection[];
	users: PublicProfile[];
	pagination: Pagination;
};

export type SearchEndpoints =
	| Endpoint<'GET', 'v1/search', SearchResult>
	| Endpoint<'GET', 'v1/search/unsplash', UnsplashPhoto[]>
	| Endpoint<'POST', 'v1/search/unsplash/track', Empty, {photo_id: string}>
	| Endpoint<'GET', 'v1/search/tenor', TenorGIF[]>;
