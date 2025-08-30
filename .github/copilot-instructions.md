# Bengali News Application - AI Coding Agent Instructions

## Architecture Overview

This is a traditional Bengali newspaper backend API (similar to Prothom Alo) built with:

- **Runtime**: Bun with TypeScript
- **Framework**: Hono (Express-like but lightweight)
- **Database**: PostgreSQL with Drizzle ORM
- **Containerization**: Docker Compose for development

### Core Components

- **Modular Schema Design**: Database schemas split across `src/db/schemas/` - `core.ts` (users, categories, tags), `content.ts` (articles), `engagement.ts` (comments), `business.ts` (newsletters, ads)
- **Service Layer Pattern**: All business logic in `src/services/` with consistent `ServiceResult<T>` wrapper
- **Controller-Route Separation**: Controllers in `src/controllers/` handle HTTP, routes in `src/routes/` define endpoints
- **Type-First Approach**: Comprehensive types in `src/types/` with `ApiResponse<T>` for all endpoints

## Bengali Content Conventions

**Critical**: This app handles Bengali (বাংলা) content extensively:

- All user-facing content has Bengali fields (categories: `name` field contains Bengali text like "রাজনীতি", "অর্থনীতি")
- Articles contain Bengali titles, content, and location data (e.g., `location: "ঢাকা"`)
- Database seeding in `src/db/seed.ts` shows proper Bengali text patterns
- Always preserve Bengali UTF-8 encoding when working with content

## Development Workflow

### Essential Commands

```bash
# Database operations (most common workflow)
bun run db:generate         # Generate database schema
bun run docker:dev          # Starts PostgreSQL + app containers
bun run db:migrate          # Run pending migrations
bun run db:seed             # Populate with Bengali sample data

# Development
bun run dev                 # Hot reload development server
bun run docker:logs         # Monitor container logs

# Database reset (when schema changes)
bun run db:reset            # Equivalent to docker:down + docker:dev
```

### Database Schema Patterns

**Key Insight**: Articles table is the central entity with these critical fields:

- `isFeatured`/`isBreaking`: Boolean flags for homepage placement
- `priority`: Integer 1-10 for content ranking
- `status`: Text enum ('draft', 'review', 'published', 'archived')
- `location`: Bengali text for news location
- Multiple timestamp fields: `createdAt`, `updatedAt`, `publishedAt`, `scheduledAt`

**Relationship Patterns**:

```typescript
// Articles have many-to-many with tags via articleTags junction table
// Articles belong to categories (hierarchical with parentId)
// Comments belong to articles with soft moderation fields
```

## Code Patterns & Conventions

### Service Layer Response Pattern

All services return `ServiceResult<T>` wrapper:

```typescript
interface ServiceResult<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<string | { field: string; message: string }>;
  meta?: { page; limit; total; totalPages }; // For paginated results
}
```

### Database Querying Style

Uses Drizzle ORM with SQL-like syntax:

```typescript
// Typical pattern in ArticleService
const result = await db
  .select()
  .from(articles)
  .leftJoin(categories, eq(articles.categoryId, categories.id))
  .where(
    and(eq(articles.isPublished, true), like(articles.title, `%${query}%`))
  )
  .orderBy(desc(articles.publishedAt));
```

### Route Mounting Structure

Routes are mounted in `src/routes/index.ts` with `/api` prefix:

- Articles: `/api/articles` (includes `/featured`, `/breaking` sub-routes)
- Categories: `/api/categories` (includes `/popular`, `/with-count`)
- Comments: `/api/comments`
- Health: `/api/health`

### Error Handling Pattern

Controllers use try-catch with consistent error response:

```typescript
catch (error) {
  const response: ApiResponse = {
    success: false,
    message: 'Internal server error',
    errors: [error instanceof Error ? error.message : 'Unknown error']
  };
  return c.json(response, 500);
}
```

## Integration Points

### Docker Development Environment

- PostgreSQL runs on port 5433 (not 5432) to avoid conflicts
- Database URL: `postgresql://postgres:password@localhost:5433/newspaper`
- App container mounts source code for hot reload
- Health checks ensure database readiness before app startup

### Database Indexing Strategy

Heavy indexing on search/filter fields:

- Articles: `slug`, `status`, `isPublished`, `categoryId`, `authorId`, `isFeatured`, `isBreaking`
- Categories: `slug`, `name`
- Comments: `articleId`

## Common Debugging Patterns

### Database Connection Issues

```bash
# Check container health
docker compose logs postgres
bun run test:api  # Quick health check via curl
```

### Migration Problems

```bash
# When schema changes don't apply
bun run db:reset  # Nuclear option: rebuilds everything
```

### Missing Data During Development

```bash
bun run db:seed   # Re-populate with Bengali sample articles/categories
```

## Key Files for Context

- **`src/db/schemas/`**: Understanding the data model requires reading ALL schema files
- **`src/db/seed.ts`**: Shows realistic Bengali content patterns and data relationships
- **`postman_collection.json`**: API contract documentation
- **`src/types/common.ts`**: Core response/pagination patterns used everywhere
- **`docker-compose.yml`**: Development environment configuration

## Project-Specific Gotchas

1. **Route Mounting**: New routes in `src/routes/` must be manually imported/mounted in `src/routes/index.ts`
2. **Bengali Content**: Always test with actual Bengali text, not placeholder English
3. **Docker Port**: Database runs on 5433, not standard 5432
4. **Service Pattern**: Never put business logic in controllers - always use service classes
5. **Migration Flow**: Schema changes require `db:generate` → `db:migrate` → potentially `db:seed`
