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
    const q = toFNA(quantile);
    const c = arfy(counters);
    let s = type.isObject(store) ? store : {};
    s = transformObj(s, (r, v, k) => {
        const val = toFNA(v);
        if(c.includes(k)){
            r[k] = incCounter(null, val);
            return;
        }
        if(val.length > 0) r[k] = q.length > 0 ? val : smry(val);
    });
    s = Object.assign(zipObject(c, Array(c.length).fill(0)), s);
    return {
        collect: (o, ...args) => {
            const obj = type.isObject(o) ? o : {[o]: arfy(...args)};
            // if(!type.isObject(o)) o = {[o]: arfy(...args)};
            Object.keys(obj).forEach(key => {
                const vals = toFNA(obj[key]);
                if(!vals.length > 0) return;
                s[key] = c.includes(key) ? incCounter(s[key], vals) :
                    q.length > 0 ?
                        [...s[key] || [], ...vals] :
                        incSmry(s[key], vals);
            });
        },
        summary: () => mapObj(s, (val, key) => c.includes(key) ? val :
            q.length > 0 ?
                smry(val, {quantile: q}) :
                mapObj(val, v => +v.toFixed(10))),
    };
};
