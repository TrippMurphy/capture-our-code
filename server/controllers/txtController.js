const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const txtController = {};

//check line number
  //if result.txt has line numbers
    //if line number exists in writefilename, discard line
    //else if line number doesnt exist
      //push empty array to codeData until at line index, then change that index to data at line number (remove line number and other possible extra characters)
  //else append data to writeFileName

txtController.readTxt = (req, res, next) => {
  fsPromises.readFile(path.join(__dirname, '../result.txt'), 'utf-8')
  .then(data => {
    res.locals.readTxtData = data.split('\n');
    res.locals.readTxtData = res.locals.readTxtData.filter(string => string);
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
          res.locals.readTxtData.splice(0, i + 1);
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

txtController.writeToLine = async (req, res, next) => {
  try{
    const filePath = path.join(__dirname, `../../downloads/`, res.locals.writeFileName);
    let currentFile = false;
    let lineNumber = false;
    let txtHasLineNumbers = false;
    // check if file exists
    try{
      await fsPromises.access(filePath)
      currentFile = true;
    } catch (err) {
      currentFile = false;
    }
    // if file does exist, read file
    if(currentFile){
      try{
        currentFile = await fsPromises.readFile(filePath);
        currentFile = currentFile.toString().split('\n');
      }
      catch (err) {
        next({
          log: 'Error occured in txtController.writeToLine, could not read/split file' + JSON.stringify(err), 
          status: 500,
          message: {err: 'txtController.writeToLine: ERROR: Check server logs for details'}
        });
      }
    }

    for (let i = 0; i < res.locals.readTxtData.length; i++) {
      const line = res.locals.readTxtData[i].trim(); // Trim whitespace from the line
      const match = line.match(/^\D*(\d+)/); // Match digits at the beginning of the line, allowing for non-digit characters before the number
      if (match) {
        txtHasLineNumbers = true;
        break;
      }
    }  

    // logic for writing on a file that exists and is populated would go here, this is important for OCR-ing videos, screen recordings, and cases where a file is too large to be written in a single screenshot
    if (lineNumber !== false) {
      // Line number found, overwrite lines from that point
        fileContent = txtController.filterByLineNumber(res.locals.readTxtData, lineNumber);
      try {
        await fsPromises.writeFile(filePath, fileContent, 'utf-8');
      } catch (err) {
        next({
          log: 'Error occured in txtController.writeToLine, could not write to existing file' + JSON.stringify(err), 
          status: 500,
          message: {err: 'txtController.writeToLine: ERROR: Check server logs for details'}
        });
      }
    } else {
      // No line numbers found or file doesn't exist, create the file and write data
      let filteredData = res.locals.readTxtData;
      if(txtHasLineNumbers !== false){
        filteredData = txtController.splitAll(res.locals.readTxtData)
      }
      try {
        await fsPromises.writeFile(filePath, filteredData.join('\n'), 'utf-8');
      } catch (err) {
        next({
          log: 'Error occured in txtController.writeToLine, could not write to new file' + JSON.stringify(err), 
          status: 500,
          message: {err: 'txtController.writeToLine: ERROR: Check server logs for details'}
        });
      }
    }
    // res.locals.currentFileData = lineNumber.toString();
    next();
  } catch (err) {
    next({
      log: 'Error occured in txtController.writeToLine' + JSON.stringify(err), 
      status: 500,
      message: {err: 'txtController.writeToLine: ERROR: Check server logs for details'}
    });
  } 
}
  
txtController.filterByLineNumber = (data, lineNumber) => {
  let filteredData = [];
  let lineNumberFound = false;
  for (let i = 0; i < data.length; i++) {
    if (!isNaN(parseInt(data[i][0]))) {
      if (!lineNumberFound && parseInt(data[i][0]) === lineNumber) {
        lineNumberFound = true;
      } else if (lineNumberFound && parseInt(data[i][0]) !== lineNumber + 1) {
        // Stop if next line number is encountered
        break;
      }
    }
    if (lineNumberFound) {
      filteredData.push(data[i]);
    }
  }
  return filteredData.join('\n');
};

txtController.split = (value) => {
  const regex = /\b\w+\.\w+\b/g;
  const name = regex.exec(value);
  if(name) return name[0];
  else return 'ERROR in txtController.split: no word containing a period was found';
}

txtController.splitAll = (txtData) => {
  let line = [];
  const output = [];
  for(let i = 0; i < txtData.length; i++){
    line = [];
    // output.push(txtData[i].length);
    for(let j = 0; j < txtData[i].length; j++){
      if(!isNaN(txtData[i][j]) && (isNaN(txtData[i][j+1]) || j === txtData[i].length - 1)){
        line.push(txtData[i].slice(j + 1, txtData[i].length));
        break;
      }
    }
    output.push(line.join(''));
  }
  return output;
}

module.exports = txtController;