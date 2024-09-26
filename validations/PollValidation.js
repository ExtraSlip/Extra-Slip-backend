const Joi = require("joi");
const { Validate } = require("./Validate");

const PollValidation = async (req, res, next) => {
  const schema = Joi.object().keys({
    title: Joi.string().required().messages({
      "any.required": "Title field is required",
    }),
    optionA: Joi.string().required().messages({
      "any.required": "Option A field is required",
    }),
    optionB: Joi.string().required().messages({
      "any.required": "Option A field is required",
    }),
    optionC: Joi.string().required().messages({
      "any.required": "Option A field is required",
    }),
    optionD: Joi.string().required().messages({
      "any.required": "Option A field is required",
    }),
  });
  await Validate(req, res, next, schema);
};

module.exports = {
  PollValidation,
};
