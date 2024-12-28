const express = require("express");
const { UserController } = require("../../controllers/admin");
const { verifyAdminToken, verifyToken } = require("../../middleware");
const {
  UserValidation,
  UpdateUserValidation,
  UpdateUserInfoValidation,
} = require("../../validations/UserValidation");
const { upload } = require("../../helpers");
const router = express.Router();

router.get("/single/:id?", verifyAdminToken([]), UserController.index);
router.post("/", verifyAdminToken([]), UserValidation, UserController.add);
router.put(
  "/:id",
  verifyAdminToken([]),
  UpdateUserValidation,
  UserController.update
);
router.delete("/:id", verifyAdminToken([]), UserController.deleteAdmin);
router.get("/userinfo", verifyAdminToken([]), UserController.userInfo);
router.post(
  "/userinfo",
  verifyAdminToken([]),
  upload.single("image"),
  UpdateUserInfoValidation,
  UserController.updateUserInfo
);

router.put(
  "/userinfo/:adminId",
  verifyAdminToken([]),
  upload.single("image"),
  UpdateUserInfoValidation,
  UserController.updateUserInfoByAdmin
);

router.get("/all", verifyAdminToken([]), UserController.getUserList);

module.exports = router;
