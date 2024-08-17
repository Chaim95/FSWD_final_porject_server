const connection = require('../config/db');
const crypto = require('crypto');


exports.createToken = (req, res) => {
    const { user_id } = req.body;
    const token = crypto.randomBytes(32).toString('hex');
    const expiration = new Date(Date.now() + 3600000); // 1 hour

    connection.query('INSERT INTO Password_Tokens (user_id, token, expiration) VALUES (?, ?, ?)', 
    [user_id, token, expiration], 
    (err, results) => {
        if (err) return res.status(500).send('Error creating password reset token.');
        res.status(201).send({ token });
    });
};


exports.verifyToken = (req, res) => {
    const { token } = req.body;

    connection.query('SELECT * FROM Password_Tokens WHERE token = ? AND expiration > NOW()', [token], (err, results) => {
        if (err || results.length === 0) return res.status(400).send('Invalid or expired token.');
        res.status(200).send('Token is valid.');
    });
};


exports.deleteToken = (req, res) => {
    const { token } = req.body;

    connection.query('DELETE FROM Password_Tokens WHERE token = ?', [token], (err, results) => {
        if (err) return res.status(500).send('Error deleting token.');
        res.send('Token deleted successfully.');
    });
};
