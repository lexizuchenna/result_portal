const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const _ = require("lodash");
const { v4: uuid } = require("uuid");

const { Users, UsersSchema } = require("../models/Users");
const { Results, ResultsSchema } = require("../models/Results");
const { emailText } = require("../constants/emailText");
const { sendMail, generateNum } = require("../utils/index");

/*  
    --------------------------
    Admin Section
    --------------------------
*/

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
  try {
    return res.render("users/admin/register-teacher", {
      err: req.flash("err"),
      success: req.flash("success"),
      role: req.user.role,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
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
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

// Delete Teacher
const deleteTeacher = async (req, res) => {
  try {
    const Teacher = await Users.findByIdAndRemove(req.body.id);
    req.flash("success", `${Teacher.username} deleted`);
    res.redirect("/users/admin/teachers");
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

// Register Teacher
const registerTeacher = async (req, res) => {
  try {
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

    return res.render("users/admin/register-teacher", { succ });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

// View Edit Teacher
const viewEditTeacher = async (req, res) => {
  try {
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
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

// Update Teacher
const updateTeacher = async (req, res) => {
  try {
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
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

// View Results in Admin
const viewAdminResults = async (req, res) => {
  try {
    let rawResult = await Results.find().lean();
    let Result = rawResult.filter((x) => x.approved !== true);

    res.render("users/admin/results", {
      Result,
      role: req.user.role,
      err: req.flash("err"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

// Edit Result
const editAdminResult = async (req, res) => {
  try {
    let Result = await Results.findOne({
      resultId: req.params.resultId,
    }).lean();

    return res.render("users/admin/edit-result", {
      Result,
      role: req.user.role,
      err: req.flash("err"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

// Update Result
const updateAdminResult = async (req, res) => {
  try {
    await Results.findOneAndUpdate(
      { resultId: req.body.resultId },
      { hcomment: req.body.hcomment },
      { new: true }
    );
    req.flash("success", "Comment Updated");
    return res.redirect("/users/admin/results");
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

// Add Message
const addMessage = async (req, res) => {
  try {
    if (!req.body.message) {
      await Results.findOneAndUpdate(
        { resultId: req.body.resultId },
        { message: "Null" },
        { new: true }
      );
      req.flash("success", "Message Cleared");
      return res.redirect("/users/admin/results");
    }
    await Results.findOneAndUpdate(
      { resultId: req.body.resultId },
      { message: req.body.message },
      { new: true }
    );
    req.flash("success", "Message Sent");
    return res.redirect("/users/admin/results");
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

// Approval
const approve = async (req, res) => {
  try {
    let data = await Results.findOneAndUpdate(
      { resultId: req.body.id },
      { approved: req.body.check },
      { new: true }
    );
    return res.json(data);
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
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
  try {
    let data = await Results.find().lean();
    const data2 = data.filter((x) => x.approved === true);
    let data3 = data2.map((x) => x.session);
    let session = [...new Set(data3)];
    let Result = data.filter((x) => x.approved === true);

    return res.render("users/admin/archives", {
      Result,
      role: req.user.role,
      err: req.flash("err"),
      success: req.flash("success"),
      session,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

// &&
const viewArchivesSession = async (req, res) => {
  try {
    let session = req.params.session;
    resulturl = session;

    let rawResult = await Results.find({ session: session }).lean();

    let Result = rawResult.filter((x) => x.approved === true);

    return res.render("users/admin/session-archives", {
      role: req.user.role,
      Result,
      err: req.flash("err"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

// Search
const searchResult = async (req, res) => {
  try {
    let name = req.query.name.toLowerCase();
    let className = req.query.className.toLowerCase();
    let session = req.query.session.toLowerCase();
    if (name === "" && className === "") {
      let Result = await Results.find({ session }).lean();
      let host = req.headers.host;

      return res.render("users/admin/session-archives", {
        host,
        role: req.user.role,
        Result,
        err: req.flash("err"),
        success: req.flash("success"),
      });
    }
    if (className === "" && session === "") {
      let Result = await Results.find({ name }).lean();
      let host = req.headers.host;

      return res.render("users/admin/session-archives", {
        host,
        Result,
        err: req.flash("err"),
        success: req.flash("success"),
      });
    }

    if (session === "" && name === "") {
      let Result = await Results.find({ className }).lean();
      let host = req.headers.host;

      return res.render("users/admin/session-archives", {
        host,
        Result,
        err: req.flash("err"),
        success: req.flash("success"),
      });
    }

    if (name === "") {
      let Result = await Results.find({ className, session }).lean();
      let host = req.headers.host;

      return res.render("users/admin/session-archives", {
        host,
        Result,
        err: req.flash("err"),
        success: req.flash("success"),
      });
    }

    if (className === "") {
      let Result = await Results.find({ name, session }).lean();
      let host = req.headers.host;

      return res.render("users/admin/session-archives", {
        host,
        Result,
        err: req.flash("err"),
        success: req.flash("success"),
      });
    }

    if (session === "") {
      let Result = await Results.find({ name, className }).lean();
      let host = req.headers.host;

      return res.render("users/admin/session-archives", {
        host,
        Result,
        err: req.flash("err"),
        success: req.flash("success"),
      });
    } else {
      let Result = await Results.find({ name, className, session }).lean();
      let host = req.headers.host;

      return res.render("users/admin/session-archives", {
        host,
        Result,
        err: req.flash("err"),
        success: req.flash("success"),
      });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

// Token Page
const viewTokenPage = async (req, res) => {
  try {
    let { session } = req.params;
    let rawResult = await Results.find({ session }).lean();

    let Result = rawResult.filter((x) => x.approved === true);
    let host = req.headers.host;

    return res.render("users/admin/tokens", {
      layout: "result",
      Result,
      err: req.flash("err"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

// Change Admin Password
const changeAdminPassword = async (req, res) => {
  try {
    let err = [];
    let success = [];
    let errors = [];

    const pwd = req.user.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(req.body.newPass, salt);

    if (req.body.newPass !== req.body.confirmPass) {
      errors.push({ msg: "New Password don't match" });
      return res.render("users/admin/setting", {
        errors,
        err: req.flash("err"),
        success: req.flash("success"),
      });
    }
    bcrypt.compare(req.body.oldPass, pwd, async (ers, resp) => {
      if (ers) {
        console.log(ers);
        return res
          .status(500)
          .render("errors/500", { layout: "error", error: error.message });
      }
      if (resp === false) {
        err.push("Wrong Password");
        req.flash("err", err);
        return res.redirect("/users/admin/setting");
      }
      if (resp === true) {
        await Users.findOneAndUpdate(
          { username: req.user.username },
          { password: hashedPwd },
          { new: true }
        );

        success.push("Password Changed");
        req.flash("success", success);
        return res.redirect("/users/admin/setting");
      }
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

/*  
    --------------------------
    Teacher Section
    --------------------------
*/

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
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

// View Students
const viewStudents = async (req, res) => {
  try {
    const students = await Users.find({
      role: "student",
      teacher: mongoose.Types.ObjectId(req.user._id),
    }).lean();

    return res.render("users/teacher/students", {
      students,
      role: req.user.role,
      err: req.flash("err"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

// View Student Registration Page
const viewRegisterStudent = async (req, res) => {
  try {
    return res.render("users/teacher/register-student", {
      role: req.user.role,
      err: req.flash("err"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

// Register Student Handle
const registerStudent = async (req, res) => {
  try {
    const { name, gender } = req.body;

    const generateUsername = async () => {
      let user = `student${generateNum(6)}`;
      let username = await Users.findOne({ username: user });

      while (username) {
        user = `student${generateNum(6)}`;
        username = await Users.findOne({ username: user });
      }

      return user;
    };

    const username = await generateUsername();
    const salt = await bcrypt.genSalt(10);

    const student = {
      name,
      teacher: mongoose.Types.ObjectId(req.user._id),
      username,
      className: req.user.className,
      results: ["null"],
      gender,
      role: "student",
      password: await bcrypt.hash(username, salt),
    };

    const newStudent = await Users.create(student);

    newStudent.save();

    req.flash("success", "Student Created");
    return res.redirect("/users/teacher/register-students");
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

const viewEditStudent = async (req, res) => {
  try {
    const student = await Users.findById(req.params.id).lean();

    if (!student) {
      return res.render("errors/400", {
        layout: "error",
        error: "Resource Not Found",
      });
    }

    return res.render("users/teacher/edit-student", {
      student,
      role: req.user.role,
      err: req.flash("err"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const id = req.headers.referer.split("/").pop();

    await Users.findByIdAndUpdate(id, req.body, { new: true });

    req.flash("success", "Student Updated");
    return res.redirect("/users/teacher/students");
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

// View Results
const viewResults = async (req, res) => {
  try {
    let approvedResults = await Results.find({
      teacher: mongoose.Types.ObjectId(req.user.id),
      approved: true,
    }).lean();
    let unApprovedResults = await Results.find({
      teacher: mongoose.Types.ObjectId(req.user.id),
      approved: !true,
    }).lean();

    return res.render("users/teacher/results", {
      role: req.user.role,
      approvedResults,
      unApprovedResults,
      err: req.flash("err"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

// View Result Creation Page
const viewCreateResults = async (req, res) => {
  try {
    return res.render("users/teacher/create-results", { role: req.user.role });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

// Session and Term Form Page
const viewSessionResults = async (req, res) => {
  try {
    const { term, session } = req.query;

    const students = await Users.find({
      role: "student",
      teacher: mongoose.Types.ObjectId(req.user._id),
    }).lean();

    const session_term = `${session}, ${term}`;

    const generatedStudents = students.filter((student) =>
      student.results.includes(session_term)
    );
    const unGeneratedStudents = students.filter(
      (student) => !student.results.includes(session_term)
    );

    return res.status(200).render("users/teacher/result-session", {
      generatedStudents,
      unGeneratedStudents,
      role: req.user.role,
      err: req.flash("err"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

// View Result Generation Page
const viewGenerateResult = async (req, res) => {
  try {
    const { id, session, term } = req.query;

    const student = await Users.findById(id).lean();
    const teacher = await Users.findById(req.user.id).lean();

    let data = _.omit(teacher, [
      "_id",
      "name",
      "className",
      "username",
      "role",
      "email",
      "password",
      "term",
      "resDate",
      "session",
      "createdAt",
      "updatedAt",
      "__v",
    ]);

    let subjects = Object.entries(data).map((entry) => {
      return { sub: entry[1], id: entry[0] };
    });

    return res.status(200).render("users/teacher/generate-result", {
      session,
      term,
      student,
      subjects,
      teacher,
      ts: subjects.length,
      role: req.user.role,
      err: req.flash("err"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

// Generate Result
const generateResult = async (req, res) => {
  try {
    let err = [];
    let success = [];
    let grades = _.omit(req.body, [
      "name",
      "username",
      "gender",
      "session",
      "term",
      "tcomment",
      "resDate",
      "tSubject",
    ]);
    for (let keys in grades) {
      ResultsSchema.add({ [keys]: { type: String } });
    }

    let id = uuid();

    let token = generateNum(12);

    const url = new URL(req.headers.referer);
    const params = new URLSearchParams(url.search);

    req.body.name = req.body.name.toLowerCase();
    req.body.className = req.user.className.toLowerCase();
    req.body.teacher = req.user._id;
    req.body.resultId = id;
    req.body.resultLink = `/results/student/${id}`;
    req.body.token = token;
    req.body.student = params.get("id");

    const Result = await Results.create(req.body);
    await Result.save();

    const student = await Users.findOne({ username: req.body.username });

    const session_term = `${req.body.session}, ${req.body.term}`;

    student.results.push(session_term);

    await Users.findByIdAndUpdate(
      student.id,
      { results: student.results },
      { new: true }
    );

    success.push("Result Generated");
    req.flash("success", success);
    return res.redirect(
      `/users/teacher/result-session?term=${req.body.term}&session=${req.body.session}`
    );
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

// View Result Edit Page
const viewEditResult = async (req, res) => {
  try {
    const { id, session, term } = req.query;

    const result = await Results.findOne({
      student: mongoose.Types.ObjectId(id),
      session,
      term,
    }).lean();

    let data = _.omit(result, [
      "_id",
      "name",
      "className",
      "username",
      "student",
      "gender",
      "session",
      "term",
      "teacher",
      "tcomment",
      "resDate",
      "tSubject",
      "resultId",
      "resultLink",
      "token",
      "approved",
      "message",
      "createdAt",
      "updatedAt",
      "__v",
    ]);

    const subjects = [];
    for (let i = 1; i <= parseInt(result.tSubject); i++) {
      const subject = {};
      const id = `sub${i}`;
      subject.id = id;
      subject.title = data[`${id}title`];
      subject.firstAss = data[`${id}firstAss`];
      subject.secAss = data[`${id}secAss`];
      subject.thirdAss = data[`${id}thirdAss`];
      subject.project = data[`${id}project`];
      subject.exam = data[`${id}exam`];
      subject.subAve = data[`${id}subAve`];
      subjects.push(subject);
    }

    return res.status(200).render("users/teacher/edit-result", {
      session,
      term,
      result,
      //student,
      subjects,
      role: req.user.role,
      err: req.flash("err"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

// Update Result Handle
const updateResult = async (req, res) => {
  try {
    let err = [];
    let success = [];
    let grades = _.omit(req.body, [
      "name",
      "username",
      "gender",
      "session",
      "term",
      "tcomment",
      "resDate",
      "tSubject",
    ]);
    for (let keys in grades) {
      ResultsSchema.add({ [keys]: { type: String } });
    }

    const url = new URL(req.headers.referer);
    const params = new URLSearchParams(url.search);

    await Results.findOneAndUpdate(
      {
        username: req.body.username,
        term: req.body.term,
        session: req.body.session,
      },
      req.body,
      { new: true }
    );

    success.push("Result Updated");
    req.flash("success", success);
    return res.redirect(
      `/users/teacher/result-session?term=${req.body.term}&session=${req.body.session}`
    );
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

/*  
    --------------------------
    Student Section
    --------------------------
*/

// View Check Result Page
const viewCheckResult = async (req, res) => {
  try {
    return res.status(200).render("users/student/check-result", {
      role: req.user.role,
      username: req.user.username,
      err: req.flash("err"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

// View All Results Page
const viewStudentResults = async (req, res) => {
  try {
    const results = await Results.find({
      username: req.user.username,
      checked: true,
    }).lean();
    return res.status(200).render("users/student/results", {
      role: req.user.role,
      results,
      err: req.flash("err"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

// Check Result Handle
const checkResult = async (req, res) => {
  try {
    const { term, session, username } = req.body;

    const result = await Results.findOne({ term, session, username });

    if (!result) return res.status(404).json("Result not found, check details");

    if (result.approved === false)
      return res.status(404).json("Result not found, check details");

    if (result.username !== req.user.username)
      return res.status(404).json("Unauthorized Access");

    return res.status(200).json(result);
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

/*  
    --------------------------
    General Section
    --------------------------
*/

// View Dashboard
const viewHome = async (req, res) => {
  try {
    const students = await Users.find({ role: "student" });
    const teachers = await Users.find({ role: "teacher" });
    const results = await Results.find({ approved: false });
    const archives = await Results.find({ approved: true });

    return res.render("users/home", {
      user: req.user.username,
      role: req.user.role,
      students: students.length,
      teachers: teachers.length,
      results: results.length,
      archives: archives.length,

      err: req.flash("err"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

// Logout
const logout = async (req, res, next) => {
  try {
    req.logout((err) => {
      if (err) return next(err);
      return res.redirect("/");
    });
  } catch (error) {
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

module.exports = {
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

  viewStudents,
  viewRegisterStudent,
  registerStudent,
  viewEditStudent,
  updateStudent,
  generateResult,
  updateResult,
  viewResults,
  sendResult,
  viewCreateResults,
  viewSessionResults,
  viewGenerateResult,
  viewEditResult,

  /*-------- Student Section --------*/
  viewCheckResult,
  checkResult,
  viewStudentResults,

  /*-------- General Section --------*/
  viewHome,
  logout,
};
