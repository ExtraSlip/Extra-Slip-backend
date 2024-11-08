const { error, success } = require("../../handlers");
const { Admin, AdminDetail } = require("../../models");
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
    const data = await AdminDetail.findOne({ where: { adminId: admin.id } });
    delete admin.dataValues.password;
    return success(res, {
      status: true,
      msg: "Admin logged in successfully!!",
      data: [{ admin, accessToken, isProfileSetup: data ? true : false }],
    });
  } catch (err) {
    console.log(err);
    return error(res, {
      msg: "Something went wrong",
      error: err,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const payload = req.body;
    let authorization = req.header("Authorization");
    if (!authorization || !authorization?.includes("Bearer")) {
      return error(res, {
        msg: "Please provide valid token!!",
      });
    }
    authorization = authorization.split(" ")[1];
    let admin = await Admin.findOne({
      where: {
        verificationToken: authorization,
      },
    });
    if (!admin) {
      return error(res, {
        msg: "Invalid link or Link expired!!",
      });
    }
    const hash = await bcrypt.hash(payload.password, 10);
    admin.password = hash;
    admin.verificationToken = null;
    await admin.save();
    return success(res, {
      msg: "Password changed successfully!!",
      data: [],
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
  changePassword,
};
