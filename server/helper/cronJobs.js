const cron = require('node-cron');
const other_data_module = require('../model/other_data/other_data_module')


const cronForDaily_midNight_update = async () => {
    cron.schedule("0 0 * * *", async () => {
        try {
            console.log("Cron Job Started: Updating viewAds_pendingClick...");
            const other_data_viewAds_limit = await other_data_module.findOne({ documentName: "viewAds" });
            const other_data_shortLink_limit = await other_data_module.findOne({ documentName: "shortLink" });

            other_data_viewAds_limit.viewAds_pendingClick = other_data_viewAds_limit?.viewAds_pendingUpdates;
            other_data_shortLink_limit.shortLink_pendingClick = other_data_shortLink_limit?.shortLink_pendingUpdates;

            await other_data_viewAds_limit.save();
            await other_data_shortLink_limit.save();
            console.log("✅ Successfully updated viewAds_pendingClick at midnight.");
        } catch (error) {
            console.error("❌ Error updating viewAds_pendingClick:", error);
        }
    });
};

module.exports = {
    cronForDaily_midNight_update,
}