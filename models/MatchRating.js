const { DataTypes } = require("sequelize");
const { db } = require("../utils");
const Admin = require("./Admin");
const Team = require("./Team");

const MatchRating = db.define("matchRatings", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  teamId1: {
    type: DataTypes.INTEGER,
    references: {
      model: "teams",
      key: "id",
    },
    allowNull: false,
  },
  teamId2: {
    type: DataTypes.INTEGER,
    references: {
      model: "teams",
      key: "id",
    },
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
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

Admin.hasMany(MatchRating, { foreignKey: "createdBy" });
MatchRating.belongsTo(Admin, { foreignKey: "createdBy" });

Team.hasMany(MatchRating, { foreignKey: "teamId1", as: "team1" });
MatchRating.belongsTo(Team, { foreignKey: "teamId1", as: "team1" });

Team.hasMany(MatchRating, { foreignKey: "teamId2", as: "team2" });
MatchRating.belongsTo(Team, { foreignKey: "teamId2", as: "team2" });

module.exports = MatchRating;
