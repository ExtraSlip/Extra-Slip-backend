const express = require("express");
const { TeamController } = require("../../controllers/admin");
const { verifyAdminToken } = require("../../middleware");
const { TeamValidation } = require("../../validations/TeamValidation");
const router = express.Router();

router.get("/", verifyAdminToken, TeamController.index);
router.post("/", verifyAdminToken, TeamValidation, TeamController.add);
router.put("/:id", verifyAdminToken, TeamValidation, TeamController.update);
router.delete("/:id", verifyAdminToken, TeamController.deleteTeam);

module.exports = router;
