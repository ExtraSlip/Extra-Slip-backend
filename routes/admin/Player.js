const express = require("express");
const { PlayerController } = require("../../controllers/admin");
const { verifyAdminToken } = require("../../middleware");
const { PlayerValidation } = require("../../validations/PlayerValidation");
const { upload } = require("../../helpers");
const router = express.Router();

router.get("/", verifyAdminToken([]), PlayerController.index);
router.post(
  "/",
  verifyAdminToken([]),
  upload.fields([
    { name: "stats", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  PlayerValidation,
  PlayerController.add
);

router.put(
  "/:id",
  verifyAdminToken([]),
  upload.fields([
    { name: "stats", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  PlayerValidation,
  PlayerController.update
);

router.delete("/:id", verifyAdminToken([]), PlayerController.deletePlayer);

module.exports = router;
