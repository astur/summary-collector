const test = require('ava');
const {collect, summary} = require('.')();

test('keys', t => {
    collect({a: 1, b: 2});
    collect({c: 1, d: 2});
    t.deepEqual(Object.keys(summary()), ['a', 'b', 'c', 'd']);
});

test('base', t => {
    collect({a: 4});
    collect({a: 1});
    collect({a: 3});
    collect({a: 5});
    collect({a: 2});
    t.deepEqual(summary(), {
        a: {
            min: 1,
            max: 5,
            sum: 15,
            len: 5,
            avg: 3,
        },
    });
});
