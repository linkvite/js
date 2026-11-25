# @linkvite/js

## 4.0.0

### Major Changes

- 4b2e1b0: Rebuild + openapi spec
- 4b2e1b0: v4: generated from the Linkvite OpenAPI spec.
  
  - Every public endpoint (116 methods in 19 namespaces) is generated from the spec cultus derives from its own code, with typed bodies, query params and responses. New namespaces: `apps`, `explore`, `feed`, `files`, `inviteLinks`, `notifications`, `plans`, `profiles`.
  - Methods resolve to the response's `data` and throw `LinkviteError` (`status`, `errors`, `requestId`) on failure.
  - Automatic retries for idempotent requests on 429/5xx (honours `Retry-After`), per-request timeouts and `AbortSignal`.
  - `oauth` helpers: PKCE, authorize URL, code exchange, refresh with a single-flight refresher for rotating refresh tokens, revoke. `onUnauthorized` retries a request once with a fresh token.
  - `paginate()` iterates every page of a list; `request()` calls any endpoint.
  - Breaking: removed `bookmarks.reParse`, `bookmarks.listByTag`, `collections.toggleStar` and `comments.report` (the API no longer has them); `collections.getAll` now calls `GET /v1/collections`; `apiKeys.create`/`update` need a first-party session and are no longer in the SDK; `refreshToken()` is now `refreshSession()`; `cross-fetch` is gone (built-in `fetch`, or pass `fetch`); requires Node 20+ (Node 18 is end-of-life).

## 3.0.0

### Major Changes

- more clients

## 2.0.0

### Major Changes

- updated req/res payloads

## 2.0.0

### Major Changes

- updated req/res payloads

## 1.1.0

### Minor Changes

- updated the file endpoint's response type

## 1.0.0

### Major Changes

- dde7ce6: updated the types to match the new schema, deprecated settings endpoints

## 0.3.0

### Minor Changes

- dc2accf: Fixed creating bookmark from entry + update read me

## 0.2.0

### Minor Changes

- a50b31b: Collection SDK

## 0.1.0

### Minor Changes

- User SDK

## 0.0.8

### Minor Changes

- 17ae5b1: Updated the SDK to 0.0.8

## 0.0.7

### Minor Changes

- 2faa760: Removed the compressed SDK from the package

## 0.0.6

### Minor Changes

nothing to see here

## 0.0.5

### Minor Changes

- 7b8bb90: Bookmark SDK
