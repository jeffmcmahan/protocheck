'use strict'

const state = require('./state')
const typeCheck = require('./typeCheck')
const types = require('./types')
const error = require('./error')

// Throw on failure and respect the disable switch.
module.exports = (v, Type) => {
	if (!state.enabled) {
		return
	} else if (!typeCheck(v, Type)) {
		throw new TypeError(error(v, Type, new Error('')))
	}
}

// Expose the special types.
module.exports.types = types

// Expose the off-switch.
module.exports.disable = () => state.enabled = false

