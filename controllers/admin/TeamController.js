const { Op } = require("sequelize");
const { success, error } = require("../../handlers");
const {
  Admin,
  Team,
  TeamPlayer,
  Player,
  TeamQuickLink,
} = require("../../models");
const { createSlug } = require("../../utils/Common");

const index = async (req, res) => {
  try {
    const teams = await Team.findAll({
      include: [
        {
          model: Admin,
          attributes: ["name", "email"],
        },
        {
          model: TeamPlayer,
          include: [
            {
              model: Player,
              attributes: ["name"],
            },
          ],
        },
        {
          model: TeamQuickLink,
          attributes: ["id", "title", "description"],
        },
      ],
      order: [["id", "desc"]],
    });
    return success(res, {
      msg: "Teams fetched successfully",
      data: teams,
    });
  } catch (err) {
    console.log(err);
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
    if (req.file?.path) {
      payload["image"] = req.file.path;
    }
    payload["slug"] = createSlug(payload.name);
    const teamExists = await Team.findOne({
      where: {
        name: payload.name,
      },
    });
    if (teamExists) {
      return error(res, {
        msg: "Team name already exists",
      });
    }
    const team = await Team.create(payload);
    if (payload.players?.length) {
      const teamPlayers = payload.players.map((player) => {
        return {
          teamId: team.id,
          playerId: player,
        };
      });
      await TeamPlayer.bulkCreate(teamPlayers);
    }
    if (payload?.teamQuickLinks != "[]" && payload?.teamQuickLinks != null) {
      let teamQuickLinks = JSON.parse(payload?.teamQuickLinks);
      await Promise.all(
        teamQuickLinks.map(async (teamQuickLink) => {
          await TeamQuickLink.create({
            teamId: team.id,
            title: teamQuickLink?.title,
            slug: createSlug(teamQuickLink?.title),
            description: teamQuickLink?.description,
          });
        })
      );
    }
    return success(res, {
      msg: "Team created successfully",
      data: [team],
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
    const teamExists = await Team.findOne({
      where: {
        name: payload.name,
        id: {
          [Op.ne]: req.params.id,
        },
      },
    });
    if (teamExists) {
      return error(res, {
        msg: "Team name already exists",
      });
    }
    if (payload.image) delete payload.image;
    if (req.file?.path) {
      payload["image"] = req.file.path;
    }
    payload["slug"] = createSlug(payload.name);
    const team = await Team.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!team) {
      return error(res, {
        msg: "Team not found",
      });
    }
    await Team.update(payload, {
      where: {
        id: req.params.id,
      },
    });
    await TeamPlayer.destroy({
      where: {
        teamId: req.params.id,
      },
    });
    if (payload.players?.length) {
      const teamPlayers = payload.players.map((player) => {
        return {
          teamId: team.id,
          playerId: player,
        };
      });
      await TeamPlayer.bulkCreate(teamPlayers);
    }
    await TeamQuickLink.destroy({
      where: {
        teamId: team.id,
      },
    });
    if (payload?.teamQuickLinks != "[]" && payload?.teamQuickLinks != null) {
      let teamQuickLinks = JSON.parse(payload?.teamQuickLinks);
      await Promise.all(
        teamQuickLinks.map(async (teamQuickLink) => {
          await TeamQuickLink.create({
            teamId: team.id,
            title: teamQuickLink?.title,
            slug: createSlug(teamQuickLink?.title),
            description: teamQuickLink?.description,
          });
        })
      );
    }
    return success(res, {
      msg: "Team updated successfully",
      data: [],
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong",
      error: [err?.message],
    });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!team) {
      return error(res, {
        msg: "Team not found",
      });
    }
    await TeamPlayer.destroy({
      where: {
        teamId: req.params.id,
      },
    });

    await team.destroy();

    return success(res, {
      msg: "Team deleted successfully",
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
  deleteTeam,
};
