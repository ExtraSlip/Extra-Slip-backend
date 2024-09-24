const sequelize = require("sequelize");
const { error, success } = require("../../handlers");
const { Quiz, Question } = require("../../models");

const index = async (req, res) => {
  try {
    let quizzes = await Quiz.findAll({
      include: [
        {
          model: Question,
          attributes: [],
        },
      ],
      attributes: {
        include: [
          [
            sequelize.fn("COUNT", sequelize.col("questions.id")),
            "questionCount",
          ],
        ],
      },
      group: ["quizzes.id"],
    });
    return success(res, {
      msg: "Quizzes fetched successfully",
      data: quizzes,
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
    let quiz = await Quiz.create(payload);
    return success(res, {
      msg: "Quiz created successfully",
      data: [quiz],
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
    let quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) {
      return error(res, {
        msg: "Quiz not found",
      });
    }

    await Quiz.update(payload, {
      where: {
        id: req.params.id,
      },
    });

    return success(res, {
      msg: "Quiz updated successfully",
      data: [],
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong",
      error: [err?.message],
    });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    let quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) {
      return error(res, {
        msg: "Quiz not found",
      });
    }
    await Question.destroy({
      where: {
        quizId: req.params.id,
      },
    });
    await quiz.destroy();
    return success(res, {
      msg: "Quiz deleted successfully",
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
  deleteQuiz,
};
