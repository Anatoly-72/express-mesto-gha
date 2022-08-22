const users = require('express').Router();

const { getUsers, getUsersById, createUser } = require('../controllers/users');

users.get('/users', getUsers);
users.get('/users/:userId', getUsersById);
users.post('/users', createUser);

module.exports = users;
