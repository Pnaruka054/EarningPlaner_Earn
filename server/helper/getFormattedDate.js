function getFormattedDate() {
  const today = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

  const dateObj = new Date(today); // Convert to Date object in IST

  const year = dateObj.getFullYear();
  let month = dateObj.getMonth() + 1; // Months are zero-indexed, so add 1
  let day = dateObj.getDate();

  // Add leading zeros if needed
  if (month < 10) {
      month = '0' + month;
  }
  if (day < 10) {
      day = '0' + day;
  }

  return `${year}-${month}-${day}`;
}

module.exports = getFormattedDate;
