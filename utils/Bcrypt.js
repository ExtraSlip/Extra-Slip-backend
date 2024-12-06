const crypto = require("crypto");
const hashString = (str) => {
  console.log(str);
  const hashedString = crypto.createHash("sha256").update(str).digest("hex");
  return hashedString;
};

module.exports = {
  hashString,
};
