const sequelize = require("./Connection");
const bcrypt = require("bcrypt");

const {
  User,
  Admin,
  Question,
  Quiz,
  Poll,
  PollOption,
  Player,
  MatchRating,
  Team,
  TeamPlayer,
  Tag,
  Category,
} = require("../models");
const { RoleType } = require("../constants/Constants");

sequelize
  .sync({ alter: true })
  .then(async () => {
    const hash = await bcrypt.hash("admin@12", 10);
    let obj = {
      name: "Admin",
      email: "admin@gmail.com",
      type: RoleType.SUPERADMIN,
      password: hash,
    };
    const [admin, created] = await Admin.findOrCreate({
      where: {
        email: obj.email,
      },
      defaults: {
        ...obj,
      },
    });
    console.log("table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });
