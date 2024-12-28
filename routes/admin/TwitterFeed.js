const express = require("express");
const { TwitterFeedController } = require("../../controllers/admin");
const { verifyAdminToken } = require("../../middleware");
const { upload } = require("../../helpers");
const {
  TwitterFeedValidation,
} = require("../../validations/TwitterFeedValidation");
const router = express.Router();

router.get("/", verifyAdminToken([]), TwitterFeedController.index);
router.post(
  "/",
  verifyAdminToken([]),
  TwitterFeedValidation,
  TwitterFeedController.addUpdate
);
router.delete(
  "/:id",
  verifyAdminToken([]),
  TwitterFeedController.deleteTwitterFeed
);

module.exports = router;
