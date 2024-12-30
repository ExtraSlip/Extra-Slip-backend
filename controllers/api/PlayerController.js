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
const TeamQuickLink = require("../../models/TeamQuickLink");

const getBySlug = async (req, res) => {
  try {
    let slugParam = req.params.slug;
    let slug = req.query.slug ?? "";
    let type = req.query.type ?? "";

    let response = {};
    if (type == TopicTypes.PLAYER) {
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

const getTagInfoByQuickLinkSlug = async (req, res) => {
  try {
    let slug = req.params.slug;
    const playerQuickLink = await PlayerQuickLink.findOne({
      where: {
        slug,
      },
    });
    const teamQuickLink = await TeamQuickLink.findOne({
      where: {
        slug,
      },
    });
    if (!playerQuickLink && !teamQuickLink) {
      return error(res, {
        msg: "Quick link not found!!",
      });
    }
    let type = "";
    let id = 0;
    if (playerQuickLink) {
      type = TopicTypes.PLAYER;
      id = playerQuickLink.playerId;
    } else {
      type = TopicTypes.TEAM;
      id = teamQuickLink.teamId;
    }

    let response = {};
    if (type == TopicTypes.PLAYER) {
      response = await Player.findOne({
        where: {
          id,
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
          id,
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
    const slug = req.params.slug;
    let response = [];
    if (req?.query?.type == TopicTypes.PLAYER) {
      const player = await Player.findOne({
        where: {
          slug,
        },
        attributes: ["id", "teams"],
      });
      let arr = player?.teams?.split(",") ?? [];
      arr = arr.map((e) => {
        return {
          teams: {
            [Op.like]: `%${e}%`,
          },
        };
      });
      response = await Player.findAll({
        where: {
          [Op.or]: arr,
        },
        attributes: ["id", "name", "image"],
      });
    } else {
      response = await Team.findAll({
        where: {
          name: {
            [Op.ne]: slug,
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
    if (req.query?.type == TopicTypes.PLAYER) {
      type = TopicTypes.PLAYER;
      const data = await Player.findOne({
        where: {
          slug: slug,
        },
      });
      if (data) {
        id = data.id;
      }
    } else {
      type = TopicTypes.TEAM;
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
  getTagInfoByQuickLinkSlug,
};
