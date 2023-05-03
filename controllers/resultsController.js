const _ = require("lodash");

const { Results } = require("../models/Results");

const viewResult = async (req, res) => {
  try {

    if(!req.isAuthenticated()) return res.status(403).render("error/400", { layout: "error", error: "Bad Request" }); 

    let result = await Results.findOne({ resultId: req.params.id }).lean();

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

    if (req.user.role === "student" && req.user.username !== result.username) {
      return res.status(403).render("results", { layout: "error", error: "Bad Request" });
    }

    if (req.user.role === "student" && result.checked !== true) {
      return res.status(403).render("results", { layout: "error", error: "Bad Request" });
    }

    if (req.user.role === "student") {
      await Results.findByIdAndUpdate(
        result._id,
        { checked: true },
        { new: true }
      );
    }

    return res.render("results", {
      layout: "result",
      result,
      subjects,
      role: req.user.role,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("errors/500", { layout: "error", error: error.message });
  }
};

const viewSecResult = async (req, res) => {
  const newResult = await Results.find({ resultId: req.params.id }).lean();
  let Result = newResult[0];
  res.render("sec-result", { layout: "sec-result", Result });
};

module.exports = {
  viewResult,
  viewSecResult,
};
