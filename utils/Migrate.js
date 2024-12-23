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
  Setting,
  TwitterFeed,
} = require("../models");
const { RoleType, RegisterStep } = require("../constants/Constants");
const { MenuSeeder } = require("../seeder");
const { Op } = require("sequelize");

sequelize
  .sync({ alter: true })
  .then(async () => {
    const hash = await bcrypt.hash("admin@12", 10);
    let obj = {
      name: "Admin",
      email: "admin@gmail.com",
      username: "admin",
      type: RoleType.ADMIN,
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
    const admins = await Admin.findAll({
      where: {
        image: {
          [Op.eq]: null,
        },
      },
    });
    const arr = admins.map((e) => e.id);
    let adminDetails = await AdminDetail.findAll({
      where: {
        image: {
          [Op.ne]: null,
        },
        adminId: {
          [Op.in]: arr,
        },
      },
    });
    await Promise.all(
      adminDetails.map(async (e) => {
        await Admin.update({ image: e.image }, { where: { id: e.adminId } });
      })
    );
    console.log("table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });
