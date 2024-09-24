const { error, success } = require("../../handlers");
const { Admin } = require("../../models");
const { generateToken } = require("../../utils/Common");
const bcrypt = require("bcrypt");
const envCredential = require("../../config");
const SECRET_KEY = envCredential.SECRET_KEY;

const register = async (req, res) => {
  try {
  } catch (err) {
    return error(res, {
      msg: "Something went wrong",
      error: err,
    });
  }
};

const login = async (req, res) => {
  try {
    let payload = req.body;
    let admin = await Admin.findOne({
      where: {
        email: payload.email,
      },
    });
    if (!admin) {
      return success(res, {
        status: false,
        msg: "Please enter valid credential.",
      });
    }
    const isPasswordValid = await bcrypt.compare(
      payload?.password,
      admin.password
    );
    if (!isPasswordValid) {
      return success(res, {
        status: false,
        msg: "Please enter valid credential.",
      });
    }
    const accessToken = await generateToken({ id: admin.id, SECRET_KEY });
    delete admin.dataValues.password;
    return success(res, {
      status: true,
      msg: "Admin logged in successfully!!",
      data: [{ admin, accessToken }],
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
  register,
  login,
};
