const express = require("express");
const router = express.Router();

const {
  viewResult, viewSecResult, viewFindResult, getResultApi, submitForm
} = require("../controllers/resultsController");

router.get('/student/:id', viewResult)
router.get('/student-sec/:id', viewSecResult)
router.get('/', viewFindResult)

router.post('/get-result-api', getResultApi)
router.post('/get-result', submitForm)

module.exports = router;
