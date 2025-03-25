const mongoose = require('mongoose')

const other_data_schema = new mongoose.Schema({
    documentName: { type: String, require: true },
    viewAds_pendingClick: { type: String },
    viewAds_pendingUpdates: { type: String },
    viewAds_instructions: { type: Array, default: undefined },
    shortLink_instructions: { type: Array, default: undefined },
    offerWall_instructions: { type: Array, default: undefined },
    referralRate: { type: String },
    referralPageText: { type: String },
    announcementTitle: { type: String },
    announcementMessage: { type: String },
    announcementTime: { type: String },
    faqQuestioin: { type: String },
    faqAnswer: { type: String },
    withdrawal_instructions: { type: Array, default: undefined },
    withdrawalMethod_name: { type: String },
    withdrawalMethod_minimumAmount: { type: String },
    withdrawalMethod_details: { type: String },
    privacy_policy: { type: String },
    terms_of_use: { type: String },
    dmca: { type: String },
    giftCode: { type: String },
    giftCode_amount: { type: String },
    giftCode_claim_limit: { type: String },
    giftCode_claimed: { type: String },
    viewAds_required: { type: String },
    shortlink_required: { type: String },
    offerWall_required: { type: String },
    giftCode_page_Message: { type: String },
    homepageSection_title: { type: String },
    homepageSection_message: { type: String },
})

const other_data_module = mongoose.model("other_data", other_data_schema)

module.exports = other_data_module