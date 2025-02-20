const mongoose = require('mongoose');
const ipAddress_records_module = require('../../model/IPAddress/useripAddresses_records_module');
const { userMonthly_records_module, saveUserMonthlyData } = require("../../model/dashboard/userMonthly_modules");
const userDate_records_module = require("../../model/dashboard/userDate_modules");
const userSignUp_module = require('../../model/userSignUp/userSignUp_module')
const idTimer_records_module = require('../../model/id_timer/id_timer_records_module')
const getFormattedDate = require('../../helper/getFormattedDate')
const getFormattedMonth = require("../../helper/getFormattedMonth")
const shortedLinksData_module = require('../../model/shortLinks/shortedLinksData_module')
const generateRandomString = require("../../helper/generateRandomString")
const axios = require('axios')
const viewAds_directLinksData_module = require("../../model/view_ads_direct_links/viewAds_directLinksData_module");
const { userReferByIncome_handle, userIncome_handle } = require('../../helper/usersEarningsUpdate_handle')

const user_adsView_home_get = async (req, res) => {
    const session = await mongoose.startSession(); // Start a session
    session.startTransaction(); // Begin a transaction
    try {
        const monthName = getFormattedMonth()
        const userData = req.user;
        const user_ip = req.ip;

        let viewAds_directLinksData = await viewAds_directLinksData_module.find()

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
            viewAds_directLinksData
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
        // Destructure request body and get user IP
        const { disabledButtons_state, clickBalance, btnClickEarn } = req.body;
        const userIp = req.ip;
        // Get user data (Assuming req.user is a valid Mongoose document)
        const userData = req.user;

        let user_incomeUpdate = await userIncome_handle(session, userData, btnClickEarn)
        if (!user_incomeUpdate.success) {
            throw new Error(user_incomeUpdate.error);
        }
        const { userMonthlyRecord } = user_incomeUpdate.values

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

        // update user referral income
        let refer_by_incomeupdate = await userReferByIncome_handle(session, userData, btnClickEarn)
        if (!refer_by_incomeupdate.success) {
            throw new Error(refer_by_incomeupdate.error);
        }

        const ipAddressRecord = await ipAddress_records_module
            .findOne({ ipAddress: userIp })
            .session(session);

        // Update records based on IP match
        if (ipAddressRecord.ipAddress === userIp) {
            // Update dynamic button state
            ipAddressRecord.buttonNames = disabledButtons_state;
        } else if (ipAddressRecord.ipAddress !== userIp) {
            ipAddressRecord = new ipAddress_records_module({
                userDB_id: userData._id,
                buttonNames: disabledButtons_state,
                ipAddress: userIp,
            });
        }

        // Update monthly income and click balance for view_ads
        const currentIncome = parseFloat(userMonthlyRecord.earningSources.view_ads.income || 0);
        userMonthlyRecord.earningSources.view_ads.income = (
            currentIncome + parseFloat(btnClickEarn)
        ).toFixed(3);
        userMonthlyRecord.earningSources.view_ads.clickBalance =
            `${(parseFloat(clickBalance.split('/')[0]) + 1).toString()}/${process.env.VIEW_ADS_CLICK_BALANCE}`;


        // Save updated documents concurrently
        const saveOperations = [
            userMonthlyRecord.save({ session }),
            ipAddressRecord.save({ session }),
            userData.save({ session })
        ];

        await Promise.all(saveOperations);

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
        let ipAddressRecords = await ipAddress_records_module.find({ ipAddress: userIp });

        // Get all clicked URLs
        const clickedUrls = new Set(ipAddressRecords.map(record => record.shortnerDomain));

        // Mark matched shorted links as isDisable: true
        shortedLinksData = shortedLinksData.map(link => {
            const isClicked = clickedUrls.has(link.shortnerDomain);
            const isDisable = isClicked && ipAddressRecords.some(record => record.status === true);
            return {
                ...link.toObject(),
                isDisable
            };
        });

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
        const existingRecord = await ipAddress_records_module.findOne({ ipAddress: userIp, shortnerDomain });

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

        if (shortnersData && shortnersData.shortnerApiLink) {
            // const fullUrl = `${clientOrigin}${endPageRoute}/${uniqueRandomID}`;
            const fullUrl = `https://earningplaner-earn.onrender.com${endPageRoute}/${uniqueRandomID}`;

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
        await new ipAddress_records_module({
            userDB_id: userData._id,
            shortnerDomain,
            shortUrl: shortedLink,
            status: false,
            processCount: 1,
            uniqueToken: uniqueRandomID,
            ipAddress: userIp
        }).save();

        res.status(200).json({ message: "New record added successfully", shortedLink });

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

        const ipAddressRecord = await ipAddress_records_module.findOne({
            userDB_id: userData._id,
            ipAddress: userIp,
            uniqueToken
        }).session(session);

        if (!ipAddressRecord) {
            return res.status(404).json({ message: "User record not found" });
        }

        // ✅ Agar processCount already 2 hai, toh process skip karo aur error bhejo
        if (!ipAddressRecord.processCount || ipAddressRecord.status || ipAddressRecord.processCount === 2 || ipAddressRecord.status) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Already processed", amount: 0 });
        }

        ipAddressRecord.processCount = 2;
        ipAddressRecord.status = true;

        const shortedLink = await shortedLinksData_module.findOne({ shortnerDomain: ipAddressRecord.shortnerDomain }).session(session);
        if (!shortedLink) {
            return res.status(404).json({ message: "Shortened link not found" });
        }
        const amount = parseFloat(shortedLink.amount) || 0;

        let user_incomeUpdate = await userIncome_handle(session, userData, amount)
        if (!user_incomeUpdate.success) {
            throw new Error(user_incomeUpdate.error);
        }
        const { userMonthlyRecord } = user_incomeUpdate.values

        let refer_by_incomeupdate = await userReferByIncome_handle(session, userData, amount)
        if (!refer_by_incomeupdate.success) {
            throw new Error(refer_by_incomeupdate.error);
        }

        if (userMonthlyRecord) {
            // Agar `click_short_link` undefined hai toh initialize karo
            if (!userMonthlyRecord.earningSources) {
                userMonthlyRecord.earningSources = {};
            }
            if (!userMonthlyRecord.earningSources.click_short_link) {
                userMonthlyRecord.earningSources.click_short_link = { income: 0 };
            }

            // ✅ Safe update
            const currentIncome = parseFloat(userMonthlyRecord.earningSources.click_short_link.income || 0);
            userMonthlyRecord.earningSources.click_short_link.income = (currentIncome + parseFloat(amount)).toFixed(3);

            await userMonthlyRecord.save({ session });
        }


        // Save updated documents concurrently
        const saveOperations = [
            userMonthlyRecord.save({ session }),
            ipAddressRecord.save({ session }),
            userData.save({ session })
        ];

        await Promise.all(saveOperations);

        // ✅ Transaction commit karo
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