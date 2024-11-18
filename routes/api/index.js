const express = require("express");
const router = express.Router();

router.use("/", require("./Auth"));
router.use("/blogs", require("./Blog"));

module.exports = router;
