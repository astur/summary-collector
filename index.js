const smry = require('smry');
const mapObj = require('map-obj');
const type = require('easytype');
const arfy = require('arfy');

module.exports = ({
    store = {},
    quantile = [],
} = {}) => ({
    collect: (o, ...args) => {
        if(!type.isObject(o)) o = {[o]: arfy(...args)};
        Object.keys(o).forEach(key => {
            const vals = arfy(o[key]).filter(type.isNumber.finite);
            if(!vals.length) return;
            if(!store[key]) store[key] = [];
            store[key] = [...store[key], ...vals];
        });
    },
    summary: () => mapObj(store, (key, val) =>
        [key, smry(val, {quantile: arfy(quantile).filter(type.isNumber.finite)})]),
});
