const mongoose = require('mongoose');
const ipAddress_records_module = require('../../model/IPAddress/useripAddresses_records_module');
const { userMonthly_records_module, saveUserMonthlyData } = require("../../model/dashboard/userMonthly_modules");
const userDate_records_module = require("../../model/dashboard/userDate_modules");
const userSignUp_module = require('../../model/userSignUp/userSignUp_module')
const { getAllDatesOfCurrentMonth } = require('../dashboardStatistics/dashboardStatistics')
const referral_records_module = require('../../model/referralRecords/referral_records_module')


const user_adsView_home_get = async (req, res) => {
    const session = await mongoose.startSession(); // Start a session
    session.startTransaction(); // Begin a transaction
    try {
        const date = new Date();
        const currentMonthName = date.toLocaleString('default', { month: 'long' });
        const currentYear = date.getFullYear();
        const monthName = `${currentMonthName} ${currentYear}`; // Format: "January 2024"
        let userData = req.user;
        userData = await userSignUp_module.findById(userData._id).session(session); // Use the session
        let user_ip = req.ip;

        // Fetch user data and monthly record for the current month
        let ipAddress_recordData = await ipAddress_records_module.findOne({ userDB_id: userData._id }).session(session); // Use the session
        let userMonthly_recordData = await userMonthly_records_module.findOne({ userDB_id: userData._id, monthName }).session(session); // Use the session

        // If no record exists, create a new IP address record
        if (!ipAddress_recordData) {
            ipAddress_recordData = new ipAddress_records_module({
                userDB_id: userData._id,
                buttonNames: [],
                ipAddress: user_ip,
            });
        } else if (ipAddress_recordData.ipAddress !== user_ip) {
            ipAddress_recordData.buttonNames = [];
            ipAddress_recordData.ipAddress = user_ip;  // Update IP address
        }

        // Extracting values safely
        const income = userMonthly_recordData.earningSources?.view_ads?.income || 0;
        const clickBalance = userMonthly_recordData.earningSources?.view_ads?.clickBalance || `0/${process.env.VIEW_ADS_CLICK_BALANCE}`;

        // Prepare response data
        const resData = {
            ipAddress_recordData,
            income,
            clickBalance,
            deposit_amount: userData.deposit_amount,
            withdrawable_amount: userData.withdrawable_amount,
            buttonNames: ipAddress_recordData.buttonNames || [],
        };

        // Save the updated ipAddress_recordData within the session
        await ipAddress_recordData.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession(); // End the session

        // Send response
        return res.status(200).json({
            success: true,
            msg: resData
        });

    } catch (error) {
        // Handle errors gracefully
        console.error(error);

        // Abort the transaction if an error occurs
        await session.abortTransaction();
        session.endSession(); // End the session

        return res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
};

const user_adsView_income_patch = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        // Start transaction
        session.startTransaction();

        // Format current month and year (e.g., "January 2024")
        const now = new Date();
        const currentMonthName = now.toLocaleString('default', { month: 'long' });
        const currentYear = now.getFullYear();
        const monthName = `${currentMonthName} ${currentYear}`;

        // Destructure request body and get user IP
        const { disabledButtons_state, clickBalance, btnClickEarn } = req.body;
        const userIp = req.ip;

        // Get user data using _id from req.user
        const userData = await userSignUp_module.findById(req.user._id).session(session);

        // Find referred user and corresponding referral record (if they exist)
        let referredUser = null;
        let referralRecord = null;
        if (userData.refer_by) {
            referredUser = await userSignUp_module.findOne({ userName: userData.refer_by }).session(session);
            console.log(referredUser);
            if (referredUser) {
                referralRecord = await referral_records_module
                    .findOne({ userDB_id: referredUser._id, userName: userData.userName })
                    .session(session);
            }
        }

        // Fetch monthly record and IP address record for the user
        const userMonthlyRecord = await userMonthly_records_module
            .findOne({ userDB_id: userData._id, monthName })
            .session(session);
        const ipAddressRecord = await ipAddress_records_module
            .findOne({ userDB_id: userData._id })
            .session(session);

        // Update records based on IP match
        if (ipAddressRecord.ipAddress === userIp) {
            // Update dynamic button state
            ipAddressRecord.buttonNames = disabledButtons_state;

            // Update monthly income and click balance for view_ads
            const currentIncome = parseFloat(userMonthlyRecord.earningSources.view_ads.income || 0);
            userMonthlyRecord.earningSources.view_ads.income = (currentIncome + parseFloat(btnClickEarn)).toFixed(3);
            userMonthlyRecord.earningSources.view_ads.clickBalance = clickBalance;

            // Update user's withdrawable amount
            const currentWithdrawable = parseFloat(userData.withdrawable_amount || 0);
            userData.withdrawable_amount = (currentWithdrawable + parseFloat(btnClickEarn)).toFixed(3);
        } else {
            // Agar IP match na ho, reset buttonNames and update IP
            ipAddressRecord.buttonNames = [];
            ipAddressRecord.ipAddress = userIp;
        }

        // Save updated documents concurrently
        await Promise.all([
            userMonthlyRecord.save({ session }),
            ipAddressRecord.save({ session }),
            userData.save({ session })
        ]);

        // Update referral data only if referred user and referral record exist
        if (referredUser && referralRecord) {
            const referralIncrement = parseFloat(btnClickEarn) * parseFloat(process.env.REFERRAL_RATE);

            // Update referred user's withdrawable amount
            const currentRefWithdrawable = parseFloat(referredUser.withdrawable_amount || 0);
            referredUser.withdrawable_amount = (currentRefWithdrawable + referralIncrement).toFixed(3);

            // Update referral record income
            const currentReferralIncome = parseFloat(referralRecord.income || 0);
            referralRecord.income = (currentReferralIncome + referralIncrement).toFixed(3);

            await Promise.all([
                referralRecord.save({ session }),
                referredUser.save({ session })
            ]);
        }

        // Commit the transaction and end session
        await session.commitTransaction();
        session.endSession();

        // Prepare response data
        const resData = {
            ipAddress_recordData: ipAddressRecord,
            income: userMonthlyRecord.earningSources.view_ads.income || 0,
            deposit_amount: userData.deposit_amount,
            withdrawable_amount: userData.withdrawable_amount,
            buttonNames: ipAddressRecord.buttonNames,
            clickBalance: userMonthlyRecord.earningSources.view_ads.clickBalance || `0/${process.env.VIEW_ADS_CLICK_BALANCE}`
        };

        return res.status(200).json({
            success: true,
            msg: resData
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error in updating user data:", error);
        return res.status(500).json({ message: 'An error occurred while processing the request.' });
    }
};

module.exports = {
    user_adsView_home_get,
    user_adsView_income_patch
}