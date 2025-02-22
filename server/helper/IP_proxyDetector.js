const axios = require('axios');

/**
 * checkServerIP(ip)
 * @param {string} ip - Check karne wala IP address.
 * @returns {Promise<boolean>} - Promise jo resolve karegi true (real IP) ya false (VPN/proxy IP).
 */
async function IP_proxyDetector(ip) {
    try {
        // ip-api.com se IP details fetch karne ke liye URL.
        // 'fields' parameter se hum sirf required data le rahe hain.
        const url = `http://ip-api.com/json/${ip}?fields=status,message,proxy,hosting,org,isp`;
        const response = await axios.get(url);
        const data = response.data;

        // Agar API request successful nahi hai, error throw karo.
        if (data.status !== "success") {
            throw new Error(data.message || "IP details fetch mein error.");
        }

        // Agar proxy ya hosting flag true hai, to yeh VPN/proxy ho sakta hai.
        if (data.proxy === true || data.hosting === true) {
            return false;
        }

        // ISP ya organization fields check karo keywords ke liye.
        const ispOrgInfo = ((data.org || '') + " " + (data.isp || '')).toLowerCase();
        const vpnKeywords = ["vpn", "proxy", "data center", "hosting", "cloud"];

        // Agar koi keyword ISP/org info mein milta hai, assume karo IP VPN/proxy hai.
        const isVPN = vpnKeywords.some(keyword => ispOrgInfo.includes(keyword));
        return !isVPN;  // True return karega agar VPN/proxy nahi hai.
    } catch (error) {
        console.error("Error in checkServerIP:", error);
        // Error hone par default false return karo.
        return false;
    }
}

module.exports = IP_proxyDetector