const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { CHECK_AVATAR } = require('../utils/constants');

const vatidateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom((value, helpers) => {
      if (CHECK_AVATAR.test(value)) {
        return value;
      }
      return helpers.message('Некорректная ссылка');
    }),
    email: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (validator.isEmail(value)) {
          return value;
        }
        return helpers.message('Некорректный email');
      }),
    password: Joi.string().required(),
  }),
});

const validateAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Некорректный email');
    }),
    password: Joi.string().required(),
  }),
});

module.exports = {
  vatidateUserBody,
  validateAuthentication,
};
