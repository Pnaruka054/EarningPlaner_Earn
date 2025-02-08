function generateOrderID() {
    // Get current date and time
    const now = new Date();

    const year = now.getFullYear(); // 4-digit year
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Month (01-12)
    const day = now.getDate().toString().padStart(2, '0'); // Day (01-31)
    const hours = now.getHours().toString().padStart(2, '0'); // Hour (00-23)
    const minutes = now.getMinutes().toString().padStart(2, '0'); // Minute (00-59)
    const seconds = now.getSeconds().toString().padStart(2, '0'); // Seconds (00-59)
    const milliseconds = now.getMilliseconds(); // Milliseconds (000-999)

    // Function to generate random word
    function getRandomWord() {
        const words = ["ALPHA", "BETA", "GAMMA", "DELTA", "ZETA", "OMEGA", "THETA", "SIGMA", "LAMBDA", "PHI"];
        return words[Math.floor(Math.random() * words.length)];
    }

    // Generate random words
    const randomWord1 = getRandomWord();
    const randomWord2 = getRandomWord();

    // Combine everything into a unique ID
    let uniqueID = `${randomWord1}${randomWord2}${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;

    // Ensure the ID is exactly 21 characters long
    if (uniqueID.length < 21) {
        // If length is less than 21, pad the ID with random characters
        while (uniqueID.length < 21) {
            uniqueID += Math.random().toString(36).substring(2, 3).toUpperCase(); // Add one random character at a time
        }
    } else if (uniqueID.length > 21) {
        // If length is greater than 21, truncate to 21 characters
        uniqueID = uniqueID.substring(0, 21);
    }

    return uniqueID;
}

module.exports = generateOrderID;
