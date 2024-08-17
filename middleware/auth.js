const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');


dotenv.config();

function verifyToken(req, res, next) {

    const token = req.headers['authorization']?.split(' ')[1];
 
    if (!token) return res.status(403).send('No token provided.');

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(500).send('Failed to authenticate token.');
        
        req.userId = decoded.id;
        req.userType = decoded.type_of_user;
        next();
    });
}

function isAdmin(req, res, next) {
    if (req.userType !== 'admin') return res.status(403).send('Requires admin role.');
    next();
}

module.exports = { verifyToken, isAdmin };
