const cards = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cards.get('/cards', auth, getCards);
cards.post('/cards', auth, createCard);
cards.delete('/cards/:cardId', auth, deleteCard);
cards.put('/cards/:cardId/likes', auth, likeCard);
cards.delete('/cards/:cardId/likes', auth, dislikeCard);

module.exports = cards;
