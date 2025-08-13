import { ValidationRule, ValidationError } from '../types';

export const validateInput = (
  data: any,
  rules: ValidationRule[]
): ValidationError[] => {
  const errors: ValidationError[] = [];

  for (const rule of rules) {
    const value = data[rule.field];

    // Required field validation
    if (
      rule.required &&
      (value === undefined || value === null || value === '')
    ) {
      errors.push({
        field: rule.field,
        message: `${rule.field} is required`
      });
      continue;
    }

    // Skip other validations if field is empty and not required
    if (
      !rule.required &&
      (value === undefined || value === null || value === '')
    ) {
      continue;
    }

    // Type validation
    if (rule.type) {
      switch (rule.type) {
        case 'string':
          if (typeof value !== 'string') {
            errors.push({
              field: rule.field,
              message: `${rule.field} must be a string`
            });
          }
          break;
        case 'number':
          if (typeof value !== 'number' && !Number.isInteger(Number(value))) {
            errors.push({
              field: rule.field,
              message: `${rule.field} must be a number`
            });
          }
          break;
        case 'boolean':
          if (typeof value !== 'boolean') {
            errors.push({
              field: rule.field,
              message: `${rule.field} must be a boolean`
            });
          }
          break;
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.push({
              field: rule.field,
              message: `${rule.field} must be a valid email address`
            });
          }
          break;
        case 'uuid':
          const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
          if (!uuidRegex.test(value)) {
            errors.push({
              field: rule.field,
              message: `${rule.field} must be a valid UUID`
            });
          }
          break;
      }
    }

    // Length validation
    if (
      rule.minLength &&
      typeof value === 'string' &&
      value.length < rule.minLength
    ) {
      errors.push({
        field: rule.field,
        message: `${rule.field} must be at least ${rule.minLength} characters long`
      });
    }

    if (
      rule.maxLength &&
      typeof value === 'string' &&
      value.length > rule.maxLength
    ) {
      errors.push({
        field: rule.field,
        message: `${rule.field} must be at most ${rule.maxLength} characters long`
      });
    }

    // Pattern validation
    if (
      rule.pattern &&
      typeof value === 'string' &&
      !rule.pattern.test(value)
    ) {
      errors.push({
        field: rule.field,
        message: `${rule.field} format is invalid`
      });
    }
  }

  return errors;
};

export const validatePagination = (page?: string, limit?: string) => {
  const pageNum = page ? parseInt(page) : 1;
  const limitNum = limit ? parseInt(limit) : 10;

  const errors: ValidationError[] = [];

  if (pageNum < 1) {
    errors.push({
      field: 'page',
      message: 'Page must be greater than 0'
    });
  }

  if (limitNum < 1 || limitNum > 100) {
    errors.push({
      field: 'limit',
      message: 'Limit must be between 1 and 100'
    });
  }

  return {
    page: Math.max(1, pageNum),
    limit: Math.min(100, Math.max(1, limitNum)),
    errors
  };
};
