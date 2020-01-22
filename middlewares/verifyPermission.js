const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('auth-token');
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) res.status(400).send({ message: 'Invalid token' });

      req.userId = decoded;
      next();
    });
  } else {
    res.status(401).send({ message: 'Access denied' });
  }
};
