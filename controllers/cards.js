const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => res.status(500).send({ message: 'Ошибка на сервере' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch(() => res.status(500).send({ message: 'Ошибка на сервере' }));
};

module.exports.deleteCard = (req, res) => {
  const id = req.params;

  Card.findById(id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Такой карточки нет!');
      }
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
        throw new BadRequestError('Невозможно удалить данную карточку');
      }
      return Card.findByIdAndRemove(id);
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Ошибка на сервере' }));
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
      res.status(200).send({ data: card });
    })
    .catch(() => res.status(500).send({ message: 'Ошибка на сервере' }));
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
      res.status(200).send({ data: card });
    })
    .catch(() => res.status(500).send({ message: 'Ошибка на сервере' }));
};
