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
        RoleType.SEO,
        RoleType.SUPERADMIN
      )
      .messages({
        "any.required": "Type field is required",
      }),
    email: Joi.string().required().messages({
      "any.required": "Email field is required",
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
    isActive: Joi.boolean().required().messages({
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
        RoleType.SEO,
        RoleType.SUPERADMIN
      )
      .messages({
        "any.required": "Type field is required",
      }),
  });
  await Validate(req, res, next, schema);
};

module.exports = {
  UserValidation,
  UpdateUserValidation,
};
