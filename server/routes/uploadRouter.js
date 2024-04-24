const express = require('express');
const fileUpload = require('express-fileupload');

const imgController = require('../controllers/imgController.js');
const txtController = require('../controllers/txtController.js')
const router = express.Router();

router.use(fileUpload());

router.post('/', imgController.processImg, txtController.readTxt, txtController.chooseFile, (req, res) => { // imgController.verify
  // res.sendStatus(200);
  res.status(200).send(res.locals.writeFileName);
  // res.status(200).send(res.locals.weirdShit);
  // res.redirect('/convert');
});

  // router.post('/video')
  
module.exports = router;