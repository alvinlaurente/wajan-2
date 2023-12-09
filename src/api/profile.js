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

    if (response.status !== 200) {
      return res.status(response.status).json({
        message: response.data.detail
      })
    }

    if (response.status === 200 && response.data) {
      return res.status(200).json({
        message: 'Profile found',
        article: response.data
      })
    }

    return res.status(404).json({
      message: 'Profile is not found.'
    })
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;