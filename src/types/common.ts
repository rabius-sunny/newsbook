// Common types used throughout the application

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message: string;
  errors?: { field: string; message: string }[];
  timestamp?: string;
  requestId?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: PaginationMeta;
  filters?: Record<string, any>;
}

export interface SearchParams {
  search?: string;
  category?: string;
  tag?: string;
  author?: string;
  published?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DatabaseError extends Error {
  code?: string;
  detail?: string;
  constraint?: string;
}

export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  responseTime: number;
  database: {
    status: 'connected' | 'disconnected';
    responseTime: number;
    error?: string;
  };
  memory: {
    used: number;
    total: number;
  };
}
