const mongoose = require('mongoose')

const viewAds_directLinksData_schema = new mongoose.Schema({
    adNetworkName: { type: String, require: true },
    buttonTitle: { type: String, require: true },
    amount: { type: String, require: true },
    url: { type: String, require: true },
    isExtension: { type: String },
})

const viewAds_directLinksData_module = mongoose.model("viewAds_directLinksData_record", viewAds_directLinksData_schema)

module.exports = viewAds_directLinksData_module