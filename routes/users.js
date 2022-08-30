const users = require('express').Router();

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
users.patch('/users/me', updateProfile);
users.patch('/users/me/avatar', updateAvatar);

module.exports = users;
