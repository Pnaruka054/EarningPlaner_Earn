const admin_module = require('../../model/admin/admin_module')
const jwt = require('jsonwebtoken')
const other_data_module = require('../../model/other_data/other_data_module')
const current_time_get = require('../../helper/currentTimeUTC')
const shortedLinksData_module = require('../../model/shortLinks/shortedLinksData_module')
const withdrawal_record = require('../../model/withdraw/withdrawal_records_module')
const userSignUp_module = require('../../model/userSignUp/userSignUp_module')
const mongoose = require("mongoose");
const generateRandomString = require('../../helper/generateRandomString')
const offerWallsData_module = require('../../model/offerWallsData/offerWallsData_module')
const userDate_records_module = require('../../model/dashboard/userDate_modules')
const userMonthly_records_module = require('../../model/dashboard/userMonthly_modules')
const referral_records_module = require('../../model/referralRecords/referral_records_module')
const markitingMailSender = require('../../helper/markitingMailSender');
const advertiserCampaigns_module = require('../../model/advertiserCampaigns/advertiserCampaigns');

function jwt_accessToken(user) {
    return jwt.sign({ jwtUser: user }, process.env.JWT_ACCESS_KEY, { expiresIn: '2h' })
}

const adminLogin = async (req, res) => {
    try {
        let { userName, password } = req.body;
        userName = userName.trim().toLowerCase()
        password = password.trim().toLowerCase()

        // Check if username and password are provided
        if (!userName || !password) {
            return res.status(400).json({
                success: false,
                msg: 'Username and password are required'
            });
        }

        // Check if admin exists
        const admin = await admin_module.findOne({ adminUserName: userName });
        if (!admin) {
            return res.status(401).json({
                success: false,
                msg: 'Invalid credentials'
            });
        }

        // Compare the provided password with the hashed password in DB
        const isMatch = password === admin.adminPassword;
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                msg: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const admin_jwt_token = jwt_accessToken(admin);

        // Set the JWT token in an HttpOnly cookie
        res.cookie('admin_jwt_token', admin_jwt_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 7200000 // 2 hour
        });

        return res.status(200).json({
            success: true,
            msg: 'Logged in successfully'
        });

    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({
            success: false,
            msg: 'Internal server error'
        });
    }
};

const adminLogout = async (req, res) => {
    try {
        res.clearCookie('admin_jwt_token', {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        });
        return res.status(200).json({
            success: true,
            msg: 'LogOut successfully'
        });
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({
            success: false,
            msg: 'Internal server error'
        });
    }
};


