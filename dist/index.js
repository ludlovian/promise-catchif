'use strict';

function promiseCatchif (PromiseLibrary = Promise) {
  if (typeof PromiseLibrary !== 'function') return
  if (!PromiseLibrary.prototype.catchif) {
    PromiseLibrary.prototype.catchif = catchif;
  }
}
function catchif (predicate, handler) {
  return this.catch(catcher.bind(null, predicate, handler))
}
function catcher (predicate, handler, error) {
  if (matches(predicate, error)) return handler(error)
  throw error
}
function matches (predicate, error) {
  if (typeof predicate === 'function') return error instanceof predicate
  if (predicate && typeof predicate === 'object') {
    return matchesShape(predicate, error)
  }
  return false
}
function matchesShape (obj, error) {
  if (!error || typeof error !== 'object') return false
  for (const [prop, value] of Object.entries(obj)) {
    if (typeof value === 'function') {
      if (!value(error[prop])) return false
    } else {
      if (value !== error[prop]) return false
    }
  }
  return true
}

module.exports = promiseCatchif;
