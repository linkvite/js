import type {User} from './user';
import type {Endpoint} from '../rest';

type AuthRefreshResponse = {
	user: User;
	access_token: string;
	refresh_token: string;
};

export type AuthEndpoints = Endpoint<
	'POST',
	'v1/auth/token/refresh',
	AuthRefreshResponse,
	{refresh_token: string}
>;
