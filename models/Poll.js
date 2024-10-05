const { DataTypes } = require("sequelize");
const { db } = require("../utils");
const Admin = require("./Admin");

const Poll = db.define("polls", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
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

Admin.hasMany(Poll, { foreignKey: "createdBy" });
Poll.belongsTo(Admin, { foreignKey: "createdBy" });

module.exports = Poll;
