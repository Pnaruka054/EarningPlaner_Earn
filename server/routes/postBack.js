const express = require('express')
const route = express()
const userSignUp_module = require('../model/userSignUp/userSignUp_module')
const userID_data_for_survey_module = require('../model/userID_data_for_offerWall/userID_data_for_offerWall_module')
const mongoose = require('mongoose');
const { userReferByIncome_handle, userIncome_handle } = require('../helper/usersEarningsUpdate_handle')
const crypto = require('crypto');
const multer = require('multer');
const upload = multer();
const MAX_RETRIES = parseFloat(process.env.MAX_RETRIES) || 3;

route.get('/postBackCPX', async (req, res) => {
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { mainPostback, bonus, status, user_id, amount_local, amount_usd } = req.query;

            if ((mainPostback === 'true' || bonus === 'true') && status === "1" && user_id) {
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
                    userMonthlyRecord.earningSources.offerWall ||= { income: 0 };

                    userMonthlyRecord.earningSources.offerWall.income = (
                        parseFloat(userMonthlyRecord.earningSources.offerWall.income || 0) + parseFloat(amount_local)
                    ).toFixed(3);
                }

                dateRecords.earningSources.offerWall.income = (
                    parseFloat(dateRecords.earningSources.offerWall.income || 0) + parseFloat(amount_local)
                ).toFixed(3);
                dateRecords.earningSources.offerWall.completed = (
                    parseFloat(dateRecords.earningSources.offerWall.completed || 0) + 1
                ).toString();

                await Promise.all([
                    userMonthlyRecord?.save({ session }),
                    userData.save({ session }),
                    dateRecords.save({ session })
                ]);

                await session.commitTransaction();
                session.endSession();
                return res.status(200).json({ success: true, message: "Postback received" });

            } else if (status === "2") {
                await session.commitTransaction();
                session.endSession();
                return res.status(200).json({ success: true, message: "Transaction reversed" });
            }

        } catch (error) {
            await session.abortTransaction();
            session.endSession();

            // Conflict handling (Retry logic)
            const isWriteConflict = error.code === 112 ||
                (error.errorResponse && error.errorResponse.code === 112) ||
                (error.codeName && error.codeName === 'WriteConflict');

            if (isWriteConflict) {
                attempt++;
                if (attempt < MAX_RETRIES) continue;
            }

            return res.status(500).json({ success: false, message: error.message || "Postback processing failed" });
        }
    }

    return res.status(500).json({ success: false, message: "Max retry attempts reached. Please try again later." });
});

route.get('/postBack_theoremreach', async (req, res) => {
    let attempts = 0;

    while (attempts < MAX_RETRIES) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { user_id, reward, status } = req.query;

            if (status === "1" && user_id) {
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
                    userMonthlyRecord.earningSources.offerWall ||= { income: 0 };

                    userMonthlyRecord.earningSources.offerWall.income = (
                        parseFloat(userMonthlyRecord.earningSources.offerWall.income || 0) + parseFloat(reward)
                    ).toFixed(3);
                }

                dateRecords.earningSources.offerWall.income = (
                    parseFloat(dateRecords.earningSources.offerWall.income || 0) + parseFloat(reward)
                ).toFixed(3);
                dateRecords.earningSources.offerWall.completed = (
                    parseFloat(dateRecords.earningSources.offerWall.completed || 0) + 1
                ).toString();

                await Promise.all([
                    userMonthlyRecord?.save({ session }),
                    userData.save({ session }),
                    dateRecords.save({ session })
                ]);

                await session.commitTransaction();
                session.endSession();
                return res.status(200).send("Postback received");

            } else if (status === "2") {
                await session.commitTransaction();
                session.endSession();
                return res.status(200).send("Transaction reversed");
            }
        } catch (error) {
            await session.abortTransaction();
            session.endSession();

            const isWriteConflict = error.code === 112 ||
                (error.errorResponse && error.errorResponse.code === 112) ||
                (error.codeName && error.codeName === 'WriteConflict');

            if (isWriteConflict) {
                attempts++;
                if (attempts < MAX_RETRIES) continue;
            }

            return res.status(500).json({ success: false, message: error.message || "Postback processing failed" });
        }
    }

    return res.status(500).json({ success: false, message: "Transaction failed after multiple attempts" });
});

