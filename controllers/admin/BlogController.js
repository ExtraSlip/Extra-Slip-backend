const { Op, literal } = require("sequelize");
const { error, success } = require("../../handlers");
const {
  Blog,
  BlogTopic,
  BlogComment,
  Tag,
  Category,
  Player,
  Admin,
  Setting,
} = require("../../models");
const sequelize = require("../../utils/Connection");
const {
  TopicTypes,
  BlogFilterType,
  RoleType,
  Settings,
} = require("../../constants/Constants");
const { getRandomNumber } = require("../../utils/Common");
const { encrypt, decrypt, hashString } = require("../../utils/Bcrypt");
const { relatedBlogs } = require("../api/BlogController");

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
    if (req.user.type != RoleType.ADMIN) {
      query["createdBy"] = req.user.id;
    }
    switch (type) {
      case BlogFilterType.Total:
        // need to add condition if required
        query["deletedAt"] = {
          [Op.eq]: null,
        };
        break;
      case BlogFilterType.Mine:
        query["createdBy"] = req.user.id;
        query["deletedAt"] = {
          [Op.eq]: null,
        };
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
            attributes: [
              "id",
              "name",
              "image",
              [
                literal("(SELECT value FROM settings WHERE `key` = 'postUrl')"),
                "urlSetting",
              ],
            ],
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
          ["shortTitle", "title"],
          "featuredImage",
          "createdAt",
          "likes",
          "status",
          "customUrl",
          "categoryBasedUrl",
          [
            sequelize.literal(
              "(SELECT COUNT(*) FROM blogComments WHERE blogComments.blogId = blogs.id)"
            ),
            "comments",
          ],
        ],
        paranoid: false,
        order: [["id", "desc"]],
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
            attributes: [
              "id",
              "name",
              "image",
              [
                literal("(SELECT value FROM settings WHERE `key` = 'postUrl')"),
                "urlSetting",
              ],
            ],
          },
        ],
      });
      let totalCount = await Blog.count({});
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
          deletedAt: {
            [Op.eq]: null,
          },
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
                  attributes: ["id", "name", "image", "slug"],
                });
                break;
              case TopicTypes.TAG:
                x["topic"] = await Tag.findOne({
                  where: { id: x.topicId },
                  attributes: ["id", "name", "image"],
                });
                break;

              default:
                x["topic"] = {
                  id: 0,
                  name: x.name,
                  image: "",
                  slug: "",
                };
                break;
            }
            return x;
          })
        );
        ele.blogTopics = ele.blogTopics?.filter(
          (e) => e?.topic?.name != null && e?.topic?.name != ""
        );
        return ele;
      })
    );

    if (req.query?.id) {
      const settings = await Setting.findAll({
        where: {
          key: {
            [Op.in]: [
              Settings.FACEBOOK,
              Settings.DISCORD,
              Settings.TWITTER,
              Settings.LINKEDIN,
              Settings.INSTAGRAM,
              Settings.PINTREST,
              Settings.YOUTUBE,
              Settings.THREAD,
            ],
          },
        },
      });
      blogs = blogs.map((e) => {
        let data = e;
        return {
          ...data,
          settings,
        };
      });
      response = blogs;
    } else {
      response[0].blogs = blogs;
    }

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

const updateHash = async (req, res) => {
  try {
    let blogs = await Blog.findAll({
      where: {
        [Op.or]: [
          {
            customUrlHash: null,
          },
          {
            categoryBasedUrlHash: null,
          },
        ],
      },
    });
    console.log(blogs.length);
    for (let index = 0; index < blogs.length; index++) {
      const blog = blogs[index];
      if (
        (blog.customUrlHash == null || blog.customUrlHash == "") &&
        blog.customUrl != null
      ) {
        blog["customUrlHash"] = hashString(blog.customUrl);
      }

      if (
        (blog.categoryBasedUrlHash == null ||
          blog.categoryBasedUrlHash == "") &&
        blog.categoryBasedUrl != null
      ) {
        blog["categoryBasedUrlHash"] = hashString(blog.categoryBasedUrl);
      }
      await blog.save();
    }
    return success(res, {
      msg: "Hash updated successfully",
    });
  } catch (err) {
    console.log(err);
  }
  return;
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
      payload["customUrl"] = payload["customUrl"];
      payload["customUrlHash"] = hashString(payload["customUrl"]);
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
    payload["customUrlHash"] = hashString(payload["customUrl"]);
    payload["categoryBasedUrl"] = categoryBasedUrl(
      payload.title,
      category.name,
      payload["blogRandomId"]
    ); // category based url
    payload["categoryBasedUrlHash"] = hashString(payload["categoryBasedUrl"]);
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
      payload["customUrl"] = payload["customUrl"];
      payload["customUrlHash"] = hashString(payload["customUrl"]);
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
    payload["customUrlHash"] = hashString(payload["customUrl"]);
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
    .replaceAll(/[^\w\s]/gi, "-")
    .replaceAll(/\s+/g, "-")
    .toLowerCase();
  return `/articles/${randomNo}-${title}`;
};

const categoryBasedUrl = (title, categoryName, randomNo) => {
  title = title
    .replaceAll(/[^\w\s]/gi, "-")
    .replaceAll(/\s+/g, "-")
    .toLowerCase();
  categoryName = categoryName
    .replaceAll(/[^\w\s]/gi, "-")
    .replaceAll(/\s+/g, "-")
    .toLowerCase();
  return `/articles/${categoryName}/${randomNo}-${title}`;
};

const restoreBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findOne({ where: { id: blogId } });
    if (blog) {
      return error(res, {
        msg: "Provided blog id is not deleted",
        error: [],
      });
    }
    await Blog.restore({ where: { id: blogId } });
    return success(res, {
      msg: "Blog restored successfully",
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
  updateHash,
  restoreBlog,
};
