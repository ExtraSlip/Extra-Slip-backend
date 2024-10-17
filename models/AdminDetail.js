const { DataTypes } = require("sequelize");
const { db } = require("../utils");
const Admin = require("./Admin");
const Player = require("./Player");
const Team = require("./Team");

const AdminDetail = db.define("adminDetails", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  adminId: {
    type: DataTypes.INTEGER,
    references: {
      model: "admins",
      key: "id",
    },
    allowNull: false,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tier: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dob: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  education: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  experience: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  favoriteSport: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  favoriteTeam: {
    type: DataTypes.INTEGER,
    references: {
      model: "teams",
      key: "id",
    },
    allowNull: true,
  },
  favoriteAthlete: {
    type: DataTypes.INTEGER,
    references: {
      model: "players",
      key: "id",
    },
    allowNull: true,
  },
});

Admin.hasMany(AdminDetail, { foreignKey: "adminId" });
AdminDetail.belongsTo(Admin, { foreignKey: "adminId" });
Team.hasMany(AdminDetail, { foreignKey: "favoriteTeam" });
AdminDetail.belongsTo(Team, { foreignKey: "favoriteTeam" });
Player.hasMany(AdminDetail, { foreignKey: "favoriteAthlete" });
AdminDetail.belongsTo(Player, { foreignKey: "favoriteAthlete" });

module.exports = AdminDetail;
