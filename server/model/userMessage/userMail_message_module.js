const mongoose = require('mongoose')

const userMail_message_schema = new mongoose.Schema({
    name: { type: String, require: true },
    email_address: { type: String, require: true },
    mobile_number: { type: String, require: true },
    subject: { type: String, require: true },
    message: { type: String, require: true }
})

const userMail_message_module = mongoose.model("userMail_message_record", userMail_message_schema)

module.exports = userMail_message_module