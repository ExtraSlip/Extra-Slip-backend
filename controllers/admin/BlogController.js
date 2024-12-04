const { Op } = require("sequelize");
const { error, success } = require("../../handlers");
const {
  Blog,
  BlogTopic,
  BlogComment,
  Tag,
  Category,
  Player,
  Admin,
} = require("../../models");
const sequelize = require("../../utils/Connection");
const { TopicTypes, BlogFilterType } = require("../../constants/Constants");
const { getRandomNumber } = require("../../utils/Common");

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
    topics = [...tags, ...players];
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

    let { type = BlogFilterType.Total } = req.query;
    console.log({ type });
    type = parseInt(type);
    switch (type) {
      case BlogFilterType.Total:
        // need to add condition if required
        break;
      case BlogFilterType.Mine:
        query["createdBy"] = req.user.id;
        break;
      case BlogFilterType.Deleted:
        query["deletedAt"] = {
          [Op.ne]: null,
        };
        break;
      default:
        console.log("Default");
        break;
    }
    let blogs = [];
    if (req.query.id) {
      blogs = await Blog.findAll({
        where: query,
        include: [
          {
            model: BlogTopic,
            attributes: ["id", "topicId", "type", "name", "blogId"],
          },
          {
            model: BlogComment,
            attributes: ["id", "blogId", "userId", "comment", "createdAt"],
          },
          {
            model: Category,
            attributes: ["id", "name"],
          },
          {
            model: Admin,
            attributes: ["id", "name", "image"],
          },
        ],
      });
      if (blogs.length == 0) {
        return error(res, {
          msg: "Blog not found",
          error: [],
        });
      }
    } else {
      blogs = await Blog.findAll({
        where: query,
        attributes: [
          "id",
          "title",
          "featuredImage",
          "createdAt",
          "likes",
          "status",
          [
            sequelize.literal(
              "(SELECT COUNT(*) FROM blogComments WHERE blogComments.blogId = blogs.id)"
            ),
            "comments",
          ],
        ],
        paranoid: false,
        include: [
          {
            model: BlogComment,
            attributes: [],
            required: false,
          },
          {
            model: BlogTopic,
            attributes: ["topicId", "type", "name"],
          },
          {
            model: Category,
            attributes: ["id", "name"],
          },
          {
            model: Admin,
            attributes: ["id", "name", "image"],
          },
        ],
      });
    }

    blogs = await Promise.all(
      blogs.map(async (e) => {
        let ele = e.toJSON();
        ele.blogTopics = await Promise.all(
          ele?.blogTopics?.map(async (x) => {
            switch (x.type) {
              case TopicTypes.PLAYER:
                x["topic"] = await Player.findOne({
                  where: { id: x.topicId },
                  attributes: ["id", "name"],
                });
                break;
              case TopicTypes.TAG:
                x["topic"] = await Tag.findOne({
                  where: { id: x.topicId },
                  attributes: ["id", "name"],
                });
                break;

              default:
                x["topic"] = {
                  id: 0,
                  name: x.name,
                };
                break;
            }
            return x;
          })
        );
        return ele;
      })
    );
    let totalCount = await Blog.count({ paranoid: false });
    let deletedCount = await Blog.count({
      where: {
        deletedAt: {
          [Op.ne]: null,
        },
      },
      paranoid: false,
    });
    let mineCount = await Blog.count({
      where: {
        createdBy: req.user.id,
      },
      paranoid: false,
    });
    response = [
      {
        blogs,
        deletedCount,
        mineCount,
        totalCount,
      },
    ];

    return success(res, {
      msg: "Blog listed successfully",
      data: response,
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
    console.log(req.file);
    if (req.file) {
      payload["featuredImage"] = req.file?.path;
    }
    let category = await Category.findOne({
      where: {
        id: payload.categoryId,
      },
    });
    if (!category) {
      return error(res, {
        msg: "Category not exists",
        error: [],
      });
    }
    if (payload.customUrl) {
      let customUrlExists = await Blog.findOne({
        where: {
          customUrl: payload.customUrl,
          id: {
            [Op.ne]: req.params.id,
          },
        },
      });
      if (customUrlExists) {
        return error(res, {
          msg: "Custom url already exists",
          error: [],
        });
      }
    }
    payload["blogRandomId"] = getRandomNumber(12);
    payload["customUrl"] = payload?.customUrl
      ? payload?.customUrl
      : customUrl(payload.title, payload["blogRandomId"]); // custom url
    payload["categoryBasedUrl"] = categoryBasedUrl(
      payload.title,
      category.name,
      payload["blogRandomId"]
    ); // category based url
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
      payload["featuredImage"] = req.file?.path;
    }
    if (payload.customUrl) {
      let customUrlExists = await Blog.findOne({
        where: {
          customUrl: payload.customUrl,
          id: {
            [Op.ne]: req.params.id,
          },
        },
      });
      if (customUrlExists) {
        return error(res, {
          msg: "Custom url already exists",
          error: [],
        });
      }
    }
    let blog = await Blog.findOne({ where: { id: req.params.id } });
    payload["customUrl"] = payload?.customUrl
      ? payload?.customUrl
      : customUrl(payload.title, blog.blogRandomId); // custom url
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

const customUrl = (title, randomNo) => {
  title = title
    .replace(/[^\w\s]/gi, "-")
    .replace(" ", "-")
    .toLowerCase();
  return `/articles/${randomNo}-${title}`;
};

const categoryBasedUrl = (title, categoryName, randomNo) => {
  title = title
    .replace(/[^\w\s]/gi, "-")
    .replace(" ", "-")
    .toLowerCase();
  categoryName = categoryName
    .replace(/[^\w\s]/gi, "-")
    .replace(" ", "-")
    .toLowerCase();
  return `/articles/${categoryName}/${randomNo}-${title}`;
};

module.exports = {
  add,
  update,
  deleteBlog,
  index,
  topicsList,
};
