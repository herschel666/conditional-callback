
const is = require('ramda/src/is');
const merge = require('ramda/src/merge');
const equals = require('ramda/src/equals');
const expect = require('expect.js');
const spy = require('sinon').spy;

require('mocha');

const createConditionalCallback = require('./');

const greaterThan = comparator => value => value > comparator;

const selector = {
  foo: is(String),
  active: equals(true),
  count: [is(Number), greaterThan(5)]
};

describe('conditional callback', () => {

  describe('needsChange = true', () => {

    before(function before() {
      this.initialState = {
        foo: null,
        active: false
      };
      this.spy = spy();
      this.callback = createConditionalCallback(selector, this.spy);
    });

    afterEach(function afterEach() {
      this.spy.reset();
    });

    describe('Try the initial state', () => {

      before(function before() {
        this.result = this.callback(this.initialState);
      });

      it('should not call the function', function it() {
        expect(this.spy.callCount).to.be(0);
      });

      it('should return the passed state', function it() {
        expect(this.result).to.be(this.initialState);
      });

    });

    describe('Setting property "foo"', () => {

      before(function before() {
        this.callback(merge(this.initialState, {
          foo: 'foobar'
        }));
      });

      it('should not call the function', function it() {
        expect(this.spy.callCount).to.be(0);
      });

    });

    describe('Setting property "active"', () => {

      before(function before() {
        this.callback(merge(this.initialState, {
          foo: 'foobar',
          active: true
        }));
      });

      it('should not call the function', function it() {
        expect(this.spy.callCount).to.be(0);
      });

    });

    describe('Setting property "count" invalidly', () => {

      before(function before() {
        this.callback({
          foo: 'foobar',
          active: true,
          count: 4
        });
      });

      it('should not call the function', function it() {
        expect(this.spy.callCount).to.be(0);
      });

    });

    describe('Setting property "count" invalidly', () => {

      before(function before() {
        this.callback({
          foo: 'foobar',
          active: true,
          count: '6'
        });
      });

      it('should not call the function', function it() {
        expect(this.spy.callCount).to.be(0);
      });

    });

    describe('Setting property "count" validly', () => {

      before(function before() {
        const state = {
          foo: 'foobar',
          active: true,
          count: 6
        };
        this.callback(state);
        this.callback(state);
        this.callback(state);
      });

      it('should call the function once', function it() {
        expect(this.spy.callCount).to.be(1);
      });

    });

  });

  describe('needsChange = false', () => {

    before(function before() {
      this.initialState = {
        foo: null,
        active: false
      };
      this.spy = spy();
      this.callback = createConditionalCallback(selector, this.spy, false);
    });

    afterEach(function afterEach() {
      this.spy.reset();
    });

    describe('Try the initial state', () => {

      before(function before() {
        this.callback(this.initialState);
      });

      it('should not call the function', function it() {
        expect(this.spy.callCount).to.be(0);
      });

    });

    describe('Set needed properties', () => {

      before(function before() {
        const state = {
          foo: 'foobar',
          active: true,
          count: 6
        };
        this.callback(state);
        this.callback(state);
        this.callback(state);
      });

      it('should call the function three times', function it() {
        expect(this.spy.callCount).to.be(3);
      });

    });

  });

});
