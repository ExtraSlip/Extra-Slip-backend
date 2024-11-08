const { Op } = require("sequelize");
const { error, success } = require("../../handlers");
const { Admin, AdminDetail, MenuPermission } = require("../../models");
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
      include: [
        {
          model: AdminDetail,
          where: { adminId: req.params.id },
          required: false,
        },
        {
          model: MenuPermission,
          where: { userId: req.params.id },
          required: false,
        },
      ],
    });

    users = users.map(user => {
      const userJson = user.toJSON(); // Convert Sequelize instance to plain object
      userJson.menupermissions = userJson.menupermissions.map(permission => permission.menuId);
      return userJson;
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
    let { permission, ...payload } = req.body;
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
    payload["isActive"] = payload.isActive === "1" ? true : false;

    admin = await Admin.create(payload);
    const updatePermission = permission.map(async (item) => {
      await MenuPermission.create({
        userId: admin.id,
        menuId: item,
      });
    });

    let templatePath = path.join(
      process.cwd(),
      "views/emails/register.handlebars"
    );

    const html = await ejs.renderFile(templatePath, {
      name: payload.name,
      password,
      email: payload.email,
      role: payload.type,
      loginLink: `${envCredential.MAIL_BASE_URL}/set/password?token=${verificationToken}`,
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
    let { permission, ...payload } = req.body;
  
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

    const existingPermissions = await MenuPermission.findAll({
      where: { userId: req.params.id },
      attributes: ['menuId'],
    });

    const existingMenuIds = new Set(existingPermissions.map(permission => permission.menuId));
    const newMenuIdSet = new Set(permission);

    const menuIdsToAdd = [...newMenuIdSet].filter(id => !existingMenuIds.has(id));
    const menuIdsToRemove = [...existingMenuIds].filter(id => !newMenuIdSet.has(id));

    if (menuIdsToRemove.length > 0) {
      await MenuPermission.destroy({
        where: {
          userId: req.params.id,
          menuId: { [Op.in]: menuIdsToRemove },
        },
      });
    }

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

const updateUserInfo = async (req, res) => {
  try {
    const { id } = req.user;
    let payload = req.body;
    if (req.file.path) {
      payload["image"] = "/uploads/" + req.file?.filename;
    }
    const usermanagement = await AdminDetail.create({
      adminId: id,
      ...payload,
    });
    if (!usermanagement) {
      return error(res, {
        status: false,
        msg: "User not found",
        statuscode: 404,
      });
    }
    return success(res, {
      msg: "User fetched successfully dfdf",
      data: usermanagement,
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong!!",
      error: [err?.message],
    });
  }
};

const userInfo = async (req, res) => {
  try {
    const { id } = req.user;
    console.log('=-as=d-=as-d=asd=as-d=-d', id)
    const user = await Admin.findAll({
      where: { id: id },
      include: [
        {
          model: AdminDetail,
          where: { adminId: id },
          required: false,
        },
      ],
    });

    if (!user) {
      return error(res, {
        status: false,
        msg: "User not found",
        statuscode: 404,
      });
    }
    return success(res, {
      msg: "User fetched successfully dfdf",
      data: user,
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong!!",
      error: [err?.message],
    });
  }
};

const getUserList = async (req, res) => {
  try {
    const { page=1, limit=10, type } = req.query;
    const user = await Admin.findAll({
      where: {
        type: type ? type : null,
      },
      attributes: {
        exclude: ["password", "registerStep", "verificationToken"],
      },
      limit,
      offset: page ? (page - 1) * limit : 0,
    });
    return success(res, {
      data: user,
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong!!",
      error: [err?.message],
    });
  }
};

const deleteAll = async (req, res) => {
  try {
    const { id } = req.params;
    console.log({ id });
    const user = await Admin.destroy({
      where: {
        id,
      },
    });
    const admindetails = await AdminDetail.destroy({
      where: {
        adminId: id,
      },
    });
    return success(res, {
      data: { ...user, ...admindetails },
      msg: "User deleted successfully",
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong!!",
      error: [err?.message],
    });
  }
};

module.exports = {
  index,
  add,
  update,
  deleteAdmin,
  updateUserInfo,
  userInfo,
  getUserList,
  deleteAll,
};
