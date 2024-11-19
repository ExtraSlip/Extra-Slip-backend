const { Op } = require("sequelize");
const { error, success } = require("../../handlers");
const {
  Blog,
  BlogTopic,
  BlogComment,
  Admin,
  User,
  BlogBookmark,
} = require("../../models");

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
    const bookmarked = await BlogBookmark.findOne({
      where: {
        blogId: id,
        userId: req?.userId ?? 0,
      },
    });
    blog = blog.toJSON();
    blog.isBookmarked = bookmarked ? true : false;
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
    blog.increment("likes");
    return success(res, {
      msg: "Blog liked successfully!!",
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
    const comments = await BlogComment.findAll({
      where: {
        blogId,
      },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "image"],
        },
      ],
      attributes: ["id", "comment", "createdAt", "blogId"],
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
};
