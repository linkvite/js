import type {Endpoint} from '../rest';
import type {Empty} from './generic';

export type HighlightColor =
	| 'lv-highlighter-1'
	| 'lv-highlighter-2'
	| 'lv-highlighter-3'
	| 'lv-highlighter-4'
	| 'lv-highlighter-5';

export type Highlight = {
	id: string;
	user_id: string;
	bookmark_id: string;
	note: string;
	exact: string;
	start: number;
	end: number;
	color: string;
	created_at: Date;
	updated_at: Date;
};

type HighlightedBody = {
	type: string;
	value: string;
	purpose: string;
};

type HighlightedTargetSelector = {
	type: string;
	exact?: string;
	start?: number;
	end?: number;
};

type HighlightedTarget = {
	selector: HighlightedTargetSelector[];
};

export type Highlighted = {
	id: string;
	user_id: string;
	bookmark_id: string;
	note: string;
	type: string;
	body: HighlightedBody[];
	target: HighlightedTarget;
};

export type CreateHighlightEntry = {
	id: string;
	bookmark_id: string;
	color: HighlightColor;
	start: number;
	end: number;
	exact: string;
	note?: string;
};

export type UpdateHighlightEntry = {
	note?: string;
	color?: HighlightColor;
};

export type HighlightEndpoints =
	| Endpoint<
			'GET',
			'v1/highlights/:id',
			{highlights: Highlight[]; bookmark: string}
	  >
	| Endpoint<
			'POST',
			'v1/highlights',
			{highlight: Highlighted; previous_id: string},
			CreateHighlightEntry
	  >
	| Endpoint<'PATCH', 'v1/highlights/:id', Highlight, UpdateHighlightEntry>
	| Endpoint<'DELETE', 'v1/highlights/:id', Empty>;
