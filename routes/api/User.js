const express = require("express");
const { UserController } = require("../../controllers/api");

const router = express.Router();

router.get("/:id", UserController.get);
router.get("/recentArticles/:id", UserController.recentArticles);

module.exports = router;
