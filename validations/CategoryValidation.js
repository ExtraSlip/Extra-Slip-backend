const Joi = require("joi");
const { Validate } = require("./Validate");

const CategoryValidation = async (req, res, next) => {
  const schema = Joi.object().keys({
    name: Joi.string().required().messages({
      "any.required": "Name field is required",
    }),
    slug: Joi.string().required().messages({
      "any.required": "Slug field is required",
    }),
    parentCategoryId: Joi.number().integer().optional().allow(null).messages({
      "any.required": "Parent category id field is required",
    }),
    description: Joi.string().required().messages({
      "any.required": "Description field is required",
    }),
    categoryColor: Joi.string().required().messages({
      "any.required": "Category Color field is required",
    }),
    keyword: Joi.string().required().messages({
      "any.required": "Keyword field is required",
    }),
    seoTitle: Joi.string().required().messages({
      "any.required": "Seo Title field is required",
    }),
    metaDescription: Joi.string().required().messages({
      "any.required": "Meta Description field is required",
    }),
  });
  await Validate(req, res, next, schema);
};

module.exports = {
  CategoryValidation,
};
