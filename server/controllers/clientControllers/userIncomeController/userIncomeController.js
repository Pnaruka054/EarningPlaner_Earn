const mongoose = require('mongoose');
const ipAddress_records_module = require('../../../model/IPAddress/useripAddresses_records_module');
const userDate_records_module = require("../../../model/dashboard/userDate_modules");
const userMonthly_records_module = require("../../../model/dashboard/userMonthly_modules");
const idTimer_records_module = require('../../../model/id_timer/id_timer_records_module')
const getFormattedDate = require('../../../helper/getFormattedDate')
const shortedLinksData_module = require('../../../model/shortLinks/shortedLinksData_module')
const generateRandomString = require("../../../helper/generateRandomString")
const axios = require('axios')
const { userReferByIncome_handle, userIncome_handle } = require('../../../helper/usersEarningsUpdate_handle')
const userID_data_for_offerWall_module = require('../../../model/userID_data_for_offerWall/userID_data_for_offerWall_module')
const other_data_module = require('../../../model/other_data/other_data_module')
const earningCalculator = require('../../../helper/earningCalculator')
const MAX_RETRIES = parseFloat(process.env.MAX_RETRIES) || 3;
const userGiftCode_history_module = require('../../../model/userGiftCode_history/userGiftCode_history_module');
const getFormattedMonth = require('../../../helper/getFormattedMonth');
const current_time_get = require('../../../helper/currentTimeUTC');
const { decryptData } = require('../../../helper/encrypt_decrypt_data');
const offerWallsData_module = require('../../../model/offerWallsData/offerWallsData_module')
const advertiserCampaigns_module = require("../../../model/advertiserCampaigns/advertiserCampaigns")

