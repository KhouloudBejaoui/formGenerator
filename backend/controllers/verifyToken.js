const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send('Unauthorized request');
  }
  let token = req.headers.authorization.split(' ')[1];
  if (token === 'null') {
    return res.status(401).send('Unauthorized request');
  }
  try {
    let payload = jwt.verify(token, 'secretKey');
    console.log('Payload:', payload); // Log the payload for debugging
    req.user = payload; // Set the payload in the request object
    next();
  } catch (error) {
    return res.status(401).send('Invalid token');
  }
};
