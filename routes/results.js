const express = require("express");

const { isTeacherLoggedIn, isAdminLoggedIn, isStudentLoggedIn } = require("../middlewares/auth");

const { viewResult } = require("../controllers/resultsController");

const router = express.Router();

router.get("/admin/view/:id", isAdminLoggedIn, viewResult);

router.get("/teacher/view/:id", isTeacherLoggedIn, viewResult);

// router.get("/student/view/:id", isStudentLoggedIn, viewResult);

module.exports = router;
