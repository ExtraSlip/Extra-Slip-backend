const { DataTypes } = require("sequelize");
const { db } = require("../utils");
const Quiz = require("./Quiz");

const Question = db.define("questions", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  quizId: {
    type: DataTypes.INTEGER,
    references: {
      model: "quizzes",
      key: "id",
    },
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  optionA: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  optionB: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  optionC: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  optionD: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  answerReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  correctAnswer: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
});

Quiz.hasMany(Question, { foreignKey: "quizId" });
Question.belongsTo(Quiz, { foreignKey: "quizId" });

module.exports = Question;
