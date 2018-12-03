'use strict'

const nonObjects = [Boolean, String, Number, Array, Function].map(v => v.prototype)

// The actual type checker
module.exports = (proto, v) => {
	let ignoreObj
	while (v.__proto__) {
		if (nonObjects.includes(v.__proto__)) {
			ignoreObj = true
		}
		if (v.__proto__ === proto) {
			return (ignoreObj && proto === Object.prototype) 
				? !!v.__proto__.__proto__ 
				: true
		}
		v = v.__proto__
	}
	return false
}