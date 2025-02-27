const mongoose = require('mongoose')

const other_data_schema = new mongoose.Schema({
    documentName: { type: String, require: true },
    viewAds_pendingClick: { type: String },
    viewAds_instructions: { type: Array },
    shortLink_pendingClick: { type: String },
    shortLink_instructions: { type: Array },
    referralRate: { type: String },
    referralPageText: { type: String },
    announcementTitle: { type: String },
    announcementMessage: { type: String },
    announcementTime: { type: String },
    faqQuestioin: { type: String },
    faqAnswer: { type: String },
    withdrawalMethod_name: { type: String },
    withdrawalMethod_minimumAmount: { type: String },
    withdrawalMethod_details: { type: String }
})

const other_data_module = mongoose.model("other_data", other_data_schema)

module.exports = other_data_module