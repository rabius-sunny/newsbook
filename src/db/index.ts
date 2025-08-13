import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Environment variables
const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5432/news_paper_dev';

// Production-optimized connection options
const connectionOptions = {
  max: process.env.NODE_ENV === 'production' ? 25 : 5, // Connection pool size
  idle_timeout: process.env.NODE_ENV === 'production' ? 60 : 20, // Idle timeout in seconds
  connect_timeout: 30, // Connection timeout in seconds
  statement_timeout: 60, // Query timeout in seconds
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  // Production performance optimizations
  prepare: process.env.NODE_ENV === 'production',
  transform: {
    undefined: null
  },
  // Connection retry settings
  connection: {
    application_name: 'news-paper-api'
  }
};

// Create connection
const queryClient = postgres(DATABASE_URL, connectionOptions);

// Create drizzle instance
export const db = drizzle(queryClient, {
  schema,
  logger: process.env.NODE_ENV === 'development'
});

// Health check function
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await queryClient`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Graceful shutdown
export async function closeDatabaseConnection(): Promise<void> {
  await queryClient.end();
}
