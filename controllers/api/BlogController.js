const { Op, literal } = require("sequelize");
const { error, success } = require("../../handlers");
const {
  Blog,
  BlogTopic,
  BlogComment,
  Admin,
  User,
  BlogBookmark,
  Category,
  Player,
  Tag,
  Setting,
  TwitterFeed,
  Team,
  BlogLike,
} = require("../../models");
const { getPageAndOffset } = require("../../utils/Common");
const {
  TopicTypes,
  BlogStatus,
  Settings,
} = require("../../constants/Constants");
const sequelize = require("../../utils/Connection");

const get = async (req, res) => {
  try {
    let id = req.params.id;
    console.log(id);
    let blog = await Blog.findOne({
      where: {
        [Op.or]: [
          {
            id,
          },
          {
            blogRandomId: id,
          },
        ],
        status: BlogStatus.PUBLISHED,
      },
      include: [
        {
          model: BlogTopic,
        },
        {
          model: BlogComment,
          attributes: [],
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
    if (blog == null) {
      return error(res, {
        msg: "Blog not found!!",
        error: ["Blog not found!!"],
      });
    }
    blog = blog.toJSON();
    blog["isLiked"] = false;
    if (req.user) {
      let isLiked = await BlogLike.findOne({
        where: {
          blogId: id,
          userId: req.user.id,
        },
      });
      blog["isLiked"] = isLiked ? true : false;
    }
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
    blog.settings = settings;
    id = blog.id;
    const bookmarked = await BlogBookmark.findOne({
      where: {
        blogId: id,
        userId: req?.userId ?? 0,
      },
    });
    blog.blogTopics = await Promise.all(
      blog?.blogTopics?.map(async (x) => {
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
          case TopicTypes.TEAM:
            x["topic"] = await Team.findOne({
              where: { id: x.topicId },
              attributes: ["id", "name", "image", "slug"],
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
    blog.blogTopics = blog.blogTopics?.filter(
      (e) => e?.topic?.name != null && e?.topic?.name != ""
    );
    blog.isBookmarked = bookmarked ? true : false;
    blog.extraSlipRecommended = await Blog.findAll({
      where: {
        id: {
          [Op.ne]: blog.id,
        },
        status: BlogStatus.PUBLISHED,
      },
      order: [["id", "desc"]],
      attributes: [
        "id",
        ["shortTitle", "title"],
        "subTitle",
        "featuredImage",
        "createdAt",
        "customUrl",
        "categoryBasedUrl",
        [
          sequelize.literal(
            "(SELECT COUNT(*) FROM blogComments WHERE blogComments.blogId = blogs.id)"
          ),
          "comments",
        ],
      ],
      include: [
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
      limit: 5,
    });
    blog.recommended = await Blog.findAll({
      where: {
        id: {
          [Op.ne]: blog.id,
        },
        status: BlogStatus.PUBLISHED,
      },
      order: [["id", "desc"]],
      attributes: [
        "id",
        ["shortTitle", "title"],
        "subTitle",
        "featuredImage",
        "createdAt",
        "customUrl",
        "categoryBasedUrl",
        [
          sequelize.literal(
            "(SELECT COUNT(*) FROM blogComments WHERE blogComments.blogId = blogs.id)"
          ),
          "comments",
        ],
      ],
      include: [
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
      limit: 5,
    });
    return success(res, {
      msg: "Blog listed successfully!!",
      data: [blog],
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong!!",
      error: [err?.message],
    });
  }
};

const getBlogByUrl = async (req, res) => {
  try {
    let url = req.query.url;
    if (!url) {
      return error(res, {
        msg: "Blog url not found!!",
        error: ["Blog url not found!!"],
      });
    }
    let blog = await Blog.findOne({
      where: {
        [Op.or]: [
          {
            customUrlHash: url,
          },
          {
            categoryBasedUrlHash: url,
          },
        ],
        status: BlogStatus.PUBLISHED,
      },
      include: [
        {
          model: BlogTopic,
        },
        {
          model: BlogComment,
          attributes: [],
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
    if (!blog) {
      return error(res, {
        msg: "Blog not found!!",
        error: ["Blog not found!!"],
      });
    }
    id = blog.id;
    const bookmarked = await BlogBookmark.findOne({
      where: {
        blogId: id,
        userId: req?.userId ?? 0,
      },
    });
    blog = blog.toJSON();
    blog["isLiked"] = false;
    if (req.user) {
      let isLiked = await BlogLike.findOne({
        where: {
          blogId: id,
          userId: req.user.id,
        },
      });
      blog["isLiked"] = isLiked ? true : false;
    }
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
    blog.settings = settings;
    blog.blogTopics = await Promise.all(
      blog?.blogTopics?.map(async (x) => {
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
          case TopicTypes.TEAM:
            x["topic"] = await Team.findOne({
              where: { id: x.topicId },
              attributes: ["id", "name", "image", "slug"],
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
    blog.blogTopics = blog.blogTopics?.filter(
      (e) => e?.topic?.name != null && e?.topic?.name != ""
    );
    blog.isBookmarked = bookmarked ? true : false;
    blog.extraSlipRecommended = await Blog.findAll({
      where: {
        id: {
          [Op.ne]: blog.id,
        },
        status: BlogStatus.PUBLISHED,
      },
      order: [["id", "desc"]],
      attributes: [
        "id",
        ["shortTitle", "title"],
        "subTitle",
        "featuredImage",
        "createdAt",
        "customUrl",
        "categoryBasedUrl",
        [
          sequelize.literal(
            "(SELECT COUNT(*) FROM blogComments WHERE blogComments.blogId = blogs.id)"
          ),
          "comments",
        ],
      ],
      include: [
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
      limit: 5,
    });
    blog.recommended = await Blog.findAll({
      where: {
        id: {
          [Op.ne]: blog.id,
        },
        status: BlogStatus.PUBLISHED,
      },
      order: [["id", "desc"]],
      attributes: [
        "id",
        ["shortTitle", "title"],
        "subTitle",
        "featuredImage",
        "createdAt",
        "customUrl",
        "categoryBasedUrl",
        [
          sequelize.literal(
            "(SELECT COUNT(*) FROM blogComments WHERE blogComments.blogId = blogs.id)"
          ),
          "comments",
        ],
      ],
      include: [
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
      limit: 5,
    });
    return success(res, {
      msg: "Blog listed successfully!!",
      data: [blog],
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong!!",
      error: [err?.message],
    });
  }
};

const index = async (req, res) => {
  try {
    let { categoryId, page = 1, limit = 10 } = req.query;
    console.log({ page, limit });
    let query = {
      status: BlogStatus.PUBLISHED,
    };
    let pagination = getPageAndOffset(page, limit);
    if (categoryId) {
      query["categoryId"] = categoryId;
    }
    let blogs = await Blog.findAll({
      where: query,
      order: [["id", "desc"]],
      include: [
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
      attributes: [
        ["shortTitle", "title"],
        "featuredImage",
        "id",
        "customUrl",
        "categoryBasedUrl",
      ],
      limit: pagination.limit,
      offset: pagination.offset,
    });
    return success(res, {
      msg: "Blogs listed successfully!!",
      data: blogs,
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong!!",
      error: [err?.message],
    });
  }
};

const list = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    console.log({ page, limit });
    let query = {
      status: BlogStatus.PUBLISHED,
    };
    let pagination = getPageAndOffset(page, limit);
    let blogs = await Blog.findAll({
      where: query,
      order: [["id", "desc"]],
      include: [
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
      attributes: [
        ["shortTitle", "title"],
        "featuredImage",
        "id",
        "customUrl",
        "categoryBasedUrl",
        "createdAt",
      ],
      limit: pagination.limit,
      offset: pagination.offset,
    });
    const twitterFeeds = await TwitterFeed.findAll({
      where: {
        type: "news",
      },
    });
    let response = {
      blogs,
      twitterFeeds,
    };
    return success(res, {
      msg: "Blogs listed successfully!!",
      data: [response],
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong!!",
      error: [err?.message],
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
      order: [["id", "desc"]],
      attributes: [
        ["shortTitle", "title"],
        "featuredImage",
        "id",
        "customUrl",
        "categoryBasedUrl",
      ],
      include: [
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
      error: [err?.message],
    });
  }
};

const addLike = async (req, res) => {
  try {
    let blogId = req.params.blogId;
    let blog = await Blog.findOne({
      where: {
        id: blogId,
      },
    });
    if (!blog) {
      return error(res, {
        msg: "Blog not found!!",
        error: [],
      });
    }
    const blogLike = await BlogLike.findOne({
      where: {
        blogId: blogId,
        userId: req.user.id,
      },
    });
    let msg = "Blog liked successfully!!";
    if (blogLike) {
      await blogLike.destroy();
      blog.decrement("likes");
      msg = "Blog un liked successfully!!";
    } else {
      await BlogLike.create({
        blogId: blogId,
        userId: req.user.id,
      });
      blog.increment("likes");
    }
    return success(res, {
      msg,
      data: [],
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong!!",
      error: [err?.message],
    });
  }
};

const addComment = async (req, res) => {
  try {
    let payload = req.body;
    payload["userId"] = req.user.id;
    let comment = await BlogComment.create(payload);
    return success(res, {
      msg: "Comment added successfully!!",
      data: [comment],
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong!!",
      error: [err?.message],
    });
  }
};

const getComments = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    let comments = await BlogComment.findAll({
      where: {
        blogId,
        parentCommentId: null,
      },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "image"],
          as: "user",
        },
      ],
      attributes: ["id", "comment", "createdAt", "blogId"],
    });
    const childComments = await BlogComment.findAll({
      where: {
        blogId,
        parentCommentId: {
          [Op.ne]: null,
        },
      },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "image"],
          as: "user",
        },
      ],
      attributes: ["id", "comment", "createdAt", "blogId", "parentCommentId"],
    });
    let childCommentObject = {};
    childComments.map((e) => {
      if (Object.keys(childCommentObject).includes(e.parentCommentId)) {
        childCommentObject[e.parentCommentId].push(e);
      } else {
        childCommentObject[e.parentCommentId] = [e];
      }
    });
    comments = comments.map((e) => {
      let comment = e.toJSON();
      comment["childComments"] = childCommentObject[e.id] || [];
      return comment;
    });
    return success(res, {
      msg: "Comments listed successfully!!",
      data: comments,
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong!!",
      error: [err?.message],
    });
  }
};

const toggleBookmark = async (req, res) => {
  try {
    const payload = req.body;
    payload["userId"] = req.user.id;
    let bookmark = await BlogBookmark.findOne({
      where: {
        blogId: payload.blogId,
        userId: payload.userId,
      },
    });
    let msg = "";
    if (bookmark) {
      await bookmark.destroy();
      msg = "Bookmark removed successfully!!";
    } else {
      await BlogBookmark.create(payload);
      msg = "Bookmark added successfully!!";
    }
    return success(res, {
      msg,
      data: [],
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
  index,
  relatedBlogs,
  addComment,
  getComments,
  addLike,
  toggleBookmark,
  getBlogByUrl,
  list,
};
