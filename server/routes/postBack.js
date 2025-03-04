const express = require('express')
const route = express()
const userSignUp_module = require('../model/userSignUp/userSignUp_module')
const userID_data_for_survey_module = require('../model/userID_data_for_survey/userID_data_for_survey_module')
const mongoose = require('mongoose');
const { userReferByIncome_handle, userIncome_handle } = require('../helper/usersEarningsUpdate_handle')


route.get('/postBackCPX', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { mainPostback, bonus, status, trans_id, user_id, amount_local, amount_usd } = req.query;

        if ((mainPostback === 'true' || bonus === 'true') && status === "1" && user_id) {
            console.log(`💰 User ${user_id} earned INR ${amount_local} (USD: ${amount_usd})`);

            const user_id_Found = await userID_data_for_survey_module.findOne({ userId: user_id }).session(session);
            if (!user_id_Found) throw new Error(`User ID not found: ${user_id}`);

            const userData = await userSignUp_module.findById(user_id_Found.userDB_id).session(session);
            if (!userData) throw new Error(`User data not found for ID: ${user_id_Found.userDB_id}`);

            const user_incomeUpdate = await userIncome_handle(session, userData, amount_local);
            if (!user_incomeUpdate.success) throw new Error(user_incomeUpdate.error);

            const refer_by_incomeupdate = await userReferByIncome_handle(session, userData, amount_local);
            if (!refer_by_incomeupdate.success) throw new Error(refer_by_incomeupdate.error);

            const { userMonthlyRecord, dateRecords } = user_incomeUpdate.values;
            if (userMonthlyRecord) {
                userMonthlyRecord.earningSources ||= {};
                userMonthlyRecord.earningSources.fill_survey ||= { income: 0 };

                userMonthlyRecord.earningSources.fill_survey.income = (
                    parseFloat(userMonthlyRecord.earningSources.fill_survey.income || 0) + parseFloat(amount_local)
                ).toFixed(3);
            }

            dateRecords.earningSources.fill_survey.income = (parseFloat(dateRecords.earningSources.fill_survey.income || 0) + parseFloat(amount_local)).toFixed(3);

            await Promise.all([
                userMonthlyRecord?.save({ session }),
                userData.save({ session }),
                dateRecords.save({ session })
            ]);

            await session.commitTransaction();
            console.log("✅ Transaction committed successfully!");
        } else if (status === "2") {
            console.log(`❌ Transaction ${trans_id} (User: ${user_id}) reversed!`);
        }

        res.status(200).send("Postback received");
    } catch (error) {
        console.error("🚨 Postback error:", error.message);
        await session.abortTransaction();
        res.status(500).json({ success: false, message: error.message || "Postback processing failed" });
    } finally {
        session.endSession();
    }
})

route.get('/postBack_theoremreach', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { user_id, reward, status } = req.query;

        if (status === "1" && user_id) {
            console.log(`💰 User ${user_id} earned INR ${reward}`);

            const user_id_Found = await userID_data_for_survey_module.findOne({ userId: user_id }).session(session);
            if (!user_id_Found) throw new Error(`User ID not found: ${user_id}`);

            const userData = await userSignUp_module.findById(user_id_Found.userDB_id).session(session);
            if (!userData) throw new Error(`User data not found for ID: ${user_id_Found.userDB_id}`);

            const user_incomeUpdate = await userIncome_handle(session, userData, reward);
            if (!user_incomeUpdate.success) throw new Error(user_incomeUpdate.error);

            const refer_by_incomeupdate = await userReferByIncome_handle(session, userData, reward);
            if (!refer_by_incomeupdate.success) throw new Error(refer_by_incomeupdate.error);

            const { userMonthlyRecord, dateRecords } = user_incomeUpdate.values;
            if (userMonthlyRecord) {
                userMonthlyRecord.earningSources ||= {};
                userMonthlyRecord.earningSources.fill_survey ||= { income: 0 };

                userMonthlyRecord.earningSources.fill_survey.income = (
                    parseFloat(userMonthlyRecord.earningSources.fill_survey.income || 0) + parseFloat(reward)
                ).toFixed(3);
            }

            dateRecords.earningSources.fill_survey.income = (parseFloat(dateRecords.earningSources.fill_survey.income || 0) + parseFloat(reward)).toFixed(3);

            await Promise.all([
                userMonthlyRecord?.save({ session }),
                userData.save({ session }),
                dateRecords.save({ session })
            ]);

            await session.commitTransaction();
            console.log("✅ Transaction committed successfully!");
        } else if (status === "2") {
            console.log(`❌ Transaction ${trans_id} (User: ${user_id}) reversed!`);
        }

        res.status(200).send("Postback received");
    } catch (error) {
        console.error("🚨 Postback error:", error.message);
        await session.abortTransaction();
        res.status(500).json({ success: false, message: error.message || "Postback processing failed" });
    } finally {
        session.endSession();
    }
})


module.exports = route