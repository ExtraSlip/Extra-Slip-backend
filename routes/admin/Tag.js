const express = require("express");
const { TagController } = require("../../controllers/admin");
const { verifyAdminToken } = require("../../middleware");
const { upload } = require("../../helpers");
const { TagValidation } = require("../../validations/TagValidation");
const router = express.Router();

router.get("/", verifyAdminToken, TagController.index);
router.post(
  "/",
  verifyAdminToken,
  upload.single("image"),
  TagValidation,
  TagController.add
);
router.put(
  "/:id",
  verifyAdminToken,
  upload.single("image"),
  TagValidation,
  TagController.update
);
router.delete("/:id", verifyAdminToken, TagController.deleteTag);

module.exports = router;
