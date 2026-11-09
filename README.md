# @linkvite/js

The official JavaScript/TypeScript SDK for [Linkvite](https://linkvite.io). It's generated from the Linkvite OpenAPI spec, so every endpoint, request and response is typed and matches the API exactly.

Works in Node 20+, Deno, Bun, browsers and browser extensions (anything with `fetch`).

```bash
pnpm add @linkvite/js   # or npm i / yarn add
```

## Quick start

```ts
import {Linkvite} from '@linkvite/js';

const linkvite = new Linkvite(process.env.LINKVITE_API_KEY!);

const bookmark = await linkvite.bookmarks.create({
	url: 'https://example.com',
	tags: 'reading',
});
const {bookmarks, pagination} = await linkvite.bookmarks.getAll({
	q: 'rust',
	limit: 50,
});
```

Every method resolves to the response's `data` and throws a `LinkviteError` on failure.

## Authentication

| You're building                                                  | Use                                                                |
| ---------------------------------------------------------------- | ------------------------------------------------------------------ |
| A script or server acting as your own account                    | An **API key** (Settings → Developers): `new Linkvite('link_...')` |
| An app other people sign in to (extension, desktop, mobile, web) | **OAuth** with PKCE (below), then `new Linkvite({token})`          |

### OAuth (authorization code + PKCE)

```ts
import {Linkvite, oauth} from '@linkvite/js';

const pkce = await oauth.createPkce();
const state = await oauth.createState();
// store pkce.verifier and state, then send the user to:
const url = oauth.authorizeUrl({
	clientId: 'app_...',
	redirectUri: 'https://example.com/callback',
	scope: 'bookmarks:read bookmarks:write collections:read',
	state,
	codeChallenge: pkce.challenge,
});

// on the redirect back (check `state` first):
const tokens = await oauth.exchangeCode({
	clientId: 'app_...',
	redirectUri: 'https://example.com/callback',
	code,
	codeVerifier: pkce.verifier,
});
```

Refresh tokens rotate: each one works once, and reusing an old one signs the session out. Let the SDK refresh for you, one request at a time:

```ts
const refresh = oauth.singleFlightRefresher({
	clientId: 'app_...',
	load: () => store.get('refresh_token'),
	save: t =>
		store.set({access_token: t.access_token, refresh_token: t.refresh_token}),
});

const linkvite = new Linkvite({
	token: () => store.get('access_token'),
	onUnauthorized: refresh, // on a 401: refresh once and retry the request
});
```

## Usage

```ts
// path params come first, then the body, then query params
await linkvite.bookmarks.update('bmk_123', {title: 'New title'});
await linkvite.bookmarks.fromCollection('col_123', {page: 2, limit: 100});

// files: pass a Blob or File
await linkvite.bookmarks.createFile({
	file: new File([pdf], 'paper.pdf'),
	collection: 'col_123',
});

// every page of a list
for await (const b of linkvite.paginate(
	page => linkvite.bookmarks.getAll({page, limit: 100}),
	'bookmarks',
)) {
	console.log(b.title);
}

// any endpoint, including ones newer than this SDK
const me = await linkvite.request('GET', '/v1/user');
```

### Errors

```ts
import {LinkviteError} from '@linkvite/js';

try {
	await linkvite.bookmarks.create({url: ''});
} catch (err) {
	if (err instanceof LinkviteError) {
		err.status; // 400, 401, 402 (Pro required), 404, 429, ... (0: network error / timeout)
		err.errors; // {url: 'required'} for validation errors
		err.requestId; // quote this when contacting support
	}
}
```

### Options

```ts
new Linkvite({
	apiKey: 'link_...', // or token: string | () => string
	baseUrl: 'https://api-stg.linkvite.io',
	maxRetries: 2, // 429/5xx/network, idempotent requests only
	timeoutMs: 30_000,
	headers: {'X-Request-Source': 'my-app'},
	fetch: customFetch,
});

await linkvite.bookmarks.getAll(
	{},
	{signal: controller.signal, timeoutMs: 5_000},
);
```

### Types

```ts
import type {Schemas} from '@linkvite/js';

type Bookmark = Schemas['BookmarkResponse'];
```

## Namespaces

`apiKeys`, `apps`, `bookmarks`, `collections`, `comments`, `explore`, `feed`, `files`, `highlights`, `inviteLinks`, `invites`, `notifications`, `parser`, `plans`, `profiles`, `reminders`, `rssFeeds`, `search`, `user`. Every method's JSDoc shows its scope and rate limit; the full reference is at [docs.linkvite.io](https://docs.linkvite.io).

## Upgrading from v3

- Methods now resolve to `data` (v3 returned it too) and throw `LinkviteError` instead of `LinkviteAPIError`.
- Removed (no longer in the API): `bookmarks.reParse`, `bookmarks.listByTag`, `collections.toggleStar`, `comments.report`.
- `collections.getAll` calls `GET /v1/collections` (paginated).
- `refreshToken()` → `refreshSession()`; prefer OAuth for apps.
- No `cross-fetch` dependency: Node 20+ has `fetch`, or pass your own.

## Development

The SDK is generated from `spec/openapi.json`, which cultus produces from its own code (`make openapi` in cultus).

```bash
pnpm generate --spec ../cultus/api/openapi.json   # refresh the spec and regenerate
pnpm check                                         # generated code current + typecheck + tests
pnpm build
```

Method names come from `x-linkvite-sdk` in the spec (`tools/openapi/sdk-names.json` in cultus), so they stay stable when handlers are renamed.

To release a new version, see [RELEASE.md](RELEASE.md).

## License

MIT
