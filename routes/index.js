module.exports = app => {
  const conf = require('../config');
  const bodyParser = require('../tools/bodyParser');

  app.use((req, res, next) => {
    if (
      req.method === 'GET' ||
      (req.headers['content-type'] &&
        req.headers['content-type'].includes('multipart/form-data'))
    ) {
      return next();
    }

    bodyParser(req)
      .then(body => {
        req.body = body;
        return next();
      })
      .catch(err => console.log(err.message));
  });

  app.post('/api/saveNewUser', require('../controllers/auth').registration);
  app.post('/api/login', require('../controllers/auth').login);
  app.post('/api/authFromToken', require('../controllers/auth').authFromToken);

  app.get('/api/getNews', require('../controllers/news').getNews);
  app.post('/api/newNews/', require('../controllers/news').postNews);
  app.put('/api/updateNews/:id', require('../controllers/news').updateNews);
  app.delete('/api/deleteNews/:id', require('../controllers/news').deleteNews);

  app.get('/api/getUsers', require('../controllers/users').getUsers);
  app.put(
    '/api/updateUserPermission/:id',
    require('../controllers/users').updateUserPermission
  );
  app.delete('/api/deleteUser/:id', require('../controllers/users').deleteUser);
  app.put('/api/updateUser/:id', require('../controllers/users').updateUser);
  app.post(
    '/api/saveUserImage/:id',
    require('../controllers/users').saveUserImage
  );

  app.get('*', require('../controllers/main'));
};
