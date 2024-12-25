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
    image: Joi.string().optional().allow(null, ""),
    nickName: Joi.string().optional().allow(null, ""),
    netWorth: Joi.string().optional().allow(null, ""),
    odiCaptain: Joi.string().optional().allow(null, ""),
    testCaptain: Joi.string().optional().allow(null, ""),
    facebookLink: Joi.string().optional().allow(null, ""),
    twitterLink: Joi.string().optional().allow(null, ""),
    linkedinLink: Joi.string().optional().allow(null, ""),
    instagramLink: Joi.string().optional().allow(null, ""),
    youtubeLink: Joi.string().optional().allow(null, ""),
    threadLink: Joi.string().optional().allow(null, ""),
    pininterestLink: Joi.string().optional().allow(null, ""),
    discordLink: Joi.string().optional().allow(null, ""),
    teamQuickLinks: Joi.string().optional().allow("[]", null).messages({
      "any.required": "Team Quick Links field is required",
    }),
  });
  await Validate(req, res, next, schema);
};

module.exports = {
  TeamValidation,
};