route.post('/postback_offerwallmedia', upload.none(), async (req, res) => {
    let attempts = 0;

    while (attempts < MAX_RETRIES) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const { subId, transId, reward, signature, status } = req.body;
            const SECRET_KEY = "313c2275666c55ddf40bb6bceb9771ae"; // Offerwallmedia secret key

            // ✅ **Check Missing Parameters**
            if (!subId || !transId || !reward || !signature) {
                return res.status(400).json({ success: false, message: "Missing parameters" });
            }

            // ✅ **Signature Validation**
            const calculatedSignature = crypto.createHash('md5').update(subId + transId + reward + SECRET_KEY).digest("hex");
            if (calculatedSignature !== signature) {
                return res.status(403).json({ success: false, message: "ERROR: Signature doesn't match" });
            }

            if (status === "1") {
                const user_id_Found = await userID_data_for_survey_module.findOne({ userId: subId }).session(session);
                if (!user_id_Found) throw new Error(`User ID not found: ${subId}`);

                const userData = await userSignUp_module.findById(user_id_Found.userDB_id).session(session);
                if (!userData) throw new Error(`User data not found for ID: ${user_id_Found.userDB_id}`);

                const user_incomeUpdate = await userIncome_handle(session, userData, reward);
                if (!user_incomeUpdate.success) throw new Error(user_incomeUpdate.error);

                const refer_by_incomeupdate = await userReferByIncome_handle(session, userData, reward);
                if (!refer_by_incomeupdate.success) throw new Error(refer_by_incomeupdate.error);

                const { userMonthlyRecord, dateRecords } = user_incomeUpdate.values;
                if (userMonthlyRecord) {
                    userMonthlyRecord.earningSources ||= {};
                    userMonthlyRecord.earningSources.offerWall ||= { income: 0 };

                    userMonthlyRecord.earningSources.offerWall.income = (
                        parseFloat(userMonthlyRecord.earningSources.offerWall.income || 0) + parseFloat(reward)
                    ).toFixed(3);
                }

                dateRecords.earningSources.offerWall.income = (
                    parseFloat(dateRecords.earningSources.offerWall.income || 0) + parseFloat(reward)
                ).toFixed(3);
                dateRecords.earningSources.offerWall.completed = (
                    parseFloat(dateRecords.earningSources.offerWall.completed || 0) + 1
                ).toString();

                await Promise.all([
                    userMonthlyRecord?.save({ session }),
                    userData.save({ session }),
                    dateRecords.save({ session })
                ]);

                await session.commitTransaction();
                session.endSession();
                return res.status(200).json({ success: true, message: "Postback processed successfully" });

            } else if (status === "2") {
                await session.commitTransaction();
                session.endSession();
                return res.status(200).json({ success: true, message: "Chargeback processed successfully" });
            }
        } catch (error) {
            await session.abortTransaction();
            session.endSession();

            const isWriteConflict = error.code === 112 ||
                (error.errorResponse && error.errorResponse.code === 112) ||
                (error.codeName && error.codeName === 'WriteConflict');

            if (isWriteConflict) {
                attempts++;
                if (attempts < MAX_RETRIES) continue;
            }

            return res.status(500).json({ success: false, message: error.message || "Postback processing failed" });
        }
    }

    return res.status(500).json({ success: false, message: "Transaction failed after multiple attempts" });
});

