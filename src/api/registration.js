const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const sizeOf = require('image-size');
const express = require('express');
const router = express.Router();

require('dotenv').config();
const THEAPI_REGISTRATION_ENDPOINT = process.env.THEAPI_REGISTRATION_ENDPOINT;
const TOKEN_SECRET = process.env.TOKEN_SECRET;

// Set up multer middleware for handling file uploads
const storage = multer.memoryStorage(); // customize storage as needed
const upload = multer({ storage: storage });

let theapiJwtToken = null;
let theapiJwtTokenRefresh = null;

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const validatePhoneNumber = (phoneNumber) => {
  return String(phoneNumber)
    .match(/^\+628\d{8,11}$/)
}

const isValidImage = (buffer) => {
  try {
    // Use image-size library to get the dimensions of the image
    const dimensions = sizeOf(buffer);

    // Check if the image has valid dimensions (you can adjust the criteria)
    if (dimensions.width >= 1 && dimensions.height >= 1) {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}

router.post('/register', upload.single('profile_image'), async (req, res) => {
  try {
    const {
      username,
      password,
      first_name,
      last_name,
      telephone,
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
      !address ||
      !city ||
      !province ||
      !country
    ) {
      return res.badRequest();
    }

    let errorDetails = {};
    let validate = true;

    if (!validateEmail(username)) {
      validate = false;
      errorDetails['username'] = 'Enter a valid email address.'
    }
    if (!validatePhoneNumber(telephone)) {
      validate = false;
      errorDetails['telephone'] = 'Enter a valid phone number.'
    }

    // Check if the 'profile_image' field is present in the request
    if (!req.profile_image) {
      return res.status(400).json({ success: false, error: 'No file provided' });
    }
    // Access the uploaded file information
    const uploadedFile = req.profile_image;
    
    if (!isValidImage(uploadedFile.buffer)) {
      validate = false;
      errorDetails['profile_image'] = 'The submitted data was not a file. Check the encoding type on the form.'
    }

    if (!validate) {
      return res.status(400).json({
        details: errorDetails
      })
    }

    const form = new FormData();
    form.append('username', username);
    form.append('password', password);
    form.append('first_name', first_name);
    form.append('last_name', last_name);
    form.append('telephone', telephone);
    form.append('address', address);
    form.append('city', city);
    form.append('province', province);
    form.append('country', country);

    // Save the file to a temporary location
    const tempFilePath = `../../temp/${uploadedFile.originalname}`;
    fs.writeFileSync(tempFilePath, uploadedFile.buffer)
    
    // Append the file to form
    form.append('profile_image', fs.createReadStream(tempFilePath), { filename: uploadedFile.originalname });

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