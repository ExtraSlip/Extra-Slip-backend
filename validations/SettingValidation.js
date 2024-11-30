const Joi = require("joi");
const { Validate } = require("./Validate");
const { Settings } = require("../constants/Constants");

const settingObject = Joi.object().keys({
  key: Joi.string()
    .required()
    .valid(...Object.values(Settings))
    .messages({
      "any.required": "Key field is required",
    }),
  value: Joi.string().optional().allow(null, "").messages({
    "any.required": "Value field is required",
  }),
});

const SettingValidation = async (req, res, next) => {
  const schema = Joi.object().keys({
    settings: Joi.string().required(),
    siteIcon: Joi.string().optional().allow(null, "").messages({}),
  });
  await Validate(req, res, next, schema);
};

module.exports = {
  SettingValidation,
};
