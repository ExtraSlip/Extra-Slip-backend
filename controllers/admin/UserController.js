const { Op } = require("sequelize");
const { error, success } = require("../../handlers");
const { Admin, AdminDetail } = require("../../models");
const envCredential = require("../../config");
const sequelize = require("../../utils/Connection");
const { generateRandomPassword, generateToken } = require("../../utils/Common");
const bcrypt = require("bcrypt");
const { RegisterStep, RoleType } = require("../../constants/Constants");
const { sendEmail } = require("../../utils/sendMail");
const path = require("path");
const ejs = require("ejs");
const secret = "hdfhsgfer354jbjs$5#$%^";

const index = async (req, res) => {
  try {
    let query = {
      id: {
        [Op.ne]: req.user.id,
      },
    };
    if (req.params.id) {
      query = {
        id: req.params.id,
      };
    }
    let users = await Admin.findAll({
      where: query,
      attributes: [
        "name",
        "type",
        "email",
        "image",
        "isActive",
        "createdAt",
        "username",
        "badge",
        "stamp",
        "registerStep",
        "id",
        [sequelize.literal(`0`), "posts"],
        [sequelize.literal(`0`), "views"],
      ],
    });
    return success(res, {
      msg: "Users fetched successfully",
      data: users,
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong",
      error: [err?.message],
    });
  }
};

const add = async (req, res) => {
  try {
    let payload = req.body;
    let admin = await Admin.findOne({
      where: {
        email: payload.email,
      },
    });
    if (admin) {
      return error(res, {
        msg: "Email already registered!!",
      });
    }
    let username = await Admin.findOne({
      where: {
        username: payload.username,
      },
    });
    if (username) {
      return error(res, {
        msg: "Username already taken!!",
      });
    }
    payload["registerStep"] = RegisterStep.COMPLETED;
    if ([RoleType.FREELANCER, RoleType.AUTHOR].includes(payload.type)) {
      payload["registerStep"] = RegisterStep.CREATED;
    }
    let password = generateRandomPassword(8);
    const hash = await bcrypt.hash(password, 10);
    payload["password"] = hash;
    let verificationToken = await generateToken({
      id: payload.email,
      SECRET_KEY: secret,
    });
    payload["verificationToken"] = verificationToken;
    admin = await Admin.create(payload);
    let templatePath = path.join(
      process.cwd(),
      "views/emails/register.handlebars"
    );

    const html = await ejs.renderFile(templatePath, {
      name: payload.name,
      password,
      email: payload.email,
      role: payload.type,
      loginLink: `${envCredential.BASE_URL}/change-password?token=${verificationToken}`,
    });
    sendEmail({
      to: payload.email,
      subject: "Account Registration",
      html,
    });
    return success(res, {
      msg: "User created successfully!!",
      data: [admin],
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong!!",
      error: [err?.message],
    });
  }
};

const update = async (req, res) => {
  try {
    let payload = req.body;
    let admin = await Admin.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!admin) {
      return error(res, {
        msg: "User not found!!",
      });
    }

    await Admin.update(payload, {
      where: {
        id: req.params.id,
      },
    });
    let subject = "Account activation";
    let html = "";
    let templatePath = path.join(
      process.cwd(),
      "views/emails/account-status.handlebars"
    );
    let isSendEmail = false;
    if (admin.isBlocked != payload.isBlocked && payload.isBlocked) {
      html = await ejs.renderFile(templatePath, {
        name: admin.name,
        emailTitle: "Account Blocked",
        messageBody:
          "We regret to inform you that your account has been temporarily blocked due to unusual activity.",
        accountBlocked: true,
      });
      subject = "Account blocked";
      isSendEmail = true;
    } else if (admin.isActive != payload.isActive && payload.isActive) {
      html = await ejs.renderFile(templatePath, {
        name: admin.name,
        emailTitle: "Account Activated",
        messageBody:
          "Good news! Your account has been successfully activated. You can now access all the features.",
        accountBlocked: false,
      });
      subject = "Account activated";
      isSendEmail = true;
    }
    if (isSendEmail) {
      sendEmail({
        to: admin.email,
        subject: subject,
        html,
      });
    }

    return success(res, {
      msg: "User updated successfully!!",
      data: [],
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong!!",
      error: [err?.message],
    });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    let admin = await Admin.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!admin) {
      return error(res, {
        msg: "User not found!!",
      });
    }
    await AdminDetail.destroy({
      where: {
        adminId: req.params.id,
      },
    });
    await admin.destroy();

    return success(res, {
      msg: "User deleted successfully!!",
      data: [],
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong!!",
      error: [err?.message],
    });
  }
};

module.exports = { index, add, update, deleteAdmin };
