const bcrypt = require("bcryptjs");
const _ = require('lodash')
const {v4: uuid} = require('uuid')
const nodemailer = require('nodemailer')

const Users = require("../models/Users");
const {Results, ResultsSchema} = require('../models/Results')
const {Records, RecordsSchema} = require('../models/Records');
const {emailText} = require('../constants/emailText')

// View Admin
const viewAdmin = async (req, res) => {
  const user = req.user.username
  res.render("users/admin", {user});
};

// View Admin Settings
const viewAdminSetting = async (req, res) => {
  res.render('users/adminSetting')
}

// View Register Teachers
const viewRegTeachers = async (req, res) => {
  res.render('users/registerTeacher')
}

// View Teachers in Admin
const viewAdminTeachers = async (req, res) => {
  const Teachers = await Users.find().lean()
  let newTeachers = Teachers.filter((x) => x.username != 'admin')
  res.render('users/adminTeachers', {newTeachers})
}

// Delete Teacher
const deleteTeacher = async (req, res) => {
  const Teacher = await Users.findByIdAndRemove(req.body.id)
  res.redirect('/users/admin/teachers')
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

// Set Teacher Record
const setRecord = async (req, res) => {
  let subjects = _.omit(req.body, ['term', 'year', 'sub1', 'resDate'])
  for (let key in subjects) {
    RecordsSchema.add({[key]: {type: String}})
  }

  req.body.user = req.user.id
  if(!req.body) {
    res.redirect('/users/teacher')
  } else {
    const Record = await Records.create(req.body)
    await Record.save()
    res.redirect('/users/teacher')
  }
}

// Get Records API
const getRecord = async (req, res) => {
  let Record = await Records.find({term: req.body.term, year: req.body.year, user: req.user.id}).lean()
  // res.json(Record)
  let one = Record[0]
  let newRecord = _.omit(one, ['term', 'year', '_id', 'user',  'createdAt', 'updatedAt', '__v', 'resDate'])
  
  let updatedRecord = Object.entries(newRecord).map(entry => {
    return {sub:  entry[1], id: entry[0]}
  })

  // let updatedRecord = Object.keys(newRecord)
  
  let tSubject = updatedRecord.length
  res.render('users/generateResults', {updatedRecord, one, tSubject})
}

// View Generate Result
const generateResult = async (req, res) => {
  res.render('users/generateResults')
}

// Generate Result
const generateResults = async (req, res) => {
  let grades = _.omit(req.body, ['term', 'year', 'chAverage', 'clAverage', 'perfomance', 'tcomment', 'hcomment', 'resDate', 'name', 'position', 'resultId', 'resultLink', 'class'])
  for (let keys in grades) {
    ResultsSchema.add({[keys]: {type: String}})
  }

  req.body.class = req.user.class
  let id = uuid()
  req.body.resultId = id
  req.body.resultLink = `/results/student/${id}`
  if(!req.body.name || !req.body.position || !req.body.term || !req.body.year || !req.body.class) {
    res.redirect('/users/teacher/generate-results')
  } else {
    const Result = await Results.create(req.body)
    await Result.save()
    res.redirect('/users/teacher/generate-results')
  }

}

// View Results 
const viewResults = async (req, res) => {
  let Result = await Results.find().lean()
  let host = req.headers.host
  
  res.render('users/results', {Result, host})
}

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

  res.redirect('/users/teacher/results')

}


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
  changeAdminPassword,

  viewTeacher,
  generateResult,
  generateResults,
  setRecord,
  getRecord,
  viewResults,
  sendResult,

  logout,
};
