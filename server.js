import express from 'express';
import session from 'express-session';
import { fileURLToPath } from 'url';
import path from 'path';

import { testConnection } from './src/models/db.js';
import router from './src/routes.js';
import flash from './src/middleware/flash.js';

// Environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret';

if (!process.env.SESSION_SECRET) {
    console.warn(
        'Warning: SESSION_SECRET is not set. Using default development secret.'
    );
}

// Current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/**
 * -----------------------------
 * Express Configuration
 * -----------------------------
 */

// Parse form and JSON data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session configuration
app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 60 * 60 * 1000
        }
    })
);

// Flash messages
app.use(flash);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

/**
 * -----------------------------
 * Development Logging
 * -----------------------------
 */

app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);

        console.log('--- request debug ---');
        console.log('Host:', req.headers.host);
        console.log('Cookie header:', req.headers.cookie);
        console.log('SessionID:', req.sessionID);

        try {
            console.log(
                'Session contents:',
                JSON.stringify(req.session)
            );
        } catch {
            console.log('Session contents: [unserializable]');
        }

        console.log('--- end debug ---');
    }

    next();
});

/**
 * -----------------------------
 * Variables Available in EJS
 * -----------------------------
 */

app.use((req, res, next) => {
    res.locals.isLoggedIn =
        !!(req.session && req.session.user);

    res.locals.user =
        req.session?.user || null;

    res.locals.sessionID =
        req.sessionID;

    res.locals.session =
        req.session;

    res.locals.NODE_ENV =
        NODE_ENV;

    next();
});

/**
 * -----------------------------
 * Application Routes
 * -----------------------------
 */

app.use('/', router);

/**
 * -----------------------------
 * 404 Handler
 * -----------------------------
 */

app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

/**
 * -----------------------------
 * Global Error Handler
 * -----------------------------
 */

app.use((err, req, res, next) => {
    console.error('Error occurred:', err.message);
    console.error('Stack trace:', err.stack);

    const status = err.status || 500;

    res.status(status).render(
        `errors/${status === 404 ? '404' : '500'}`,
        {
            title:
                status === 404
                    ? 'Page Not Found'
                    : 'Server Error',
            error: err.message,
            stack: err.stack
        }
    );
});

/**
 * -----------------------------
 * Start Server
 * -----------------------------
 */

app.listen(PORT, async () => {
    try {
        await testConnection();

        console.log(
            `Server is running at http://127.0.0.1:${PORT}`
        );

        console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error(
            'Error connecting to the database:',
            error
        );

        process.exit(1);
    }
});