function getAllDatesOfCurrentMonth() {
    const date = new Date();
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
    let dates = [];

    // Iterating over all days in the month
    for (let day = 1; day <= 31; day++) {
        const currentDate = new Date(currentYear, currentMonth, day);
        if (currentDate.getMonth() !== currentMonth) break; // Stop if the month changes
        dates.push(currentDate.toLocaleDateString('en-CA')); // Format: YYYY-MM-DD
    }

    return dates;
}

module.exports = {
    getAllDatesOfCurrentMonth
}