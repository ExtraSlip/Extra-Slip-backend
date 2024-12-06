const crypto = require("crypto");
const hashString = (str) => {
  console.log(str);
  const hashedString = crypto.createHash("sha256").update(str).digest("hex");
  console.log(
    crypto
      .createHash("sha256")
      .update("/articles/category-1/415379284500-test")
      .digest("hex")
  );
  return hashedString;
};

module.exports = {
  hashString,
};
