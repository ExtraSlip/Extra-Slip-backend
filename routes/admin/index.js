const express = require("express");
const router = express.Router();

router.use("/", require("./Auth"));
router.use("/quizzes", require("./Quiz"));
router.use("/polls", require("./Poll"));
router.use("/questions", require("./Question"));
router.use("/players", require("./Player"));
router.use("/teams", require("./Team"));
router.use("/matchRatings", require("./MatchRating"));
router.use("/tags", require("./Tag"));
router.use("/categories", require("./Category"));

module.exports = router;
