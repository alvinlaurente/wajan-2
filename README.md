# Coding Test Challenge #2

### All of the source code provided in JavaScript using Express.js

- Sensitive information saved in .env file. To get the reference please refer to .env.example file.
- All the protected APIs assumed that the access token provided by user is extracted in request headers authorization. To decode the JWT token, look forward into middleware file. The middleware will be executed before request handled.
- Since the registration API provided by TheApi for some reason is error. I always get Server Internal Error (500) with reason like below:

> AttributeError at /api/register. 'str' object has no attribute 'decode'

- I already make sure that I provided all required request body in the HTML Form of registration. I tested using Browser and API Tool like Postman. Both giving me the same error message. Since I couldn't register myself, I also couldn't test other APIs since the username and password is required. So the code in this repository is based on my assumptions and predictions.
- The JWT Implementation that I implemented should be like this:
  - User/client register via the API provided by proxy server. Then, extract the request body using multer for multipart/form-data (to extract the image file, assumed the file will be uploaded to my own storage bucket and then save the file temporarily into the server, then append the file into the form) and then I append all request to the formData. The expected result from TheApi is the proxy server get the JWT token (both access token and refresh token). Then I sign new JWT with custom payload and pass the new signed token to the user/client.
  - The provided token from proxy server then used by client to access another API (assumed it will be provided in the request header authorization). The decoded data will be extracted by middleware before execute the API. The middleware then will set req.user with decoded data (the payload provided after successfully register).
  - I made the API for requesting new access token if it expired. Using the API provided by TheApi, from the response the API will resign new JWT with same payload and then send it back to client. I am sorry that I couldn't understand how background task will be implemented for refreshing the token. I assume this background task could be implemented with a scheduler (or cron job) that run on the server to periodically checks the expiration of access tokens (or refresh tokens too, perhaps) stored on the server. But if it the case, I confused how to give the new token back to the client, since the client need to request it first. Maybe a help with socket connection could give new token to dedicated user if any connected user is match with their username provided in the payload.
- I am sorry too that I couldn't provide any test units since I never learnt unit testing before. I tried to watch some of the tutorial videos, but I couldn't write any because I don't really understand how to write a proper test.