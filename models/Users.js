const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema(
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
    gender: String,
    role: {
      type: String,
      default: "teacher",
    },
    email: {
      type: String,
      default: "null@schoolportal.com",
    },
    password: {
      type: String,
      required: true,
    },
    term: String,
    resDate: String,
    session: String,
    token: String,
    teacher: mongoose.Types.ObjectId,
    results: []
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model("Users", UsersSchema);

module.exports = { UsersSchema, Users };
