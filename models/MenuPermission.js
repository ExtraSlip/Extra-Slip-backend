// MenuPermission.js

const { DataTypes } = require("sequelize");
const { db } = require("../utils");
const MenuList = require("./MenuList");
const Admin = require("./Admin");


const MenuPermission = db.define("menupermission", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  menuId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: MenuList,
      key: "id",
    },
    onDelete: "NO ACTION",
    // onUpdate: "CASCADE",
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false, 
    references: {
      model: Admin,
      key: "id",
    },
    onDelete: "CASCADE",
    // onUpdate: "CASCADE",
  },
});

MenuPermission.belongsTo(MenuList, { foreignKey: "menuId" });


module.exports = MenuPermission;