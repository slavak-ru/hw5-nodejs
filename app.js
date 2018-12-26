const http = require('http');
const express = require('express');
const helmet = require('helmet');
const flash = require('connect-flash');
const session = require('express-session');
const logger = require('morgan');
const passport = require('passport');

const conf = require('./config');
const port = process.env.PORT || conf.get('port');

const app = express();
const server = http.createServer(app);

app.use(logger('dev'));
app.use(helmet());

// устанавливаем корневую папку проекта (все лежит в public)
app.use(express.static(conf.get('app-static')));

const sessionOption = require('./config/config-session')();
app.use(session(sessionOption));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// router
const router = require('./routes/index')(app);

//start chat
require('./controllers/socket').start(server);

server.listen(port, function() {
  console.log(`App listening on port ${server.address().port}`);
});
