const express = require("express");
const router = express.Router();

const {
  viewResult
} = require("../controllers/resultsController");

router.get('/student/:id', viewResult)

module.exports = router;