// handle dashboard get data
const getDashboardData = async (req, res) => {
    try {
        // Fetch Referral Data
        const other_data_referralRate = await other_data_module.findOne({ documentName: "referralRate" }) || {};
        const other_data_giftCode = await other_data_module.findOne({ documentName: "giftCode" }) || {};
        const referral_rate = other_data_referralRate.referralRate || 0;
        const referral_page_text = other_data_referralRate.referralPageText || "";

        // Fetch Other Data (Announcements, FAQs, Withdrawal Methods)
        const other_data_announcementsArray = await other_data_module.find({ documentName: "announcement" }) || [];
        const other_data_homepageArray = await other_data_module.find({ documentName: "homepage" }) || [];
        const other_data_faqArray = await other_data_module.find({ documentName: "faq" }) || [];
        const other_data_withdrawalMethodArray = await other_data_module.find({ documentName: "withdrawalMethod" }) || [];
        const other_data_smtpMailSendLastData = await other_data_module.findOne({ documentName: "smtpMailSendLastData" }) || {};
        const other_data_balanceConverterInstructions = await other_data_module.findOne({ documentName: "balanceConverterInstructions" }) || {};

        // Response Data
        const res_data = {
            referralData: { referral_rate, referral_page_text },
            announcementData: other_data_announcementsArray,
            faqData: other_data_faqArray,
            withdrawalMethodData: other_data_withdrawalMethodArray,
            other_data_giftCode,
            other_data_homepageArray,
            other_data_smtpMailSendLastData,
            other_data_balanceConverterInstructions: other_data_balanceConverterInstructions?.convertBalance_instructions
        };

        // Send Success Response
        res.status(200).json({ success: true, msg: res_data });

    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({
            success: false,
            msg: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};


// handle referral data
const update_referral_data = async (req, res) => {
    try {
        let { data, btnName } = req.body;

        if (!["text", "rate"].includes(btnName)) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid button name. Must be 'text' or 'rate'."
            });
        }

        let updateField = btnName === "text" ? { referralPageText: data } : { referralRate: data };

        let updatedData = await other_data_module.findOneAndUpdate(
            { documentName: "referralRate" },
            updateField,
            { new: true, upsert: true }
        );

        res.status(200).json({ success: true, msg: updatedData });
    } catch (error) {
        console.error("Error updating referral data:", error);
        res.status(500).json({
            success: false,
            msg: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};


// handle announcements
const post_newAnnouncement_data = async (req, res) => {
    try {
        let { newAnnouncement_data } = req.body;
        let formatedTime = current_time_get();

        if (!newAnnouncement_data || !newAnnouncement_data.announcementTitle || !newAnnouncement_data.announcementMessage) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid data received."
            });
        }

        let newData = new other_data_module({
            documentName: "announcement",
            announcementTitle: newAnnouncement_data.announcementTitle,
            announcementMessage: newAnnouncement_data.announcementMessage,
            announcementTime: formatedTime
        });

        await newData.save();

        res.status(201).json({ success: true, msg: newData });
    } catch (error) {
        console.error("Error inserting new newAnnouncement data:", error);
        res.status(500).json({
            success: false,
            msg: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};

const patch_announcement_data = async (req, res) => {
    try {
        let updated_announcement_data = req.body;
        let formatedTime = current_time_get();

        if (!updated_announcement_data || !updated_announcement_data._id ||
            !updated_announcement_data.announcementTitle || !updated_announcement_data.announcementMessage) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid or missing data received."
            });
        }

        let updatedData = await other_data_module.findOneAndUpdate(
            { documentName: "announcement", _id: updated_announcement_data._id },
            {
                announcementTitle: updated_announcement_data.announcementTitle,
                announcementMessage: updated_announcement_data.announcementMessage,
                announcementTime: formatedTime
            },
            { new: true }
        );

        if (!updatedData) {
            return res.status(404).json({
                success: false,
                error_msg: "Announcement not found."
            });
        }

        res.status(200).json({ success: true, msg: updatedData });
    } catch (error) {
        console.error("Error updating announcement data:", error);
        res.status(500).json({
            success: false,
            msg: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};

const delete_announcement_data = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid request. Announcement _id is required."
            });
        }

        const deletedData = await other_data_module.findOneAndDelete({
            documentName: "announcement",
            _id: id
        });

        if (!deletedData) {
            return res.status(404).json({
                success: false,
                error_msg: "Announcement not found or already deleted."
            });
        }

        res.status(200).json({
            success: true,
            msg: "Announcement successfully deleted."
        });

    } catch (error) {
        console.error("❌ Error deleting announcement:", error);
        res.status(500).json({
            success: false,
            error_msg: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};


// handle FAQ
const post_newFaq_data = async (req, res) => {
    try {
        let { newFaq_data } = req.body;

        if (!newFaq_data || !newFaq_data.faqQuestioin || !newFaq_data.faqAnswer) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid data received."
            });
        }

        let newData = new other_data_module({
            documentName: "faq",
            faqQuestioin: newFaq_data.faqQuestioin,
            faqAnswer: newFaq_data.faqAnswer,
        });

        await newData.save();

        res.status(201).json({ success: true, msg: newData });
    } catch (error) {
        console.error("Error inserting new faq data:", error);
        res.status(500).json({
            success: false,
            msg: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};

const patch_faq_data = async (req, res) => {
    try {
        let { _id, faqQuestioin, faqAnswer } = req.body;
        if (!_id || !faqQuestioin || !faqAnswer) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid data received."
            });
        }

        let updatedData = await other_data_module.findOneAndUpdate(
            { documentName: "faq", _id },
            {
                faqQuestioin,
                faqAnswer,
            },
            { new: true }
        );

        if (!updatedData) {
            return res.status(404).json({
                success: false,
                error_msg: "faq not found."
            });
        }

        res.status(200).json({ success: true, msg: updatedData });
    } catch (error) {
        console.error("Error updating new faq data:", error);
        res.status(500).json({
            success: false,
            msg: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};

const delete_faq_data = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid request. faq _id is required."
            });
        }

        const deletedData = await other_data_module.findOneAndDelete({
            documentName: "faq",
            _id: id
        });

        if (!deletedData) {
            return res.status(404).json({
                success: false,
                error_msg: "faq not found or already deleted."
            });
        }

        res.status(200).json({
            success: true,
            msg: "faq successfully deleted."
        });

    } catch (error) {
        console.error("❌ Error deleting faq:", error);
        res.status(500).json({
            success: false,
            error_msg: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};


// handle Withdrawal Method
const post_withdrawalMethod_data = async (req, res) => {
    try {
        let { withdrawalMethod_name, withdrawalMethod_minimumAmount, withdrawalMethod_details } = req.body;
        if (!withdrawalMethod_name || !withdrawalMethod_minimumAmount || !withdrawalMethod_details) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid data received."
            });
        }
        const is_already_withdrawalMethod = await other_data_module.findOne({ documentName: "withdrawalMethod", withdrawalMethod_name });
        if (is_already_withdrawalMethod) {
            return res.status(409).json({
                success: false,
                error_msg: "This withdrawal Method already available"
            });
        }

        let newData = new other_data_module({
            documentName: "withdrawalMethod",
            withdrawalMethod_name,
            withdrawalMethod_minimumAmount,
            withdrawalMethod_details,
        });

        await newData.save();

        res.status(201).json({ success: true, msg: newData });
    } catch (error) {
        console.error("Error inserting new faq data:", error);
        res.status(500).json({
            success: false,
            msg: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};

const patch_withdrawalMethod_data = async (req, res) => {
    try {
        let { _id, withdrawalMethod_name, withdrawalMethod_minimumAmount, withdrawalMethod_details } = req.body;
        if (!_id || !withdrawalMethod_name || !withdrawalMethod_minimumAmount || !withdrawalMethod_details) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid data received."
            });
        }

        let updatedData = await other_data_module.findOneAndUpdate(
            { documentName: "withdrawalMethod", _id },
            {
                withdrawalMethod_name,
                withdrawalMethod_minimumAmount,
                withdrawalMethod_details
            },
            { new: true }
        );

        if (!updatedData) {
            return res.status(404).json({
                success: false,
                error_msg: "withdrawal Method not found."
            });
        }

        res.status(200).json({ success: true, msg: updatedData });
    } catch (error) {
        console.error("Error updating withdrawal Method data:", error);
        res.status(500).json({
            success: false,
            msg: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};

const delete_withdrawalMethod_data = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid request. withdrawal Method _id is required."
            });
        }

        const deletedData = await other_data_module.findOneAndDelete({
            documentName: "withdrawalMethod",
            _id: id
        });

        if (!deletedData) {
            return res.status(404).json({
                success: false,
                error_msg: "withdrawal Method not found or already deleted."
            });
        }

        res.status(200).json({
            success: true,
            msg: "withdrawal Method successfully deleted."
        });

    } catch (error) {
        console.error("❌ Error deleting withdrawal Method:", error);
        res.status(500).json({
            success: false,
            error_msg: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};


// handle ptc ads data get
const getPTCAdsData = async (req, res) => {
    try {
        const other_data_PTCAds = await other_data_module.findOne({ documentName: "PTCAds" }) || {};
        const PTCadvertiserCampaigns_data = await advertiserCampaigns_module.find()

        const res_data = {
            other_data_PTCAds,
            PTCadvertiserCampaigns_data
        };

        res.status(200).json({ success: true, msg: res_data });
    } catch (error) {
        console.error("Error fetching PTC Ads data:", error);
        res.status(500).json({
            success: false,
            msg: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};

// handle ptc ads update data
const patch_PTCAds_data = async (req, res) => {
    try {
        let { data, btnName } = req.body;

        if (!["text", "limit", "price"].includes(btnName)) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid button name. Must be 'text', 'limit' or 'price."
            });
        }

        let updateField = btnName === "text" ? { PTCAds_instructions: data } : btnName === "limit" ? { PTCAds_total_minimum_Views: data } : { window: data.window, iframe: data.iframe, youtube: data.youtube };

        let updatedData = await other_data_module.findOneAndUpdate(
            { documentName: "PTCAds" },
            updateField,
            { new: true, upsert: true }
        );

        res.status(200).json({ success: true, msg: updatedData });
    } catch (error) {
        console.error("Error updating PTCAds data:", error);
        res.status(500).json({
            success: false,
            msg: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};


// handle short Link data get
const getShortLinkData = async (req, res) => {
    try {
        const other_data_shortLink_Instructions = await other_data_module.findOne({ documentName: "shortLink" }) || {};
        let linkShortnerData = await shortedLinksData_module.find();

        const res_data = {
            other_data_shortLink_Instructions: other_data_shortLink_Instructions?.shortLink_instructions,
            linkShortnerData,
        };

        res.status(200).json({ success: true, msg: res_data });
    } catch (error) {
        console.error("Error fetching short link data:", error);
        res.status(500).json({
            success: false,
            msg: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};

// handle short link update data
const update_ShortLink_data = async (req, res) => {
    try {
        let { data } = req.body;

        if (!data) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid data recived'."
            });
        }

        let updatedData = await other_data_module.findOneAndUpdate(
            { documentName: "shortLink" },
            { shortLink_instructions: data },
            { new: true, upsert: true }
        );

        res.status(200).json({ success: true, msg: updatedData });
    } catch (error) {
        console.error("Error updating short link data:", error);
        res.status(500).json({
            success: false,
            msg: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};


// handle view ads direct link data
const post_ShortenLink_data = async (req, res) => {
    try {
        let { linkShortner_data } = req.body;

        if (!linkShortner_data) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid data received."
            });
        }

        let isUrlAvailable = await shortedLinksData_module.findOne({
            $or: [
                { shortnerName: linkShortner_data.shortnerName },
                { shortnerDomain: linkShortner_data.shortnerDomain },
                { shortnerApiLink: linkShortner_data.shortnerApiLink },
                { shortnerQuickLink: linkShortner_data.shortnerQuickLink }
            ]
        });

        if (isUrlAvailable) {
            return res.status(409).json({
                success: false,
                error_msg: "this link Shortner already available"
            });
        }

        let newData = new shortedLinksData_module({
            shortnerName: linkShortner_data.shortnerName,
            amount: linkShortner_data.amount,
            time: linkShortner_data.time,
            shortnerDomain: linkShortner_data.shortnerDomain,
            shortnerApiLink: linkShortner_data.shortnerApiLink,
            shortnerQuickLink: linkShortner_data.shortnerQuickLink,
            how_much_click_allow: linkShortner_data.how_much_click_allow,
            how_to_complete: linkShortner_data.how_to_complete
        });

        await newData.save();

        res.status(201).json({ success: true, msg: "successfully posted" });
    } catch (error) {
        console.error("Error inserting new viewAds direct link data:", error);
        res.status(500).json({
            success: false,
            msg: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};

const patch_ShortenLink_data = async (req, res) => {
    try {
        let { shortnerName, amount, time, shortnerDomain, shortnerApiLink, shortnerQuickLink, how_to_complete, _id, how_much_click_allow } = req.body;

        if (!shortnerName || !amount || !_id || !shortnerApiLink || !shortnerDomain || !time || !how_much_click_allow || !shortnerQuickLink) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid or missing data received."
            });
        }

        let updatedData = await shortedLinksData_module.findOneAndUpdate(
            { _id },
            {
                shortnerName,
                amount,
                time,
                shortnerDomain,
                shortnerApiLink,
                shortnerQuickLink,
                how_to_complete,
                how_much_click_allow
            },
            { new: true }
        );

        if (!updatedData) {
            return res.status(404).json({
                success: false,
                error_msg: "link Shortner not found."
            });
        }

        res.status(200).json({ success: true, msg: "successfully updated" });
    } catch (error) {
        console.error("Error updating link Shortner data:", error);
        res.status(500).json({
            success: false,
            msg: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};

const delete_ShortenLink_data = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid request. Link Shortner _id is required."
            });
        }

        const deletedData = await shortedLinksData_module.findOneAndDelete({
            _id: id
        });

        if (!deletedData) {
            return res.status(404).json({
                success: false,
                error_msg: "Link Shortner not found or already deleted."
            });
        }

        res.status(200).json({
            success: true,
            msg: "Link Shortner successfully deleted."
        });
    } catch (error) {
        console.error("❌ Error deleting viewAds Link Shortner:", error);
        res.status(500).json({
            success: false,
            error_msg: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};


// handle user withdrawals
const getWithdrawalsData = async (req, res) => {
    try {
        // Retrieve all withdrawal records from the database, sorted by creation date (latest first)
        const withdrawals = await withdrawal_record.find().sort({ createdAt: -1 });
        const other_data_withdrawal = await other_data_module.findOne({ documentName: "withdrawal_instructions" }) || {};

        let res_data = {
            withdrawals,
            withdrawal_instructions: other_data_withdrawal.withdrawal_instructions
        }

        return res.status(200).json({
            success: true,
            msg: res_data,
        });
    } catch (error) {
        console.error("Error fetching withdrawals:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch withdrawal records",
            error: error.message,
        });
    }
};

const updateWithdrawalsData = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const { id, newStatus, remark } = req.body;

        if (!id) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                error_msg: "Withdrawal ID is required",
            });
        }

        // Update the withdrawal record with the new status, remark, and set expiry (1 year from now)
        const updatedWithdrawal = await withdrawal_record.findByIdAndUpdate(
            id,
            {
                withdrawal_status: newStatus,
                remark,
                expireAt: new Date(Date.now() + 31536000000) // 1 year in milliseconds
            },
            { new: true, session }
        );

        if (!updatedWithdrawal) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                success: false,
                error_msg: "Withdrawal record not found",
            });
        }

        // If the withdrawal is marked as "Success" or "Reject", update the user's financial fields accordingly
        if (["Success", "Reject"].includes(newStatus)) {
            const user = await userSignUp_module.findById(updatedWithdrawal.userDB_id).session(session);
            if (user) {
                const withdrawalAmount = parseFloat(updatedWithdrawal.balance || "0");
                // Deduct the withdrawal amount from the pending withdrawal amount
                const pendingWithdrawal =
                    parseFloat(user.pending_withdrawal_amount || "0") - withdrawalAmount;

                if (newStatus === "Success") {
                    // For successful withdrawals, add the amount to total withdrawal amount
                    const totalWithdrawal =
                        parseFloat(user.total_withdrawal_amount || "0") + withdrawalAmount;
                    await userSignUp_module.findByIdAndUpdate(
                        user._id,
                        {
                            pending_withdrawal_amount: pendingWithdrawal.toFixed(3).toString(),
                            total_withdrawal_amount: totalWithdrawal.toFixed(3).toString(),
                        },
                        { new: true, session }
                    );
                } else if (newStatus === "Reject") {
                    // For rejected withdrawals, refund the amount to withdrawable_amount
                    const withdrawableAmount =
                        parseFloat(user.withdrawable_amount || "0") + withdrawalAmount;
                    await userSignUp_module.findByIdAndUpdate(
                        user._id,
                        {
                            pending_withdrawal_amount: pendingWithdrawal.toFixed(3).toString(),
                            withdrawable_amount: withdrawableAmount.toFixed(3).toString(),
                        },
                        { new: true, session }
                    );
                }
            }
        }

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success: true,
            msg: updatedWithdrawal,
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error updating withdrawal record:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update withdrawal record",
            error: error.message,
        });
    }
};

