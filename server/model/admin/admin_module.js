const mongoose = require('mongoose')

const admin_schema = new mongoose.Schema({
    adminUserName: { type: String, require: true },
    adminPassword: { type: String, require: true }
})

const admin_module = mongoose.model("admin_data", admin_schema)

module.exports = admin_module