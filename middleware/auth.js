const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

async function verifyToken(req, res, next) {
    try {
        const authHeader = req.headers['authorization']; 
        if (!authHeader) {
            return res.status(403).send('No token provided.');
        }

        const token = authHeader.split(' ')[1];  
        if (!token) {
            return res.status(403).send('Invalid token format.');
        }

        const decoded = await jwt.verify(token, process.env.JWT_SECRET); 

        req.userId = decoded.id;  
        req.userType = decoded.type_of_user;  
        next(); 
    } catch (err) {
        res.status(500).send('Failed to authenticate token.');
    }
}

function isAdmin(req, res, next) {
    if (req.userType !== 'admin') {
        return res.status(403).send('Requires admin role.');
    }
    next();
}

module.exports = { verifyToken, isAdmin };
