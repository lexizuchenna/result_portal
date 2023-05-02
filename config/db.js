const express = require("express");
const mongoose = require("mongoose");

const app = express();

const connectDB = async (MONGOURI) => {
  try {
    const conn = await mongoose.connect(MONGOURI);
    console.log(`MongoDB Connected to ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    app.get("/error", (req, res) => {
      return res
        .status(500)
        .render("errors/500", { layout: "error", error: error.message });
    });
  }
};

module.exports = connectDB;
