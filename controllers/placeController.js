const connection = require('../config/db');
const util = require('util');


const query = util.promisify(connection.query).bind(connection);

exports.createPlace = async (req, res) => {
    try {
        const { name, address, parking_lot, type_of_place, areas, bus_lines } = req.body;

        if (!name || !type_of_place) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        await query('INSERT INTO Places (name, address, parking_lot, type_of_place, areas, bus_lines) VALUES (?, ?, ?, ?, ?, ?)', 
        [name, address, parking_lot, type_of_place, areas, bus_lines]);

        res.status(201).json({ message: 'Place created successfully!' });
    } catch (err) {
        console.error('Error creating place:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getAllPlaces = async (req, res) => {
    try {
        const places = await query('SELECT * FROM Places');
        res.status(200).json(places);
    } catch (err) {
        console.error('Error retrieving places:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getPlaceById = async (req, res) => {
    try {
        const placeId = req.params.id;
        const results = await query('SELECT * FROM Places WHERE id = ?', [placeId]);

        if (results.length === 0) return res.status(404).json({ error: 'Place not found.' });

        res.status(200).json(results[0]);
    } catch (err) {
        console.error('Error retrieving place:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updatePlace = async (req, res) => {
    try {
        const placeId = req.params.id;
        const updatedPlace = req.body;

        if (!updatedPlace) return res.status(400).json({ error: 'No data provided for update.' });

        const results = await query('UPDATE Places SET ? WHERE id = ?', [updatedPlace, placeId]);

        if (results.affectedRows === 0) return res.status(404).json({ error: 'Place not found.' });

        res.status(200).json({ message: 'Place updated successfully!' });
    } catch (err) {
        console.error('Error updating place:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deletePlace = async (req, res) => {
    try {
        const placeId = req.params.id;
        const results = await query('DELETE FROM Places WHERE id = ?', [placeId]);

        if (results.affectedRows === 0) return res.status(404).json({ error: 'Place not found.' });

        res.status(200).json({ message: 'Place deleted successfully!' });
    } catch (err) {
        console.error('Error deleting place:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
