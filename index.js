const smry = require('smry');
const mapObj = require('map-obj');

module.exports = () => {
    const store = {};
    return {
        collect: o => {
            Object.keys(o).forEach(key => {
                if(!store[key]) store[key] = [];
                store[key] = [].concat(store[key], o[key]);
            });
        },
        summary: () => mapObj(store, (key, val) => [key, smry(val)]),
    };
};
