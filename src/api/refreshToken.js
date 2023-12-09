const express = require('express');
const router = express.Router();
const { refreshTheApiToken } = require('../utility/refreshToken');
require('dotenv').config();

const TOKEN_SECRET = process.env.TOKEN_SECRET;
const TOKEN_PREFIX = process.env.TOKEN_SECRET;

router.post('/refresh-token', async (req, res) => {
  try {
    const { username, token } = req.user;
    const { accessToken, refreshToken } = await refreshTheApiToken(token.refreshToken);

    const payload = {
      username,
      token: {
        accessToken,
        refreshToken
      }
    }
    
    const signedJwtToken = TOKEN_PREFIX + jwt.sign(payload, TOKEN_SECRET);

    return res.status(200).json({
      message: 'Refresh token successful',
      token: signedJwtToken
    });
  } catch (error) {
    console.error('Error refreshing token:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;