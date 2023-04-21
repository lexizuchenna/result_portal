const bcrypt = require("bcryptjs");
const _ = require("lodash");
const { v4: uuid } = require("uuid");
const nodemailer = require("nodemailer");

const { Users, UsersSchema } = require("../models/Users");
const { Results, ResultsSchema } = require("../models/Results");
const { emailText, emailText2 } = require("../constants/emailText");
const { sendMail, generateNum } = require("../utils/index");

// View Login Page
const viewLoginPage = (req, res) => {
  try {
    let last = req?.session?.messages?.pop();
    return res.render("users/login", {
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
    let pwd = generateNum(6);
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

// View Admin
const viewAdmin = async (req, res) => {
  try {
    const user = req.user.username;
    const students = await Users.find({ role: "student" });
    const teachers = await Users.find({ role: "teacher" });
    const results = await Results.find({ approved: false });
    const archives = await Results.find({ approved: true });
    return res.render("users/admin/home", {
      user,
      role: req.user.role,
      students: students.length,
      teachers: teachers.length,
      results: results.length,
      archives: archives.length,

      errors: req.flash("errors"),
      success: req.flash("success"),
      active: "active",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

// View Admin Settings
const viewAdminSetting = async (req, res) => {
  res.render("users/admin/setting", {
    err: req.flash("err"),
    success: req.flash("success"),
    role: req.user.role,
  });
};

// View Register Teachers
const viewRegTeachers = async (req, res) => {
  res.render("users/admin/register-teacher", {
    err: req.flash("err"),
    success: req.flash("success"),
    role: req.user.role,
  });
};

// View Teachers in Admin
const viewAdminTeachers = async (req, res) => {
  try {
    const page = req.query.p ? req.query.p : 1;

    const LIMIT = 3;

    const startIndex = (Number(page) - 1) * LIMIT;

    const total = await Users.countDocuments({ role: "teacher" });
    const totalPages = Math.ceil(total / LIMIT);

    const Teachers = await Users.find({ role: "teacher" })
      .limit(LIMIT)
      .skip(startIndex)
      .lean();

    const pagination = {
      page: Number(page),
      pageCount: totalPages,
    };

    return res.render("users/admin/teachers", {
      Teachers,
      pagination,
      role: req.user.role,
      err: req.flash("err"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).render("errors/500", { error: error.message });
  }
};

// Delete Teacher
const deleteTeacher = async (req, res) => {
  const Teacher = await Users.findByIdAndRemove(req.body.id);
  req.flash("success", `${Teacher.username} deleted`);
  res.redirect("/users/admin/teachers");
};

// Register Teacher
const registerTeacher = async (req, res) => {
  let username = await Users.findOne({
    username: req.body.username.toLowerCase(),
  });
  let classname = await Users.findOne({
    className: req.body.className.toLowerCase(),
  });
  let errors = [];
  let succ = [];

  if (username) {
    errors.push({ msg: "User already exists" });
    return res.status(400).render("users/admin/register-teacher", { errors });
  }
  if (classname) {
    errors.push({ msg: "Class already exists" });
    return res.status(400).render("users/admin/register-teacher", { errors });
  }

  let subjects = _.omit(req.body, [
    "className",
    "username",
    "resDate",
    "password",
    "password2",
    "session",
    "name",
    "email",
    "term",
  ]);
  for (let key in subjects) {
    UsersSchema.add({ [key]: { type: String } });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPwd = await bcrypt.hash(req.body.password, salt);
  req.body.password = hashedPwd;
  req.body.username = req.body.username.toLowerCase();
  const newUser = await Users.create(req.body);

  newUser.save();
  succ.push({ msg: "Teacher Created" });

  res.render("users/admin/register-teacher", { succ });
};

// View Edit Teacher
const viewEditTeacher = async (req, res) => {
  const id = req.params.id;
  let Teacher = await Users.findById(id).lean();
  let subjects = _.omit(Teacher, [
    "className",
    "username",
    "resDate",
    "password",
    "password2",
    "session",
    "name",
    "email",
    "term",
    "_id",
    "role",
    "createdAt",
    "updatedAt",
    "__v",
  ]);
  const subjectsArray = Object.entries(subjects).map(([name, value]) => ({
    name,
    value,
    id: name.split("b").join("b-"),
    number: name.split("b")[1],
  }));

  return res.render("users/admin/edit-teacher", {
    Teacher,
    subjectsArray,
    role: req.user.role,
    err: req.flash("err"),
    success: req.flash("success"),
  });
};

// Update Teacher
const updateTeacher = async (req, res) => {
  const teacher = await Users.findById(req.body.id);
  let username = await Users.findOne({
    username: req.body.username.toLowerCase(),
  });
  let classname = await Users.findOne({
    className: req.body.className.toLowerCase(),
  });
  let errors = [];
  let succ = [];
  if (username && username.username !== teacher.username) {
    req.flash("err", "Username already exists");
    return res.redirect(`/users/admin/teachers`);
  }
  if (classname && classname.className !== teacher.className) {
    req.flash("err", "Class Name already exists");
    return res.redirect(`/users/admin/teachers`);
  }

  if (req.body.password === "" && req.body.password2 === "") {
    let updates = _.omit(req.body, ["password", "password2"]);
    let subjects = _.omit(req.body, [
      "className",
      "username",
      "resDate",
      "password",
      "password2",
      "year",
      "name",
      "id",
      "email",
    ]);
    for (let key in subjects) {
      UsersSchema.add({ [key]: { type: String } });
    }

    await Users.findOneAndUpdate(
      { _id: req.body.id },
      { $set: updates },
      { new: true }
    );
    req.flash("success", "Teacher Data Updated Successfully");
    return res.status(201).redirect("/users/admin/teachers");
  }

  if (req.body.password !== req.body.password2) {
    errors.push({ msg: "Passwords don't match" });
    return res.status(422).render("users/admin/edit-teacher", { errors });
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(req.body.password, salt);

    req.body.password = hashedPwd;

    let subjects = _.omit(req.body, [
      "className",
      "username",
      "resDate",
      "password",
      "password2",
      "year",
      "name",
      "id",
      "email",
    ]);
    for (let key in subjects) {
      UsersSchema.add({ [key]: { type: String } });
    }

    await Users.findOneAndUpdate(
      { _id: req.body.id },
      { $set: req.body },
      { new: true }
    );
    req.flash("success", "User Data and Password Updated Successfully");
    return res.status(201).redirect("/users/admin/teachers");
  }
};

// View Results in Admin
const viewAdminResults = async (req, res) => {
  let rawResult = await Results.find().lean();
  let Result = rawResult.filter((x) => x.approved !== true);
  

  res.render("users/admin/results", {
    Result,
    role: req.user.role,
    err: req.flash("err"),
    success: req.flash("success"),
  });
};

// Edit Result
const editAdminResult = async (req, res) => {
  let Result = await Results.findOne({ resultId: req.params.resultId }).lean();

  res.render("users/admin/edit-result", {
    Result,
    role: req.user.role,
    err: req.flash("err"),
    success: req.flash("success"),
  });
};

// Update Result
const updateAdminResult = async (req, res) => {
  await Results.findOneAndUpdate(
    { resultId: req.body.resultId },
    { hcomment: req.body.hcomment },
    { new: true }
  );
  req.flash("success", "Comment Updated");
  res.redirect("/users/admin/results");
};

// Add Message
const addMessage = async (req, res) => {
  if (!req.body.message) {
    await Results.findOneAndUpdate(
      { resultId: req.body.resultId },
      { message: "Null" },
      { new: true }
    );
    req.flash("success", "Message Cleared");
    res.redirect("/users/admin/results");
  } else {
    await Results.findOneAndUpdate(
      { resultId: req.body.resultId },
      { message: req.body.message },
      { new: true }
    );
    req.flash("success", "Message Sent");
    res.redirect("/users/admin/results");
  }
};

// Approval
const approve = async (req, res) => {
  let data = await Results.findOneAndUpdate(
    { resultId: req.body.id },
    { approved: req.body.check },
    { new: true }
  );
  res.json(data);
};

// Delete Result
const deleteResult = async (req, res) => {
  const referer = req.headers.referer;
  const Result = await Results.findByIdAndRemove(req.body.id);
  req.flash("success", `${Result.name} deleted`);
  res.redirect(referer);
};

// View Archives
const viewArchives = async (req, res) => {
  let data = await Results.find().lean();
  const data2 = data.filter((x) => x.approved === true);
  let data3 = data2.map((x) => x.session);
  let session = [...new Set(data3)];
  let Result = data.filter((x) => x.approved === true);

  res.render("users/admin/archives", {
    Result,
    role: req.user.role,
    err: req.flash("err"),
    success: req.flash("success"),
    session,
  });
};
// &&
const viewArchivesSession = async (req, res) => {
  let session = req.params.session;
  resulturl = session;

  let rawResult = await Results.find({ session: session }).lean();

  let Result = rawResult.filter((x) => x.approved === true);

  res.render("users/admin/session-archives", {
    role: req.user.role,
    Result,
    err: req.flash("err"),
    success: req.flash("success"),
  });
};

// Search
const searchResult = async (req, res) => {
  let name = req.query.name.toLowerCase();
  let className = req.query.className.toLowerCase();
  let session = req.query.session.toLowerCase();
  if (name === "" && className === "") {
    let Result = await Results.find({ session }).lean();
    let host = req.headers.host;

    res.render("users/admin/session-archives", {
      host,
      role: req.user.role,
      Result,
      err: req.flash("err"),
      success: req.flash("success"),
    });
  } else if (className === "" && session === "") {
    let Result = await Results.find({ name }).lean();
    let host = req.headers.host;

    res.render("users/admin/session-archives", {
      host,
      Result,
      err: req.flash("err"),
      success: req.flash("success"),
    });
  } else if (session === "" && name === "") {
    let Result = await Results.find({ className }).lean();
    let host = req.headers.host;

    res.render("users/admin/session-archives", {
      host,
      Result,
      err: req.flash("err"),
      success: req.flash("success"),
    });
  } else if (name === "") {
    let Result = await Results.find({ className, session }).lean();
    let host = req.headers.host;

    res.render("users/admin/session-archives", {
      host,
      Result,
      err: req.flash("err"),
      success: req.flash("success"),
    });
  } else if (className === "") {
    let Result = await Results.find({ name, session }).lean();
    let host = req.headers.host;

    res.render("users/admin/session-archives", {
      host,
      Result,
      err: req.flash("err"),
      success: req.flash("success"),
    });
  } else if (session === "") {
    let Result = await Results.find({ name, className }).lean();
    let host = req.headers.host;

    res.render("users/admin/session-archives", {
      host,
      Result,
      err: req.flash("err"),
      success: req.flash("success"),
    });
  } else {
    let Result = await Results.find({ name, className, session }).lean();
    let host = req.headers.host;

    res.render("users/admin/session-archives", {
      host,
      Result,
      err: req.flash("err"),
      success: req.flash("success"),
    });
  }
};

// Token Page
const viewTokenPage = async (req, res) => {
  let { session } = req.params;
  let rawResult = await Results.find({ session }).lean();

  let Result = rawResult.filter((x) => x.approved === true);
  let host = req.headers.host;

  res.render("users/admin/tokens", {
    layout: "result",
    Result,
    err: req.flash("err"),
    success: req.flash("success"),
  });
};

// Change Admin Password
const changeAdminPassword = async (req, res) => {
  let err = [];
  let success = [];
  let errors = [];
  const pwd = req.user.password;
  const salt = await bcrypt.genSalt(10);
  const hashedPwd = await bcrypt.hash(req.body.newPass, salt);
  if (req.body.newPass !== req.body.confirmPass) {
    errors.push({ msg: "New Password don't match" });
    res.render("users/admin/setting", {
      errors,
      err: req.flash("err"),
      success: req.flash("success"),
    });
  } else {
    bcrypt.compare(req.body.oldPass, pwd, async (ers, resp) => {
      if (resp === false) {
        err.push("Wrong Password");
        req.flash("err", err);
        res.redirect("/users/admin/setting");
      }
      if (resp === true) {
        await Users.findOneAndUpdate(
          { username: req.user.username },
          { password: hashedPwd },
          { new: true }
        );

        success.push("Password Changed");
        req.flash("success", success);
        res.redirect("/users/admin/setting");
      }
    });
  }
};

/*  
    --------------------------
    Teacher Section
    --------------------------
*/

// View Teacher
const viewTeacher = async (req, res) => {
  try {
    return res.render("users/teacher/home", {
      user: req.user.username,
      role: req.user.role,
      err: req.flash("err"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.log(error.message)
  }
};

// View Generate Result
const generateResult = async (req, res) => {
  let one = await Users.findById(req.user.id).lean();

  let newRecord = _.omit(one, [
    "className",
    "email",
    "_id",
    "username",
    "createdAt",
    "updatedAt",
    "__v",
    "resDate",
    "session",
    "password",
    "term",
  ]);

  let updatedRecord = Object.entries(newRecord).map((entry) => {
    return { sub: entry[1], id: entry[0] };
  });
  let tSubject = updatedRecord.length;

  res.render("users/teacher/generate-results", {
    role: req.user.role,
    updatedRecord,
    tSubject,
    one,
    err: req.flash("err"),
    success: req.flash("success"),
  });
};

// Generate Result
const generateResults = async (req, res) => {
  let err = [];
  let success = [];
  let grades = _.omit(req.body, [
    "term",
    "session",
    "tcomment",
    "hcomment",
    "resDate",
    "name",
    "sex",
    "age",
    "resultId",
    "resultLink",
  ]);
  for (let keys in grades) {
    ResultsSchema.add({ [keys]: { type: String } });
  }

  let id = uuid();
  let str = uuid();
  let token = str.split("-").slice(0, 3).join("");

  req.body.name = req.body.name.toLowerCase();
  req.body.className = req.user.className.toLowerCase();
  req.body.user = req.user.id;
  req.body.teacher = req.user.username;
  req.body.resultId = id;
  req.body.resultLink = `/results/student/${id}`;
  req.body.token = token;
  if (
    req.body.name === "" ||
    req.body.sex === "" ||
    req.body.term === "" ||
    req.body.session === "" ||
    req.body.className === "" ||
    req.body.age === ""
  ) {
    err.push("Fill all fields");
    req.flash("err", err);
    res.redirect("/users/teacher/generate-results");
  } else {
    const Result = await Results.create(req.body);
    await Result.save();
    success.push("Result Generated");
    req.flash("success", success);
    res.redirect("/users/teacher/generate-results");
  }
};

// Edit Result
const editResult = async (req, res) => {
  let Resp = await Results.find({ resultId: req.params.resultId }).lean();
  let Result = Resp[0];

  res.render("users/teacher/edit-result", {
    role: req.user.role,
    Result,
    err: req.flash("err"),
    success: req.flash("success"),
  });
};

// Update Result
const updateResult = async (req, res) => {
  let success = [];
  let grades = _.omit(req.body, [
    "tcomment",
    "resDate",
    "name",
    "resultId",
    "sex",
    "age",
  ]);
  for (let keys in grades) {
    ResultsSchema.add({ [keys]: { type: String } });
  }

  await Results.findOneAndUpdate({ resultId: req.body.resultId }, req.body, {
    new: true,
  });
  success.push("Updated Successfully");
  req.flash("success", success);
  res.redirect("/users/teacher/results");
};

// View Results
const viewResults = async (req, res) => {
  let data = await Results.find({ user: req.user.id }).lean();
  let Result = data.filter((x) => x.approved !== true);
  let host = req.headers.host;
  let Messages = Result.filter((x) => x.message !== "Nill");

  res.render("users/teacher/results", {
    role: req.user.role,
    Result,
    host,
    Messages,
    err: req.flash("err"),
    success: req.flash("success"),
  });
};

// Send Result
const sendResult = async (req, res) => {
  try {
    await sendMail(
      "Noreply School Portal",
      process.env.USER,
      "STUDENT RESULT",
      req.body.email,
      emailText(req.body.studName, req.body.link, req.headers.host)
    );

    return res.redirect("/users/teacher/results");
  } catch (error) {
    console.log(error.name);
    return res.render("errors/500", { layout: "error", error: error.message });
  }
};

// Logout
const logout = async (req, res, next) => {
  try {
    req.logout((err) => {
      if (err) return next(err);
    });
    return res.redirect("/");
  } catch (error) {
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

module.exports = {
  viewLoginPage,
  forgetPasswordPage,
  resetPass,

  viewAdmin,
  viewAdminSetting,
  viewRegTeachers,
  viewAdminTeachers,
  deleteTeacher,
  registerTeacher,
  viewEditTeacher,
  updateTeacher,
  viewAdminResults,
  editAdminResult,
  updateAdminResult,
  deleteResult,
  viewArchives,
  viewArchivesSession,
  searchResult,
  addMessage,
  approve,
  viewTokenPage,
  changeAdminPassword,

  viewTeacher,
  generateResult,
  generateResults,
  editResult,
  updateResult,
  viewResults,
  sendResult,

  logout,
};
