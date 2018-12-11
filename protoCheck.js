'use strict'

const objProto = Object.prototype

const getProto = v => ((v == null) 
	? v
	: (Object.getPrototypeOf || (v => v.__proto__))(v)
)

// These are the types that we will not treat as Objects, following the intention 
// expressed in the ES6 spec at sec. 4.3.2, describing primitives as: "member of 
// one of the types... Boolean, Number, Symbol, or String," and then add Function
// and Array, in keeping with reasonable mainstream expectations.
const nonObjects = [
	Boolean, 
	Symbol, 
	String, 
	Number, 
	Array, 
	Function
].map(v => v.prototype)

module.exports = (proto, v) => {
	let ignoreObj
	let vProto = getProto(v)
	while (vProto) {
		if (nonObjects.includes(vProto)) {
			ignoreObj = true
		}
		if (vProto === proto) {
			return (ignoreObj && proto === objProto) 
				? !!getProto(vProto)
				: true
		}
		vProto = getProto(vProto)
	}
	return false
}