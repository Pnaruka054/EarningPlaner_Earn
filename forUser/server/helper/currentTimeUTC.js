let current_time_get = () => {
    const currentTime = new Date();

    // Create a custom date format: "30/11/24 10:25 PM"
    const formattedTime = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).format(currentTime);

    return formattedTime; // Return custom formatted time
};

module.exports = current_time_get