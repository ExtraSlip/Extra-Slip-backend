const { DataTypes } = require("sequelize");
const { db } = require("../utils");

const MenuList = db.define("menulist", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  hasChild: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  label: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  menuPath: {
    type: DataTypes.STRING,
    allowNull: true,
  },
},{
    tableName: 'menulist'
});


module.exports = MenuList;