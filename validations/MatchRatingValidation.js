const Joi = require("joi");
const { Validate } = require("./Validate");

const MatchRatingValidation = async (req, res, next) => {
  const schema = Joi.object().keys({
    description: Joi.string().required().messages({
      "any.required": "Description field is required",
    }),
    teamId1: Joi.number().integer().required().max(11).messages({
      "any.required": "Team Id 1 field is required",
    }),
    teamId2: Joi.number().integer().required().max(11).messages({
      "any.required": "Team Id 2 field is required",
    }),
    image: Joi.string().optional().allow("", null).messages({
      "any.required": "Image field is required",
    }),
  });
  await Validate(req, res, next, schema);
};

module.exports = {
  MatchRatingValidation,
};
