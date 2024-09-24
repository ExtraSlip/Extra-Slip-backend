const express = require("express");
const { QuizController } = require("../../controllers/admin");
const { verifyAdminToken } = require("../../middleware");
const { QuizValidation } = require("../../validations/QuizValidation");
const router = express.Router();

router.get("/", verifyAdminToken, QuizController.index);
router.post("/", verifyAdminToken, QuizValidation, QuizController.add);
router.put("/:id", verifyAdminToken, QuizValidation, QuizController.update);
router.delete("/:id", verifyAdminToken, QuizController.deleteQuiz);

module.exports = router;