route.post('/postback_ewall', upload.none(), async (req, res) => {
    const SECRET_KEY = "8a8f90e3076f83bc909c1c2c0d962d40"; // ewall se milne wala secret key

    let retryCount = 0;
    while (retryCount < MAX_RETRIES) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { subId, transId, reward, signature, status } = req.body;

            // ✅ Missing parameters check
            if (!subId || !transId || !reward || !signature) {
                return res.status(400).json({ success: false, message: "Missing parameters" });
            }

            // ✅ **Signature Validate Karna**
            const calculatedSignature = crypto.createHash('md5').update(subId + transId + reward + SECRET_KEY).digest("hex");

            if (calculatedSignature !== signature) {
                return res.status(403).json({ success: false, message: "ERROR: Signature doesn't match" });
            }

            // ✅ **Database me reward update karna**
            if (status === "1") {
                console.log(`💰 User ${subId} earned INR ${reward}`);

                const user_id_Found = await userID_data_for_survey_module.findOne({ userId: subId }).session(session);
                if (!user_id_Found) throw new Error(`User ID not found: ${subId}`);

                const userData = await userSignUp_module.findById(user_id_Found.userDB_id).session(session);
                if (!userData) throw new Error(`User data not found for ID: ${user_id_Found.userDB_id}`);

                const user_incomeUpdate = await userIncome_handle(session, userData, reward);
                if (!user_incomeUpdate.success) throw new Error(user_incomeUpdate.error);

                const refer_by_incomeupdate = await userReferByIncome_handle(session, userData, reward);
                if (!refer_by_incomeupdate.success) throw new Error(refer_by_incomeupdate.error);

                const { userMonthlyRecord, dateRecords } = user_incomeUpdate.values;
                if (userMonthlyRecord) {
                    userMonthlyRecord.earningSources ||= {};
                    userMonthlyRecord.earningSources.offerWall ||= { income: 0 };

                    userMonthlyRecord.earningSources.offerWall.income = (
                        parseFloat(userMonthlyRecord.earningSources.offerWall.income || 0) + parseFloat(reward)
                    ).toFixed(3);
                }

                dateRecords.earningSources.offerWall.income = (parseFloat(dateRecords.earningSources.offerWall.income || 0) + parseFloat(reward)).toFixed(3);
                dateRecords.earningSources.offerWall.completed = (parseFloat(dateRecords.earningSources.offerWall.completed || 0) + 1).toString();

                await Promise.all([
                    userMonthlyRecord?.save({ session }),
                    userData.save({ session }),
                    dateRecords.save({ session })
                ]);

                await session.commitTransaction();
                console.log("✅ Transaction committed successfully!");
            } else if (status === "2") {
                console.log(`❌ Chargeback: Reward ${reward} deducted from user ${subId}`);
            }

            await session.commitTransaction();
            session.endSession();
            return res.status(200).json({ success: true, message: "Postback processed successfully" });

        } catch (error) {
            console.error(`🚨 Postback error (Attempt ${retryCount + 1}):`, error.message);
            await session.abortTransaction();
            session.endSession();

            // Agar WriteConflict error aati hai, to retry karna
            if (error.message.includes("WriteConflict") || error.code === 112) {
                retryCount++;
                console.warn(`🔄 Retrying transaction... (Attempt ${retryCount})`);
                await new Promise(resolve => setTimeout(resolve, 500)); // Thoda wait karein phir retry karein
            } else {
                return res.status(500).json({ success: false, message: error.message || "Postback processing failed" });
            }
        }
    }

    // Agar maximum retries ke baad bhi transaction fail ho gayi
    return res.status(500).json({ success: false, message: "Transaction failed after multiple retries" });
});

