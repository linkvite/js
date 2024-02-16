/**
 * All methods the Linkvite API accepts
 * @public
 */
export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Mongo DB Object ID
 * @public
 */
export type OBJECT_ID = string;

/**
 * Image upload type
 * @public
 */
export type ImageUploadType = 'custom' | 'default' | 'remove';

/**
 * Empty req / response body
 * @public
 */
export type Empty = void;

/**
 * Pagination request
 */
export type PaginationRequest = {
    q?: string;
    page?: number;
    limit?: number;
}

/**
 * Pagination response
 */
export type Pagination = {
    page: number;
    total: number;
    limit: number;
    lastPage: number;
    q?: string;
}

/**
 * Creates a record of params required for a given URL/path
 * @public
 */
export type ExtractRouteParams<T extends string> = string extends T
    ? Record<string, string | number | undefined>
    : T extends `${string}:${infer Param}/${infer Rest}`
    ? { [k in Param | keyof ExtractRouteParams<Rest>]: string | number }
    : T extends `${string}:${infer Param}`
    ? { [k in Param]: string | number }
    : {};