const express = require('express');

const fileController = require('../controllers/fileController.js');
const router = express.Router();

router.delete('/', fileController.clearFiles, (req, res) => {
  res.sendStatus(200);
});
  
module.exports = router;