const express = require("express");
const { PollController } = require("../../controllers/admin");
const { verifyAdminToken } = require("../../middleware");
const { PollValidation } = require("../../validations/PollValidation");
const { upload } = require("../../helpers");
const router = express.Router();

router.get("/", verifyAdminToken([]), PollController.index);
router.post(
  "/",
  verifyAdminToken([]),
  upload.fields([
    { name: "pollOptionImage1", maxCount: 1 },
    { name: "pollOptionImage2", maxCount: 1 },
    { name: "pollOptionImage3", maxCount: 1 },
    { name: "pollOptionImage4", maxCount: 1 },
    { name: "pollOptionImage5", maxCount: 1 },
    { name: "pollOptionImage6", maxCount: 1 },
    { name: "pollOptionImage7", maxCount: 1 },
    { name: "pollOptionImage8", maxCount: 1 },
    { name: "pollOptionImage9", maxCount: 1 },
    { name: "pollOptionImage10", maxCount: 1 },
    { name: "pollOptionImage11", maxCount: 1 },
  ]),
  PollValidation,
  PollController.add
);
router.put(
  "/:id",
  verifyAdminToken([]),
  upload.fields([
    { name: "pollOptionImage1", maxCount: 1 },
    { name: "pollOptionImage2", maxCount: 1 },
    { name: "pollOptionImage3", maxCount: 1 },
    { name: "pollOptionImage4", maxCount: 1 },
    { name: "pollOptionImage5", maxCount: 1 },
    { name: "pollOptionImage6", maxCount: 1 },
    { name: "pollOptionImage7", maxCount: 1 },
    { name: "pollOptionImage8", maxCount: 1 },
    { name: "pollOptionImage9", maxCount: 1 },
    { name: "pollOptionImage10", maxCount: 1 },
    { name: "pollOptionImage11", maxCount: 1 },
  ]),
  PollValidation,
  PollController.update
);
router.delete("/:id", verifyAdminToken([]), PollController.deletePoll);
router.delete(
  "/pollOptions/:id",
  verifyAdminToken([]),
  PollController.deletePollOption
);

router.get(
  "/pollOptions/:id",
  verifyAdminToken([]),
  PollController.getPollOptions
);

module.exports = router;
