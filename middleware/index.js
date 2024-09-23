const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { error } = require("../handlers");
const envCredential = require("../config");
const SECRET_KEY = envCredential.SECRET_KEY;

const verifyToken = async (req, res, next) => {
  console.log(req.headers["authorization"]);
  let token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.headers["authorization"] ||
    req.headers["Authorization"];

  if (!token) {
    return error(res, {
      status: false,
      msg: "A token is required for authentication",
      statuscode: 499,
    });
  }

  token = token.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["updatedAt", "password"] },
      raw: true,
    });

    if (user?.isBlocked) {
      return error(res, {
        status: false,
        msg: "Your account is blocked please contact admin",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return error(res, {
      status: false,
      msg: "Invalid Token",
      error: [err.message],
      statuscode: 401,
    });
  }
};

module.exports = {
  verifyToken,
};
