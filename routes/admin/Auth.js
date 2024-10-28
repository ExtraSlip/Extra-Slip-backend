const express = require("express");
const { AuthController } = require("../../controllers/admin");
const { LoginValidation } = require("../../validations/AuthValidation");
const {
  ChangePasswordValidation,
} = require("../../validations/UserValidation");
const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", LoginValidation, AuthController.login);
router.put(
  "/changePassword",
  ChangePasswordValidation,
  AuthController.changePassword
);

module.exports = router;
