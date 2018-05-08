const smry = require('smry');
const type = require('easytype');
const arfy = require('arfy');
const mapObj = require('lodash.mapvalues');
const transformObj = require('lodash.transform');

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
    store = type.isObject(store) ? transformObj(store, (r, v, k, o) => {
        v = toFNA(v);
        if(v.length) r[k] = quantile.length ? v : smry(v);
    }) : {};
    return {
        collect: (o, ...args) => {
            if(!type.isObject(o)) o = {[o]: arfy(...args)};
            Object.keys(o).forEach(key => {
                const vals = toFNA(o[key]);
                if(!vals.length) return;
                store[key] = quantile.length ?
                    [...store[key] || [], ...vals] :
                    incSmry(store[key], vals);
            });
        },
        summary: () => mapObj(store, val => quantile.length ?
            smry(val, {quantile}) :
            mapObj(val, v => +v.toFixed(10))),
    };
};
