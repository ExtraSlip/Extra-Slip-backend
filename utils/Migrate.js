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
  AdminDetail,
  SocialLink,
  ChildMenuList,
  MenuList,
  MenuPermission,
  Blog,
  BlogBookmark,
  BlogComment,
  BlogTopic,
} = require("../models");
const { RoleType, RegisterStep } = require("../constants/Constants");
const { MenuSeeder } = require("../seeder");

sequelize
  .sync({ alter: true })
  .then(async () => {
    const hash = await bcrypt.hash("admin@12", 10);
    let obj = {
      name: "Admin",
      email: "admin@gmail.com",
      username: "admin",
      type: RoleType.SUPERADMIN,
      registerStep: RegisterStep.COMPLETED,
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
    const userHash = await bcrypt.hash("user@12", 10);
    let userObj = {
      userName: "demo_user",
      email: "demo@gmail.com",
      firstName: "Demo",
      lastName: "User",
      userType: "user",
      mobileNo: "1234567890",
      password: userHash,
    };
    const [user, userCreated] = await User.findOrCreate({
      where: {
        email: userObj.email,
      },
      defaults: {
        ...userObj,
      },
    });
    await MenuSeeder(admin.id);
    console.log("table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });
