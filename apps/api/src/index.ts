import express from 'express';
import cors from 'cors';
import { headerRoutes } from './routes/headers';
import { passwordRoutes } from './routes/password';
import { breachRoutes } from './routes/breach';
import { domainRoutes } from './routes/domain';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/headers', headerRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/breach', breachRoutes);
app.use('/api/domain', domainRoutes);

app.listen(PORT, () => {
  console.log(`Watchpost API running on http://localhost:${PORT}`);
});
