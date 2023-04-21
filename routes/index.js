const express = require("express");
const router = express.Router();

const { viewHome, viewAbout } = require("../controllers/indexController");
const { isUsersLoggedOut } = require("../middlewares/auth");

router.get("/", isUsersLoggedOut, viewHome);
router.get("/about-us", isUsersLoggedOut, viewAbout);

module.exports = router;
