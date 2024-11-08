const { DataTypes, Sequelize } = require("sequelize");
const { db } = require("../utils");
const MenuList = require("./MenuList");

const ChildMenuList = db.define("childmenu", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  parentId: {
    type: DataTypes.INTEGER,
    references: {
      model: "menulist",
      key: "id",
    },
  },
  label: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  menuPath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},{
    tableName:'childmenu'
});

ChildMenuList.belongsTo(MenuList, { foreignKey: "parentId" });
MenuList.hasMany(ChildMenuList, { foreignKey: "parentId" });

module.exports = ChildMenuList;