const update_withdrawal_instructions_data = async (req, res) => {
    try {
        let { data } = req.body;

        if (!data) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid Data Received."
            });
        }

        let updatedData = await other_data_module.findOneAndUpdate(
            { documentName: "withdrawal_instructions" },
            { withdrawal_instructions: data },
            { new: true, upsert: true }
        );

        res.status(200).json({ success: true, msg: updatedData });
    } catch (error) {
        console.error("Error updating withdrawal instructions data:", error);
        res.status(500).json({
            success: false,
            msg: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};


// handle Privacy Policy
const getPrivacy_policyData = async (req, res) => {
    try {
        const other_data_privacy_policy = await other_data_module.findOne({ documentName: "privacy_policy" });

        return res.status(200).json({
            success: true,
            msg: other_data_privacy_policy,
        });
    } catch (error) {
        console.error("Error fetching privacy_policy data:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later.",
            error: error.message,
        });
    }
};

const patch_privacy_policy_data = async (req, res) => {
    try {
        let { privacy_policy } = req.body;

        if (!privacy_policy) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid Data Received."
            });
        }

        let updatedData = await other_data_module.findOneAndUpdate(
            { documentName: "privacy_policy" },
            { privacy_policy },
            { new: true, upsert: true }
        );

        res.status(200).json({ success: true, msg: updatedData });
    } catch (error) {
        console.error("Error updating terms_of_use data:", error);
        res.status(500).json({
            success: false,
            msg: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};


// handle terms_of_use
const getTerms_of_useData = async (req, res) => {
    try {
        const other_data_terms_of_use = await other_data_module.findOne({ documentName: "terms_of_use" });

        return res.status(200).json({
            success: true,
            msg: other_data_terms_of_use,
        });
    } catch (error) {
        console.error("Error fetching terms_of_use data:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later.",
            error: error.message,
        });
    }
};

const patch_terms_of_use_data = async (req, res) => {
    try {
        let { terms_of_use } = req.body;

        if (!terms_of_use) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid Data Received."
            });
        }

        let updatedData = await other_data_module.findOneAndUpdate(
            { documentName: "terms_of_use" },
            { terms_of_use },
            { new: true, upsert: true }
        );

        res.status(200).json({ success: true, msg: updatedData });
    } catch (error) {
        console.error("Error updating terms_of_use data:", error);
        res.status(500).json({
            success: false,
            msg: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};


// handle getDmcaData
const getDmcaData = async (req, res) => {
    try {
        const other_data_dmca = await other_data_module.findOne({ documentName: "dmca" });

        return res.status(200).json({
            success: true,
            msg: other_data_dmca,
        });
    } catch (error) {
        console.error("Error fetching dmca data:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later.",
            error: error.message,
        });
    }
};

const patch_dmca_data = async (req, res) => {
    try {
        let { dmca } = req.body;

        if (!dmca) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid Data Received."
            });
        }

        let updatedData = await other_data_module.findOneAndUpdate(
            { documentName: "dmca" },
            { dmca },
            { new: true, upsert: true }
        );

        res.status(200).json({ success: true, msg: updatedData });
    } catch (error) {
        console.error("Error updating dmca data:", error);
        res.status(500).json({
            success: false,
            msg: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};


// handle gift code create
const postGift_code_data = async (req, res) => {
    try {
        // Destructure required fields from the request body
        const { viewAds_required, giftCode_claim_limit, shortlink_required, offerWall_required, giftCode_amount, isPageMessage, giftCode_page_Message } = req.body;

        // Validate that required fields are present (update condition as per your business logic)
        if (
            viewAds_required === undefined ||
            giftCode_claim_limit === undefined ||
            shortlink_required === undefined ||
            giftCode_amount === undefined ||
            isPageMessage === undefined ||
            giftCode_page_Message === undefined ||
            offerWall_required === undefined
        ) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid Data Received. All fields are required.",
            });
        }

        // Update or insert the gift code configuration document.
        // A new gift code is generated using generateRandomString(5).
        let updatedData = null

        if (isPageMessage) {
            updatedData = await other_data_module.findOneAndUpdate(
                { documentName: "giftCode" },
                {
                    giftCode_page_Message
                },
                { new: true, upsert: true }
            );
        } else {
            updatedData = await other_data_module.findOneAndUpdate(
                { documentName: "giftCode" },
                {
                    viewAds_required,
                    giftCode_claim_limit,
                    giftCode_amount,
                    giftCode_claimed: "0",
                    giftCode: generateRandomString(10).toUpperCase(),
                    shortlink_required,
                    offerWall_required,
                },
                { new: true, upsert: true }
            );
        }

        return res.status(200).json({
            success: true,
            msg: updatedData,
        });
    } catch (error) {
        console.error("Error in Update Gift_code_data:", error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error. Please try again later.",
            error: error.message,
        });
    }
};


