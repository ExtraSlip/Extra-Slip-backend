const express = require("express");
const { MatchRatingController } = require("../../controllers/admin");
const { verifyAdminToken } = require("../../middleware");
const {
  MatchRatingValidation,
} = require("../../validations/MatchRatingValidation");
const { upload } = require("../../helpers");
const router = express.Router();

router.get(
  "/",
  verifyAdminToken,
  upload.single("image"),
  MatchRatingController.index
);
router.post(
  "/",
  verifyAdminToken,
  upload.single("image"),
  MatchRatingValidation,
  MatchRatingController.add
);
router.put(
  "/:id",
  verifyAdminToken,
  upload.single("image"),
  MatchRatingValidation,
  MatchRatingController.update
);
router.delete(
  "/:id",
  verifyAdminToken,
  MatchRatingController.deleteMatchRating
);

module.exports = router;
