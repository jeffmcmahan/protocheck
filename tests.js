'use strict'

const assert = require('assert')
const typeCheck = require('.')
const {
	Any, Undefined, Null, Void, Dictionary, U, Maybe, T, Tuple, ArrayT
} = require('.').types

// Primitives
assert.doesNotThrow(() => typeCheck(1, Number))
assert.throws(() => typeCheck({}, Number))
assert.doesNotThrow(() => typeCheck('', String))
assert.throws(() => typeCheck(1, String))
assert.doesNotThrow(() => typeCheck(false, Boolean))
assert.throws(() => typeCheck('', Boolean))

// Well-behaved composite values
assert.doesNotThrow(() => typeCheck({}, Object))
assert.throws(() => typeCheck(() => {}, Object))
assert.doesNotThrow(() => typeCheck(new Date(), Date))
assert.throws(() => typeCheck(() => {}, Date))

// Function
assert.doesNotThrow(() => typeCheck(() => {}, Function))
assert.throws(() => typeCheck('', Function))

// Array
assert.doesNotThrow(() => typeCheck([], Array))
assert.throws(() => typeCheck({}, Array))
assert.throws(() => typeCheck([], Object))

// Any
assert.doesNotThrow(() => typeCheck(undefined, Any))
assert.doesNotThrow(() => typeCheck(new Date(), Any))

// Undefined
assert.doesNotThrow(() => typeCheck(undefined, Undefined))
assert.throws(() => typeCheck(null, Undefined))

// Null
assert.doesNotThrow(() => typeCheck(null, Null))
assert.throws(() => typeCheck(undefined, Null))

// Void (undefined or null)
assert.doesNotThrow(() => typeCheck(undefined, Void))
assert.doesNotThrow(() => typeCheck(null, Void))
assert.throws(() => typeCheck(0, Void))

// Dictionary
assert.doesNotThrow(() => typeCheck(Object.create(null), Dictionary))
assert.throws(() => typeCheck({}, Dictionary))

// Maybe
assert.doesNotThrow(() => typeCheck('', Maybe(String)))
assert.doesNotThrow(() => typeCheck(undefined, Maybe(String)))
assert.throws(() => typeCheck(5, Maybe(String)))

// Union
assert.doesNotThrow(() => typeCheck('', U(String, Number)))
assert.doesNotThrow(() => typeCheck(1, U(String, Number)))
assert.throws(() => typeCheck([], U(String, Number)))

// Tuple
assert.doesNotThrow(() => typeCheck(['', 1], Tuple(String, Number)))
assert.throws(() => typeCheck([1, 1], Tuple(String, Number)))
assert.throws(() => typeCheck([1], Tuple(String, Number)))

// Generic
assert.doesNotThrow(() => typeCheck('', T('')))
assert.throws(() => typeCheck(1, T('')))

// Array Generics
assert.doesNotThrow(() => typeCheck(['foo', 'bar'], ArrayT(String)))
assert.doesNotThrow(() => typeCheck([1, 2], ArrayT(Number)))
assert.throws(() => typeCheck([1, '2'], ArrayT(Number)))

// Composition
const maybeStrNum = Maybe(U(String, Number))
assert.doesNotThrow(() => typeCheck('', maybeStrNum))
assert.doesNotThrow(() => typeCheck(1, maybeStrNum))
assert.doesNotThrow(() => typeCheck(undefined, maybeStrNum))
assert.doesNotThrow(() => typeCheck(null, maybeStrNum))
assert.throws(() => typeCheck(false, maybeStrNum))
assert.throws(() => typeCheck({}, maybeStrNum))

const tupleMaybeStrNum = Tuple(Maybe(String), Number)
assert.doesNotThrow(() => typeCheck(['', 1], tupleMaybeStrNum))
assert.doesNotThrow(() => typeCheck([undefined, 1], tupleMaybeStrNum))
assert.doesNotThrow(() => typeCheck([null, 1], tupleMaybeStrNum))
assert.throws(() => typeCheck(false, tupleMaybeStrNum))
assert.throws(() => typeCheck(['', false], tupleMaybeStrNum))
assert.throws(() => typeCheck([undefined, false], tupleMaybeStrNum))

// Disablement
typeCheck.disable()
assert.doesNotThrow(() => typeCheck({}, Number))
assert.doesNotThrow(() => typeCheck(1, String))
assert.doesNotThrow(() => typeCheck('', Boolean))
assert.doesNotThrow(() => typeCheck(() => {}, Object))
assert.doesNotThrow(() => typeCheck(() => {}, Date))
assert.doesNotThrow(() => typeCheck('', Function))
assert.doesNotThrow(() => typeCheck({}, Array))
assert.doesNotThrow(() => typeCheck([], Object))
assert.doesNotThrow(() => typeCheck(null, Undefined))
assert.doesNotThrow(() => typeCheck(undefined, Null))
assert.doesNotThrow(() => typeCheck(0, Void))
assert.doesNotThrow(() => typeCheck({}, Dictionary))
assert.doesNotThrow(() => typeCheck(5, Maybe(String)))
assert.doesNotThrow(() => typeCheck([], U(String, Number)))
assert.doesNotThrow(() => typeCheck([1, 1], Tuple(String, Number)))
assert.doesNotThrow(() => typeCheck([1], Tuple(String, Number)))
assert.doesNotThrow(() => typeCheck(1, T('')))
assert.doesNotThrow(() => typeCheck([1, '2'], ArrayT(Number)))
assert.doesNotThrow(() => typeCheck(false, maybeStrNum))
assert.doesNotThrow(() => typeCheck({}, maybeStrNum))
assert.doesNotThrow(() => typeCheck(false, tupleMaybeStrNum))
assert.doesNotThrow(() => typeCheck(['', false], tupleMaybeStrNum))
assert.doesNotThrow(() => typeCheck([undefined, false], tupleMaybeStrNum))

// Todo: There should be separate benchmarks for the same set of
// test cases before and after disable() is called.

// Todo: Generate thousands of random values and expected outputs
// to ensure that there is an isomorphic mapping between type creation
// and test creation.
