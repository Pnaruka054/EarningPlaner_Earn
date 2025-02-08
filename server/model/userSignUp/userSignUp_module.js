const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: { type: String, require: true },
    mobile_number: { type: Number, require: true },
    email_address: { type: String, require: true },
    password: { type: String },
    withdrawable_amount: { type: String },
    deposit_amount: { type: String },
    pending_withdrawal_amount: { type: String },
    total_withdrawal_amount: { type: String },
    withdrawal_account_information: { type: String },
    refer_by: { type: String },
    withdrawal_method: { type: String },
    zip_code: { type: Number },
    state: { type: String },
    city: { type: String },
    userName: { type: String },
    address: { type: String },
    google_id: { type: String }
})

const userSignUp_module = mongoose.model('userSignUp', userSchema)

module.exports = userSignUp_module