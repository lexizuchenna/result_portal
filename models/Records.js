const mongoose = require("mongoose");

const RecordsSchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId
  } , 
  year: {
      type: String,
      // required: true,
    },
    term: {
      type: String,
      // required: true,
    },
    sub1: {
      type: String,
    },
    resDate: String
  },
  {
    timestamps: true,
  },
  { strict: false });

const Records = mongoose.model("Records", RecordsSchema);

module.exports = {
  Records,
  RecordsSchema,
};
