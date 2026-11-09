import {describe, expect, expectTypeOf, it, vi} from 'vitest';
import spec from '../spec/openapi.json' with {type: 'json'};
import {
	Linkvite,
	LinkviteError,
	oauth,
	operationIds,
	type Schemas,
} from '../src';

type Call = {url: string; init: RequestInit};

function mockFetch(...responses: (Response | Error)[]) {
	const calls: Call[] = [];
	const fn = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
		calls.push({url: String(url), init: init ?? {}});
		const r = responses.shift() ?? json({ok: true});
		if (r instanceof Error) throw r;
		return r;
	});
	return {fetch: fn as unknown as typeof fetch, calls};
}

function json(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {'content-type': 'application/json', ...headers},
	});
}

describe('requests', () => {
	it('builds path, query and auth from an API key', async () => {
		const m = mockFetch(
			json({ok: true, data: {bookmarks: [], pagination: null}}),
		);
		const lv = new Linkvite({apiKey: 'link_test', fetch: m.fetch});
		await lv.bookmarks.fromCollection('col 1', {page: 2, limit: 50, q: 'go'});
		const {url, init} = m.calls[0]!;
		expect(url).toBe(
			'https://api.linkvite.io/v1/bookmarks/from-collection/col%201?page=2&limit=50&q=go',
		);
		expect(init.method).toBe('GET');
		const h = new Headers(init.headers);
		expect(h.get('x-api-key')).toBe('link_test');
		expect(h.get('authorization')).toBeNull();
		expect(h.get('user-agent')).toMatch(/^linkvite-js\/\d/);
	});

	it('accepts the v3 string constructor and legacy `key`', async () => {
		const m = mockFetch(json({ok: true, data: {}}), json({ok: true, data: {}}));
		const orig = globalThis.fetch;
		globalThis.fetch = m.fetch;
		try {
			await new Linkvite('link_a').user.get();
		} finally {
			globalThis.fetch = orig;
		}
		await new Linkvite({key: 'link_b', fetch: m.fetch}).user.get();
		expect(new Headers(m.calls[0]!.init.headers).get('x-api-key')).toBe(
			'link_a',
		);
		expect(new Headers(m.calls[1]!.init.headers).get('x-api-key')).toBe(
			'link_b',
		);
	});

	it('sends JSON bodies and unwraps data', async () => {
		const m = mockFetch(
			json(
				{
					ok: true,
					message: 'Bookmark created!',
					data: {id: 'bmk_1', url: 'https://example.com'},
				},
				201,
			),
		);
		const lv = new Linkvite({token: 'tok', fetch: m.fetch});
		const b = await lv.bookmarks.create({
			url: 'https://example.com',
			tags: 'a,b',
		});
		expect(b.id).toBe('bmk_1');
		const {init} = m.calls[0]!;
		expect(init.method).toBe('POST');
		expect(JSON.parse(init.body as string)).toEqual({
			url: 'https://example.com',
			tags: 'a,b',
		});
		const h = new Headers(init.headers);
		expect(h.get('authorization')).toBe('Bearer tok');
		expect(h.get('content-type')).toBe('application/json');
	});

	it('resolves message-only responses to undefined', async () => {
		const m = mockFetch(json({ok: true, message: 'Bookmark deleted'}));
		const lv = new Linkvite({token: 'tok', fetch: m.fetch});
		await expect(lv.bookmarks.delete('bmk_1')).resolves.toBeUndefined();
	});

	it('sends multipart for file uploads', async () => {
		const m = mockFetch(json({ok: true, message: 'Processing'}, 201));
		const lv = new Linkvite({token: 'tok', fetch: m.fetch});
		await lv.bookmarks.createFile({
			file: new Blob(['hello'], {type: 'text/plain'}),
			title: 'hi',
			starred: true,
		});
		const body = m.calls[0]!.init.body as FormData;
		expect(body).toBeInstanceOf(FormData);
		expect(body.get('title')).toBe('hi');
		expect(body.get('starred')).toBe('true');
		expect(body.get('file')).toBeInstanceOf(Blob);
		expect(
			new Headers(m.calls[0]!.init.headers).get('content-type'),
		).toBeNull();
	});

	it('returns non-JSON bodies as text', async () => {
		const m = mockFetch(
			new Response('<rss/>', {headers: {'content-type': 'application/xml'}}),
		);
		const lv = new Linkvite({fetch: m.fetch});
		await expect(lv.profiles.getCollectionRSS('kayode', 'col_1')).resolves.toBe(
			'<rss/>',
		);
	});

	it('rejects a missing path parameter', async () => {
		const lv = new Linkvite({fetch: mockFetch().fetch});
		await expect(lv.bookmarks.get('')).rejects.toThrow(
			/missing path parameter "id"/,
		);
	});
});

