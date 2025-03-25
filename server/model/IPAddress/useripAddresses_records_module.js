const mongoose = require('mongoose');

const ipAddressRecordSchema = new mongoose.Schema({
  userDB_id: { type: String },
  buttonNames: { type: Array, default: undefined },
  status: { type: Boolean },
  processCount: { type: Number },
  ipAddress: { type: String },
  uniqueToken: { type: String },
  shortUrl: { type: String },
  shortnerDomain: { type: String },
  createdAt: { type: Date, default: Date.now, expires: 86400 } 
});

const ipAddress_records_module = mongoose.model('ipAddress_record', ipAddressRecordSchema);

module.exports = ipAddress_records_module;