// handle offerwall
const getOfferWallData = async (req, res) => {
    try {
        // Retrieve offer wall instructions and other related data (if exists)
        const other_data_offerWall = await other_data_module.findOne({ documentName: "offerWall" }) || {};
        // Retrieve all offer wall entries
        const offerWallData = await offerWallsData_module.find();

        return res.status(200).json({
            success: true,
            msg: {
                other_data_offerWall,
                offerWallData,
            }
        });
    } catch (error) {
        console.error("Error fetching offerWall data:", error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};

//  Controller to update offer wall instructions
const patchOfferWallInstructions = async (req, res) => {
    try {
        const { offerWall_instructions } = req.body;

        // Validate that offerWall_instructions exists and is an array (if you expect multiple instructions)
        if (!offerWall_instructions || !Array.isArray(offerWall_instructions)) {
            return res.status(400).json({
                success: false,
                msg: "Invalid instructions provided. It must be a valid array of instructions.",
            });
        }

        // Use $set to update only the offerWall_instructions field
        const updatedData = await other_data_module.findOneAndUpdate(
            { documentName: "offerWall" },
            { $set: { offerWall_instructions } },
            { new: true, upsert: true }
        );

        return res.status(200).json({
            success: true,
            msg: updatedData,
        });
    } catch (error) {
        console.error("Error updating offerwall data:", error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error. Please try again later.",
            error: error.message,
        });
    }
};

// Controller to add a new offer wall entry
const postOfferWall = async (req, res) => {
    try {
        const { offerWallName, offerWallApiLink } = req.body;

        // Basic validation for required fields
        if (!offerWallName || !offerWallApiLink) {
            return res.status(400).json({
                success: false,
                error_msg: "Both offerWallName and offerWallApiLink are required."
            });
        }

        // Create a new instance of the offer wall document
        const newOfferWall = new offerWallsData_module({
            offerWallName,
            offerWallApiLink,
        });

        await newOfferWall.save();

        return res.status(201).json({ success: true, msg: "OfferWall successfully posted", newOfferWall });
    } catch (error) {
        console.error("Error inserting new offerWall link data:", error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};

// Controller to update an existing offer wall entry
const patchOfferWall = async (req, res) => {
    try {
        const { editingId_state, editData_state } = req.body;

        if (!editingId_state || !editData_state) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid or missing data received. editingId_state and editData_state are required."
            });
        }

        // Validate required fields in editData_state if needed
        if (!editData_state.offerWallName || !editData_state.offerWallApiLink) {
            return res.status(400).json({
                success: false,
                error_msg: "Both offerWallName and offerWallApiLink are required in editData_state."
            });
        }

        // Update the document using $set operator for clarity
        const updatedData = await offerWallsData_module.findOneAndUpdate(
            { _id: editingId_state },
            {
                $set: {
                    offerWallName: editData_state.offerWallName,
                    offerWallApiLink: editData_state.offerWallApiLink,
                }
            },
            { new: true }
        );

        if (!updatedData) {
            return res.status(404).json({
                success: false,
                error_msg: "OfferWall entry not found."
            });
        }

        return res.status(200).json({ success: true, msg: "OfferWall successfully updated", updatedData });
    } catch (error) {
        console.error("Error updating offerWall data:", error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};

// Controller to delete an offer wall entry
const deleteOfferWall = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid request. OfferWall _id is required."
            });
        }

        const deletedData = await offerWallsData_module.findOneAndDelete({ _id: id });

        if (!deletedData) {
            return res.status(404).json({
                success: false,
                error_msg: "OfferWall not found or already deleted."
            });
        }

        return res.status(200).json({
            success: true,
            msg: "OfferWall successfully deleted."
        });
    } catch (error) {
        console.error("Error deleting OfferWall:", error);
        return res.status(500).json({
            success: false,
            error_msg: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};


// handle homepage
const post_newHomepage_data = async (req, res) => {
    try {
        let { newHomepage_section_data } = req.body;

        if (!newHomepage_section_data || !newHomepage_section_data.homepageSection_title || !newHomepage_section_data.homepageSection_message) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid data received."
            });
        }

        let newData = new other_data_module({
            documentName: "homepage",
            homepageSection_title: newHomepage_section_data.homepageSection_title,
            homepageSection_message: newHomepage_section_data.homepageSection_message,
        });

        await newData.save();

        res.status(201).json({ success: true, msg: newData });
    } catch (error) {
        console.error("Error inserting new new homepage data:", error);
        res.status(500).json({
            success: false,
            msg: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};

const patch_homepage_data = async (req, res) => {
    try {
        let { homepageSection_title, homepageSection_message, _id } = req.body;

        if (!homepageSection_title || !homepageSection_message || !_id) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid or missing data received."
            });
        }

        let updatedData = await other_data_module.findOneAndUpdate(
            { documentName: "homepage", _id },
            {
                homepageSection_title,
                homepageSection_message,
            },
            { new: true }
        );

        if (!updatedData) {
            return res.status(404).json({
                success: false,
                error_msg: "homepage not found."
            });
        }

        res.status(200).json({ success: true, msg: updatedData });
    } catch (error) {
        console.error("Error updating homepage data:", error);
        res.status(500).json({
            success: false,
            msg: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};

const delete_homepage_data = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid request. homepage _id is required."
            });
        }

        const deletedData = await other_data_module.findOneAndDelete({
            documentName: "homepage",
            _id: id
        });

        if (!deletedData) {
            return res.status(404).json({
                success: false,
                error_msg: "homepage not found or already deleted."
            });
        }

        res.status(200).json({
            success: true,
            msg: "homepage successfully deleted."
        });

    } catch (error) {
        console.error("❌ Error deleting homepage:", error);
        res.status(500).json({
            success: false,
            error_msg: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};


// handle all users data
const getUserData = async (req, res) => {
    try {
        const { userSearchId } = req.query;
        if (!userSearchId) {
            return res.status(400).json({
                success: false,
                error_msg: "User search ID is required.",
            });
        }
        const userData = await userSignUp_module.findById(userSearchId);
        if (!userData) {
            return res.status(404).json({
                success: false,
                error_msg: "User not found.",
            });
        }
        return res.status(200).json({
            success: true,
            msg: userData,
        });
    } catch (error) {
        console.error("Error fetching user data:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later.",
            error: error.message,
        });
    }
};

const getAllUsersData = async (req, res) => {
    try {
        // Fetch all users from the signup module.
        const users = await userSignUp_module.find();
        if (!users || users.length === 0) {
            return res.status(404).json({
                success: false,
                error_msg: "Users not found.",
            });
        }

        // Process each user concurrently.
        const usersData = await Promise.all(
            users.map(async (user) => {
                // Get related data concurrently.
                const [withdrawals, dateRecords, monthlyRecords] = await Promise.all([
                    withdrawal_record.find({ userDB_id: user._id }),
                    userDate_records_module.find({ userDB_id: user._id }),
                    userMonthly_records_module.find({ userDB_id: user._id }),
                ]);

                return {
                    user, // or user details you want to expose
                    withdrawals,
                    dateRecords,
                    monthlyRecords,
                };
            })
        );

        return res.status(200).json({
            success: true,
            msg: usersData?.reverse(),
        });
    } catch (error) {
        console.error("Error fetching user data:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later.",
            error: error.message,
        });
    }
};

