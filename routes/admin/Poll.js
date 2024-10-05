const express = require("express");
const { PollController } = require("../../controllers/admin");
const { verifyAdminToken } = require("../../middleware");
const { PollValidation } = require("../../validations/PollValidation");
const { upload } = require("../../helpers");
const router = express.Router();

router.get("/", verifyAdminToken, PollController.index);
router.post(
  "/",
  verifyAdminToken,
  upload.fields([{ name: "pollOptionImages", maxCount: 12 }]),
  PollValidation,
  PollController.add
);
router.put(
  "/:id",
  verifyAdminToken,
  upload.fields([{ name: "pollOptionImages", maxCount: 12 }]),
  PollValidation,
  PollController.update
);
router.delete("/:id", verifyAdminToken, PollController.deletePoll);
router.delete(
  "/pollOptions/:id",
  verifyAdminToken,
  PollController.deletePollOption
);

router.get("/pollOptions/:id", verifyAdminToken, PollController.getPollOptions);

module.exports = router;
