'use strict'

module.exports = (value, type, err) => {
	const expectedType = type.hmac ? type.__desc: type.name
	const actualType = (
			value == null ? value
		: 	value.constructor ? value.constructor.name
		:	value.constructor
	)
	const stack = (err.stack || err.message)
		.split('\n')
		.slice(2)
		.filter(ln => !ln.includes('(internal/'))
		.join('\n')
	return (
		actualType + ' is not of type ' + expectedType + 
		'\n\n' + 
		stack + 
		'\n\n    ---'
	)
}
