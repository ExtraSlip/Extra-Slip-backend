const { error, success } = require("../../handlers");
const { MatchRating, Team, Admin } = require("../../models");

const index = async (req, res) => {
  try {
    const matchRatings = await MatchRating.findAll({
      include: [
        {
          model: Team,
          attributes: ["name", "id"],
          as: "team1",
        },
        {
          model: Team,
          attributes: ["name", "id"],
          as: "team2",
        },
        {
          model: Admin,
          attributes: ["name", "email"],
        },
      ],
      order: [["id", "desc"]],
    });

    return success(res, {
      msg: "Match Ratings fetched successfully",
      data: matchRatings,
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
    if (payload.teamId1 == payload.teamId2) {
      return error(res, {
        msg: "Team 1 and Team 2 cannot be same",
      });
    }
    if (req.file) {
      payload["image"] = req.file?.path;
    }
    const matchRating = await MatchRating.create(payload);
    return success(res, {
      msg: "Match Rating created successfully",
      data: [matchRating],
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
    payload["createdBy"] = req.user.id;
    if (payload.teamId1 == payload.teamId2) {
      return error(res, {
        msg: "Team 1 and Team 2 cannot be same",
      });
    }
    if (req.file) {
      payload["image"] = req.file?.path;
    }
    const matchRating = await MatchRating.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!matchRating) {
      return error(res, {
        msg: "Match Rating not found",
      });
    }
    await MatchRating.update(payload, {
      where: {
        id: req.params.id,
      },
    });
    return success(res, {
      msg: "Match Rating updated successfully",
      data: [],
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong",
      error: [err?.message],
    });
  }
};

const deleteMatchRating = async (req, res) => {
  try {
    const matchRating = await MatchRating.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!matchRating) {
      return error(res, {
        msg: "Match Rating not found",
      });
    }
    await matchRating.destroy();
    return success(res, {
      msg: "Match Rating deleted successfully",
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
  deleteMatchRating,
};
