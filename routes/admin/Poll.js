const express = require("express");
const { PollController } = require("../../controllers/admin");
const { verifyAdminToken } = require("../../middleware");
const { PollValidation } = require("../../validations/PollValidation");
const router = express.Router();

router.get("/", verifyAdminToken, PollController.index);
router.post("/", verifyAdminToken, PollValidation, PollController.add);
router.put("/:id", verifyAdminToken, PollValidation, PollController.update);
router.delete("/:id", verifyAdminToken, PollController.deletePoll);

module.exports = router;
