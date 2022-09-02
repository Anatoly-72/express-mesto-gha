const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const routerUsers = require('./users');
const routerCards = require('./cards');
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');

const {
  // ERROR_SERVER,
  // ERROR_NOT_FOUND,
  CHECK_AVATAR,
} = require('../utils/constants');

const app = express();

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

// авторизация
app.use(auth);

// роуты, которым авторизация нужна
app.use('/', routerUsers);
app.use('/', routerCards);

module.exports = app;
