const { DataTypes } = require("sequelize");
const { db } = require("../utils");

const Tag = db.define("tags", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  about: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  facebookLink: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  twitterLink: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  linkedinLink: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  instagramLink: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  youtubeLink: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  threadLink: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  pininterestLink: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  discordLink: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Tag;
