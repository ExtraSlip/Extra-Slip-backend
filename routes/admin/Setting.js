const express = require("express");
const { SettingController } = require("../../controllers/admin");
const { verifyAdminToken } = require("../../middleware");
const { RoleType } = require("../../constants/Constants");
const { SettingValidation } = require("../../validations/SettingValidation");
const { upload } = require("../../helpers");
const router = express.Router();

router.get("/", verifyAdminToken([]), SettingController.index);
router.post(
  "/",
  verifyAdminToken([RoleType.SUPERADMIN]),
  upload.fields([{ name: "siteIcon", maxCount: 1 }]),
  SettingValidation,
  SettingController.addUpdate
);

module.exports = router;
