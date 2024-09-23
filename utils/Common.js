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

module.exports = {
  getReqInformation,
  generateToken,
};
