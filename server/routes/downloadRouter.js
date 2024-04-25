const express = require('express');

const fileController = require('../controllers/fileController.js');
const router = express.Router();

router.get('/', fileController.downloadFiles, (req, res) => {
  res.status(200);
});
  
module.exports = router;