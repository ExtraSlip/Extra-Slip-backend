const express = require("express");
const { QuizController } = require("../../controllers/admin");
const { verifyAdminToken } = require("../../middleware");
const { QuizValidation } = require("../../validations/QuizValidation");
const { upload } = require("../../helpers");
const router = express.Router();

router.get("/", verifyAdminToken([]), QuizController.index);
router.post(
  "/",
  verifyAdminToken([]),
  upload.single("image"),
  QuizValidation,
  QuizController.add
);
router.put(
  "/:id",
  verifyAdminToken([]),
  upload.single("image"),
  QuizValidation,
  QuizController.update
);
router.delete("/:id", verifyAdminToken([]), QuizController.deleteQuiz);

module.exports = router;
