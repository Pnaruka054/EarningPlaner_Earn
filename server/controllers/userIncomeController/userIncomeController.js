const mongoose = require('mongoose');
const ipAddress_records_module = require('../../model/IPAddress/useripAddresses_records_module');
const { userMonthly_records_module, saveUserMonthlyData } = require("../../model/dashboard/userMonthly_modules");
const userDate_records_module = require("../../model/dashboard/userDate_modules");
const userSignUp_module = require('../../model/userSignUp/userSignUp_module')
const { getAllDatesOfCurrentMonth } = require('../dashboardStatistics/dashboardStatistics')
const referral_records_module = require('../../model/referralRecords/referral_records_module')
const idTimer_records_module = require('../../model/id_timer/id_timer_records_module')
const getFormattedDate = require('../../helper/getFormattedDate')

const user_adsView_home_get = async (req, res) => {
    const session = await mongoose.startSession(); // Start a session
    session.startTransaction(); // Begin a transaction
    try {
        // Format current month and year (e.g., "January 2024")
        const date = new Date();
        const currentMonthName = date.toLocaleString('default', { month: 'long' });
        const currentYear = date.getFullYear();
        const monthName = `${currentMonthName} ${currentYear}`;

        const userData = req.user;
        const user_ip = req.ip;

        // Search for an existing record with the same ipAddress
        let ipAddress_recordData = await ipAddress_records_module
            .findOne({ ipAddress: user_ip })
            .session(session);

        // If no record is found, create a new one
        if (!ipAddress_recordData) {
            ipAddress_recordData = new ipAddress_records_module({
                userDB_id: userData._id,
                buttonNames: [],
                ipAddress: user_ip,
            });
        }

        // Fetch the monthly record for the current month
        let userMonthly_recordData = await userMonthly_records_module
            .findOne({ userDB_id: userData._id, monthName })
            .session(session);

        // Safely extract income and clickBalance
        const income = userMonthly_recordData.earningSources?.view_ads?.income || 0;
        let clickBalance =
            userMonthly_recordData.earningSources?.view_ads?.clickBalance ||
            `0/${process.env.VIEW_ADS_CLICK_BALANCE}`;

        // Prepare response data
        let resData = {
            ipAddress_recordData,
            income,
            clickBalance,
            deposit_amount: userData.deposit_amount,
            withdrawable_amount: userData.withdrawable_amount,
            buttonNames: ipAddress_recordData.buttonNames || [],
        };

        let idTimer_recordsData = await idTimer_records_module.findOne({ userDB_id: userData._id }).session(session)
        if (idTimer_recordsData?.ViewAdsexpireTImer) {
            resData = { ...resData, ViewAdsexpireTImer: idTimer_recordsData.ViewAdsexpireTImer }
            await idTimer_recordsData.save({ session })
        }

        // Save (or update) the ipAddress_recordData document
        await ipAddress_recordData.save({ session });

        // Commit the transaction and end the session
        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success: true,
            msg: resData,
        });
    } catch (error) {
        console.error("Error in user_adsView_home_get:", error);
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({
            message: "An error occurred while processing your request.",
        });
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
        const referralIncrement = parseFloat(btnClickEarn) * parseFloat(process.env.REFERRAL_RATE);
        // Get user data (Assuming req.user is a valid Mongoose document)
        const userData = req.user;

        // Get today's formatted date (Assuming getFormattedDate() is defined elsewhere)
        const today = getFormattedDate();

        // Fetch user's daily record
        const dateRecords = await userDate_records_module
            .findOne({ userDB_id: userData._id, date: today })
            .session(session);

        // Initialize referred user variables
        let referredUser = null;
        let referralRecord = null;
        let dateRecords_referBy = null;

        // If user was referred, fetch referred user, referral record, and their daily record
        if (userData.refer_by) {
            referredUser = await userSignUp_module
                .findOne({ userName: userData.refer_by })
                .session(session);
            if (referredUser) {
                referralRecord = await referral_records_module
                    .findOne({ userDB_id: referredUser._id, userName: userData.userName })
                    .session(session);
                dateRecords_referBy = await userDate_records_module
                    .findOne({ userDB_id: referredUser._id, date: today })
                    .session(session);
            }
        }

        // Update daily earnings if referral exists
        if (dateRecords) {
            dateRecords.self_earnings = (
                parseFloat(dateRecords.self_earnings || 0) + parseFloat(btnClickEarn)
            ).toFixed(3);
        }
        if (dateRecords_referBy) {
            dateRecords_referBy.referral_earnings = (
                parseFloat(dateRecords_referBy.referral_earnings || 0) + referralIncrement
            ).toFixed(3);
        }

        // Fetch monthly record and IP address record for the user
        const userMonthlyRecord = await userMonthly_records_module
            .findOne({ userDB_id: userData._id, monthName })
            .session(session);
        const ipAddressRecord = await ipAddress_records_module
            .findOne({ ipAddress: userIp })
            .session(session);

        // Update records based on IP match
        if (ipAddressRecord.ipAddress === userIp) {
            // Update dynamic button state
            ipAddressRecord.buttonNames = disabledButtons_state;
            ipAddressRecord.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

            // Update monthly income and click balance for view_ads
            const currentIncome = parseFloat(userMonthlyRecord.earningSources.view_ads.income || 0);
            userMonthlyRecord.earningSources.view_ads.income = (
                currentIncome + parseFloat(btnClickEarn)
            ).toFixed(3);
            userMonthlyRecord.earningSources.view_ads.clickBalance = clickBalance;

            // Update user's withdrawable amount
            const currentWithdrawable = parseFloat(userData.withdrawable_amount || 0);
            userData.withdrawable_amount = (
                currentWithdrawable + parseFloat(btnClickEarn)
            ).toFixed(3);
        } else if (ipAddressRecord.ipAddress !== userIp) {
            ipAddressRecord = new ipAddress_records_module({
                userDB_id: userData._id,
                buttonNames: disabledButtons_state,
                ipAddress: userIp,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            });
        }


        // Agar clickBalance exactly equal ho jaye to VIEW_ADS_CLICK_BALANCE/VIEW_ADS_CLICK_BALANCE
        if (
            userMonthlyRecord?.earningSources?.view_ads?.clickBalance ===
            `${process.env.VIEW_ADS_CLICK_BALANCE}/${process.env.VIEW_ADS_CLICK_BALANCE}`
        ) {
            let idTimer_recordsData = await idTimer_records_module.findOne({ userDB_id: userData._id }).session(session);

            if (!idTimer_recordsData) {
                idTimer_recordsData = new idTimer_records_module({ userDB_id: userData._id });
                await idTimer_recordsData.save({ session }); // Save the new record to the database
            }

            idTimer_recordsData.ViewAdsexpireTImer = new Date(Date.now() + (24 * 60 * 60 * 1000));
            await idTimer_recordsData.save({ session });

        }

        // Save updated documents concurrently
        const saveOperations = [
            userMonthlyRecord.save({ session }),
            ipAddressRecord.save({ session }),
            userData.save({ session })
        ];
        if (dateRecords) saveOperations.push(dateRecords.save({ session }));
        if (dateRecords_referBy) saveOperations.push(dateRecords_referBy.save({ session }));

        await Promise.all(saveOperations);

        // Update referral data only if referred user and referral record exist
        if (referredUser && referralRecord) {

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

        // Commit transaction and end session
        await session.commitTransaction();
        session.endSession();

        // Prepare response data
        const resData = {
            ipAddress_recordData: ipAddressRecord,
            income: userMonthlyRecord.earningSources.view_ads.income || 0,
            deposit_amount: userData.deposit_amount,
            withdrawable_amount: userData.withdrawable_amount,
            buttonNames: ipAddressRecord.buttonNames,
            clickBalance:
                userMonthlyRecord.earningSources.view_ads.clickBalance ||
                `0/${process.env.VIEW_ADS_CLICK_BALANCE}`
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