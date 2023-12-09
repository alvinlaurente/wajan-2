const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');
require('dotenv').config();

const THEAPI_REGISTRATION_ENDPOINT = process.env.THEAPI_REGISTRATION_ENDPOINT;

router.get('/article-list', authenticateJWT, async (req, res) => {
  try {
    const { token } = req.user;
    const { limit, offset } = req.query;
    const response = await axios.get(`${THEAPI_REGISTRATION_ENDPOINT}/article?limit=${limit}&offset=${offset}`, {
      headers: {
        authorization: token.accessToken,
      },
    });

    /*
    Assume the response.data from THEAPI is array of object like shown below
    [{ id: 'article1', title: 'Article 1', content: 'Content 1' }, { id: 'article2', title: 'Article 2', content: 'Content 2' }];
    */
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching articles:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;