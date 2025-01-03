const express = require("express");
const router = express.Router();

router.use("/", require("./Auth"));
router.use("/blogs", require("./Blog"));
router.use("/users", require("./User"));
router.use("/players", require("./Player"));
router.use("/siteMaps", require("./SiteMap"));

module.exports = router;
