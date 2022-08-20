const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000, BASE_PATH } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.get('/', (req, res) => {
  res.send('Привет мир');
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту`);
  console.log(BASE_PATH);
});