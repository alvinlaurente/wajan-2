const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');
require('dotenv').config();

const THEAPI_REGISTRATION_ENDPOINT = process.env.THEAPI_REGISTRATION_ENDPOINT;

router.get('/profile', authenticateJWT, async (req, res) => {
  try {
    const { token } = req.user;
    const response = await axios.get(`${THEAPI_REGISTRATION_ENDPOINT}/profile`, {
      headers: {
        authorization: token.accessToken,
      },
    });
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;