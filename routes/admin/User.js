const express = require("express");
const { UserController } = require("../../controllers/admin");
const { verifyAdminToken } = require("../../middleware");
const {
  UserValidation,
  UpdateUserValidation,
} = require("../../validations/UserValidation");
const router = express.Router();

router.get("/:id?", verifyAdminToken, UserController.index);
router.post("/", verifyAdminToken, UserValidation, UserController.add);
router.put(
  "/:id",
  verifyAdminToken,
  UpdateUserValidation,
  UserController.update
);
router.delete("/:id", verifyAdminToken, UserController.deleteAdmin);

module.exports = router;
