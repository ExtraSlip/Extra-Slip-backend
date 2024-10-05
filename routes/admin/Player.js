const express = require("express");
const { PlayerController } = require("../../controllers/admin");
const { verifyAdminToken } = require("../../middleware");
const { PlayerValidation } = require("../../validations/PlayerValidation");
const { upload } = require("../../helpers");
const router = express.Router();

router.get("/", verifyAdminToken, PlayerController.index);
router.post(
  "/",
  verifyAdminToken,
  upload.single("stats"),
  PlayerValidation,
  PlayerController.add
);

router.put(
  "/:id",
  verifyAdminToken,
  upload.single("stats"),
  PlayerValidation,
  PlayerController.update
);

router.delete("/:id", verifyAdminToken, PlayerController.deletePlayer);

module.exports = router;
