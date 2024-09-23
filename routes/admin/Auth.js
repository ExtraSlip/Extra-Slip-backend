const express = require("express");
const { AuthController } = require("../../controllers/admin");
const router = express.Router();

router.post("/register", AuthController.register);

module.exports = router;
