import { Pool, type PoolClient } from '@neondatabase/serverless';
import { env } from 'node:process';
import { ApiError } from './http';

let pool: Pool | undefined;

export function getDatabasePool(): Pool {
  if (!env.DATABASE_URL) {
    throw new ApiError(503, 'The payment database is not configured.');
  }

  pool ??= new Pool({
    connectionString: env.DATABASE_URL,
    max: 1,
    idleTimeoutMillis: 5_000
  });
  return pool;
}

export async function withTransaction<T>(
  run: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getDatabasePool().connect();
  try {
    await client.query('BEGIN');
    const result = await run(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
