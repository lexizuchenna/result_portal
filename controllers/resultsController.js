const {Results} = require('../models/Results')
const viewResult = async (req, res) => {
    const newResult = await Results.find({resultId: req.params.id}).lean()
    let Result = newResult[0]
    res.render('results', {layout: 'result', Result})
}
const viewSecResult = async (req, res) => {
    const newResult = await Results.find({resultId: req.params.id}).lean()
    let Result = newResult[0]
    res.render('sec-result', {layout: 'sec-result', Result})
}

const viewFindResult = async (req, res) => {
    res.render('checkResult', {layout: 'login'})
}

const getResultApi = async (req, res) => {
    if(!req.body.name || !req.body.className || !req.body.session || req.body.name === '' || req.body.className === '' || req.body.session === '') {
        res.json('Fill all fields')
    } else {
        const Result = await Results.find({name: req.body.name, className: req.body.className, session: req.body.session}).lean()


        res.json(Result)
    }
}

module.exports = {viewResult, viewSecResult, viewFindResult, getResultApi }