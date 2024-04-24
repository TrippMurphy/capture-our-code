const express = require('express');
const fileUpload = require('express-fileupload');

const imgController = require('../controllers/imgController');
const router = express.Router();

router.use(fileUpload(
//   {
//   limits: {
//     fileSize: 10000000,
//   },
//   abortOnLimit: true,
// }
));

router.post('/', imgController.processImg, (req, res) => { // imgController.verify 
  res.sendStatus(200)
});


// router.post('/video')

 
module.exports = router;
