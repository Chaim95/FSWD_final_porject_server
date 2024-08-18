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
            return res.status(400).send('Email already registered.');
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        await query('INSERT INTO Users (email, first_name, last_name, phone_number, type_of_user, password) VALUES (?, ?, ?, ?, ?, ?)', 
        [email, first_name, last_name, phone_number, type_of_user, hashedPassword]);

        res.status(201).send('User registered successfully!');
    } catch (err) {
        console.error('Error registering the user:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const results = await query('SELECT * FROM Users WHERE email = ?', [email]);

        if (results.length === 0) return res.status(400).send('User not found.');

        const user = results[0];
        const passwordIsValid = await bcrypt.compare(password, user.password);

        if (!passwordIsValid) return res.status(401).send('Invalid password.');

        const token = jwt.sign({ id: user.id, type_of_user: user.type_of_user }, process.env.JWT_SECRET, {
            expiresIn: 86400 
        });

        res.status(200).send({ auth: true, token });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).send('Internal Server Error');
    }
};
