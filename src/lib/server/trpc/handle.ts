import { resolveResponse } from '@trpc/server/http';
import type { Handle, RequestEvent } from '@sveltejs/kit';
import type { inferRouterContext } from '@trpc/server';
import type { AppRouter } from '$lib/server/trpc/router';
import type { CookieSerializeOptions } from 'cookie';

type SetCookieArgs = [name: string, value: string, opts: CookieSerializeOptions & { path: string }];

export function createTRPCHandle<Router extends AppRouter>({
	router,
	url = '/api/trpc',
	createContext
}: {
	router: Router;
	url?: string;
	createContext: (event: RequestEvent) => Promise<inferRouterContext<Router>>;
}): Handle {
	return async ({ event, resolve }) => {
		if (event.url.pathname.startsWith(url)) {
			const addedCookies: SetCookieArgs[] = [];

			event.cookies.set = new Proxy(event.cookies.set, {
				apply(target, ref, args: SetCookieArgs) {
					target.apply(ref, args);
					addedCookies.push(args);
				}
			});

			const httpResponse = await resolveResponse({
				router,
				req: event.request,
				path: event.url.pathname.substring(url.length + 1),
				createContext: async () => createContext(event),
				error: null
			});

			const { status, headers, body } = httpResponse;

			const response = new Response(body, { status, headers });

			addedCookies.forEach((cookie) => {
				response.headers.append('Set-Cookie', event.cookies.serialize(...cookie));
			});

			return response;
		}

		return resolve(event);
	};
}
