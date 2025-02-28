const admin_module = require('../../model/admin/admin_module')
const jwt = require('jsonwebtoken')
const other_data_module = require('../../model/other_data/other_data_module')
const current_time_get = require('../../helper/currentTimeUTC')
const viewAds_directLinksData_module = require("../../model/view_ads_direct_links/viewAds_directLinksData_module");
const shortedLinksData_module = require('../../model/shortLinks/shortedLinksData_module')
const withdrawal_record = require('../../model/withdraw/withdrawal_records_module')
const userSignUp_module = require('../../model/userSignUp/userSignUp_module')
const mongoose = require("mongoose");
const getFormattedDate = require('../../helper/getFormattedDate')

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
        const referral_rate = other_data_referralRate.referralRate || 0;
        const referral_page_text = other_data_referralRate.referralPageText || "";

        // Fetch Other Data (Announcements, FAQs, Withdrawal Methods)
        const other_data_announcementsArray = await other_data_module.find({ documentName: "announcement" }) || [];
        const other_data_faqArray = await other_data_module.find({ documentName: "faq" }) || [];
        const other_data_withdrawalMethodArray = await other_data_module.find({ documentName: "withdrawalMethod" }) || [];

        // Response Data
        const res_data = {
            referralData: { referral_rate, referral_page_text },
            announcementData: other_data_announcementsArray,
            faqData: other_data_faqArray,
            withdrawalMethodData: other_data_withdrawalMethodArray
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


// handle views ads data get
const getViewAdsData = async (req, res) => {
    try {
        const other_data_viewAds_limit = await other_data_module.findOne({ documentName: "viewAds" }) || {};
        let viewAds_directLinksData = await viewAds_directLinksData_module.find();

        const res_data = {
            other_data_viewAds_limit,
            viewAds_directLinksData,
        };

        res.status(200).json({ success: true, msg: res_data });
    } catch (error) {
        console.error("Error fetching view Ads data:", error);
        res.status(500).json({
            success: false,
            msg: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};

// handle view ads update data
const update_viewAds_data = async (req, res) => {
    try {
        let { data, btnName } = req.body;

        if (!["text", "limit"].includes(btnName)) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid button name. Must be 'text' or 'limit'."
            });
        }

        let updateField = btnName === "text" ? { viewAds_instructions: data } : { viewAds_pendingUpdates: data };

        let updatedData = await other_data_module.findOneAndUpdate(
            { documentName: "viewAds" },
            updateField,
            { new: true, upsert: true }
        );

        res.status(200).json({ success: true, msg: updatedData });
    } catch (error) {
        console.error("Error updating viewAds data:", error);
        res.status(500).json({
            success: false,
            msg: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};


// handle view ads direct link data
const post_viewAds_directLink_data = async (req, res) => {
    try {
        let { viewAdsDirectLink_data } = req.body;

        if (!viewAdsDirectLink_data) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid data received."
            });
        }

        let isUrlAvailable = await viewAds_directLinksData_module.findOne({ url: viewAdsDirectLink_data.url })
        if (isUrlAvailable) {
            return res.status(409).json({
                success: false,
                error_msg: "direct link already available"
            });
        }

        let newData = new viewAds_directLinksData_module({
            buttonTitle: viewAdsDirectLink_data.buttonTitle,
            amount: viewAdsDirectLink_data.amount,
            url: viewAdsDirectLink_data.url,
            isExtension: viewAdsDirectLink_data.isExtension,
            adNetworkName: viewAdsDirectLink_data.adNetworkName
        });

        await newData.save();

        res.status(201).json({ success: true, msg: newData });
    } catch (error) {
        console.error("Error inserting new viewAds direct link data:", error);
        res.status(500).json({
            success: false,
            msg: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};

const patch_viewAds_directLink_data = async (req, res) => {
    try {
        let { buttonTitle, amount, url, isExtension, adNetworkName, _id } = req.body;

        if (!buttonTitle || !amount || !_id || !url || !adNetworkName) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid or missing data received."
            });
        }

        let updatedData = await viewAds_directLinksData_module.findOneAndUpdate(
            { _id },
            {
                buttonTitle,
                amount,
                url,
                isExtension,
                adNetworkName
            },
            { new: true }
        );

        if (!updatedData) {
            return res.status(404).json({
                success: false,
                error_msg: "direct link not found."
            });
        }

        res.status(200).json({ success: true, msg: updatedData });
    } catch (error) {
        console.error("Error updating viewAds direct link data:", error);
        res.status(500).json({
            success: false,
            msg: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};

const delete_viewAds_directLink_data = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid request. direct link _id is required."
            });
        }

        const deletedData = await viewAds_directLinksData_module.findOneAndDelete({
            _id: id
        });

        if (!deletedData) {
            return res.status(404).json({
                success: false,
                error_msg: "direct link not found or already deleted."
            });
        }

        res.status(200).json({
            success: true,
            msg: "direct link successfully deleted."
        });
    } catch (error) {
        console.error("❌ Error deleting viewAds direct link:", error);
        res.status(500).json({
            success: false,
            error_msg: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};


// handle short Link data get
const getShortLinkData = async (req, res) => {
    try {
        const other_data_shortLink_limit = await other_data_module.findOne({ documentName: "shortLink" }) || {};
        let linkShortnerData = await shortedLinksData_module.find();

        const res_data = {
            other_data_shortLink_limit,
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

// handle view ads update data
const update_ShortLink_data = async (req, res) => {
    try {
        let { data, btnName } = req.body;

        if (!["text", "limit"].includes(btnName)) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid button name. Must be 'text' or 'limit'."
            });
        }

        let updateField = btnName === "text" ? { shortLink_instructions: data } : { shortLink_pendingUpdates: data };

        let updatedData = await other_data_module.findOneAndUpdate(
            { documentName: "shortLink" },
            updateField,
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
                { shortnerApiLink: linkShortner_data.shortnerApiLink }
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
            shortnerApiLink: linkShortner_data.shortnerApiLink
        });

        await newData.save();

        res.status(201).json({ success: true, msg: newData });
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
        let { shortnerName, amount, time, shortnerDomain, shortnerApiLink, _id } = req.body;

        if (!shortnerName || !amount || !_id || !shortnerApiLink || !shortnerDomain || !time) {
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
                shortnerApiLink
            },
            { new: true }
        );

        if (!updatedData) {
            return res.status(404).json({
                success: false,
                error_msg: "link Shortner not found."
            });
        }

        res.status(200).json({ success: true, msg: updatedData });
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
            message: "Failed to fetch user data.",
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
    getViewAdsData,
    update_viewAds_data,
    patch_viewAds_directLink_data,
    post_viewAds_directLink_data,
    delete_viewAds_directLink_data,
    getShortLinkData,
    update_ShortLink_data,
    post_ShortenLink_data,
    patch_ShortenLink_data,
    delete_ShortenLink_data,
    getWithdrawalsData,
    updateWithdrawalsData,
    getUserData,
    update_withdrawal_instructions_data
}