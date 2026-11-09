---
'@linkvite/js': major
---

v4: generated from the Linkvite OpenAPI spec.

- Every public endpoint (116 methods in 19 namespaces) is generated from the spec cultus derives from its own code, with typed bodies, query params and responses. New namespaces: `apps`, `explore`, `feed`, `files`, `inviteLinks`, `notifications`, `plans`, `profiles`.
- Methods resolve to the response's `data` and throw `LinkviteError` (`status`, `errors`, `requestId`) on failure.
- Automatic retries for idempotent requests on 429/5xx (honours `Retry-After`), per-request timeouts and `AbortSignal`.
- `oauth` helpers: PKCE, authorize URL, code exchange, refresh with a single-flight refresher for rotating refresh tokens, revoke. `onUnauthorized` retries a request once with a fresh token.
- `paginate()` iterates every page of a list; `request()` calls any endpoint.
- Breaking: removed `bookmarks.reParse`, `bookmarks.listByTag`, `collections.toggleStar` and `comments.report` (the API no longer has them); `collections.getAll` now calls `GET /v1/collections`; `apiKeys.create`/`update` need a first-party session and are no longer in the SDK; `refreshToken()` is now `refreshSession()`; `cross-fetch` is gone (built-in `fetch`, or pass `fetch`); requires Node 20+ (Node 18 is end-of-life).
