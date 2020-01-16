# promise-catchif
Adds catchif to promises

## API

Exports a single, default, idempotent function which adds `.catchif` to the given promise library (or the global `Promise` if not supplied)

`import promiseCatchif from "promise-catchif"`
`promiseCatchif(PromiseLibrary)`

### .catchif
`p.catchif(predicate, handler)`

Applies the handler if the promise is rejected with an error that matches the predicate.

Predicate can either be a constructor (usually a subclass of `Error`) or an object.

### Examples

`.catchif(MyError, ...)` will catch errors which are `instanceof MyError`

`.catchif({ type: 'foo' }, ...)` will catch errors where `error.type === 'foo'`

`.catchif({ statusCode: n => n > 299 }, ...)` will catch errors that have a `statusCode > 299`

The errors have to match _all_ properties in the shape. So `{}` will catch eveerything.

Other kinds of predicates will catch nothing.
