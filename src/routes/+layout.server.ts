import type { ServerLoadEvent } from '@sveltejs/kit';
import { trpc, router, createContext } from '$lib/server/trpc';

export async function load(event: ServerLoadEvent) {
	const ctx = await createContext(event);
	const createCaller = trpc.createCallerFactory(router);
	const caller = createCaller(ctx);
	return {
		list: await caller.list.getAll()
	};
}
