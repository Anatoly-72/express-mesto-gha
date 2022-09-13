const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const routes = require('./routes/index');
const centralErrorHandler = require('./middlewares/central-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();

// защищаем HTTP-заголовки
app.use(helmet());
app.disable('x-powered-by');

// собираем JSON-формат
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// подключаем логгер запросов
app.use(requestLogger);

// подключаем роуты
app.use(routes);

// подключаем логгер ошибок
app.use(errorLogger);

// централизованная обработка ошибок
app.use(errors());
app.use(centralErrorHandler);

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