const deleteUserData = async (req, res) => {
    try {
        // Get the user ID from request parameters.
        const { userId } = req.query;

        // Check if the user exists.
        const user = await userSignUp_module.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error_msg: "User not found.",
            });
        }

        // Delete all related records concurrently.
        await Promise.all([
            withdrawal_record.deleteMany({ userDB_id: userId }),
            referral_records_module.deleteMany({ userDB_id: userId }),
            referral_records_module.deleteMany({ userName: user.userName }),
            userDate_records_module.deleteMany({ userDB_id: userId }),
            userMonthly_records_module.deleteMany({ userDB_id: userId }),
        ]);

        // Delete the user.
        await userSignUp_module.findByIdAndDelete(userId);

        return res.status(200).json({
            success: true,
            msg: "User and related data deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting user data:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later.",
            error: error.message,
        });
    }
};

// handle markiting mail
const sendMarkitingEmails = async (req, res) => {
    try {
        const { mailSendingData_state: { subject, message, Google_Sheets_ID } } = req.body;
        if (!subject || !message) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid data received. Subject and message are required."
            });
        }

        // Retrieve or create the document that tracks last sent email, subject, etc.
        let doc = await other_data_module.findOne({ documentName: "smtpMailSendLastData" });
        if (!doc) {
            doc = new other_data_module({ documentName: "smtpMailSendLastData", subject, message, Google_Sheets_ID, process_status: true });
        } else {
            // Update subject and message in case they have changed.
            doc.subject = subject;
            doc.message = message;
            doc.process_status = true;
            doc.Google_Sheets_ID = Google_Sheets_ID;
        }

        await doc.save();

        // Format the message for HTML email (replace newlines with <br>)
        const formattedHtml = doc.message?.replace(/\n/g, "<br>");

        // Call the asynchronous mail sender function.
        markitingMailSender(doc.subject, formattedHtml);

        // Save the document.
        return res.status(201).json({ success: true, msg: "Marketing mails sent successfully." });
    } catch (error) {
        console.error("Error sending marketing emails:", error);
        return res.status(500).json({ success: false, error_msg: "Internal Server Error" });
    }
};

