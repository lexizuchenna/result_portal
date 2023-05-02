const express = require("express");
const passport = require("passport");

const {
  viewLoginPage,
  viewForgetPasswordPage,
  resetPass,
} = require("../controllers/loginController");

const { isUsersLoggedOut } = require("../middlewares/auth");

const router = express.Router();

router
  .route("/")
  .get(isUsersLoggedOut, viewLoginPage)
  .post(
    passport.authenticate("local", {
      failureMessage: true,
      failureRedirect: "/login",
    }),
    (req, res) => {
      if (req.user.role && req.user.role === "admin") {
        return res.status(301).redirect("/users/admin");
      }

      if (req.user.role && req.user.role === "teacher") {
        return res.status(301).redirect("/users/teacher");
      }

      if (req.user.role && req.user.role === "student") {
        return res.status(301).redirect("/users/student");
      }

      return res.status(301).redirect("/users/logout");
    }
  );

router
  .route("/forgot-password")
  .get(isUsersLoggedOut, viewForgetPasswordPage)
  .post(isUsersLoggedOut, resetPass);

module.exports = router;
