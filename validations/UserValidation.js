const Joi = require("joi");
const { Validate } = require("./Validate");
const { RoleType } = require("../constants/Constants");

const UserValidation = async (req, res, next) => {
  const schema = Joi.object().keys({
    name: Joi.string().required().messages({
      "any.required": "Name field is required",
    }),
    type: Joi.string()
      .required()
      .valid(
        RoleType.ADMIN,
        RoleType.AUTHOR,
        RoleType.AFFILIATE,
        RoleType.EDITOR,
        RoleType.FREELANCER,
        RoleType.SEO
      )
      .messages({
        "any.required": "Type field is required",
      }),
    email: Joi.string().required().messages({
      "any.required": "Email field is required",
    }),
    username: Joi.string().required().messages({
      "any.required": "UserName field is required",
    }),
    isActive: Joi.string().required().messages({
      "any.required": "Active field is required",
    }),
    permission: Joi.array().required().messages({
      "any.required": "Permission field is required",
    }),
  });
  await Validate(req, res, next, schema);
};

const UpdateUserValidation = async (req, res, next) => {
  const schema = Joi.object().keys({
    name: Joi.string().required().messages({
      "any.required": "Name field is required",
    }),
    isBlocked: Joi.boolean().required().messages({
      "any.required": "Is Blocked field is required",
    }),
    isActive: Joi.string().required().messages({
      "any.required": "Is Active field is required",
    }),
    type: Joi.string()
      .required()
      .valid(
        RoleType.ADMIN,
        RoleType.AUTHOR,
        RoleType.AFFILIATE,
        RoleType.EDITOR,
        RoleType.FREELANCER,
        RoleType.SEO
      )
      .messages({
        "any.required": "Type field is required",
      }),
    badge: Joi.string().optional().allow("", null).messages({
      "any.required": "Badge field is required",
    }),
    stamp: Joi.string().optional().allow("", null).messages({
      "any.required": "Stamp field is required",
    }),
    permission: Joi.array().required().messages({
      "any.required": "Permission field is required",
    }),
  });
  await Validate(req, res, next, schema);
};

const ChangePasswordValidation = async (req, res, next) => {
  const schema = Joi.object().keys({
    password: Joi.string().required().messages({
      "any.required": "Password field is required",
    }),
  });
  await Validate(req, res, next, schema);
};

const UpdateUserInfoValidation = async (req, res, next) => {
  const schema = Joi.object().keys({
    image: Joi.optional().allow(null, ""),
    bio: Joi.string().required().messages({
      "any.required": "Bio field is required",
    }),
    dob: Joi.string().required().messages({
      "any.required": "Dob field is required",
    }),
    country: Joi.string().required().messages({
      "any.required": "Country field is required",
    }),
    city: Joi.string().required().messages({
      "any.required": "City field is required",
    }),
    experience: Joi.number().required().messages({
      "any.required": "Experience field is required",
    }),
    tier: Joi.string().required().messages({
      "any.required": "Tier field is required",
    }),
    gender: Joi.string().required().messages({
      "any.required": "Gender field is required",
    }),
    education: Joi.string().required().messages({
      "any.required": "Education field is required",
    }),
    favoriteSport: Joi.string().required().messages({
      "any.required": "Favorite Sport field is required",
    }),
    favoriteTeam: Joi.string().required().messages({
      "any.required": "Favorite Team field is required",
    }),
    favoriteAthlete: Joi.string().required().messages({
      "any.required": "Favorite Athlete field is required",
    }),
    twitterLink: Joi.string().optional().allow(null, ""),
    linkedinLink: Joi.string().optional().allow(null, ""),
    facebookLink: Joi.string().optional().allow(null, ""),
    instagramLink: Joi.string().optional().allow(null, ""),
    youtubeLink: Joi.string().optional().allow(null, ""),
    discordLink: Joi.string().optional().allow(null, ""),
    pininterestLink: Joi.string().optional().allow(null, ""),
    threadLink: Joi.string().optional().allow(null, ""),
  });
  await Validate(req, res, next, schema);
};

module.exports = {
  UserValidation,
  UpdateUserValidation,
  ChangePasswordValidation,
  UpdateUserInfoValidation,
};
