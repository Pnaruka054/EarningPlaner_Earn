const mongoose = require('mongoose');

// Sub-schema jo har dynamic button ke liye structure define karta hai
const buttonSchema = new mongoose.Schema({
  ipAddress: { type: String },
  ipChanges: { type: Number },
  btnClickStatus: { type: Boolean }
}, { _id: false });

// Main schema jismein sirf userDB_id required hai aur buttonNames optional dynamic field hai
const ipAddressRecordSchema = new mongoose.Schema({
  userDB_id: { type: String, required: true },
  buttonNames: {
    type: Map,
    of: buttonSchema
    // Yahan default specify nahi kiya gaya, isliye agar field nahi aata to woh undefined rahegi
  }
});

// Model create karna
const ipAddress_records_module = mongoose.model('ipAddress_record', ipAddressRecordSchema);

module.exports = ipAddress_records_module;
