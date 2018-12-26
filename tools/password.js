const crypto = require('crypto');
const conf = require('../config');

module.exports.setHashPassword = function(password, id) {
  let hash = crypto
    .pbkdf2Sync(password, id, 1000, 512, 'sha512')
    .toString('hex').slice(0, conf.get('userHashLength'));

  return hash;
};

module.exports.validPassword = function(password, id, targetHash) {
  const hash = crypto
    .pbkdf2Sync(password, id, 1000, 512, 'sha512')
    .toString('hex').slice(0, conf.get('userHashLength'));

  return targetHash === hash;
};

module.exports.encrypt = function(password, string) {
  const cipher = crypto.createCipher('aes192', password);
  let encrypted = cipher.update(string, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return encrypted;
};

module.exports.decrypt = function(password, encrypted) {
  const decipher = crypto.createDecipher('aes192', password);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};
