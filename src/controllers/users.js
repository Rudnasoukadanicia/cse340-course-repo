import bcrypt from 'bcrypt';
import { createUser } from '../models/users.js';
import { authenticateUser } from '../models/users.js';
import { getAllUsers } from '../models/users.js';

const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

const processUserRegistrationForm = async (req, res) => {
    // accept either `name_users` (DB naming) or `name` from the form
    const { name_users: rawName, name: altName, email, password } = req.body;
    const name_users = rawName || altName;

    try {
        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create the user in the database
        const userId = await createUser(name_users, email, passwordHash);

        // Redirect to the home page after successful registration
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/');
    } catch (error) {
        // Log sanitized input and detailed error information for debugging
        const safeBody = { name_users: req.body.name_users, email: req.body.email };
        console.error('Error registering user:', {
            input: safeBody,
            message: error && error.message,
            code: error && error.code,
            detail: error && error.detail,
            stack: error && error.stack
        });

        req.flash('error', 'An error occurred during registration. Please try again.');
        res.redirect('/register');
    }
};

const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);
        if (!user) {
            req.flash('error', 'Invalid email or password.');
            res.redirect('/login');
            return;
        }

        // Set the user session (store full user object)
        console.log('User logged in:', {
            userId: user.user_id,
            name: user.name_users,
            email: user.email,
            roleId: user.role_id,
            roleName: user.role_name
        });

        req.session.user = {
            userId: user.user_id,
            name: user.name_users,
            email: user.email,
            roleId: user.role_id,
            role_name: user.role_name
        };

        console.log('Session after login:', req.session);

        // Save session explicitly before redirect to ensure it's persisted
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
            }
            // Redirect to the dashboard after successful login
            req.flash('success', 'Login successful!');
            res.redirect('/dashboard');
        });
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        res.redirect('/login');
    }
};

const processLogout = async (req, res) => {
    if (req.session.user) {
        delete req.session.user;
    }

    req.flash('success', 'Logout successful!');
    res.redirect('/login');
};

const requireLogin = (req, res, next) => {
    console.log('requireLogin middleware check:', {
        hasSession: !!req.session,
        hasSessionUser: !!req.session?.user,
        sessionUserId: req.session?.user?.userId,
        sessionUserEmail: req.session?.user?.email
    });

    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access this page.');
        return res.redirect('/login');
    }
    next();
};
const showDashboard = (req, res) => {
    const user = req.session.user || {};
    res.render('dashboard', {
        title: 'Dashboard',
        name: user.name || user.name_users || '',
        email: user.email || ''
    });
};

const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/dashboard');
        }

        next();
    };
};



const showUsersPage = async (req, res) => {
    const users = await getAllUsers();

    res.render('users', {
        title: 'Users',
        users
    });
};



export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard,
    requireRole,
    showUsersPage
};