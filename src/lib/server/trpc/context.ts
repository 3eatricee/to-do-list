import superjson from 'superjson';
import { initTRPC } from '@trpc/server';
import type { RequestEvent } from '@sveltejs/kit';

export async function createContext(event: RequestEvent) {
	return {
		...event
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;

export const trpc = initTRPC.context<Context>().create({
	transformer: superjson
});
