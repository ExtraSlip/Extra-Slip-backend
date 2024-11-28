const { DataTypes } = require("sequelize");
const { db } = require("../utils");
const Admin = require("./Admin");
const Category = require("./Category");
const { BlogStatus } = require("../constants/Constants");

const Blog = db.define(
  "blogs",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: "categories",
        key: "id",
      },
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    subTitle: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    featuredImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: BlogStatus.DRAFT,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      references: {
        model: "admins",
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    paranoid: true,
    timestamps: true,
  }
);

Admin.hasMany(Blog, { foreignKey: "createdBy" });
Blog.belongsTo(Admin, { foreignKey: "createdBy" });

Category.hasMany(Blog, { foreignKey: "categoryId" });
Blog.belongsTo(Category, { foreignKey: "categoryId" });

module.exports = Blog;
