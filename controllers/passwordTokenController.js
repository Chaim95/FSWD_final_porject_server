const connection = require('../config/db');
const crypto = require('crypto');
const util = require('util');


const query = util.promisify(connection.query).bind(connection);

exports.createToken = async (req, res) => {
    try {
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).send('Missing required fields.');
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiration = new Date(Date.now() + 3600000); // 1 hour

        await query('INSERT INTO Password_Tokens (user_id, token, expiration) VALUES (?, ?, ?)', 
        [user_id, token, expiration]);

        res.status(201).send({ token });
    } catch (err) {
        console.error('Error creating password reset token:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.verifyToken = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).send('Missing token.');
        }

        const results = await query('SELECT * FROM Password_Tokens WHERE token = ? AND expiration > NOW()', [token]);

        if (results.length === 0) return res.status(400).send('Invalid or expired token.');

        res.status(200).send('Token is valid.');
    } catch (err) {
        console.error('Error verifying token:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.deleteToken = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).send('Missing token.');
        }

        const results = await query('DELETE FROM Password_Tokens WHERE token = ?', [token]);

        if (results.affectedRows === 0) return res.status(404).send('Token not found.');

        res.send('Token deleted successfully!');
    } catch (err) {
        console.error('Error deleting token:', err);
        res.status(500).send('Internal Server Error');
    }
};
