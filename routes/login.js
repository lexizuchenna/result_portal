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

const { isAdminLoggedOut, isTeacherLoggedOut } = require("../middlewares/auth");

router.get("/admin", isAdminLoggedOut, viewAdminPage);
router.get("/teacher", isTeacherLoggedOut, viewTeacherPage);

router.post('/admin', adminLogin, adminRedirect)
router.post('/teacher', teacherLogin, teacherRedirect)

module.exports = router;
