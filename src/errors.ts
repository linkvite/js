export interface LinkviteErrorInit {
	status: number;
	message: string;
	method: string;
	url: string;
	/** OAuth error code (invalid_grant, ...) on OAuth endpoints. */
	code?: string;
	errors?: Record<string, string>;
	requestId?: string;
	body?: unknown;
	cause?: unknown;
}

/**
 * Any failed request. `status` is 0 for network errors and timeouts.
 * Quote `requestId` when contacting support.
 */
export class LinkviteError extends Error {
	readonly status: number;
	readonly method: string;
	readonly url: string;
	readonly code?: string;
	/** Field → problem, for validation errors (400). */
	readonly errors?: Record<string, string>;
	readonly requestId?: string;
	readonly body?: unknown;

	constructor(init: LinkviteErrorInit) {
		super(
			init.message,
			init.cause === undefined ? undefined : {cause: init.cause},
		);
		this.name = 'LinkviteError';
		this.status = init.status;
		this.method = init.method;
		this.url = init.url;
		this.code = init.code;
		this.errors = init.errors;
		this.requestId = init.requestId;
		this.body = init.body;
	}

	get isUnauthorized() {
		return this.status === 401;
	}
	get isForbidden() {
		return this.status === 403;
	}
	get isNotFound() {
		return this.status === 404;
	}
	get isRateLimited() {
		return this.status === 429;
	}
	/** 402: the action needs Linkvite Pro. */
	get isProRequired() {
		return this.status === 402;
	}
}
