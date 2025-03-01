// Format current month and year (e.g., "January 2024")
function getFormattedMonth() {
    const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

    const dateObj = new Date(now); // Convert to Date object in IST

    const currentMonthName = dateObj.toLocaleString('en-US', { month: 'long' });
    const currentYear = dateObj.getFullYear();

    return `${currentMonthName} ${currentYear}`;
}

module.exports = getFormattedMonth;
