const connection = require('../config/db');


exports.createShow = (req, res) => {
    const { date, hours_start, hours_finish, place_id, manager_id, prices, name, artist } = req.body;

    connection.query('INSERT INTO Shows (date, hours_start, hours_finish, place_id, manager_id, prices, name, artist) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
    [date, hours_start, hours_finish, place_id, manager_id, prices, name, artist], 
    (err, results) => {
        if (err) return res.status(500).send('Error creating show.');
        res.status(201).send('Show created successfully!');
    });
};


exports.getAllShows = (req, res) => {
    connection.query('SELECT * FROM Shows', (err, results) => {
        if (err) return res.status(500).send('Error retrieving shows.');
        res.json(results);
    });
};


exports.getShowById = (req, res) => {
    const showId = req.params.id;
    connection.query('SELECT * FROM Shows WHERE id = ?', [showId], (err, results) => {
        if (err || results.length === 0) return res.status(404).send('Show not found.');
        res.json(results[0]);
    });
};


exports.updateShow = (req, res) => {
    const showId = req.params.id;
    const updatedShow = req.body;
    connection.query('UPDATE Shows SET ? WHERE id = ?', [updatedShow, showId], (err, results) => {
        if (err) return res.status(500).send('Error updating show.');
        res.send('Show updated successfully!');
    });
};


exports.deleteShow = (req, res) => {
    const showId = req.params.id;
    connection.query('DELETE FROM Shows WHERE id = ?', [showId], (err, results) => {
        if (err) return res.status(500).send('Error deleting show.');
        res.send('Show deleted successfully!');
    });
};
