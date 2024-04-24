const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

const uploadRouter = require('./routes/uploadRouter.js')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/upload', uploadRouter);

app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../client/client.html'));
});
app.get('/client.css', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../client/client.css'));
});
app.get('/client.js', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../client/client.js'));
});
app.get('/img-to-text', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../img-to-text/img-to-text.html'));
});
app.get('/img-to-text.css', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../img-to-text/img-to-text.css'));
});
app.get('/img-to-text.js', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../img-to-text/img-to-text.js'));
});


app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' }, 
  };
  const errorObj = Object.assign(defaultErr, err);

  console.log(errorObj.log);

  res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});

module.exports = app;