const express = require("express");
const { PlayerController } = require("../../controllers/api");

const router = express.Router();

router.get("/moreInfo/:team", PlayerController.moreInfo);
router.get("/getBlogs/:slug", PlayerController.getBlogs);
router.get("/:slug", PlayerController.getBySlug);

module.exports = router;
