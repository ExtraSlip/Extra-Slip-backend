const { DataTypes } = require("sequelize");
const { db } = require("../utils");
const Admin = require("./Admin");

const SocialLink = db.define("socialLinks", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  adminId: {
    type: DataTypes.INTEGER,
    references: {
      model: "admins",
      key: "id",
    },
    allowNull: false,
  },
  type: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Admin.hasMany(SocialLink, { foreignKey: "adminId" });
SocialLink.belongsTo(Admin, { foreignKey: "adminId" });

module.exports = SocialLink;
