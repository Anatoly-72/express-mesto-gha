const User = require('../models/user');

// const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');

const { STATUS_OK, ERROR_SERVER } = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(STATUS_OK).send(users);
    })
    .catch(() => res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUsersById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(STATUS_OK).send(user);
    })
    .catch(() => res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(STATUS_OK).send(user);
    })
    .catch(() => res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true },
  )
    .then((user) => res.status(STATUS_OK).send(user))
    .catch(() => res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true },
  )
    .then((user) => res.status(STATUS_OK).send(user))
    .catch(() => res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' }));
};
