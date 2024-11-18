const { Op } = require("sequelize");
const { error, success } = require("../../handlers");
const {
  Blog,
  BlogTopic,
  BlogComment,
  Tag,
  Category,
  Player,
} = require("../../models");
const sequelize = require("../../utils/Connection");

const topicsList = async (req, res) => {
  try {
    let search = req.query.search;
    let query = {};
    if (search) {
      query["name"] = {
        [Op.like]: `%${search}%`,
      };
    }
    let topics = [];
    let tags = await Tag.findAll({
      where: query,
      attributes: [
        ["id", "topicId"],
        "name",
        [sequelize.literal(`'tag'`), "type"],
        [sequelize.literal(`'0'`), "id"],
      ],
      raw: true,
    });
    let categories = await Category.findAll({
      where: query,
      attributes: [
        ["id", "topicId"],
        "name",
        [sequelize.literal(`'category'`), "type"],
        [sequelize.literal(`'0'`), "id"],
      ],
      raw: true,
    });
    let players = await Player.findAll({
      where: query,
      attributes: [
        ["id", "topicId"],
        "name",
        [sequelize.literal(`'player'`), "type"],
        [sequelize.literal(`'0'`), "id"],
      ],
      raw: true,
    });
    topics = [...tags, ...categories, ...players];
    topics = topics.map((e, index) => {
      return {
        ...e,
        id: index + 1,
      };
    });
    return success(res, {
      msg: "Topics listed successfully",
      data: topics,
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong",
      error: [err?.message],
    });
  }
};

const index = async (req, res) => {
  try {
    let query = {};
    if (req.query?.id) {
      query["id"] = req.query.id;
    }
    let blogs = await Blog.findAll({
      where: query,
      include: [
        {
          model: BlogTopic,
        },
        {
          model: BlogComment,
        },
      ],
    });
    return success(res, {
      msg: "Blog listed successfully",
      data: blogs,
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
    if (req.file) {
      payload["featuredImage"] = "/uploads/" + req.file?.filename;
    }
    const topics = JSON.parse(payload?.topics);
    payload["createdBy"] = req.user.id;
    let blog = await Blog.create(payload);
    await topics?.map(async (element) => {
      element["blogId"] = blog.id;
      await BlogTopic.create(element);
    });
    return success(res, {
      msg: "Blog created successfully",
      data: [blog],
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
    if (req.file) {
      payload["featuredImage"] = "/uploads/" + req.file?.filename;
    }
    const topics = JSON.parse(payload?.topics);
    await Blog.update(payload, { where: { id: req.params.id } });
    await BlogTopic.destroy({ where: { blogId: req.params.id } });
    await topics.map(async (element) => {
      element["blogId"] = req.params.id;
      await BlogTopic.create(element);
    });
    return success(res, {
      msg: "Blog updated successfully",
      data: [],
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong",
      error: [err?.message],
    });
  }
};

const deleteBlog = async (req, res) => {
  try {
    let blogId = req.params.id;
    await BlogTopic.destroy({ where: { blogId } });
    await BlogComment.destroy({ where: { blogId } });
    await Blog.destroy({ where: { id: blogId } });
    return success(res, {
      msg: "Blog deleted successfully",
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
  add,
  update,
  deleteBlog,
  index,
  topicsList,
};
