function connectDB() {
  const conf = require('../config');
  const url = $mongoURL;
  // const url = conf.get('mongo').url;
  const baseName = conf.get('mongo').baseName;
  const MongoClient = require('mongodb').MongoClient;
  const mongoClient = new MongoClient(url, { useNewUrlParser: true });
  return { mongoClient: mongoClient, baseName: baseName };
}

exports.getItem = (collection, itemParam) => {
  return new Promise((resolve, reject) => {
    const { mongoClient, baseName } = connectDB();

    mongoClient.connect(function(err, client) {
      if (err) {
        reject(err);
      }
      const db = client.db(baseName);
      db.collection(collection)
        .findOne(itemParam)
        .then(item => {
          client.close();
          return resolve(item);
        });
    });
  });
};


exports.addItem = (item, collection) => {
  return new Promise((resolve, reject) => {
    const { mongoClient, baseName } = connectDB();
    const response = {};

    mongoClient.connect(function(err, client) {
      if (err) {
        reject(err);
      }
      const db = client.db(baseName);
      db.collection(collection).insertOne(item, function(err, result) {
        if (err) {
          response.status = false;
          response.message = `Ошибка в базе данных: ${err.message}`;
          console.log(err.message);
          return resolve(response);
        }
        client.close();
        response.status = true;
        response.message = 'Добавлено';
        return resolve(response);
      });
    });
  });
};

exports.getAll = collection => {
  return new Promise((resolve, reject) => {
    const { mongoClient, baseName } = connectDB();

    mongoClient.connect(function(err, client) {
      if (err) {
        reject(err);
      }
      const db = client.db(baseName);
      db.collection(collection)
        .find()
        .toArray(function(err, data) {
          if (err) {
            reject(err);
          }
          client.close();
          resolve(data);
        });
    });
  });
};

exports.updateItem = (itemParam, newData, collection) => {
  return new Promise((resolve, reject) => {
    const { mongoClient, baseName } = connectDB();

    mongoClient.connect(function(err, client) {
      if (err) {
        reject(err);
      }
      const db = client.db(baseName);
      db.collection(collection).updateOne(
        itemParam,
        { $set: newData },
        (err, result) => {
          let response = {};
          if (err) {
            response.status = false;
            response.message = `Ошибка в базе данных: ${err.message}`;
            client.close();
            return resolve(response);
          }

          response.status = true;
          response.message = 'Обновлено';
          client.close();
          resolve(response);
        }
      );
    });
  });
};

exports.deleteItem = (itemParam, collection) => {
  return new Promise((resolve, reject) => {
    const { mongoClient, baseName } = connectDB();

    mongoClient.connect(function(err, client) {
      if (err) {
        reject(err);
      }
      const db = client.db(baseName);
      db.collection(collection).deleteOne(itemParam, 
        (err, result) => {
          let response = {};
          if (err) {
            response.status = false;
            response.message = `Ошибка в базе данных: ${err.message}`;
            client.close();
            return resolve(response);
          }

          response.status = true;
          response.message = 'Удалено!';
          client.close();
          resolve(response);
        }
      );
    });
  });
};

exports.deleteAllItems = (itemParam, collection) => {
  return new Promise((resolve, reject) => {
    const { mongoClient, baseName } = connectDB();

    mongoClient.connect(function(err, client) {
      if (err) {
        reject(err);
      }
      const db = client.db(baseName);
      db.collection(collection).deleteMany(itemParam, 
        (err, result) => {
          let response = {};
          if (err) {
            response.status = false;
            response.message = `Ошибка в базе данных: ${err.message}`;
            client.close();
            return resolve(response);
          }

          response.status = true;
          response.message = 'Удалено!';
          client.close();
          resolve(response);
        }
      );
    });
  });
};
