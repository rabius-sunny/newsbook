import { Hono } from 'hono';
import { db } from '../db';
import { count, sql } from 'drizzle-orm';

const metricsRouter = new Hono();

// GET /metrics - System performance metrics
metricsRouter.get('/', async (c) => {
  try {
    const startTime = Date.now();

    // Get basic database stats in parallel

    // Get database performance stats (if available)
    let dbStats = null;
    try {
      const dbStatsResult = await db.execute(sql`
        SELECT 
          datname as database_name,
          numbackends as active_connections,
          xact_commit as transactions_committed,
          xact_rollback as transactions_rolled_back,
          blks_read as blocks_read,
          blks_hit as blocks_hit,
          tup_returned as tuples_returned,
          tup_fetched as tuples_fetched,
          tup_inserted as tuples_inserted,
          tup_updated as tuples_updated,
          tup_deleted as tuples_deleted
        FROM pg_stat_database 
        WHERE datname = current_database()
      `);

      if (Array.isArray(dbStatsResult) && dbStatsResult.length > 0) {
        const stats = dbStatsResult[0] as any;
        dbStats = {
          activeConnections: stats.active_connections || 0,
          transactionsCommitted: stats.transactions_committed || 0,
          transactionsRolledBack: stats.transactions_rolled_back || 0,
          cacheHitRatio:
            ((stats.blocks_hit || 0) /
              ((stats.blocks_hit || 0) + (stats.blocks_read || 1))) *
            100,
          tuplesReturned: stats.tuples_returned || 0,
          tuplesFetched: stats.tuples_fetched || 0,
          tuplesInserted: stats.tuples_inserted || 0,
          tuplesUpdated: stats.tuples_updated || 0,
          tuplesDeleted: stats.tuples_deleted || 0
        };
      }
    } catch (error) {
      // DB stats not available (might not have permissions)
      console.warn(
        'Could not fetch database stats:',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }

    const queryTime = Date.now() - startTime;

    const metrics = {
      timestamp: new Date().toISOString(),
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        memory: {
          used:
            Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) /
            100,
          total:
            Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) /
            100,
          external:
            Math.round((process.memoryUsage().external / 1024 / 1024) * 100) /
            100
        },
        uptime: Math.round(process.uptime())
      },
      database: {
        queryTime: `${queryTime}ms`,
        stats: dbStats,
        counts: {
          // Counts total rows in all tables
        }
      },
      performance: {
        queryTime,
        healthy: queryTime < 1000 // Consider healthy if queries take less than 1s
      }
    };

    return c.json(metrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return c.json({ error: 'Failed to fetch metrics' }, 500);
  }
});

// GET /metrics/slow-queries - Get slow query stats (production only)
metricsRouter.get('/slow-queries', async (c) => {
  if (process.env.NODE_ENV !== 'production') {
    return c.json(
      { error: 'This endpoint is only available in production' },
      403
    );
  }

  try {
    const slowQueries = await db.execute(sql`
      SELECT 
        query,
        calls,
        total_exec_time,
        mean_exec_time,
        max_exec_time,
        rows,
        100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0) AS hit_percent
      FROM pg_stat_statements
      WHERE mean_exec_time > 100  -- queries taking more than 100ms on average
      ORDER BY total_exec_time DESC
      LIMIT 10
    `);

    return c.json({
      slowQueries: Array.isArray(slowQueries)
        ? slowQueries.map((row: any) => ({
            query:
              row.query?.substring(0, 200) +
              (row.query?.length > 200 ? '...' : ''),
            calls: row.calls || 0,
            totalTime: Math.round((row.total_exec_time || 0) * 100) / 100,
            meanTime: Math.round((row.mean_exec_time || 0) * 100) / 100,
            maxTime: Math.round((row.max_exec_time || 0) * 100) / 100,
            rows: row.rows || 0,
            hitPercent: Math.round((row.hit_percent || 0) * 100) / 100
          }))
        : []
    });
  } catch (error) {
    console.error('Error fetching slow queries:', error);
    return c.json({ error: 'Failed to fetch slow query stats' }, 500);
  }
});

// GET /metrics/table-sizes - Get table size information
metricsRouter.get('/table-sizes', async (c) => {
  try {
    const tableSizes = await db.execute(sql`
      SELECT 
        schemaname||'.'||tablename as table_name,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size_pretty,
        pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
    `);

    return c.json({
      tables: Array.isArray(tableSizes)
        ? tableSizes.map((row: any) => ({
            name: row.table_name || 'unknown',
            size: row.size_pretty || 'unknown',
            bytes: parseInt(row.size_bytes) || 0
          }))
        : []
    });
  } catch (error) {
    console.error('Error fetching table sizes:', error);
    return c.json({ error: 'Failed to fetch table sizes' }, 500);
  }
});

export default metricsRouter;
