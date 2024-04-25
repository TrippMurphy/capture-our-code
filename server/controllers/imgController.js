const tesseract = require('tesseract.js');
const fs = require('fs/promises');
const path = require('path');

const imgController = {};

// imgController.verify = (req, res, next) => {
//   const { image } = req.files;
//   if (!image) res.redirect('/video');

//   if (/^image/.test(image.mimetype)) return res.sendStatus(400);

//       // image.mv(__dirname + '/upload/' + image.name);
//   return next();
// };

imgController.processImg = (req, res, next) => {
  tesseract.recognize(req.files.image.data, 'eng')
    .then((data) => {
      fs.writeFile(path.resolve(__dirname, '../result.txt'), data.data.text)
      .then(() => {
        res.locals.writeFileName = req.body['output-file-name'];
        return next();
      })
      .catch(err => next({
        log: 'Error occured in imgController.processImg, image was not successfully processed' + JSON.stringify(err), 
          status: 500,
          message: {err: 'imgController.processImg: ERROR: Check server logs for details'}
        }));
    })
    .catch(err => next({
      log: 'Error occured in imgController.processImg, image was not successfully processed' + JSON.stringify(err), 
      status: 500,
      message: {err: 'imgController.processImg: ERROR: Check server logs for details'}
    }));
}



  module.exports = imgController;