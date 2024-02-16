import type {OBJECT_ID} from './generic';

export type Highlight = {
	/**
	 * Mongo DB Object ID
	 */
	_id: OBJECT_ID;

	/**
	 * UUID V4
	 */
	id: string;

	type: string;
	note?: string;
	owner: OBJECT_ID;
	bookmark: OBJECT_ID;
	body: HighlightBody[];
	target: HighlightTarget;
};

type HighlightBody = {
	type: string;
	value: string;
	purpose: string;
};

type HighlightTarget = {
	selector: HighlightTargetSelector[];
};

type HighlightTargetSelector = {
	type: string;
	exact?: string;
	start?: number;
	end?: number;
};
