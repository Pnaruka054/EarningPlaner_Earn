const mongoose = require('mongoose');

const monthSchema = new mongoose.Schema({
    userDB_id: { type: String, required: true },
    monthName: { type: String, required: true },
    earningSources: {
        view_ads: {
            income: { type: Number },
            clickBalance: { type: Number },
        },
    },
    createdAt: { type: Date, default: Date.now, expires: '1y' } // Data will expire after 1 year
});

const userMonthly_records_module = mongoose.model('Monthly_records', monthSchema);

async function saveUserMonthlyData(data) {
    try {
        const savedData = await new userMonthly_records_module(data).save();
        return savedData;
    } catch (error) {
        console.error('Error saving data:', error);
        throw error;
    }
}

module.exports = { userMonthly_records_module, saveUserMonthlyData };