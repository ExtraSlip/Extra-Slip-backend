const express = require("express");
const { verifyAdminToken } = require("../../middleware");
const { upload } = require("../../helpers");
const { BlogValidation } = require("../../validations/BlogValidation");
const { BlogController } = require("../../controllers/admin");
const router = express.Router();

router.get("/updateHash", verifyAdminToken([]), BlogController.updateHash);
router.get("/", verifyAdminToken([]), BlogController.index);
router.get("/topicsList", verifyAdminToken([]), BlogController.topicsList);
router.post(
  "/",
  verifyAdminToken([]),
  upload.single("featuredImage"),
  BlogValidation,
  BlogController.add
);
router.put(
  "/:id",
  verifyAdminToken([]),
  upload.single("featuredImage"),
  BlogValidation,
  BlogController.update
);
router.delete("/:id", verifyAdminToken([]), BlogController.deleteBlog);

module.exports = router;
