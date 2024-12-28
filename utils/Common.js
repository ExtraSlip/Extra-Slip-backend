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
const getRandomNumber = (n) => {
  const start = Math.pow(10, n - 1);
  const end = Math.pow(10, n) - 1;
  return Math.floor(Math.random() * (end - start + 1)) + start;
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

const createSlug = (str) => {
  let slug = str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
  let slugArr = slug.split("-");
  slugArr = slugArr.filter((e) => e != "");
  slug = slugArr.join("-");
  return slug;
};

module.exports = {
  getReqInformation,
  generateToken,
  generateRandomPassword,
  getPageAndOffset,
  getRandomNumber,
  createSlug,
};
