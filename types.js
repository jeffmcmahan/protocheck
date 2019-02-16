'use strict'

const protoCheck = require('./protoCheck')
const typeCheck = require('./typeCheck')
const hmac = require('./hmac')

// Reconstruct type check name, like "Maybe(String)"
const typeNames = types => (
	types.map(type => type.hmac ? type.__desc : type.name).join(', ')
)

const valueType = value => (
		value == null ? value
	: 	value.constructor ? value.constructor.name
	:	value.constructor
)

// Any type just allows everything.
const Any = () => true
Any.__desc = 'Any'
Any.hmac = hmac

// Undeinfed type for undefined value only.
const Undefined = v => v === (void 0)
Undefined.__desc = 'Undefined'
Undefined.hmac = hmac

// Null type for null value only.
const Null = v => v === null
Null.__desc = 'Null'
Null.hmac = hmac

// Dictionaries, i.e.: Object.create(null)
const Dictionary = v => v && (v.__proto__ === void 0)
Dictionary.__desc = 'Dictionary'
Dictionary.hmac = hmac

// Unions work if any of the types given is satisfied.
const U = (...types) => {
	const test = v => types.some(t => typeCheck(v, t))
	test.hmac = hmac
	test.__desc = 'U(' + typeNames(types) + ')'
	return test
}

// Maybe is a Union with Void added to the list.
const Maybe = (...types) => {
	const test = U(...types, Void)
	test.__desc = 'Maybe(' + typeNames(types) + ')'
	return test
}

// Void is Union of null and undefined.
const Void = U(Null, Undefined)
Void.__desc = 'Void'

// Tuples are array of a given length with items of given types.
const Tuple = (...types) => {
	const test = v => (
		typeCheck(v, Array) &&
		types.length === v.length &&
		types.every((type, i) => typeCheck(v[i], type))
	)
	test.__desc = 'Tuple(' + typeNames(types) + ')'
	test.hmac = hmac
	return test
}

// T is a generic type (takes the type of a value) to check a value.
const T = v1 => {
	let proto = (v1 == null) ? v1 : v1.__proto__
	const test = v2 => ((v1 == null && v1 === v2) || protoCheck(proto, v2))
	test.__desc = 'T(' + valueType(v1)  + ')'
	test.hmac = hmac
	return test
}

// ArrayT is an array generic type (string array is Array(String).
const ArrayT = type => {
	const test = arr => (
		typeCheck(arr, Array) && 
		arr.every(val => typeCheck(val, type))
	)
	test.__desc = 'ArrayT(' + typeNames([type])  + ')'
	test.hmac = hmac
	return test
}

module.exports = {
	Any, Undefined, Null, Void, Dictionary, Maybe, Tuple, U, T, ArrayT
}
