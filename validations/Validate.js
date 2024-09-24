const respHandler = require("../handlers");

const Validate = async (req, res, next, schema) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (err) {
    return respHandler.error(res, {
      msg: err.details[0].message,
      error: err.details,
      statuscode: 400,
    });
  }
};

module.exports = {
  Validate,
};
