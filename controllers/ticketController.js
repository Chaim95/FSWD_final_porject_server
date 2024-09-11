const connection = require('../config/db');
const util = require('util');

const query = util.promisify(connection.query).bind(connection);

exports.createTicket = async (req, res) => {
    try {
        const { show_id, user_id, seat_number } = req.body;

        if (!show_id || !user_id || !seat_number) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }


        const checkSeat =  await query('SELECT count(*) FROM tickets_system.tickets where show_id = ? AND seat_number = ?', [show_id, seat_number]);
        if(checkSeat[0]['count(*)'] != 0){
            console.error('Error creating ticket:', err);
            res.status(409).json({ error: 'The seat already taken' });
        }

        const chekcUserBalance =  await query('SELECT balance from users where id=?', [user_id])
        const balance = chekcUserBalance[0].balance;
        const showPriceRes = await query('SELECT prices from shows where id = ?', [show_id]);
        const showPrice = showPriceRes[0].prices;
        if(balance < showPrice){
            console.error('Error creating ticket:', err);
            res.status(409).json({ error: 'There is no balance for this ticket' });
        }

        const newBalance = balance - showPrice;
        console.log(balance)
        console.log(showPrice)
        console.log(newBalance)

        await query('UPDATE users SET balance= ? WHERE id = ?', [newBalance, user_id]);
        await query('INSERT INTO Tickets (show_id, user_id, price, seat_number) VALUES (?, ?, ?, ?)',
            [show_id, user_id, 0.0, seat_number]);

        res.status(201).json({ message: 'Ticket created successfully!' });
    } catch (err) {
        console.error('Error creating ticket:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getAvailableTickets = async (req, res) => {
    try {
        const  show_id = req.params.showId;

        if (!show_id) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        const ranges = await query(`
        WITH AllSeats AS (
            SELECT n AS seat_number
            FROM (
                SELECT @row := @row + 1 AS n
                FROM (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 
                      UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) digits,
                     (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 
                      UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) digits2,
                     (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 
                      UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) digits3,
                      (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 
                      UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) digits4,
                      (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 
                      UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) digits5,
                     (SELECT @row := 0) r
            ) numbers
            WHERE n BETWEEN 1 AND (SELECT seats_count FROM Shows WHERE id = ?)
        ),
        AvailableSeats AS (
            -- Exclude the seat numbers already having tickets for the show
            SELECT seat_number
            FROM AllSeats
            WHERE seat_number NOT IN (
                SELECT seat_number
                FROM Tickets
                WHERE show_id = ?
            )
        ),
        RankedSeats AS (
            -- Rank the remaining available seats
            SELECT 
                seat_number,
                ROW_NUMBER() OVER (ORDER BY seat_number) AS seat_rank
            FROM AvailableSeats
        )
        SELECT 
            MIN(seat_number) AS start_seat,
            MAX(seat_number) AS end_seat
        FROM RankedSeats
        GROUP BY seat_rank - seat_number
        ORDER BY start_seat;
        
        `, [show_id, show_id]);
        res.status(200).json({ ranges});
    } catch (err) {
        console.error('Error creating ticket:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// exports.getUserTickets = async (req, res) => {
//     try {
//         const userId = req.userId; 
//         const tickets = await query(`
//             SELECT t.*, s.name AS show_name, s.date
//             FROM Tickets t
//             JOIN Shows s ON t.show_id = s.id
//             WHERE t.user_id = ?
//         `, [userId]);

//         res.status(200).json({ user: { id: userId, name: req.userName, email: req.userEmail }, tickets });
//     } catch (err) {
//         console.error('Error retrieving user tickets:', err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };


exports.getUserTickets = async (req, res) => {
    try {
        const userId = req.userId;
        console.log("***getUserTickets***");
        console.log(userId);

        const userResults = await query('SELECT id, first_name, last_name, email, balance FROM Users WHERE id = ?', [userId]);
        console.log(userResults);

        if (userResults.length === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const user = {
            ...userResults[0],
            name: `${userResults[0].first_name} ${userResults[0].last_name}`,
            email: `${userResults[0].email}`,
            balance: `${userResults[0].balance}`
        };
        console.log(user);

        const tickets = await query(`
            SELECT t.*, s.name AS show_name, s.date
            FROM Tickets t
            JOIN Shows s ON t.show_id = s.id
            WHERE t.user_id = ?
        `, [userId]);
        console.log(tickets);

        res.status(200).json({ user, tickets });
    } catch (err) {
        console.error('Error retrieving user tickets:', err);
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
