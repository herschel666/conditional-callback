Conditional Callback
====

[![Build Status](https://travis-ci.org/herschel666/conditional-callback.svg?branch=master)](https://travis-ci.org/herschel666/conditional-callback)

> Call a function conditionally with a state-object of a certain shape.

When maintaining an implicit state during the runtime of your application, you might want to have a function — causing side-effects — called only, when the current state fulfills certain conditions.

Additionally you might want to have that function called only once. And leave it be until the (valid) state changes.

If this describes your need, `conditional-callback` is your package!

## Installation

Install it via [NPM](https://www.npmjs.com/package/conditional-callback):

```shell
$ npm install -S conditional-callback
```

Import it into your scripts with one of the following styles:

```javascript
// ES2015 module syntax
import createConditionalCallback from 'conditional-callback';

// CommonJS syntax
const createConditionalCallback = require('conditional-callback');
```

## Usage

This could be the simple approach to handle the current state:

```javascript
// Assume we have this function which expects a state-object
// of a certain shape.
const logCertainState = state => {
  if (state.log === true && typeof state.value === 'string') {
    console.log('Current value:', state.value);
  }
};

// This function gets passed into the subscribe-method
// of our stream-defintion; may this be RxJS, Bacon, or whatever.
(...).subscribe(logCertainState);
```

There are two problems with this approach:

1. The logic for selecting the desired state is tightly coupled with the side-effect logic itself.
2. It only makes sure the side-effect happens when the state-object fulfills the conditions, but it doesn't prevent the side-effect from happening multiple times.

To address these issues, `createConditionalCallback` is here for the rescue:

```javascript
// First of all we describe the desired shape of the
// state with a selector object.
// The given keys reflect the keys of the state-object,
// that are supposed to be selected and passed to the callback function.
// The associated values are functions, validating the
// state's values.
const selector = {
  log: x => x === true,
  value: x => typeof x === 'string'
};

// Next, we define the callback function
// without the nested condition. The passed in
// state-object will have the properties
// `log` and `value`.
const callback = state => console.log('Current value:', state.value);

// After that we combine both in a conditional callback. This
// creates a new function, which takes a state-object and calls
// the side-effect when the conditions are fulfilled.
// It also always returns the passed in state-object without
// touching it!!
const conditionalCallback = createConditionalCallback(selector, callback);

const someState = {...};
const result = conditionalCallback(someState);
// result === someState => `true`
```

The derived function can now be used to have your side-effect function be called when the conditions are met.

### Binding multiple conditions to a key

Internally `createConditionalCallback` uses [Ramda's `allPass`-function](http://ramdajs.com/0.22.1/docs/#allPass) to check the condition(s) for a key. It's thus possible to pass in an array of validator-functions:

```javascript
// We want the count-property to be a
// number, that is greater than 5.
const selector = {
  count: [
    x => typeof x === 'number',
    x => x > 5
  ]
};
```

### Having the callback always be called when the passed state is valid

Given the example above, we want to have the `value`-property of the state be logged to console every time the valid state is passed in. For this purpose, `createConditionalCallback` takes an optional third Boolean parameter `needsChange`, that indicates that the given state-object not only has to meet the conditions, but also has to be different than the previous one.

By passing `false` as the third parameter this behaviour is deactivated and the callback is called every time a valid state-object is passed in.

```javascript
const conditionalCallback = createConditionalCallback(selector, callback, false);

const validState = {...};

conditionalCallback(validState) // Callback is called
conditionalCallback(validState) // Callback is called again!
```

## License

The MIT License (MIT)

Copyright (c) 2016 Emanuel Kluge

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
