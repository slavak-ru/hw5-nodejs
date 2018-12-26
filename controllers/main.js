module.exports = (req, res, next) => {
  const conf = require('../config');
  const db = require('../db/db');
  const createData = require('../tools/createData');

  console.log(`main.js method: ${req.method} ulr: ${req.url}`);

  if (!req.session.passport) {
    return res
      .status(200)
      .sendFile('index.html', { root: conf.get('app-static') });
  }

  console.log(`userId: ${req.session.passport.user}`)
  db.getItem('user', { userId: req.session.passport.user })
    .then(user => {
      db.getItem('permission', { userId: user.userId }).then(permission => {
        user.permission = permission.permission;
        user.permissionId = permission.userId;
        let userData = createData.loginData(user);

        req.login(userData, err => {
          if (err) console.log(err.message);
          return res.status(200).redirect('/');
          //return res.status(200).send(JSON.stringify(userData));
        });
      });
    })
    .catch(err => console.log(err.message));
};
