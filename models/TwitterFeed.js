const { DataTypes } = require("sequelize");
const { db } = require("../utils");

const TwitterFeed = db.define("twitterFeeds", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "news",
  },
  feed: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = TwitterFeed;
