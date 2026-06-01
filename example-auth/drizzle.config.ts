import { defineConfig } from 'drizzle-kit';

// Configuration for Drizzle Kit,
// used for managing database schemas and migrations
export default defineConfig({
  // Specifies the database dialect (SQLite in this case,
  // lightweight and file-based)
  dialect: 'sqlite',
  
  // Path to the schema file where database tables and relations are defined
  schema: './server/db/schema.ts',
  
  // Output directory for generated migration files
  out: './server/db/migrations',
  
  // Database connection credentials
  dbCredentials: {
    // URL for the SQLite database file (creates .data/sqlite.db if it doesn't exist)
    url: 'file:./.data/sqlite.db',
  }
});