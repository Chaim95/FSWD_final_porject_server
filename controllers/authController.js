const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connection = require('../config/db');

exports.register = (req, res) => {
    const { email, password, first_name, last_name, phone_number, type_of_user } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 8);

    connection.query('INSERT INTO Users (email, first_name, last_name, phone_number, type_of_user, password) VALUES (?, ?, ?, ?, ?, ?)', 
    [email, first_name, last_name, phone_number, type_of_user, hashedPassword], 
    (err, results) => {
        if (err) return res.status(500).send('Error registering the user.');
        res.status(201).send('User registered successfully!');
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    connection.query('SELECT * FROM Users WHERE email = ?', [email], (err, results) => {
        if (err || results.length === 0) return res.status(400).send('User not found.');

        const user = results[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) return res.status(401).send('Invalid password.');

        const token = jwt.sign({ id: user.id, type_of_user: user.type_of_user }, process.env.JWT_SECRET, {
            expiresIn: 86400 
        });

        res.status(200).send({ auth: true, token });
    });
};
