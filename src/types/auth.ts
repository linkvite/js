import type {User} from './user';
import type {Endpoint} from '../rest';

type AuthRefreshResponse = {
	user: User;
	accessToken: string;
	refreshToken: string;
};

export type AuthEndpoints = Endpoint<
	'POST',
	'v1/auth/token/refresh',
	AuthRefreshResponse,
	{refreshToken: string}
>;
