export {LinkviteError, type LinkviteErrorInit} from './errors';
export type {Resources} from './generated/resources';
export {operationIds} from './generated/resources';
export {Linkvite, login, refreshSession, type Session} from './linkvite';
export type {TokenResponse} from './oauth';
export * as oauth from './oauth';
export {
	type Body,
	type ClientOptions,
	type Data,
	DEFAULT_BASE_URL,
	type Query,
	type RequestOptions,
	type TokenSource,
	Transport,
	VERSION,
} from './transport';

import type {components, operations} from './generated/schema';
/** Every API schema, e.g. `Schemas['BookmarkResponse']`. */
export type Schemas = components['schemas'];
export type Operations = operations;
export type {components, operations, paths} from './generated/schema';