// for view ads page get data
const user_PTCAds_home_get = async (req, res) => {
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
        const session = await mongoose.startSession(); // Start a session
        session.startTransaction(); // Begin a transaction
        try {
            // format current Date YYYY-MM-DD
            const todayDate = getFormattedDate()
            const userData = req.user;

            // Fetch other_data for viewAds
            let other_data_PTCAds = await other_data_module.findOne({ documentName: "PTCAds" }).session(session);

            // Search for an existing record with the same ipAddress
            let idTimer_recordsData = await idTimer_records_module.find({
                $and: [
                    { userDB_id: userData._id },
                    { for_PTCAds_expire_timer: { $exists: true } },
                    { ptcAds_btnName: { $exists: true } },
                    { expiresAt: { $gte: new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })) } } // Only non-expired documents
                ]
            })
                .sort({ expiresAt: 1 }) // Ascending order; sabse kam expiresAt sabse pehle
                .limit(1)
                .session(session);

            // get all directLinks data
            let excludedIds = idTimer_recordsData.map(item => item.ptcAds_btnName).filter(Boolean); // remove undefined/null if any
            const today = new Date().toLocaleDateString("en-US", { timeZone: "Asia/Kolkata" });

            let PTCAds_campaignsData = await advertiserCampaigns_module.find(
                {
                    $and: [
                        { userDB_id: { $ne: userData._id } },
                        { _id: { $nin: excludedIds } },
                        { status: "active" },
                        {
                            $or: [
                                // If limit is disabled, include the document.
                                { step_3_enableLimit: false },
                                // If limit is enabled and it's a new day, include the document.
                                {
                                    $and: [
                                        { step_3_enableLimit: true },
                                        { $expr: { $ne: ["$todayDate", today] } }
                                    ]
                                },
                                // If limit is enabled and it's the same day, include only if today_completed_total_views is strictly less than step_3_limitViewsPerDay.
                                {
                                    $and: [
                                        { step_3_enableLimit: true },
                                        { $expr: { $eq: ["$todayDate", today] } },
                                        { $expr: { $lt: ["$today_completed_total_views", "$step_3_limitViewsPerDay"] } }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    time: 0,
                    step_3_limitViewsPerDay: 0,
                    step_3_enableLimit: 0,
                    step_3_interval_in_hours: 0,
                    completed_total_views: 0,
                    step_3_total_views: 0,
                    today_completed_total_views: 0,
                    todayDate: 0,
                    spend: 0,
                    step_4_subTotal: 0
                }
            ).session(session);


            // find current date record
            let userDate_recordData = await userDate_records_module
                .findOne({ userDB_id: userData._id, date: todayDate })
                .session(session);

            // Safely extract income and pendingClick if available, otherwise use 0
            const today_PTCAdsIncome = userDate_recordData?.earningSources?.ptc_ads?.income || 0;
            let completedClick = userDate_recordData?.earningSources?.ptc_ads?.ptc_adDomains_data.length || 0;

            // Prepare response data
            let resData = {
                today_PTCAdsIncome,
                completedClick,
                totalLinks: PTCAds_campaignsData.length || 0,
                userAvailableBalance: (parseFloat(userData.deposit_amount || 0) + parseFloat(userData.withdrawable_amount || 0)).toFixed(3),
                PTCAds_campaignsData,
                other_data_PTCAds_instructions: other_data_PTCAds?.PTCAds_instructions || [],
                ...(PTCAds_campaignsData.length === 0 ? { willCome_afterThis_time: idTimer_recordsData[0]?.expiresAt } : false)
            };

            // Commit the transaction and end the session
            await session.commitTransaction();
            session.endSession();

            return res.status(200).json({
                success: true,
                msg: resData,
            });
        } catch (error) {
            console.error("Error in user_ptcAds_home_get:", error);
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
const user_PTCAds_income_patch = async (req, res) => {
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            req.body = await decryptData(req.body.obj);
            let { btnName, btnClickEarn } = req.body;
            btnClickEarn = parseFloat(btnClickEarn);
            const userData = req.user;

            // Update user income
            const userIncomeUpdate = await userIncome_handle(session, userData, btnClickEarn);
            if (!userIncomeUpdate.success) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ success: false, error_msg: userIncomeUpdate.error });
            }

            const { userMonthlyRecord, dateRecords } = userIncomeUpdate.values;
            const today = new Date().toLocaleDateString("en-US", { timeZone: "Asia/Kolkata" });

            dateRecords.earningSources.ptc_ads.income = (
                parseFloat(dateRecords.earningSources.ptc_ads.income || 0) + btnClickEarn
            ).toFixed(3);

            dateRecords.earningSources.ptc_ads.ptc_adDomains_data.push({ ptcAds_btnName: btnName });

            const advertiserCampaign_data = await advertiserCampaigns_module.findById(btnName).session(session);
            !advertiserCampaign_data.today_completed_total_views ? advertiserCampaign_data.today_completed_total_views = 0 : ""
            if (!advertiserCampaign_data || advertiserCampaign_data.status === 'paused') {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ success: false, error_msg: "Invalid or paused campaign" });
            }

            if (advertiserCampaign_data.step_3_total_views <= advertiserCampaign_data.completed_total_views) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ success: false, error_msg: "Invalid or total views limit completed campaign" });
            }

            // Update campaign stats
            if (advertiserCampaign_data.step_3_enableLimit) {
                // When limit is enabled, enforce today's view limit
                if (today === advertiserCampaign_data.todayDate) {
                    if (advertiserCampaign_data.today_completed_total_views < advertiserCampaign_data.step_3_limitViewsPerDay) {
                        advertiserCampaign_data.today_completed_total_views += 1;
                    } else {
                        await session.abortTransaction();
                        session.endSession();
                        return res.status(400).json({ success: false, error_msg: "View limit reached" });
                    }
                } else {
                    advertiserCampaign_data.today_completed_total_views = 1;
                    advertiserCampaign_data.todayDate = today;
                }
            } else {
                // When limit is not enabled, simply increment today's count
                advertiserCampaign_data.today_completed_total_views += 1;
            }

            advertiserCampaign_data.expiresAt = new Date(
                new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })).getTime() + 90 * 24 * 60 * 60 * 1000
            ); // 90 days expire
            advertiserCampaign_data.spend = (
                parseFloat(advertiserCampaign_data.spend) + btnClickEarn
            ).toFixed(3);
            advertiserCampaign_data.completed_total_views += 1;

            if (advertiserCampaign_data.step_3_total_views === advertiserCampaign_data.completed_total_views) {
                advertiserCampaign_data.status = 'completed'
            }

            // Timer record check
            const idTimerRecord = await idTimer_records_module.findOne({
                userDB_id: userData._id,
                ptcAds_btnName: btnName,
            }).session(session);

            if (!idTimerRecord) {
                const indiaTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
                const indiaDate = new Date(indiaTime);
                const intervalInHours = advertiserCampaign_data.step_3_interval_in_hours || 0;
                const expiresAt = new Date(indiaDate.getTime() + intervalInHours * 60 * 60 * 1000);

                await new idTimer_records_module({
                    userDB_id: userData._id,
                    expiresAt,
                    for_PTCAds_expire_timer: expiresAt,
                    ptcAds_btnName: btnName,
                }).save({ session });
            } else {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ success: false, error_msg: "already completed" });
            }

            // Update referral income
            const referralIncome = await userReferByIncome_handle(session, userData, btnClickEarn);
            if (!referralIncome.success) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ success: false, error_msg: referralIncome.error });
            }

            const currentIncome = parseFloat(userMonthlyRecord?.earningSources?.ptc_ads?.income || 0);
            userMonthlyRecord.earningSources.ptc_ads.income = (
                currentIncome + btnClickEarn
            ).toFixed(3);

            // Save all updates
            await Promise.all([
                userMonthlyRecord.save({ session }),
                userData.save({ session }),
                dateRecords.save({ session }),
                advertiserCampaign_data.save({ session }),
            ]);

            await session.commitTransaction();
            session.endSession();

            const responseData = {
                userAvailableBalance: (
                    parseFloat(userData.deposit_amount || 0) +
                    parseFloat(userData.withdrawable_amount || 0)
                ).toFixed(3),
            };

            return res.status(200).json({ success: true, msg: responseData });
        } catch (error) {
            if (session.inTransaction()) await session.abortTransaction();
            session.endSession();

            console.error("Error in updating user data:", error);
            const isWriteConflict =
                error.code === 112 ||
                (error.errorResponse && error.errorResponse.code === 112) ||
                (error.codeName && error.codeName === 'WriteConflict');

            if (isWriteConflict) {
                attempt++;
                console.log(`Write conflict, retrying... Attempt ${attempt}`);
                continue;
            }

            return res.status(500).json({ success: false, error_msg: "An error occurred while processing the request." });
        }
    }

    return res.status(500).json({ success: false, error_msg: "Max retry attempts reached. Please try again later." });
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

            // Find current date record with session
            let userDate_recordData = await userDate_records_module.findOne({
                userDB_id: userData._id,
                date: todayDate
            }).session(session);

            // If no record exists, create a new one with a default structure
            if (!userDate_recordData) {
                userDate_recordData = new userDate_records_module({
                    userDB_id: userData._id,
                    date: todayDate,
                    earningSources: {
                        click_short_link: {
                            short_linkDomails_data: [],
                            income: 0
                        }
                    }
                });
            }

            // Ensure that short_linkDomails_data array exists
            if (!userDate_recordData.earningSources?.click_short_link?.short_linkDomails_data) {
                userDate_recordData.earningSources = userDate_recordData.earningSources || {};
                userDate_recordData.earningSources.click_short_link = userDate_recordData.earningSources.click_short_link || {};
                userDate_recordData.earningSources.click_short_link.short_linkDomails_data = [];
            }

            // Mark matched shorted links as isDisable: true
            shortedLinksData = await Promise.all(
                shortedLinksData.map(async (link) => {
                    // Try to find an existing record for the link; if not found, assume 0 completed clicks
                    const existingRecord = userDate_recordData.earningSources.click_short_link.short_linkDomails_data
                        .find(value => value.domainName === link.shortnerDomain);
                    const completedClicks = existingRecord ? parseFloat(existingRecord.click_completed || 0) : 0;
                    const allowedClicks = parseFloat(link.how_much_click_allow);
                    const isClicked = clickedUrls.has(link.shortnerDomain) || allowedClicks <= completedClicks;

                    // Get related records for this shortnerDomain
                    const relatedRecords = ipAddressRecords.filter(record => record.shortnerDomain === link.shortnerDomain);
                    // isDisable will be true only if the link is clicked and all related records have status === true
                    const isDisable = isClicked && relatedRecords.length > 0 && relatedRecords.every(record => record.status === true);

                    // Find timer record with session
                    let idTimer_recordsData = await idTimer_records_module.findOne({
                        $and: [
                            { userDB_id: userData._id },
                            { click_short_link_domainName: link.shortnerDomain },
                            { for_link_shortner_expire_timer: { $exists: true } }
                        ]
                    }).session(session);

                    return {
                        ...link.toObject(),
                        isDisable,
                        completedClicks,
                        expireTimer: idTimer_recordsData?.for_link_shortner_expire_timer
                    };
                })
            );

            // Safely extract income if available, otherwise use 0
            const today_shortLinkIncome = parseFloat(userDate_recordData.earningSources.click_short_link.income || 0);

            // Calculate completed clicks
            let completedClick = userDate_recordData.earningSources.click_short_link.short_linkDomails_data.reduce(
                (total, current) => total + parseFloat(current.click_completed || 0),
                0
            );

            // Prepare response data
            let resData = {
                userAvailableBalance: (
                    parseFloat(userData.deposit_amount || 0) +
                    parseFloat(userData.withdrawable_amount || 0)
                ).toFixed(3),
                shortedLinksData,
                today_shortLinkIncome: today_shortLinkIncome.toFixed(3),
                completedClick,
                totalLinks: shortedLinksData.length -
                    ipAddressRecords.filter(values => values.processCount === 1 && values.status === true).length,
                other_data_shortLink_instructions: other_data_shortLink.shortLink_instructions
            };

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
            req.body = await decryptData(req.body.obj_already)
            const userData = req.user;
            const userIp = req.ip;
            const { shortnerDomain, endPageRoute, clientOrigin } = req.body;

            if (!userData || !userData._id || !shortnerDomain || !clientOrigin || !endPageRoute) {
                return res.status(400).json({ error_msg: "Invalid data received" });
            }

            // Find timer record with session
            let idTimer_recordsData = await idTimer_records_module.findOne({
                $and: [
                    { userDB_id: userData._id },
                    { click_short_link_domainName: shortnerDomain },
                    { for_link_shortner_expire_timer: { $exists: true } }
                ]
            }).session(session);

            // Change res data if timer started for user
            if (
                idTimer_recordsData?.for_link_shortner_expire_timer &&
                idTimer_recordsData.click_short_link_domainName === shortnerDomain
            ) {
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
                const fullUrl = `${req.headers.origin}${endPageRoute}/${uniqueRandomID}` || `${req.protocol}://${req.get('host')}/${endPageRoute}/${uniqueRandomID}`;
                async function create_final_shortlink(fullUrl, shortnersData) {
                    let lastShortedURL = fullUrl;
                    let lastQuickShortedURL = '';

                    const split_all_shortners = shortnersData.shortnerApiLink.split("&url=");

                    for (let index = 0; index < split_all_shortners.length; index++) {
                        let value = split_all_shortners[index] ? split_all_shortners[index] + "&url=" : '';
                        let value2 = split_all_shortners[index + 1] ? split_all_shortners[index + 1] + "&url=" : null;
                        try {
                            if (!value2 && value && index === 0) {
                                let response = await axios.get(`${value}${fullUrl}`);
                                let shortedLink = response.data?.shortenedUrl || null;

                                if (!shortedLink) {
                                    const split_all_shortners_quick_urls = shortnersData.shortnerQuickLink?.split("&url=") || [];
                                    if (split_all_shortners_quick_urls.length === 0) {
                                        return null;
                                    }
                                    return split_all_shortners_quick_urls[index] + "&url=" + fullUrl;
                                }

                                lastShortedURL = shortedLink;
                                return lastShortedURL;
                            } else {
                                if (value.includes("/api?api=")) {
                                    let response = await axios.get(`${value}${lastShortedURL}`);
                                    let shortedLink = response.data?.shortenedUrl || null;

                                    if (!shortedLink) {
                                        const split_all_shortners_quick_urls = shortnersData.shortnerQuickLink.split("&url=");
                                        lastQuickShortedURL += (split_all_shortners_quick_urls[index] + "&url=");
                                    } else {
                                        lastShortedURL = shortedLink;
                                    }
                                } else {
                                    lastQuickShortedURL += value;
                                }
                            }
                        } catch (error) {
                            console.error(`Error calling shortener API (${value}):`, error.message);
                        }
                    }
                    return lastQuickShortedURL + lastShortedURL;  // Ensure one of them is returned
                }
                try {
                    shortedLink = await create_final_shortlink(fullUrl, shortnersData);
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
            if (ipAddressRecord.status || ipAddressRecord.processCount === 2) {
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
                    { click_short_link_domainName: ipAddressRecord.shortnerDomain },
                    { for_link_shortner_expire_timer: { $exists: true } }
                ]
            }).session(session);

            // Change res data if timer started for user
            if (
                idTimer_recordsData?.for_link_shortner_expire_timer &&
                idTimer_recordsData.click_short_link_domainName === ipAddressRecord.shortnerDomain
            ) {
                await session.abortTransaction(); // Rollback transaction
                session.endSession();
                return res.status(400).json({
                    success: false,
                    error_msg: "Click Limit exceeded. Try again after the timer completes.",
                });
            }

            let user_incomeUpdate = await userIncome_handle(session, userData, amount);
            if (!user_incomeUpdate.success) {
                throw new Error(user_incomeUpdate.error);
            }
            const { userMonthlyRecord, dateRecords } = user_incomeUpdate.values;

            // check if click_completed is available in date data if not then create
            if (!dateRecords?.earningSources?.click_short_link?.short_linkDomails_data) {
                dateRecords.earningSources = dateRecords.earningSources || {};
                dateRecords.earningSources.click_short_link = dateRecords.earningSources.click_short_link || { income: 0 };
                dateRecords.earningSources.click_short_link.short_linkDomails_data = [];
            }

            // Check if domain already exists
            let existing_shortlink_Domain = dateRecords.earningSources.click_short_link.short_linkDomails_data
                .find((value) => value.domainName === ipAddressRecord.shortnerDomain);

            if (!existing_shortlink_Domain) {
                // First time: create a new record, set click_completed to 1, and update income immediately
                existing_shortlink_Domain = {
                    domainName: ipAddressRecord.shortnerDomain,
                    click_completed: '1'
                };
                dateRecords.earningSources.click_short_link.short_linkDomails_data.push(existing_shortlink_Domain);
                dateRecords.earningSources.click_short_link.income = (
                    parseFloat(dateRecords.earningSources.click_short_link.income || 0) + parseFloat(amount)
                ).toFixed(3);
            } else {
                // check current completed click number is less than or equal to total available how_much_click_allow limit
                if (parseFloat(existing_shortlink_Domain.click_completed) < parseFloat(shortedLink.how_much_click_allow)) {
                    existing_shortlink_Domain.click_completed = (parseFloat(existing_shortlink_Domain.click_completed) + 1).toString();
                    dateRecords.earningSources.click_short_link.income = (
                        parseFloat(dateRecords.earningSources.click_short_link.income || 0) + parseFloat(amount)
                    ).toFixed(3);
                } else {
                    await session.abortTransaction(); // Rollback transaction
                    session.endSession();
                    return res.status(400).json({
                        success: false,
                        error_msg: "Click Limit exceeded. Try again after the timer completes.",
                    });
                }
            }

            let refer_by_incomeupdate = await userReferByIncome_handle(session, userData, amount);
            if (!refer_by_incomeupdate.success) {
                throw new Error(refer_by_incomeupdate.error);
            }

            // if user current completed click is equel to how_much_click_allow then start timer
            if (existing_shortlink_Domain.click_completed === shortedLink.how_much_click_allow) {
                let idTimerRecordsData = new idTimer_records_module({
                    userDB_id: userData._id,
                    click_short_link_domainName: ipAddressRecord.shortnerDomain,
                    for_link_shortner_expire_timer: new Date(Date.now() + 24 * 60 * 60 * 1000),
                    expiresAt: new Date(Date.now() + (24 * 60 * 60 * 1000) - (30 * 1000))
                });
                await idTimerRecordsData.save({ session });
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

// for get all offerWall data on offerWall page
const user_offerWall_get = async (req, res) => {
    try {
        // format current Date YYYY-MM-DD
        const todayDate = getFormattedDate();

        const userData = req.user;

        // Fetch other_data for offerWalls
        let other_data_offerWall = await other_data_module.findOne({ documentName: "offerWall" })

        // Retrieve all offer wall datas
        let offerWallData = await offerWallsData_module.find() || [];

        // unique userID for offerWall api
        let isUserIdDataFound = await userID_data_for_offerWall_module.findOne({ userDB_id: userData._id });

        // check if user already created or not if not created then create new user
        if (!isUserIdDataFound) {
            // function to genrate unique randomString with finding in user userID_data_for_offerWall_module data
            async function generateUniqueRandomString(length) {
                const RandomString = generateRandomString(length);
                let increment = 0;
                let newString = RandomString;

                while (await userID_data_for_offerWall_module.findOne({ userId: newString })) {
                    increment++;
                    newString = `${newString}${increment}`;
                }

                return newString;
            }
            userName = await generateUniqueRandomString(userData.userName.length);

            isUserIdDataFound = new userID_data_for_offerWall_module({
                userDB_id: userData._id,
                userId: userName
            });

            await isUserIdDataFound.save(); // Save the new record
        }

        const userId = isUserIdDataFound.userId;

        let offerWallData_after_replace = offerWallData.map(doc => {
            const obj = doc.toObject();
            obj.offerWallApiLink = obj.offerWallApiLink?.replace("${userId}", userId);
            return obj;
        });

        const available_balance = (parseFloat(userData.deposit_amount || 0) + parseFloat(userData.withdrawable_amount || 0)).toFixed(3);

        // Find current date record with session
        let userDate_recordData = await userDate_records_module.findOne({
            userDB_id: userData._id,
            date: todayDate
        });

        const today_offerWallIncome = parseFloat(userDate_recordData?.earningSources?.offerWall?.income || 0);
        let today_completed = parseFloat(userDate_recordData?.earningSources?.offerWall?.completed || 0);
        let total_offerWall = offerWallData_after_replace.length

        let resData = {
            available_balance,
            offerWallData_after_replace,
            today_offerWallIncome,
            today_completed,
            total_offerWall,
            other_data_offerWalls_instructions: other_data_offerWall.offerWall_instructions
        }

        return res.status(200).json({
            success: true,
            msg: resData
        });

    } catch (error) {
        console.error("Survey availability check error:", error);
        return res.status(500).json({ success: false, msg: "Survey check failed" });
    }
};

// for gift code get data page
const user_giftCode_get = async (req, res) => {
    try {
        // Ensure user data exists
        const userData = req.user;
        if (!userData) {
            return res.status(400).json({
                success: false,
                msg: "User data not found.",
            });
        }

        // Fetch the user's gift code claim history
        const userGiftCode_claim_history = await userGiftCode_history_module.find({ userDB_id: userData._id });
        const other_data_giftCode = await other_data_module.findOne({ documentName: "giftCode" }) || {};

        // Calculate available balance by summing deposit_amount and withdrawable_amount (defaulting to 0 if missing)
        const userAvailableBalance = (
            parseFloat(userData.deposit_amount || 0) +
            parseFloat(userData.withdrawable_amount || 0)
        ).toFixed(3);

        // Prepare response data
        const resData = {
            userAvailableBalance,
            userGiftCode_claim_history,
            giftCode_page_Message: other_data_giftCode.giftCode_page_Message
        };

        return res.status(200).json({
            success: true,
            msg: resData,
        });
    } catch (error) {
        console.error("Error in user_giftCode_get:", error);
        return res.status(500).json({
            success: false,
            msg: "An error occurred while processing your request.",
        });
    }
};

// for gift code verify and incress user income
const user_giftCode_verify_and_patch = async (req, res) => {
    let attempt = 0;
    while (attempt < MAX_RETRIES) {
        let session;
        try {
            // Start a new session and begin a transaction
            session = await mongoose.startSession();
            session.startTransaction();

            // Retrieve the authenticated user and gift code from the request
            const userData = req.user;
            const { giftCode_state } = req.body;

            if (!userData) {
                return res.status(400).json({
                    success: false,
                    msg: "User data not found.",
                });
            }

            // Fetch configuration documents using the session
            const other_data_giftCode = await other_data_module
                .findOne({ documentName: "giftCode" })
                .session(session);
            const other_data_viewAds = await other_data_module
                .findOne({ documentName: "viewAds" })
                .session(session);
            const other_data_shortLink = await other_data_module
                .findOne({ documentName: "shortLink" })
                .session(session);

            // Validate the gift code: Check if claim limit is reached or provided gift code does not match
            if (
                other_data_giftCode.giftCode_claimed == other_data_giftCode.giftCode_claim_limit ||
                other_data_giftCode.giftCode !== giftCode_state
            ) {
                return res.status(400).json({
                    success: false,
                    error_msg: "Gift code expired or empty.",
                });
            }

            // Get the current month and date in the desired format
            const monthName = getFormattedMonth();
            const today = getFormattedDate();

            // Fetch today's record and the monthly record using the session
            const dateRecords_1 = await userDate_records_module
                .findOne({ userDB_id: userData._id, date: today })
                .session(session);
            const userMonthlyRecord_1 = await userMonthly_records_module
                .findOne({ userDB_id: userData._id, monthName })
                .session(session);

            // Validate that both date and monthly records exist
            if (!dateRecords_1 || !dateRecords_1.earningSources || !userMonthlyRecord_1) {
                return res.status(400).json({
                    success: false,
                    error_msg: `Before claiming, you must complete today ${other_data_giftCode.viewAds_required} ad views, ${other_data_giftCode.shortlink_required} short link clicks, and ${other_data_giftCode.offerWall_required} OfferWall completions.`,
                });
            }

            // Dynamically determine which tasks are incomplete
            const missingRequirements = [];
            const requiredViewAds = parseFloat(other_data_giftCode.viewAds_required);
            const requiredShortLink = parseFloat(other_data_giftCode.shortlink_required);
            const requiredOfferWall = parseFloat(other_data_giftCode.offerWall_required);

            // Directly compare user’s completed counts to the required values
            const completedViewAds = parseFloat(dateRecords_1.earningSources.view_ads.pendingClick);
            let completedShortLink = dateRecords_1?.earningSources?.click_short_link?.short_linkDomails_data?.reduce(
                (total, current) => total + parseFloat(current.click_completed || 0),
                0
            );
            const completedOfferWall = parseFloat(dateRecords_1.earningSources.offerWall.completed);


            if (!dateRecords_1?.earningSources?.view_ads?.pendingClick || completedViewAds < requiredViewAds) {
                missingRequirements.push(`${requiredViewAds} ad views`);
            }

            if (!completedShortLink || completedShortLink < requiredShortLink) {
                missingRequirements.push(`${requiredShortLink} short link clicks`);
            }

            if (!dateRecords_1?.earningSources?.offerWall?.completed || completedOfferWall < requiredOfferWall) {
                missingRequirements.push(`${requiredOfferWall} OfferWall completions`);
            }

            if (missingRequirements.length > 0) {
                return res.status(400).json({
                    success: false,
                    error_msg: `Before claiming, you must complete today ${missingRequirements.join(', ')}.`,
                });
            }

            // Check if the user has already claimed this gift code using the session
            const userGiftCode_alreadyclaimed = await userGiftCode_history_module
                .findOne({ userDB_id: userData._id, giftCode: giftCode_state })
                .session(session);
            if (userGiftCode_alreadyclaimed) {
                return res.status(400).json({
                    success: false,
                    error_msg: "You already claimed this code. Please use another one.",
                });
            }

            // Increment the claimed count
            other_data_giftCode.giftCode_claimed = parseFloat(other_data_giftCode.giftCode_claimed) + 1;

            // Increase user income by calling a helper function (which uses the session)
            const userIncomeUpdate = await userIncome_handle(session, userData, other_data_giftCode.giftCode_amount);
            if (!userIncomeUpdate.success) {
                throw new Error(userIncomeUpdate.error);
            }
            // Destructure the updated monthly record and date record from the helper's returned values
            const { userMonthlyRecord, dateRecords } = userIncomeUpdate.values;

            // Record the new gift code claim in the history collection using the session
            await new userGiftCode_history_module({
                userDB_id: userData._id,
                giftCode: other_data_giftCode.giftCode,
                bonusAmount: other_data_giftCode.giftCode_amount,
                time: current_time_get(), // current_time_get() returns the current time in the desired format
            }).save({ session });

            // Save all changes concurrently using the session
            await Promise.all([
                userMonthlyRecord.save({ session }),
                userData.save({ session }),
                dateRecords.save({ session }),
                other_data_giftCode.save({ session })
            ]);

            // Commit the transaction and end the session
            await session.commitTransaction();
            session.endSession();

            return res.status(200).json({
                success: true,
                msg: `₹${other_data_giftCode.giftCode_amount} claimed successfully!`,
            });
        } catch (error) {
            if (session && session.inTransaction()) {
                await session.abortTransaction();
            }
            if (session) session.endSession();

            console.error("Error in updating user data:", error);
            const isWriteConflict = error.code === 112 ||
                (error.errorResponse && error.errorResponse.code === 112) ||
                (error.codeName && error.codeName === 'WriteConflict');
            if (isWriteConflict) {
                attempt++;
                console.log(`Global write conflict encountered. Retrying attempt ${attempt}`);
                continue;
            }
            return res.status(500).json({
                success: false,
                msg: "An error occurred while processing your request.",
            });
        }
    }
    return res.status(500).json({ msg: "Max retry attempts reached. Please try again later." });
};

module.exports = {
    user_PTCAds_home_get,
    user_PTCAds_income_patch,
    user_shortlink_data_get,
    user_shortlink_firstPage_data_patch,
    user_shortlink_lastPage_data_patch,
    user_offerWall_get,
    user_giftCode_get,
    user_giftCode_verify_and_patch
}