const Joi = require("joi");
const { Validate } = require("./Validate");

const TwitterFeedValidation = async (req, res, next) => {
  const schema = Joi.object().keys({
    type: Joi.string().required().allow("news").messages({
      "any.required": "Type field is required",
    }),
    feed: Joi.string().required().messages({
      "any.required": "Feed field is required",
    }),
    id: Joi.number().integer().optional().allow(null, 0),
  });
  await Validate(req, res, next, schema);
};

module.exports = {
  TwitterFeedValidation,
};
