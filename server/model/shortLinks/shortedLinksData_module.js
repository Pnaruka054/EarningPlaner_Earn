const mongoose = require('mongoose')

const shortedLinksData_schema = new mongoose.Schema({
    linkName: { type: String, require: true },
    amount: { type: String, require: true },
    startUrl: { type: String, require: true },
    endUrl: { type: String, require: true },
    time: { type: String, require: true }
})

const shortedLinksData_module = mongoose.model('shortedLinksData', shortedLinksData_schema)

module.exports = shortedLinksData_module