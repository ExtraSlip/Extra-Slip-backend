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
    const files = req.files?.pollOptionImages ?? [];
    payload["pollOptions"] = JSON.parse(payload.pollOptions);
    let poll = await Poll.create(payload);
    payload?.pollOptions?.map((element, index) => {
      if (files.length > index) {
        payload.pollOptions[index]["image"] =
          "/uploads/" + files[index].filename;
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
    let files = req.files?.pollOptionImages ?? [];
    let fileUploadingOptions = payload.pollOptions.filter(
      (e) => e.isImageUpdated
    );
    4;
    await fileUploadingOptions.map(async (e, index) => {
      if (files.length > index) {
        e.image = "/uploads/" + files[index].filename;
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
    await payload.pollOptions.map(async (e, index) => {
      if (!e.isImageUpdated) {
        if (e.pollOptionId) {
          await PollOption.update(e, {
            where: {
              id: e.pollOptionId,
            },
          });
        }
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
