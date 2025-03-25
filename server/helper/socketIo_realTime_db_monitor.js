const mongoose = require('mongoose');
const userDate_records_module = require('../model/dashboard/userDate_modules');
const userSignUp_module = require('../model/userSignUp/userSignUp_module');
const userID_data_for_offerWall_module = require('../model/userID_data_for_offerWall/userID_data_for_offerWall_module');
const generateRandomString = require('./generateRandomString');
const getFormattedDate = require('./getFormattedDate');
const offerWallsData_module = require('../model/offerWallsData/offerWallsData_module');

async function userDateIncome(io) {
    io.on("connection", (socket) => {
        socket.on("serverMessage_for_viewOfferWall_balance", async (data, callback) => {
            try {
                // Fetch and emit the initial data to the client.
                const initialData = await getOfferWallData(socket.user);
                callback({
                    success: true,
                    msg: initialData
                });

                // Create a change stream on the userDate_records_module collection.
                // The pipeline filters for changes where fullDocument.userDB_id matches the current user's _id.
                const pipeline = [
                    { $match: { "fullDocument.userDB_id": socket.user._id.toString() } }
                ];

                // Use the updateLookup option to include the full updated document.
                const changeStream = userDate_records_module.watch(pipeline, { fullDocument: "updateLookup" });

                // Listen for change events.
                changeStream.on("change", async (change) => {
                    try {
                        const updatedData = await getOfferWallData(socket.user);
                        socket.emit("serverMessage_for_viewOfferWall_balance", {
                            success: true,
                            msg: updatedData
                        });
                    } catch (err) {
                        console.error("Error processing change stream event:", err);
                        socket.emit("serverMessage_for_viewOfferWall_balance", {
                            error: JSON.stringify({
                                success: false,
                                error: err.message
                            })
                        });
                    }
                });

                // Log change stream errors.
                changeStream.on("error", (err) => {
                    console.error("Change stream error:", err);
                    // Optionally, emit an error event or log it to a centralized logging service.
                });

                // Clean up the change stream when the socket disconnects.
                socket.on("disconnect", () => {
                    console.info(`Socket ${socket.id} disconnected. Closing change stream.`);
                    changeStream.close();
                });
            } catch (error) {
                console.error("Error fetching initial offer wall balance:", error);
                socket.emit("serverMessage_for_viewOfferWall_balance", {
                    error: JSON.stringify({
                        success: false,
                        error: error.message
                    })
                });
            }

            // Helper function to fetch offer wall data for a user.
            async function getOfferWallData(userData) {
                try {
                    // Format current date as YYYY-MM-DD.
                    const todayDate = getFormattedDate();
                    // Refresh user data (if needed) from the database.
                    userData = await userSignUp_module.findById(userData._id);

                    // Retrieve or create a unique userID for the offer wall.
                    let userIdData = await userID_data_for_offerWall_module.findOne({ userDB_id: userData._id });
                    if (!userIdData) {
                        // Generate a unique random string as userID.
                        async function generateUniqueRandomString(length) {
                            const baseString = generateRandomString(length);
                            let increment = 0;
                            let uniqueString = baseString;
                            while (await userID_data_for_offerWall_module.findOne({ userId: uniqueString })) {
                                increment++;
                                uniqueString = `${baseString}${increment}`;
                            }
                            return uniqueString;
                        }
                        const userName = await generateUniqueRandomString(userData.userName.length);
                        userIdData = new userID_data_for_offerWall_module({
                            userDB_id: userData._id,
                            userId: userName
                        });
                        await userIdData.save();
                    }
                    const userId = userIdData.userId;

                    // Calculate the available balance.
                    const available_balance = (
                        parseFloat(userData.deposit_amount || 0) + parseFloat(userData.withdrawable_amount || 0)
                    ).toFixed(3);

                    // Fetch today's record for the user.
                    const userDate_recordData = await userDate_records_module.findOne({
                        userDB_id: userData._id,
                        date: todayDate
                    });

                    // Retrieve all offer wall datas
                    let offerWallData = await offerWallsData_module.find() || [];

                    const today_offerWallIncome = parseFloat(userDate_recordData?.earningSources?.offerWall?.income || 0);
                    const today_completed = parseFloat(userDate_recordData?.earningSources?.offerWall?.completed || 0);
                    return {
                        available_balance,
                        today_offerWallIncome,
                        today_completed,
                        total_offerWall: offerWallData.length || 0
                    };
                } catch (err) {
                    console.error("Error in getOfferWallData:", err);
                    throw err; // Propagate error to be handled by the calling function.
                }
            }
        });
    });
}

module.exports = {
    userDateIncome
}