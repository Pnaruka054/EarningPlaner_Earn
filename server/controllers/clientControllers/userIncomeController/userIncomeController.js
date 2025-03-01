const mongoose = require('mongoose');
const ipAddress_records_module = require('../../../model/IPAddress/useripAddresses_records_module');
const userDate_records_module = require("../../../model/dashboard/userDate_modules");
const idTimer_records_module = require('../../../model/id_timer/id_timer_records_module')
const getFormattedDate = require('../../../helper/getFormattedDate')
const shortedLinksData_module = require('../../../model/shortLinks/shortedLinksData_module')
const generateRandomString = require("../../../helper/generateRandomString")
const axios = require('axios')
const viewAds_directLinksData_module = require("../../../model/view_ads_direct_links/viewAds_directLinksData_module");
const { userReferByIncome_handle, userIncome_handle } = require('../../../helper/usersEarningsUpdate_handle')
const userID_data_for_survey_module = require('../../../model/userID_data_for_survey/userID_data_for_survey_module')
const other_data_module = require('../../../model/other_data/other_data_module')
const earningCalculator = require('../../../helper/earningCalculator')
const MAX_RETRIES = parseFloat(process.env.MAX_RETRIES) || 3;

// for view ads page get data
const user_adsView_home_get = async (req, res) => {
    let attempt = 0;
    
    while (attempt < MAX_RETRIES) {
        const session = await mongoose.startSession(); // Start a session
        session.startTransaction(); // Begin a transaction
        try {
            // format current Date YYYY-MM-DD
            const todayDate = getFormattedDate()
            const userData = req.user;
            const user_ip = req.ip;

            // Fetch other_data for viewAds
            let other_data_viewAds = await other_data_module.findOne({ documentName: "viewAds" }).session(session);

            // get all directLinks data
            let viewAds_directLinksData = await viewAds_directLinksData_module.find().session(session);

            // Search for an existing record with the same ipAddress
            let ipAddress_recordData = await ipAddress_records_module
                .findOne({ ipAddress: user_ip })
                .session(session);

            // If no ipAddress record found, create a new one with empty buttonNames Array
            if (!ipAddress_recordData) {
                ipAddress_recordData = new ipAddress_records_module({
                    userDB_id: userData._id,
                    buttonNames: [],
                    ipAddress: user_ip,
                });
            }

            // find current date record
            let userDate_recordData = await userDate_records_module
                .findOne({ userDB_id: userData._id, date: todayDate })
                .session(session);

            // Safely extract income and pendingClick if available, otherwise use 0
            const today_adsviewIncome = userDate_recordData?.earningSources?.view_ads?.income || 0;
            let pendingClick = userDate_recordData?.earningSources?.view_ads?.pendingClick || other_data_viewAds?.viewAds_pendingClick || 0;

            // Calculate user earnings based on direct links data
            let userWillEarn = viewAds_directLinksData.length
                ? earningCalculator(viewAds_directLinksData, 'amount', other_data_viewAds?.viewAds_pendingClick)
                : 0;

            // Calculate completed clicks
            let completedClick = Math.max(parseFloat(other_data_viewAds?.viewAds_pendingClick || 0) - parseFloat(pendingClick), 0);

            // Prepare response data
            let resData = {
                today_adsviewIncome,
                pendingClick,
                completedClick,
                pendingEarnings: (userWillEarn - today_adsviewIncome).toFixed(3),
                totalLinks: viewAds_directLinksData.length - (ipAddress_recordData.buttonNames || []).length,
                userAvailableBalance: (parseFloat(userData.deposit_amount || 0) + parseFloat(userData.withdrawable_amount || 0)).toFixed(3),
                buttonNames: ipAddress_recordData.buttonNames || [],
                viewAds_directLinksData,
                other_data_viewAds_instructions: other_data_viewAds.viewAds_instructions
            };

            let idTimer_recordsData = await idTimer_records_module.findOne({
                $and: [
                    { userDB_id: userData._id },
                    { viewAdsexpireTimer: { $exists: null } }
                ]
            }).session(session)
            // change res data if timer started for user
            if (idTimer_recordsData?.viewAdsexpireTimer) {
                resData = { ...resData, viewAdsexpireTimer: idTimer_recordsData.viewAdsexpireTimer }
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
            const isWriteConflict = error.code === 112 ||
                (error.errorResponse && error.errorResponse.code === 112) ||
                (error.codeName && error.codeName === 'WriteConflict');
            if (isWriteConflict) {
                attempt++;
                continue;
            }
            return res.status(500).json({
                msg: "An error occurred while processing your request.",
            });
        }
    }
    return res.status(500).json({
        msg: "Max retry attempts reached. Please try again later.",
    });
};

// for view ads page income update
const user_adsView_income_patch = async (req, res) => {
    let attempt = 0;
    while (attempt < MAX_RETRIES) {
        const session = await mongoose.startSession();
        session.startTransaction(); // Start transaction immediately

        try {
            // Extract required data
            const { disabledButtons_state, pendingClick, btnClickEarn } = req.body;
            const userIp = req.ip;
            const userData = req.user;

            // Increase user income
            const userIncomeUpdate = await userIncome_handle(session, userData, btnClickEarn);
            if (!userIncomeUpdate.success) {
                throw new Error(userIncomeUpdate.error);
            }

            // get monthly module and date module to update more and save al last
            const { userMonthlyRecord, dateRecords } = userIncomeUpdate.values;

            // get all viewAds links data
            const viewAdsConfig = await other_data_module
                .findOne({ documentName: "viewAds" })
                .session(session);

            // check if pendingClick is available in date data if not then create
            if (!dateRecords?.earningSources?.view_ads?.pendingClick) {
                dateRecords.earningSources.view_ads.pendingClick = pendingClick;
            }

            // check current pending number is lessthen equel to total available pending click limit if its true then Update user's pending clicks and income
            if (parseFloat(dateRecords?.earningSources?.view_ads?.pendingClick) <= parseFloat(viewAdsConfig.viewAds_pendingClick)) {
                dateRecords.earningSources.view_ads.pendingClick = (parseFloat(pendingClick) - 1).toString();
                dateRecords.earningSources.view_ads.income = (parseFloat(dateRecords.earningSources.view_ads.income || 0) + parseFloat(btnClickEarn)).toFixed(3);
            }

            // Initialize timer records (if applicable)
            let idTimerRecordsData = null;
            // if user current pending click is empety means its 0 then start timer
            if (dateRecords.earningSources.view_ads.pendingClick === '0') {
                idTimerRecordsData = await idTimer_records_module
                    .findOne({
                        $and: [
                            { userDB_id: userData._id },
                            { viewAdsexpireTimer: { $exists: null } }
                        ]
                    })
                    .session(session);

                // check if timer already available or not if not available then create new one
                if (!idTimerRecordsData) {
                    const currentTime_fromNewDate = new Date();
                    idTimerRecordsData = new idTimer_records_module({
                        userDB_id: userData._id,
                        viewAdsexpireTimer: new Date(currentTime_fromNewDate.getFullYear(), currentTime_fromNewDate.getMonth(), currentTime_fromNewDate.getDate() + 1, 0, 0, 0),
                    });
                    await idTimerRecordsData.save({ session });
                } else {
                    // Return error if the click limit timer is exceeded
                    await session.abortTransaction();
                    session.endSession();
                    return res.status(400).json({
                        success: false,
                        error_msg: "Click Limit exceeded. Try again after the timer completes.",
                    });
                }
            }

            // Update referral income
            const referByIncomeUpdate = await userReferByIncome_handle(session, userData, btnClickEarn);
            if (!referByIncomeUpdate.success) {
                throw new Error(referByIncomeUpdate.error);
            }

            // Find user current IP address address record if available
            let ipAddressRecord = await ipAddress_records_module
                .findOne({ ipAddress: userIp })
                .session(session);

            // check if ip address already available if available then Update existing IP record otherwise Create new IP record 
            if (ipAddressRecord) {
                ipAddressRecord.buttonNames = disabledButtons_state;
            } else {
                ipAddressRecord = new ipAddress_records_module({
                    userDB_id: userData._id,
                    buttonNames: disabledButtons_state,
                    ipAddress: userIp,
                });
                await ipAddressRecord.save({ session });
            }

            // Update monthly income and click balance for view_ads
            const currentIncome = parseFloat(userMonthlyRecord?.earningSources?.view_ads?.income || 0);
            userMonthlyRecord.earningSources.view_ads.income = (
                currentIncome + parseFloat(btnClickEarn)
            ).toFixed(3);

            // Save all changes concurrently
            await Promise.all([
                userMonthlyRecord.save({ session }),
                ipAddressRecord.save({ session }),
                userData.save({ session }),
                dateRecords.save({ session }),
            ]);

            // Commit the transaction and end the session
            await session.commitTransaction();
            session.endSession();

            // Prepare response data
            const response = {
                ipAddress_recordData: ipAddressRecord,
                userAvailableBalance: (
                    parseFloat(userData.deposit_amount || 0) + parseFloat(userData.withdrawable_amount || 0)
                ).toFixed(3),
            };

            // check if user limit timer started then change res
            if (idTimerRecordsData?.viewAdsexpireTimer) {
                response.viewAdsexpireTimer = idTimerRecordsData.viewAdsexpireTimer;
            }

            return res.status(200).json({
                success: true,
                msg: response,
            });

        } catch (error) {
            // Handle transaction rollback and session cleanup
            if (session.inTransaction()) {
                await session.abortTransaction();
            }
            session.endSession();

            console.error("Error in updating user data:", error);
            const isWriteConflict = error.code === 112 ||
                (error.errorResponse && error.errorResponse.code === 112) ||
                (error.codeName && error.codeName === 'WriteConflict');
            if (isWriteConflict) {
                attempt++;
                console.log(`Global write conflict encountered. Retrying attempt ${attempt}`);
                continue;
            }
            return res.status(500).json({ msg: "An error occurred while processing the request." });
        }
    }

    return res.status(500).json({ msg: "Max retry attempts reached. Please try again later." });
};

// for click shorten link page data get
const user_shortlink_data_get = async (req, res) => {
    let attempt = 0;
    while (attempt < MAX_RETRIES) {
        const session = await mongoose.startSession(); // Start session
        session.startTransaction(); // Start transaction

        try {
            // format current Date YYYY-MM-DD
            const todayDate = getFormattedDate();
            // User data
            const userData = req.user;
            const userIp = req.ip;

            // Fetch shorted links with session
            let shortedLinksData = await shortedLinksData_module.find().session(session);

            // Fetch user's click records with session
            let ipAddressRecords = await ipAddress_records_module.find({
                $and: [
                    { ipAddress: userIp },
                    { shortnerDomain: { $exists: true } },
                    { userDB_id: userData._id }
                ]
            }).session(session);

            // Fetch other_data for shortLink with session
            let other_data_shortLink = await other_data_module.findOne({ documentName: "shortLink" }).session(session);

            // Get all clicked URLs
            const clickedUrls = new Set(ipAddressRecords.map(record => record.shortnerDomain));

            // Calculate user earnings based on shortLink data
            let userWillEarn = shortedLinksData.length
                ? earningCalculator(shortedLinksData, 'amount', other_data_shortLink?.shortLink_pendingClick)
                : 0;

            // Mark matched shorted links as isDisable: true
            shortedLinksData = shortedLinksData.map(link => {
                const isClicked = clickedUrls.has(link.shortnerDomain);
                const relatedRecords = ipAddressRecords.filter(record => record.shortnerDomain === link.shortnerDomain);
                // isDisable will be true only if all related records have status === true
                const isDisable = isClicked && relatedRecords.length > 0 && relatedRecords.every(record => record.status === true);

                return {
                    ...link.toObject(),
                    isDisable
                };
            });

            // Find current date record with session
            let userDate_recordData = await userDate_records_module.findOne({
                userDB_id: userData._id,
                date: todayDate
            }).session(session);

            // Safely extract income and pendingClick if available, otherwise use 0
            const today_shortLinkIncome = parseFloat(userDate_recordData?.earningSources?.click_short_link?.income || 0);
            let pendingClick = parseFloat(userDate_recordData?.earningSources?.click_short_link?.pendingClick || other_data_shortLink?.shortLink_pendingClick || 0);

            // Calculate completed clicks
            let completedClick = Math.max(parseFloat(other_data_shortLink?.shortLink_pendingClick || 0) - pendingClick, 0);

            // Prepare response data
            let resData = {
                userAvailableBalance: (parseFloat(userData.deposit_amount || 0) + parseFloat(userData.withdrawable_amount || 0)).toFixed(3),
                shortedLinksData,
                today_shortLinkIncome: today_shortLinkIncome.toFixed(3),
                pendingClick,
                completedClick,
                pendingEarnings: (userWillEarn - today_shortLinkIncome).toFixed(3),
                totalLinks: shortedLinksData.length - ipAddressRecords.filter(values => values.processCount === 1 && values.status === true).length,
                other_data_shortLink_instructions: other_data_shortLink.shortLink_instructions
            };

            // Find timer record with session
            let idTimer_recordsData = await idTimer_records_module.findOne({
                $and: [
                    { userDB_id: userData._id },
                    { click_short_link_expireTimer: { $exists: true } }
                ]
            }).session(session);

            // Change res data if timer started for user
            if (idTimer_recordsData?.click_short_link_expireTimer) {
                resData = { ...resData, click_short_link_expireTimer: idTimer_recordsData.click_short_link_expireTimer };
            }

            // Commit transaction
            await session.commitTransaction();
            session.endSession();

            // Send response
            return res.status(200).json({
                success: true,
                msg: resData,
            });

        } catch (error) {
            await session.abortTransaction(); // Rollback transaction
            session.endSession(); // End session
            console.error("Error fetching user shortlink data:", error);
            const isWriteConflict = error.code === 112 ||
                (error.errorResponse && error.errorResponse.code === 112) ||
                (error.codeName && error.codeName === 'WriteConflict');
            if (isWriteConflict) {
                attempt++;
                continue;
            }
            return res.status(500).json({
                success: false,
                msg: "Internal Server Error"
            });
        }
    }
    return res.status(500).json({
        success: false,
        msg: "Max retry attempts reached. Please try again later."
    });
};

// for click shorten link page income update
const user_shortlink_firstPage_data_patch = async (req, res) => {
    let attempt = 0;
    
    while (attempt < MAX_RETRIES) {
        const session = await mongoose.startSession(); // Start session
        session.startTransaction(); // Start transaction

        try {
            const userData = req.user;
            const userIp = req.ip;
            const { shortnerDomain, endPageRoute, clientOrigin } = req.body;

            if (!userData || !userData._id || !shortnerDomain || !clientOrigin) {
                return res.status(400).json({ error_msg: "Invalid data received" });
            }

            // Find timer record with session
            let idTimer_recordsData = await idTimer_records_module.findOne({
                $and: [
                    { userDB_id: userData._id },
                    { click_short_link_expireTimer: { $exists: true } }
                ]
            }).session(session);

            // Change res data if timer started for user
            if (idTimer_recordsData?.click_short_link_expireTimer) {
                await session.abortTransaction(); // Rollback transaction
                session.endSession();
                return res.status(400).json({
                    success: false,
                    error_msg: "Click Limit exceeded. Try again after the timer completes.",
                });
            }

            // Check if record already exists using ip and shorten link domain
            const existingRecord = await ipAddress_records_module.findOne({ ipAddress: userIp, shortnerDomain, userDB_id: userData._id }).session(session);

            // if already exists then update it
            if (existingRecord) {
                if (existingRecord.status === true || existingRecord.processCount === 2) {
                    await session.commitTransaction();
                    session.endSession();
                    return res.status(200).json({ error_msg: "Record already processed, no update required" });
                }

                // Update existing record
                existingRecord.processCount = 1;
                existingRecord.status = false;
                await existingRecord.save({ session });

                await session.commitTransaction();
                session.endSession();
                return res.status(200).json({ msg: "Record updated successfully", existingRecord });
            }

            // generate random 10 character string
            let uniqueRandomID = await generateRandomString(10);
            let shortedLink = null;

            // Fetch Shortener data
            const shortnersData = await shortedLinksData_module.findOne({ shortnerDomain }).session(session);

            // create shorted url for user using shortner api
            if (shortnersData && shortnersData.shortnerApiLink) {
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
                await session.abortTransaction();
                session.endSession();
                return res.status(422).json({
                    success: false,
                    error_msg: "Shortened link not generated. Process aborted."
                });
            }

            // Create new ip record for user
            await new ipAddress_records_module({
                userDB_id: userData._id,
                shortnerDomain,
                shortUrl: shortedLink,
                status: false,
                processCount: 1,
                uniqueToken: uniqueRandomID,
                ipAddress: userIp
            }).save({ session });

            await session.commitTransaction(); // Commit transaction
            session.endSession(); // End session

            res.status(200).json({
                success: true,
                shortUrl: shortedLink
            });
            return;
        } catch (error) {
            await session.abortTransaction(); // Rollback transaction
            session.endSession(); // End session
            console.error("Error in user_shortlink_firstPage_data_patch:", error);
            const isWriteConflict = error.code === 112 ||
                (error.errorResponse && error.errorResponse.code === 112) ||
                (error.codeName && error.codeName === 'WriteConflict');
            if (isWriteConflict) {
                attempt++;
                continue;
            }
            return res.status(500).json({
                success: false,
                msg: "Internal Server Error"
            });
        }
    }
    return res.status(500).json({
        success: false,
        msg: "Max retry attempts reached. Please try again later."
    });
};

// for click shorten link last page income update for user
const user_shortlink_lastPage_data_patch = async (req, res) => {
    let attempt = 0;
    
    while (attempt < MAX_RETRIES) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // get user unique token
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

            // Find timer record with session
            let idTimer_recordsData = await idTimer_records_module.findOne({
                $and: [
                    { userDB_id: userData._id },
                    { click_short_link_expireTimer: { $exists: true } }
                ]
            }).session(session);

            // Change res data if timer started for user
            if (idTimer_recordsData?.click_short_link_expireTimer) {
                await session.abortTransaction(); // Rollback transaction
                session.endSession();
                return res.status(400).json({
                    success: false,
                    error_msg: "Click Limit exceeded. Try again after the timer completes.",
                });
            }

            let user_incomeUpdate = await userIncome_handle(session, userData, amount)
            if (!user_incomeUpdate.success) {
                throw new Error(user_incomeUpdate.error);
            }
            const { userMonthlyRecord, dateRecords } = user_incomeUpdate.values

            // get all viewAds links data
            const viewAdsConfig = await other_data_module
                .findOne({ documentName: "viewAds" })
                .session(session);

            // check if pendingClick is available in date data if not then create
            if (!dateRecords?.earningSources?.click_short_link?.pendingClick) {
                dateRecords.earningSources.click_short_link.pendingClick = viewAdsConfig.viewAds_pendingClick
            }

            // check current pending number is lessthen equel to total available pending click limit if its true then Update user's pending clicks and income
            if (parseFloat(dateRecords?.earningSources?.click_short_link?.pendingClick) <= parseFloat(viewAdsConfig.viewAds_pendingClick)) {
                dateRecords.earningSources.click_short_link.pendingClick = (parseFloat(dateRecords.earningSources.click_short_link.pendingClick) - 1).toString();
                dateRecords.earningSources.click_short_link.income = (parseFloat(dateRecords.earningSources.click_short_link.income || 0) + parseFloat(amount)).toFixed(3);
            }

            let refer_by_incomeupdate = await userReferByIncome_handle(session, userData, amount)
            if (!refer_by_incomeupdate.success) {
                throw new Error(refer_by_incomeupdate.error);
            }

            // Initialize timer records (if applicable)

            // if user current pending click is empety means its 0 then start timer
            if (dateRecords.earningSources.click_short_link.pendingClick === '0') {
                let idTimerRecordsData = null;
                idTimerRecordsData = await idTimer_records_module
                    .findOne({
                        $and: [
                            { userDB_id: userData._id },
                            { click_short_link_expireTimer: { $exists: null } }
                        ]
                    })
                    .session(session);

                // check if timer already available or not if not available then create new one
                if (!idTimerRecordsData) {
                    const currentTime_fromNewDate = new Date();
                    idTimerRecordsData = new idTimer_records_module({
                        userDB_id: userData._id,
                        click_short_link_expireTimer: new Date(currentTime_fromNewDate.getFullYear(), currentTime_fromNewDate.getMonth(), currentTime_fromNewDate.getDate() + 1, 0, 0, 0),
                    });
                    await idTimerRecordsData.save({ session });
                } else {
                    // Return error if the click limit timer is exceeded
                    await session.abortTransaction();
                    session.endSession();
                    return res.status(400).json({
                        success: false,
                        error_msg: "Click Limit exceeded. Try again after the timer completes.",
                    });
                }
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
                userData.save({ session }),
                dateRecords.save({ session })
            ];

            await Promise.all(saveOperations);

            // ✅ Transaction commit karo
            await session.commitTransaction();
            session.endSession();

            res.status(200).json({ message: "Data updated successfully!", amount });
            return;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.error("Error in user_shortlink_lastPage_data_patch:", error);
            const isWriteConflict = error.code === 112 ||
                (error.errorResponse && error.errorResponse.code === 112) ||
                (error.codeName && error.codeName === 'WriteConflict');
            if (isWriteConflict) {
                attempt++;
                continue;
            }
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    return res.status(500).json({ message: "Max retry attempts reached. Please try again later." });
};

// for get all survey on survey page
const user_survey_available_get = async (req, res) => {
    try {
        const userData = req.user;

        // unique userID for survey api
        let isUserIdDataFound = await userID_data_for_survey_module.findOne({ userDB_id: userData._id });

        // check if user already created or not if not created then create new user
        if (!isUserIdDataFound) {
            // function to genrate unique randomString with finding in user userID_data_for_survey_module data
            async function generateUniqueRandomString(length) {
                const RandomString = generateRandomString(length);
                let increment = 0;
                let newString = RandomString;

                while (await userID_data_for_survey_module.findOne({ userId: newString })) {
                    increment++;
                    newString = `${newString}${increment}`;
                }

                return newString;
            }
            userName = await generateUniqueRandomString(userData.userName.length);

            isUserIdDataFound = new userID_data_for_survey_module({
                userDB_id: userData._id,
                userId: userName
            });

            await isUserIdDataFound.save(); // Save the new record
        }

        const userId = isUserIdDataFound.userId;

        // surveys data
        const surveysWebsites = [
            {
                surveyNetworkName: "CPX Research",
                url: `https://wall.cpx-research.com/index.php?app_id=26205&ext_user_id=${userId}`
            }
        ];

        const available_balance = (parseFloat(userData.deposit_amount || 0) + parseFloat(userData.withdrawable_amount || 0)).toFixed(3);

        return res.status(200).json({
            success: true,
            msg: { available_balance, surveysWebsites }
        });

    } catch (error) {
        console.error("Survey availability check error:", error);
        return res.status(500).json({ success: false, msg: "Survey check failed" });
    }
};

module.exports = {
    user_adsView_home_get,
    user_adsView_income_patch,
    user_shortlink_data_get,
    user_shortlink_firstPage_data_patch,
    user_shortlink_lastPage_data_patch,
    user_survey_available_get
}