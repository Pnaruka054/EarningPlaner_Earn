const mongoose = require('mongoose');

const userDateSchema = new mongoose.Schema({
    userDB_id: { type: String },
    monthName: { type: String },
    date: { type: String },
    self_earnings: { type: String },
    referral_earnings: { type: String },
    Total_earnings: { type: String },
    earningSources: {
        view_ads: {
            income: { type: String },
            pendingClick: { type: String },
        },
        click_short_link: {
            income: { type: String },
            pendingClick: { type: String },
        },
        referral_income: {
            income: { type: String },
        },
        fill_survey: {
            income: { type: String },
        },
    },
    createdAt: { type: Date, default: Date.now, expires: '1y' }
});

const userDate_records_module = mongoose.model('userDate_records', userDateSchema);

module.exports = userDate_records_module