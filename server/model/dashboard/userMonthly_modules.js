const mongoose = require('mongoose');

const monthSchema = new mongoose.Schema({
    userDB_id: { type: String, required: true },
    monthName: { type: String, required: true },
    earningSources: { type: mongoose.Schema.Types.Mixed }, 
    createdAt: { type: Date, default: Date.now, expires: '1y' } // Data will expire after 1 year
});

const userMonthly_modules = mongoose.model('Monthly_records', monthSchema);

async function saveUserMonthlyData(data) {
    try {
        const savedData = await new userMonthly_modules(data).save();
        return savedData;
    } catch (error) {
        console.error('Error saving data:', error);
        throw error;
    }
}

module.exports = { userMonthly_modules, saveUserMonthlyData };