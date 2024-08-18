const connection = require('../config/db');
const util = require('util');

const query = util.promisify(connection.query).bind(connection);

exports.createShow = async (req, res) => {
    try {
        const { date, hours_start, hours_finish, place_id, manager_id, prices, name, artist } = req.body;

        if (!date || !hours_start || !hours_finish || !place_id || !manager_id || !name || !artist) {
            return res.status(400).send('Missing required fields.');
        }

        await query('INSERT INTO Shows (date, hours_start, hours_finish, place_id, manager_id, prices, name, artist) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
        [date, hours_start, hours_finish, place_id, manager_id, prices, name, artist]);

        res.status(201).send('Show created successfully!');
    } catch (err) {
        console.error('Error creating show:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.getAllShows = async (req, res) => {
    try {
        const shows = await query('SELECT * FROM Shows');
        res.json(shows);
    } catch (err) {
        console.error('Error retrieving shows:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.getShowById = async (req, res) => {
    try {
        const showId = req.params.id;
        const results = await query('SELECT * FROM Shows WHERE id = ?', [showId]);

        if (results.length === 0) return res.status(404).send('Show not found.');

        res.json(results[0]);
    } catch (err) {
        console.error('Error retrieving show:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.updateShow = async (req, res) => {
    try {
        const showId = req.params.id;
        const updatedShow = req.body;

        if (!updatedShow) return res.status(400).send('No data provided for update.');

        const results = await query('UPDATE Shows SET ? WHERE id = ?', [updatedShow, showId]);

        if (results.affectedRows === 0) return res.status(404).send('Show not found.');

        res.send('Show updated successfully!');
    } catch (err) {
        console.error('Error updating show:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.deleteShow = async (req, res) => {
    try {
        const showId = req.params.id;
        const results = await query('DELETE FROM Shows WHERE id = ?', [showId]);

        if (results.affectedRows === 0) return res.status(404).send('Show not found.');

        res.send('Show deleted successfully!');
    } catch (err) {
        console.error('Error deleting show:', err);
        res.status(500).send('Internal Server Error');
    }
};
