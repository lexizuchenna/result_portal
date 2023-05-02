const { emailText2 } = require("../constants/emailText");
const { sendMail, generateChars } = require("../utils/index");

// View Login Page
const viewLoginPage = (req, res) => {
  try {
    let last = req?.session?.messages?.pop();
    return res.render("/login", {
      layout: "login",
      error: last,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

// View Forget Password Page
const viewForgetPasswordPage = (req, res) => {
  try {
    return res.render("login/forgetpass", { layout: "login" });
  } catch (error) {
    console.log(error.name, error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

// Forget Admin Password
const resetPass = async (req, res) => {
  const admin = await Users.findOne({ username: "admin" });
  let adminMail = admin.email;
  if (adminMail !== req.body.email) {
    let err = "Invalid Credential";
    return res.render("login/forgetpass", { layout: "login", err });
  }

  let pwd = generateChars(6);

  const salt = await bcrypt.genSalt(10);
  const hashedPwd = await bcrypt.hash(pwd, salt);

  await Users.findOneAndUpdate(
    { username: "admin" },
    { password: hashedPwd },
    { new: true }
  );

  await sendMail({
    from: `"Password Reset ResultPortal" <${process.env.USER}>`,
    subject: `Reset your password`,
    to: req.body.email,
    html: emailText2(pwd),
  });

  req.flash("success", "Check your email for instructions");
  return res.redirect("/login");
};

module.exports = {
  viewLoginPage,
  viewForgetPasswordPage,
  resetPass,
};
