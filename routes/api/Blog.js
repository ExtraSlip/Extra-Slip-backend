const express = require("express");
const { BlogController } = require("../../controllers/api");

const router = express.Router();

router.get("/", BlogController.index);
router.get("/relatedBlogs", BlogController.relatedBlogs);
router.get("/:id", BlogController.get);

module.exports = router;
