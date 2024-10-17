const { DataTypes } = require("sequelize");
const { db } = require("../utils");
const { RoleType, RegisterStep } = require("../constants/Constants");

const Admin = db.define("admins", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: RoleType.SUPERADMIN,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  isBlocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  registerStep: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: RegisterStep.CREATED,
  },
});

module.exports = Admin;
