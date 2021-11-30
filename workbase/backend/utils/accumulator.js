module.exports = function(numArr){
    if (!numArr) { numArr = []; return }
    const reducer = (accumulator, currentValue) => (accumulator * 1 + currentValue * 1).toFixed(2);
    return numArr.reduce(reducer)
};
