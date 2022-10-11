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

const {
  isUsersLoggedOut,
  checkAdmin,
  checkTeacher,
} = require("../middlewares/auth");

router.get("/admin", isUsersLoggedOut, viewAdminPage);
router.get("/forgot-password", isUsersLoggedOut, forgetPasswordPage);
router.get("/teacher", isUsersLoggedOut, viewTeacherPage);

router.post("/admin", checkAdmin, adminLogin, adminRedirect);
router.post("/forgot-password", isUsersLoggedOut, resetPass);
router.post("/teacher", checkTeacher, teacherLogin, teacherRedirect);

module.exports = router;
