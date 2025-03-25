import CryptoJS from 'crypto-js';

const secretKey = import.meta.env.VITE_API_ACCESS_KEY; // Same key as server

// Encryption function
export const encryptData = (data) => {
    try {
        // Data ko JSON string me convert karte hain aur encrypt karte hain
        const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
        return ciphertext;
    } catch (error) {
        console.error("Encryption error:", error);
    }
};

// Decryption function
export const decryptData = (ciphertext) => {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedText);
    } catch (error) {
        console.error("Decryption error:", error);
        throw error;
    }
};
