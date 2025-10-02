const jwt = require('jsonwebtoken');
require('dotenv').config();
const { isTokenBlacklisted } = require('../services/auth');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const headerToken = authHeader && authHeader.split(' ')[1];
    const cookieToken = req.cookies && req.cookies.token;
    const token = headerToken || cookieToken;
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        if (isTokenBlacklisted(token)) {
            return res.status(403).json({ message: 'Token is blacklisted' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
}

module.exports = authenticateToken;
