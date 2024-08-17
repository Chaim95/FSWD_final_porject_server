const connection = require('../config/db');


exports.createPlace = (req, res) => {
    const { name, address, parking_lot, type_of_place, areas, bus_lines } = req.body;

    connection.query('INSERT INTO Places (name, address, parking_lot, type_of_place, areas, bus_lines) VALUES (?, ?, ?, ?, ?, ?)', 
    [name, address, parking_lot, type_of_place, areas, bus_lines], 
    (err, results) => {
        if (err) return res.status(500).send('Error creating place.');
        res.status(201).send('Place created successfully!');
    });
};


exports.getAllPlaces = (req, res) => {
    connection.query('SELECT * FROM Places', (err, results) => {
        if (err) return res.status(500).send('Error retrieving places.');
        res.json(results);
    });
};


exports.getPlaceById = (req, res) => {
    const placeId = req.params.id;
    connection.query('SELECT * FROM Places WHERE id = ?', [placeId], (err, results) => {
        if (err || results.length === 0) return res.status(404).send('Place not found.');
        res.json(results[0]);
    });
};


exports.updatePlace = (req, res) => {
    const placeId = req.params.id;
    const updatedPlace = req.body;
    connection.query('UPDATE Places SET ? WHERE id = ?', [updatedPlace, placeId], (err, results) => {
        if (err) return res.status(500).send('Error updating place.');
        res.send('Place updated successfully!');
    });
};


exports.deletePlace = (req, res) => {
    const placeId = req.params.id;
    connection.query('DELETE FROM Places WHERE id = ?', [placeId], (err, results) => {
        if (err) return res.status(500).send('Error deleting place.');
        res.send('Place deleted successfully!');
    });
};
