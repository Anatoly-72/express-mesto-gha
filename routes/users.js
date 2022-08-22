const users = require('express').Router();

const {
  getUsers, getUsersById, createUser, updateProfile, updateAvatar,
} = require('../controllers/users');

users.get('/users', getUsers);
users.get('/users/:userId', getUsersById);
users.post('/users', createUser);
users.patch('/users/me', updateProfile);
users.patch('/users/me/avatar', updateAvatar);

module.exports = users;
