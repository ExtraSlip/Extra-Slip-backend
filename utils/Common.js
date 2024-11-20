const jwt = require("jsonwebtoken");
const { config } = require("dotenv");
config();
const env = process.env.ENV;

const getReqInformation = (req) => {
  const protocol = env == "dev" ? "http" : "https";
  const currentUrl = protocol + "://" + req.get("host") + req.originalUrl;
  let endpointArr = req.originalUrl?.split("/");
  let endpoint = endpointArr[endpointArr.length - 1].split("?")[0];
  const baseUrl = protocol + "://" + req.get("host");
  return {
    endPoint: endpoint,
    fullUrl: currentUrl,
    baseUrl: baseUrl,
  };
};

const generateToken = async (data) => {
  const accessToken = jwt.sign(
    {
      id: data.id,
    },
    data.SECRET_KEY
  );

  return accessToken;
};

const getPageAndOffset = (pageNo, limit) => {
  pageNo = pageNo ? pageNo : 1;
  limit = limit ? limit : 10;
  return { offset: parseInt((pageNo - 1) * limit), limit: parseInt(limit) };
};

const generateRandomPassword = (length) => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@$&";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  return password;
};

module.exports = {
  getReqInformation,
  generateToken,
  generateRandomPassword,
  getPageAndOffset,
};
