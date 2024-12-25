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
const { TopicTypes, TagType } = require("../../constants/Constants");
const TeamQuickLink = require("../../models/TeamQuickLink");

const getBySlug = async (req, res) => {
  try {
    let slugParam = req.params.slug;
    let slug = req.query.slug ?? "";
    let type = req.query.type ?? "";

    let response = {};
    if (type == TagType.PLAYER) {
      response = await Player.findOne({
        where: {
          slug: slugParam,
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
      if (!response) {
        return error(res, {
          msg: "Player not found!!",
        });
      }
      if (!slug) {
        let playerQuick = await PlayerQuickLink.findOne({
          where: {
            playerId: response.id,
          },
        });
        if (playerQuick) {
          slug = playerQuick.slug;
        }
      }
      response = response.toJSON();
      response["quickLinks"] = response.playerQuickLinks;
      delete response.playerQuickLinks;
      response["quickLinkInfo"] = await PlayerQuickLink.findOne({
        where: {
          playerId: response.id,
          slug: slug,
        },
      });
    } else {
      response = await Team.findOne({
        where: {
          slug: slugParam,
        },
        include: [
          {
            model: Admin,
            attributes: ["name", "email"],
          },
          {
            model: TeamQuickLink,
            attributes: ["title", "slug"],
          },
        ],
      });
      if (!response) {
        return error(res, {
          msg: "Team not found!!",
        });
      }
      if (!slug) {
        let teamQuick = await TeamQuickLink.findOne({
          where: {
            teamId: response.id,
          },
        });
        if (teamQuick) {
          slug = teamQuick.slug;
        }
      }
      response = response.toJSON();
      response["quickLinks"] = response.teamQuickLinks;
      delete response.teamQuickLinks;
      response["quickLinkInfo"] = await TeamQuickLink.findOne({
        where: {
          teamId: response.id,
          slug: slug,
        },
      });
    }
    return success(res, {
      data: [response],
      msg: "Info fetched successfully!!",
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong!!",
      error: [err?.message],
    });
  }
};

const moreInfo = async (req, res) => {
  try {
    const team = req.params.team;
    let response = [];
    if (req?.query?.type == TagType.PLAYER) {
      response = await Player.findAll({
        where: {
          teams: {
            [Op.like]: `%${team}%`,
          },
        },
        attributes: ["id", "name", "image"],
      });
    } else {
      response = await Team.findAll({
        where: {
          name: {
            [Op.ne]: team,
          },
        },
        attributes: ["id", "name", "image"],
      });
    }

    return success(res, {
      data: response,
      msg: "More Info fetched successfully!!",
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong!!",
      error: [err?.message],
    });
  }
};

const getBlogs = async (req, res) => {
  try {
    const slug = req.params.slug;
    let type = "";
    let id = 0;
    if (req.query?.type == TagType.PLAYER) {
      type = TagType.PLAYER;
      const data = await Player.findOne({
        where: {
          slug: slug,
        },
      });
      if (data) {
        id = data.id;
      }
    } else {
      type = TagType.TEAM;
      const data = await Team.findOne({
        where: {
          slug: slug,
        },
      });
      if (data) {
        id = data.id;
      }
    }
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
            type: type,
            topicId: id,
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
  getBySlug,
  moreInfo,
  getBlogs,
};