describe('errors and retries', () => {
	it('throws LinkviteError with validation details and request id', async () => {
		const m = mockFetch(
			json(
				{
					ok: false,
					error: 'Validation error',
					errors: {url: 'required'},
					request_id: 'rid',
				},
				400,
			),
		);
		const lv = new Linkvite({token: 't', fetch: m.fetch});
		const err = await lv.bookmarks.create({url: ''}).catch(e => e);
		expect(err).toBeInstanceOf(LinkviteError);
		expect(err.status).toBe(400);
		expect(err.errors).toEqual({url: 'required'});
		expect(err.requestId).toBe('rid');
	});

	it('retries idempotent requests on 429/5xx, honouring Retry-After', async () => {
		const m = mockFetch(
			json({ok: false, error: 'slow down'}, 429, {'retry-after': '0'}),
			json({ok: false}, 503),
			json({ok: true, data: {id: 'u'}}),
		);
		const lv = new Linkvite({token: 't', fetch: m.fetch});
		await expect(lv.user.get()).resolves.toEqual({id: 'u'});
		expect(m.calls).toHaveLength(3);
	});

	it('does not retry non-idempotent requests', async () => {
		const m = mockFetch(json({ok: false, error: 'boom'}, 500));
		const lv = new Linkvite({token: 't', fetch: m.fetch});
		await expect(
			lv.bookmarks.create({url: 'https://x.y'}),
		).rejects.toMatchObject({status: 500});
		expect(m.calls).toHaveLength(1);
	});

	it('refreshes once on 401 and retries with the new token', async () => {
		const m = mockFetch(
			json({ok: false, error: 'expired'}, 401),
			json({ok: true, data: {id: 'u'}}),
		);
		const onUnauthorized = vi.fn(async () => 'fresh');
		const lv = new Linkvite({token: 'stale', onUnauthorized, fetch: m.fetch});
		await expect(lv.user.get()).resolves.toEqual({id: 'u'});
		expect(onUnauthorized).toHaveBeenCalledOnce();
		expect(new Headers(m.calls[1]!.init.headers).get('authorization')).toBe(
			'Bearer fresh',
		);
	});

	it('wraps network failures as status 0', async () => {
		const m = mockFetch(new TypeError('fetch failed'));
		const lv = new Linkvite({token: 't', fetch: m.fetch, maxRetries: 0});
		await expect(lv.user.get()).rejects.toMatchObject({status: 0});
	});
});

describe('pagination', () => {
	it('walks every page', async () => {
		const page = (n: number, last: number) =>
			json({
				ok: true,
				data: {
					bookmarks: [{id: `b${n}`}],
					pagination: {page: n, last_page: last, total: last, limit: 1},
				},
			});
		const m = mockFetch(page(1, 3), page(2, 3), page(3, 3));
		const lv = new Linkvite({token: 't', fetch: m.fetch});
		const ids: string[] = [];
		for await (const b of lv.paginate(
			p => lv.bookmarks.getAll({page: p, limit: 1}),
			'bookmarks',
		))
			ids.push(b.id);
		expect(ids).toEqual(['b1', 'b2', 'b3']);
	});
});

