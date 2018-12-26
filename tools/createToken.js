module.exports = (userId) => {
  const jwt = require('jsonwebtoken');
  const conf = require('../config');

  return jwt.sign(
    { id: userId },
    conf.get('session').secret,
    { expiresIn: conf.get('session').tokenMaxAge }
  );
}