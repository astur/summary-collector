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

test('initial store', t => {
    const {summary} = require('.')({store: {a: [1, 2, 3, 4, 5, null], b: 'bad'}});
    t.deepEqual(summary(), {a: {min: 1, max: 5, sum: 15, len: 5, avg: 3}});
    t.deepEqual(require('.')({store: 'bad'}).summary(), {});
});

test('quantile', t => {
    const {collect, summary} = require('.')({quantile: [0.25, 0.5, 0.75, 'bad']});
    collect('a', 1, 2, 3, 4);
    t.deepEqual(summary().a.quantile, {0.25: 1.25, 0.5: 2.5, 0.75: 3.75});
});

test('initial store with quantile', t => {
    const {collect, summary} = require('.')({quantile: 0.5, store: {a: [1, 2]}});
    collect('a', 3, 4, 5);
    t.deepEqual(summary(), {a: {min: 1, max: 5, sum: 15, len: 5, avg: 3, quantile: {0.5: 3}}});
});

test('counters', t => {
    const {collect, summary} = require('.')({counters: ['a', 'c'], store: {a: [1, 2]}});
    collect('a', 3, 4, 5);
    collect('b', 1, 2, 3, 4, 5);
    t.is(summary().a, 15);
    t.deepEqual(summary(), {a: 15, b: {min: 1, max: 5, sum: 15, len: 5, avg: 3}, c: 0});
});
