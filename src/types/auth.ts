import type {User} from './user';
import type {Endpoint} from '../rest';

export type LoginResult = {
	user: User;
	access_token: string;
	refresh_token: string;
};

export type LoginEntry = {
	identifier: string;
	password: string;
};

export type AuthEndpoints =
	| Endpoint<'POST', 'v1/auth/login', LoginResult, LoginEntry>
	| Endpoint<
			'POST',
			'v1/auth/token/refresh',
			LoginResult,
			{refresh_token: string}
	  >;
