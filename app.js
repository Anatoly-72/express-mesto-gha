const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
// const validator = require('validator');

const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const auth = require('./middlewares/auth');
const routes = require('./routes/index');
// const { createUser, login } = require('./controllers/users');

const {
  ERROR_SERVER,
  ERROR_NOT_FOUND,
  // CHECK_AVATAR,
} = require('./utils/constants');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// подключаем роуты
app.use(routes);

// роуты, не требующие авторизации
// app.post('/signin', celebrate({
//   body: Joi.object().keys({
//     email: Joi.string().required().custom((value, helpers) => {
//       if (validator.isEmail(value)) {
//         return value;
//       }
//       return helpers.message('Некорректный email');
//     }),
//     password: Joi.string().required(),
//   }),
// }), login);

// app.post('/signup', celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().min(2).max(30),
//     about: Joi.string().min(2).max(30),
//     avatar: Joi.string().custom((value, helpers) => {
//       if (CHECK_AVATAR.test(value)) {
//         return value;
//       }
//       return helpers.message('Некорректная ссылка');
//     }),
//     email: Joi.string().required().custom((value, helpers) => {
//       if (validator.isEmail(value)) {
//         return value;
//       }
//       return helpers.message('Некорректный email');
//     }),
//     password: Joi.string().required(),
//   }),
// }), createUser);

// авторизация
app.use(auth);

// роуты, которым авторизация нужна
app.use('/', routerUsers);
app.use('/', routerCards);

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

// подключаем роуты
// app.use(routes);

// централизованная обработка ошибок
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = ERROR_SERVER, message } = err;
  const errorMessage = (statusCode === ERROR_SERVER) ? 'Ошибка на сервере' : message;
  res.status(statusCode).send({ message: errorMessage });
  return next();
});

main();
