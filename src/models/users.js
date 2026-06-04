import db from './db.js'
import bcrypt from 'bcrypt';

const createUser = async (name_users, email, passwordHash) => {
    const default_role = 'user';
    const query = `
        INSERT INTO users (name_users, email, password_hash, role_id) 
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4)) 
        RETURNING user_id
    `;
    const queryParams = [name_users, email, passwordHash, default_role];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0].user_id);
    }

    return result.rows[0].user_id;
};

const findUserByEmail = async (email) => {
    const query = `
        SELECT u.user_id, u.name_users, u.email, u.password_hash, u.role_id, r.role_name
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = $1
    `;
    const queryParams = [email];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return null; // User not found
    }

    return result.rows[0];
};

const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);
    if (!user) {
        return null; // User not found
    }

    const isMatch = await verifyPassword(password, user.password_hash);
    if (!isMatch) {
        return null; // Incorrect password
    }

    return user; // Authentication successful
};

const getAllUsers = async () => {
    const query = `
        SELECT u.user_id, u.email, r.role_name
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        ORDER BY u.email;
    `;

    const result = await db.query(query);
    return result.rows;
};


export {
    createUser,
    findUserByEmail,
    verifyPassword,
    authenticateUser,
    getAllUsers
};