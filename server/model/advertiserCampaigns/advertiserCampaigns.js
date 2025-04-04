const mongoose = require('mongoose');

const advertiserCampaignsSchema = new mongoose.Schema({
    userDB_id: { type: String },
    step_2_title: { type: String },
    step_2_url: { type: String },
    step_2_description: { type: String },
    campaignType: { type: String },
    time: { type: String },
    status: { type: String },
    step_3_amount_for_user: { type: String },
    step_4_subTotal: { type: String },
    spend: { type: String },
    step_3_duration_for_user: { type: Number },
    step_3_total_views: { type: Number },
    completed_total_views: { type: Number },
    step_3_interval_in_hours: { type: Number },
    step_3_enableLimit: { type: Boolean },
    step_3_limitViewsPerDay: { type: Number },
    expiresAt: {
        type: Date,
        expires: 0  // Expiry `expiresAt` field ke according hoga
    }
});

const advertiserCampaigns_module = mongoose.model('advertiserCampaign', advertiserCampaignsSchema);

module.exports = advertiserCampaigns_module