import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const { POSTGRES_URL } = process.env;

if (!POSTGRES_URL) {
	throw new Error('POSTGRES_URL missing from .env');
}

export default defineConfig({
	out: './migrations',
	schema: './src/lib/server/drizzle/schema.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: POSTGRES_URL
	}
});
