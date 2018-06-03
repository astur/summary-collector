const smry = require('smry');
const type = require('easytype');
const arfy = require('arfy');
const mapObj = require('lodash.mapvalues');
const transformObj = require('lodash.transform');
const zipObject = require('lodash.zipobject');

const toFNA = v => arfy(v).filter(type.isNumber.finite);
const incCounter = (c, a) => {
    const res = a.reduce((x, y) => x + y, 0);
    if(!c) return res;
    return res + c;
};
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
    counters = [],
} = {}) => {
    quantile = toFNA(quantile);
    counters = arfy(counters);
    if(!type.isObject(store)) store = {};
    store = transformObj(store, (r, v, k) => {
        v = toFNA(v);
        if(counters.includes(k)){
            r[k] = incCounter(null, v);
            return;
        }
        if(v.length) r[k] = quantile.length ? v : smry(v);
    });
    store = Object.assign(zipObject(counters, Array(counters.length).fill(0)), store);
    return {
        collect: (o, ...args) => {
            if(!type.isObject(o)) o = {[o]: arfy(...args)};
            Object.keys(o).forEach(key => {
                const vals = toFNA(o[key]);
                if(!vals.length) return;
                store[key] = counters.includes(key) ? incCounter(store[key], vals) :
                    quantile.length ?
                        [...store[key] || [], ...vals] :
                        incSmry(store[key], vals);
            });
        },
        summary: () => mapObj(store, (val, key) => counters.includes(key) ? val :
            quantile.length ?
                smry(val, {quantile}) :
                mapObj(val, v => +v.toFixed(10))),
    };
};
