const test = require('ava');

test('keys', t => {
    const {collect, summary} = require('.')();
    collect({a: 1, b: 2});
    collect({c: 1, d: 2});
    t.deepEqual(Object.keys(summary()), ['a', 'b', 'c', 'd']);
});

test('numbers in object', t => {
    const {collect, summary} = require('.')();
    collect({a: 4});
    collect({a: 1});
    collect({a: 3});
    collect({a: 5});
    collect({a: 2});
    t.deepEqual(summary().a, {min: 1, max: 5, sum: 15, len: 5, avg: 3});
});

test('array in object', t => {
    const {collect, summary} = require('.')();
    collect({a: [4, 1, 3, 5, 2]});
    t.deepEqual(summary().a, {min: 1, max: 5, sum: 15, len: 5, avg: 3});
});

test('key, single number', t => {
    const {collect, summary} = require('.')();
    collect('a', 4);
    collect('a', 1);
    collect('a', 3);
    collect('a', 5);
    collect('a', 2);
    t.deepEqual(summary().a, {min: 1, max: 5, sum: 15, len: 5, avg: 3});
});

test('key, array of numbers', t => {
    const {collect, summary} = require('.')();
    collect('a', [4, 1, 3, 5, 2]);
    t.deepEqual(summary().a, {min: 1, max: 5, sum: 15, len: 5, avg: 3});
});

test('key, ...numbers', t => {
    const {collect, summary} = require('.')();
    collect('a', 4, 1, 3, 5, 2);
    t.deepEqual(summary().a, {min: 1, max: 5, sum: 15, len: 5, avg: 3});
});

test('key, ...numbers&arrays', t => {
    const {collect, summary} = require('.')();
    collect('a', [4, 1], 3, [5], 2);
    t.deepEqual(summary().a, {min: 1, max: 5, sum: 15, len: 5, avg: 3});
});

test('ignore bad values', t => {
    const {collect, summary} = require('.')();
    collect('a', 1, false, NaN, /^$/, {});
    collect('b', null, [true, undefined], '1');
    t.deepEqual(summary(), {a: {min: 1, max: 1, sum: 1, len: 1, avg: 1}});
});
