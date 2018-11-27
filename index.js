'use strict'

const state = require('./state')
const typeCheck = require('./typeCheck')
const types = require('./types')

const typeError = args => {
	// Todo: Get a decent error message here.
	return new TypeError('!')
} 

// Throw on failure and respect the disable switch.
module.exports = (...args) => {
	if (!state.enabled) {
		return
	} else if (!typeCheck(...args)) {
		throw typeError(args)
	}
}

// Expose the special types.
module.exports.types = types

// Expose the off-switch.
module.exports.disable = () => state.enabled = false
