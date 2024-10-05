const { DataTypes } = require("sequelize");
const { db } = require("../utils");
const Poll = require("./Poll");

const PollOption = db.define("pollOptions", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pollId: {
    type: DataTypes.INTEGER,
    references: {
      model: "polls",
      key: "id",
    },
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Poll.hasMany(PollOption, { foreignKey: "pollId" });
PollOption.belongsTo(Poll, { foreignKey: "pollId" });

module.exports = PollOption;
