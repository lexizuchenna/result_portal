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
  viewAdminResults,
  viewArchives,
  addMessage,
  editAdminResult,
  updateAdminResult,
  approve,
  changeAdminPassword,

  viewTeacher,
  generateResult,
  generateResults,
  editResult,
  updateResult,
  setRecord,
  getRecord,
  viewResults,
  sendResult,

  logout,
} = require("../controllers/usersController");

router.get("/admin", isAdminLoggedIn, viewAdmin);
router.get("/admin/register-teachers", isAdminLoggedIn, viewRegTeachers);
router.get("/admin/teachers", isAdminLoggedIn, viewAdminTeachers);
router.get("/admin/results", isAdminLoggedIn, viewAdminResults);
router.get("/admin/result/:resultId", isAdminLoggedIn, editAdminResult);
router.get("/admin/results-archives", isAdminLoggedIn, viewArchives);
router.get('/admin/setting', isAdminLoggedIn, viewAdminSetting)

router.post("/admin/register-teachers", isAdminLoggedIn, validateUser, registerTeacher);
router.post('/admin/changePassword', isAdminLoggedIn, changeAdminPassword)
router.post('/admin/update-result', isAdminLoggedIn, updateAdminResult)
router.post('/admin/add-message', isAdminLoggedIn, addMessage)
router.post('/api/admin/approve', isAdminLoggedIn, approve)
router.post("/admin/delete-teacher", isAdminLoggedIn, deleteTeacher);

router.get("/teacher", isTeacherLoggedIn, viewTeacher);
router.get('/teacher/generate-results', isTeacherLoggedIn, generateResult)
router.get('/teacher/results', isTeacherLoggedIn, viewResults)
router.get('/teacher/result/:resultId', isTeacherLoggedIn, editResult)

router.post('/teacher/set-record', isTeacherLoggedIn, setRecord)
router.post('/teacher/generate-result', isTeacherLoggedIn, generateResults)
router.post('/teacher/update-result', isTeacherLoggedIn, updateResult)
router.post('/teacher/send-result', isTeacherLoggedIn, sendResult)
router.post('/api/teacher/get-record', isTeacherLoggedIn, getRecord)

router.get("/logout", logout);

module.exports = router; 
