const bcrypt = require("bcryptjs");

const Users = require("../models/Users");

// View Admin
const viewAdmin = async (req, res) => {
  const user = req.user.username
  res.render("users/admin", {user});
};

// View Admin Settings
const viewAdminSetting = async (req, res) => {
  res.render('users/adminSetting')
}

// Register Teachers View
const viewRegTeachers = async (req, res) => {
  res.render('users/registerTeacher')
}

// Register Teacher
const registerTeacher = async (req, res) => {
  let username = await Users.findOne({ username: req.body.username });
  let classname = await Users.findOne({class: req.body.className})
  let ers = [];

  if (username || classname) {
    ers.push({ msg: "User already exists" });
    return res.status(400).render("users/registerTeacher", { ers: ers });
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(req.body.password, salt);
    const newUser = await Users.create({
      class: req.body.className,
      username: req.body.username,
      password: hashedPwd,
    });

    newUser.save();

    res.redirect('/users/admin/register-teachers')
  }
};

// Change Admin Password
const changeAdminPassword = async (req, res) => {
  const pwd = req.user.password;
  const salt = await bcrypt.genSalt(10);
  const hashedPwd = await bcrypt.hash(req.body.newPass, salt);
  if (req.body.newPass !== req.body.confirmPass) {
    let ers = [];
    ers.push({ msg: "New Password don't match" });
    console.log(ers);
    res.render("users/adminSetting", { ers });
  } else {
    bcrypt.compare(req.body.oldPass, pwd, async (err, res) => {
      if (res) {
        let ers = [];
        ers.push("Pasword chnaged");
        await Users.findOneAndUpdate(
          { username: req.user.username },
          { password: hashedPwd },
          { new: true }
        );
      }
    });

    res.redirect("/users/admin/setting");
  }
};

// View Teacher
const viewTeacher = async (req, res) => {
  const user = req.user.username;
  res.render("users/teacher", { user });
};


// Logout
const logout = async (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
  });
  res.redirect("/");
};

module.exports = {
  viewAdmin,
  viewAdminSetting,
  viewRegTeachers,
  registerTeacher,
  changeAdminPassword,
  viewTeacher,
  logout,
};
