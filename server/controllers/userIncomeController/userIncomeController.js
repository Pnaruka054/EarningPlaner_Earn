const mongoose = require('mongoose');
const ipAddress_records_module = require('../../model/IPAddress/useripAddresses_records_module');
const { userMonthly_records_module, saveUserMonthlyData } = require("../../model/dashboard/userMonthly_modules");
const userDate_records_module = require("../../model/dashboard/userDate_modules");
const userSignUp_module = require('../../model/userSignUp/userSignUp_module')
const referral_records_module = require('../../model/referralRecords/referral_records_module')
const idTimer_records_module = require('../../model/id_timer/id_timer_records_module')
const getFormattedDate = require('../../helper/getFormattedDate')
const getFormattedMonth = require("../../helper/getFormattedMonth")
const shortedLinksData_module = require('../../model/shortLinks/shortedLinksData_module')
const generateRandomString = require("../../helper/generateRandomString")
const axios = require('axios')

const user_adsView_home_get = async (req, res) => {
    const session = await mongoose.startSession(); // Start a session
    session.startTransaction(); // Begin a transaction
    try {
        const monthName = getFormattedMonth()
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
        const income = userMonthly_recordData?.earningSources?.view_ads?.income || 0;
        let clickBalance =
            userMonthly_recordData?.earningSources?.view_ads?.clickBalance ||
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
        const monthName = getFormattedMonth()
        // Destructure request body and get user IP
        const { disabledButtons_state, clickBalance, btnClickEarn } = req.body;
        const userIp = req.ip;
        const referralIncrement = parseFloat(btnClickEarn) * parseFloat(process.env.REFERRAL_RATE);
        // Get user data (Assuming req.user is a valid Mongoose document)
        const userData = req.user;

        // Get today's formatted date (Assuming getFormattedDate() is defined elsewhere)
        const today = getFormattedDate();

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

        if (
            userMonthlyRecord?.earningSources?.view_ads?.clickBalance !==
            `${process.env.VIEW_ADS_CLICK_BALANCE}/${process.env.VIEW_ADS_CLICK_BALANCE}`
        ) {
            userMonthlyRecord.earningSources.view_ads.clickBalance =
                `${(parseFloat(clickBalance.split('/')[0]) + 1).toString()}/${process.env.VIEW_ADS_CLICK_BALANCE}`;
        }

        // Agar clickBalance exactly equal ho jaye to VIEW_ADS_CLICK_BALANCE/VIEW_ADS_CLICK_BALANCE
        let idTimer_recordsData = null
        let idTimer_recordsData_status = null
        if (
            userMonthlyRecord?.earningSources?.view_ads?.clickBalance ===
            `${process.env.VIEW_ADS_CLICK_BALANCE}/${process.env.VIEW_ADS_CLICK_BALANCE}`
        ) {
            idTimer_recordsData_status = idTimer_recordsData = await idTimer_records_module.findOne({ userDB_id: userData._id }).session(session);

            if (!idTimer_recordsData) {
                idTimer_recordsData = await new idTimer_records_module({ userDB_id: userData._id, ViewAdsexpireTImer: new Date(Date.now() + (24 * 60 * 60 * 1000)) }).save({ session }); // Save the new record to the database;
            }
        }

        if (idTimer_recordsData_status) {
            return res.status(500).json({
                success: false,
                msg: "Not Recorded",
            });
        }

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
                if (!dateRecords_referBy) {
                    dateRecords_referBy = await new userDate_records_module({
                        userDB_id: referredUser._id,
                        monthName,
                        date: today,
                    })
                }
            }
        }

        // Update daily earnings if referral exists
        if (dateRecords) {
            dateRecords.self_earnings = (
                parseFloat(dateRecords.self_earnings || 0) + parseFloat(btnClickEarn)
            ).toFixed(3);

            dateRecords.Total_earnings = (
                parseFloat(dateRecords.Total_earnings || 0) + parseFloat(btnClickEarn)
            ).toFixed(3);
        }

        if (dateRecords_referBy) {
            dateRecords_referBy.referral_earnings = (
                parseFloat(dateRecords_referBy.referral_earnings || 0) + referralIncrement
            ).toFixed(3);

            dateRecords_referBy.Total_earnings = (
                parseFloat(dateRecords_referBy.Total_earnings || 0) + referralIncrement
            ).toFixed(3);
        }

        const ipAddressRecord = await ipAddress_records_module
            .findOne({ ipAddress: userIp })
            .session(session);

        // Update records based on IP match
        if (ipAddressRecord.ipAddress === userIp) {
            // Update dynamic button state
            ipAddressRecord.buttonNames = disabledButtons_state;

            // Update monthly income and click balance for view_ads
            const currentIncome = parseFloat(userMonthlyRecord.earningSources.view_ads.income || 0);
            userMonthlyRecord.earningSources.view_ads.income = (
                currentIncome + parseFloat(btnClickEarn)
            ).toFixed(3);
            userMonthlyRecord.earningSources.view_ads.clickBalance =
                `${(parseFloat(clickBalance.split('/')[0]) + 1).toString()}/${process.env.VIEW_ADS_CLICK_BALANCE}`;

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
            });
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
        let resData = {
            ipAddress_recordData: ipAddressRecord,
            income: userMonthlyRecord.earningSources.view_ads.income || 0,
            deposit_amount: userData.deposit_amount,
            withdrawable_amount: userData.withdrawable_amount,
            buttonNames: ipAddressRecord.buttonNames,
            clickBalance:
                userMonthlyRecord.earningSources.view_ads.clickBalance ||
                `0/${process.env.VIEW_ADS_CLICK_BALANCE}`
        };

        if (idTimer_recordsData?.ViewAdsexpireTImer) {
            resData = { ...resData, ViewAdsexpireTImer: idTimer_recordsData.ViewAdsexpireTImer }
        }

        return res.status(200).json({
            success: true,
            msg: resData
        });
    } catch (error) {
        try {
            // Agar session abhi bhi transaction mein hai, tabhi abort karein
            if (session.inTransaction()) {
                await session.abortTransaction();
            }
        } catch (abortError) {
            console.error("Error aborting transaction:", abortError);
        } finally {
            session.endSession();
        }
        console.error("Error in updating user data:", error);
        return res.status(500).json({ message: 'An error occurred while processing the request.' });
    }

};

