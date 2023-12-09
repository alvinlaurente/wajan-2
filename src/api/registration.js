const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

require('dotenv').config();
const THEAPI_REGISTRATION_ENDPOINT = process.env.THEAPI_REGISTRATION_ENDPOINT;
const TOKEN_SECRET = process.env.TOKEN_SECRET;

let theapiJwtToken = null;
let theapiJwtTokenRefresh = null;

router.post('/register', async (req, res) => {
  try {
    const {
      username,
      password,
      first_name,
      last_name,
      telephone,
      profile_image,
      address,
      city,
      province,
      country
    } = req.body;

    if (!username ||
      !password ||
      !first_name ||
      !last_name ||
      !telephone ||
      !profile_image ||
      !address ||
      !city ||
      !province ||
      !country
    ) {
      return res.badRequest();
    }

    const form = new FormData();
    form.append('username', req.body.username);
    form.append('password', req.body.password);
    form.append('first_name', req.body.first_name);
    form.append('last_name', req.body.last_name);
    form.append('telephone', req.body.telephone);
    form.append('profile_image', req.body.profile_image); // Assuming profile_image is a file path or Buffer
    form.append('address', req.body.address);
    form.append('city', req.body.city);
    form.append('province', req.body.province);
    form.append('country', req.body.country);

    const response = await axios.post(`${THEAPI_REGISTRATION_ENDPOINT}/register`, form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    theapiJwtToken = response.data.token.accessToken;
    theapiJwtTokenRefresh = response.data.token.refreshToken;

    const payload = {
      username,
      token: {
        accessToken: theapiJwtToken,
        refreshToken: theapiJwtTokenRefresh
      }
    };

    const signedJwtToken = 'TSTMY' + jwt.sign(payload, TOKEN_SECRET)

    return res.status(201).json({
      message: 'Registration successful',
      token: signedJwtToken
    });
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;