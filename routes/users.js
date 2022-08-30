const users = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getUsers,
  getUsersById,
  updateProfile,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

users.get('/users', auth, getUsers);
users.get('/users/:userId', auth, getUsersById);
users.get('/users/me', getCurrentUser);
users.patch('/users/me', auth, updateProfile);
users.patch('/users/me/avatar', auth, updateAvatar);

module.exports = users;
