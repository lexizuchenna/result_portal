const passport = require("passport");
const nodemailer = require('nodemailer')
const bcrypt = require('bcryptjs')

const { emailText2 } = require("../constants/emailText");
const { makeid } = require("../constants/functions");
const Users = require("../models/Users");

// View Admin Login Page
const viewAdminPage = (req, res) => {
  res.render("login/admin", { layout: "login" });
};

// View Forget Password Page
const forgetPasswordPage = (req, res) => {
  res.render("login/forgetpass", { layout: "login" });
};

// Forget Admin Password
const resetPass = async (req, res) => {
  const admin = await Users.find({ username: "admin" });
  let adminMail = admin[0].email;
  if (adminMail !== req.body.email) {
    let err = "Incorrect Email";
    res.render("login/forgetpass", { layout: "login", err });
  } else {

    const salt = await bcrypt.genSalt(10);
    let pwd = makeid(6);
    const hashedPwd = await bcrypt.hash(pwd, salt);

    await Users.findOneAndUpdate(
      { username: "admin" },
      { password: hashedPwd },
      { new: true }
    );

    let transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: `"Password Reset ResultPortal" <${process.env.USER}>`,
      subject: `Reset your password`,
      to: req.body.email,
      html: emailText2(pwd),
    });
    res.redirect("/login/admin");
  }

};

// View Teacher Login Page
const viewTeacherPage = (req, res) => {
  res.render("login/teacher", { layout: "login" });
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
  forgetPasswordPage,
  viewTeacherPage,
  adminLogin,
  resetPass,
  adminRedirect,
  teacherLogin,
  teacherRedirect,
};
