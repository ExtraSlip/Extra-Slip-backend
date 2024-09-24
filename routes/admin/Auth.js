const express = require("express");
const { AuthController } = require("../../controllers/admin");
const { LoginValidation } = require("../../validations/AuthValidation");
const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", LoginValidation, AuthController.login);

module.exports = router;
