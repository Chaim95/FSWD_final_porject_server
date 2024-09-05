const connection = require('../config/db');
const util = require('util');

const query = util.promisify(connection.query).bind(connection);

exports.createTicket = async (req, res) => {
    try {
        const { show_id, user_id, price, seat_number } = req.body;

        if (!show_id || !user_id || !price || !seat_number) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        await query('INSERT INTO Tickets (show_id, user_id, price, seat_number) VALUES (?, ?, ?, ?)', 
        [show_id, user_id, price, seat_number]);

        res.status(201).json({ message: 'Ticket created successfully!' });
    } catch (err) {
        console.error('Error creating ticket:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getAllTickets = async (req, res) => {
    try {
        const tickets = await query('SELECT * FROM Tickets');
        res.status(200).json(tickets);
    } catch (err) {
        console.error('Error retrieving tickets:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getTicketById = async (req, res) => {
    try {
        const ticketId = req.params.id;
        const results = await query('SELECT * FROM Tickets WHERE id = ?', [ticketId]);

        if (results.length === 0) return res.status(404).json({ error: 'Ticket not found.' });

        res.status(200).json(results[0]);
    } catch (err) {
        console.error('Error retrieving ticket:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updateTicket = async (req, res) => {
    try {
        const ticketId = req.params.id;
        const updatedTicket = req.body;

        if (!updatedTicket) return res.status(400).json({ error: 'No data provided for update.' });

        const results = await query('UPDATE Tickets SET ? WHERE id = ?', [updatedTicket, ticketId]);

        if (results.affectedRows === 0) return res.status(404).json({ error: 'Ticket not found.' });

        res.status(200).json({ message: 'Ticket updated successfully!' });
    } catch (err) {
        console.error('Error updating ticket:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteTicket = async (req, res) => {
    try {
        const ticketId = req.params.id;
        const results = await query('DELETE FROM Tickets WHERE id = ?', [ticketId]);

        if (results.affectedRows === 0) return res.status(404).json({ error: 'Ticket not found.' });

        res.status(200).json({ message: 'Ticket deleted successfully!' });
    } catch (err) {
        console.error('Error deleting ticket:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
