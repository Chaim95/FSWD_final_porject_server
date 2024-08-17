const connection = require('../config/db');


exports.createUser = (req, res) => {
    const { email, password, first_name, last_name, phone_number, type_of_user } = req.body;

    connection.query('INSERT INTO Users (email, first_name, last_name, phone_number, type_of_user, password) VALUES (?, ?, ?, ?, ?, ?)', 
    [email, first_name, last_name, phone_number, type_of_user, password], 
    (err, results) => {
        if (err) return res.status(500).send('Error creating user.');
        res.status(201).send('User created successfully!');
    });
};


exports.getAllUsers = (req, res) => {
    connection.query('SELECT * FROM Users', (err, results) => {
        if (err) return res.status(500).send('Error retrieving users.');
        res.json(results);
    });
};


exports.getUserById = (req, res) => {
    const userId = req.params.id;
    connection.query('SELECT * FROM Users WHERE id = ?', [userId], (err, results) => {
        if (err || results.length === 0) return res.status(404).send('User not found.');
        res.json(results[0]);
    });
};


exports.updateUser = (req, res) => {
    const userId = req.params.id;
    const updatedUser = req.body;
    connection.query('UPDATE Users SET ? WHERE id = ?', [updatedUser, userId], (err, results) => {
        if (err) return res.status(500).send('Error updating user.');
        res.send('User updated successfully!');
    });
};


exports.deleteUser = (req, res) => {
    const userId = req.params.id;
    connection.query('DELETE FROM Users WHERE id = ?', [userId], (err, results) => {
        if (err) return res.status(500).send('Error deleting user.');
        res.send('User deleted successfully!');
    });
};
