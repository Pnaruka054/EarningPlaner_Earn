const mongoose = require('mongoose');

const ipAddressRecordSchema = new mongoose.Schema({
  userDB_id: { type: String, required: true },
  buttonNames: [],
  ipAddress: { type: String },
  expiresAt: { type: Date } //auto delete after 24hrs on perticuler route
});

const ipAddress_records_module = mongoose.model('ipAddress_record', ipAddressRecordSchema);

module.exports = ipAddress_records_module;
