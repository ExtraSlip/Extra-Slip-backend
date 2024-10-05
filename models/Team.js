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
