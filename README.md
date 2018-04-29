# summary-collector

Easy summary collector. It collects numbers to named arrays and then computes summary for every array using [smry](https://github.com/astur/smry).

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]

## Install

```bash
npm i summary-collector
```

## Usage

```js
const {collect, summary} = require('summary-collector')(options);
```

### functions:

`collect` - saves numbers to named arrays. There is two forms:

```js
// 1. using object
collect({
    array1: 123,               //add single number to 'array1'
    array2: [1, 2, 3, 4, 5],   //add many numbers to 'array2'
})

// 2. using name and numbers
collect('arr', 1)                 //add single number
collect('arr', 1, 2, 3)           //add many numbers as separate params
collect('arr', [1, 2, 3])         //add many numbers as array
collect('arr', 1, [2, 3], 4, [5]) //add many numbers mixed way

// if value is not number - it'll be ignored
collect('test', '1', [null, true], NaN, {}) //nothing happends
```

`summary` - returns object with field for every named array created by `collect`. Each field contains summary for array, computed by [smry](https://github.com/astur/smry).

```js
collect('a', 1, 2, 3, 4, 5);
console.log(summary());
/*
{
    a: {
        min: 1,
        max: 5,
        sum: 15,
        len: 5,
        avg: 3,
    },
}
*/
```

### options:

`store` - initial store (as object with named arrays of numbers).

`quantile` - option for [smry](https://github.com/astur/smry). Same syntax.

### memory usage tip:

If `quantile` option is not set - summaries are computing incrementally without storing full arrays in memory. So, if you expect really big arrays, and if you need quantiles only for certain arrays (not for all), it is good idea to use separate pairs of functions. Something like this:

```js
const {collect, summary} = require('summary-collector')(); //save memory
const {collectQ, summaryQ} = require('summary-collector')({quantile: 0.95});
```

## License

MIT

[npm-url]: https://npmjs.org/package/summary-collector
[npm-image]: https://badge.fury.io/js/summary-collector.svg
[travis-url]: https://travis-ci.org/astur/summary-collector
[travis-image]: https://travis-ci.org/astur/summary-collector.svg?branch=master