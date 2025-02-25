const mongoose = require('mongoose');

const ipAddressRecordSchema = new mongoose.Schema({
  userDB_id: { type: String, required: true },
  buttonNames: { type: Array, default: undefined },
  status: { type: Boolean, require: true },
  processCount: { type: Number, require: true },
  ipAddress: { type: String },
  uniqueToken: { type: String },
  shortUrl: { type: String },
  shortnerDomain: { type: String },
  createdAt: { type: Date, default: Date.now, expires: 86400 } // 24 Hours (86400 seconds)
});

const ipAddress_records_module = mongoose.model('ipAddress_record', ipAddressRecordSchema);

module.exports = ipAddress_records_module;
