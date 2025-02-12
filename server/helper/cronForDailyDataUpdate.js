const cron = require('node-cron');
const userSignUp_module = require('../model/userSignUp/userSignUp_module')
const { userMonthly_records_module } = require('../model/dashboard/userMonthly_modules')
const { createCurrentMonthDocuments } = require("../controllers/dashboardStatistics/dashboardStatistics");


const cronForDaily_MonthlyData_Update = async () => {
    cron.schedule('0 0 * * *', async () => {
        try {
            // Get current month and year (e.g., "January 2024")
            const now = new Date();
            const currentMonthName = now.toLocaleString('default', { month: 'long' });
            const currentYear = now.getFullYear();
            const monthName = `${currentMonthName} ${currentYear}`;

            // Fetch all monthly data for the current month
            const AllMonthlyData = await userMonthly_records_module.find({ monthName });

            if (!AllMonthlyData || AllMonthlyData.length === 0) {
                console.log(`No monthly data found for the month: ${monthName}`);
                return;
            }

            // Ensure VIEW_ADS_CLICK_BALANCE is set
            const clickBalanceLimit = process.env.VIEW_ADS_CLICK_BALANCE;
            if (!clickBalanceLimit) {
                console.error('VIEW_ADS_CLICK_BALANCE is not defined in environment variables');
                return;
            }

            // Update earningSources for each user
            const updatePromises = AllMonthlyData.map(async (data) => {
                if (data.earningSources && data.earningSources.view_ads) {
                    // Update click balance for each record
                    data.earningSources.view_ads.clickBalance = `0/${clickBalanceLimit}`;

                    // Now save the updated document back to the database
                    await userMonthly_records_module.updateOne(
                        { _id: data._id }, // Ensure we target the specific document
                        { $set: { "earningSources.view_ads.clickBalance": data.earningSources.view_ads.clickBalance } }
                    );
                } else {
                    console.log(`Skipping update for data with missing earningSources: ${data._id}`);
                }
            });

            // Wait for all update operations to complete
            await Promise.all(updatePromises);
            console.log("successfully updated daily monthlydata");
        } catch (error) {
            console.error('Error updating monthly data:', error);
        }
    });
};

const cronForMonthly_DataCreateFor_EveryUser = () => {
    cron.schedule('0 0 1 * *', () => {
        createCurrentMonthDocuments();
    });
}

module.exports = {
    cronForDaily_MonthlyData_Update,
    cronForMonthly_DataCreateFor_EveryUser
}