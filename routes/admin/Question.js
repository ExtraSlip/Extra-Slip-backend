const express = require("express");
const { QuestionController } = require("../../controllers/admin");
const { verifyAdminToken } = require("../../middleware");
const { QuestionValidation } = require("../../validations/QuestionValidation");
const { upload } = require("../../helpers");
const router = express.Router();

router.get("/:quizId", verifyAdminToken([]), QuestionController.index);
router.post(
  "/",
  verifyAdminToken([]),
  upload.single("image"),
  QuestionValidation,
  QuestionController.add
);
router.put(
  "/:id",
  verifyAdminToken([]),
  upload.single("image"),
  QuestionValidation,
  QuestionController.update
);
router.delete("/:id", verifyAdminToken([]), QuestionController.deleteQuestion);

module.exports = router;
