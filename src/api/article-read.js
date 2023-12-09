const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');
require('dotenv').config();

const THEAPI_REGISTRATION_ENDPOINT = process.env.THEAPI_REGISTRATION_ENDPOINT;

router.get('/article-read/:id', authenticateJWT, async (req, res) => {
  try {
    const { token } = req.user;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: 'Please provide the id in the parameter'
      })
    }

    if (typeof id !== number) {
      return res.status(400).json({
        message: 'Please provide the id in the parameter with type of integer'
      })
    }

    const response = await axios.get(`${THEAPI_REGISTRATION_ENDPOINT}/article/${id}`, {
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
        message: `Article ${id} found.`,
        article: response.data
      })
    }

    return res.status(404).json({
      message: `Article ${id} is not found.`
    })
  } catch (error) {
    console.error('Error fetching articles:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;