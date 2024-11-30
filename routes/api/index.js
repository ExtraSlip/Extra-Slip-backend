const express = require("express");
const router = express.Router();

router.use("/", require("./Auth"));
router.use("/blogs", require("./Blog"));
router.use("/users", require("./User"));

module.exports = router;
