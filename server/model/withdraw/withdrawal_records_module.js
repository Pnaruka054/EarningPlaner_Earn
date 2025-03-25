const mongoose = require('mongoose');

const withdrawalRecordSchema = new mongoose.Schema({
    userDB_id: { type: String },
    balance: { type: String },
    type: { type: String },
    time: { type: String },
    withdrawal_status: { type: String, default: "Pending" },
    withdrawal_method: { type: String },
    withdrawal_account_information: { type: String },
    remark: { type: String },
    expireAt: { type: Date, default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), index: { expires: '365d' } } // TTL Index
});

const withdrawal_record = mongoose.model('withdrawal_record', withdrawalRecordSchema);

module.exports = withdrawal_record;