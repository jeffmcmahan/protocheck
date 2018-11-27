'use strict'

// The actual type checker
module.exports = (proto, v) => {
	if (proto === null) {
		return v.__proto__ === void 0
	}
	let ignoreObject
	while (v.__proto__) {
		if (v.__proto__=== Array.prototype || v.__proto__ === Function.prototype) {
			ignoreObject = true
		}
		if (v.__proto__ === proto) {
			return ignoreObject ? !!v.__proto__.__proto__ : true
		}
		v = v.__proto__
	}
	return false
}