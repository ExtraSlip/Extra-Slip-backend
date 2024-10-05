const Joi = require("joi");
const { Validate } = require("./Validate");

const TeamValidation = async (req, res, next) => {
  const schema = Joi.object().keys({
    name: Joi.string().required().messages({
      "any.required": "Name field is required",
    }),
    players: Joi.array().required().max(11).messages({
      "any.required": "Players field is required",
    }),
  });
  await Validate(req, res, next, schema);
};

module.exports = {
  TeamValidation,
};
