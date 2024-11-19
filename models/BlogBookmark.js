const { DataTypes } = require("sequelize");
const { db } = require("../utils");
const { CommentStatus } = require("../constants/Constants");
const Blog = require("./Blog");
const User = require("./User");

const BlogBookmark = db.define("blogBookmarks", {
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
});

Blog.hasMany(BlogBookmark, { foreignKey: "blogId" });
BlogBookmark.belongsTo(Blog, { foreignKey: "blogId" });

User.hasMany(BlogBookmark, { foreignKey: "userId" });
BlogBookmark.belongsTo(User, { foreignKey: "userId" });

module.exports = BlogBookmark;
