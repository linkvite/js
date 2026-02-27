# @linkvite/js

Official JavaScript/TypeScript SDK for [Linkvite](https://linkvite.io). Requires Node.js 18+.

## Installation

```bash
npm install @linkvite/js
# or
pnpm add @linkvite/js
```

## Authentication

Three authentication methods are supported.

> **Note:** Only Pro accounts can use the API with an API key. Free accounts must use a personal access token or log in with credentials.

### API Key

```ts
import {Linkvite} from '@linkvite/js';

const linkvite = new Linkvite('link_your-api-key');
// or
const linkvite = new Linkvite({key: 'link_your-api-key'});
```

### Personal Access Token

```ts
const linkvite = new Linkvite({
	token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
});
```

### Email / Username + Password

```ts
import {Linkvite, login} from '@linkvite/js';

// Create a client directly from credentials
const linkvite = await Linkvite.fromCredentials('user@example.com', 'password');

// Or get the tokens first and create the client yourself
const result = await login('user@example.com', 'password');
// result.access_token, result.refresh_token, result.user
const linkvite = new Linkvite({token: result.access_token});
```

### Refreshing Tokens

Access tokens expire after 30 minutes. Use `refreshToken()` to get new tokens and create a fresh client:

```ts
const result = await linkvite.refreshToken(myRefreshToken);
const newClient = new Linkvite({token: result.access_token});
```

## Services

### Bookmarks

```ts
// Get all bookmarks (paginated)
const {bookmarks, pagination} = await linkvite.bookmarks.getAll({
	page: 1,
	limit: 20,
});

// Get all bookmarks without pagination
const {bookmarks} = await linkvite.bookmarks.listAll();

// Get bookmarks by tag
const {bookmarks} = await linkvite.bookmarks.listByTag('design', {page: 1});

// Get a single bookmark
const bookmark = await linkvite.bookmarks.get('bmk_abc123');

// Get the reader (article) view of a bookmark
const reader = await linkvite.bookmarks.getReader('bmk_abc123');

// Get bookmarks in a collection
const {bookmarks} = await linkvite.bookmarks.fromCollection('coll_xyz789');

// Check if a bookmark exists
const {exists, bookmark} = await linkvite.bookmarks.exists(
	'https://example.com',
);

// Create a bookmark from a URL
const bookmark = await linkvite.bookmarks.create('https://example.com', {
	title: 'Example Site',
	description: 'An example website',
	collection: 'coll_xyz789',
	tags: 'example,test',
	starred: true,
});

// Create a bookmark from manual data
const bookmark = await linkvite.bookmarks.createFromEntry({
	title: 'My Bookmark',
	url: 'https://example.com',
	tags: ['example', 'test'],
});

// Create bookmarks from browser tabs
const bookmarks = await linkvite.bookmarks.createFromTabs({
	collection: 'coll_xyz789',
	tabs: [
		{url: 'https://example.com', title: 'Example'},
		{url: 'https://another.com', title: 'Another'},
	],
});

// Create a bookmark from a file upload
const bookmark = await linkvite.bookmarks.createFromFile({
	file: myFile,
	title: 'My PDF',
});

// Update a bookmark
const bookmark = await linkvite.bookmarks.update('bmk_abc123', {
	name: 'New Title',
	starred: true,
});

// Batch update bookmarks
await linkvite.bookmarks.batchUpdate({
	bookmarks: ['bmk_1', 'bmk_2'],
	status: 'trashed',
});

// Toggle star
await linkvite.bookmarks.toggleStar('bmk_abc123');

// Batch toggle star
await linkvite.bookmarks.batchToggleStar(['bmk_1', 'bmk_2'], true);

// Request an archive
await linkvite.bookmarks.createArchive('bmk_abc123');

// Delete a bookmark (permanent)
await linkvite.bookmarks.delete('bmk_abc123');
```

### Collections

```ts
// Get all collections
const collections = await linkvite.collections.getAll();

// Get a single collection
const collection = await linkvite.collections.get('coll_xyz789');

// Get collection members
const {role, owner_id, members} = await linkvite.collections.getMembers(
	'coll_xyz789',
);

// Get online presence
const presence = await linkvite.collections.getOnlinePresence('coll_xyz789');

// Create a collection
const collection = await linkvite.collections.create({
	name: 'My Collection',
	description: 'A collection of bookmarks',
	parent: 'coll_parent123', // optional, for nested collections
});

// Update a collection
const collection = await linkvite.collections.update('coll_xyz789', {
	name: 'New Name',
	is_private: false,
});

// Toggle star
await linkvite.collections.toggleStar('coll_xyz789');

// Invite a user
await linkvite.collections.invite('coll_xyz789', {
	identifier: 'user@example.com', // username or email
	role: 'viewer',
});

// Change a member's role (or remove them)
await linkvite.collections.editRole('coll_xyz789', {
	user_id: 'usr_abc123',
	role: 'admin',
});
// or remove
await linkvite.collections.editRole('coll_xyz789', {
	user_id: 'usr_abc123',
	remove: true,
});

// Move to a new parent (or remove from parent)
await linkvite.collections.move('coll_xyz789', {parent: 'coll_newparent'});
await linkvite.collections.move('coll_xyz789', {remove: true});

// Leave a collection
await linkvite.collections.leave('coll_xyz789');

// Delete a collection
await linkvite.collections.delete('coll_xyz789');
```

### User

```ts
// Get the current user
const user = await linkvite.user.get();

// Update profile
const user = await linkvite.user.update({
	name: 'New Name',
	username: 'newusername',
	folder_name: 'my-folder',
	private_account: true,
});

// Update notification settings
const user = await linkvite.user.updateSettings({
	push_enabled: true,
	email_enabled: false,
	in_app_enabled: true,
});

// Get storage usage
const {used, total} = await linkvite.user.getStorageUsage();

// Get detailed storage usage (paginated list of bookmarks by size)
const {bookmarks, pagination} = await linkvite.user.getDetailedStorageUsage({
	page: 1,
	limit: 20,
});

// Empty trash
await linkvite.user.emptyTrash();
```

### Comments

```ts
// Get all comments on a bookmark
const comments = await linkvite.comments.getAll('bmk_abc123');

// Create a comment
const comment = await linkvite.comments.create({
	bookmark_id: 'bmk_abc123',
	content: 'Great article!',
});

// Toggle like on a comment
await linkvite.comments.toggleLike('cmt_xyz789');

// Get users who liked a comment
const users = await linkvite.comments.getLikes('cmt_xyz789');

// Report a comment
await linkvite.comments.report('cmt_xyz789');

// Delete a comment
await linkvite.comments.delete('cmt_xyz789');
```

### Highlights

```ts
import {type HighlightColor} from '@linkvite/js';

// Get all highlights for a bookmark
const {highlights, bookmark} = await linkvite.highlights.getAll('bmk_abc123');

// Create a highlight
const {highlight, previous_id} = await linkvite.highlights.create({
	id: 'hil_client-generated-id', // client-generated ID
	bookmark_id: 'bmk_abc123',
	color: 'lv-highlighter-1', // 'lv-highlighter-1' through 'lv-highlighter-5'
	start: 0,
	end: 50,
	exact: 'The exact highlighted text',
	note: 'My note about this',
});

// Update a highlight
const highlight = await linkvite.highlights.update('hil_xyz789', {
	note: 'Updated note',
	color: 'lv-highlighter-2',
});

// Delete a highlight
await linkvite.highlights.delete('hil_xyz789');
```

### Reminders

```ts
// Get all reminders (paginated)
const {reminders, pagination} = await linkvite.reminders.getAll({
	page: 1,
	limit: 20,
});

// Get a single reminder
const reminder = await linkvite.reminders.get('rem_abc123');

// Create a reminder
const reminder = await linkvite.reminders.create({
	bookmark_id: 'bmk_abc123',
	remind_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
	note: 'Read this article',
});

// Update a reminder
const reminder = await linkvite.reminders.update('rem_abc123', {
	completed: true,
});

// Batch update (e.g. mark completed)
await linkvite.reminders.batchUpdate(['rem_1', 'rem_2'], true);

// Batch delete
await linkvite.reminders.batchDelete(['rem_1', 'rem_2']);

// Delete all reminders
await linkvite.reminders.clear();

// Delete a single reminder
await linkvite.reminders.delete('rem_abc123');
```

### Invites

```ts
// Get all pending invites
const invites = await linkvite.invites.getAll();

// Get a single invite
const invite = await linkvite.invites.get('inv_abc123');

// Accept an invite
await linkvite.invites.accept('inv_abc123');

// Decline an invite
await linkvite.invites.decline('inv_abc123');

// Batch accept
await linkvite.invites.batchAccept(['inv_1', 'inv_2']);

// Batch decline
await linkvite.invites.batchDecline(['inv_1', 'inv_2']);

// Decline all pending invites
await linkvite.invites.declineAll();
```

### Search

```ts
// Search across bookmarks, collections, and users
const {bookmarks, collections, users, pagination} =
	await linkvite.search.search('golang', {
		type: 'bookmarks', // 'bookmarks', 'collections', or 'users'
		page: 1,
		limit: 20,
	});

// Search Unsplash for photos
const photos = await linkvite.search.searchUnsplash('nature', 1);

// Track an Unsplash download (required for attribution)
await linkvite.search.trackUnsplashDownload('unsplash-photo-id');

// Search Tenor for GIFs
const gifs = await linkvite.search.searchTenor('coding');
```

### RSS Feeds

```ts
// Get all RSS feed subscriptions
const feeds = await linkvite.rssFeeds.getAll();

// Get items from a feed
const items = await linkvite.rssFeeds.getItems('rss_abc123');

// Subscribe to an RSS feed
const feed = await linkvite.rssFeeds.create({
	url: 'https://example.com/feed.xml',
	collection_id: 'coll_xyz789', // optional
});

// Update a feed subscription
const feed = await linkvite.rssFeeds.update('rss_abc123', {
	title: 'New Title',
	collection_id: 'coll_xyz789',
});

// Batch delete feeds
await linkvite.rssFeeds.batchDelete(['rss_1', 'rss_2']);
```

### API Keys

```ts
// Get all API keys
const keys = await linkvite.apiKeys.getAll();

// Create an API key
// The returned object includes `secret` — this is the only time it's shown
const key = await linkvite.apiKeys.create({
	name: 'My API Key',
	scopes: ['read', 'write'],
});

// Update an API key
const key = await linkvite.apiKeys.update('key_abc123', {
	name: 'Updated Name',
});
```

### Parser

```ts
// Parse a URL to get its metadata
const parsed = await linkvite.parser.parseLink('https://example.com');
// parsed.title, parsed.description, parsed.image, parsed.favicon, parsed.site_name

// Import parsed links as bookmarks
await linkvite.parser.import({
	items: [parsed],
	collection: 'coll_xyz789', // optional
});
```

## Error Handling

All API errors throw a `LinkviteAPIError`:

```ts
import {LinkviteAPIError} from '@linkvite/js';

try {
	const bookmark = await linkvite.bookmarks.get('invalid-id');
} catch (err) {
	if (err instanceof LinkviteAPIError) {
		console.log(err.status); // HTTP status code
		console.log(err.message); // Error message from the API
		console.log(err.data); // Full error response
	}
}
```

## License

MIT License — see [LICENSE](LICENSE) for details.
