const { DataTypes } = require("sequelize");
const { db } = require("../utils");
const { CommentStatus } = require("../constants/Constants");
const Blog = require("./Blog");
const User = require("./User");

const BlogComment = db.define("blogComments", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  blogId: {
    type: DataTypes.INTEGER,
    references: {
      model: "blogs",
      key: "id",
    },
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: "users",
      key: "id",
    },
    allowNull: false,
  },
  parentCommentId: {
    type: DataTypes.INTEGER,
    references: {
      model: "blogComments",
      key: "id",
    },
    allowNull: true,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: CommentStatus.APPROVED,
  },
});

Blog.hasMany(BlogComment, { foreignKey: "blogId" });
BlogComment.belongsTo(Blog, { foreignKey: "blogId" });

User.hasMany(BlogComment, { foreignKey: "userId", as: "user" });
BlogComment.belongsTo(User, { foreignKey: "userId", as: "user" });

module.exports = BlogComment;
