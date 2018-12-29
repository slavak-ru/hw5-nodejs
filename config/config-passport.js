const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../db');
const psw = require('../tools/password');

// локальная стратегия
const userStrategy = new LocalStrategy(
  { usernameField: 'username' },
  (username, password, done) => {
    db.getItem('users', { username: username })
      .then(user => {
        user = user[0];
        if (!user) {
          console.log('Нет такого пользователя.\n')
          return done(null, false, { message: 'Нет такого пользователя.\n' });
        }
        if (!psw.validPassword(password, user.userId, user.hash)) {
          return done(null, false, { message: 'Пароль не верен.\n' });
        }
        console.log(user)
        return done(null, user);
      })
      .catch(err => done(err));
  }
);

passport.use(userStrategy);

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
  const userToken = user.access_token;
  done(null, userToken);
  //const userId = user.id || user.userId;
  // done(null, userId);
});

passport.deserializeUser((id, done) => {
  return done(null, id);
});
