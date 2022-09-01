const STATUS_OK = 200;
const STATUS_CREATED = 201;
const ERROR_BAD_REQUEST = 400;
const ERROR_BAD_AUTH = 401;
const ERROR_DEL_CARD = 403;
const ERROR_NOT_FOUND = 404;
const ERROR_EXIST_EMAIL = 409;
const ERROR_SERVER = 500;

const CHECK_AVATAR = /^https?:\/\/(www\.)?[a-zA-Z\d-]+\.[\w\d\-.~:/?#[\]@!$&'()*+,;=]{2,}#?$/;

const SEKRET_KEY = 'some-secret-key';
const SALT_ROUNDS = 10;

module.exports = {
  STATUS_OK,
  STATUS_CREATED,
  ERROR_BAD_REQUEST,
  ERROR_BAD_AUTH,
  ERROR_DEL_CARD,
  ERROR_NOT_FOUND,
  ERROR_EXIST_EMAIL,
  ERROR_SERVER,
  SEKRET_KEY,
  CHECK_AVATAR,
  SALT_ROUNDS,
};
