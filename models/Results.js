const mongoose = require("mongoose");

const ResultsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    session: {
      type: String,
      required: true,
    },
    term: {
      type: String,
      required: true,
    },
    teacher: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true
    },
    student: mongoose.SchemaTypes.ObjectId,
    tcomment: String,
    hcomment: String,
    resDate: String,
    tSubject: String,
    resultId: String,
    resultLink: String,
    token: String,
    approved: {
      type: Boolean,
      default: false
    },
    checked: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: 'Nill'
    }
  },
  {
    timestamps: true,
  }
);

const Results = mongoose.model("Results", ResultsSchema);

module.exports = {Results, ResultsSchema};
