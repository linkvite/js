import type { BookmarkEndpoints, CollectionEndpoints, Method, UserEndpoints } from "../types";

export type ValidateFieldError = {
    tag: string;
    field: string;
    value: string;
};

/**
 * A successful response from an API endpoint
 * @public
 */
export type SuccessfulAPIResponse<T> = {
    ok: true;
    message: string;
    data: T;
};

/**
 * An error response from an API endpoint
 * @public
 */
export type ErroredAPIResponse = {
    ok: false;
    message: string;
    errors?: ValidateFieldError[];
};

/**
 * The response from an API endpoint
 * @public
 */
export type APIResponse<T> = SuccessfulAPIResponse<T> | ErroredAPIResponse;

/**
 * A successful response from an API endpoint
 * @public
 */
export type Endpoint<
    M extends Method,
    Path extends string,
    Res,
    Body = undefined,
> = {
    method: M;
    path: Path;
    res: Res;
    body: Body;
};

/**
 * Extract an endpoint from a given method and path
 * @public
 */
export type Endpoints =
    | UserEndpoints
    | BookmarkEndpoints
    | CollectionEndpoints;