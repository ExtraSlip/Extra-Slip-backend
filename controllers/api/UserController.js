const { error, success } = require("../../handlers");
const { Admin, AdminDetail, Blog } = require("../../models");
const { getPageAndOffset } = require("../../utils/Common");

const get = async (req, res) => {
  try {
    let id = req.params.id;
    let admin = await Admin.findOne({
      where: {
        id,
      },
      attributes: ["name", "email", "image", "username", "type"],
      include: [
        {
          model: AdminDetail,
          attributes: [
            "image",
            "bio",
            "gender",
            "dob",
            "country",
            "education",
            "experience",
            "favoriteSport",
            "favoriteTeam",
            "favoriteAthlete",
            "facebookLink",
            "twitterLink",
            "linkedinLink",
            "instagramLink",
            "youtubeLink",
            "threadLink",
            "threadLink",
            "discordLink",
          ],
        },
      ],
    });
    if (!admin) {
      return error(res, {
        msg: "User not found!!",
        error: ["User not found!!"],
      });
    }
    return success(res, {
      msg: "User details fetched successfully!!",
      data: [admin],
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong!!",
      error: [err?.message],
    });
  }
};

const recentArticles = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    let pagination = getPageAndOffset(page, limit);
    let query = {
      createdBy: req.params.id,
    };
    let blogs = await Blog.findAll({
      where: query,
      attributes: [
        "title",
        "featuredImage",
        "id",
        "customUrl",
        "categoryBasedUrl",
        "createdAt",
      ],
      order: [["id", "desc"]],
      offset: pagination.offset,
      limit: pagination.limit,
    });
    return success(res, {
      msg: "Related blogs listed successfully!!",
      data: blogs,
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong!!",
      error: [err?.message],
    });
  }
};

module.exports = {
  get,
  recentArticles,
};
