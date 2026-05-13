import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import db, { testConnection } from './src/models/db.js';
import { getAllOrganizations } from './src/models/organizations.js';

// Define the the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// define the port number the server will listen on, using an environment variable or defaulting to 3000

const PORT = process.env.PORT || 3000;
// get the current file path and directory

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the port number the server will listen on
const app = express();


//Set EJS as the templating engine
app.set('view engine', 'ejs');

//Tell Express where to find the EJS templates
app.set('views', path.join(__dirname, 'src/views'));



/**
 * Configure Express middleware
    */

// Serve static files from the public directory

app.use(express.static(path.join(__dirname, 'public')));

/**
 * Routes
 */

app.get('/', async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
});

app.get('/organizations', async (req, res) => {
    try {
        const organizations = await getAllOrganizations();
        res.render('organizations', {
            title: 'Organizations',
            organizations
        });
    } catch (err) {
        console.error('Organizations error:', err.message);
        res.status(500).send('Database connection lost');
    }
});
app.get('/projects', async (req, res) => {
    const title = 'Projects';
    res.render('projects', { title })
});

app.get('/categories', async (req, res) => {
    const title = 'Categories';
    res.render('categories', { title })
});

await testConnection();
app.listen(PORT, async () => {
    try {
        
        console.log(`Server is running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1); // Exit the process with an error code
    }
});


