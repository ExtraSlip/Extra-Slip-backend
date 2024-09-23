const joi = require("joi");

const mobileNo = joi.string().required().messages({
  "any.required": "Mobile No field is required",
});

const email = joi.string().required().messages({
  "any.required": "email field is required",
});

const password = joi.string().required().messages({
  "any.required": "Password field is required",
});

const firstName = joi.string().required().messages({
  "any.required": "First Name field is required",
});

const userName = joi.string().required().messages({
  "any.required": "User Name field is required",
});

const lastName = joi.string().required().messages({
  "any.required": "Last Name field is required",
});

module.exports = {
  mobileNo,
  email,
  password,
  firstName,
  lastName,
  userName,
};
