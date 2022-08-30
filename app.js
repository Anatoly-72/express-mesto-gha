const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const users = require('./routes/users');
const cards = require('./routes/cards');
const auth = require('./middlewares/auth');
const cenralErrors = require('./middlewares/central-err');
const { createUser, login } = require('./controllers/users');
const { ERROR_NOT_FOUND } = require('./utils/constants');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// роуты, не требующие авторизации
app.post('/signin', login);
app.post('/signup', createUser);

// авторизация
app.use(auth);

// роуты, которым авторизация нужна
app.use('/', users);
app.use('/', cards);

// Обработка запроса на несуществующий адрес
app.use((req, res) => {
  res
    .status(ERROR_NOT_FOUND)
    .send({ message: 'Запрашиваемая страница не найдена' });
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

// централизованная обработка ошибок
app.use(errors());
app.use(cenralErrors);

main();
