const cron = require('node-cron');
const other_data_module = require('../model/other_data/other_data_module')
const mongoose = require('mongoose');

const cronForDaily_midNight_update = async () => {
    cron.schedule("0 0 * * *", async () => {
        try {
            console.log("Cron Job Started: Updating viewAds_pendingClick...");

            // Ensure DB connection is active
            if (mongoose.connection.readyState !== 1) {
                console.log("⚠️ Reconnecting to Database...");
                await mongoose.connect(process.env.DATABASE_URL);
                console.log('Database connected successfully');
            }

            const other_data_viewAds_limit = await other_data_module.findOne({ documentName: "viewAds" });
            const other_data_shortLink_limit = await other_data_module.findOne({ documentName: "shortLink" });

            if (!other_data_viewAds_limit || !other_data_shortLink_limit) {
                console.log("⚠️ No documents found!");
                return;
            }

            other_data_viewAds_limit.viewAds_pendingClick = other_data_viewAds_limit?.viewAds_pendingUpdates;
            other_data_shortLink_limit.shortLink_pendingClick = other_data_shortLink_limit?.shortLink_pendingUpdates;

            await other_data_viewAds_limit.save();
            await other_data_shortLink_limit.save();

            console.log("✅ Successfully updated pendingClick at midnight.");
        } catch (error) {
            console.error("❌ Error updating pendingClick:", error);
        }
    }, {
        timezone: "Asia/Kolkata" // Ya jis timezone me aapka expected midnight ho
    });
};


module.exports = {
    cronForDaily_midNight_update,
}