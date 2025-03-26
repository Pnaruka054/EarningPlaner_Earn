const bcrypt = require('bcrypt')
const mailSender = require('../../../helper/mailSender')
const randomString = require('randomstring')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const oauth2Client = require("../../../helper/oauth2Client")
const axios = require("axios")
const userSignUp_module = require('../../../model/userSignUp/userSignUp_module')
const referral_records_module = require('../../../model/referralRecords/referral_records_module')
const userMonthly_records_module = require("../../../model/dashboard/userMonthly_modules");
const userDate_records_module = require("../../../model/dashboard/userDate_modules");
const current_time_get = require('../../../helper/currentTimeUTC')
const getFormattedMonth = require("../../../helper/getFormattedMonth")
const userUniqueTokenData_module = require('../../../model/userUniqueTokenData_10minEx/userUniqueTokenData_module')
const other_data_module = require('../../../model/other_data/other_data_module')
const withdrawal_record = require("../../../model/withdraw/withdrawal_records_module")
const { decryptData } = require('../../../helper/encrypt_decrypt_data')
const ipAddress_records_module = require('../../../model/IPAddress/useripAddresses_records_module')

function jwt_accessToken(user, time) {
    return jwt.sign({ jwtUser: user }, process.env.JWT_ACCESS_KEY, { expiresIn: time })
}

// for user registration
let userSignUp = async (req, res) => {
    try {
        // check express validation errors
        const errors = validationResult(req)
        const userIp = req.ip

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error_msg: errors.array()
            })
        }

        // check if user have already using another account with same ip address
        let existingRecord = await ipAddress_records_module.findOne({ ipAddress: userIp });
        if (existingRecord) {
            return res.status(400).json({
                success: false,
                error_msg: 'Multiple accounts from the same IP address are not allowed.'
            })
        }

        // format current month and year (e.g., "January 2024")
        const monthName = getFormattedMonth()

        let { name, mobile_number, email_address, password, refer_by } = req.body

        email_address = email_address.toLowerCase().trim()
        password = password.trim()

        // taking userName from email Address
        let userName = email_address.split('@')[0]

        // convert password in unreadable formate
        const bcrypt_pasword = await bcrypt.hash(password, 10)

        // checkinig if user email or mobile number already registered
        const isExists = await userSignUp_module.findOne({
            $or: [
                { email_address },
                { mobile_number }
            ]
        })
        if (isExists) {
            return res.status(409).json({
                success: false,
                error_msg: 'User Already Registered Please Login'
            })
        }

        // function to genrate unique UserName with finding in user registration data
        async function generateUniqueUserName(userName) {
            let increment = 0;
            let newUserName = userName;

            while (await userSignUp_module.findOne({ userName: newUserName })) {
                increment++;
                newUserName = `${userName}${increment}`;
            }

            return newUserName;
        }
        userName = await generateUniqueUserName(userName);

        // getting ready user registration obj to store
        let signUp_Data = {
            name,
            mobile_number,
            email_address,
            password: bcrypt_pasword,
            userName
        };

        // check if your register under another one
        if (refer_by) {
            // check user registration referral link is valid or not
            const referred_by_userData = await userSignUp_module.findOne({ userName: refer_by })
            if (!referred_by_userData) {
                return res.status(400).json({
                    success: false,
                    error_msg: 'Registration Link is invalid'
                })
            }

            // if your registration referral link is valid then add this user under refer by user data record
            await new referral_records_module({
                userDB_id: referred_by_userData._id,
                date: current_time_get(),
                userName
            }).save()
            signUp_Data.refer_by = refer_by;
        }

        // store user registered data
        const userSignUp_savedData = await new userSignUp_module(signUp_Data).save();

        // creating first time user register month for user dashboard select month options
        await new userMonthly_records_module({
            userDB_id: userSignUp_savedData._id,
            monthName,
        }).save()

        // add user ip record in ip address data
        existingRecord = new ipAddress_records_module({ ipAddress: userIp });
        await existingRecord.save();

        res.status(200).json({
            success: true,
            msg: 'Register successfully!',
            user: userSignUp_savedData
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error.message
        })
    }
}

