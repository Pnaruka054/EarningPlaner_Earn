const bcrypt = require('bcrypt')
const mailSender = require('../../helper/mailSender')
const randomString = require('randomstring')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const oauth2Client = require("../../helper/oauth2Client")
const axios = require("axios")
const userSignUp_module = require('../../model/userSignUp/userSignUp_module')
const referral_records_module = require('../../model/referralRecords/referral_records_module')
const { userMonthly_records_module, saveUserMonthlyData } = require("../../model/dashboard/userMonthly_modules");
const userDate_records_module = require("../../model/dashboard/userDate_modules");
const withdrawal_methods_module = require('../../model/withdraw/withdraw_methods_module')
const current_time_get = require('../../helper/currentTimeUTC')
const getFormattedMonth = require("../../helper/getFormattedMonth")
const resetPassword_req_data = require('../../model/resetPassword_req_data/resetPassword_req_data')


function jwt_accessToken(user) {
    return jwt.sign({ jwtUser: user }, process.env.JWT_ACCESS_KEY, { expiresIn: '2h' })
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

        const monthName = getFormattedMonth()

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


        await new userMonthly_records_module({
            userDB_id: userData._id,
            monthName,
        }).save()

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
            secure: true,
            // secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
            sameSite: 'None',
            maxAge: 7200000 // 2 hour
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

const user_signUp_login_google = async (req, res) => {
    try {
        const google_code = req.query.google_code;
        const referral_id_signup = req.query.referral_id_signup
        const monthName = getFormattedMonth()
        if (!google_code) {
            return res.status(400).json({ message: 'Missing google_code' });
        }
        const googleRes = await oauth2Client.getToken(google_code);
        oauth2Client.setCredentials(googleRes.tokens);

        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        );

        const { email, name, id } = userRes.data;

        const isExists = await userSignUp_module.findOne({ email_address: email })
        if (!isExists?.google_id && isExists) {
            return res.status(400).json({
                success: false,
                error_msg: "Please Login With Password"
            })
        }

        let userData = {
            name,
            email_address: email,
            userName: email.split('@')[0],
            google_id: id
        };

        if (referral_id_signup !== 'undefined') {
            const referred_by_userData = await userSignUp_module.findOne({ userName: referral_id_signup })
            if (!referred_by_userData) {
                return res.status(400).json({
                    success: false,
                    error_msg: 'Your Registration Link is invalid'
                })
            }
            let referral_recorded_data = new referral_records_module({
                userDB_id: referred_by_userData._id,
                date: current_time_get(),
                userName: email.split('@')[0]
            })

            await referral_recorded_data.save()

            userData = {
                name,
                email_address: email,
                userName: email.split('@')[0],
                google_id: id,
                refer_by: referral_id_signup
            };
        }

        let jwt_token;
        if (!isExists) {
            const user_data = await new userSignUp_module(userData).save()
            await new userMonthly_records_module({
                userDB_id: user_data._id,
                monthName,
            }).save()
            jwt_token = jwt_accessToken(user_data)
        } else {
            jwt_token = jwt_accessToken(isExists)
        }

        // Set the JWT token in an HttpOnly cookie
        res.cookie('jwtToken', jwt_token, {
            httpOnly: true,
            secure: true,
            // secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
            sameSite: 'None',
            maxAge: 7200000 // 2 hour
        });

        return res.status(200).json({
            success: true,
            msg: "succcess"
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            error_msg: error.message
        })
    }
};

const userLoginforgot_password_send_mail = async (req, res) => {
    try {
        let { email } = req.body;
        email = email.toLowerCase();
        let email_userName = null
        if (email.includes('@')) {
            email_userName = email.split("@")[0];
        }
        console.log(email);
        const isExists = await userSignUp_module.findOne({
            $and: [
                { email_address: email },
                { userName: email_userName }
            ]
        });

        if (!isExists) {
            return res.status(400).json({
                success: false,
                message: "Email is Not Register"
            });
        }

        const fullUrl = req.headers.origin || `${req.protocol}://${req.get('host')}`;
        let token = randomString.generate()
        let obj = {
            userDB_id: isExists._id,
            token
        }

        const msg = `<p>Hello ${isExists.name} Welcome To Earning Planer, Click <a href="${fullUrl}/password-reset-form/${token}"> here </a> To Reset Your Password</p>`
        mailSender(isExists.email_address, 'Reset/update Password', msg)
        await new resetPassword_req_data(obj).save()

        return res.status(200).json(
            { success: true, message: "Reset link sent successfully" }
        )

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }
};

const reset_password_form_post = async (req, res) => {
    try {
        let { token, password } = req.body;
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error_msg: errors.array()
            })
        }
        
        if (!token || !password) {
            return res.status(400).json({ success: false, message: "Token and password are required!" });
        }
        const user = await resetPassword_req_data.findOne({ token });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token!" });
        }

        const bcryptPassword = await bcrypt.hash(password, 10);

        let updatedData = await userSignUp_module.findOneAndUpdate(
            { _id: user.userDB_id },
            {
                password: bcryptPassword,
                $unset: { google_id: "" }
            },
            { new: true }
        );

        await resetPassword_req_data.deleteMany({ userDB_id: updatedData._id });

        return res.status(200).json({ success: true, message: "Password reset successfully!" });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

const verify_reset_token = async (req, res) => {
    const { token } = req.query; // Get the token from query parameter

    if (!token) {
        return res.status(400).json({
            success: false,
            message: "Token is required.",
        });
    }

    try {
        // Step 1: Check if the token exists in the database
        const tokenData = await resetPassword_req_data.findOne({ token });

        if (!tokenData) {
            return res.status(404).json({
                success: false,
                message: "Invalid or expired token.",
            });
        }

        // If token is valid, continue
        return res.status(200).json({
            success: true,
            message: "Token is valid.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

const userLoginCheckGet = async (req, res) => {
    try {
        const userData = req.user;

        if (userData) {
            return res.status(200).json({
                success: true,
                message: 'User Already Logged In. Please Continue.'
            });
        }

        // If no user data, handle the case where the user is not logged in
        return res.status(401).json({
            success: false,
            message: 'User not logged in.'
        });
    } catch (error) {
        console.error("Error in userLoginCheckGet:", error); // Log the error for debugging
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
};

const userLogOut = async (req, res) => {
    try {
        // Clear the jwtToken cookie from the browser
        res.clearCookie('jwtToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
        });

        // Send a response back to the client
        return res.status(200).json({
            message: 'User logged out successfully'
        });
    } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({
            message: 'Logout failed due to an error'
        });
    }
};

const userDataGet = async (req, res) => {
    try {
        const userData = req.user;

        const user_month_records = await userMonthly_records_module.find({ userDB_id: userData._id.toString() });
        const user_date_records = await userDate_records_module.find({ userDB_id: userData._id });

        return res.status(200).json({
            success: true,
            userData: [userData, user_month_records, user_date_records]
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

        const user_DB_referral_record_get = await referral_records_module.find({ userDB_id: userData._id });

        const resData = {
            userName: userData.userName,
            referral_data: user_DB_referral_record_get,
            available_balance: (parseFloat(userData.deposit_amount || 0) + parseFloat(userData.withdrawable_amount || 0)).toFixed(3)
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

        const withdrawal_methods_data = await withdrawal_methods_module.find()

        const userProfile = { ...userData.toObject(), withdrawal_methods_data };

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
    userProfileData_patch,
    userLogOut,
    userLoginCheckGet,
    user_signUp_login_google,
    userLoginforgot_password_send_mail,
    reset_password_form_post,
    verify_reset_token
}