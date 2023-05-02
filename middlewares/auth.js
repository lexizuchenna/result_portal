// Check if Admin is logged in
const isAdminLoggedIn = (req, res, next) => {
  if (req.user && req?.user?.role === "teacher") {
    return res.redirect("/users/teacher");
  }

  if (req.user && req?.user?.role === "student") {
    return res.redirect("/users/student");
  }

  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect("/");
};

// Check if Teacher is logged in
const isTeacherLoggedIn = (req, res, next) => {
  if (req.user && req?.user?.role === "admin") {
    return res.redirect("/users/admin");
  }

  if (req.user && req?.user?.role === "student") {
    return res.redirect("/users/student");
  }

  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect("/");
};

const isStudentLoggedIn = (req, res, next) => {
  if (req.user && req?.user?.role === "admin") {
    return res.redirect("/users/admin");
  }

  if (req.user && req?.user?.role === "teacher") {
    return res.redirect("/users/teacher");
  }

  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect("/");
};

// Check if Users are logged out
const isUsersLoggedOut = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }

  if (req.user.role === "admin") {
    return res.redirect("/users/admin");
  }

  if (req.user.role === "teacher") {
    return res.redirect("/users/teacher");
  }

  if (req.user.role === "student") {
    return res.redirect("/users/student");
  }
};

module.exports = {
  isAdminLoggedIn,
  isTeacherLoggedIn,
  isStudentLoggedIn,

  isUsersLoggedOut,
};
