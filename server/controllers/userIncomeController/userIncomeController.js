const ipAddress_records_module = require('../../model/IPAddress/useripAddresses_records_module');
const { userMonthly_records_module, saveUserMonthlyData } = require("../../model/dashboard/userMonthly_modules");
const userDate_records_module = require("../../model/dashboard/userDate_modules");
const userSignUp_module = require('../../model/userSignUp/userSignUp_module')
const { getAllDatesOfCurrentMonth } = require('../dashboardStatistics/dashboardStatistics')

const user_adsView_home_get = async (req, res) => {
    try {
        const date = new Date();
        const currentMonthName = date.toLocaleString('default', { month: 'long' });
        const currentYear = date.getFullYear();
        const monthName = `${currentMonthName} ${currentYear}`; // Format: "January 2024"
        let userData = req.user;
        userData = await userSignUp_module.findById(userData._id)

        // Fetch user data and monthly record for the current month
        let ipAddress_recordData = await ipAddress_records_module.findOne({ userDB_id: userData._id });
        let userMonthly_recordData = await userMonthly_records_module.findOne({ userDB_id: userData._id, monthName });

        // Extracting values safely
        const income = userMonthly_recordData.earningSources?.view_ads?.income || 0;
        const clickBalance = userMonthly_recordData.earningSources?.view_ads?.clickBalance || 0;

        // Prepare response data
        const resData = {
            ipAddress_recordData,
            income,
            clickBalance,
            deposit_amount: userData.deposit_amount,
            withdrawable_amount: userData.withdrawable_amount
        };

        // Send response
        return res.status(200).json({
            success: true,
            msg: resData
        });

    } catch (error) {
        // Handle errors gracefully
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
};

const user_adsView_income_patch = async (req, res) => {
    try {

    } catch (error) {

    }
}

module.exports = {
    user_adsView_home_get,
    user_adsView_income_patch
}