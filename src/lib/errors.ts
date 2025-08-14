import { Context } from 'hono';
import { ApiResponse } from '../types/common';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  public validationErrors: { field: string; message: string }[];

  constructor(validationErrors: { field: string; message: string }[]) {
    super('Validation failed', 400);
    this.validationErrors = validationErrors;
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

export const errorHandler = async (
  c: Context,
  error: Error
): Promise<Response> => {
  console.error('Error:', error);

  if (error instanceof ValidationError) {
    const response: ApiResponse<null> = {
      success: false,
      message: error.message,
      errors: error.validationErrors
    };
    return c.json(response, error.statusCode as any);
  }

  if (error instanceof AppError) {
    const response: ApiResponse<null> = {
      success: false,
      message: error.message
    };
    return c.json(response, error.statusCode as any);
  }

  // Database errors
  if (
    error.message.includes('duplicate key') ||
    error.message.includes('unique constraint')
  ) {
    const response: ApiResponse<null> = {
      success: false,
      message: 'Resource already exists'
    };
    return c.json(response, 409);
  }

  if (error.message.includes('foreign key constraint')) {
    const response: ApiResponse<null> = {
      success: false,
      message: 'Referenced resource not found'
    };
    return c.json(response, 400);
  }

  // Generic error
  const response: ApiResponse<null> = {
    success: false,
    message: 'Internal server error'
  };
  return c.json(response, 500);
};

export const asyncHandler = (fn: Function) => {
  return async (c: Context) => {
    try {
      return await fn(c);
    } catch (error) {
      return errorHandler(c, error as Error);
    }
  };
};