route.get("/postback_excentiv", async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userid, transactionid, reward, secret, status } = req.query;
        const SECRET_KEY = "hKs1i8Pw9cJfLUpNIn3MkDa0rTmGWx";

        if (!userid || !transactionid || !reward || !secret) {
            throw new Error("Missing parameters");
        }

        const calculatedSignature = crypto.createHash("md5").update(userid + transactionid + reward + SECRET_KEY).digest("hex");
        if (calculatedSignature !== secret) {
            throw new Error("Signature doesn't match");
        }

        let retryCount = 0;
        while (retryCount < MAX_RETRIES) {
            try {
                if (status === "1") {
                    const user_id_Found = await userID_data_for_survey_module.findOne({ userId: userid }).session(session);
                    if (!user_id_Found) throw new Error(`User ID not found: ${userid}`);

                    const userData = await userSignUp_module.findById(user_id_Found.userDB_id).session(session);
                    if (!userData) throw new Error(`User data not found for ID: ${user_id_Found.userDB_id}`);

                    const user_incomeUpdate = await userIncome_handle(session, userData, reward);
                    if (!user_incomeUpdate.success) throw new Error(user_incomeUpdate.error);

                    const refer_by_incomeupdate = await userReferByIncome_handle(session, userData, reward);
                    if (!refer_by_incomeupdate.success) throw new Error(refer_by_incomeupdate.error);

                    const { userMonthlyRecord, dateRecords } = user_incomeUpdate.values;
                    if (userMonthlyRecord) {
                        userMonthlyRecord.earningSources ||= {};
                        userMonthlyRecord.earningSources.offerWall ||= { income: 0 };
                        userMonthlyRecord.earningSources.offerWall.income = (
                            parseFloat(userMonthlyRecord.earningSources.offerWall.income || 0) + parseFloat(reward)
                        ).toFixed(3);
                    }

                    dateRecords.earningSources.offerWall.income = (
                        parseFloat(dateRecords.earningSources.offerWall.income || 0) + parseFloat(reward)
                    ).toFixed(3);

                    dateRecords.earningSources.offerWall.completed = (
                        parseFloat(dateRecords.earningSources.offerWall.completed || 0) + 1
                    ).toString();

                    await Promise.all([
                        userMonthlyRecord?.save({ session }),
                        userData.save({ session }),
                        dateRecords.save({ session })
                    ]);
                } else if (status === "2") {
                    // Chargeback handling logic (if needed)
                }

                await session.commitTransaction();
                return res.status(200).json({ success: true, message: "Postback processed successfully" });

            } catch (error) {
                if (error.message.includes("WriteConflict") && retryCount < 2) {
                    retryCount++;
                    await session.abortTransaction();
                    await new Promise(resolve => setTimeout(resolve, 100));
                    continue;
                }
                throw error;
            }
        }
    } catch (error) {
        await session.abortTransaction();
        return res.status(500).json({ success: false, message: error.message || "Postback processing failed" });
    } finally {
        session.endSession();
    }
});

