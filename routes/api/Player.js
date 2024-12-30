const express = require("express");
const { PlayerController } = require("../../controllers/api");

const router = express.Router();

router.get("/moreInfo/:slug", PlayerController.moreInfo);
router.get("/getBlogs/:slug", PlayerController.getBlogs);
router.get(
  "/getTagInfoByQuickLinkSlug/:slug",
  PlayerController.getTagInfoByQuickLinkSlug
);
router.get("/:slug", PlayerController.getBySlug);

module.exports = router;
