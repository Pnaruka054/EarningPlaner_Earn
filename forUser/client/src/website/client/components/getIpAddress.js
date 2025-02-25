const getIPAddress = async () => {
    try {
        const response = await fetch('https://api64.ipify.org?format=json');
        const data = await response.json();
        return data.ip; // IP address return karega
    } catch (error) {
        console.error("Error fetching IP:", error);
        return null;
    }
};

export default getIPAddress