route.post('/postback_offerwall_dot_me', upload.none(), async (req, res) => {
    let attempts = 0;

    while (attempts < MAX_RETRIES) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const { subId, transId, reward, signature, status } = req.body;
            const SECRET_KEY = "e77d9752bbce527646d86a444272e867"; // Offerwall.me secret key

            // ✅ **Check Missing Parameters**
            if (!subId || !transId || !reward || !signature) {
                return res.status(400).json({ success: false, message: "Missing parameters" });
            }

            // ✅ **Signature Validation**
            const calculatedSignature = crypto.createHash('md5').update(subId + transId + reward + SECRET_KEY).digest("hex");
            if (calculatedSignature !== signature) {
                return res.status(403).json({ success: false, message: "ERROR: Signature doesn't match" });
            }

            if (status === "1") {
                const user_id_Found = await userID_data_for_survey_module.findOne({ userId: subId }).session(session);
                if (!user_id_Found) throw new Error(`User ID not found: ${subId}`);

                const userData = await userSignUp_module.findById(user_id_Found.userDB_id).session(session);
                if (!userData) throw new Error(`User data not found for ID: ${user_id_Found.userDB_id}`);

                const user_incomeUpdate = await userIncome_handle(session, userData, reward);
                if (!user_incomeUpdate.success) throw new Error(user_incomeUpdate.error);

                const refer_by_incomeupdate = await userReferByIncome_handle(session, userData, reward);
                if (!refer_by_incomeupdate.success) throw new Error(refer_by_incomeupdate.error);

                const { userMonthlyRecord, dateRecords } = user_incomeUpdate.values;
                if (userMonthlyRecord) {
                    userMonthlyRecord.earningSources ||= {};
                    userMonthlyRecord.earningSources.offerWall ||= { income: 0 };

                    userMonthlyRecord.earningSources.offerWall.income = (
                        parseFloat(userMonthlyRecord.earningSources.offerWall.income || 0) + parseFloat(reward)
                    ).toFixed(3);
                }

                dateRecords.earningSources.offerWall.income = (
                    parseFloat(dateRecords.earningSources.offerWall.income || 0) + parseFloat(reward)
                ).toFixed(3);
                dateRecords.earningSources.offerWall.completed = (
                    parseFloat(dateRecords.earningSources.offerWall.completed || 0) + 1
                ).toString();

                await Promise.all([
                    userMonthlyRecord?.save({ session }),
                    userData.save({ session }),
                    dateRecords.save({ session })
                ]);

                await session.commitTransaction();
                session.endSession();
                return res.status(200).json({ success: true, message: "Postback processed successfully" });

            } else if (status === "2") {
                await session.commitTransaction();
                session.endSession();
                return res.status(200).json({ success: true, message: "Chargeback processed successfully" });
            }
        } catch (error) {
            await session.abortTransaction();
            session.endSession();

            const isWriteConflict = error.code === 112 ||
                (error.errorResponse && error.errorResponse.code === 112) ||
                (error.codeName && error.codeName === 'WriteConflict');

            if (isWriteConflict) {
                attempts++;
                if (attempts < MAX_RETRIES) continue;
            }

            return res.status(500).json({ success: false, message: error.message || "Postback processing failed" });
        }
    }

    return res.status(500).json({ success: false, message: "Transaction failed after multiple attempts" });
});

route.get("/postback_kiddyWall", async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userid, transactionid, reward, secret, status } = req.query;
        const SECRET_KEY = "Xv9MCHPoV8QGYqgFrjhdpEy5f7DA0L";

        if (!userid || !transactionid || !reward || !secret) {
            throw new Error("Missing parameters");
        }

        const calculatedSignature = crypto.createHash("md5").update(userid + transactionid + reward + SECRET_KEY).digest("hex");
        if (calculatedSignature !== secret) {
            throw new Error("Signature doesn't match");
        }

        let retryCount = 0;
        while (retryCount < MAX_RETRIES) {
            try {
                if (status === "1") {
                    const user_id_Found = await userID_data_for_survey_module.findOne({ userId: userid }).session(session);
                    if (!user_id_Found) throw new Error(`User ID not found: ${userid}`);

                    const userData = await userSignUp_module.findById(user_id_Found.userDB_id).session(session);
                    if (!userData) throw new Error(`User data not found for ID: ${user_id_Found.userDB_id}`);

                    const user_incomeUpdate = await userIncome_handle(session, userData, reward);
                    if (!user_incomeUpdate.success) throw new Error(user_incomeUpdate.error);

                    const refer_by_incomeupdate = await userReferByIncome_handle(session, userData, reward);
                    if (!refer_by_incomeupdate.success) throw new Error(refer_by_incomeupdate.error);

                    const { userMonthlyRecord, dateRecords } = user_incomeUpdate.values;
                    if (userMonthlyRecord) {
                        userMonthlyRecord.earningSources ||= {};
                        userMonthlyRecord.earningSources.offerWall ||= { income: 0 };
                        userMonthlyRecord.earningSources.offerWall.income = (
                            parseFloat(userMonthlyRecord.earningSources.offerWall.income || 0) + parseFloat(reward)
                        ).toFixed(3);
                    }

                    dateRecords.earningSources.offerWall.income = (
                        parseFloat(dateRecords.earningSources.offerWall.income || 0) + parseFloat(reward)
                    ).toFixed(3);

                    dateRecords.earningSources.offerWall.completed = (
                        parseFloat(dateRecords.earningSources.offerWall.completed || 0) + 1
                    ).toString();

                    await Promise.all([
                        userMonthlyRecord?.save({ session }),
                        userData.save({ session }),
                        dateRecords.save({ session })
                    ]);
                }

                await session.commitTransaction();
                return res.status(200).json({ success: true, message: "Postback processed successfully" });

            } catch (error) {
                if (error.message.includes("WriteConflict") && retryCount < 2) {
                    retryCount++;
                    await session.abortTransaction();
                    await new Promise(resolve => setTimeout(resolve, 100));
                    continue;
                }
                throw error;
            }
        }
    } catch (error) {
        await session.abortTransaction();
        return res.status(500).json({ success: false, message: error.message || "Postback processing failed" });
    } finally {
        session.endSession();
    }
});

