const Joi = require("joi");
const { Validate } = require("./Validate");

const QuestionValidation = async (req, res, next) => {
  const schema = Joi.object().keys({
    title: Joi.string().required().messages({
      "any.required": "Title field is required",
    }),
    quizId: Joi.number().required().messages({
      "any.required": "Quiz Id field is required",
    }),
    optionA: Joi.string().required().messages({
      "any.required": "Option A field is required",
    }),
    optionB: Joi.string().required().messages({
      "any.required": "Option A field is required",
    }),
    optionC: Joi.string().required().messages({
      "any.required": "Option A field is required",
    }),
    optionD: Joi.string().required().messages({
      "any.required": "Option A field is required",
    }),
    answerReason: Joi.string().optional().allow("", null).messages({
      "any.required": "Answer Reason field is required",
    }),
    correctAnswer: Joi.string().required().messages({
      "any.required": "Correct Answer field is required",
    }),
    image: Joi.string().optional().allow(null, ""),
  });
  await Validate(req, res, next, schema);
};

module.exports = {
  QuestionValidation,
};
