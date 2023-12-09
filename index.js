const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();
const app = express();

const PORT = process.env.PORT;

// API Routes
const registration = require('./src/api/registration');
const refreshToken = require('./src/api/refreshToken');
const profile = require('./src/api/profile');
const articleList = require('./src/api/article-list');
const articleRead = require('./src/api/article-read');

// Unprotected route
app.use(registration);

// Protected route
app.use(refreshToken);
app.use(profile);
app.use(articleList);
app.use(articleRead);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
