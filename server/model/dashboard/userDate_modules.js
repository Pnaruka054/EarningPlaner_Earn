const mongoose = require('mongoose');

const monthSchema = new mongoose.Schema({
    userDB_id: { type: String },
    monthName: { type: String },
    date: { type: String },
    self_earnings: { type: String },
    referral_earnings: { type: String },
    Total_earnings: { type: String },
    createdAt: { type: Date, default: Date.now, expires: '1y' }
});

const userDate_records_module = mongoose.model('userDate_records', monthSchema);

module.exports = userDate_records_module