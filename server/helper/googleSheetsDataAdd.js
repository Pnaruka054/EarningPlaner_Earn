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
  // Split email into local and domain parts
  const parts = email.split("@");
  if (parts.length !== 2) return email.toLowerCase(); // Agar invalid format, to simply lowercase.
  const local = parts[0].replace(/\./g, ""); // Remove dots from local-part.
  const domain = parts[1].toLowerCase(); // Keep domain intact.
  return `${local}@${domain}`;
};

// Helper: Find the row index for the given email in the sheet.
// Returns an object:
// - null: if email is not found.
// - { exists: true, rowIndex } if email exists and mobile number is present.
// - { exists: false, rowIndex } if email exists but mobile number is missing.
const findEmailRowIndex = async (client, email) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      auth: client,
      spreadsheetId: sheetId,
      range: "Sheet1!B:C", // Column B: email, Column C: mobile
    });
    const values = response.data.values || [];
    for (let i = 0; i < values.length; i++) {
      const row = values[i];
      if (processEmail(row[0]) === processEmail(email)) {
        if (row[1] && row[1].trim() !== "") {
          // Mobile already exists.
          return { exists: true, rowIndex: i };
        } else {
          // Email exists but mobile is missing.
          return { exists: false, rowIndex: i };
        }
      }
    }
    return null;
  } catch (error) {
    throw new Error("Error fetching data from Google Sheets: " + error.message);
  }
};

// Helper: Check if the mobile number already exists in the entire mobile column (column C).
const checkMobileExists = async (client, mobile) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      auth: client,
      spreadsheetId: sheetId,
      range: "Sheet1!C:C", // Entire column C for mobile
    });
    const values = response.data.values || [];
    for (let row of values) {
      if (row[0] && row[0].trim() === mobile) {
        return true;
      }
    }
    return false;
  } catch (error) {
    throw new Error("Error fetching mobile data from Google Sheets: " + error.message);
  }
};

// Centralized function to add data to Google Sheets.
// - If the email exists without a mobile, update that row with the mobile number.
// - If the email exists with a mobile, return error.
// - Also, if mobile parameter is an empty string and email already exists, return a message.
// - Additionally, if a new email is provided but the mobile number is already in use by another email, do not add a new entry.
const googleSheetsDataAdd = async (name, email, mobile) => {
  try {
    const client = await auth.getClient();
    const emailRow = await findEmailRowIndex(client, email);

    // If mobile is an empty string and email already exists, return immediately.
    if (mobile === "" && emailRow !== null) {
      return { success: false, message: "Email already exists and no mobile provided." };
    }

    if (emailRow === null) {
      // Email does not exist: check if the mobile number is already used
      const mobileExists = await checkMobileExists(client, mobile);
      if (mobileExists) {
        return { success: false, message: "Mobile number already exists for a different email." };
      }
      // Append new row since neither email nor mobile exists.
      await sheets.spreadsheets.values.append({
        auth: client,
        spreadsheetId: sheetId,
        range: "Sheet1!A:C", // Columns: A (name), B (email), C (mobile)
        valueInputOption: "RAW",
        resource: {
          values: [[name, email, mobile]],
        },
      });
      return { success: true, message: "Data appended successfully." };
    } else {
      // Email exists.
      if (emailRow.exists) {
        // Mobile number already exists for this email.
        return { success: false, message: "Email and mobile already exist." };
      } else {
        // Email exists but mobile is missing: update mobile cell.
        const rowNumber = emailRow.rowIndex + 1; // Google Sheets are 1-indexed.
        await sheets.spreadsheets.values.update({
          auth: client,
          spreadsheetId: sheetId,
          range: `Sheet1!C${rowNumber}`, // Update column C (mobile) for this row.
          valueInputOption: "RAW",
          resource: {
            values: [[mobile]],
          },
        });
        return { success: true, message: "Mobile number updated successfully." };
      }
    }
  } catch (error) {
    console.error("Error adding data to Google Sheets:", error);
    throw new Error("Internal Server Error");
  }
};

module.exports = googleSheetsDataAdd;
