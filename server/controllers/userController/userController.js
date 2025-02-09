const bcrypt = require('bcrypt')
// const sendMail = require('../helper/mailer')
const { validationResult } = require('express-validator')
const randomString = require('randomstring')
const jwt = require('jsonwebtoken')
// const oauth2Client = require("../helper/oauth2Client")

const userSignUp_module = require('../../model/userSignUp/userSignUp_module')
const referral_records_module = require('../../model/referralRecords/referral_records_module')
const { createCurrentMonthDocuments } = require('../dashboardStatistics/dashboardStatistics')
const { userMonthly_records_module, saveUserMonthlyData } = require("../../model/dashboard/userMonthly_modules");
const userDate_records_module = require("../../model/dashboard/userDate_modules");
const withdrawal_methods_module = require('../../model/withdraw/withdraw_methods_module')
const current_time_get = require('../../helper/currentTimeUTC')

function jwt_accessToken(user) {
    return jwt.sign({ jwtUser: user }, process.env.JWT_ACCESS_KEY, { expiresIn: '59m' })
}

let userSignUp = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error_msg: errors.array()
            })
        }

        const { name, mobile_number, email_address, password, refer_by } = req.body

        const bcrypt_pasword = await bcrypt.hash(password, 10)
        const isExists = await userSignUp_module.findOne({ email_address })
        if (isExists) {
            return res.status(400).json({
                success: false,
                error_msg: 'User Already Registered Please Login'
            })
        }

        let signUp_Data = {
            name,
            mobile_number,
            email_address,
            password: bcrypt_pasword,
            userName: email_address.split('@')[0],
        };

        if (refer_by) {
            const referred_by_userData = await userSignUp_module.findOne({ userName: refer_by })
            if (!referred_by_userData) {
                return res.status(400).json({
                    success: false,
                    error_msg: 'Your Registration Link is invalid'
                })
            }
            await new referral_records_module({
                userDB_id: referred_by_userData._id,
                date: current_time_get(),
                userName: email_address.split('@')[0]
            }).save()
            signUp_Data.refer_by = refer_by;
        }

        const userSignUp_savedData = await new userSignUp_module(signUp_Data).save();

        await createCurrentMonthDocuments()

        res.status(200).json({
            success: true,
            msg: 'Register successfully!',
            user: userSignUp_savedData
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error_msg: error.message
        })
    }
}

const userLogin = async (req, res) => {
    try {
        let { email_userName, password } = req.body;
        email_userName = email_userName.toLowerCase();

        if (email_userName.includes('@')) {
            email_userName = email_userName.split("@")[0];
        }

        const isExists = await userSignUp_module.findOne({
            $or: [
                { email_address: email_userName },
                { userName: email_userName }
            ]
        });

        if (!isExists) {
            return res.status(400).json({
                success: false,
                error_msg: 'Invalid Gmail or Password'
            });
        }

        let passwordMatched = await bcrypt.compare(password, isExists.password);

        if (!passwordMatched) {
            return res.status(400).json({
                success: false,
                error_msg: 'Password not Matched'
            });
        }

        let jwt_token = jwt_accessToken(isExists);

        // Set the JWT token in an HttpOnly cookie
        res.cookie('jwtToken', jwt_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 3600000 // 1 hour
        });

        return res.status(200).json({
            success: true,
            message: 'Logged in successfully'
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }
};

const userDataGet = async (req, res) => {
    try {
        const userData = req.user;
        const user_gmail_address = userData.gmail_address;

        const user_new_Data = await userSignUp_module.findOne({ gmail_address: user_gmail_address });

        if (!user_new_Data) {
            return res.status(400).json({
                success: false,
                msg: 'User not found'
            });
        }

        const user_month_records = await userMonthly_records_module.find({ userDB_id: user_new_Data._id.toString() });
        const user_date_records = await userDate_records_module.find({ userDB_id: user_new_Data._id });

        return res.status(200).json({
            success: true,
            userData: [user_new_Data, user_month_records, user_date_records]
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: 'An error occurred while fetching the data.'
        });
    }
};

const userReferral_record_get = async (req, res) => {
    try {
        const userData = req.user;

        const user_DB_Data = await userSignUp_module.findById(userData._id);

        if (!user_DB_Data) {
            return res.status(400).json({
                success: false,
                msg: 'User not found'
            });
        }

        const user_DB_referral_record_get = await referral_records_module.find({ userDB_id: userData._id });

        const resData = {
            userName: user_DB_Data.userName,
            referral_data: user_DB_referral_record_get
        };

        return res.status(200).json({
            success: true,
            msg: resData
        });
    } catch (error) {
        console.error('Error fetching referral records:', error);
        return res.status(500).json({
            success: false,
            msg: 'An error occurred while fetching referral records.'
        });
    }
};

const userProfileData_get = async (req, res) => {
    try {
        const userData = req.user;

        const user_DB_Data = await userSignUp_module.findById(userData._id);
        const withdrawal_methods_data = await withdrawal_methods_module.find()

        if (!user_DB_Data) {
            return res.status(404).json({
                success: false,
                msg: 'User not found'
            });
        }

        const userProfile = { ...user_DB_Data.toObject(), withdrawal_methods_data };

        return res.status(200).json({
            success: true,
            msg: userProfile
        });
    } catch (error) {
        console.error('Error fetching user profile data:', error);
        return res.status(500).json({
            success: false,
            msg: 'An error occurred while fetching user profile data.'
        });
    }
};

const userProfileData_patch = async (req, res) => {
    try {
        const userData = req.user;
        const updateFields = req.body;
        let user_DB_Data = await userSignUp_module.findByIdAndUpdate(userData._id, updateFields, { new: true });

        if (!user_DB_Data) {
            return res.status(400).json({
                success: false,
                error_msg: "User not found"
            });
        }

        // req.io.emit('realTimeBalanceUpdate', {
        //     userId: userData._id,
        //     available_balance: available_balance
        // });

        res.status(200).json({
            success: true,
            msg: "User profile updated successfully",
            data: user_DB_Data
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: "An error occurred while updating the profile",
        });
    }
};

module.exports = {
    userSignUp,
    userLogin,
    userDataGet,
    userReferral_record_get,
    userProfileData_get,
    userProfileData_patch
}