const { DataTypes } = require("sequelize");
const { db } = require("../utils");
const { RoleType, RegisterStep } = require("../constants/Constants");
const MenuPermission = require("./MenuPermission");

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
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  verificationToken: {
    type: DataTypes.STRING,
    allowNull: true,
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
  badge: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  stamp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  registerStep: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: RegisterStep.CREATED,
  },
});

Admin.hasMany(MenuPermission, { foreignKey: "userId" })
MenuPermission.belongsTo(Admin, { foreignKey: "userId" });

module.exports = Admin;
