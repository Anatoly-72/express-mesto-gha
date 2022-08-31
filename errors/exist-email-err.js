const { ERROR_EXIST_EMAIL } = require('../utils/constants');

class ExistEmailError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_EXIST_EMAIL;
  }
}

module.exports = ExistEmailError;
