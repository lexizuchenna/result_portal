const express = require("express");
const router = express.Router();

const {
  adminLogin,
  viewAdminPage,
  viewTeacherPage,
  adminRedirect,
  teacherLogin,
  teacherRedirect,
} = require("../controllers/loginController");

const { isAdminLoggedOut, isTeacherLoggedOut, checkAdmin, checkTeacher } = require("../middlewares/auth");

router.get("/admin", isAdminLoggedOut, viewAdminPage);
router.get("/teacher", isTeacherLoggedOut, viewTeacherPage);

router.post('/admin', checkAdmin, adminLogin, adminRedirect)
router.post('/teacher', checkTeacher, teacherLogin, teacherRedirect)

module.exports = router;
