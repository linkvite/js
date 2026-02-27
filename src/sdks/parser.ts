import {sdk} from './create';
import type {ImportParsedLinksEntry} from '../types';

/**
 * Parser SDK client
 * @public
 */
export const parser = sdk(client => ({
	/**
	 * Parse a URL and return its metadata
	 *
	 * @param {String} url - The URL to parse
	 */
	async parseLink(url: string) {
		return await client.get('v1/parser', {url});
	},

	/**
	 * Import parsed links as bookmarks
	 *
	 * @param {ImportParsedLinksEntry} data - The parsed links to import
	 */
	async import(data: ImportParsedLinksEntry) {
		return await client.post('v1/parser/import', data, {});
	},
}));
