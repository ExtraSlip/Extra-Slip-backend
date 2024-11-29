const { DataTypes } = require("sequelize");
const { db } = require("../utils");

const Setting = db.define("settings", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = Setting;
