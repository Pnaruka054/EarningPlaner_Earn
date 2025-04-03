const userSignUp_module = require('../../../model/userSignUp/userSignUp_module')
const withdrawal_records_module = require('../../../model/withdraw/withdrawal_records_module')
const balanceConvert_record_module = require('../../../model/balanceConvert/balanceConvert_record_module')
const current_time_get = require('../../../helper/currentTimeUTC')
const mongoose = require('mongoose')
const other_data_module = require('../../../model/other_data/other_data_module')
const { decryptData } = require('../../../helper/encrypt_decrypt_data')
const MAX_RETRIES = parseInt(process.env.MAX_RETRIES, 10) || 3;

const userBalanceData_get = async (req, res) => {
    try {
        const userData = req.user;

        const user_DB_Withdrawal_Data = await withdrawal_records_module.find({ userDB_id: userData._id });
        const other_data_withdrawalMethodArray = await other_data_module.find({ documentName: "withdrawalMethod" }) || [];
        const other_data_withdrawal_instructions = await other_data_module.findOne({ documentName: "withdrawal_instructions" }) || {};

        if (!userData || !user_DB_Withdrawal_Data) {
            return res.status(404).json({
                success: false,
                msg: 'User not found'
            });
        }

        let matchedWithdrawalMethod = other_data_withdrawalMethodArray.find(
            (value) => value.withdrawalMethod_name === userData.withdrawal_method
        )

        let resData = {
            withdrawable_amount: userData.withdrawable_amount,
            deposit_amount: userData.deposit_amount,
            pending_withdrawal_amount: userData.pending_withdrawal_amount,
            total_withdrawal_amount: userData.total_withdrawal_amount,
            withdrawal_account_information: userData.withdrawal_account_information,
            withdrawal_method: matchedWithdrawalMethod?.withdrawalMethod_name,
            withdrawalMethod_minimumAmount: matchedWithdrawalMethod?.withdrawalMethod_minimumAmount,
            withdrawal_Records: user_DB_Withdrawal_Data,
            other_data_withdrawal_instructions: other_data_withdrawal_instructions.withdrawal_instructions
        };

        return res.status(200).json({
            success: true,
            msg: resData
        });
    } catch (error) {
        console.error('Error fetching user profile data:', error);
        return res.status(500).json({
            success: false,
            msg: 'An error occurred while fetching user profile data.'
        });
    }
}

const userWithdrawal_record_post = async (req, res) => {
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
        const session = await mongoose.startSession(); // Start a transaction
        session.startTransaction(); // Begin transaction
        try {
            const userDB_id = req.user._id;
            req.body = await decryptData(req.body.obj)
            const { balance, type } = req.body;

            // Validate balance input
            if (!balance || balance <= 0) {
                return res.status(400).json({
                    success: false,
                    msg: "Invalid withdrawal amount."
                });
            }

            // Fetch user data
            let userSignUpData = await userSignUp_module.findById(userDB_id).session(session); // Use session for transaction
            if (!userSignUpData) {
                return res.status(404).json({
                    success: false,
                    msg: "User not found."
                });
            }

            // Check if the user has sufficient balance for withdrawal
            if (parseFloat(userSignUpData.withdrawable_amount) < parseFloat(balance)) {
                return res.status(400).json({
                    success: false,
                    msg: "Insufficient funds."
                });
            }

            // Generate order number and time
            const time = current_time_get();

            // Update the withdrawable amount
            userSignUpData.withdrawable_amount = (parseFloat(userSignUpData.withdrawable_amount) - parseFloat(balance)).toFixed(3).toString();
            userSignUpData.pending_withdrawal_amount = ((parseFloat(userSignUpData.pending_withdrawal_amount) || 0) + parseFloat(balance)).toString();

            // Save the updated user data
            await userSignUpData.save({ session });

            // Save the withdrawal record
            await new withdrawal_records_module({
                userDB_id,
                balance,
                type,
                time,
                withdrawal_method: userSignUpData.withdrawal_method,
                withdrawal_account_information: userSignUpData.withdrawal_account_information
            }).save({ session });

            // Commit the transaction
            await session.commitTransaction();

            return res.status(200).json({
                success: true,
                msg: "Withdrawal successful!"
            });
        } catch (error) {
            await session.abortTransaction(); // Abort the transaction on error
            console.error('Error processing withdrawal:', error);
            // Check for write conflict errors
            const isWriteConflict = error.code === 112 ||
                (error.errorResponse && error.errorResponse.code === 112) ||
                (error.codeName && error.codeName === 'WriteConflict');
            if (isWriteConflict) {
                attempt++;
                continue;
            }
            return res.status(500).json({
                success: false,
                msg: 'An error occurred while processing the withdrawal.'
            });
        } finally {
            session.endSession(); // End the session (transaction)
        }
    }
    return res.status(500).json({
        success: false,
        msg: 'Max retry attempts reached. Please try again later.'
    });
};

