const express = require("express");
const { AuthController } = require("../../controllers/api");
const {
  RegisterUserValidation,
  LoginValidation,
} = require("../../validations/AuthValidation");

const router = express.Router();

router.post("/login", LoginValidation, AuthController.login);
router.post("/register", RegisterUserValidation, AuthController.register);

module.exports = router;
