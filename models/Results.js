const mongoose = require("mongoose");

const ResultsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    term: {
      type: String,
      required: true,
    },
    class: {
      type: String,
      required: true,
    },
    chAverage : String,
    clAverage: String,
    perfomance: String,
    tcomment: String,
    hcomment: String,
    resDate: String,
    resultId: String,
    resultLink: String,
  },
  {
    timestamps: true,
  }
);

const Results = mongoose.model("Results", ResultsSchema);

module.exports = {Results, ResultsSchema};
