const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const other_data_module = require("../model/other_data/other_data_module");
require("dotenv").config();

// SMTP account details - ensure you have at least 5 accounts in your .env
const smtpAccounts = [
    // { email: process.env.SMTP_EMAIL_1, password: process.env.SMTP_PASSWORD_1 },
    { email: process.env.SMTP_EMAIL_2, password: process.env.SMTP_PASSWORD_2 },
    { email: process.env.SMTP_EMAIL_3, password: process.env.SMTP_PASSWORD_3 },
    { email: process.env.SMTP_EMAIL_4, password: process.env.SMTP_PASSWORD_4 },
    { email: process.env.SMTP_EMAIL_5, password: process.env.SMTP_PASSWORD_5 },
    { email: process.env.SMTP_EMAIL_6, password: process.env.SMTP_PASSWORD_6 },
    { email: process.env.SMTP_EMAIL_7, password: process.env.SMTP_PASSWORD_7 },
];

// Create a transporter for each account
const createTransporter = (account) =>
    nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        requireTLS: true,
        auth: {
            user: account.email,
            pass: account.password,
        },
    });

const transporters = smtpAccounts.map(createTransporter);

// Global current transporter index; this can be persisted if needed.
let currentTransporterIndex = 0;

// Function to update (or store) last sent mail details in DB.
const updateLastSentEmail = async (recipient, success_status = "Pending", index) => {
    return await other_data_module.findOneAndUpdate(
        { documentName: "smtpMailSendLastData" },
        {
            documentName: "smtpMailSendLastData",
            to: recipient,
            lastUpdated: new Date(),
            success_status,
            index
        },
        { upsert: true }
    );
};

// Google Sheets API authentication for Sheets operations.
const sheets = google.sheets("v4");
const authSheets = new google.auth.GoogleAuth({
    credentials: {
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// Asynchronously retrieve the document.
// Asynchronously retrieve the sheetId from the DB.
async function getSheetId() {
    const doc = await other_data_module.findOne({ documentName: "smtpMailSendLastData" });
    return doc ? doc.Google_Sheets_ID : null;
}

// Helper function to process email (lowercase and remove dots)
const processEmail = (email) => {
    // Split email into local and domain parts
    const parts = email.split("@");
    if (parts.length !== 2) return email.toLowerCase(); // Agar invalid format, to simply lowercase.
    const local = parts[0].replace(/\./g, ""); // Remove dots from local-part.
    const domain = parts[1].toLowerCase(); // Keep domain intact.
    return `${local}@${domain}`;
};

// Function to fetch marketing emails from Google Sheets.
// Returns an array of processed emails.
const getMarketingEmails = async () => {
    try {
        const sheetId = await getSheetId();
        if (!sheetId) {
            throw new Error("Sheet ID not found in DB.");
        }
        const client = await authSheets.getClient();
        // Fetch emails from Column B (adjust range as needed)
        const response = await sheets.spreadsheets.values.get({
            auth: client,
            spreadsheetId: sheetId,
            range: "Sheet1!B:B",
        });
        const values = response.data.values || [];
        const emails = values.map((row) => processEmail(row[0])).filter((email) => email);
        return emails;
    } catch (error) {
        console.error("Error fetching marketing emails from Google Sheets:", error);
        return [];
    }
};

// Function to send an email using rotating SMTP accounts.
const sendMailUsingTransporters = async (to, subject, html) => {
    for (let i = 0; i < transporters.length; i++) {
        const index = (currentTransporterIndex + i) % transporters.length;
        try {
            await transporters[index].sendMail({
                from: smtpAccounts[index].email,
                to: to.trim(),
                subject,
                html,
            });
            console.log("Mail sent using account:", smtpAccounts[index].email);
            currentTransporterIndex = (index + 1) % transporters.length;
            return { success: true, finalTo: to };
        } catch (error) {
            // If error indicates quota exceeded, try next transporter.
            if (
                error.message.includes("Daily user sending limit exceeded")
            ) {
                continue;
            }
        }
    }
    return { success: false, message: "All mail accounts have reached their daily limit." };
};

// Helper function to wait for a specified number of milliseconds.
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Main function: Call this with subject and HTML content to start sending marketing mails.
async function markitingMailSender(subject, html) {
    try {
        // Fetch marketing email list from Google Sheets.
        const recipients = await getMarketingEmails();

        // Retrieve last sent email from DB.
        const lastData = await other_data_module.findOne({ documentName: "smtpMailSendLastData" });
        let startIndex = 1;
        if (lastData && lastData.to) {
            const lastIndex = recipients.findIndex(
                (email) => email.toLowerCase() === lastData.to.toLowerCase()
            );
            if (lastIndex !== -1 && lastIndex < recipients.length - 1) {
                startIndex = lastIndex + 1;
            }
        }

        // Loop through recipients from startIndex.
        for (let i = startIndex; i < recipients.length; i++) {
            const recipient = recipients[i];
            const result = await sendMailUsingTransporters(recipient, subject, html);
            if (!result.success) {
                console.error("Failed to send mail to:", recipient, result.message);
                break;
            }
            startIndex++
            // Update DB with last sent recipient.
            let other_updated_data = await updateLastSentEmail(result.finalTo, "Pending", startIndex);
            if (other_updated_data?.process_status === false) {
                break;
            }

            if (recipients[recipients.length - 1] === recipient) {
                await updateLastSentEmail(result.finalTo, "Success", startIndex);
            }
            // Wait for 1 second before sending the next mail.
            await delay(1000);
        }
        console.log("Marketing mails processing complete.");
    } catch (error) {
        console.error("Error in markitingMailSender:", error);
    }
}

module.exports = markitingMailSender;