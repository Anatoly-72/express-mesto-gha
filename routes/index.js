const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');
const { login, createUser } = require('../controllers/users');
const {
  vatidateUserBody,
  validateAuthentication,
} = require('../middlewares/validatons');

router.post('/signup', vatidateUserBody, createUser);
router.post('/signin', validateAuthentication, login);

router.use(auth);

// все роуты, кроме /signup и /signin защищены авторизацией
router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

module.exports = router;
