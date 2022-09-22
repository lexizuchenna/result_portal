const express = require("express");
const router = express.Router();
const {isTeacherLoggedIn, isAdminLoggedIn} = require('../middlewares/auth')

const {
  viewResult, viewSecResult, viewFindResult, getResultApi, submitForm,viewTeacherResult, viewAdminResult
} = require("../controllers/resultsController");

router.get('/student/:id', viewResult)
router.get('/student-sec/:id', viewSecResult)
router.get('/', viewFindResult)
router.get('/teacher/view/:id', isTeacherLoggedIn, viewTeacherResult)
router.get('/admin/view/:id', isAdminLoggedIn, viewAdminResult)


router.post('/get-result-api', getResultApi)
router.post('/get-result', submitForm)

module.exports = router;
