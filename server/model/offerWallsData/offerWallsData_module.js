const mongoose = require('mongoose')

const offerWallsData_schema = new mongoose.Schema({
    offerWallName: { type: String, require: true },
    offerWallApiLink: { type: String, require: true }
})

const offerWallsData_module = mongoose.model('offerWallsData', offerWallsData_schema)

module.exports = offerWallsData_module