const sendMarkitingEmailsPatch = async (req, res) => {
    try {
        const { operation, mailSendingData_state: { subject, message } = {} } = req.body;
        if (!operation) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid data received. Operation is required."
            });
        }

        // Retrieve or create the document.
        let doc = await other_data_module.findOne({ documentName: "smtpMailSendLastData" });
        if (!doc) {
            doc = new other_data_module({ documentName: "smtpMailSendLastData" });
        }

        if (operation === "stop") {
            doc.process_status = false;
        } else if (operation === "start") {
            if (!subject || !message) {
                return res.status(400).json({
                    success: false,
                    error_msg: "Please provide subject and message to start the process."
                });
            }
            doc.process_status = true;
            // Format the message for HTML
            const formattedHtml = message.replace(/\n/g, "<br>");
            // Start sending marketing mails asynchronously.
            markitingMailSender(subject, formattedHtml);
            // Update document with new subject and message.
            doc.subject = subject;
            doc.message = message;
        } else if (operation === "reset") {
            // Set properties to undefined so they are removed from the document
            doc.to = undefined;
            doc.index = undefined;
            doc.success_status = undefined;
            doc.process_status = undefined;
            doc.lastUpdated = undefined;
            doc.message = undefined;
            doc.subject = undefined;
            doc.Google_Sheets_ID = undefined;
            // Alternatively, you can use doc.set("field", undefined) for each field.
        } else {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid operation."
            });
        }

        await doc.save();
        return res.status(200).json({ success: true, message: "Operation completed successfully." });
    } catch (error) {
        console.error("Error in sendMarkitingEmailsPatch:", error);
        return res.status(500).json({ success: false, error_msg: "Internal Server Error" });
    }
};

