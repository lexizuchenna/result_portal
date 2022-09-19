const {Users} = require("../models/Users");

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

// Login Only Admin
const checkAdmin = async (req, res, next) => {
  if(req.body.username !== 'admin') {
    res.redirect('/login/teacher')
  } else {
    next()
  }
}

// Login Only Teacher
const checkTeacher = async (req, res, next) => {
  if(req.body.username === 'admin') {
    res.redirect('/login/admin')
  } else {
    next()
  }
}


module.exports = {
  isAdminLoggedIn,
  isAdminLoggedOut,
  checkAdmin,

  isTeacherLoggedIn,
  isTeacherLoggedOut,
  checkTeacher
};