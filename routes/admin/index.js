const express = require("express");
const router = express.Router();

router.use("/", require("./Auth"));
router.use("/quizzes", require("./Quiz"));
router.use("/polls", require("./Poll"));
router.use("/questions", require("./Question"));

module.exports = router;
