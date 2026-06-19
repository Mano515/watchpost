import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { headerRoutes } from './routes/headers';
import { passwordRoutes } from './routes/password';
import { breachRoutes } from './routes/breach';
import { domainRoutes } from './routes/domain';
import { vulnRoutes } from './routes/vuln';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 60_000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests — please wait a minute before trying again.' },
});
app.use('/api', limiter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/headers', headerRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/breach', breachRoutes);
app.use('/api/domain', domainRoutes);
app.use('/api/vuln', vulnRoutes);

app.listen(PORT, () => {
  console.log(`Watchpost API running on http://localhost:${PORT}`);
});
