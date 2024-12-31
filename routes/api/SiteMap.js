const express = require("express");
const { SiteMapController } = require("../../controllers/api");

const router = express.Router();

router.get("/", SiteMapController.index);

module.exports = router;
