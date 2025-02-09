const mongoose = require('mongoose')

const withdrawalMethodsSchema = new mongoose.Schema({
    withdrawal_method: { type: String },
    minimum_amount: { type: String },
    description: { type: String },
})

const withdrawal_methods_module = mongoose.model('withdrawal_method', withdrawalMethodsSchema)

module.exports = withdrawal_methods_module