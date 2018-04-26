# summary-collector

Easy summary collector

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]

## Install

```bash
npm i summary-collector
```

## Usage

```js
const {collect, summary} = require('summary-collector')();

collect({a: 4});
collect({a: 1});
collect({a: 3});
collect({a: 5});
collect({a: 2});

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

## License

MIT

[npm-url]: https://npmjs.org/package/summary-collector
[npm-image]: https://badge.fury.io/js/summary-collector.svg
[travis-url]: https://travis-ci.org/astur/summary-collector
[travis-image]: https://travis-ci.org/astur/summary-collector.svg?branch=master