route.post('/postback_dripOffers', upload.none(), async (req, res) => {
    let attempts = 0;

    while (attempts < MAX_RETRIES) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const { subId, transId, reward, signature, status } = req.body;
            const SECRET_KEY = "6ad8b97f9dee673c16ae3d8647a64a64"; // dripOffers secret key

            // ✅ **Check Missing Parameters**
            if (!subId || !transId || !reward || !signature) {
                return res.status(400).json({ success: false, message: "Missing parameters" });
            }

            // ✅ **Signature Validation**
            const calculatedSignature = crypto.createHash('md5').update(subId + transId + reward + SECRET_KEY).digest("hex");
            if (calculatedSignature !== signature) {
                return res.status(403).json({ success: false, message: "ERROR: Signature doesn't match" });
            }

            if (status === "1") {
                const user_id_Found = await userID_data_for_survey_module.findOne({ userId: subId }).session(session);
                if (!user_id_Found) throw new Error(`User ID not found: ${subId}`);

                const userData = await userSignUp_module.findById(user_id_Found.userDB_id).session(session);
                if (!userData) throw new Error(`User data not found for ID: ${user_id_Found.userDB_id}`);

                const user_incomeUpdate = await userIncome_handle(session, userData, reward);
                if (!user_incomeUpdate.success) throw new Error(user_incomeUpdate.error);

                const refer_by_incomeupdate = await userReferByIncome_handle(session, userData, reward);
                if (!refer_by_incomeupdate.success) throw new Error(refer_by_incomeupdate.error);

                const { userMonthlyRecord, dateRecords } = user_incomeUpdate.values;
                if (userMonthlyRecord) {
                    userMonthlyRecord.earningSources ||= {};
                    userMonthlyRecord.earningSources.offerWall ||= { income: 0 };

                    userMonthlyRecord.earningSources.offerWall.income = (
                        parseFloat(userMonthlyRecord.earningSources.offerWall.income || 0) + parseFloat(reward)
                    ).toFixed(3);
                }

                dateRecords.earningSources.offerWall.income = (
                    parseFloat(dateRecords.earningSources.offerWall.income || 0) + parseFloat(reward)
                ).toFixed(3);
                dateRecords.earningSources.offerWall.completed = (
                    parseFloat(dateRecords.earningSources.offerWall.completed || 0) + 1
                ).toString();

                await Promise.all([
                    userMonthlyRecord?.save({ session }),
                    userData.save({ session }),
                    dateRecords.save({ session })
                ]);

                await session.commitTransaction();
                session.endSession();
                return res.status(200).json({ success: true, message: "Postback processed successfully" });

            } else if (status === "2") {
                await session.commitTransaction();
                session.endSession();
                return res.status(200).json({ success: true, message: "Chargeback processed successfully" });
            }
        } catch (error) {
            await session.abortTransaction();
            session.endSession();

            const isWriteConflict = error.code === 112 ||
                (error.errorResponse && error.errorResponse.code === 112) ||
                (error.codeName && error.codeName === 'WriteConflict');

            if (isWriteConflict) {
                attempts++;
                if (attempts < MAX_RETRIES) continue;
            }

            return res.status(500).json({ success: false, message: error.message || "Postback processing failed" });
        }
    }

    return res.status(500).json({ success: false, message: "Transaction failed after multiple attempts" });
});

