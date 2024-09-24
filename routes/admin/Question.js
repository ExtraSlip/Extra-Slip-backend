const express = require("express");
const { QuestionController } = require("../../controllers/admin");
const { verifyAdminToken } = require("../../middleware");
const { QuestionValidation } = require("../../validations/QuestionValidation");
const router = express.Router();

router.get("/:quizId", verifyAdminToken, QuestionController.index);
router.post("/", verifyAdminToken, QuestionValidation, QuestionController.add);
router.put(
  "/:id",
  verifyAdminToken,
  QuestionValidation,
  QuestionController.update
);
router.delete("/:id", verifyAdminToken, QuestionController.deleteQuestion);

module.exports = router;
