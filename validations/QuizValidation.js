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
    image: Joi.string().optional().allow(null, ""),
  });
  await Validate(req, res, next, schema);
};

module.exports = {
  QuizValidation,
};
