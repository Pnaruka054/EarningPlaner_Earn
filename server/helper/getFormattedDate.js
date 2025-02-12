function getFormattedDate() {
    const today = new Date();
    
    // Get the year, month, and day
    const year = today.getFullYear();
    let month = today.getMonth() + 1; // Months are zero-indexed, so add 1
    let day = today.getDate();
    
    // Add leading zeros if needed
    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }
  
    // Return the date in the format YYYY-MM-DD
    return `${year}-${month}-${day}`;
  }
  
  // Example: "2025-02-12"


  module.exports = getFormattedDate