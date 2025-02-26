
function earningCalculator(ArrayData, property, pendingClick) {
    let sum = ArrayData
        .reduce((acc, current) => acc + (parseFloat(current[property]) || 0), 0)
        .toFixed(3);

        let total_income = (
        (ArrayData.length > 0
            ? parseFloat(pendingClick) / parseFloat(ArrayData.length)
            : 0) * parseFloat(sum)
    ).toFixed(3);
    return total_income
}

module.exports = earningCalculator