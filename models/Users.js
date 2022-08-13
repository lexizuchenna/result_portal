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
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model("Users", UsersSchema);

module.exports = Users;