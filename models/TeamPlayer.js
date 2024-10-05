const { DataTypes } = require("sequelize");
const { db } = require("../utils");
const Player = require("./Player");
const Team = require("./Team");

const TeamPlayer = db.define("teamPlayers", {
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
  playerId: {
    type: DataTypes.INTEGER,
    references: {
      model: "players",
      key: "id",
    },
    allowNull: false,
  },
});

Player.hasMany(TeamPlayer, { foreignKey: "playerId" });
TeamPlayer.belongsTo(Player, { foreignKey: "playerId" });

Team.hasMany(TeamPlayer, { foreignKey: "teamId" });
TeamPlayer.belongsTo(Team, { foreignKey: "teamId" });

module.exports = TeamPlayer;
