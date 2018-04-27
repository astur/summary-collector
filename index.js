const smry = require('smry');
const mapObj = require('map-obj');
const type = require('easytype');
const arfy = require('arfy');

module.exports = () => {
    const store = {};
    return {
        collect: (o, ...args) => {
            if(!type.isObject(o)) o = {[o]: arfy(...args)};
            Object.keys(o).forEach(key => {
                if(!store[key]) store[key] = [];
                store[key] = [].concat(store[key], o[key]);
            });
        },
        summary: () => mapObj(store, (key, val) => [key, smry(val)]),
    };
};
