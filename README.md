# Protocheck

JavaScript's type system is very simple: put simply, the truth about a value's type is on its prototype chain. Granting the stipulation that primitives, arrays, and functions are not, by definition `Object` instances, types are well-behaved and easily reasoned about.

Implemented this way, `extends` is respected, and everything just works.

```js
const check = require('protocheck')
const {
  U, T, Void, Null, Maybe, Tuple, ArrayT, Undefined, Dictionary
} = check.types

// Simple types
check('', String)
check([], Array)
check({}, Object)
check(new FooClass, FooClass)

// Empty values
check(null, Null)
check(undefined, Undefined)
check(null, Void)
check(undefined, Void)

// Null-proto objects
check(Object.create(null), Dictionary)

// Unions
check(200, U(Number, String))
check('3', U(Number, String))

// Maybe
check(null, Maybe(Number))
check(5000, Maybe(Number))

// Generics
check(50000, T(50000))
check([1,2], ArrayT(Number))

// Tuples
check([1, false], Tuple(Number, Boolean))

// All return true.
```

This library is not really intended to be used in application source code, but to build tools which require absolutely reliable and accurate type checking.

