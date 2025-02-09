const mongoose = require('mongoose')

const referralRecordSchema = new mongoose.Schema({
    userDB_id: { type: String, require: true },
    date: { type: String, require: true },
    userName: { type: String, require: true },
    income: { type: String, require: true },
})

const referral_records_module = mongoose.model('referral_record', referralRecordSchema)

module.exports = referral_records_module