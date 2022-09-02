// const express = require('express');
const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const {
  vatidateUserBody,
  validateAuthentication,
} = require('../middlewares/validatons');

// const app = express();

// роуты, не требующие авторизации
router.post('/signup', vatidateUserBody, createUser);
router.post('/signin', validateAuthentication, login);

// авторизация
router.use(auth);

// роуты, которым авторизация нужна
router.use('/', userRouter);
router.use('/', cardRouter);

module.exports = router;
