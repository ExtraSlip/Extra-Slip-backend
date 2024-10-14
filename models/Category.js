const { DataTypes } = require("sequelize");
const { db } = require("../utils");

const Category = db.define("categories", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  parentCategoryId: {
    type: DataTypes.INTEGER,
    references: {
      model: "categories",
      key: "id",
    },
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  categoryColor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  keyword: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  seoTitle: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  metaDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

Category.belongsTo(Category, {
  foreignKey: "parentCategoryId",
  as: "parentCategory",
});

module.exports = Category;
