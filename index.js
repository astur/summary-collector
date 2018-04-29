const smry = require('smry');
const mapObj = require('map-obj');
const type = require('easytype');
const arfy = require('arfy');

module.exports = ({
    store = {},
    quantile = [],
} = {}) => {
    quantile = arfy(quantile).filter(type.isNumber.finite);
    store = mapObj(store, (key, val) =>
        [key, quantile.length ? val : smry(val)]);
    return {
        collect: (o, ...args) => {
            if(!type.isObject(o)) o = {[o]: arfy(...args)};
            Object.keys(o).forEach(key => {
                const vals = arfy(o[key]).filter(type.isNumber.finite);
                if(!vals.length) return;
                const first = !Object.keys(store).includes(key);
                if(quantile.length){
                    if(first) store[key] = [];
                    store[key] = [...store[key], ...vals];
                } else {
                    const sum = vals.reduce((a, b) => a + b, 0) + (first ? 0 : store[key].sum);
                    const len = vals.length + (first ? 0 : store[key].len);
                    store[key] = {
                        min: Math.min(...first ? vals : [store[key].min, ...vals]),
                        max: Math.max(...first ? vals : [store[key].max, ...vals]),
                        sum,
                        len,
                        avg: sum / len,
                    };
                }
            });
        },
        summary: () => mapObj(store, (key, val) => [
            key,
            quantile.length ?
                smry(val, {quantile}) :
                mapObj(val, (key, val) => [
                    key,
                    +val.toFixed(10),
                ]),
        ]),
    };
};
