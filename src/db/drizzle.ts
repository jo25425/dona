import 'dotenv/config';
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as donaSchema from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: false
});

export const db = drizzle({ client: pool, schema: donaSchema});