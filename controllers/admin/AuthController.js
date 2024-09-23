const { error } = require("../../handlers");

const register = async (req, res) => {
  try {
  } catch (err) {
    return error(res, {
      msg: "Something went wrong",
      error: err,
    });
  }
};

module.exports = {
  register,
};
