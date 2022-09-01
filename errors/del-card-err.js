const { ERROR_DEL_CARD } = require('../utils/constants');

class DelCardError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_DEL_CARD;
  }
}

module.exports = DelCardError;
