const mongoose = require('mongoose')

const userID_data_for_offerWall_schema = new mongoose.Schema({
    userId: { type: String, require: true },
    userDB_id: { type: String, require: true },
})

const userID_data_for_offerWall_module = mongoose.model("userID_data_for_offerWall", userID_data_for_offerWall_schema)

module.exports = userID_data_for_offerWall_module