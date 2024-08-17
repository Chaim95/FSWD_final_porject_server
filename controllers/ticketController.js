const connection = require('../config/db');


exports.createTicket = (req, res) => {
    const { show_id, user_id, price, seat_number } = req.body;

    connection.query('INSERT INTO Tickets (show_id, user_id, price, seat_number) VALUES (?, ?, ?, ?)', 
    [show_id, user_id, price, seat_number], 
    (err, results) => {
        if (err) return res.status(500).send('Error creating ticket.');
        res.status(201).send('Ticket created successfully!');
    });
};


exports.getAllTickets = (req, res) => {
    connection.query('SELECT * FROM Tickets', (err, results) => {
        if (err) return res.status(500).send('Error retrieving tickets.');
        res.json(results);
    });
};


exports.getTicketById = (req, res) => {
    const ticketId = req.params.id;
    connection.query('SELECT * FROM Tickets WHERE id = ?', [ticketId], (err, results) => {
        if (err || results.length === 0) return res.status(404).send('Ticket not found.');
        res.json(results[0]);
    });
};


exports.updateTicket = (req, res) => {
    const ticketId = req.params.id;
    const updatedTicket = req.body;
    connection.query('UPDATE Tickets SET ? WHERE id = ?', [updatedTicket, ticketId], (err, results) => {
        if (err) return res.status(500).send('Error updating ticket.');
        res.send('Ticket updated successfully!');
    });
};


exports.deleteTicket = (req, res) => {
    const ticketId = req.params.id;
    connection.query('DELETE FROM Tickets WHERE id = ?', [ticketId], (err, results) => {
        if (err) return res.status(500).send('Error deleting ticket.');
        res.send('Ticket deleted successfully!');
    });
};
