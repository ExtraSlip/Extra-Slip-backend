const Joi = require("joi");
const { Validate } = require("./Validate");

const PlayerValidation = async (req, res, next) => {
  const schema = Joi.object().keys({
    name: Joi.string().required().messages({
      "any.required": "Name field is required",
    }),
    dob: Joi.date().required().messages({
      "any.required": "DOB field is required",
    }),
    birthPlace: Joi.string().required().messages({
      "any.required": "Birth Place field is required",
    }),
    specialty: Joi.string().required().messages({
      "any.required": "Specialty field is required",
    }),
    battingStyle: Joi.string().optional().allow("", null).messages({
      "any.required": "Batting Style field is required",
    }),
    bowlingStyle: Joi.string().optional().allow("", null).messages({
      "any.required": "Bowling Style field is required",
    }),
    battingStrength: Joi.string().optional().allow("", null).messages({
      "any.required": "Batting Strength field is required",
    }),
    bowlingStrength: Joi.string().optional().allow("", null).messages({
      "any.required": "Bowling Strength field is required",
    }),
    about: Joi.string().optional().allow("", null).messages({
      "any.required": "About field is required",
    }),
    image: Joi.string().optional().allow("", null).messages({
      "any.required": "Image field is required",
    }),
    rating: Joi.number().optional().allow(0, null).messages({
      "any.required": "Rating field is required",
    }),
    stats: Joi.string().optional().allow("", null).messages({
      "any.required": "Stats field is required",
    }),
  });
  await Validate(req, res, next, schema);
};

module.exports = {
  PlayerValidation,
};
