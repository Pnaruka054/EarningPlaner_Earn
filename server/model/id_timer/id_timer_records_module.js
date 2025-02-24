const mongoose = require('mongoose');

const id_timerRecordSchema = new mongoose.Schema({
  userDB_id: { type: String, required: true },
  viewAdsexpireTimer: { type: Date } //auto delete after 24hrs on perticuler route
});

const idTimer_records_module = mongoose.model('idTimer_record', id_timerRecordSchema);

module.exports = idTimer_records_module;