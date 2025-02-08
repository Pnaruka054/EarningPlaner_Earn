const userSignUp_module = require('../../model/userSignUp/userSignUp_module')
const withdrawal_records_module = require('../../model/withdrawRecords/withdrawal_records_module')
const current_time_get = require('../../helper/currentTimeUTC')
const generateOrderID = require('../../helper/generateOrderID')

const userBalanceData_get = async (req, res) => {
    try {
        const userData = req.user;

        const user_DB_Data = await userSignUp_module.findById(userData._id);
        const user_DB_Withdrawal_Data = await withdrawal_records_module.find({ userDB_id: userData._id });
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
            Withdrawal_Records: user_DB_Withdrawal_Data
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
    try {
        const userDB_id = req.user._id;
        const { balance, type } = req.body
        const time = current_time_get()
        const orderNumber = generateOrderID()
        await new withdrawal_records_module({ userDB_id, balance, type, time, orderNumber }).save()

        return res.status(200).json({
            success: true,
            msg: "Withdraw success!"
        });
    } catch (error) {
        console.error('Error fetching user profile data:', error);
        return res.status(500).json({
            success: false,
            msg: 'An error occurred while fetching user profile data.'
        });
    }
}

module.exports = {
    userBalanceData_get,
    userWithdrawal_record_post
}