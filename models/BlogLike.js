const { DataTypes } = require("sequelize");
const { db } = require("../utils");
const Blog = require("./Blog");
const User = require("./User");

const BlogLike = db.define("blogLikes", {
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

Blog.hasMany(BlogLike, { foreignKey: "blogId" });
BlogLike.belongsTo(Blog, { foreignKey: "blogId" });

User.hasMany(BlogLike, { foreignKey: "userId" });
BlogLike.belongsTo(User, { foreignKey: "userId" });

module.exports = BlogLike;
