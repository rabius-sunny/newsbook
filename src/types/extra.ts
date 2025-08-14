// Small helper types used across the project

export type CreateSlug = (input: string) => string;
export type GenerateId = () => string;
export type FormatDate = (d: Date) => string;

export interface ValidationRule {
  field: string;
  validate?: (value: any) => boolean;
  message?: string;
  required?: boolean;
  type?:
    | 'string'
    | 'number'
    | 'boolean'
    | 'array'
    | 'object'
    | 'email'
    | 'uuid';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface AppConfig {
  database?: {
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    database?: string;
    ssl?: boolean;
  };
  server?: {
    port?: number;
    host?: string;
    environment?: 'development' | 'production' | 'test';
  };
  cors?: {
    origins?: string[];
    credentials?: boolean;
  };
  rateLimit?: {
    windowMs?: number;
    maxRequests?: number;
  };
}

// Database error shape
export interface DatabaseError {
  code?: string;
  detail?: string;
  table?: string;
  constraint?: string;
  message?: string;
}
