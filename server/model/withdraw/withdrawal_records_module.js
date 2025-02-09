const mongoose = require('mongoose')

const withdrawalRecordSchema = new mongoose.Schema({
    userDB_id: { type: String },
    balance: { type: String },
    type: { type: String },
    time: { type: String },
    withdrawal_status: { type: String, default: "Pending" },
    withdrawal_method: { type: String },
    withdrawal_account_information: { type: String },
    remark: { type: String },
})

const withdrawal_record = mongoose.model('withdrawal_record', withdrawalRecordSchema)

module.exports = withdrawal_record