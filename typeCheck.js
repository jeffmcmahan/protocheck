'use strict'

const hmac = require('./hmac')
const protoCheck = require('./protoCheck')

// Wrapper facade to expose the prototypes
module.exports = (v, Type) => {
	
	if (Type && Type.hmac === hmac) {
		return Type(v)
	}

	if (v == null && v !== Type) {
		return false
	}

	return protoCheck(Type.prototype, v)
}