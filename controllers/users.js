const db = require('../db');
const createData = require('../tools/createData').loginData;
const conf = require('../config');

exports.getUsers = (req, res) => {
  getAllUsers(res);
};

exports.updateUserPermission = (req, res) => {
  const itemParam = { userId: req.body.permissionId };
  const newPermission = req.body.permission;


  db.getItem('users', itemParam)
    .then(user => {
      const permission = user[0].permission;
      for (let key in newPermission) {
        if (typeof newPermission[key] === 'object') {
          Object.keys(newPermission[key]).forEach(val => {
            permission[key][val] = newPermission[key][val];
          });
        }
      }

      db.updateItem('users', itemParam, { permission: permission }).then(
        result => {
          if (!result.status) {
            return res
              .status(500)
              .send(`Ошибка базы данных: ${result.message}`);
          }
          getAllUsers(res);
        }
      );
    })
    .catch(err => console.log(err.message));
};

exports.updateUser = (req, res) => {
  const psw = require('../tools/password');
  const userID = req.params.id;
  const itemParam = { userId: userID };
  const changedFields = {};

  Object.keys(req.body).forEach(key => {
    if (key === 'oldPassword') return;
    if (key === 'password') {
      const hash = psw.setHashPassword(req.body[key], userID);

      key = 'hash';
      changedFields[key] = hash;
      return;
    }
    if (key === 'id') {
      changedFields.userId = req.body[key];
      return;
    }
    if (key === 'image') {
      return;
    }
    changedFields[key] = req.body[key];
  });
  updateItemAndGetItem(res, itemParam, changedFields, 'users');
};

exports.saveUserImage = (req, res) => {
  const multiparty = require('multiparty');
  const path = require('path');
  const saveFile = require('../tools/saveFile');
  const imageProcessing = require('../tools/imageProcessing');
  const form = new multiparty.Form();

  form.on('error', function(err) {
    console.log('Error parsing form: ' + err.stack);
  });
  form.parse(req, function(err, fields, files) {
    const userID = req.params.id;
    const itemParam = { userId: userID };
    const file = files[userID][0];
    const fileSize = file.size;
    const fileName = file.originalFilename;
    const fileExt = path
      .parse(fileName)
      .ext.slice(1)
      .toLocaleLowerCase();
    const filePath = file.path;
    const fileNewPath = path.join(
      __dirname,
      '..',
      conf.get('app-static'),
      'assets',
      'img',
      fileName
    );
    
    if (
      !conf.get('MIME').includes(fileExt) ||
      conf.get('maxUploadSize') < fileSize
    ) {
      const message = `Допустимы только изображения объемом до ${(
        +conf.get('maxUploadSize') /
        (1024 * 1024)
      ).toFixed(2)} MB`;
      req.flash('message', message);
      return res.status(413).send(message);
    }
    imageProcessing({ oldPath: filePath, newPath: fileNewPath }) // если надо изменить изображение
      // saveFile({ oldPath: filePath, newPath: fileNewPath }) // сохранение изображения без изменений
      .then(() => {
        const updateData = { img: `${conf.get('uploadPath')}${fileName}` };
        updateItemAndGetItem(res, itemParam, updateData, 'users');
      })
      .catch(err => console.log(err.message));
  });
};

exports.deleteUser = (req, res) => {
  const userId = { userId: req.params.id };
  db.deleteItem('users', userId)
    .then(response => {
      if (!response.status) {
        return res.status(500).send(`Ошибка базы данных: ${response.message}`);
      }
      if (conf.get('deleteUserNews')) {
        const query = { authorId: userId.userId };
        db.deleteAllItems(query, 'news').then(result => {
          if (!result.status)
            res.status(500).send(`Ошибка базы данных: ${result.message}`);
        });
      }
      getAllUsers(res);
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).send(`Ошибка базы данных: ${err.message}`);
    });
};

function updateItemAndGetItem(res, itemParam, updateData, collection) {
  db.updateItem(collection, itemParam, updateData).then(result => {
    if (!result.status)
      return res.status(500).send(`Ошибка базы данных: ${result.message}`);

      db.getItem(collection, itemParam).then(user => {
        user = user[0];
        let userData = createData(user);
        return res.status(200).send(userData);
      })
  });
}

function getAllUsers(res) {
  db.getAll('users')
    .then(usersData => {
      let clientData = [];
      usersData.forEach(user => {
        let userData = createData(user);
        clientData.push(userData);
      });
      return res.status(200).send(clientData);
    })
    .catch(err => console.log(err.message));
}
