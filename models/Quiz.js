const { DataTypes } = require("sequelize");
const { db } = require("../utils");

const Quiz = db.define("quizzes", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shortDescription: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Quiz;
