import { drizzle } from "drizzle-orm/libsql";
import { createClient } from '@libsql/client';
import config from '../../drizzle.config';
import * as schema from './schema';

/**
 * Database Connection Setup
 * 
 * This file acts as the singleton entry point for the database connection.
 * It bridges the low-level LibSQL client with the Drizzle ORM.
 */

// --------------------------------------------------------------------------
// 1. Initialize the Low-Level Driver
// --------------------------------------------------------------------------
// We use @libsql/client here (compatible with Turso or local SQLite files).
// 
// Note on (config as any):
// We are casting the imported drizzle.config because TypeScript might not 
// perfectly infer the structure of the default export from the config file.
// We are extracting the 'url' directly from the credentials defined there
// to keep our secrets in one place (.env via drizzle.config).
const client = createClient({ url: (config as any).dbCredentials.url});

// --------------------------------------------------------------------------
// 2. Initialize Drizzle ORM
// --------------------------------------------------------------------------
// We wrap the raw client with Drizzle to get the type-safe query builder.
// 
// Important: We pass { schema } as the second argument.
// This is CRITICAL. Without this, the 'Relational Queries' API (e.g., db.query.users.findMany)
// will NOT work. It allows Drizzle to know about the graph of our tables 
// and relationships.
export const db = drizzle(client, {schema});
