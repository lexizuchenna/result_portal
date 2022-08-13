const express = require("express");
const router = express.Router();
const {viewHome} = require("../controllers/indexController");

const { isAdminLoggedOut,isTeacherLoggedOut } = require("../middlewares/auth");

router.get("/", isAdminLoggedOut || isTeacherLoggedOut, viewHome);

module.exports = router;