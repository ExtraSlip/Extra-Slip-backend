const { error, success } = require("../../handlers");
const envCredential = require("../../config");
const { Team, Player, TeamQuickLink, Blog } = require("../../models");
const sequelize = require("../../utils/Connection");
const PlayerQuickLink = require("../../models/PlayerQuickLink");
const BASE_URL = envCredential.MAIL_BASE_URL;

const index = async (req, res) => {
  try {
    let response = [];
    const teams = await Team.findAll({
      attributes: [
        "slug",
        [sequelize.literal(`"${new Date().toLocaleString()}"`), "lastModified"],
        [sequelize.literal(`1`), "priority"],
      ],
      raw: true,
    });
    const teamsQuickLinks = await TeamQuickLink.findAll({
      attributes: [
        "slug",
        [sequelize.literal(`"${new Date().toLocaleString()}"`), "lastModified"],
        [sequelize.literal(`1`), "priority"],
      ],
      raw: true,
    });
    const players = await Player.findAll({
      attributes: [
        "slug",
        [sequelize.literal(`"${new Date().toLocaleString()}"`), "lastModified"],
        [sequelize.literal(`1`), "priority"],
      ],
      raw: true,
    });
    const playerQuickLinks = await PlayerQuickLink.findAll({
      attributes: [
        "slug",
        [sequelize.literal(`"${new Date().toLocaleString()}"`), "lastModified"],
        [sequelize.literal(`1`), "priority"],
      ],
      raw: true,
    });
    let blogs = await Blog.findAll({
      attributes: ["customUrl", "categoryBasedUrl"],
      raw: true,
    });
    blogs.map((e) => {
      response.push({
        slug: BASE_URL + e.customUrl,
        lastModified: new Date().toLocaleString(),
        priority: 1,
      });
      response.push({
        slug: BASE_URL + e.categoryBasedUrl,
        lastModified: new Date().toLocaleString(),
        priority: 1,
      });
    });
    response = [
      ...response,
      ...players.map((e) => {
        return {
          ...e,
          slug: BASE_URL + "/cricket/player/" + e.slug,
        };
      }),
      ...playerQuickLinks.map((e) => {
        return {
          ...e,
          slug: BASE_URL + "/cricket/player/" + e.slug,
        };
      }),
      ...teams.map((e) => {
        return {
          ...e,
          slug: BASE_URL + "/cricket/team/" + e.slug,
        };
      }),
      ...teamsQuickLinks.map((e) => {
        return {
          ...e,
          slug: BASE_URL + "/cricket/team/" + e.slug,
        };
      }),
    ];
    response.push({
      slug: "https://extraslip.com/who-said-what",
      lastModified: new Date().toLocaleString(),
      priority: 1,
    });
    response.push({
      slug: "https://extraslip.com/legends-of-the-past",
      lastModified: new Date().toLocaleString(),
      priority: 1,
    });
    response.push({
      slug: "https://extraslip.com/cricket-live-streaming",
      lastModified: new Date().toLocaleString(),
      priority: 1,
    });
    response.push({
      slug: "https://extraslip.com/cricket-news",
      lastModified: new Date().toLocaleString(),
      priority: 1,
    });
    return success(res, {
      msg: "Sitemap details send successfully",
      data: response,
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong!!",
      error: [err?.message],
    });
  }
};

module.exports = {
  index,
};
