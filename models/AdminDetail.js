const { DataTypes } = require("sequelize");
const { db } = require("../utils");
const Admin = require("./Admin");
const Player = require("./Player");
const Team = require("./Team");

const AdminDetail = db.define("adminDetails", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  adminId: {
    type: DataTypes.INTEGER,
    references: {
      model: Admin,
      key: "id",
    },
    allowNull: false,
    unique: true,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tier: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dob: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  education: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  experience: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  favoriteSport: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  favoriteTeam: {
    type: DataTypes.INTEGER,
    allowNull: true,
    onDelete: "SET NULL", // Ensure this matches your database's foreign key setup
    onUpdate: "CASCADE",
  },
  favoriteAthlete: {
    type: DataTypes.INTEGER,
    allowNull: true,
    onDelete: "SET NULL", // Ensure this matches your database's foreign key setup
    onUpdate: "CASCADE",
  },
  facebookLink: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  twitterLink: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  linkedinLink: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  instagramLink: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  youtubeLink: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  threadLink: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  pininterestLink: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  discordLink: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Define associations
Admin.hasMany(AdminDetail, { foreignKey: "adminId" });
AdminDetail.belongsTo(Admin, { foreignKey: "adminId" });

module.exports = AdminDetail;