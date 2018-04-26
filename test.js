const test = require('ava');
const {collect, summary} = require('.')();

test('base', t => {
    collect({a: 1, b: 2});
    collect({c: 1, d: 2});
    t.deepEqual(Object.keys(summary()), ['a', 'b', 'c', 'd']);
});
