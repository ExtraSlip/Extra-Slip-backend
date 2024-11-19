const envCredential = require("../../config");
const { error, success } = require("../../handlers");
const { User } = require("../../models");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { generateToken } = require("../../utils/Common");
const genSalt = 10;
const SECRET_KEY = envCredential.SECRET_KEY;

const login = async (req, res) => {
  try {
    let payload = req.body;
    let user = await User.findOne({
      where: {
        email: payload.email,
      },
    });
    if (!user) {
      return success(res, {
        status: false,
        msg: "Please enter valid credential.",
      });
    }
    const isPasswordValid = await bcrypt.compare(
      payload?.password,
      user.password
    );
    if (!isPasswordValid) {
      return success(res, {
        status: false,
        msg: "Please enter valid credential.",
      });
    }
    const accessToken = await generateToken({ id: user.id, SECRET_KEY });
    delete user.dataValues.password;
    return success(res, {
      status: true,
      msg: "User logged in successfully!!",
      data: [{ user, accessToken }],
    });
  } catch (err) {
    console.log(err);
    return error(res, {
      msg: "Something went wrong",
      error: err,
    });
  }
};

module.exports = {
  login,
};
