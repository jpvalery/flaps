import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
	schema: 'prisma/schema.prisma',
	datasource: {
		// `prisma generate` doesn't connect, so it must work without a database URL
		url: process.env.DATABASE_URL ?? '',
	},
});
