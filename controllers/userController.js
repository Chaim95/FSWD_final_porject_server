const connection = require('../config/db');
const util = require('util');


const query = util.promisify(connection.query).bind(connection);

exports.createUser = async (req, res) => {
    try {
        const { email, password, first_name, last_name, phone_number, type_of_user } = req.body;

        const existingUser = await query('SELECT * FROM Users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).send('Email already registered.');
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        await query('INSERT INTO Users (email, first_name, last_name, phone_number, type_of_user, password) VALUES (?, ?, ?, ?, ?, ?)', 
        [email, first_name, last_name, phone_number, type_of_user, hashedPassword]);

        res.status(201).send('User created successfully!');
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await query('SELECT * FROM Users');
        res.json(users);
    } catch (err) {
        console.error('Error retrieving users:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const results = await query('SELECT * FROM Users WHERE id = ?', [userId]);

        if (results.length === 0) return res.status(404).send('User not found.');

        res.json(results[0]);
    } catch (err) {
        console.error('Error retrieving user:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedUser = req.body;

        if (!updatedUser) return res.status(400).send('No data provided for update.');

        const results = await query('UPDATE Users SET ? WHERE id = ?', [updatedUser, userId]);

        if (results.affectedRows === 0) return res.status(404).send('User not found.');

        res.send('User updated successfully!');
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const results = await query('DELETE FROM Users WHERE id = ?', [userId]);

        if (results.affectedRows === 0) return res.status(404).send('User not found.');

        res.send('User deleted successfully!');
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Internal Server Error');
    }
};
