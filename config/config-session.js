module.exports = () => {
  const conf = require('./index');
  const uuid = require('uuid/v4');
  const mongoose = require('mongoose');
  const session = require('express-session');
  const MongoStore = require('connect-mongo')(session);
  mongoose.connect(conf.get('mongo').url + conf.get('mongo').baseName, { promiseLibrary: global.Promise,  useNewUrlParser: true });

  return ({
    genid: req => {
      return uuid(); // use UUIDs for session IDs
    },
    // name: 'session',
    secret: conf.get('session').secret,
    key: conf.get('session').key,
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: conf.get('session').maxAge,
    },
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
  });
};
