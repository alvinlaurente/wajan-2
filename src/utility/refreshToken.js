const axios = require('axios');
require('dotenv').config();

const refreshTheApiToken = async (refreshToken) => {
  try {
    const form = new FormData();
    form.append('refresh', refreshToken);
    const response = await axios.post(`${THEAPI_REGISTRATION_ENDPOINT}/api/token/refresh/`, form);

    return {
      accessToken: response.data.token.accessToken,
      refreshToken: response.data.token.refreshToken
    }
  } catch (error) {
    console.error('Error refreshing TheApi token:', error.message);
  }
};

module.exports = {
  refreshTheApiToken
}