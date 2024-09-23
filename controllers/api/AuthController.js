const envCredential = require("../../config");
const { error, success } = require("../../handlers");
const { User } = require("../../models");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const genSalt = 10;
const SECRET_KEY = envCredential.SECRET_KEY;

const register = async (req, res) => {
  try {
    let payload = req.body;
    let user = await User.findOne({
      where: {
        email: payload?.email,
      },
    });
    if (user) {
      return error(res, {
        msg: "Email already registered. Please login",
      });
    }
    let checkUserName = await User.findOne({
      where: {
        userName: payload?.userName,
      },
    });
    if (checkUserName) {
      return error(res, {
        msg: "UserName already exists.",
      });
    }

    const hash = await bcrypt.hash(payload?.password, genSalt);
    payload["password"] = hash;

    user = await User.create(payload);
    const accessToken = await generateToken({ id: user.id, SECRET_KEY });
    delete user.dataValues.password;
    return success(res, {
      msg: "User created successfully!!",
      data: [{ user, accessToken }],
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong!!",
      error: [err.message],
    });
  }
};

module.exports = {
  register,
};
