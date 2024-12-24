const Joi = require("joi");
const { Validate } = require("./Validate");
const { TopicTypes, BlogStatus } = require("../constants/Constants");

const topicObject = Joi.object().keys({
  type: Joi.string()
    .required()
    .valid(TopicTypes.OTHER, TopicTypes.PLAYER, TopicTypes.TAG)
    .messages({
      "any.required": "Type field is required",
    }),
  topicId: Joi.number().integer().optional().allow(null, 0).messages({
    "any.required": "Topic id field is required",
  }),
  name: Joi.string().optional().allow(null, "").messages({
    "any.required": "Name field is required",
  }),
});

const BlogValidation = async (req, res, next) => {
  const schema = Joi.object().keys({
    title: Joi.string().required().messages({
      "any.required": "Title field is required",
    }),
    isSubTitleBulletPoint: Joi.boolean().optional().default(false).messages({}),
    categoryId: Joi.number().integer().required().messages({
      "any.required": "Category id field is required",
    }),
    subTitle: Joi.string().required().messages({
      "any.required": "Sub Title field is required",
    }),
    shortTitle: Joi.string().required().messages({
      "any.required": "Short Title field is required",
    }),
    metaTitle: Joi.string().required().messages({
      "any.required": "Meta Title field is required",
    }),
    metaDescription: Joi.string().required().messages({
      "any.required": "Meta Description field is required",
    }),
    featuredImageTitle: Joi.string().required().messages({
      "any.required": "Featured Image Title field is required",
    }),
    keywords: Joi.string().required().messages({
      "any.required": "Keywords field is required",
    }),
    description: Joi.string().required().messages({
      "any.required": "Description field is required",
    }),
    status: Joi.number()
      .integer()
      .optional()
      .valid(BlogStatus.PUBLISHED, BlogStatus.DRAFT)
      .messages({
        "any.required": "Type field is required",
      }),
    customUrl: Joi.string().optional().allow(null, "").messages({}),
    featuredImage: Joi.string().optional().allow(null, "").messages({}),
    topics: Joi.string().optional().allow("[]"),
  });
  await Validate(req, res, next, schema);
};

const CommentValidation = async (req, res, next) => {
  const schema = Joi.object().keys({
    comment: Joi.string().required().messages({
      "any.required": "Comment field is required",
    }),
    blogId: Joi.number().integer().required().messages({
      "any.required": "Blog id field is required",
    }),
  });
  await Validate(req, res, next, schema);
};

const CommentReplyValidation = async (req, res, next) => {
  const schema = Joi.object().keys({
    reply: Joi.string().required().messages({
      "any.required": "Reply field is required",
    }),
    commentId: Joi.number().integer().required().messages({
      "any.required": "Comment id field is required",
    }),
  });
  await Validate(req, res, next, schema);
};

const BookmarkValidation = async (req, res, next) => {
  const schema = Joi.object().keys({
    blogId: Joi.number().integer().required().messages({
      "any.required": "Blog id field is required",
    }),
  });
  await Validate(req, res, next, schema);
};

module.exports = {
  BlogValidation,
  CommentValidation,
  BookmarkValidation,
  CommentReplyValidation,
};
