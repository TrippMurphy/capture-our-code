const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const txtController = {};
//get data from txt
//split into arrays
//check file name
  //if user has inputed a file name writefilename = input
  //else if there is one in result.txt, set writefilename to the file name
  //else writefilename = index.js
//read codeData from <writefilename> and split into array
//check line number
  //if data has line numbers
    //if line number exists in writefilename, discard line
    //else if line number doesnt exist
      //push empty array to codeData until at line index, then change that index to data at line number (remove line number and other possible extra characters)
  //else append data to writeFileName

txtController.readTxt = (req, res, next) => {
  fsPromises.readFile(path.join(__dirname, '../result.txt'), 'utf-8')
  .then(data => {
    res.locals.readTxtData = data.split('\n');
    next();
  })
  .catch(err => next({
    log: 'Error occured in txtController.readTxt, image was not successfully processed' + JSON.stringify(err), 
    status: 500,
    message: {err: 'txtController.readTxt: ERROR: Check server logs for details'}
  }));
}

txtController.chooseFile = async(req, res, next) => {
  try{
    if(!res.locals.writeFileName){
      res.locals.writeFileName = 'index.js';
      for(let i = 0; i < res.locals.readTxtData.length; i++){
        if(res.locals.readTxtData[i].includes(' > ')){
          res.locals.writeFileName = txtController.split(`${res.locals.readTxtData[i]}`);
          res.locals.readTxtData.splice(i, 1);
        }
      }
    }
    next();
  } catch(err) {
    next({
      log: 'Error occured in txtController.chooseFile, file not specified' + JSON.stringify(err), 
      status: 500,
      message: {err: 'txtController.chooseFile: ERROR: Check server logs for details'}
    });
  }
}

// txtController.writeToLine = (req, res, next) => {

// }

txtController.split = (value) => {
  const regex = /\b\w+\.\w+\b/g;
  const name = regex.exec(value);
  if(name) return name[0];
  else return 'ERROR in txtController.split: no word containing a period was found';
}

module.exports = txtController;