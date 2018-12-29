let mongoose = require('mongoose');
let News = mongoose.Schema;

let newsSchema = new News({
  id: String,
  authorId: {
    type: String
  },
  text: {
    type: String,
  },
  theme: {
    type: String,
  },
  date: {
    type: String,
  }
});

const news = mongoose.model('news', newsSchema);

module.exports = news;