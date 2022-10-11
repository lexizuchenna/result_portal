const express = require("express");
const router = express.Router();

const { viewHome } = require("../controllers/indexController");
const { isUsersLoggedOut } = require("../middlewares/auth");

router.get("/", isUsersLoggedOut, viewHome);

module.exports = router;
