const express = require("express");

const { MenuController } = require("../../controllers/admin");
const { verifyAdminToken } = require("../../middleware");
const router = express.Router();

router.post("/", MenuController.add);
router.get("/", verifyAdminToken, MenuController.get);
router.get("/sidebar", verifyAdminToken, MenuController.getsidebar);

module.exports = router