route.post('/postback_proEarnWall', upload.none(), async (req, res) => {
    let attempts = 0;

    while (attempts < MAX_RETRIES) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const { subId, transId, reward, signature, status } = req.body;
            const SECRET_KEY = "e12f28eb003ed087126fa0b6182e3e64"; // proEarnWall secret key

            // ✅ **Check Missing Parameters**
            if (!subId || !transId || !reward || !signature) {
                return res.status(400).json({ success: false, message: "Missing parameters" });
            }

            // ✅ **Signature Validation**
            const calculatedSignature = crypto.createHash('md5').update(subId + transId + reward + SECRET_KEY).digest("hex");
            if (calculatedSignature !== signature) {
                return res.status(403).json({ success: false, message: "ERROR: Signature doesn't match" });
            }

            if (status === "1") {
                const user_id_Found = await userID_data_for_survey_module.findOne({ userId: subId }).session(session);
                if (!user_id_Found) throw new Error(`User ID not found: ${subId}`);

                const userData = await userSignUp_module.findById(user_id_Found.userDB_id).session(session);
                if (!userData) throw new Error(`User data not found for ID: ${user_id_Found.userDB_id}`);

                const user_incomeUpdate = await userIncome_handle(session, userData, reward);
                if (!user_incomeUpdate.success) throw new Error(user_incomeUpdate.error);

                const refer_by_incomeupdate = await userReferByIncome_handle(session, userData, reward);
                if (!refer_by_incomeupdate.success) throw new Error(refer_by_incomeupdate.error);

                const { userMonthlyRecord, dateRecords } = user_incomeUpdate.values;
                if (userMonthlyRecord) {
                    userMonthlyRecord.earningSources ||= {};
                    userMonthlyRecord.earningSources.offerWall ||= { income: 0 };

                    userMonthlyRecord.earningSources.offerWall.income = (
                        parseFloat(userMonthlyRecord.earningSources.offerWall.income || 0) + parseFloat(reward)
                    ).toFixed(3);
                }

                dateRecords.earningSources.offerWall.income = (
                    parseFloat(dateRecords.earningSources.offerWall.income || 0) + parseFloat(reward)
                ).toFixed(3);
                dateRecords.earningSources.offerWall.completed = (
                    parseFloat(dateRecords.earningSources.offerWall.completed || 0) + 1
                ).toString();

                await Promise.all([
                    userMonthlyRecord?.save({ session }),
                    userData.save({ session }),
                    dateRecords.save({ session })
                ]);

                await session.commitTransaction();
                session.endSession();
                return res.status(200).json({ success: true, message: "Postback processed successfully" });

            } else if (status === "2") {
                await session.commitTransaction();
                session.endSession();
                return res.status(200).json({ success: true, message: "Chargeback processed successfully" });
            }
        } catch (error) {
            await session.abortTransaction();
            session.endSession();

            const isWriteConflict = error.code === 112 ||
                (error.errorResponse && error.errorResponse.code === 112) ||
                (error.codeName && error.codeName === 'WriteConflict');

            if (isWriteConflict) {
                attempts++;
                if (attempts < MAX_RETRIES) continue;
            }

            return res.status(500).json({ success: false, message: error.message || "Postback processing failed" });
        }
    }

    return res.status(500).json({ success: false, message: "Transaction failed after multiple attempts" });
});

module.exports = route