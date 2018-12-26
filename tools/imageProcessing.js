module.exports = ({ oldPath, newPath }) => {
  const Jimp = require('jimp');

  return Jimp.read(oldPath)
    .then(image => {
      let imageWidth = image.bitmap.width; 
      let imageHeight = image.bitmap.height;
      let squareSize = imageWidth > imageHeight ? imageHeight : imageWidth;
      let x = imageWidth / 2 - squareSize / 2;
      let y = imageHeight / 2 - squareSize / 2;

      return image
        .crop(x, y, squareSize, squareSize)
        .quality(60) 
        .write(newPath); 
    })
    .catch(err => {
      console.error(err);
    });
};
