// Client-side function to auto-detect user's IP and check if it's real (not from a VPN/proxy)
// This function returns a Promise that resolves to true (real IP) or false (VPN/proxy)
async function checkClientIP() {
    try {
        // Step 1: Get user's public IP using ipify API.
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const userIP = ipData.ip;

        // Step 2: Fetch IP details from ip-api.com (using fields "org" and "isp")
        const response = await fetch(`http://ip-api.com/json/${userIP}?fields=org,isp`);
        const data = await response.json();

        // Convert fields to lowercase for case-insensitive matching
        const orgLower = data.org ? data.org.toLowerCase() : "";
        const ispLower = data.isp ? data.isp.toLowerCase() : "";

        // List of keywords that might indicate a VPN/proxy/data center
        const vpnKeywords = ["vpn", "proxy", "data center", "hosting", "cloud"];

        // Check if any of the keywords are present in org or isp
        const isVPN = vpnKeywords.some(keyword => orgLower.includes(keyword) || ispLower.includes(keyword));

        return !isVPN;  // Return false if VPN/proxy detected, otherwise true
    } catch (error) {
        console.error("Error detecting IP:", error);
        // In case of error, default to false (not secure)
        return false;
    }
}


export default checkClientIP