const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema(
  {
    class: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: 'null'
    },
    password: {
      type: String,
      required: true,
    },
    term: String,
    resDate: String,
    session: String,
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model("Users", UsersSchema);

module.exports = {UsersSchema, Users};