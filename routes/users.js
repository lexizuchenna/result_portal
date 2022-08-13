const express = require("express");
const router = express.Router();
const {isAdminLoggedOut, isTeacherLoggedOut, isAdminLoggedIn} = require('../middlewares/auth')
const { validateUser } = require("../middlewares/userValidator");
const {
  viewAdmin,
  registerTeacher,
  viewAdminSetting,
  viewRegTeachers,
  viewTeacher,
  changeAdminPassword,
  logout,
} = require("../controllers/usersController");

router.get("/admin", isAdminLoggedIn, viewAdmin);
router.get("/admin/register-teachers", isAdminLoggedIn, viewRegTeachers);
router.post("/admin/register-teachers", validateUser, registerTeacher);
router.get('/admin/setting', viewAdminSetting)
router.post('/admin/changePassword', changeAdminPassword)

router.get("/teacher", isTeacherLoggedOut, viewTeacher);

router.get("/logout", logout);

module.exports = router; 
