const advertiserCampaigns_module = require("../../model/advertiserCampaigns/advertiserCampaigns")
const userSignUp_module = require('../../model/userSignUp/userSignUp_module')
const getFormattedDate = require('../../helper/getFormattedDate');
const { decryptData } = require("../../helper/encrypt_decrypt_data");
const other_data_module = require('../../model/other_data/other_data_module')
const MAX_RETRIES = parseFloat(process.env.MAX_RETRIES) || 3;
const mongoose = require('mongoose');

const advertiserDataGet = async (req, res) => {
    try {
        const userData = req.user;

        // Retrieve all advertiser campaigns for the user
        const allAdvertiserCampaigns = await advertiserCampaigns_module.find({ userDB_id: userData._id });

        // Calculate remaining views across all campaigns
        const remainingViews = allAdvertiserCampaigns.reduce((total, campaign) => {
            const totalViews = campaign.step_3_total_views || 0;
            const completedViews = campaign.completed_total_views || 0;
            // Only add positive differences
            return total + Math.max(totalViews - completedViews, 0);
        }, 0);

        // Separate active and paused campaigns
        const activeCampaigns = allAdvertiserCampaigns.filter(campaign => campaign.status === "active");
        const pausedCampaigns = allAdvertiserCampaigns.filter(campaign => campaign.status !== "active");

        // Build the response data
        const resData = {
            userAvailableBalance: (
                parseFloat(userData.deposit_amount || 0) +
                parseFloat(userData.withdrawable_amount || 0)
            ).toFixed(3),
            total_campaigns: allAdvertiserCampaigns.length,
            active_campaigns: activeCampaigns.length,
            paused_campaigns: pausedCampaigns.length,
            remaining_views: remainingViews,
            advertiserData: allAdvertiserCampaigns,
            userDepositBalance: userData.deposit_amount
        };

        return res.status(200).json({
            success: true,
            msg: resData,
        });
    } catch (error) {
        console.error("Error in advertiserDataGet:", error);
        return res.status(500).json({
            success: false,
            msg: "Server error",
        });
    }
};

const advertiserCreateDataGet = async (req, res) => {
    try {
        const userData = req.user;
        const other_data_PTCAds = await other_data_module.findOne({ documentName: "PTCAds" }) || {};

        // Build the response data
        const resData = {
            userAvailableBalance: (
                parseFloat(userData.deposit_amount || 0) +
                parseFloat(userData.withdrawable_amount || 0)
            ).toFixed(3),
            userDepositBalance: userData.deposit_amount,
            PTCAds_total_minimum_Views: other_data_PTCAds?.PTCAds_total_minimum_Views || 100,
            PTCAds_pricing: {
                window: other_data_PTCAds?.window,
                iframe: other_data_PTCAds?.iframe,
                youtube: other_data_PTCAds?.youtube
            }
        };

        return res.status(200).json({
            success: true,
            msg: resData,
        });
    } catch (error) {
        console.error("Error in advertiserDataGet:", error);
        return res.status(500).json({
            success: false,
            msg: "Server error",
        });
    }
};

