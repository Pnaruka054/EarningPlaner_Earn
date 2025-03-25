function earningCalculator(ArrayData, property, pendingClick) {
    if (ArrayData.length === 0) return "0.000";

    let maxAmount = Math.max(...ArrayData.map(obj => parseFloat(obj[property]) || 0));

    let total_income = (
        (parseFloat(pendingClick) * maxAmount)
    ).toFixed(3);

    return total_income;
}

module.exports = earningCalculator;
