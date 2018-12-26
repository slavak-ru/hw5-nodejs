const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../db/db');
const psw = require('../tools/password');

// локальная стратегия
const userStrategy = new LocalStrategy(
  { usernameField: 'username' },
  (username, password, done) => {
    db.getItem('user', { username: username })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'Нет такого пользователя.\n' });
        }

        if (!psw.validPassword(password, user.userId, user.hash)) {
          return done(null, false, { message: 'Пароль не верен.\n' });
        }

        return done(null, user);
      })
      .catch(err => done(err));
  }
);

passport.use(userStrategy);

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
  const userId = user.id || user.userId;

  done(null, userId);
});

passport.deserializeUser((id, done) => {
  return done(null, id);
});
