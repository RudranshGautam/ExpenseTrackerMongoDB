const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env; // Ensure JWT_SECRET is available in environment variables

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401); // Unauthorized if no token

    jwt.verify(token.split(' ')[1], JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden if token is invalid
        req.user = user; // Attach decoded user data to request object
        next();
    });
}

module.exports = authenticateToken;
