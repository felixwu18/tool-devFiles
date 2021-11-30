/* 取最大, 最小值值 默认取*/
module.exports = function(numArr, type) {
    if (!numArr) { numArr = []; return }
    let temp = numArr[0] * 1 || 0
    numArr.forEach(num => {
        num = num * 1
        if(type) {
            /* 取最小值 */
            if(num < temp) {
                temp = num
            }
        } else {
            /* 默认取最大值 */
            if(num > temp) {
                temp = num
            }
        }
    })
    return temp
};
