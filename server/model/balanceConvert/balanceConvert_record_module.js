const mongoose = require('mongoose');

const balanceCOnvertRecordSchema = new mongoose.Schema({
    userDB_id: { type: String },
    converted_amount: { type: String },
    charges: { type: String },
    converted_amount_type: { type: String },
    time: { type: String },
    expireAt: {
        type: Date,
        default: () => new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        index: { expires: '90d' } // TTL Index
    }
});

const balanceConvert_record = mongoose.model('balanceConverte_record', balanceCOnvertRecordSchema);

module.exports = balanceConvert_record;