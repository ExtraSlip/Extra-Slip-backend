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
  tagType: {
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
  inFocus: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  webStories: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = Tag;
