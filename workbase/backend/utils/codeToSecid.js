/* 股票代码转secid */
module.exports = function toSecid (configsP, type){
    return configsP.map(item => {
        if(!type) {
            return {
                key: `${item.key[0] === '6' ? 1 : 0}.${item.key}`, // '0.000636' '1.603989'
                value: item.value,
                marketT: `${item.key[0] === '6' ? 'sh' : 'sz'}`
            }
        } else {
            return {
                key: `${item.f12[0] === '6' ? 1 : 0}.${item.f12}`, // '0.000636' '1.603989'
                value: item.f14,
                marketT: `${item.f12[0] === '6' ? 'sh' : 'sz'}`
            }
        }
    })
};