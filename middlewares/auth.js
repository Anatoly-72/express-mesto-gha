const jwt = require('jsonwebtoken');
const BadAuthError = require('../errors/bad-auth-err');
const { SEKRET_KEY } = require('../utils/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers; // достаём авторизационный заголовок

  if (!authorization || !authorization.startsWith('Bearer ')) { // убедимся, что он есть или начинается с Bearer
    throw new BadAuthError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', ''); // извлекаем токен
  let payload;

  try {
    payload = jwt.verify(token, SEKRET_KEY); // попытка верифицировать токен
  } catch (err) {
    next(new BadAuthError('Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
