import superjson from 'superjson';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '$lib/server/trpc/router';

export const client = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			url: '/api/trpc',
			transformer: superjson
		})
	]
});
