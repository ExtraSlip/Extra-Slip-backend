const { success, error } = require("../../handlers");
const { Player, Admin, TeamPlayer, Team } = require("../../models");
const PlayerQuickLink = require("../../models/PlayerQuickLink");
const { createSlug } = require("../../utils/Common");

const index = async (req, res) => {
  try {
    let query = {};
    if (req.query.teamId) {
      query.teamId = req.query.teamId;
    }
    if (req.query.id) {
      query["id"] = req.query.id;
    }
    const players = await Player.findAll({
      where: query,
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

const getById = async (req, res) => {
  try {
    let query = {};
    query["id"] = req.params.id;
    const players = await Player.findAll({
      where: query,
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
        {
          model: PlayerQuickLink,
          attributes: ["id", "title", "slug", "description"],
        },
      ],
    });
    if (players.length == 0) {
      return error(res, {
        msg: "Player not found",
        error: ["Player not found"],
      });
    }
    return success(res, {
      msg: "Player fetched successfully",
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
    payload["slug"] = createSlug(payload.name);
    const slugExists = await Player.findOne({
      where: {
        slug: payload.slug,
      },
    });
    const maxId = await Player.max("id");
    if (slugExists) {
      payload["slug"] = payload["slug"] + "-" + (maxId ?? 1);
    }
    if (req?.files?.image) {
      payload["image"] = req.files?.image[0]?.path;
    }
    const player = await Player.create(payload);
    if (
      payload?.playerQuickLinks != "[]" &&
      payload?.playerQuickLinks != null
    ) {
      let playerQuickLinks = JSON.parse(payload?.playerQuickLinks);
      await Promise.all(
        playerQuickLinks.map(async (playerQuickLink) => {
          let slug = createSlug(playerQuickLink?.title);
          let slugExists = await PlayerQuickLink.findOne({
            where: {
              slug: slug,
            },
          });
          if (slugExists) {
            slug = slug + "-" + ((await PlayerQuickLink.max("id")) ?? 1);
          }
          await PlayerQuickLink.create({
            playerId: player.id,
            title: playerQuickLink?.title,
            slug: slug,
            description: playerQuickLink?.description,
          });
        })
      );
    }
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
    payload["slug"] = createSlug(payload.name);
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
    await PlayerQuickLink.destroy({
      where: {
        playerId: player.id,
      },
    });
    if (
      payload?.playerQuickLinks != "[]" &&
      payload?.playerQuickLinks != null
    ) {
      let playerQuickLinks = JSON.parse(payload?.playerQuickLinks);
      await Promise.all(
        playerQuickLinks.map(async (playerQuickLink) => {
          let slug = createSlug(playerQuickLink?.title);
          let slugExists = await PlayerQuickLink.findOne({
            where: {
              slug: slug,
            },
          });
          if (slugExists) {
            slug = slug + "-" + ((await PlayerQuickLink.max("id")) ?? 1);
          }
          await PlayerQuickLink.create({
            playerId: player.id,
            title: playerQuickLink?.title,
            slug: slug,
            description: playerQuickLink?.description,
          });
        })
      );
    }
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
  getById,
};
