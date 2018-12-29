const db = require('../db');
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

  db.addItem('news', news)
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
  let newsUpdated = req.body;
  let newsDate = { id: newsUpdated.id };
  db.updateItem('news', newsDate, newsUpdated)
    .then(response => {
      console.log(response)
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
  db.deleteItem('news', newsId)
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
  const response = [];
  return db
    .getAll('news')
    .then(newsAll => {

      if (!newsAll.length) {
        return res.status(200).send(newsAll);
      }
      
      db.getAll('users')
        .then(users => {

          newsAll.forEach(news => {
            
            let currentNews = {id: news.id, authorId: news.authorId, text: news.text, theme: news.theme, date: news.date
            };

            users.forEach(user => {
              if (news.authorId !== user.userId) return;
              let userData = createData.newsData(user);
              currentNews.user = userData;
            });
            if(!currentNews.user) currentNews.user = defultUser;

            response.push(currentNews);
          });
          return res.status(200).send(response);
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
