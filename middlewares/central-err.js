const { ERROR_SERVER } = require('../utils/constants');

// module.exports = (err, req, res, next) => {
//   const { statusCode = ERROR_SERVER, message } = err;
//   res
//     .status(statusCode)
//     .send({
//       message: statusCode === ERROR_SERVER
//         ? `err.name = ${err.name} ; err.message = ${err.message} ; Ошибка по умолчанию.`
//         : message,
//     });
//   return next();
// };

// module.exports = ((err, req, res, next) => {
//   const { statusCode = ERROR_SERVER, message } = err;
//   const errorMessage = (statusCode === ERROR_SERVER) ? 'Ошибка на сервере' : message;
//   res.status(statusCode).send({ message: errorMessage });
// });

module.exports = ((err, req, res, next) => {
  const { statusCode = ERROR_SERVER, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === ERROR_SERVER
        ? 'На сервере произошла ошибка'
        : message,
    });
  return next();
});
