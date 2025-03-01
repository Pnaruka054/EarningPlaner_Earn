const getFormattedMonth = require('./getFormattedMonth')
const getFormattedDate = require('./getFormattedDate')
const userSignUp_module = require('../model/userSignUp/userSignUp_module')
const referral_records_module = require('../model/referralRecords/referral_records_module')
const userDate_records_module = require("../model/dashboard/userDate_modules");
const userMonthly_records_module = require("../model/dashboard/userMonthly_modules");
const other_data_module = require('../model/other_data/other_data_module')

const MAX_RETRIES = parseFloat(process.env.MAX_RETRIES) || 3;

const userReferByIncome_handle = async (session, userData, earningAmount, attempt = 0) => {
    const monthName = getFormattedMonth();
    const today = getFormattedDate();
    try {
        if (userData.refer_by) {
            let referredUser = null;
            let referralRecord = null;
            let dateRecords_referBy = null;

            // Fetch referralRate
            const other_data_referralRate = await other_data_module
                .findOne({ documentName: "referralRate" })
                .session(session);
            const referralIncrement = parseFloat(earningAmount) * other_data_referralRate.referralRate;

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
                if (!dateRecords_referBy) {
                    dateRecords_referBy = new userDate_records_module({
                        userDB_id: referredUser._id,
                        monthName,
                        date: today,
                    });
                }
            }

            if (dateRecords_referBy) {
                dateRecords_referBy.referral_earnings = parseFloat(
                    (parseFloat(dateRecords_referBy.referral_earnings || 0) + referralIncrement).toFixed(3)
                );
                dateRecords_referBy.Total_earnings = parseFloat(
                    (parseFloat(dateRecords_referBy.Total_earnings || 0) + referralIncrement).toFixed(3)
                );
                await dateRecords_referBy.save({ session });
            }

            // Update referral data only if referredUser and referralRecord exist
            if (referredUser && referralRecord) {
                // Update referred user's withdrawable amount
                referredUser.withdrawable_amount = parseFloat(
                    (parseFloat(referredUser.withdrawable_amount || 0) + referralIncrement).toFixed(3)
                );
                // Update referral record income
                referralRecord.income = parseFloat(
                    (parseFloat(referralRecord.income || 0) + referralIncrement).toFixed(3)
                );

                let userMonthlyRecord = await userMonthly_records_module
                    .findOne({ userDB_id: referredUser._id, monthName })
                    .session(session);
                if (!userMonthlyRecord) {
                    userMonthlyRecord = new userMonthly_records_module({
                        userDB_id: referredUser._id,
                        monthName,
                        earningSources: { referral_income: { income: 0 } } // Ensure structure exists
                    });
                }

                userMonthlyRecord.earningSources.referral_income.income = parseFloat(
                    (parseFloat(userMonthlyRecord.earningSources.referral_income.income || 0) + referralIncrement).toFixed(3)
                );

                await Promise.all([
                    referralRecord.save({ session }),
                    referredUser.save({ session }),
                    userMonthlyRecord.save({ session })
                ]);
            }
        }
        return { success: true, msg: "Earnings updated successfully" };
    } catch (error) {
        console.error("Error in updateEarnings function:", error);
        const isWriteConflict = error.code === 112 ||
            (error.errorResponse && error.errorResponse.code === 112) ||
            (error.codeName && error.codeName === 'WriteConflict');
        if (isWriteConflict && attempt < MAX_RETRIES) {
            console.log(`Write conflict encountered. Retrying attempt ${attempt + 1}`);
            return await userReferByIncome_handle(session, userData, earningAmount, attempt + 1);
        }
        return { success: false, msg: "Error updating earnings" };
    }
};

const userIncome_handle = async (session, userData, earningAmount, attempt = 0) => {
    const monthName = getFormattedMonth();
    const today = getFormattedDate();
    try {
        // Fetch user's daily record
        let dateRecords = await userDate_records_module
            .findOne({ userDB_id: userData._id, date: today })
            .session(session);
        let userMonthlyRecord = await userMonthly_records_module
            .findOne({ userDB_id: userData._id, monthName })
            .session(session);
        if (!dateRecords) {
            dateRecords = new userDate_records_module({
                userDB_id: userData._id,
                monthName,
                date: today,
            });
        }
        if (!userMonthlyRecord) {
            userMonthlyRecord = new userMonthly_records_module({
                userDB_id: userData._id,
                monthName,
            });
        }

        // Update daily earnings
        dateRecords.self_earnings = (
            parseFloat(dateRecords.self_earnings || 0) + parseFloat(earningAmount)
        ).toFixed(3);
        dateRecords.Total_earnings = (
            parseFloat(dateRecords.Total_earnings || 0) + parseFloat(earningAmount)
        ).toFixed(3);

        // Update user's withdrawable amount
        const currentWithdrawable = parseFloat(userData.withdrawable_amount || 0);
        userData.withdrawable_amount = (
            currentWithdrawable + parseFloat(earningAmount)
        ).toFixed(3);

        return { success: true, values: { dateRecords, userMonthlyRecord } };
    } catch (error) {
        // Check for write conflict errors (transient errors)
        const isWriteConflict =
            error.code === 112 ||
            (error.errorResponse && error.errorResponse.code === 112) ||
            (error.codeName && error.codeName === "WriteConflict");
        if (isWriteConflict && attempt < MAX_RETRIES) {
            console.log(`Write conflict encountered in userIncome_handle. Retrying attempt ${attempt + 1}`);
            return await userIncome_handle(session, userData, earningAmount, attempt + 1);
        }
        console.error("Error in updateEarnings function:", error);
        return { success: false, msg: "Error updating earnings" };
    }
};

module.exports = {
    userReferByIncome_handle,
    userIncome_handle
}