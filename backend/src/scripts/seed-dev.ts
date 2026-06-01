// DEV-ONLY seed: creates a test NP + patient + care-team link so the pipeline can be
// exercised with SYNTHETIC data. Refuses to run unless ALLOW_DEV_SEED=true.
// NEVER run against a database that holds real PHI.
import 'dotenv/config';
import { pool } from '../db';
import { hashPassword } from '../lib/crypto';

async function main() {
  if (process.env.ALLOW_DEV_SEED !== 'true') {
    console.error('refusing: set ALLOW_DEV_SEED=true to seed dev data');
    process.exit(1);
  }
  const npEmail = 'np@dev.local';
  const pw = 'dev-password-1234';

  const np = await pool.query(
    `INSERT INTO users (email, password_hash, role, full_name)
     VALUES ($1,$2,'np','Dev NP')
     ON CONFLICT (lower(email)) DO UPDATE SET full_name = EXCLUDED.full_name
     RETURNING id`,
    [npEmail, hashPassword(pw)]
  );
  const npId = np.rows[0].id;

  const patient = await pool.query(
    `INSERT INTO patients (display_name) VALUES ('Dev Patient') RETURNING id`
  );
  const patientId = patient.rows[0].id;

  await pool.query(
    `INSERT INTO care_team (user_id, patient_id, relation) VALUES ($1,$2,'np')
     ON CONFLICT DO NOTHING`,
    [npId, patientId]
  );

  console.log(JSON.stringify({ npEmail, password: pw, npId, patientId }, null, 2));
  await pool.end();
}

main();