// handle balance converter
const balanceConverter_update = async (req, res) => {
    try {
        let { data } = req.body;

        if (!data) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid Data Received."
            });
        }

        let updatedData = await other_data_module.findOneAndUpdate(
            { documentName: "balanceConverterInstructions" },
            { convertBalance_instructions: data },
            { new: true, upsert: true }
        );

        res.status(200).json({ success: true, msg: updatedData });
    } catch (error) {
        console.error("Error updating balance converter instructions data:", error);
        res.status(500).json({
            success: false,
            msg: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};

module.exports = {
    adminLogin,
    adminLogout,
    getDashboardData,
    update_referral_data,
    post_newAnnouncement_data,
    patch_announcement_data,
    delete_announcement_data,
    post_newFaq_data,
    patch_faq_data,
    delete_faq_data,
    post_withdrawalMethod_data,
    patch_withdrawalMethod_data,
    delete_withdrawalMethod_data,
    getPTCAdsData,
    patch_PTCAds_data,
    getShortLinkData,
    update_ShortLink_data,
    post_ShortenLink_data,
    patch_ShortenLink_data,
    delete_ShortenLink_data,
    getWithdrawalsData,
    updateWithdrawalsData,
    getUserData,
    update_withdrawal_instructions_data,
    getPrivacy_policyData,
    patch_privacy_policy_data,
    getTerms_of_useData,
    patch_terms_of_use_data,
    getDmcaData,
    patch_dmca_data,
    postGift_code_data,
    getOfferWallData,
    patchOfferWallInstructions,
    postOfferWall,
    patchOfferWall,
    deleteOfferWall,
    post_newHomepage_data,
    patch_homepage_data,
    delete_homepage_data,
    getAllUsersData,
    deleteUserData,
    sendMarkitingEmails,
    sendMarkitingEmailsPatch,
    balanceConverter_update
}