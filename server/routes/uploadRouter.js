const express = require('express');
const fileUpload = require('express-fileupload');

const imgController = require('../controllers/imgController.js');
const txtController = require('../controllers/txtController.js');
const router = express.Router();

router.use(fileUpload());

router.post('/', imgController.processImg, txtController.readTxt, txtController.chooseFile, txtController.writeToLine, (req, res) => {
  res.sendStatus(200);
});


module.exports = router;