// for user login
const userLogin = async (req, res) => {
    try {
        req.body = await decryptData(req.body.obj)
        let { email_userName, password, loginRemember_state } = req.body;

        // check if your details are received or not
        if (!email_userName || !password) {
            return res.status(409).json({
                success: false,
                error_msg: 'All fields are require please fill all details'
            })
        }

        // arrange email without spaces and upper case letters
        email_userName = email_userName.toLowerCase().trim();
        password = password.trim()

        let userName = null
        // check if email address if vaild or not
        if (email_userName.includes('@')) {
            // getting userName from Email
            userName = email_userName.split("@")[0];
        }

        // findinig user in register data using email
        const isExists = await userSignUp_module.findOne({ email_address: email_userName });
        // check if user finded or not
        if (!isExists) {
            return res.status(401).json({
                success: false,
                error_msg: 'Invalid details'
            });
        }

        // check if user created account with google_id or not
        if (isExists.google_id) {
            return res.status(403).json({
                success: false,
                error_msg: "Please log in with Google or reset your password"
            })
        }

        // matching the login password with registeration password
        let passwordMatched = await bcrypt.compare(password, isExists.password);

        // check password is matched or not
        if (!passwordMatched) {
            return res.status(401).json({
                success: false,
                error_msg: 'Password is incorrect'
            });
        }

        // create jwt token to login
        let jwt_token = null;

        if (loginRemember_state) {
            jwt_token = jwt_accessToken(isExists, '24h')
            res.cookie('jwtToken', jwt_token, {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                maxAge: 86400000 // 24 hour
            });
        } else {
            jwt_token = jwt_accessToken(isExists, '12h')
            res.cookie('jwtToken', jwt_token, {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                maxAge: 43200000 // 12 hour
            });
        }

        // add login users ip address in ip address record
        const userIp = req.ip;
        let existingRecord = await ipAddress_records_module.findOne({ ipAddress: userIp });
        if (existingRecord) {
            existingRecord.ipAddress = userIp; // Update existing record
            await existingRecord.save();
        } else {
            // ❇️ Create a new record if not found
            existingRecord = new ipAddress_records_module({ ipAddress: userIp });
            await existingRecord.save();
        }

        return res.status(200).json({
            success: true,
            msg: 'Logged in successfully'
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }
};

// for user registration & login using google direct option
const user_signUp_login_google = async (req, res) => {
    try {
        // get google unique code,  referral userid and varibal to check user already registered or not for user from query
        const { google_code, userAlreadyHaveAccount_state, referral_id_signup, userEmail } = req.query;

        // format current month and year (e.g., "January 2024")
        const monthName = getFormattedMonth()

        // check if google unique code is available or not
        if (!google_code) {
            return res.status(400).json({
                success: false,
                error_msg: 'Missing credentials'
            });
        }

        // check user ip address already available
        const userIp = req.ip;
        let existingRecord = await ipAddress_records_module.findOne({ ipAddress: userIp });

        // get google user token using google unique code
        const googleRes = await oauth2Client.getToken(google_code);
        oauth2Client.setCredentials(googleRes.tokens);

        // fatch user details from google using new genrated token
        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        );

        // get user email, name & user unique Id
        let { email, name, id } = userRes.data;
        // arrange email without spaces and upper case letters
        email = email.toLowerCase().trim();
        // taking userName from email Address
        let userName = email.split('@')[0]

        if (userEmail && userEmail.includes('@') && userEmail !== email) {
            return res.status(409).json({
                success: false,
                error_msg: `Account switching is restricted. Please log in with ${userEmail}.`
            });
        }

        // check user already registered or not using email
        const isExists = await userSignUp_module.findOne({
            $or: [
                { email_address: email },
                { userName }
            ]
        })

        // if user not available means it's trying to signup and with that is user ip address already available in ip address record then give error
        if ((!isExists && existingRecord) || (!isExists && userAlreadyHaveAccount_state === 'true')) {
            return res.status(400).json({
                success: false,
                error_msg: 'Multiple accounts from the same IP address are not allowed.'
            })
        }

        // check user already registered with google or not
        if (!isExists?.google_id && isExists) {
            return res.status(400).json({
                success: false,
                error_msg: "Please Login With Password"
            })
        }

        // function to genrate unique UserName with finding in user registration data
        async function generateUniqueUserName(userName) {
            let increment = 0;
            let newUserName = userName;

            while (await userSignUp_module.findOne({ userName: newUserName })) {
                increment++;
                newUserName = `${userName}${increment}`;
            }

            return newUserName;
        }
        userName = await generateUniqueUserName(userName);

        // getting ready user registration obj to store
        let userData = {
            name,
            email_address: email,
            userName,
            google_id: id
        };

        // checking if refer by id is available or not
        if (referral_id_signup) {
            // check user registration referral link is valid or not
            const referred_by_userData = await userSignUp_module.findOne({ userName: referral_id_signup })
            if (!referred_by_userData) {
                return res.status(400).json({
                    success: false,
                    error_msg: 'Your Registration Link is invalid'
                })
            }

            // if your registration referral link is valid then add this user under refer by user data record
            let referral_recorded_data = new referral_records_module({
                userDB_id: referred_by_userData._id,
                date: current_time_get(),
                userName: email.split('@')[0]
            })
            await referral_recorded_data.save()

            // getting ready user registration obj to store with refer by id
            userData = {
                name,
                email_address: email,
                userName: email.split('@')[0],
                google_id: id,
                refer_by: referral_id_signup
            };
        }


        let jwt_token;
        // check if user already not registered then register this user
        if (!isExists) {
            const user_data = await new userSignUp_module(userData).save()
            await new userMonthly_records_module({
                userDB_id: user_data._id,
                monthName,
            }).save()

            // after ip address check user registration success and add user ip address in ip address records
            existingRecord = new ipAddress_records_module({ ipAddress: userIp });
            await existingRecord.save();
            // create jwt token to login
            jwt_token = jwt_accessToken(user_data, '12h')
        } else {
            // add user ip address in ip address records
            if (existingRecord) {
                existingRecord.ipAddress = userIp; // Update existing record
                await existingRecord.save();
            } else {
                // ❇️ Create a new record if not found
                existingRecord = new ipAddress_records_module({ ipAddress: userIp });
                await existingRecord.save();
            }
            // create jwt token to login
            jwt_token = jwt_accessToken(isExists, '12h')
        }

        // Set the JWT token in an HttpOnly cookie
        res.cookie('jwtToken', jwt_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 43200000 // 12 hour
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

// for send mail to reset password
const userLoginforgot_password_send_mail = async (req, res) => {
    try {
        req.body = await decryptData(req.body.obj)
        let { email } = req.body;

        // arrange email without spaces and upper case letters
        email = email.toLowerCase().trim();

        // finding user using only email address
        const isExists = await userSignUp_module.findOne({ email_address: email });

        // check if user register or not
        if (!isExists) {
            return res.status(400).json({
                success: false,
                error_msg: "Email is Not Register"
            });
        }

        // create url that send on user email id for reset password
        const fullUrl = req.headers.origin || `${req.protocol}://${req.get('host')}`;

        // create unique token for user reset query search from database
        let token = randomString.generate()

        // create obj that use to save data in database
        let obj = {
            userDB_id: isExists._id,
            token
        }

        let isAlreadyMailSended = await userUniqueTokenData_module.findOne({ userDB_id: isExists._id });

        if (isAlreadyMailSended) {
            const expirationTime = 10 * 60 * 1000; // 10 minutes expiry time
            const createdAt = new Date(isAlreadyMailSended.createdAt).getTime();
            const currentTime = Date.now();
            let timeLeftMs = expirationTime - (currentTime - createdAt);


            return res.status(400).json({
                success: false,
                error_msg: "Already password reset registered",
                time_left: timeLeftMs // Milliseconds me bhej rahe hain
            });
        }

        // decorate message for user email
        const msg = `<p>Hi ${isExists.name},</p> 
        <p>Welcome to EarnWiz! We received a request to reset your password.</p>  
        <p>Click <a href="${fullUrl}/password-reset-form/${token}">here</a> to reset your password.</p>  
        <p>If you didn't request this, please ignore this email.</p>  
        <p>Best regards, <br> EarnWiz Team</p>`;
        // send mail function
        mailSender(isExists.email_address, 'Reset/update Password', msg)
        await new userUniqueTokenData_module(obj).save()

        return res.status(200).json(
            { success: true, msg: "Reset link sent successfully" }
        )

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }
};

// for reset password after link click
const reset_password_form_post = async (req, res) => {
    try {
        req.body = await decryptData(req.body.obj)
        let { token, password } = req.body;

        // remove starting and ending spaces
        password = password.trim()

        // check if token and password is get or not
        if (!token || !password) {
            return res.status(400).json({ success: false, error_msg: "Token and password are required!" });
        }

        // find user update req using token
        const user = await userUniqueTokenData_module.findOne({ token });

        // check if user req find or not
        if (!user) {
            return res.status(400).json({ success: false, error_msg: "Invalid or expired token!" });
        }

        // convert password in unreadable formate
        const bcryptPassword = await bcrypt.hash(password, 10);

        // find user usinig userDB_id and update password and if password is not seted then create password property and remove google_id property
        let updatedData = await userSignUp_module.findOneAndUpdate(
            { _id: user.userDB_id },
            {
                password: bcryptPassword,
                $unset: { google_id: "" }
            },
            { new: true }
        );

        // after user password req completed then remove user all req at once if available
        await userUniqueTokenData_module.deleteMany({ userDB_id: updatedData._id });

        return res.status(200).json({ success: true, msg: "Password reset successfully!" });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message || "Internal Server Error",
        });
    }
};

// for verify reset password token
const verify_reset_token = async (req, res) => {
    // Get the token from query parameter
    const { token } = req.query;

    // check if token is get or not
    if (!token) {
        return res.status(400).json({
            success: false,
            error_msg: "Token is required.",
        });
    }

    try {
        // Check if the token exists in the database
        const tokenData = await userUniqueTokenData_module.findOne({ token });
        if (!tokenData) {
            return res.status(404).json({
                success: false,
                error_msg: "Invalid or expired token.",
            });
        }

        return res.status(200).json({
            success: true,
            msg: "Token is valid.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message || "Internal Server Error",
        });
    }
};

// for verify reset password token
const verify_reset_email_token = async (req, res) => {
    try {
        // Get the token & email from query params
        let { token, email } = req.query;

        email = atob(email)

        // Validate inputs
        if (!token || !email) {
            return res.status(400).json({
                success: false,
                error_msg: "Token and Email are required.",
            });
        }

        // Check if the token exists in the database
        const tokenData = await userUniqueTokenData_module.findOne({ token });
        if (!tokenData) {
            return res.status(404).json({
                success: false,
                error_msg: "Invalid or expired token.",
            });
        }

        // Get user data using userDB_id
        const userData = await userSignUp_module.findById(tokenData.userDB_id);
        if (!userData) {
            return res.status(404).json({
                success: false,
                error_msg: "User not found.",
            });
        }

        // updating email and save it in register data
        userData.email_address = email;
        await userData.save();

        // after user email req completed then remove user all req at once if available
        await userUniqueTokenData_module.deleteMany({ userDB_id: userData._id });

        return res.status(200).json({
            success: true,
            msg: "Email successfully updated.",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error_msg: error.message || "Internal Server Error",
        });
    }
};

// for logOut user using clear jwtToken from only http cookie
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

// for get dashboard data
const userDataGet_dashboard = async (req, res) => {
    try {
        const userData = req.user;

        const other_data_announcementsArray = await other_data_module.find({ documentName: "announcement" }) || [];
        // getting user all months data
        const user_month_records = await userMonthly_records_module.find({ userDB_id: userData._id.toString() });
        // getting user all dates data
        const user_date_records = await userDate_records_module.find({ userDB_id: userData._id });

        return res.status(200).json({
            success: true,
            msg: {
                user_month_records,
                user_date_records,
                userEmail: userData?.email_address,
                userAvailableBalance: (
                    parseFloat(userData.deposit_amount || 0) + parseFloat(userData.withdrawable_amount || 0)
                ).toFixed(3),
                other_data_announcementsArray: other_data_announcementsArray.reverse()
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: 'An error occurred while fetching the data.'
        });
    }
};

// for get user referral data
const userReferral_record_get = async (req, res) => {
    try {
        const userData = req.user;

        // find user referral data using userData._id
        const user_DB_referral_record_get = await referral_records_module.find({ userDB_id: userData._id });
        const other_data_referralRate = await other_data_module.findOne({ documentName: "referralRate" }) || {};

        // get ready obj to res
        const resData = {
            userName: userData.userName,
            referral_data: user_DB_referral_record_get,
            available_balance: (parseFloat(userData?.deposit_amount || 0) + parseFloat(userData?.withdrawable_amount || 0)).toFixed(3),
            other_data_referralRate
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

// for get user complete profile information for profile section
const userProfileData_get = async (req, res) => {
    try {
        const userData = req.user;

        const other_data_withdrawalMethodArray = await other_data_module.find({ documentName: "withdrawalMethod" }) || [];

        // get ready obj for res
        const userProfile = {
            ...userData.toObject(),
            other_data_withdrawalMethodArray,
            available_balance: (parseFloat(userData?.deposit_amount || 0) + parseFloat(userData?.withdrawable_amount || 0)).toFixed(3)
        };

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

// for user profile update from profile section
const userProfileData_patch = async (req, res) => {
    try {
        const userData = req.user;
        req.body = await decryptData(req.body.obj)
        const updateFields = req.body;

        // update userData using req.body data directly
        let user_DB_Data = await userSignUp_module.findByIdAndUpdate(userData._id, updateFields, { new: true });

        // check if user found or not
        if (!user_DB_Data) {
            return res.status(404).json({
                success: false,
                error_msg: "User not found"
            });
        }

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

// for get website statistics in home page of website
const userWebstatisticsGet = async (req, res) => {
    try {
        // Pehle database se saare users ko fetch karo
        let users = await userSignUp_module.find();
        let usersWithdrawalRecords = await withdrawal_record.find();

        // Total Withdrawal Amount Calculate karo
        let totalWithdrawalAmount = usersWithdrawalRecords.reduce((sum, record) => {
            return sum + (parseFloat(record.balance) || 0);
        }, 0);

        // Users ki length nikalo
        users = users.length;

        // Agar users 100 se kam hain, toh default value set karo
        if (users < 100) {
            users = 5254;
        }

        // Response send karo 
        res.status(200).json({ users, fixed: true, totalWithdrawalAmount });
    } catch (error) {
        console.error("❌ Error in userWebstatisticsGet:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// to get current seted email in setting page of website
const userpassword_and_email_get = async (req, res) => {
    try {
        const { withdrawable_amount = 0, deposit_amount = 0, email_address } = req.user;

        const available_balance = (parseFloat(withdrawable_amount) + parseFloat(deposit_amount)).toFixed(3);

        return res.status(200).json({
            success: true,
            msg: {
                available_balance,
                email_address
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error",
            error: error.message
        });
    }
};

// to update user password and email id
const userpassword_and_email_patch = async (req, res) => {
    try {
        req.body = await decryptData(req.body.obj)
        let { email_address, newPassword_state, currentPassword_state } = req.body;
        const userData = req.user;

        // Update Email Address
        if (email_address) {
            // remove spaces and convert to lowerCase
            email_address = email_address.toLowerCase().trim()

            if (userData.email_address === email_address) {
                return res.status(400).json({
                    success: false,
                    error_msg: "user Email Already Registered"
                });
            }

            // check email id is correct formate
            if (!/^\S+@\S+\.\S+$/.test(email_address)) {
                return res.status(400).json({
                    success: false,
                    error_msg: "Invalid email format"
                });
            }

            let token = randomString.generate()

            // create url that send on user email id for reset password
            const fullUrl = req.headers.origin || `${req.protocol}://${req.get('host')}`;

            // create unique token for user reset query search from database
            let isAlreadyMailSended = await userUniqueTokenData_module.findOne({ userDB_id: userData._id });

            if (isAlreadyMailSended) {
                const expirationTime = 10 * 60 * 1000; // 10 minutes expiry time
                const createdAt = new Date(isAlreadyMailSended.createdAt).getTime();
                const currentTime = Date.now();
                let timeLeftMs = expirationTime - (currentTime - createdAt);

                return res.status(400).json({
                    success: false,
                    error_msg: "Already Email update reset registered",
                    time_left: timeLeftMs // Milliseconds me bhej rahe hain
                });
            }

            const msg = `
            <html>
            <body>
                <h2>Email Verification</h2>
                <p>Dear User,</p>
                <p>Thank you for updating your email address with us. To complete your email verification, please click on the link below:</p>
                <p><a href="${fullUrl}/email-verification/${token}/${btoa(email_address)}" style="color: #007BFF;">Verify My Email</a></p>
                <p>If you did not request this change, please ignore this email or contact our support team.</p>
                <br/>
                <p>Best regards,<br/>EarnWiz</p>
            </body>
            </html>`;

            // create obj that use to save data in database
            let obj = {
                userDB_id: userData._id,
                token
            }

            mailSender(email_address, 'Verify Email', msg);
            await new userUniqueTokenData_module(obj).save()

            return res.status(200).json({
                success: true,
                msg: "Verification Mail sended On Your New Email, Please Check."
            });
        }

        // Update Password
        if (newPassword_state && currentPassword_state) {
            const passwordMatched = await bcrypt.compare(currentPassword_state, userData.password);

            if (!passwordMatched) {
                return res.status(400).json({
                    success: false,
                    error_msg: "Current password is incorrect"
                });
            }

            if (newPassword_state.length < 8) {
                return res.status(400).json({
                    success: false,
                    error_msg: "New password must be at least 8 characters long"
                });
            }

            const bcryptPassword = await bcrypt.hash(newPassword_state, 10);
            userData.password = bcryptPassword;
            await userData.save();

            return res.status(200).json({
                success: true,
                msg: "Password updated successfully"
            });
        }

        return res.status(400).json({
            success: false,
            error_msg: "No valid data provided for update"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports = {
    userSignUp,
    userLogin,
    userDataGet_dashboard,
    userReferral_record_get,
    userProfileData_get,
    userProfileData_patch,
    userLogOut,
    user_signUp_login_google,
    userLoginforgot_password_send_mail,
    reset_password_form_post,
    verify_reset_token,
    userWebstatisticsGet,
    userpassword_and_email_get,
    userpassword_and_email_patch,
    verify_reset_email_token
}