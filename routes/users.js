const express = require("express");

const {
  isTeacherLoggedIn,
  isAdminLoggedIn,
  isStudentLoggedIn,
} = require("../middlewares/auth");

const { validateUser } = require("../middlewares/userValidator");

const {
  /*-------- Admin Section --------*/
  registerTeacher,
  viewAdminSetting,
  viewAdminTeachers,
  deleteTeacher,
  viewRegTeachers,
  viewEditTeacher,
  updateTeacher,
  viewAdminResults,
  viewArchives,
  viewArchivesSession,
  addMessage,
  editAdminResult,
  updateAdminResult,
  searchResult,
  viewTokenPage,
  deleteResult,
  approve,
  changeAdminPassword,

  /*-------- Teacher Section --------*/
  viewStudents,
  viewRegisterStudent,
  registerStudent,
  generateResult,
  updateResult,
  viewResults,
  sendResult,
  viewGenerateResult,
  viewCreateResults,
  viewSessionResults,
  viewEditResult,
  viewEditStudent,
  updateStudent,

  /*-------- Student Section --------*/
  viewCheckResult,

  /*-------- General Section --------*/
  viewHome,
  logout,
  checkResult,
  viewStudentResults,
} = require("../controllers/usersController");

/*  
    --------------------------
    Admin Section
    --------------------------
*/

const router = express.Router();

router
  .route("/admin/register-teachers")
  .get(isAdminLoggedIn, viewRegTeachers)
  .post(isAdminLoggedIn, validateUser, registerTeacher);

router.get("/admin", isAdminLoggedIn, viewHome);

router.get("/admin/edit-teacher/:id", isAdminLoggedIn, viewEditTeacher);
router.get("/admin/teachers", isAdminLoggedIn, viewAdminTeachers);
router.get("/admin/results", isAdminLoggedIn, viewAdminResults);
router.get("/admin/result/:resultId", isAdminLoggedIn, editAdminResult);
router.get("/admin/results-archives", isAdminLoggedIn, viewArchives);
router.get(
  "/admin/results-archives/:session",
  isAdminLoggedIn,
  viewArchivesSession
);
router.get("/admin/results/search", isAdminLoggedIn, searchResult);
router.get("/admin/tokens/:session", isAdminLoggedIn, viewTokenPage);
router.get("/admin/setting", isAdminLoggedIn, viewAdminSetting);

router.post("/admin/update-teacher", isAdminLoggedIn, updateTeacher);
router.post("/admin/changePassword", isAdminLoggedIn, changeAdminPassword);
router.post("/admin/update-result", isAdminLoggedIn, updateAdminResult);
router.post("/admin/delete-result", isAdminLoggedIn, deleteResult);
router.post("/admin/add-message", isAdminLoggedIn, addMessage);
router.post("/api/admin/approve", isAdminLoggedIn, approve);
router.post("/admin/delete-teacher", isAdminLoggedIn, deleteTeacher);

/*  
    --------------------------
    Teacher Section
    --------------------------
*/

router
  .route("/teacher/register-students")
  .get(isTeacherLoggedIn, viewRegisterStudent)
  .post(isTeacherLoggedIn, registerStudent);

router
  .route("/teacher/generate-result")
  .get(isTeacherLoggedIn, viewGenerateResult)
  .post(isTeacherLoggedIn, generateResult);

router.get("/teacher", isTeacherLoggedIn, viewHome);
router.get("/teacher/create-results", isTeacherLoggedIn, viewCreateResults);
router.get("/teacher/result-session", isTeacherLoggedIn, viewSessionResults);
router.get("/teacher/results", isTeacherLoggedIn, viewResults);
router.get("/teacher/students", isTeacherLoggedIn, viewStudents);
router.get("/teacher/edit-student/:id", isTeacherLoggedIn, viewEditStudent);
router.get("/teacher/edit-result", isTeacherLoggedIn, viewEditResult);

router.post("/teacher/update-student", isTeacherLoggedIn, updateStudent);
router.post("/teacher/update-result", isTeacherLoggedIn, updateResult);
router.post("/teacher/send-result", isTeacherLoggedIn, sendResult);

/*  
    --------------------------
    Student Section
    --------------------------
*/

router.route("/student").get(isStudentLoggedIn, viewHome);
router
  .route("/student/check-result")
  .get(isStudentLoggedIn, viewCheckResult)
  .post(checkResult);
router.route("/student/results").get(isStudentLoggedIn, viewStudentResults);

/*  
    --------------------------
    General Section
    --------------------------
*/

router.get("/logout", logout);

module.exports = router;
