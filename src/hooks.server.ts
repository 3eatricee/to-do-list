import { router, createContext, createTRPCHandle } from '$lib/server/trpc';
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';

const auth: Handle = async ({ event, resolve }) => {
	return await resolve(event);
};

const trpc: Handle = createTRPCHandle({ router, createContext });

export const handle = sequence(auth, trpc);
