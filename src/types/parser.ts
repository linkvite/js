import type {Endpoint} from '../rest';
import type {Empty} from './generic';

export type ParsedLink = {
	url: string;
	title: string;
	description: string;
	image: string;
	favicon: string;
	type: string;
	site_name: string;
};

export type ImportParsedLinksEntry = {
	items: ParsedLink[];
	collection?: string;
};

export type ParserEndpoints =
	| Endpoint<'GET', 'v1/parser', ParsedLink>
	| Endpoint<'POST', 'v1/parser/import', Empty, ImportParsedLinksEntry>;