const user_shortlink_data_get = async (req, res) => {
    try {
        // User data
        const userData = req.user;

        const userIp = req.ip;

        // Fetch shorted links
        let shortedLinksData = await shortedLinksData_module.find();

        // Fetch user's click records
        let ipAddress_records = await ipAddress_records_module.findOne({ ipAddress: userIp });

        // Get all clicked URLs
        const clickedUrls = new Set(ipAddress_records?.shortnerDomain || '');

        // Mark matched shorted links as isDisable: true
        shortedLinksData = shortedLinksData.map(link => ({
            ...link.toObject(),
            isDisable: (clickedUrls.has(link.shortnerDomain) && clickedUrls.status) // True if match found
        }));

        // Prepare response data
        let resData = {
            userAvailableBalance: (parseFloat(userData.deposit_amount || 0) + parseFloat(userData.withdrawable_amount || 0)).toFixed(3),
            shortedLinksData
        };

        // Send response
        res.json(resData);
    } catch (error) {
        console.error("Error fetching user shortlink data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const user_shortlink_firstPage_data_patch = async (req, res) => {
    try {
        const userData = req.user;
        const userIp = req.ip;
        const { shortnerDomain, endPageRoute, clientOrigin } = req.body;

        if (!userData || !userData._id || !shortnerDomain || !clientOrigin) {
            return res.status(400).json({ message: "Invalid data received" });
        }

        // Check if record already exists
        const existingRecord = await ipAddress_records_module.findOne({ ipAddress: userIp });

        if (existingRecord) {
            if (existingRecord.status === true || existingRecord.processCount === 1) {
                return res.status(200).json({ message: "Record already processed, no update required" });
            }

            // Update existing record
            existingRecord.processCount = 1;
            existingRecord.status = false;
            await existingRecord.save();

            return res.status(200).json({ message: "Record updated successfully", data: existingRecord });
        }

        let uniqueRandomID = await generateRandomString(10);
        let shortedLink = null;

        // Fetch Shortener API data
        const shortnersData = await shortedLinksData_module.findOne({ shortnerDomain });

        if (shortnersData && shortnersData.apiLink) {
            const fullUrl = `${clientOrigin}${endPageRoute}/${uniqueRandomID}`;

            try {
                let response = await axios.get(`${shortnersData.shortnerApiLink}${fullUrl}`);
                shortedLink = response.data?.shortenedUrl || null;
            } catch (error) {
                console.error("Error fetching shortened URL:", error.message);
            }
        }

        // If shortedLink is null, return an error response
        if (!shortedLink) {
            return res.status(422).json({ message: "Shortened link not generated. Process aborted." });
        }

        // Create new record
        const newRecord = new ipAddress_records_module({
            userDB_id: userData._id,
            shortnerDomain,
            shortUrl: shortedLink,
            status: false,
            processCount: 1,
            uniqueToken: uniqueRandomID,
            ipAddress: userIp
        });

        await newRecord.save();

        res.status(200).json({ message: "New record added successfully", data: newRecord });

    } catch (error) {
        console.error("Error in user_shortlink_firstPage_data_patch:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const user_shortlink_lastPage_data_patch = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        let { uniqueToken } = req.body;
        const userData = req.user;
        const userIp = req.ip;

        if (!userData || !userData._id || !uniqueToken) {
            return res.status(400).json({ message: "Invalid data received" });
        }

        const userRecord = await ipAddress_records_module.findOne({
            userDB_id: userData._id,
            ipAddress: userIp,
            uniqueToken
        }).session(session);

        if (!userRecord) {
            return res.status(404).json({ message: "User record not found" });
        }

        userRecord.processCount = 2;
        userRecord.status = true;
        await userRecord.save({ session });

        const shortedLink = await shortedLinksData_module.findOne({ shortnerDomain: userRecord.shortnerDomain }).session(session);
        if (!shortedLink) {
            return res.status(404).json({ message: "Shortened link not found" });
        }
        const amount = parseFloat(shortedLink.amount) || 0;

        userData.withdrawable_amount = (parseFloat(userData.withdrawable_amount) || 0) + amount;
        await userData.save({ session });

        if (userData.refer_by) {
            const referrer = await userSignUp_module.findOne({ userName: userData.refer_by }).session(session);
            if (referrer) {
                const referralUserId = referrer._id;

                const referralRecord = await referral_records_module.findOne({ userDB_id: referralUserId, userName: userData.userName }).session(session);
                if (referralRecord) {
                    referralRecord.income += parseFloat(process.env.REFERRAL_RATE) * amount;
                    await referralRecord.save({ session });
                }

                const formattedDate = getFormattedDate();
                const userDateRecord = await userDate_records_module.findOne({ userDB_id: referralUserId, date: formattedDate }).session(session);
                if (userDateRecord) {
                    userDateRecord.referral_earnings += parseFloat(process.env.REFERRAL_RATE) * amount;
                    await userDateRecord.save({ session });
                } else {
                    await new userDate_records_module({
                        userDB_id: referralUserId,
                        date: formattedDate,
                        referral_earnings: parseFloat(process.env.REFERRAL_RATE) * amount
                    }).save({ session });
                }
            }
        }

        let userDateRecordSelf = await userDate_records_module.findOne({
            userDB_id: userData._id,
            date: getFormattedDate()
        }).session(session);

        if (userDateRecordSelf) {
            userDateRecordSelf.self_earnings = (parseFloat(userDateRecordSelf.self_earnings) + parseFloat(amount)).toString();
            await userDateRecordSelf.save({ session });
        } else {
            await userDate_records_module.create([{
                userDB_id: userData._id,
                date: getFormattedDate(),
                self_earnings: amount.toString()
            }], { session });
        }

        const formattedMonth = getFormattedMonth();
        const userMonthlyRecord = await userMonthly_records_module.findOne({ userDB_id: userData._id, month: formattedMonth }).session(session);
        if (userMonthlyRecord) {
            userMonthlyRecord.earningSources.click_short_link.income += amount;
            await userMonthlyRecord.save({ session });
        } else {
            await new userMonthly_records_module({
                userDB_id: userData._id,
                month: formattedMonth,
                earningSources: {
                    click_short_link: { income: amount }
                }
            }).save({ session });
        }

        // Transaction commit karo
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: "Data updated successfully!", amount });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error in user_shortlink_lastPage_data_patch:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    user_adsView_home_get,
    user_adsView_income_patch,
    user_shortlink_data_get,
    user_shortlink_firstPage_data_patch,
    user_shortlink_lastPage_data_patch
}