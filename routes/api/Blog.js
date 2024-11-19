const express = require("express");
const { BlogController } = require("../../controllers/api");
const {
  CommentValidation,
  BookmarkValidation,
} = require("../../validations/BlogValidation");
const { verifyToken } = require("../../middleware");

const router = express.Router();

router.get("/", BlogController.index);
router.get("/relatedBlogs", BlogController.relatedBlogs);
router.post(
  "/comments",
  verifyToken,
  CommentValidation,
  BlogController.addComment
);
router.get("/comments/:blogId", BlogController.getComments);
router.post("/likes/:blogId", verifyToken, BlogController.addLike);
router.post(
  "/bookmarks/toggle",
  verifyToken,
  BookmarkValidation,
  BlogController.toggleBookmark
);
router.get("/:id", BlogController.get);

module.exports = router;
