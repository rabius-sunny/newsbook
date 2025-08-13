import { Context } from 'hono';

// Re-export all types from other modules
export * from './common';

// Environment configuration
export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl?: boolean;
}

export interface ServerConfig {
  port: number;
  host: string;
  environment: 'development' | 'production';
}

export interface AppConfig {
  database: DatabaseConfig;
  server: ServerConfig;
  cors: {
    origins: string[];
    credentials: boolean;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
}

// Service response types
export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: number;
}

// Controller types
export interface Controller {
  [key: string]: (c: Context) => Promise<Response>;
}

// Validation types
export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'email' | 'uuid';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Middleware types
export interface AuthenticatedContext extends Context {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

// Utility types
export type CreateSlug = (text: string) => string;
export type GenerateId = () => string;
export type FormatDate = (date: Date) => string;
