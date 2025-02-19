const mongoose = require('mongoose');

const ipAddressRecordSchema = new mongoose.Schema({
  userDB_id: { type: String, required: true },
  buttonNames: { type: Array, default: undefined },
  shortUrl: { type: String, require: true },
  status: { type: String, require: true },
  processCount: { type: Number, require: true },
  ipAddress: { type: String },
  createdAt: { type: Date, default: Date.now, expires: 86400 } // 24 Hours (86400 seconds)
});

const ipAddress_records_module = mongoose.model('ipAddress_record', ipAddressRecordSchema);

module.exports = ipAddress_records_module;
