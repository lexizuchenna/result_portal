
// Check if Admin is logged in
const isAdminLoggedIn = (req, res, next) => {
  
  if (req.user && req?.user?.username !== "admin") {
    return res.redirect("/users/teacher");
  }
  
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect("/");
};

// Check if Teacher is logged in
const isTeacherLoggedIn = (req, res, next) => {
  
  if (req.user && req?.user?.username === "admin") {
    return res.redirect("/users/admin");
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
  return res.redirect('/users/admin')
};

// Login Only Admin
const checkAdmin = async (req, res, next) => {
  if (req.body.username !== "admin") {
    return res.redirect("/login/teacher");
  }
  next();
};

// Login Only Teacher
const checkTeacher = async (req, res, next) => {
  if (req.body.username === "admin") {
    res.redirect("/login/admin");
  } else {
    next();
  }
};

module.exports = {
  isAdminLoggedIn,
  checkAdmin,

  isTeacherLoggedIn,
  isUsersLoggedOut,
  checkTeacher,
};
