// ✅ Function to Set Item with Expiry
function setItemWithExpiry(key, value, expiryInMinutes) {
    const now = new Date();
    const item = {
        value: value,
        expiry: now.getTime() + expiryInMinutes * 60 * 1000 // Convert minutes to milliseconds
    };
    localStorage.setItem(key, JSON.stringify(item));
}

// ✅ Function to Get Item with Expiry Check
function getItemWithExpiry(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    const now = new Date();

    // ⏳ Check if the item has expired
    if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
    }
    return item.value;
}

export { setItemWithExpiry, getItemWithExpiry }