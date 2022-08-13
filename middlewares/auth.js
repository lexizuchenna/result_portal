const Users = require("../models/Users");

// Check if Admin is logged in
const isAdminLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login/admin");
};

// Check if Admin is logged out
const isAdminLoggedOut = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
};

// Check if Teacher is logged in
const isTeacherLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login/teacher");
};

// Check if Teacher is logged out
const isTeacherLoggedOut = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/users/teacher");
};


module.exports = {
  isAdminLoggedIn,
  isAdminLoggedOut,
  isTeacherLoggedIn,
  isTeacherLoggedOut
};