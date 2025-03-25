const mongoose = require('mongoose');

const id_timerRecordSchema = new mongoose.Schema({
  userDB_id: { type: String, required: true },
  click_short_link_domainName: { type: String },
  for_link_shortner_expire_timer: { type: Date },
  for_viewAds_expire_timer: { type: Date },
  expiresAt: {
    type: Date,
    expires: 0  // Expiry `expiresAt` field ke according hoga
  }
});

const idTimer_records_module = mongoose.model('idTimer_record', id_timerRecordSchema);

module.exports = idTimer_records_module;