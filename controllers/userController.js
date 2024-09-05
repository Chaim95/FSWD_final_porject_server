const connection = require('../config/db');
const util = require('util');


const query = util.promisify(connection.query).bind(connection);

exports.createUser = async (req, res) => {
    try {
        const { email, password, first_name, last_name, phone_number, type_of_user } = req.body;

        if (!email || !password || !first_name || !last_name || !type_of_user) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        const existingUser = await query('SELECT * FROM Users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Email already registered.' });
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        await query('INSERT INTO Users (email, first_name, last_name, phone_number, type_of_user, password) VALUES (?, ?, ?, ?, ?, ?)', 
        [email, first_name, last_name, phone_number, type_of_user, hashedPassword]);

        res.status(201).json({ message: 'User created successfully!' });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await query('SELECT * FROM Users');
        res.status(200).json(users);
    } catch (err) {
        console.error('Error retrieving users:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const results = await query('SELECT * FROM Users WHERE id = ?', [userId]);

        if (results.length === 0) return res.status(404).json({ error: 'User not found.' });

        res.status(200).json(results[0]);
    } catch (err) {
        console.error('Error retrieving user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedUser = req.body;

        if (!updatedUser) return res.status(400).json({ error: 'No data provided for update.' });

        const results = await query('UPDATE Users SET ? WHERE id = ?', [updatedUser, userId]);

        if (results.affectedRows === 0) return res.status(404).json({ error: 'User not found.' });

        res.status(200).json({ message: 'User updated successfully!' });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const results = await query('DELETE FROM Users WHERE id = ?', [userId]);

        if (results.affectedRows === 0) return res.status(404).json({ error: 'User not found.' });

        res.status(200).json({ message: 'User deleted successfully!' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
