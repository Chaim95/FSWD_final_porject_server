const { Console } = require('console');
const connection = require('../config/db');
const util = require('util');

const query = util.promisify(connection.query).bind(connection);

exports.createShow = async (req, res) => {
    try {
        console.log(req.body);
        const { date, hours_start, hours_finish, place_id, prices, name, artist, poster_url, seats_count} = req.body;
        const manager_id = req.userId;
        console.log(req);
        if (!date || !hours_start || !hours_finish || !place_id || !manager_id || !name || !artist || !poster_url|| !seats_count ) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }
        console.log(poster_url);
        await query('INSERT INTO Shows (date, hours_start, hours_finish, place_id, manager_id, prices, name, artist, seats_count, poster_url ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)', 
        [date, hours_start, hours_finish, place_id, manager_id, prices, name, artist, seats_count, poster_url ]);

        res.status(201).json({ message: 'Show created successfully!' });
    } catch (err) {
        console.error('Error creating show:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getAllShows = async (req, res) => {
    try {
        console.log("get all shows paging");
        const shows = await query('SELECT * FROM Shows');
        res.status(200).json(shows);
    } catch (err) {
        console.error('Error retrieving shows:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.getAllShowsPaging = async (req, res) => {
    try {
        console.log("get all shows paging");
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;

        let offset = (page - 1) * limit;

        const shows = await query('SELECT * FROM Shows LIMIT ? OFFSET ?', [limit, offset]);
        console.log(shows);
        const totalShows = await query('SELECT COUNT(*) as count FROM Shows');
        const totalPages = Math.ceil(totalShows[0].count / limit);

        res.json({
            shows,
            currentPage: page,
            totalPages: totalPages
        });
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
};



exports.getShowById = async (req, res) => {
    try {
        console.log(req.params);
        const showId = req.params.id;
        const results = await query('SELECT * FROM Shows WHERE id = ?', [showId]);

        if (results.length === 0) return res.status(404).json({ error: 'Show not found.' });

        res.status(200).json(results[0]);
    } catch (err) {
        console.error('Error retrieving show:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// exports.updateShow = async (req, res) => {
//     try {
//         const showId = req.params.id;
//         const updatedShow = req.body;

//         if (!updatedShow) return res.status(400).json({ error: 'No data provided for update.' });

//         const results = await query('UPDATE Shows SET ? WHERE id = ?', [updatedShow, showId]);

//         if (results.affectedRows === 0) return res.status(404).json({ error: 'Show not found.' });

//         res.status(200).json({ message: 'Show updated successfully!' });
//     } catch (err) {
//         console.error('Error updating show:', err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

exports.updateShow = async (req, res) => {
    try {
        const showId = req.params.id;
        console.log(showId);
        console.log(req.body);
        const { date, hours_start, hours_finish, place_id, prices, name, artist, poster_url } = req.body;

        if (!date || !hours_start || !hours_finish || !place_id || !prices || !name || !artist || !poster_url) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        const updatedShow = {
            date,
            hours_start,
            hours_finish,
            place_id,
            prices,
            name,
            artist,
            poster_url
        };

        const results = await query('UPDATE Shows SET ? WHERE id = ?', [updatedShow, showId]);

        if (results.affectedRows === 0) return res.status(404).json({ error: 'Show not found.' });

        res.status(200).json({ message: 'Show updated successfully!' });
    } catch (err) {
        console.error('Error updating show:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.deleteShow = async (req, res) => {
    try {
        const showId = req.params.id;
        const results = await query('DELETE FROM Shows WHERE id = ?', [showId]);

        if (results.affectedRows === 0) return res.status(404).json({ error: 'Show not found.' });

        res.status(200).json({ message: 'Show deleted successfully!' });
    } catch (err) {
        console.error('Error deleting show:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getShowsByManager = async (req, res) => {
    try {
        console.log("get shows by manager");
        const managerId = req.userId;
        console.log(managerId);
        const shows = await query('SELECT * FROM Shows WHERE manager_id = ?', [managerId]);
        console.log(shows[0]);
        res.status(200).json(shows);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
