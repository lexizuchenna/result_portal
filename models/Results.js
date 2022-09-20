const mongoose = require("mongoose");

const ResultsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true
    },
    teacher: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
    },
    sex: {
      type: String,
      required: true,
    },
    age: {
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
    className: {
      type: String,
      required: true,
    },
    perfomance: String,
    tcomment: String,
    hcomment: String,
    resDate: String,
    resultId: String,
    resultLink: String,
    token: String,
    approved: {
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
