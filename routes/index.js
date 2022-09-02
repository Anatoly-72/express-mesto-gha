const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

// const routerUsers = require('./routes/users');
// const routerCards = require('./routes/cards');
// const auth = require('./middlewares/auth');
// const routes = require('./routes/index');
const { login, createUser } = require('../controllers/users');

const {
  // ERROR_SERVER,
  // ERROR_NOT_FOUND,
  CHECK_AVATAR,
} = require('../utils/constants');

// const { PORT = 3000 } = process.env;

const app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// роуты, не требующие авторизации
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Некорректный email');
    }),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom((value, helpers) => {
      if (CHECK_AVATAR.test(value)) {
        return value;
      }
      return helpers.message('Некорректная ссылка');
    }),
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Некорректный email');
    }),
    password: Joi.string().required(),
  }),
}), createUser);

module.exports = app;
