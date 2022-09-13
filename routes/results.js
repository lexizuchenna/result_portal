const express = require("express");
const router = express.Router();

const {
  viewResult, viewSecResult
} = require("../controllers/resultsController");

router.get('/student/:id', viewResult)
router.get('/student-sec/:id', viewSecResult)

module.exports = router;
