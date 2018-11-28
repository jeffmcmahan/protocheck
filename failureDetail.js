'use strict'

const typeCheck = require('./typeCheck')

module.exports = (value, expectedType) => {
	if (typeCheck(value, expectedType)) {
		return null
	}

	const expectedTypeName = expectedType.hmac 
		? expectedType.__desc 
		: expectedType.name
	
	const valueTypeName = (
			value == null ? value
		: 	value.constructor ? value.constructor.name
		:	'Dictionary'
	)

	return {expectedTypeName, valueTypeName}
}
