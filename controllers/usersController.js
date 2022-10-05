const bcrypt = require("bcryptjs");
const _ = require("lodash");
const { v4: uuid } = require("uuid");
const nodemailer = require("nodemailer");

const { Users, UsersSchema } = require("../models/Users");
const { Results, ResultsSchema } = require("../models/Results");
const { emailText } = require("../constants/emailText");

let resulturl;

// View Admin
const viewAdmin = async (req, res) => {
  const user = req.user.username;
  res.render("users/admin/admin", {
    user,
    err: req.flash("err"),
    success: req.flash("success"),
  });
};

// View Admin Settings
const viewAdminSetting = async (req, res) => {
  res.render("users/admin/setting", {
    err: req.flash("err"),
    success: req.flash("success"),
  });
};

// View Register Teachers
const viewRegTeachers = async (req, res) => {
  res.render("users/admin/register-teacher", {
    err: req.flash("err"),
    success: req.flash("success"),
  });
};

// View Teachers in Admin
const viewAdminTeachers = async (req, res) => {
  const Teachers = await Users.find().lean();
  let newTeachers = Teachers.filter((x) => x.username != "admin");
  res.render("users/admin/teachers", {
    newTeachers,
    err: req.flash("err"),
    success: req.flash("success"),
  });
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
  } else if (classname) {
    errors.push({ msg: "Class already exists" });
    return res.status(400).render("users/admin/register-teacher", { errors });
  } else {
    let subjects = _.omit(req.body, [
      "className",
      "username",
      "resDate",
      "password",
      "password2",
      "year",
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
  }
};

// View Edit Teacher
const viewEditTeacher = async (req, res) => {
  const id = req.params.id;
  let Teacher = await Users.findById(id).lean();
  res.render("users/admin/edit-teacher", {
    Teacher,
    err: req.flash("err"),
    success: req.flash("success"),
  });
};

// Update Teacher
const updateTeacher = async (req, res) => {
  let username = await Users.findOne({
    username: req.body.username.toLowerCase(),
  });
  let classname = await Users.findOne({
    className: req.body.className.toLowerCase(),
  });
  let errors = [];
  let succ = [];
  if (username && username !== req.body.username) {
    req.flash("err", "Username already exists");
    res.redirect(`/users/admin/teachers`);
  } else if (classname && classname !== req.body.classname) {
    req.flash("err", "Class Name already exists");
    res.redirect(`/users/admin/teachers`);
  } else if (req.body.password === "" && req.body.password2 === "") {
    let updates = _.omit(req.body, ["password", "password2"]);
    let subjects = _.omit(req.body, [
      "className",
      "username",
      "resDate",
      "password",
      "password2",
      "year",
    ]);
    for (let key in subjects) {
      UsersSchema.add({ [key]: { type: String } });
    }
    console.log(updates);
    await Users.findOneAndUpdate(
      { _id: req.body.id },
      { $set: updates },
      { new: true }
    );
    req.flash("success", "Updated Successfully");
    res.status(201).redirect("/users/admin/teachers");
  } else if (req.body.password !== req.body.password2) {
    errors.push({ msg: "Passwords don" / "t match" });
    res.status(422).render("users/admin/edit-teacher", { errors });
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPwd;
    await Users.findOneAndUpdate(
      { _id: req.body.id },
      { $set: req.body },
      { new: true }
    );
    res.status(201).redirect("/users/admin/teachers");
  }
};

// View Results in Admin
const viewAdminResults = async (req, res) => {
  let rawResult = await Results.find().lean();
  let Result = rawResult.filter((x) => x.approved !== true);
  let host = req.headers.host;

  res.render("users/admin/results", {
    Result,
    host,
    err: req.flash("err"),
    success: req.flash("success"),
  });
};

// Edit Result
const editAdminResult = async (req, res) => {
  let Resp = await Results.find({ resultId: req.params.resultId }).lean();
  let Result = Resp[0];

  res.render("users/admin/edit-result", {
    Result,
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
  let App = await Results.findOneAndUpdate(
    { resultId: req.body.resultId },
    { approved: req.body.approval },
    { new: true }
  );
  res.json("Approved");
};

// Delete Result
const deleteResult = async (req, res) => {
  //let url = req.headers.host + req.url
  const Result = await Results.findByIdAndRemove(req.body.id);
  req.flash("success", `${Result.name} deleted`);
  console.log(resulturl);
  res.redirect(`/users/admin/results-archives/${resulturl}`);
};

// View Archives
const viewArchives = async (req, res) => {
  let rawResult = await Results.find().lean();

  let data = rawResult.map((result) => result.session);
  let session = [...new Set(data)];
  let Result = rawResult.filter((x) => x.approved === true);
  let host = req.headers.host;

  res.render("users/admin/archives", {
    Result,
    host,
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
  let host = req.headers.host;

  res.render("users/admin/session-archives", {
    host,
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
  const user = req.user.username;
  res.render("users/teacher/teacher", {
    user,
    err: req.flash("err"),
    success: req.flash("success"),
  });
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
    Result,
    host,
    Messages,
    err: req.flash("err"),
    success: req.flash("success"),
  });
};

// Send Result
const sendResult = async (req, res) => {
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
    from: `"Noreply ResultPortal" <${process.env.USER}>`,
    subject: `${req.body.studName} Results`,
    to: req.body.email,
    html: emailText(req.body.studName, req.body.link, req.headers.host),
  });

  res.redirect("/users/teacher/results");
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
