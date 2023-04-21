const express = require("express");
const router = express.Router();
const { isTeacherLoggedIn, isAdminLoggedIn } = require("../middlewares/auth");
const { validateUser } = require("../middlewares/userValidator");
const passport = require("passport");
const {
  viewLoginPage,
  forgetPasswordPage,
  resetPass,

  viewAdmin,
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

  viewTeacher,
  generateResult,
  generateResults,
  editResult,
  updateResult,
  viewResults,
  sendResult,

  logout,
} = require("../controllers/usersController");

const {
  isUsersLoggedOut,
  checkAdmin,
  checkTeacher,
} = require("../middlewares/auth");

router
  .route("/login")
  .get(isUsersLoggedOut, viewLoginPage)
  .post(
    passport.authenticate("local", {
      failureMessage: true,
      failureRedirect: "/users/login",
    }),
    (req, res) => {
      if (req.user.role && req.user.role !== "admin") {
        return res.status(301).redirect("/users/teacher");
      }

      return res.status(301).redirect("/users/admin");
    }
  );

router.get("/forgot-password", isUsersLoggedOut, forgetPasswordPage);
router.post("/forgot-password", isUsersLoggedOut, resetPass);

router.get("/admin", isAdminLoggedIn, viewAdmin);
router.get("/admin/register-teachers", isAdminLoggedIn, viewRegTeachers);
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

router.post(
  "/admin/register-teachers",
  isAdminLoggedIn,
  validateUser,
  registerTeacher
);
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

router.get("/teacher", isTeacherLoggedIn, viewTeacher);
router.get("/teacher/generate-results", isTeacherLoggedIn, generateResult);
router.get("/teacher/results", isTeacherLoggedIn, viewResults);
router.get("/teacher/result/:resultId", isTeacherLoggedIn, editResult);

router.post("/teacher/generate-result", isTeacherLoggedIn, generateResults);
router.post("/teacher/update-result", isTeacherLoggedIn, updateResult);
router.post("/teacher/send-result", isTeacherLoggedIn, sendResult);

router.get("/logout", logout);

module.exports = router;
