const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.TOKEN_SECRET;
const JWT_PREFIX = process.env.TOKEN_PREFIX;

function authenticateJWT(req, res, next) {
  const token = req.headers.authorization;

  if (!token || !token.startsWith(JWT_PREFIX)) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token format' });
  }

  const jwtToken = token.slice(JWT_PREFIX.length);

  try {
    const decoded = jwt.verify(jwtToken, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
}

module.exports = authenticateJWT;
