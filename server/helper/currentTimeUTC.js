let current_time_get = () => {
    const currentTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

    const dateObj = new Date(currentTime); // Convert to Date object in IST

    // Format: "30/11/24 10:25 PM"
    const formattedTime = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    }).format(dateObj);

    return formattedTime;
};

module.exports = current_time_get;
