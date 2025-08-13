import { CreateSlug, GenerateId, FormatDate } from '../types';

export const createSlug: CreateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

export const generateId: GenerateId = (): string => {
  return crypto.randomUUID();
};

export const formatDate: FormatDate = (date: Date): string => {
  return date.toISOString();
};

export const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization - in production, use a proper library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/g, '') // Remove event handlers
    .replace(/javascript:/gi, ''); // Remove javascript: URLs
};

export const extractExcerpt = (content: string, length = 150): string => {
  const plainText = content.replace(/<[^>]*>/g, ''); // Strip HTML tags
  return plainText.length > length
    ? plainText.substring(0, length) + '...'
    : plainText;
};

export const parseSearchQuery = (query: string): string[] => {
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length > 2) // Filter out short terms
    .slice(0, 10); // Limit to 10 terms
};

export const calculateOffset = (page: number, limit: number): number => {
  return (page - 1) * limit;
};

export const buildPaginationMeta = (
  total: number,
  page: number,
  limit: number
) => {
  const totalPages = Math.ceil(total / limit);

  return {
    total,
    page,
    limit,
    totalPages,
    pages: totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null
  };
};
