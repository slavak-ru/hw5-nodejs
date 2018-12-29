const conf = require('../config');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(conf.get('mongooseURL'), { useNewUrlParser: true, autoIndex: false });

const models = {
  users: require('../models/userModel'),
  news: require('../models/newsModel'),
}

exports.getItem = (collection, itemParam) => {
  let model = models[collection];
  return model.find(itemParam, (err, item) => {
    if(err) {
      console.log(err.message);
      return;
    }
    return item;
  });
}

exports.addItem = (collection, item) => {
  let Item = models[collection];
  let addedItem = new Item(item);
  const response = {};

  return addedItem.save().then((data) => {
    response.status = true;
    response.message = 'Добавлено';
    response.data = data;

    return response;
  })
  .catch(err => {
    response.status = false;
    response.message = `Ошибка в базе данных: ${err.message}`;
    return response;
  });
}

exports.getAll = collection => {
  let model = models[collection];
  return model.find({}, (err, items) => {
    if(err) {
      console.log(err.message);
      return;
    }
    return items;
  });
}

exports.deleteItem = (collection, item) => {
  let model = models[collection];
  let response = {};
  return model.deleteOne(item).then(result => {
    response.status = true;
    response.message = 'Удалено!';
    return response;
  })
  .catch(err => {
    response.status = false;
    response.message = `Ошибка в базе данных: ${err.message}`;
    return response;
  });
}

exports.updateItem = (collection, item, newData) => {
  let model = models[collection];
  let response = {};
  return model.updateOne(item, {'$set': newData}).then(result => {
    response.status = true;
    response.message = 'Обновлено';
    return response;
  })
  .catch(err => {
    response.status = false;
    response.message = `Ошибка в базе данных: ${err.message}`;
    return response;
  });
}
