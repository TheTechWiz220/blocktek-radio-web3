const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const walletRoutes = require('./routes/wallet');
const uploadRoutes = require('./routes/upload');
const adminRoutes = require('./routes/admin');
const db = require('./db');

const app = express();
// Basic request logging middleware
app.use((req, res, next) => {
	const start = Date.now();
	// capture request details
	const { method, url } = req;
	const ip = req.ip || req.connection?.remoteAddress || req.headers['x-forwarded-for'] || 'unknown';
	let bodySnippet = undefined;
	try {
		if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
			// avoid logging huge bodies
			const raw = JSON.stringify(req.body || {});
			bodySnippet = raw.length > 1000 ? raw.slice(0, 1000) + '...[truncated]' : raw;
		}
	} catch (e) {
		bodySnippet = '[unreadable]';
	}

	res.on('finish', () => {
		const duration = Date.now() - start;
		console.log(`[${new Date().toISOString()}] ${method} ${url} ${res.statusCode} - ${duration}ms - ip=${ip}` + (bodySnippet ? ` body=${bodySnippet}` : ''));
	});
	next();
});

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api', profileRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));

// global error handlers
process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
	console.error('Uncaught Exception:', err);
});

// express error handler (last middleware)
app.use((err, req, res, next) => {
	console.error('Express error handler:', err && err.stack ? err.stack : err);
	if (res.headersSent) return next(err);
	res.status(500).json({ error: 'Server error' });
});
