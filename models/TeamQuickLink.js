const { DataTypes } = require("sequelize");
const { db } = require("../utils");
const Team = require("./Team");

const TeamQuickLink = db.define("teamQuickLinks", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  teamId: {
    type: DataTypes.INTEGER,
    references: {
      model: "teams",
      key: "id",
    },
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

Team.hasMany(TeamQuickLink, { foreignKey: "teamId" });
TeamQuickLink.belongsTo(Team, { foreignKey: "teamId" });

module.exports = TeamQuickLink;
