const Joi = require("joi");
const { Validate } = require("./Validate");
const { TagType } = require("../constants/Constants");

const TagValidation = async (req, res, next) => {
  const schema = Joi.object().keys({
    name: Joi.string().required().messages({
      "any.required": "Name field is required",
    }),
    about: Joi.string().required().messages({
      "any.required": "About field is required",
    }),
    image: Joi.string().optional().allow(null, ""),
    facebookLink: Joi.string().optional().allow(null, ""),
    twitterLink: Joi.string().optional().allow(null, ""),
    linkedinLink: Joi.string().optional().allow(null, ""),
    instagramLink: Joi.string().optional().allow(null, ""),
    youtubeLink: Joi.string().optional().allow(null, ""),
    threadLink: Joi.string().optional().allow(null, ""),
    pininterestLink: Joi.string().optional().allow(null, ""),
    discordLink: Joi.string().optional().allow(null, ""),
  });
  await Validate(req, res, next, schema);
};

module.exports = {
  TagValidation,
};
