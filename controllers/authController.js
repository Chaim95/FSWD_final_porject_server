const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connection = require('../config/db');
const util = require('util');

const query = util.promisify(connection.query).bind(connection);

exports.register = async (req, res) => {
    try {
        const { email, password, first_name, last_name, phone_number, type_of_user } = req.body;

        const existingUser = await query('SELECT * FROM Users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Email already registered.' });
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        await query('INSERT INTO Users (email, first_name, last_name, phone_number, type_of_user, password) VALUES (?, ?, ?, ?, ?, ?)', 
        [email, first_name, last_name, phone_number, type_of_user, hashedPassword]);

        const user = await query('SELECT * FROM Users WHERE email = ?', [email]);
        const token = jwt.sign({ id: user[0].id, type_of_user: user[0].type_of_user }, process.env.JWT_SECRET, {
            expiresIn: 86400 // 1 day
        });

        res.status(201).json({ auth: true, token, message: 'User registered successfully!' });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const results = await query('SELECT * FROM Users WHERE email = ?', [email]);

        if (results.length === 0) return res.status(400).json({ error: 'User not found.' });

        const user = results[0];
        const passwordIsValid = await bcrypt.compare(password, user.password);

        if (!passwordIsValid) return res.status(401).json({ error: 'Invalid password.' });

        const token = jwt.sign({ id: user.id, type_of_user: user.type_of_user }, process.env.JWT_SECRET, {
            expiresIn: 86400 
        });

        res.status(200).json({ auth: true, token });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