const userConvertBalance_get = async (req, res) => {
    try {
        const userData = req.user;

        const user_DB_balanceConvert_Data = await balanceConvert_record_module.find({ userDB_id: userData._id });
        const other_data_convertBalance_instructions = await other_data_module.findOne({ documentName: "balanceConverterInstructions" }) || {};

        if (!userData || !user_DB_balanceConvert_Data) {
            return res.status(404).json({
                success: false,
                msg: 'User not found'
            });
        }

        let resData = {
            withdrawable_amount: userData.withdrawable_amount,
            deposit_amount: userData.deposit_amount,
            convertAmount_Records: user_DB_balanceConvert_Data,
            other_data_convertBalance_instructions: other_data_convertBalance_instructions?.convertBalance_instructions
        };

        return res.status(200).json({
            success: true,
            msg: resData
        });
    } catch (error) {
        console.error('Error fetching user profile data:', error);
        return res.status(500).json({
            success: false,
            msg: 'An error occurred while fetching user profile data.'
        });
    }
}

const userBalanceConvertPatch = async (req, res) => {
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            // Assume req.user is a Mongoose document representing the authenticated user.
            const user = req.user;
            if (!user) {
                await session.abortTransaction();
                return res.status(401).json({
                    success: false,
                    msg: "Unauthorized: User not found.",
                });
            }
            req.body = await decryptData(req.body.obj)
            const { balanceToConvert, charge, conversionType_state } = req.body;
            const convertAmount = parseFloat(balanceToConvert);
            const conversionCharge = parseFloat(charge);

            if (!conversionType_state) {
                await session.abortTransaction();
                return res.status(400).json({
                    success: false,
                    msg: "Please Select Conversion Type",
                });
            }

            // Validate conversion inputs
            if (isNaN(convertAmount) || isNaN(conversionCharge) || convertAmount <= 0) {
                await session.abortTransaction();
                return res.status(400).json({
                    success: false,
                    msg: "Invalid conversion amount or charge.",
                });
            }

            const currentDeposit = parseFloat(user.deposit_amount || "0");
            const currentWithdrawable = parseFloat(user.withdrawable_amount || "0");

            // Generate order number and time
            const currentTime = current_time_get();

            if (conversionType_state === "depositToWithdraw") {
                // Ensure the user has enough withdrawable balance to convert
                if (convertAmount > currentWithdrawable) {
                    await session.abortTransaction();
                    return res.status(400).json({
                        success: false,
                        msg: "Insufficient Withdrawal balance.",
                    });
                }

                // Update the user's deposit and withdrawable amounts
                user.deposit_amount = (currentDeposit - convertAmount).toFixed(3);
                user.withdrawable_amount = (
                    currentWithdrawable + (convertAmount - conversionCharge)
                ).toFixed(3);
                await new balanceConvert_record_module({
                    userDB_id: user._id,
                    converted_amount: convertAmount,
                    charges: conversionCharge,
                    converted_amount_type: "Deposit to Withdraw",
                    time: currentTime,
                }).save({ session })

                // Save the user document within the transaction session
                await user.save({ session });

                // Commit the transaction
                await session.commitTransaction();
            } else {
                // Ensure the user has enough deposit to convert
                if (convertAmount > currentDeposit) {
                    await session.abortTransaction();
                    return res.status(400).json({
                        success: false,
                        msg: "Insufficient deposit balance.",
                    });
                }

                // Update the user's deposit and withdrawable amounts
                user.deposit_amount = (currentDeposit - convertAmount).toFixed(3);
                user.withdrawable_amount = (
                    currentWithdrawable + convertAmount
                ).toFixed(3);
                await new balanceConvert_record_module({
                    userDB_id: user._id,
                    converted_amount: convertAmount,
                    charges: "0",
                    converted_amount_type: "Withdraw to Deposit",
                    time: currentTime,
                }).save({ session })

                // Save the user document within the transaction session
                await user.save({ session });

                // Commit the transaction
                await session.commitTransaction();
            }

            return res.status(200).json({
                success: true,
                msg: "Convert successful!",
            });
        } catch (error) {
            await session.abortTransaction();
            console.error("Error processing conversion:", error);
            const isWriteConflict = error.code === 112 ||
                (error.errorResponse && error.errorResponse.code === 112) ||
                (error.codeName && error.codeName === 'WriteConflict');
            if (isWriteConflict) {
                attempt++;
                continue;
            }
            return res.status(500).json({
                success: false,
                msg: "An error occurred while processing the conversion.",
                error: error.message,
            });
        } finally {
            session.endSession();
        }
    }
    return res.status(500).json({
        success: false,
        msg: "Max retry attempts reached. Please try again later.",
    });
};

module.exports = {
    userBalanceData_get,
    userWithdrawal_record_post,
    userBalanceConvertPatch,
    userConvertBalance_get
}