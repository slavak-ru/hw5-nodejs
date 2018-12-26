const nconf = require('nconf');

nconf
  .argv()
  .env()
  .file(setConfigFile());

module.exports = nconf;

function setConfigFile() {
  const configFile =
    nconf.get('NODE_ENV') && nconf.get('NODE_ENV').trim() === 'development'
      ? '/config-dev.json'
      : '/config-prod.json';

  return { file: __dirname + configFile };
}
