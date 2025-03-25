const mongoose = require('mongoose');

const monthSchema = new mongoose.Schema({
    userDB_id: { type: String, required: true },
    monthName: { type: String, required: true },
    earningSources: {
        view_ads: {
            income: { type: String },
        },
        click_short_link: {
            income: { type: String },
        },
        referral_income: {
            income: { type: String },
        },
        offerWall: {
            income: { type: String },
        },
    },
    createdAt: { type: Date, default: Date.now, expires: '1y' } // Data will expire after 1 year
});

const userMonthly_records_module = mongoose.model('Monthly_records', monthSchema);

module.exports = userMonthly_records_module;
