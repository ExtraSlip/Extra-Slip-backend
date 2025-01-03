const Joi = require("joi");
const {
  mobileNo,
  firstName,
  lastName,
  email,
  password,
  userName,
} = require("./CommonValidation");
const { Validate } = require("./Validate");

const RegisterValidation = async (req, res, next) => {
  const schema = Joi.object().keys({
    mobileNo: mobileNo,
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
    userType: Joi.string().default("user").valid("user", "agent").optional(),
    userName: userName,
  });
  await Validate(req, res, next, schema);
};

const LoginValidation = async (req, res, next) => {
  const schema = Joi.object().keys({
    email: email,
    password: password,
    redirectTo: Joi.any().optional().allow("", null),
    csrfToken: Joi.any().optional().allow("", null),
    callbackUrl: Joi.any().optional().allow("", null),
    json: Joi.any().optional().allow("", null),
  });
  await Validate(req, res, next, schema);
};

const RegisterUserValidation = async (req, res, next) => {
  const schema = Joi.object().keys({
    email: email,
    password: password,
    name: Joi.string().required(),
    userName: Joi.string().required(),
  });
  await Validate(req, res, next, schema);
};

module.exports = {
  RegisterValidation,
  RegisterUserValidation,
  LoginValidation,
};
