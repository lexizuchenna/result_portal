const express = require("express");
const router = express.Router();

const {
  adminLogin,
  viewAdminPage,
  forgetPasswordPage,
  resetPass,
  viewTeacherPage,
  adminRedirect,
  teacherLogin,
  teacherRedirect,
} = require("../controllers/loginController");

const { isAdminLoggedOut, isTeacherLoggedOut, checkAdmin, checkTeacher } = require("../middlewares/auth");

router.get("/admin", isAdminLoggedOut, viewAdminPage);
router.get("/forgot-password", isAdminLoggedOut, forgetPasswordPage);
router.get("/teacher", isTeacherLoggedOut, viewTeacherPage);

router.post('/admin', checkAdmin, adminLogin, adminRedirect)
router.post('/forgot-password', isAdminLoggedOut, resetPass)
router.post('/teacher', checkTeacher, teacherLogin, teacherRedirect)

module.exports = router;
