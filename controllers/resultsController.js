const {Results} = require('../models/Results')
const viewResult = async (req, res) => {
    const newResult = await Results.find({resultId: req.params.id}).lean()
    let Result = newResult[0]
    res.render('results', {layout: 'result', Result})
}

module.exports = {viewResult}