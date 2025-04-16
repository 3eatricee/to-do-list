import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { POSTGRES_URL } from '$env/static/private';
import * as schema from '$lib/server/drizzle/schema';

const client = postgres(POSTGRES_URL);

export const db = drizzle(client, {
	schema: schema
});
