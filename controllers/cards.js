const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const DelCardError = require('../errors/del-card-err');

const { STATUS_OK, ERROR_SERVER } = require('../utils/constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(STATUS_OK).send(cards);
    })
    .catch(() => res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Ошибка валидации данных');
      }
    })
    .catch(() => res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' }));
};

// module.exports.deleteCard = (req, res) => {
//   const id = req.params;

//   Card.findById(id)
//     .then((card) => {
//       if (!card) {
//         throw new NotFoundError('Такой карточки нет!');
//       }
//       if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
//         throw new BadRequestError('Невозможно удалить данную карточку');
//       }
//       return Card.findByIdAndRemove(id);
//     })
//     .then((card) => res.status(STATUS_OK).send(card))
//     .catch(() => res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' }));
// };

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      } else if (!card.owner.equals(req.user._id)) {
        throw new DelCardError('Попытка удалить чужую карточку.');
      } else {
        return card.remove().then(() => res.status(STATUS_OK).send(card));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные при удалении карточки.'));
      }
      return next(err);
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Такой карточки нет!');
      }
      res.status(STATUS_OK).send(card);
    })
    .catch(() => res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Такой карточки нет!');
      }
      res.status(STATUS_OK).send(card);
    })
    .catch(() => res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' }));
};
