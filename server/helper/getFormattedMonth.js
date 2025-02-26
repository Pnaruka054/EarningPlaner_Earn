// Format current month and year (e.g., "January 2024")
function getFormattedMonth() {
    const now = new Date();
    const currentMonthName = now.toLocaleString('default', { month: 'long' });
    const currentYear = now.getFullYear();
    const monthName = `${currentMonthName} ${currentYear}`;
    return monthName
}

module.exports = getFormattedMonth