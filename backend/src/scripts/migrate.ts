// Minimal forward-only migration runner. Applies every migrations/*.sql in order,
// tracking applied files in a schema_migrations table. Idempotent.
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { pool } from '../db';

async function main() {
  await pool.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    filename TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())`);

  const dir = path.resolve(__dirname, '../../migrations');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort();

  for (const file of files) {
    const { rowCount } = await pool.query(`SELECT 1 FROM schema_migrations WHERE filename = $1`, [file]);
    if (rowCount) { console.log(`skip   ${file}`); continue; }
    const sql = fs.readFileSync(path.join(dir, file), 'utf8');
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query(`INSERT INTO schema_migrations (filename) VALUES ($1)`, [file]);
      await client.query('COMMIT');
      console.log(`apply  ${file}`);
    } catch (e) {
      await client.query('ROLLBACK');
      console.error(`FAILED ${file}`, e);
      process.exit(1);
    } finally {
      client.release();
    }
  }
  console.log('migrations complete');
  await pool.end();
}

main();
