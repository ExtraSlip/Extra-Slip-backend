const { DataTypes } = require("sequelize");
const { db } = require("../utils");
const Player = require("./Player");

const PlayerQuickLink = db.define("playerQuickLinks", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  playerId: {
    type: DataTypes.INTEGER,
    references: {
      model: "players",
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

Player.hasMany(PlayerQuickLink, { foreignKey: "playerId" });
PlayerQuickLink.belongsTo(Player, { foreignKey: "playerId" });

module.exports = PlayerQuickLink;
