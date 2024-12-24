const express = require("express");
const { PlayerController } = require("../../controllers/api");

const router = express.Router();

router.get("/morePlayers/:team", PlayerController.morePlayers);
router.get("/getBlogsByPlayer/:playerId", PlayerController.getBlogsAboutPlayer);
router.get("/:id", PlayerController.getById);

module.exports = router;
