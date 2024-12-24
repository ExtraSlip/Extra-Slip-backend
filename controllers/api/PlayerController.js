const { Op } = require("sequelize");
const { error, success } = require("../../handlers");
const {
  TeamPlayer,
  Admin,
  Player,
  Team,
  Blog,
  BlogTopic,
} = require("../../models");
const PlayerQuickLink = require("../../models/PlayerQuickLink");
const { TopicTypes } = require("../../constants/Constants");

const getById = async (req, res) => {
  try {
    let id = req.params.id;
    let slug = req.query.slug ?? "";
    if (!slug) {
      let playerQuick = await PlayerQuickLink.findOne({
        where: {
          playerId: id,
        },
      });
      if (playerQuick) {
        slug = playerQuick.slug;
      }
    }
    let player = await Player.findOne({
      where: {
        id: id,
      },
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
          attributes: ["title", "slug"],
        },
      ],
    });
    if (!player) {
      return error(res, {
        msg: "Player not found!!",
      });
    }
    player = player.toJSON();
    player["playerQuickLinkInfo"] = await PlayerQuickLink.findOne({
      where: {
        playerId: id,
        slug: slug,
      },
    });
    return success(res, {
      data: [player],
      msg: "Player fetched successfully!!",
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong!!",
      error: [err?.message],
    });
  }
};

const morePlayers = async (req, res) => {
  try {
    const team = req.params.team;
    let players = await Player.findAll({
      where: {
        teams: {
          [Op.like]: `%${team}%`,
        },
      },
      attributes: ["id", "name", "image"],
    });
    return success(res, {
      data: players,
      msg: "Players fetched successfully!!",
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong!!",
      error: [err?.message],
    });
  }
};

const getBlogsAboutPlayer = async (req, res) => {
  try {
    const playerId = req.params.playerId;
    let blogs = await Blog.findAll({
      attributes: [
        "title",
        "shortTitle",
        "featuredImage",
        "id",
        "customUrl",
        "categoryBasedUrl",
        "createdAt",
      ],
      include: [
        {
          model: BlogTopic,
          where: {
            type: TopicTypes.PLAYER,
            topicId: playerId,
          },
          attributes: [],
        },
      ],
    });
    return success(res, {
      data: blogs,
      msg: "Blogs fetched successfully!!",
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong!!",
      error: [err?.message],
    });
  }
};

module.exports = {
  getById,
  morePlayers,
  getBlogsAboutPlayer,
};
