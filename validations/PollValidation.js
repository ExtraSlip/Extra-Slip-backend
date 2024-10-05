const Joi = require("joi");
const { Validate } = require("./Validate");

const PollValidation = async (req, res, next) => {
  const schema = Joi.object().keys({
    title: Joi.string().required().messages({
      "any.required": "Title field is required",
    }),
    description: Joi.string().required().messages({
      "any.required": "Description field is required",
    }),
    pollOptions: Joi.string().required().messages({
      "any.required": "Poll options field are required",
    }),
  });
  await Validate(req, res, next, schema);
};

module.exports = {
  PollValidation,
};
