const { error, success } = require("../../handlers");
const { Poll } = require("../../models");

const index = async (req, res) => {
  try {
    let polls = await Poll.findAll({
      order: [["id", "DESC"]],
    });
    return success(res, {
      msg: "Polls fetched successfully",
      data: polls,
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
    let poll = await Poll.create(payload);
    return success(res, {
      msg: "Poll created successfully",
      data: [poll],
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
    let poll = await Poll.findByPk(req.params.id);
    if (!poll) {
      return error(res, {
        msg: "Poll not found",
      });
    }
    await Poll.update(payload, {
      where: {
        id: req.params.id,
      },
    });
    return success(res, {
      msg: "Poll updated successfully",
      data: [],
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong",
      error: [err?.message],
    });
  }
};

const deletePoll = async (req, res) => {
  try {
    let poll = await Poll.findByPk(req.params.id);
    if (!poll) {
      return error(res, {
        msg: "Poll not found",
      });
    }
    await poll.destroy();
    return success(res, {
      msg: "Poll deleted successfully",
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
  deletePoll,
};
