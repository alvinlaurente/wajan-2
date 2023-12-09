const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');
require('dotenv').config();

const THEAPI_REGISTRATION_ENDPOINT = process.env.THEAPI_REGISTRATION_ENDPOINT;

router.get('/article-list', authenticateJWT, async (req, res) => {
  try {
    const { token } = req.user;
    const { limit, offset } = req.query;

    let theApiRoute = `${THEAPI_REGISTRATION_ENDPOINT}/article`;

    if (typeof limit !== number) {
      return res.status(400).json({
        message: 'Please provide with correct limit with type of integer'
      })
    }

    if (typeof offset !== number) {
      return res.status(400).json({
        message: 'Please provide with correct offset with type of integer'
      })
    }

    if (limit && offset) {
      theApiRoute += `?limit=${limit}&offset=${offset}`
    } else if (limit) {
      theApiRoute += `?limit=${limit}`
    } else if (offset) {
      theApiRoute += `?offset=${offset}`
    }
    const response = await axios.get(theApiRoute, {
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
        message: 'Article found.',
        article: response.data
      })
    }

    return res.status(404).json({
      message: 'No any article can be shown'
    })

  } catch (error) {
    console.error('Error fetching articles:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;