const express = require("express");
const { CategoryController } = require("../../controllers/admin");
const { verifyAdminToken } = require("../../middleware");
const { upload } = require("../../helpers");
const { CategoryValidation } = require("../../validations/CategoryValidation");
const router = express.Router();

router.get("/", verifyAdminToken, CategoryController.index);
router.post(
  "/",
  verifyAdminToken,
  upload.single("image"),
  CategoryValidation,
  CategoryController.add
);
router.put(
  "/:id",
  verifyAdminToken,
  upload.single("image"),
  CategoryValidation,
  CategoryController.update
);
router.delete("/:id", verifyAdminToken, CategoryController.deleteCategory);

module.exports = router;
