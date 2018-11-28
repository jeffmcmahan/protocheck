'use strict'

const typeCheck = require('./typeCheck')

// Expose the types and type-creation functions.
typeCheck.types = require('./types')

// Provide the ability to get information about typecheck failures.
typeCheck.failureDetail = require('./failureDetail')

module.exports = typeCheck
