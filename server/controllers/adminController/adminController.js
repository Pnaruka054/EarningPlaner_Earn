const admin_module = require('../../model/admin/admin_module')
const jwt = require('jsonwebtoken')
const other_data_module = require('../../model/other_data/other_data_module')
const current_time_get = require('../../helper/currentTimeUTC')


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

const update_referral_data = async (req, res) => {
    try {
        let { data, btnName } = req.body;

        // Validate btnName
        if (!["text", "rate"].includes(btnName)) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid button name. Must be 'text' or 'rate'."
            });
        }

        // Define update object dynamically
        let updateField = btnName === "text" ? { referralPageText: data } : { referralRate: data };

        // Update Referral Data
        let updatedData = await other_data_module.findOneAndUpdate(
            { documentName: "referralRate" },
            updateField,
            { new: true, upsert: true } // Returns updated document and creates new if not exists
        );

        // Send Success Response
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

const post_newAnnouncement_data = async (req, res) => {
    try {
        let { newAnnouncement_data } = req.body;
        let formatedTime = current_time_get();

        // Validation: Check if data is received
        if (!newAnnouncement_data || !newAnnouncement_data.announcementTitle || !newAnnouncement_data.announcementMessage) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid data received."
            });
        }

        // Creating new announcement data
        let newData = new other_data_module({
            documentName: "announcement",
            announcementTitle: newAnnouncement_data.announcementTitle,
            announcementMessage: newAnnouncement_data.announcementMessage,
            announcementTime: formatedTime
        });

        await newData.save(); // Save to DB

        // Send Success Response
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

        // Validation: Check if data is received
        if (!updated_announcement_data || !updated_announcement_data._id ||
            !updated_announcement_data.announcementTitle || !updated_announcement_data.announcementMessage) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid or missing data received."
            });
        }

        // Updating announcement data
        let updatedData = await other_data_module.findOneAndUpdate(
            { documentName: "announcement", _id: updated_announcement_data._id },
            {
                announcementTitle: updated_announcement_data.announcementTitle,
                announcementMessage: updated_announcement_data.announcementMessage,
                announcementTime: formatedTime
            },
            { new: true } // ✅ Yeh ensure karega ki updated data return ho
        );

        // Agar koi announcement nahi mili
        if (!updatedData) {
            return res.status(404).json({
                success: false,
                error_msg: "Announcement not found."
            });
        }

        // Send Success Response
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

const post_newFaq_data = async (req, res) => {
    try {
        let { newFaq_data } = req.body;
        // Validation: Check if data is received
        if (!newFaq_data || !newFaq_data.faqQuestioin || !newFaq_data.faqAnswer) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid data received."
            });
        }

        // Creating new announcement data
        let newData = new other_data_module({
            documentName: "faq",
            faqQuestioin: newFaq_data.faqQuestioin,
            faqAnswer: newFaq_data.faqAnswer,
        });

        await newData.save(); // Save to DB

        // Send Success Response
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

        // Updating announcement data
        let updatedData = await other_data_module.findOneAndUpdate(
            { documentName: "faq", _id },
            {
                faqQuestioin,
                faqAnswer,
            },
            { new: true } // ✅ Yeh ensure karega ki updated data return ho
        );

        // Agar koi announcement nahi mili
        if (!updatedData) {
            return res.status(404).json({
                success: false,
                error_msg: "faq not found."
            });
        }

        // Send Success Response
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

const post_withdrawalMethod_data = async (req, res) => {
    try {
        let { withdrawalMethod_name, withdrawalMethod_minimumAmount, withdrawalMethod_details } = req.body;
        // Validation: Check if data is received
        if (!withdrawalMethod_name || !withdrawalMethod_minimumAmount || !withdrawalMethod_details) {
            return res.status(400).json({
                success: false,
                error_msg: "Invalid data received."
            });
        }

        // Creating new announcement data
        let newData = new other_data_module({
            documentName: "withdrawalMethod",
            withdrawalMethod_name,
            withdrawalMethod_minimumAmount,
            withdrawalMethod_details,
        });

        await newData.save(); // Save to DB

        // Send Success Response
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

        // Updating announcement data
        let updatedData = await other_data_module.findOneAndUpdate(
            { documentName: "withdrawalMethod", _id },
            {
                withdrawalMethod_name,
                withdrawalMethod_minimumAmount,
                withdrawalMethod_details
            },
            { new: true } // ✅ Yeh ensure karega ki updated data return ho
        );

        // Agar koi announcement nahi mili
        if (!updatedData) {
            return res.status(404).json({
                success: false,
                error_msg: "withdrawal Method not found."
            });
        }

        // Send Success Response
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

module.exports = {
    adminLogin,
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
    delete_withdrawalMethod_data
}