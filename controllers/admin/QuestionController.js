const sequelize = require("sequelize");
const { error, success } = require("../../handlers");
const { Question } = require("../../models");

const index = async (req, res) => {
  try {
    let query = {};
    if (req.params.quizId) {
      query["quizId"] = req.params.quizId;
    }
    let questions = await Question.findAll({
      where: query,
    });
    return success(res, {
      msg: "Questions fetched successfully",
      data: questions,
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong",
      error: [err?.message],
    });
  }
};

const add = async (req, res) => {
  try {
    let payload = req.body;
    if (req.file.path) {
      payload["image"] = "/uploads/" + req.file?.filename;
    }
    let question = await Question.create(payload);
    return success(res, {
      msg: "Question created successfully",
      data: [question],
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong",
      error: [err?.message],
    });
  }
};

const update = async (req, res) => {
  try {
    let payload = req.body;
    let question = await Question.findByPk(req.params.id);
    if (!question) {
      return error(res, {
        msg: "Question not found",
      });
    }

    if (req.file?.path) {
      payload["image"] = "/uploads/" + req.file?.filename;
    }

    await Question.update(payload, {
      where: {
        id: req.params.id,
      },
    });

    return success(res, {
      msg: "Question updated successfully",
      data: [],
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong",
      error: [err?.message],
    });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    let question = await Question.findByPk(req.params.id);
    if (!question) {
      return error(res, {
        msg: "Question not found",
      });
    }
    await question.destroy();
    return success(res, {
      msg: "Question deleted successfully",
      data: [],
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong",
      error: [err?.message],
    });
  }
};

module.exports = {
  index,
  add,
  update,
  deleteQuestion,
};
