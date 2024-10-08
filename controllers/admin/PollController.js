const { Op } = require("sequelize");
const { error, success } = require("../../handlers");
const { Poll, PollOption, Admin } = require("../../models");
const sequelize = require("../../utils/Connection");

const index = async (req, res) => {
  try {
    let polls = await Poll.findAll({
      include: [
        {
          model: PollOption,
          attributes: [],
        },
        {
          model: Admin,
          attributes: ["name", "email"],
        },
      ],
      attributes: {
        include: [
          [
            sequelize.fn("COUNT", sequelize.col("pollOptions.id")),
            "pollOptionCount",
          ],
        ],
      },
      group: ["polls.id"],
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
    payload["createdBy"] = req.user.id;
    payload["pollOptions"] = JSON.parse(payload.pollOptions);
    let poll = await Poll.create(payload);
    payload?.pollOptions?.map((element, index) => {
      if (req.files?.[`pollOptionImage${index + 1}`]) {
        payload.pollOptions[index]["image"] =
          "/uploads/" + req.files?.[`pollOptionImage${index + 1}`][0].filename;
      }
      payload.pollOptions[index]["pollId"] = poll.id;
    });
    await PollOption.bulkCreate(payload?.pollOptions ?? []);
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
    payload["pollOptions"] = JSON.parse(payload.pollOptions);
    await PollOption.destroy({
      where: {
        pollId: req.params.id,
        id: {
          [Op.notIn]: payload?.pollOptions?.map((e) => e.pollOptionId),
        },
      },
    });

    await payload?.pollOptions?.map(async (e, index) => {
      if (req.files?.[`pollOptionImage${index + 1}`]) {
        e.image =
          "/uploads/" + req.files?.[`pollOptionImage${index + 1}`][0].filename;
      }
      if (e.pollOptionId) {
        await PollOption.update(e, {
          where: {
            id: e.pollOptionId,
          },
        });
      } else {
        e.pollId = poll.id;
        await PollOption.create(e);
      }
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
    await PollOption.destroy({
      where: {
        pollId: req.params.id,
      },
    });
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

const deletePollOption = async (req, res) => {
  try {
    const pollOption = await PollOption.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!pollOption) {
      return error(res, {
        msg: "Poll option not found",
      });
    }
    await pollOption.destroy();
    return success(res, {
      msg: "Poll option deleted successfully",
      data: [],
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong",
      error: [err?.message],
    });
  }
};

const getPollOptions = async (req, res) => {
  try {
    const poll = await Poll.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: PollOption,
        },
      ],
    });

    if (!poll) {
      return error(res, {
        msg: "No data found!!",
      });
    }

    return success(res, {
      msg: "Poll fetched successfully",
      data: poll,
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
  deletePollOption,
  getPollOptions,
};
