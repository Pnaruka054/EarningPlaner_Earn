const mongoose = require('mongoose')

const other_data_schema = new mongoose.Schema({
    documentName: { type: String, require: true },
    viewAds_pendingClick: { type: String },
    shortLink_pendingClick: { type: String },
    referralRate: { type: String }
})

const other_data_module = mongoose.model("other_data", other_data_schema)

module.exports = other_data_module