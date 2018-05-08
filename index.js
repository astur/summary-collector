const smry = require('smry');
const mapObj = require('map-obj');
const type = require('easytype');
const arfy = require('arfy');

const toFNA = v => arfy(v).filter(type.isNumber.finite);
const incSmry = (o, a) => {
    const res = smry(a);
    if(!o) return res;
    res.min = Math.min(res.min, o.min);
    res.max = Math.max(res.max, o.max);
    res.sum += o.sum;
    res.len += o.len;
    res.avg = res.sum / res.len;
    return res;
};

module.exports = ({
    store = {},
    quantile = [],
} = {}) => {
    quantile = toFNA(quantile);
    store = mapObj(store, (key, val) =>
        [key, quantile.length ? val : smry(val)]);
    return {
        collect: (o, ...args) => {
            if(!type.isObject(o)) o = {[o]: arfy(...args)};
            Object.keys(o).forEach(key => {
                const vals = toFNA(o[key]);
                if(!vals.length) return;
                const first = !Object.keys(store).includes(key);
                if(quantile.length){
                    store[key] = first ? vals : [...store[key], ...vals];
                } else {
                    store[key] = incSmry(store[key], vals);
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
