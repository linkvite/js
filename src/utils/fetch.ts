import * as ponyfill from 'cross-fetch';
import {type APIClientOptions} from './../rest/client';
import {API_KEY_HEADER, AUTH_TOKEN_HEADER} from './constants';

export const HAS_NATIVE_FETCH = typeof globalThis.fetch !== 'undefined';

export const fetch = HAS_NATIVE_FETCH ? globalThis.fetch : ponyfill.default;
export const Headers = HAS_NATIVE_FETCH ? globalThis.Headers : ponyfill.Headers;
export const Request = HAS_NATIVE_FETCH ? globalThis.Request : ponyfill.Request;
export const Response = HAS_NATIVE_FETCH
	? globalThis.Response
	: ponyfill.Response;

/**
 * Set the authorization header for a given request
 *
 * @param {Headers} headers - The headers to set the authorization on
 * @param {APIClientOptions} options - The options to use for setting the authorization
 */
export function setAuthHeader(
	headers: Headers,
	options: APIClientOptions,
): Headers {
	if ('key' in options) {
		headers.set(API_KEY_HEADER, options.key);
	} else if ('token' in options) {
		headers.set(AUTH_TOKEN_HEADER, `Bearer ${options.token}`);
	}
	return headers;
}
