const _ = require("lodash");

const { Results } = require("../models/Results");

const viewResult = async (req, res) => {
  let index = req.flash("Result");
  res.render("results", { layout: "result", Result: index[0] });
};

const viewTeacherResult = async (req, res) => {
  const newResult = await Results.find({ resultId: req.params.id }).lean();
  let Result = newResult[0];
  res.render("results", { layout: "result", Result });
};
const viewAdminResult = async (req, res) => {
  let data = await Results.findOne({ resultId: req.params.id }).lean();

  const resultData = _.omit(data, [
    "_id",
    "user",
    "teacher",
    "name",
    "sex",
    "age",
    "session",
    "term",
    "className",
    "tcomment",
    "resDate",
    "resultId",
    "resultLink",
    "token",
    "approved",
    "message",
    "createdAt",
    "updatedAt",
    "__v",
    "hcomment",
  ]);

  const results = [];
  for (let i = 1; i <= parseInt(resultData.totalSubject); i++) {
    const result = {};
    const id = `sub${i}`;
    result.id = id;
    result.title = resultData[`${id}title`];
    result.firstAss = resultData[`${id}firstAss`];
    result.secAss = resultData[`${id}secAss`];
    result.thirdAss = resultData[`${id}thirdAss`];
    result.project = resultData[`${id}project`];
    result.exam = resultData[`${id}exam`];
    result.subAve = resultData[`${id}subAve`];
    results.push(result);
  }

  return res.render("results", { layout: "result", Result: data, admin: "admin", results });
};

const viewSecResult = async (req, res) => {
  const newResult = await Results.find({ resultId: req.params.id }).lean();
  let Result = newResult[0];
  res.render("sec-result", { layout: "sec-result", Result });
};

const viewFindResult = async (req, res) => {
  res.render("check-result", { layout: "login" });
};

const getResultApi = async (req, res) => {
  if (
    !req.body.name ||
    !req.body.className ||
    !req.body.session ||
    req.body.name === "" ||
    req.body.className === "" ||
    req.body.session === ""
  ) {
    res.json("Fill all fields");
  } else {
    const Result = await Results.find({
      name: req.body.name,
      className: req.body.className,
      session: req.body.session,
    }).lean();

    res.json(Result);
  }
};

const submitForm = async (req, res) => {
  const index = await Results.find({
    resultId: req.body.resultId,
  }).lean();

  let Result = index[0];

  req.flash("Result", Result);
  res.redirect(`/results/student/${req.body.resultId}`);
};

module.exports = {
  viewResult,
  viewSecResult,
  viewTeacherResult,
  viewAdminResult,
  viewFindResult,
  getResultApi,
  submitForm,
};
