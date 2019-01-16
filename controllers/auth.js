const db = require('../db');
const createData = require('../tools/createData');
const passport = require('passport');
require('../config/config-passport');

exports.registration = (req, res) => {
  const newUser = req.body;
  const dbQuery = { username: newUser.username };
  db.getItem('users', dbQuery)
    .then(result => {
      if (result[0]) {
        const message = 'Пользователь с таким логином уже существует';
        req.flash('message', 'Пользователь с таким логином уже существует');
        return res.status(200).send(JSON.stringify(message));
      }

      let {
        baseDataUser,
        clientData,
      } = createData.registrationData(newUser);

      db.addItem('users', baseDataUser).then(result => {
        if (!result.status) {
          return res.status(500).send(result.message);
        }

          req.login(clientData, err => {
            if (err) console.log(err.message);
            return res.status(200).send(JSON.stringify(clientData));
          });
        });
    })
    .catch(err => {
      console.log(err.message);
      res
        .status(500)
        .send(`Ошибка создания нового пользователя: ${err.message}`);
    });
};

exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return res.send(err.message);
    if (!user) {
      req.flash('message', info.message);
      return res.status(404).send(JSON.stringify(info.message));
    }
    let userData = createData.loginData(user);
    req.login(userData, err => {
      if (err) console.log(err.message);
      return res.status(200).send(JSON.stringify(userData));
    });

  })(req, res, next);
};

exports.authFromToken = (req, res) => {
  db.getItem('sessions', { _id: req.sessionID })
    .then(data => {
      if (!data) return res.status(404);
      const psw = require('../tools/password');
      const createData = require('../tools/createData');

      let json = psw.decrypt(req.sessionID, JSON.parse(data.session).user);
      if (req.ip !== JSON.parse(json).ip) return;

      db.getItem('user', { userId: JSON.parse(json).userId }).then(user => {
        if (!user) return res.status(404);
        db.getItem('permission', { userId: user.userId }).then(permission => {
          if (!permission) return res.status(404);

          user.permission = permission.permission;
          user.permissionId = permission.userId;

          let response = createData.loginData(user);
          return res.status(200).send(JSON.stringify(response));
        });
      });
    })
    .catch(err => console.log(err.message));
};
