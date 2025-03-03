const mongoose = require('mongoose');

const userGiftCode_history_Schema = new mongoose.Schema({
    userDB_id: { type: String, required: true },
    giftCode: { type: String, required: true },
    bonusAmount: { type: String, required: true },
    time: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 2592000 } // 2592000 seconds = 30 days
});

// `expires` ka use karke 10 minute baad document ko automatically delete karne ke liye
const userGiftCode_history_module = mongoose.model('userGiftCode_history_data', userGiftCode_history_Schema);

module.exports = userGiftCode_history_module;