const advertiserDataPost = async (req, res) => {
    req.body = await decryptData(req.body.obj);
    let {
        step_2_title,
        step_2_url,
        step_2_description,
        step_3_duration,
        step_3_total_views,
        step_3_interval_in_hours,
        step_3_enableLimit,
        step_3_limitViewsPerDay,
        step_4_subTotal,
        selectedOption_state
    } = req.body;

    step_4_subTotal = parseFloat(step_4_subTotal)

    const userData = req.user;
    const current_date_time = getFormattedDate();

    let attempt = 0;

    while (attempt < MAX_RETRIES) {
        const session = await mongoose.startSession();
        session.startTransaction(); // Start transaction early

        try {
            if (!userData) {
                throw new Error("User not found");
            }

            if (parseFloat(userData.deposit_amount) < step_4_subTotal) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ success: false, error_msg: "Insufficient balance" });
            }

            // Deduct balance
            userData.deposit_amount = (parseFloat(userData.deposit_amount) - step_4_subTotal).toFixed(3);
            await userData.save({ session });

            const other_data_PTCAds = await other_data_module.findOne({ documentName: "PTCAds" }).session(session) || {};

            if (step_3_total_views < parseInt(other_data_PTCAds?.PTCAds_total_minimum_Views || 100)) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ success: false, error_msg: "Total Views are not greater or equal" });
            }

            const today = new Date().toLocaleDateString("en-US", { timeZone: "Asia/Kolkata" });

            // Save campaign
            const newCampaign = new advertiserCampaigns_module({
                userDB_id: userData._id,
                step_2_title,
                step_2_url,
                step_2_description,
                step_3_duration_for_user: parseInt(step_3_duration.split('-')[0]),
                step_3_amount_for_user: parseFloat(step_3_duration.split('-')[1]).toFixed(3),
                step_3_total_views,
                step_3_interval_in_hours,
                step_3_enableLimit: !!step_3_enableLimit,
                step_3_limitViewsPerDay,
                step_4_subTotal,
                spend: "0.000",
                campaignType: selectedOption_state,
                todayDate: today,
                status: "active",
                completed_total_views: 0,
                expiresAt: new Date(Date.now() + (90 * 24 * 60 * 60 * 1000)),
                time: current_date_time
            });

            await newCampaign.save({ session });

            // Commit and end session
            await session.commitTransaction();
            session.endSession();

            // Build the response data
            const resData = {
                userAvailableBalance: (
                    parseFloat(userData.deposit_amount || 0) +
                    parseFloat(userData.withdrawable_amount || 0)
                ).toFixed(3),
                userDepositBalance: userData.deposit_amount
            };

            return res.status(200).json({
                success: true,
                msg: resData
            });

        } catch (error) {
            // Rollback and clean up session
            if (session.inTransaction()) {
                await session.abortTransaction();
            }
            session.endSession();

            // Check for write conflict
            const isWriteConflict = error.code === 112 ||
                (error.errorResponse && error.errorResponse.code === 112) ||
                (error.codeName && error.codeName === 'WriteConflict');

            if (isWriteConflict) {
                attempt++;
                console.warn(`Write conflict on attempt ${attempt}. Retrying...`);
                continue;
            }

            console.error("Error during transaction:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to process campaign request.",
                error: error.message
            });
        }
    }

    // Max retries reached
    return res.status(500).json({
        success: false,
        message: "Write conflict occurred multiple times. Please try again."
    });
};

const advertiserCampaign_paused_active_patch = async (req, res) => {
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const decryptedData = await decryptData(req.body.encryptedObj);
            const { clientMsg, _id } = decryptedData;
            const userData = req.user;

            if (!["paused", "active", "delete"].includes(clientMsg)) {
                return res.status(400).json({ success: false, message: "Invalid action" });
            }

            if (!mongoose.Types.ObjectId.isValid(_id)) {
                return res.status(400).json({ success: false, message: "Invalid campaign ID" });
            }

            const campaign = await advertiserCampaigns_module.findById(_id).session(session);

            if (!campaign) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ success: false, message: "Campaign not found" });
            }

            if (clientMsg === "delete") {
                const refundAmount = parseFloat(campaign.step_4_subTotal || 0) - parseFloat(campaign.spend || 0);

                await campaign.deleteOne({ session });

                userData.deposit_amount = (parseFloat(userData.deposit_amount || 0) + refundAmount).toFixed(3);
                await userData.save({ session });

                await session.commitTransaction();
                session.endSession();

                return res.status(200).json({ success: true, msg: { userDepositBalance: userData.deposit_amount } });
            } else if (campaign.step_3_total_views === campaign.completed_total_views) {
                campaign.status = 'completed'
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ success: false, message: "Campaign already completed" });
            } else {
                campaign.status = clientMsg;
                await campaign.save({ session });

                await session.commitTransaction();
                session.endSession();

                return res.status(200).json({ success: true, msg: { userDepositBalance: userData.deposit_amount } });
            }

        } catch (error) {
            // Rollback and clean up session
            if (session.inTransaction()) {
                await session.abortTransaction();
            }
            session.endSession();

            // Check for write conflict (MongoDB error code 112)
            const isWriteConflict = error.code === 112 ||
                (error.errorResponse && error.errorResponse.code === 112) ||
                (error.codeName && error.codeName === 'WriteConflict');

            if (isWriteConflict) {
                attempt++;
                console.warn(`Write conflict on attempt ${attempt}. Retrying...`);
                continue;
            }

            console.error("Error during transaction:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to process campaign request.",
                error: error.message
            });
        }
    }

    return res.status(500).json({
        success: false,
        message: "Maximum retry attempts reached. Please try again later."
    });
};


module.exports = {
    advertiserDataGet,
    advertiserDataPost,
    advertiserCreateDataGet,
    advertiserCampaign_paused_active_patch
}