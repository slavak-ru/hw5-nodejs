function bodyParser(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', function(chunk) {
      body += chunk;
    });

    req.on('end', function() {
      let data;
      try {
        data = JSON.parse(body);
      } catch (err) {
        data = body;
      }
      resolve(data);
    });
  }).catch(err => console.log(err.message));
}

module.exports = bodyParser;
