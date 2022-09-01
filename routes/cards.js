const routerCards = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

routerCards.get('/cards', auth, getCards);
routerCards.post('/cards', auth, createCard);
routerCards.delete('/cards/:cardId', auth, deleteCard);
routerCards.put('/cards/:cardId/likes', auth, likeCard);
routerCards.delete('/cards/:cardId/likes', auth, dislikeCard);

module.exports = routerCards;
