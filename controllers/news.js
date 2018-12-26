const db = require('../db/db');
const createData = require('../tools/createData');
const conf = require('../config');

exports.getNews = (req, res) => {
  getNewsAndUsers(res);
};

exports.postNews = (req, res) => {
  const createNewsID = require('../tools/createID');
  let newsID = createNewsID();

  let news = {
    id: newsID,
    authorId: req.body.userId,
    text: req.body.text,
    theme: req.body.theme,
    date: req.body.date,
  };

  db.addItem(news, 'news')
    .then(response => {
      if (response.status) {
        getNewsAndUsers(res);
      }
    })
    .catch(err => {
      console.log(err.message);
      res
        .status(500)
        .send(`Ошибка полуения/добавления новостей: ${err.message}`);
    });
};

exports.updateNews = (req, res) => {
  let news = req.body;
  let newsDate = { date: news.date };
  db.updateItem(newsDate, news, 'news')
    .then(response => {
      if (response.status) {
        getNewsAndUsers(res);
      }
    })
    .catch(err => {
      console.log(err.message);
      res
        .status(500)
        .send(`Ошибка полуения/добавления новостей: ${err.message}`);
    });
};

exports.deleteNews = (req, res) => {
  const newsId = { id: req.params.id };
  db.deleteItem(newsId, 'news')
    .then(response => {
      if (response.status) {
        getNewsAndUsers(res);
      }
    })
    .catch(err => {
      console.log(err.message);
      res
        .status(500)
        .send(`Ошибка полуения/добавления новостей: ${err.message}`);
    });
};

function getNewsAndUsers(res) {
  const defultUser = conf.get('defultUser');
  return db
    .getAll('news')
    .then(newsAll => {
      if (!newsAll.length) {
        return res.status(200).send(newsAll);
      }
      db.getAll('user')
        .then(users => {
          newsAll.forEach(news => {
            users.forEach(user => {
              if (news.authorId !== user.userId) return;
              let userData = createData.newsData(user);
              news.user = userData;
            });
            if (!news.user) news.user = defultUser;
          });

          return newsAll;
        })
        .then(newsAll => {
          return res.status(200).send(newsAll);
        })
        .catch(err => {
          console.log(err.message);
        });
    })
    .catch(err => {
      console.log(err.message);
      return res.status(500).send(`Ошибка полуения новостей: ${err.message}`);
    });
}
