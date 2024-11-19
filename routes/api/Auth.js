const express = require("express");
const { AuthController } = require("../../controllers/api");
const { LoginValidation } = require("../../validations/AuthValidation");

const router = express.Router();

router.post("/login", LoginValidation, AuthController.login);

module.exports = router;
