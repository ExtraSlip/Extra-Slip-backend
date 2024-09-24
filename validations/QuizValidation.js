const Joi = require("joi");
const { Validate } = require("./Validate");

const QuizValidation = async (req, res, next) => {
  const schema = Joi.object().keys({
    name: Joi.string().required().messages({
      "any.required": "Name field is required",
    }),
    shortDescription: Joi.string().required().messages({
      "any.required": "Description field is required",
    }),
  });
  await Validate(req, res, next, schema);
};

module.exports = {
  QuizValidation,
};
