const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const routes = require('./routes/index');
const NotFoundError = require('./errors/not-found-err');
const { ERROR_SERVER } = require('./utils/constants');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не найдена'));
});

// подключаем роуты
app.use(routes);

// app.use((req, res, next) => {
//   next(new NotFoundError('Маршрут не найден'));
// });

// Обработка запроса на несуществующий адрес
// app.use((req, res) => {
//   res
//     .status(ERROR_NOT_FOUND)
//     .send({ message: 'Запрашиваемая страница не найдена' });
// });

// централизованная обработка ошибок
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = ERROR_SERVER, message } = err;
  const errorMessage = statusCode === ERROR_SERVER ? 'Ошибка на сервере' : message;
  res.status(statusCode).send({ message: errorMessage });
  return next();
});

// Последовательное подключение: сначала база, затем порт
async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb ', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  await app.listen(PORT);
  console.log(`Сервер запущен на ${PORT} порту`);
}

main();
