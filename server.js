
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const showRoutes = require('./routes/showRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const placeRoutes = require('./routes/placeRoutes');
const passwordTokenRoutes = require('./routes/passwordTokenRoutes'); 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Middleware to log every request -- Delete
app.use((req, res, next) => {
    console.log(`Received ${req.method} request to ${req.originalUrl}`);
    next(); 
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/password-tokens', passwordTokenRoutes); 

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
