const userSignUp_module = require('../../model/userSignUp/userSignUp_module')
const withdrawal_records_module = require('../../model/withdraw/withdrawal_records_module')
const withdrawal_methods_module = require('../../model/withdraw/withdraw_methods_module')
const current_time_get = require('../../helper/currentTimeUTC')
const mongoose = require('mongoose')

const userBalanceData_get = async (req, res) => {
    try {
        const userData = req.user;

        const user_DB_Data = await userSignUp_module.findById(userData._id);
        const user_DB_Withdrawal_Data = await withdrawal_records_module.find({ userDB_id: userData._id });
        const withdrawal_methodsData = await withdrawal_methods_module.find();
        if (!user_DB_Data || !user_DB_Withdrawal_Data) {
            return res.status(404).json({
                success: false,
                msg: 'User not found'
            });
        }

        let resData = {
            withdrawable_amount: user_DB_Data.withdrawable_amount,
            deposit_amount: user_DB_Data.deposit_amount,
            pending_withdrawal_amount: user_DB_Data.pending_withdrawal_amount,
            total_withdrawal_amount: user_DB_Data.total_withdrawal_amount,
            withdrawal_account_information: user_DB_Data.withdrawal_account_information,
            withdrawal_method: user_DB_Data.withdrawal_method,
            withdrawal_Records: user_DB_Withdrawal_Data,
            withdrawal_methodsData
        }

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
    const session = await mongoose.startSession(); // Start a transaction
    session.startTransaction(); // Begin transaction
    try {
        const userDB_id = req.user._id;
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
        if (parseInt(userSignUpData.withdrawable_amount) < parseInt(balance)) {
            return res.status(400).json({
                success: false,
                msg: "Insufficient funds."
            });
        }

        // Generate order number and time
        const time = current_time_get();

        // Update the withdrawable amount
        userSignUpData.withdrawable_amount = (parseInt(userSignUpData.withdrawable_amount) - parseInt(balance)).toFixed(3).toString();
        userSignUpData.pending_withdrawal_amount = ((parseInt(userSignUpData.pending_withdrawal_amount) || 0) + parseInt(balance)).toString();

        // Save the updated user data
        await userSignUpData.save({ session });

        // Save the withdrawal record
        await new withdrawal_records_module({ userDB_id, balance, type, time, withdrawal_method: userSignUpData.withdrawal_method, withdrawal_account_information: userSignUpData.withdrawal_account_information }).save({ session });

        // Commit the transaction
        await session.commitTransaction();

        return res.status(200).json({
            success: true,
            msg: "Withdrawal successful!"
        });
    } catch (error) {
        await session.abortTransaction(); // Abort the transaction on error
        console.error('Error processing withdrawal:', error);
        return res.status(500).json({
            success: false,
            msg: 'An error occurred while processing the withdrawal.'
        });
    } finally {
        session.endSession(); // End the session (transaction)
    }
};

const userBalanceConvertPatch = async (req, res) => {
    const session = await mongoose.startSession(); // Start a transaction
    session.startTransaction(); // Begin transaction
    try {
        const userDB_id = req.user._id;
        const { balance } = req.body;

        // Fetch user data
        let userSignUpData = await userSignUp_module.findById(userDB_id).session(session); // Use session for transaction
        if (!userSignUpData) {
            return res.status(404).json({
                success: false,
                msg: "User not found."
            });
        }

        // Update the withdrawable amount
        userSignUpData.deposit_amount = (parseInt(userSignUpData.deposit_amount) - parseInt(balance)).toFixed(3).toString();

        // Save the updated user data
        await userSignUpData.save({ session });

        // Commit the transaction
        await session.commitTransaction();

        return res.status(200).json({
            success: true,
            msg: "Convert successful!"
        });
    } catch (error) {
        await session.abortTransaction(); // Abort the transaction on error
        console.error('Error processing withdrawal:', error);
        return res.status(500).json({
            success: false,
            msg: 'An error occurred while processing the withdrawal.'
        });
    } finally {
        session.endSession(); // End the session (transaction)
    }
};

module.exports = {
    userBalanceData_get,
    userWithdrawal_record_post,
    userBalanceConvertPatch
}