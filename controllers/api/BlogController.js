const { Op } = require("sequelize");
const { error, success } = require("../../handlers");
const { Blog, BlogTopic, BlogComment, Admin } = require("../../models");

const get = async (req, res) => {
  try {
    let id = req.params.id;
    let blog = await Blog.findOne({
      where: {
        id,
      },
      include: [
        {
          model: BlogTopic,
        },
        {
          model: BlogComment,
        },
        {
          model: Admin,
          attributes: ["name", "image"],
        },
      ],
    });
    return success(res, {
      msg: "Blog listed successfully!!",
      data: [blog],
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong!!",
      error: [ex?.message],
    });
  }
};

const index = async (req, res) => {
  try {
    let { categoryId } = req.query;
    let query = {};
    if (categoryId) {
      query["categoryId"] = categoryId;
    }
    let blogs = await Blog.findAll({
      where: query,
      attributes: ["title", "featuredImage", "id"],
    });
    return success(res, {
      msg: "Blogs listed successfully!!",
      data: blogs,
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong!!",
      error: [ex?.message],
    });
  }
};

const relatedBlogs = async (req, res) => {
  try {
    let { categoryId, id } = req.query;
    let query = {};
    if (categoryId) {
      query["categoryId"] = categoryId;
    }
    if (id) {
      query["id"] = {
        [Op.ne]: id,
      };
    }
    let blogs = await Blog.findAll({
      where: query,
      attributes: ["title", "featuredImage", "id"],
      order: [["id", "desc"]],
      limit: 5,
    });
    return success(res, {
      msg: "Related blogs listed successfully!!",
      data: blogs,
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong!!",
      error: [ex?.message],
    });
  }
};

module.exports = {
  get,
  index,
  relatedBlogs,
};
