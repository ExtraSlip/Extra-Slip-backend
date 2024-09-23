const { config } = require("dotenv");
config();
let envCredential = require("./Credential");
const ENV = process.env.ENV || "dev";
envCredential = envCredential[ENV];

module.exports = envCredential;
