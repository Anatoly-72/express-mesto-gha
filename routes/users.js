const users = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUsersById,
  updateProfile,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

users.get('/users', getUsers);
users.get('/users/:userId', getUsersById);
users.get('/users/me', getCurrentUser);
// users.patch('/users/me', updateProfile);

users.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);

users.patch('/users/me/avatar', updateAvatar);

module.exports = users;
