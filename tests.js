'use strict'

const assert = require('assert')
const typeCheck = require('.')
const {
	Any, Undefined, Null, Void, Dictionary, U, Maybe, T, Tuple, ArrayT
} = require('.').types

// Primitives
assert(typeCheck(1, Number))
assert(!typeCheck(null, Number))
assert(!typeCheck(undefined, Number))
assert(!typeCheck({}, Number))

assert(!typeCheck('', Object))
assert(!typeCheck(null, Object))
assert(!typeCheck(undefined, Number))

assert(typeCheck('', String))
assert(!typeCheck('', Object))
assert(!typeCheck(1, String))

assert(typeCheck(false, Boolean))
assert(!typeCheck('', Boolean))
assert(!typeCheck(5, Object))

// Well-behaved composite values
assert(typeCheck({}, Object))
assert(!typeCheck(() => {}, Object))
assert(typeCheck(new Date(), Date))
assert(!typeCheck(() => {}, Date))
assert(!typeCheck(null, Date))
assert(!typeCheck(undefined, Date))

// Function
assert(typeCheck(() => {}, Function))
assert(!typeCheck('', Function))
assert(!typeCheck(()=>{}, Object))

// Array
assert(typeCheck([], Array))
assert(!typeCheck({}, Array))
assert(!typeCheck(null, Array))
assert(!typeCheck(undefined, Array))
assert(!typeCheck([], Object))

// Any
assert(typeCheck(undefined, Any))
assert(typeCheck(null, Any))
assert(typeCheck(new Date(), Any))

// Undefined
assert(typeCheck(undefined, Undefined))
assert(!typeCheck(1, Undefined))
assert(!typeCheck(null, Undefined))

// Null
assert(typeCheck(null, Null))
assert(!typeCheck(1, Null))
assert(!typeCheck(undefined, Null))

// Void (undefined or null)
assert(typeCheck(undefined, Void))
assert(typeCheck(null, Void))
assert(!typeCheck(0, Void))

// Dictionary
assert(typeCheck(Object.create(null), Dictionary))
assert(!typeCheck({}, Dictionary))
assert(!typeCheck(Object.prototype, Dictionary))
assert(!typeCheck(1, Dictionary))
assert(!typeCheck(null, Dictionary))
assert(!typeCheck(undefined, Dictionary))

// Maybe
assert(typeCheck('', Maybe(String)))
assert(typeCheck(undefined, Maybe(String)))
assert(typeCheck(null, Maybe(String, Number)))
assert(!typeCheck(5, Maybe(String)))

// Union
assert(typeCheck('', U(String, Number)))
assert(typeCheck(1, U(String, Number)))
assert(!typeCheck([], U(String, Number)))
assert(!typeCheck(null, U(String, Number)))

// Tuple
const numOrString = Tuple(String, Number)
assert(typeCheck(['', 1], numOrString))
assert(!typeCheck([1, 1], numOrString))
assert(!typeCheck([1], numOrString))
assert(!typeCheck(1, numOrString))
assert(!typeCheck(null, numOrString))

// Generic
assert(typeCheck('', T('')))
assert(!typeCheck(1, T('')))
assert(typeCheck(null, T(null)))
assert(typeCheck(undefined, T(undefined)))
assert(!typeCheck(undefined, T(null)))
assert(!typeCheck(null, T(undefined)))
assert(typeCheck([], T([])))
assert(typeCheck({}, T({})))
assert(!typeCheck([], T({})))
assert(!typeCheck({}, T([])))

// Array Generics
assert(typeCheck(['foo', 'bar'], ArrayT(String)))
assert(typeCheck([1, 2], ArrayT(Number)))
assert(!typeCheck([1, '2'], ArrayT(Number)))
assert(!typeCheck(null, ArrayT(Number)))

// Composition
const maybeStrNum = Maybe(U(String, Number))
assert(typeCheck('', maybeStrNum))
assert(typeCheck(1, maybeStrNum))
assert(typeCheck(undefined, maybeStrNum))
assert(typeCheck(null, maybeStrNum))
assert(!typeCheck(false, maybeStrNum))
assert(!typeCheck({}, maybeStrNum))

const tupleMaybeStrNum = Tuple(Maybe(String), Number)
assert(typeCheck(['', 1], tupleMaybeStrNum))
assert(typeCheck([undefined, 1], tupleMaybeStrNum))
assert(typeCheck([null, 1], tupleMaybeStrNum))
assert(!typeCheck(false, tupleMaybeStrNum))
assert(!typeCheck(['', false], tupleMaybeStrNum))
assert(!typeCheck([undefined, false], tupleMaybeStrNum))

// Failure information
const detail = typeCheck.failureDetail
assert.equal(detail(1, Number), null)
assert.equal(detail('1', Number).expectedTypeName, 'Number')
assert.equal(detail('1', Number).valueTypeName, 'String')

assert.equal(detail({}, Dictionary).expectedTypeName, 'Dictionary')
assert.equal(detail({}, Dictionary).valueTypeName, 'Object')
assert.equal(detail(Object.create(null), {}).valueTypeName, 'Dictionary')

assert.equal(detail(1, Maybe(String)).expectedTypeName, 'Maybe(String)')
assert.equal(detail(1, Maybe(String)).valueTypeName, 'Number')

assert.equal(
	detail([1, 2], Tuple(Number,String)).expectedTypeName, 
	'Tuple(Number, String)'
)
assert.equal(
	detail([1, 2], Tuple(Number,String)).valueTypeName, 
	'Array' // Todo: Improve this when dealing with Tuple or ArrayT.
)
