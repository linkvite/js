import { APIClient } from '../rest/client';

// TODO: Add `const T` here when esbuild supports it
export function sdk<T>(builder: (client: APIClient) => T) {
    return builder;
}