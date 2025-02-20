const mongoose = require('mongoose')

const shortedLinksData_schema = new mongoose.Schema({
    shortnerName: { type: String, require: true },
    amount: { type: String, require: true },
    shortnerDomain: { type: String, require: true },
    time: { type: String, require: true },
    shortnerApiLink: { type: String, require: true }
})

const shortedLinksData_module = mongoose.model('shortedLinksData', shortedLinksData_schema)

module.exports = shortedLinksData_module