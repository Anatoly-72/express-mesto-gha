const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ExistEmailError = require('../errors/exist-email-err');

const {
  ERROR_SERVER,
  ERROR_NOT_FOUND,
  ERROR_BAD_REQUEST,
  ERROR_BAD_AUTH,
  STATUS_CREATED,
} = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      res.status(ERROR_BAD_AUTH).send({ message: 'Неправильные почта или пароль' });
    });
};

module.exports.getUsersById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Ошибка валидации данных' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// GET /users/me — возвращает информацию о текущем пользователе
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res.send({ data: user });
      }
    })
    .catch(next);
};

// module.exports.createUser = (req, res) => {
//   const {
//     name, about, avatar, email, password,
//   } = req.body;

//   if (!email || !password) {
//     res.status(ERROR_BAD_REQUEST).send({ message: 'Поля email и password обязательны' });
//   }

//   User.create({
//     name, about, avatar, email, password,
//   });

//   bcrypt.hash(req.body.password, 10)
//     .then((hash) => User.create({
//       email: req.body.email,
//       password: hash, // записываем хеш в базу
//     }))
//     .then((user) => {
//       res.send({
//         name: user.name,
//         about: user.about,
//         avatar: user.avatar,
//         _id: user._id,
//         email: user.email,
//       });
//     })
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         res.status(ERROR_BAD_REQUEST).send({ message: 'Ошибка валидации данных' });
//       } else {
//         res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' });
//       }
//     });
// };

// POST /signup — создаём пользователя по обязательным полям email и password
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    res.status(ERROR_BAD_REQUEST).send({ message: 'Поля email и password обязательны' });
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ExistEmailError('Такой пользователь уже существует!');
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => res
      .status(STATUS_CREATED)
      .send({ _id: user._id, email: user.email }))
    .catch(next);
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  if (!name || !about) {
    res.status(ERROR_BAD_REQUEST).send({ message: 'Ошибка валидации данных' });
    return;
  }
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с таким id не найден' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Ошибка валидации данных' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с таким id не найден' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Ошибка валидации данных' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
