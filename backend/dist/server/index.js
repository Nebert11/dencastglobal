import 'dotenv/config';
import path from 'node:path';
import cors from 'cors';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import { closePool } from './db.js';
import { registerApi } from './api.js';
const app = express();
const port = Number(process.env.PORT || 3001);
const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim());
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use('/uploads', (_request, response, next) => {
    response.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
}, express.static(path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads')), {
    dotfiles: 'deny',
    index: false,
    maxAge: '1d',
}));
app.use('/api/auth/login', rateLimit({ windowMs: 15 * 60 * 1000, limit: 20 }));
app.use('/api/data', rateLimit({ windowMs: 10 * 60 * 1000, limit: 120 }));
app.get('/', (_request, response) => {
    response.json({
        service: 'Dencast SQL API',
        health: '/api/health',
        endpoints: ['/api/auth/login', '/api/auth/me', '/api/data', '/api/media/images'],
    });
});
registerApi(app);
app.listen(port, () => {
    console.log(`Dencast SQL API listening on http://localhost:${port}`);
});
for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => {
        void closePool().finally(() => process.exit(0));
    });
}
