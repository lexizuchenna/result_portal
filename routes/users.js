const express = require("express");
const router = express.Router();
const {isAdminLoggedOut, isTeacherLoggedIn, isAdminLoggedIn} = require('../middlewares/auth')
const { validateUser } = require("../middlewares/userValidator");
const {
  viewAdmin,
  registerTeacher,
  viewAdminSetting,
  viewAdminTeachers,
  deleteTeacher,
  viewRegTeachers,
  changeAdminPassword,

  viewTeacher,
  generateResult,
  generateResults,
  setRecord,
  getRecord,
  viewResults,
  sendResult,

  logout,
} = require("../controllers/usersController");

router.get("/admin", isAdminLoggedIn, viewAdmin);
router.get("/admin/register-teachers", isAdminLoggedIn, viewRegTeachers);
router.get("/admin/teachers", isAdminLoggedIn, viewAdminTeachers);
router.get('/admin/setting', isAdminLoggedIn, viewAdminSetting)

router.post("/admin/register-teachers", isAdminLoggedIn, validateUser, registerTeacher);
router.post('/admin/changePassword', isAdminLoggedIn, changeAdminPassword)
router.post("/admin/delete-teacher", isAdminLoggedIn, deleteTeacher);

router.get("/teacher", isTeacherLoggedIn, viewTeacher);
router.get('/teacher/generate-results', isTeacherLoggedIn, generateResult)
router.get('/teacher/results', isTeacherLoggedIn, viewResults)

router.post('/teacher/set-record', isTeacherLoggedIn, setRecord)
router.post('/teacher/generate-result', isTeacherLoggedIn, generateResults)
router.post('/teacher/send-result', isTeacherLoggedIn, sendResult)
router.post('/api/teacher/get-record', isTeacherLoggedIn, getRecord)

router.get("/logout", logout);

module.exports = router; 
