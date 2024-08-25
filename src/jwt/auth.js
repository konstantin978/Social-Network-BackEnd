const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const SECRET_KEY = dotenv.parsed.SECRET_KEY;


const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send('Invalid token.');
    }
};

module.exports = authenticateJWT;