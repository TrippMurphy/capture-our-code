const fs = require('fs');
const path = require('path');
const zip = require('express-zip');

const fileController = {};

fileController.downloadFiles = (req, res, next) => {
  const folderPath = path.join(__dirname, `../../downloads`);
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      next({
        log: 'Error occured in fileController.downloadFiles, could not download files' + JSON.stringify(err), 
        status: 500,
        message: {err: 'fileController.downloadFiles: ERROR: Check server logs for details'}
      });
    }
    const filesToZip = files.map(file => ({
      path: path.join(folderPath, file),
      name: file
    }));
    res.zip(filesToZip);
  });
}

fileController.clearFiles = (req, res, next) => {
  const folderPath = path.join(__dirname, '../../downloads');
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      next({
        log: 'Error occured in fileController.clearFiles, could not download files' + JSON.stringify(err), 
        status: 500,
        message: {err: 'fileController.downloadFile: ERROR: Check server logs for details'}
      });
    }
    files.forEach((file, index) => {
      const filePath = path.join(folderPath, file);
        fs.unlink(filePath, (err) => {
        if (err) {
          next({
            log: 'Error occured in fileController.clearFiles, could not delete files' + JSON.stringify(err), 
            status: 500,
            message: {err: 'fileController.clearFiles: ERROR: Check server logs for details'}
          });
        }

        if (index === files.length - 1) {
          res.send("All files deleted successfully");
        }
      });
    });
  });
}
module.exports = fileController;