const passport = require("passport");

// View Admin Login Page
const viewAdminPage = (req, res) => {
  res.render("login/admin");
};

// View Teacher Login Page
const viewTeacherPage = (req, res) => {
  res.render("login/teacher");
};

//Admin Login
const adminLogin = passport.authenticate("local", {
  failureRedirect: "/login/admin",
});

// Teacher Login
const teacherLogin = passport.authenticate("local", {
  failureRedirect: "/login/teacher",
});

// Admin Login Redirect
const adminRedirect = (req, res) => {
  res.redirect("/users/admin");
};

// Teacher Login Redirect
const teacherRedirect = (req, res) => {
  res.redirect("/users/teacher");
};

module.exports = {
  viewAdminPage,
  viewTeacherPage,
  adminLogin,
  adminRedirect,
  teacherLogin,
  teacherRedirect,
};
