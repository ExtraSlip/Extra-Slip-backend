const { DataTypes } = require("sequelize");
const { db } = require("../utils");
const Admin = require("./Admin");

const Player = db.define("players", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dob: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  birthPlace: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  specialty: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  battingStyle: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bowlingStyle: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  battingStrength: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bowlingStrength: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  about: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  stats: {
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

Admin.hasMany(Player, { foreignKey: "createdBy" });
Player.belongsTo(Admin, { foreignKey: "createdBy" });

module.exports = Player;
