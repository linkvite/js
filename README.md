# @linkvite/js

🤠 Javascript SDK for Linkvite. Requires Node.js 12+. Inspired by [Hop](https://github.com/hopinc/js)

## Usage

NB: Only pro accounts can use the API with an API key. If you're on a free account, you'll need to use a personal access token.

Create an [API key](https://docs.linkvite.io/reference/api-key) or personal access token.

```ts
import {Linkvite} from '@linkvite/js';

// with API key
const myKey = 'random-super-secret-key';
const linkvite = new Linkvite(myKey);
// or
const linkvite = new Linkvite({key: myKey});

// or with personal access token
const myToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
const linkvite = new Linkvite({
	token: myToken,
});

// example: Creating a new bookmark
const bookmark = await linkvite.bookmarks.create('https://example.com');

// or
const bookmark = await linkvite.bookmarks.createFromEntry({
	title: 'My Bookmark',
	url: 'https://example.com',
	tags: ['example', 'test'],
});

// example: Sending a collection invite.
const invite = await linkvite.invites.create({
	collection: 'id-of-my-collection',
	recipients: ['john-doe', 'jane@doe.com'], // usernames or emails
	message: 'Check out my collection!',
	role: 'viewer', // viewer, or admin. defaults to viewer.
});
```

Access token expires after 30 minutes. You can refresh it with `linkvite.refreshToken()`. This will return new access and refresh tokens, and also update the `token` property on the `Linkvite` instance.
