const express = require("express");
const { AuthController } = require("../../controllers/api");
const { RegisterValidation } = require("../../validations/AuthValidation");

const router = express.Router();

router.post("/register", RegisterValidation, AuthController.register);

module.exports = router;
