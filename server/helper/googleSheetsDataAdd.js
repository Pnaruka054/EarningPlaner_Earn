const { google } = require("googleapis");
require('dotenv').config(); // Load environment variables from .env

// Google Sheets API authentication
const sheets = google.sheets("v4");
const auth = new google.auth.GoogleAuth({
  credentials: {
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Handle new line in private key
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheetId = process.env.Google_Sheets_ID; // Your Google Sheets ID

// Helper function to process email (lowercase and remove dots)
const processEmail = (email) => {
  return email.toLowerCase().replace(/\./g, ''); // Handle Gmail dots
};

// Function to check if email or mobile already exists
const checkEmailOrMobileExists = async (client, email, mobile) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      auth: client,
      spreadsheetId: sheetId,
      range: "Sheet1!B:C", // Assuming emails are in column B and mobile numbers are in column C
    });

    const emailColumn = response.data.values || [];
    const processedEmails = emailColumn.map(row => processEmail(row[0])); // Email in column B
    const processedMobiles = emailColumn.map(row => row[1]); // Mobile in column C

    // Check if email or mobile exists
    return processedEmails.includes(processEmail(email)) || processedMobiles.includes(mobile);
  } catch (error) {
    throw new Error("Error fetching data from Google Sheets: " + error.message);
  }
};

// Centralized function to add data to Google Sheets
const googleSheetsDataAdd = async (name, email, mobile) => {
  const processedEmail = processEmail(email);

  try {
    const client = await auth.getClient();

    // Check if the email or mobile already exists in the sheet
    const entryExists = await checkEmailOrMobileExists(client, processedEmail, mobile);

    // If email or mobile doesn't exist, append the data
    if (!entryExists) {
      await sheets.spreadsheets.values.append({
        auth: client,
        spreadsheetId: sheetId,
        range: "Sheet1!A:C", // Assuming data is being added in columns A (name), B (email), and C (mobile)
        valueInputOption: "RAW",
        resource: {
          values: [[name, email, mobile]],
        },
      });
      console.log("Data successfully added to Google Sheets");
      return { success: true };
    } else {
      console.log("Email or Mobile already exists");
      return { success: false, message: "Email or Mobile already exists" };
    }
  } catch (error) {
    console.error("Error adding data to Google Sheets:", error);
    throw new Error("Internal Server Error");
  }
};

module.exports = googleSheetsDataAdd; // Export the centralized function
