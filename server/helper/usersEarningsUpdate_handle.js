const getFormattedMonth = require('./getFormattedMonth')
const getFormattedDate = require('./getFormattedDate')
const userSignUp_module = require('../model/userSignUp/userSignUp_module')
const referral_records_module = require('../model/referralRecords/referral_records_module')
const userDate_records_module = require("../model/dashboard/userDate_modules");
const { userMonthly_records_module, saveUserMonthlyData } = require("../model/dashboard/userMonthly_modules");

const userReferByIncome_handle = async (session, userData, earningAmount) => {
    const monthName = getFormattedMonth();
    const today = getFormattedDate();
    try {
        if (userData.refer_by) {
            let referredUser = null;
            let referralRecord = null;
            let dateRecords_referBy = null;

            const referralIncrement = parseFloat(earningAmount) * parseFloat(process.env.REFERRAL_RATE);

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
                    dateRecords_referBy = await new userDate_records_module({
                        userDB_id: referredUser._id,
                        monthName,
                        date: today,
                    })
                }
            }

            if (dateRecords_referBy) {
                dateRecords_referBy.referral_earnings = (
                    parseFloat(dateRecords_referBy.referral_earnings || 0) + referralIncrement
                ).toFixed(3);

                dateRecords_referBy.Total_earnings = (
                    parseFloat(dateRecords_referBy.Total_earnings || 0) + referralIncrement
                ).toFixed(3);
                dateRecords_referBy.save({ session })
            }

            // Update referral data only if referred user and referral record exist
            if (referredUser && referralRecord) {

                // Update referred user's withdrawable amount
                const currentRefWithdrawable = parseFloat(referredUser.withdrawable_amount || 0);
                referredUser.withdrawable_amount = (currentRefWithdrawable + referralIncrement).toFixed(3);

                // Update referral record income
                const currentReferralIncome = parseFloat(referralRecord.income || 0);
                referralRecord.income = (currentReferralIncome + referralIncrement).toFixed(3);

                let userMonthlyRecord = await userMonthly_records_module
                .findOne({ userDB_id: dateRecords_referBy._id, monthName })
                .session(session);
                if (!userMonthlyRecord) {
                    userMonthlyRecord = new userMonthly_records_module({
                        userDB_id: dateRecords_referBy._id,
                        monthName,
                    });
                }

                let currentMonthlyReferralIncome = parseFloat(userMonthlyRecord.earningSources.referral_income.income || 0);
                userMonthlyRecord.earningSources.referral_income.income = (currentMonthlyReferralIncome + referralIncrement).toFixed(3);

                await Promise.all([
                    referralRecord.save({ session }),
                    referredUser.save({ session }),
                    userMonthlyRecord.save({session})
                ]);
            }

            return { success: true, msg: "Earnings updated successfully" };
        }
    } catch (error) {
        console.error("Error in updateEarnings function:", error);
        return { success: false, msg: "Error updating earnings" };
    }
};

const userIncome_handle = async (session, userData, earningAmount) => {
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

        // Update daily earnings if referral exists
        if (dateRecords) {
            dateRecords.self_earnings = (
                parseFloat(dateRecords.self_earnings || 0) + parseFloat(earningAmount)
            ).toFixed(3);

            dateRecords.Total_earnings = (
                parseFloat(dateRecords.Total_earnings || 0) + parseFloat(earningAmount)
            ).toFixed(3);
        }

        const currentWithdrawable = parseFloat(userData.withdrawable_amount || 0);
        userData.withdrawable_amount = (
            currentWithdrawable + parseFloat(earningAmount)
        ).toFixed(3);

        if (dateRecords) dateRecords.save({ session });
        return { success: true, values: { userMonthlyRecord } };
    } catch (error) {
        console.error("Error in updateEarnings function:", error);
        return { success: false, msg: "Error updating earnings" };
    }
};

module.exports = {
    userReferByIncome_handle,
    userIncome_handle
}