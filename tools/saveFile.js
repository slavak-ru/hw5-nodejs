function saveFile({ oldPath, newPath }) {
  const fs = require('fs');
  return new Promise((resolve, reject) => {
      fs.rename(oldPath, newPath, err => {
          if (err) throw err;
          resolve();
      });
  });
}

module.exports = saveFile;