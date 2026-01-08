import 'dotenv/config';
import postgres from 'postgres';
import * as schema from './schema.js';
export declare const db: import("drizzle-orm/postgres-js").PostgresJsDatabase<typeof schema> & {
    $client: postgres.Sql<{}>;
};
export declare const migrationClient: postgres.Sql<{}>;
/** Transaction client type from db.transaction callback */
export type TransactionClient = Parameters<Parameters<typeof db.transaction>[0]>[0];
/** Either global db or transaction client - use this for functions that need to support both */
export type DbLike = typeof db | TransactionClient;
