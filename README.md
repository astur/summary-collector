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

collect({val1: 1, val2: 2});

console.log(summary());
```

## License

MIT

[npm-url]: https://npmjs.org/package/summary-collector
[npm-image]: https://badge.fury.io/js/summary-collector.svg
[travis-url]: https://travis-ci.org/astur/summary-collector
[travis-image]: https://travis-ci.org/astur/summary-collector.svg?branch=master