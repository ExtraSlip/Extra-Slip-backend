const express = require("express");
const { TeamController } = require("../../controllers/admin");
const { verifyAdminToken } = require("../../middleware");
const { TeamValidation } = require("../../validations/TeamValidation");
const { upload } = require("../../helpers");
const router = express.Router();

router.get("/", verifyAdminToken([]), TeamController.index);
router.post(
  "/",
  verifyAdminToken([]),
  upload.single("image"),
  TeamValidation,
  TeamController.add
);
router.put(
  "/:id",
  verifyAdminToken([]),
  upload.single("image"),
  TeamValidation,
  TeamController.update
);
router.delete("/:id", verifyAdminToken([]), TeamController.deleteTeam);
router.get("/:id", verifyAdminToken([]), TeamController.getById);

module.exports = router;
