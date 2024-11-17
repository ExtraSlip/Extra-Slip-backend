const { DataTypes } = require("sequelize");
const { db } = require("../utils");
const { CommentStatus, TopicTypes } = require("../constants/Constants");
const Blog = require("./Blog");

const BlogTopic = db.define("blogTopics", {
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
  topicId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: TopicTypes.OTHER,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

Blog.hasMany(BlogTopic, { foreignKey: "blogId" });
BlogTopic.belongsTo(Blog, { foreignKey: "blogId" });

module.exports = BlogTopic;
