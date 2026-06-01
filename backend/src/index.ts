import 'dotenv/config';
import './types';
import 'express-async-errors'; // route async throws to the error middleware (don't crash the process)
import express from 'express';
import cors from 'cors';
import { pool } from './db';
import { PHI_ENABLED } from './middleware/phiGate';
import authRoutes from './routes/auth';
import intakeRoutes from './routes/intake';
import pipelineRoutes from './routes/pipeline';

const app = express();
app.set('trust proxy', true); // behind Caddy; needed for correct req.ip in the audit log
app.use(express.json({ limit: '2mb' }));

// CORS: only the authenticated PHI frontend origin — NOT the public demo.
const origin = process.env.CORS_ORIGIN;
app.use(cors({ origin: origin ? origin.split(',') : false, credentials: true }));

// Health + readiness (no PHI; safe for the gated proxy to probe).
app.get('/', (_req, res) => res.json({ status: 'ok', service: 'aifamilyfirst-backend', phiEnabled: PHI_ENABLED }));
app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'up', phiEnabled: PHI_ENABLED });
  } catch {
    res.status(503).json({ status: 'degraded', db: 'down' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/intake', intakeRoutes);
app.use('/api/pipeline', pipelineRoutes);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[error]', err);
  res.status(500).json({ error: 'internal_error' });
});

const PORT = Number(process.env.PORT) || 4003;
const HOST = process.env.BIND_HOST || '127.0.0.1'; // loopback only; never 0.0.0.0 for PHI
app.listen(PORT, HOST, () => {
  console.log(`aifamilyfirst-backend on ${HOST}:${PORT} (PHI_ENABLED=${PHI_ENABLED})`);
  if (!PHI_ENABLED) console.log('PHI endpoints are GATED OFF until the HIPAA-GAP.md checklist is cleared.');
});
