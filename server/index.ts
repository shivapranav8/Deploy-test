import express from 'express';
import cors from 'cors';
import cookieSession from 'cookie-session';
import dotenv from 'dotenv';
import path from 'path';
import { router } from './routes';
import { frdRouter } from './routes/frdRoutes';
import { prdGeneratorRouter } from './routes/prdGeneratorRoutes';
import { pmBuddyRouter } from './routes/pmBuddyRoutes';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const app = express();
const PORT = process.env.X_ZOHO_CATALYST_LISTEN_PORT || process.env.PORT || 8080;

console.log('🚀 Starting server...');
console.log('Environment:', process.env.NODE_ENV);
console.log('Target Port:', PORT);

// In production, frontend + backend are served from the same origin — CORS not needed.
// In dev, Vite proxy handles /api → localhost:5001, so CORS is still same-origin.
// We keep the header for explicit cross-origin dev setups.
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

// Log every request to debug routing issues in production
app.use((req, res, next) => {
    console.log(`[ROUTING DEBUG] ${req.method} req.url=${req.url} req.originalUrl=${req.originalUrl}`);
    next();
});

// Explicit test route mapping
app.get('/api/auth/login-debug', (req, res) => {
    res.json({ message: 'Debug route reached. Catalyst routing is intact.' });
});

// cookie-session stores the session IN the cookie (signed) — survives server restarts
app.use(cookieSession({
    name: 'session',
    secret: process.env.SESSION_SECRET || 'pm-buddy-dev-secret-change-in-production',
    httpOnly: true,
    secure: isProduction,       // HTTPS only in production
    sameSite: isProduction ? 'lax' : 'lax', // 'lax' works for same-site OAuth redirects
    maxAge: 8 * 60 * 60 * 1000, // 8 hours
}));

// Check for API Keys
if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  OPENAI_API_KEY is missing in .env');
}
if (!process.env.TAVILY_API_KEY) {
    console.warn('⚠️  TAVILY_API_KEY is missing in .env');
}
const zohoClientId = process.env.ZOHO_CLIENT_ID || process.env.ZOHO_DESK_CLIENT_ID;
if (!zohoClientId) {
    console.warn('⚠️  No Zoho OAuth client ID found — per-user auth will not work. Set ZOHO_CLIENT_ID in .env.');
} else {
    console.log('✅ Zoho OAuth client ready (using', process.env.ZOHO_CLIENT_ID ? 'ZOHO_CLIENT_ID' : 'ZOHO_DESK_CLIENT_ID', ')');
}

app.use('/api', router);
app.use('/api/frd', frdRouter);
app.use('/api/prd-generator', prdGeneratorRouter);
app.use('/api/pm-buddy', pmBuddyRouter);

if (isProduction) {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.use((req, res) => {
        // [ROUTING DEBUG] Explicitly catch leaked API requests
        if (req.originalUrl.startsWith('/api')) {
            console.error(`🔴 [API LEAKED TO STATIC] ${req.method} ${req.originalUrl} - This should have been handled by the router.`);
            return res.status(404).json({
                error: 'API endpoint not found',
                method: req.method,
                originalUrl: req.originalUrl,
                tip: 'Check server/index.ts and server/routes.ts to ensure this path is registered.'
            });
        }

        if (req.method === 'POST') {
            return res.status(200).json({
                error: 'Static fallback reached on POST request',
                method: req.method,
                url: req.url,
                originalUrl: req.originalUrl,
                path: req.path,
                headers: req.headers
            });
        }
        res.sendFile(path.join(distPath, 'index.html'));
    });
} else {
    app.get('/', (_req, res) => {
        res.send('PM Co-pilot Backend is Running 🤖');
    });
}

// Export for Vercel
export default app;

// Only listen if this file is run directly (not as a module/Vercel function)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
    });
}
