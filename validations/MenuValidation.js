const Joi = require("joi");
const { Validate } = require("./Validate");

const childrenObject = Joi.object().keys({
  name: Joi.string().required().messages({
    "any.required": "Name field is required",
  }),
  menuPath: Joi.string().optional().allow("", null).messages({
    "any.required": "Menu Path field is required",
  }),
  id: Joi.number().integer().optional().allow(null, 0),
});
const MenuValidation = async (req, res, next) => {
  const schema = Joi.object().keys({
    id: Joi.number().integer().optional().allow(null, 0),
    name: Joi.string().required().messages({
      "any.required": "Name field is required",
    }),
    label: Joi.string().required().messages({
      "any.required": "Label field is required",
    }),
    menuPath: Joi.string().optional().allow("", null).messages({
      "any.required": "Menu Path field is required",
    }),
    hasChild: Joi.boolean().required().messages({
      "any.required": "Has Child field is required",
    }),
    children: Joi.array().items(childrenObject),
  });
  await Validate(req, res, next, schema);
};

module.exports = {
  MenuValidation,
};
