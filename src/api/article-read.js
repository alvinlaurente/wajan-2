const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');
require('dotenv').config();

const THEAPI_REGISTRATION_ENDPOINT = process.env.THEAPI_REGISTRATION_ENDPOINT;

router.get('/article-read/:id', authenticateJWT, async (req, res) => {
  try {
    const { token } = req.user;
    const { id } = req.params;
    const response = await axios.get(`${THEAPI_REGISTRATION_ENDPOINT}/article/${id}`, {
      headers: {
        authorization: token.accessToken,
      },
    });

    /*
    Assume the response.data from THEAPI is array of object like shown below
    { id: 'article1', title: 'Article 1', content: 'Content 1' }
    */
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching articles:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;