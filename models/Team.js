const { DataTypes } = require("sequelize");
const { db } = require("../utils");
const Admin = require("./Admin");

const Team = db.define("teams", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nickName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  netWorth: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  odiCaptain: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  testCaptain: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
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
  createdBy: {
    type: DataTypes.INTEGER,
    references: {
      model: "admins",
      key: "id",
    },
    allowNull: false,
  },
});

Admin.hasMany(Team, { foreignKey: "createdBy" });
Team.belongsTo(Admin, { foreignKey: "createdBy" });

module.exports = Team;
