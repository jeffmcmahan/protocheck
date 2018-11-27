'use strict'

const protoCheck = require('./protoCheck')
const typeCheck = require('./typeCheck')
const state = require('./state')
const hmac = state.hmac

// Wrap a function to return undefined if disabled.
const wrap = test => state.enabled ? test : (void 0)

// Any type just allows everything.
exports.Any = wrap(() => true)
exports.Any.hmac = hmac

// Undeinfed type for undefined value only.
exports.Undefined = wrap(v => v === (void 0))
exports.Undefined.hmac = hmac

// Null type for null value only.
exports.Null = wrap(v => v === null)
exports.Null.hmac = hmac

// Dictionaries, i.e.: Object.create(null)
exports.Dictionary = wrap(v => v.__proto__ === void 0)
exports.Dictionary.hmac = hmac

// Unions work if any of the types given is satisfied.
exports.U = wrap((...types) => {
	const test = v => types.some(t => typeCheck(v, t))
	test.hmac = hmac
	return test
})

// Maybe is a Union with Void added to the list.
exports.Maybe = wrap((...types) => exports.U(...types, exports.Void))

// Void is Union of null and undefined.
exports.Void = wrap(exports.U(exports.Null, exports.Undefined))

// Tuples are array of a given length with items of given types.
exports.Tuple = wrap((...types) => {
	const test = v => (
		types.length === v.length &&
		types.every((type, i) => typeCheck(v[i], type))
	)
	test.hmac = hmac
	return test
})

// T is a generic type (takes the type of a value) to check a value.
exports.T = wrap(v1 => {
	let proto = (v1 == null) ? v1 : v1.__proto__
	const test = v2 => protoCheck(proto, v2)
	test.hmac = hmac
	return test
})

// ArrayT is an array generic type (string array is Array(String).
exports.ArrayT = wrap(type => {
	const test = arr => (
		Array.isArray(arr) && arr.every(val => typeCheck(val, type))
	)
	test.hmac = hmac
	return test
})
