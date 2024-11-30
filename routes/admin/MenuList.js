const express = require("express");

const { MenuController } = require("../../controllers/admin");
const { verifyAdminToken } = require("../../middleware");
const { MenuValidation } = require("../../validations/MenuValidation");
const { RoleType } = require("../../constants/Constants");
const router = express.Router();

router.post(
  "/",
  verifyAdminToken([RoleType.SUPERADMIN]),
  MenuValidation,
  MenuController.add
);
router.put(
  "/:id",
  verifyAdminToken([RoleType.SUPERADMIN]),
  MenuValidation,
  MenuController.update
);
router.get("/", verifyAdminToken([]), MenuController.get);
router.get("/sidebar", verifyAdminToken([]), MenuController.getSidebar);

module.exports = router;
