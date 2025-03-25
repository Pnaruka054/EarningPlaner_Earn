const CryptoJS = require('crypto-js');

const secretKey = process.env.API_ACCESS_KEY; // Ensure yeh 32-character ka ho

// Encryption function
function encryptData(data) {
    // Data ko string me convert karke encrypt karte hain
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
    return ciphertext;
}

// Decryption function
function decryptData(ciphertext) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedText);
}

module.exports = {
    encryptData,
    decryptData
};
