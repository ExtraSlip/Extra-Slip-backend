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
    pollOptionImage1: Joi.string().optional().allow("", null),
    pollOptionImage2: Joi.string().optional().allow("", null),
    pollOptionImage3: Joi.string().optional().allow("", null),
    pollOptionImage4: Joi.string().optional().allow("", null),
    pollOptionImage5: Joi.string().optional().allow("", null),
    pollOptionImage6: Joi.string().optional().allow("", null),
    pollOptionImage7: Joi.string().optional().allow("", null),
    pollOptionImage8: Joi.string().optional().allow("", null),
    pollOptionImage9: Joi.string().optional().allow("", null),
    pollOptionImage10: Joi.string().optional().allow("", null),
    pollOptionImage11: Joi.string().optional().allow("", null),
    pollOptions: Joi.string().required().messages({
      "any.required": "Poll options field are required",
    }),
  });
  await Validate(req, res, next, schema);
};

module.exports = {
  PollValidation,
};
