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

module.exports = {
  RegisterValidation,
};
