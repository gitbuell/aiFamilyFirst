import 'dotenv/config';
import { Pool } from 'pg';

// Dedicated, ISOLATED PHI database — never the shared enterprise-postgres.
export const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT) || 5432,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  // TLS to the DB in production (§164.312(e)(1) transmission security).
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
});
