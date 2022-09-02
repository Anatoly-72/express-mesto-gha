const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const {
  vatidateUserBody,
  validateAuthentication,
} = require('../middlewares/validatons');

router.post('/signup', vatidateUserBody, createUser);
router.post('/signin', validateAuthentication, login);

router.use(auth);

// все роуты, кроме /signup и /signin защищены авторизацией
router.use('/', userRouter);
router.use('/', cardRouter);

module.exports = router;
