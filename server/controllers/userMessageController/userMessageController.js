const userMail_message_module = require('../../model/userMessage/userMail_message_module')
const googleSheetsDataAdd = require('../../helper/googleSheetsDataAdd')

const userMessageSave_post = async (req, res) => {
    try {
        // Request body se data extract karna
        const { name, email_address, mobile_number, subject, message, consent } = req.body;

        // Validation: Ensure all fields are present
        if (!name || !email_address || !mobile_number || !subject || !message || consent === undefined) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Saving data to the database (Example)
        const userMessage = new userMail_message_module({
            name,
            email_address,
            mobile_number,
            subject,
            message,
            consent,
        });

        await googleSheetsDataAdd(name, email_address, mobile_number)

        // Save message to database
        await userMessage.save();

        // Response after saving data
        return res.status(200).json({ message: "Message saved successfully" });

    } catch (error) {
        console.error("Error saving message:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    userMessageSave_post
}