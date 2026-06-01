import {db} from '../db/index';

// Re-exports the database schema for easy access in 
// other parts of the app
export * as schema from '../db/schema';

// Provides a simple hook to access the Drizzle DB 
// instance (for queries in server routes/plugins)
export const useDb = ()=> db;