describe('oauth', () => {
	it('builds a PKCE authorize URL', async () => {
		const pkce = await oauth.createPkce();
		expect(pkce.verifier).toMatch(/^[A-Za-z0-9_-]{43}$/);
		const u = new URL(
			oauth.authorizeUrl({
				clientId: 'app_1',
				redirectUri: 'https://x/cb',
				scope: 'bookmarks:read',
				state: 's',
				codeChallenge: pkce.challenge,
			}),
		);
		expect(u.pathname).toBe('/v1/oauth/authorize');
		expect(u.searchParams.get('code_challenge_method')).toBe('S256');
		expect(u.searchParams.get('response_type')).toBe('code');
	});

	it('exchanges a code with a form body and surfaces OAuth errors', async () => {
		const m = mockFetch(
			json({
				access_token: 'a',
				refresh_token: 'r',
				expires_in: 3600,
				token_type: 'Bearer',
				scope: '',
			}),
			json({error: 'invalid_grant', error_description: 'reused'}, 400),
		);
		const t = await oauth.exchangeCode(
			{
				clientId: 'app_1',
				redirectUri: 'https://x/cb',
				code: 'c',
				codeVerifier: 'v',
			},
			{fetch: m.fetch},
		);
		expect(t.access_token).toBe('a');
		const sent = new URLSearchParams(m.calls[0]!.init.body as URLSearchParams);
		expect(sent.get('grant_type')).toBe('authorization_code');
		expect(sent.get('code_verifier')).toBe('v');
		await expect(
			oauth.refresh({clientId: 'app_1', refreshToken: 'r'}, {fetch: m.fetch}),
		).rejects.toMatchObject({code: 'invalid_grant', status: 400});
	});

	it('shares one in-flight refresh between concurrent callers', async () => {
		const m = mockFetch(
			json({
				access_token: 'a2',
				refresh_token: 'r2',
				expires_in: 3600,
				token_type: 'Bearer',
				scope: '',
			}),
		);
		const save = vi.fn();
		const r = oauth.singleFlightRefresher({
			clientId: 'c',
			load: () => 'r1',
			save,
			opts: {fetch: m.fetch},
		});
		const [a, b] = await Promise.all([r(), r()]);
		expect(a).toBe('a2');
		expect(b).toBe('a2');
		expect(m.calls).toHaveLength(1);
		expect(save).toHaveBeenCalledOnce();
	});
});

describe('generated surface', () => {
	it('has a method for every public operation with an SDK name', () => {
		const lv = new Linkvite({fetch: mockFetch().fetch}) as unknown as Record<
			string,
			Record<string, unknown>
		>;
		const named: string[] = [];
		for (const item of Object.values(spec.paths) as Record<
			string,
			Record<string, unknown>
		>[]) {
			for (const op of Object.values(item)) {
				if (op['x-linkvite-visibility'] === 'public' && op['x-linkvite-sdk'])
					named.push(op['x-linkvite-sdk'] as string);
			}
		}
		expect(named.length).toBeGreaterThan(100);
		for (const n of named) {
			const [ns, m] = n.split('.') as [string, string];
			expect(typeof lv[ns]?.[m], n).toBe('function');
		}
		expect(Object.keys(operationIds).sort()).toEqual([...named].sort());
	});

	it('infers response and request types', () => {
		const lv = new Linkvite({fetch: mockFetch().fetch});
		expectTypeOf(lv.bookmarks.get).returns.resolves.toEqualTypeOf<
			Schemas['BookmarkResponse']
		>();
		expectTypeOf(
			lv.bookmarks.delete,
		).returns.resolves.toEqualTypeOf<undefined>();
		expectTypeOf(lv.bookmarks.create)
			.parameter(0)
			.toHaveProperty('url')
			.toEqualTypeOf<string>();
		expectTypeOf<
			Awaited<ReturnType<typeof lv.collections.getAll>>
		>().not.toBeNever();
	});
});
