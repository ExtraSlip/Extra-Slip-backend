const { success, error } = require("../../handlers");
const { Player, Admin, TeamPlayer, Team } = require("../../models");

const index = async (req, res) => {
  try {
    let query = {};
    if (req.query.teamId) {
      query.teamId = req.query.teamId;
    }
    const players = await Player.findAll({
      include: [
        {
          model: Admin,
          attributes: ["name", "email"],
        },
        {
          model: TeamPlayer,
          attributes: ["id", "playerId", "teamId"],
          include: [
            {
              model: Team,
              attributes: ["name"],
            },
          ],
        },
      ],
      order: [["id", "desc"]],
    });
    return success(res, {
      msg: "Players fetched successfully",
      data: players,
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
    if (req?.files?.stats) {
      payload["stats"] = req.files?.stats[0]?.path;
    }
    if (req?.files?.image) {
      payload["image"] = req.files?.image[0]?.path;
    }
    const player = await Player.create(payload);
    return success(res, {
      msg: "Player created successfully",
      data: [player],
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
    if (req?.files?.stats) {
      payload["stats"] = req.files?.stats[0]?.path;
    }
    if (req?.files?.image) {
      payload["image"] = req.files?.image[0]?.path;
    }
    let player = await Player.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!player) {
      return error(res, {
        msg: "Player not found",
      });
    }
    await Player.update(payload, {
      where: {
        id: req.params.id,
      },
    });
    return success(res, {
      msg: "Player updated successfully",
      data: [],
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong",
      error: [err?.message],
    });
  }
};

const deletePlayer = async (req, res) => {
  try {
    let player = await Player.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!player) {
      return error(res, {
        msg: "Player not found",
      });
    }

    await player.destroy();
    return success(res, {
      msg: "Player deleted successfully",
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
  deletePlayer,
};
