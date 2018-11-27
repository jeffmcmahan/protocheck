'use strict'

const protoCheck = require('./protoCheck')
const typeCheck = require('./typeCheck')
const state = require('./state')
const hmac = state.hmac

// Reconstruct type check name, like "Maybe(String)"
const typeNames = types => (
	types.map(type => type.hmac ? type.__desc : type.name).join(', ')
)

const valueType = value => (
		value == null ? value
	: 	value.constructor ? value.constructor.name
	:	value.constructor
)

// Wrap a function to return undefined if disabled.
const wrap = test => state.enabled ? test : (void 0)

// Any type just allows everything.
const Any = wrap(() => true)
Any.__desc = 'Any'
Any.hmac = hmac

// Undeinfed type for undefined value only.
const Undefined = wrap(v => v === (void 0))
Undefined.__desc = 'Undefined'
Undefined.hmac = hmac

// Null type for null value only.
const Null = wrap(v => v === null)
Null.__desc = 'Null'
Null.hmac = hmac

// Dictionaries, i.e.: Object.create(null)
const Dictionary = wrap(v => v.__proto__ === void 0)
Dictionary.__desc = 'Dictionary'
Dictionary.hmac = hmac

// Unions work if any of the types given is satisfied.
const U = wrap((...types) => {
	const test = v => types.some(t => typeCheck(v, t))
	test.hmac = hmac
	test.__desc = 'U(' + typeNames(types) + ')'
	return test
})

// Maybe is a Union with Void added to the list.
const Maybe = wrap((...types) => {
	const test = U(...types, Void)
	test.__desc = 'Maybe(' + typeNames(types) + ')'
	return test
})

// Void is Union of null and undefined.
const Void = wrap(U(Null, Undefined))

// Tuples are array of a given length with items of given types.
const Tuple = wrap((...types) => {
	const test = v => (
		types.length === v.length &&
		types.every((type, i) => typeCheck(v[i], type))
	)
	test.__desc = 'Tuple(' + typeNames(types) + ')'
	test.hmac = hmac
	return test
})

// T is a generic type (takes the type of a value) to check a value.
const T = wrap(v1 => {
	let proto = (v1 == null) ? v1 : v1.__proto__
	const test = v2 => protoCheck(proto, v2)
	test.__desc = 'T(' + valueType(v1)  + ')'
	test.hmac = hmac
	return test
})

// ArrayT is an array generic type (string array is Array(String).
const ArrayT = wrap(type => {
	const test = arr => (
		Array.isArray(arr) && arr.every(val => typeCheck(val, type))
	)
	test.__desc = 'ArrayT(' + typeNames([type])  + ')'
	test.hmac = hmac
	return test
})

module.exports = {
	Any, Undefined, Null, Void, Dictionary, Maybe, Tuple, U, T, ArrayT
}
