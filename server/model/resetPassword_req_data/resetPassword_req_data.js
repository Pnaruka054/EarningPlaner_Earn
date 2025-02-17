const mongoose = require('mongoose');

const resetPasswordSchema = new mongoose.Schema({
    userDB_id: { type: String, required: true },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 600 } // 600 seconds = 10 minutes
});

// `expires` ka use karke 10 minute baad document ko automatically delete karne ke liye
const resetPassword_req_data = mongoose.model('resetPassword_req_data', resetPasswordSchema);

module.exports = resetPassword_req_data;
