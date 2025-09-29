/**
 * CrowdHandler JavaScript SDK v2.2.0
 * (c) 2025 CrowdHandler
 * @license ISC
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var axios = require('axios');
var zod = require('zod');
var qparse = require('query-string');
var jsSha256 = require('js-sha256');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);
var qparse__default = /*#__PURE__*/_interopDefaultLegacy(qparse);

var runtime = {exports: {}};

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
runtime.exports;

var hasRequiredRuntime;

function requireRuntime () {
	if (hasRequiredRuntime) return runtime.exports;
	hasRequiredRuntime = 1;
	(function (module) {
		var runtime = (function (exports) {

		  var Op = Object.prototype;
		  var hasOwn = Op.hasOwnProperty;
		  var defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; };
		  var undefined$1; // More compressible than void 0.
		  var $Symbol = typeof Symbol === "function" ? Symbol : {};
		  var iteratorSymbol = $Symbol.iterator || "@@iterator";
		  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
		  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

		  function define(obj, key, value) {
		    Object.defineProperty(obj, key, {
		      value: value,
		      enumerable: true,
		      configurable: true,
		      writable: true
		    });
		    return obj[key];
		  }
		  try {
		    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
		    define({}, "");
		  } catch (err) {
		    define = function(obj, key, value) {
		      return obj[key] = value;
		    };
		  }

		  function wrap(innerFn, outerFn, self, tryLocsList) {
		    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
		    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
		    var generator = Object.create(protoGenerator.prototype);
		    var context = new Context(tryLocsList || []);

		    // The ._invoke method unifies the implementations of the .next,
		    // .throw, and .return methods.
		    defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) });

		    return generator;
		  }
		  exports.wrap = wrap;

		  // Try/catch helper to minimize deoptimizations. Returns a completion
		  // record like context.tryEntries[i].completion. This interface could
		  // have been (and was previously) designed to take a closure to be
		  // invoked without arguments, but in all the cases we care about we
		  // already have an existing method we want to call, so there's no need
		  // to create a new function object. We can even get away with assuming
		  // the method takes exactly one argument, since that happens to be true
		  // in every case, so we don't have to touch the arguments object. The
		  // only additional allocation required is the completion record, which
		  // has a stable shape and so hopefully should be cheap to allocate.
		  function tryCatch(fn, obj, arg) {
		    try {
		      return { type: "normal", arg: fn.call(obj, arg) };
		    } catch (err) {
		      return { type: "throw", arg: err };
		    }
		  }

		  var GenStateSuspendedStart = "suspendedStart";
		  var GenStateSuspendedYield = "suspendedYield";
		  var GenStateExecuting = "executing";
		  var GenStateCompleted = "completed";

		  // Returning this object from the innerFn has the same effect as
		  // breaking out of the dispatch switch statement.
		  var ContinueSentinel = {};

		  // Dummy constructor functions that we use as the .constructor and
		  // .constructor.prototype properties for functions that return Generator
		  // objects. For full spec compliance, you may wish to configure your
		  // minifier not to mangle the names of these two functions.
		  function Generator() {}
		  function GeneratorFunction() {}
		  function GeneratorFunctionPrototype() {}

		  // This is a polyfill for %IteratorPrototype% for environments that
		  // don't natively support it.
		  var IteratorPrototype = {};
		  define(IteratorPrototype, iteratorSymbol, function () {
		    return this;
		  });

		  var getProto = Object.getPrototypeOf;
		  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
		  if (NativeIteratorPrototype &&
		      NativeIteratorPrototype !== Op &&
		      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
		    // This environment has a native %IteratorPrototype%; use it instead
		    // of the polyfill.
		    IteratorPrototype = NativeIteratorPrototype;
		  }

		  var Gp = GeneratorFunctionPrototype.prototype =
		    Generator.prototype = Object.create(IteratorPrototype);
		  GeneratorFunction.prototype = GeneratorFunctionPrototype;
		  defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: true });
		  defineProperty(
		    GeneratorFunctionPrototype,
		    "constructor",
		    { value: GeneratorFunction, configurable: true }
		  );
		  GeneratorFunction.displayName = define(
		    GeneratorFunctionPrototype,
		    toStringTagSymbol,
		    "GeneratorFunction"
		  );

		  // Helper for defining the .next, .throw, and .return methods of the
		  // Iterator interface in terms of a single ._invoke method.
		  function defineIteratorMethods(prototype) {
		    ["next", "throw", "return"].forEach(function(method) {
		      define(prototype, method, function(arg) {
		        return this._invoke(method, arg);
		      });
		    });
		  }

		  exports.isGeneratorFunction = function(genFun) {
		    var ctor = typeof genFun === "function" && genFun.constructor;
		    return ctor
		      ? ctor === GeneratorFunction ||
		        // For the native GeneratorFunction constructor, the best we can
		        // do is to check its .name property.
		        (ctor.displayName || ctor.name) === "GeneratorFunction"
		      : false;
		  };

		  exports.mark = function(genFun) {
		    if (Object.setPrototypeOf) {
		      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
		    } else {
		      genFun.__proto__ = GeneratorFunctionPrototype;
		      define(genFun, toStringTagSymbol, "GeneratorFunction");
		    }
		    genFun.prototype = Object.create(Gp);
		    return genFun;
		  };

		  // Within the body of any async function, `await x` is transformed to
		  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
		  // `hasOwn.call(value, "__await")` to determine if the yielded value is
		  // meant to be awaited.
		  exports.awrap = function(arg) {
		    return { __await: arg };
		  };

		  function AsyncIterator(generator, PromiseImpl) {
		    function invoke(method, arg, resolve, reject) {
		      var record = tryCatch(generator[method], generator, arg);
		      if (record.type === "throw") {
		        reject(record.arg);
		      } else {
		        var result = record.arg;
		        var value = result.value;
		        if (value &&
		            typeof value === "object" &&
		            hasOwn.call(value, "__await")) {
		          return PromiseImpl.resolve(value.__await).then(function(value) {
		            invoke("next", value, resolve, reject);
		          }, function(err) {
		            invoke("throw", err, resolve, reject);
		          });
		        }

		        return PromiseImpl.resolve(value).then(function(unwrapped) {
		          // When a yielded Promise is resolved, its final value becomes
		          // the .value of the Promise<{value,done}> result for the
		          // current iteration.
		          result.value = unwrapped;
		          resolve(result);
		        }, function(error) {
		          // If a rejected Promise was yielded, throw the rejection back
		          // into the async generator function so it can be handled there.
		          return invoke("throw", error, resolve, reject);
		        });
		      }
		    }

		    var previousPromise;

		    function enqueue(method, arg) {
		      function callInvokeWithMethodAndArg() {
		        return new PromiseImpl(function(resolve, reject) {
		          invoke(method, arg, resolve, reject);
		        });
		      }

		      return previousPromise =
		        // If enqueue has been called before, then we want to wait until
		        // all previous Promises have been resolved before calling invoke,
		        // so that results are always delivered in the correct order. If
		        // enqueue has not been called before, then it is important to
		        // call invoke immediately, without waiting on a callback to fire,
		        // so that the async generator function has the opportunity to do
		        // any necessary setup in a predictable way. This predictability
		        // is why the Promise constructor synchronously invokes its
		        // executor callback, and why async functions synchronously
		        // execute code before the first await. Since we implement simple
		        // async functions in terms of async generators, it is especially
		        // important to get this right, even though it requires care.
		        previousPromise ? previousPromise.then(
		          callInvokeWithMethodAndArg,
		          // Avoid propagating failures to Promises returned by later
		          // invocations of the iterator.
		          callInvokeWithMethodAndArg
		        ) : callInvokeWithMethodAndArg();
		    }

		    // Define the unified helper method that is used to implement .next,
		    // .throw, and .return (see defineIteratorMethods).
		    defineProperty(this, "_invoke", { value: enqueue });
		  }

		  defineIteratorMethods(AsyncIterator.prototype);
		  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
		    return this;
		  });
		  exports.AsyncIterator = AsyncIterator;

		  // Note that simple async functions are implemented on top of
		  // AsyncIterator objects; they just return a Promise for the value of
		  // the final result produced by the iterator.
		  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
		    if (PromiseImpl === void 0) PromiseImpl = Promise;

		    var iter = new AsyncIterator(
		      wrap(innerFn, outerFn, self, tryLocsList),
		      PromiseImpl
		    );

		    return exports.isGeneratorFunction(outerFn)
		      ? iter // If outerFn is a generator, return the full iterator.
		      : iter.next().then(function(result) {
		          return result.done ? result.value : iter.next();
		        });
		  };

		  function makeInvokeMethod(innerFn, self, context) {
		    var state = GenStateSuspendedStart;

		    return function invoke(method, arg) {
		      if (state === GenStateExecuting) {
		        throw new Error("Generator is already running");
		      }

		      if (state === GenStateCompleted) {
		        if (method === "throw") {
		          throw arg;
		        }

		        // Be forgiving, per GeneratorResume behavior specified since ES2015:
		        // ES2015 spec, step 3: https://262.ecma-international.org/6.0/#sec-generatorresume
		        // Latest spec, step 2: https://tc39.es/ecma262/#sec-generatorresume
		        return doneResult();
		      }

		      context.method = method;
		      context.arg = arg;

		      while (true) {
		        var delegate = context.delegate;
		        if (delegate) {
		          var delegateResult = maybeInvokeDelegate(delegate, context);
		          if (delegateResult) {
		            if (delegateResult === ContinueSentinel) continue;
		            return delegateResult;
		          }
		        }

		        if (context.method === "next") {
		          // Setting context._sent for legacy support of Babel's
		          // function.sent implementation.
		          context.sent = context._sent = context.arg;

		        } else if (context.method === "throw") {
		          if (state === GenStateSuspendedStart) {
		            state = GenStateCompleted;
		            throw context.arg;
		          }

		          context.dispatchException(context.arg);

		        } else if (context.method === "return") {
		          context.abrupt("return", context.arg);
		        }

		        state = GenStateExecuting;

		        var record = tryCatch(innerFn, self, context);
		        if (record.type === "normal") {
		          // If an exception is thrown from innerFn, we leave state ===
		          // GenStateExecuting and loop back for another invocation.
		          state = context.done
		            ? GenStateCompleted
		            : GenStateSuspendedYield;

		          if (record.arg === ContinueSentinel) {
		            continue;
		          }

		          return {
		            value: record.arg,
		            done: context.done
		          };

		        } else if (record.type === "throw") {
		          state = GenStateCompleted;
		          // Dispatch the exception by looping back around to the
		          // context.dispatchException(context.arg) call above.
		          context.method = "throw";
		          context.arg = record.arg;
		        }
		      }
		    };
		  }

		  // Call delegate.iterator[context.method](context.arg) and handle the
		  // result, either by returning a { value, done } result from the
		  // delegate iterator, or by modifying context.method and context.arg,
		  // setting context.delegate to null, and returning the ContinueSentinel.
		  function maybeInvokeDelegate(delegate, context) {
		    var methodName = context.method;
		    var method = delegate.iterator[methodName];
		    if (method === undefined$1) {
		      // A .throw or .return when the delegate iterator has no .throw
		      // method, or a missing .next method, always terminate the
		      // yield* loop.
		      context.delegate = null;

		      // Note: ["return"] must be used for ES3 parsing compatibility.
		      if (methodName === "throw" && delegate.iterator["return"]) {
		        // If the delegate iterator has a return method, give it a
		        // chance to clean up.
		        context.method = "return";
		        context.arg = undefined$1;
		        maybeInvokeDelegate(delegate, context);

		        if (context.method === "throw") {
		          // If maybeInvokeDelegate(context) changed context.method from
		          // "return" to "throw", let that override the TypeError below.
		          return ContinueSentinel;
		        }
		      }
		      if (methodName !== "return") {
		        context.method = "throw";
		        context.arg = new TypeError(
		          "The iterator does not provide a '" + methodName + "' method");
		      }

		      return ContinueSentinel;
		    }

		    var record = tryCatch(method, delegate.iterator, context.arg);

		    if (record.type === "throw") {
		      context.method = "throw";
		      context.arg = record.arg;
		      context.delegate = null;
		      return ContinueSentinel;
		    }

		    var info = record.arg;

		    if (! info) {
		      context.method = "throw";
		      context.arg = new TypeError("iterator result is not an object");
		      context.delegate = null;
		      return ContinueSentinel;
		    }

		    if (info.done) {
		      // Assign the result of the finished delegate to the temporary
		      // variable specified by delegate.resultName (see delegateYield).
		      context[delegate.resultName] = info.value;

		      // Resume execution at the desired location (see delegateYield).
		      context.next = delegate.nextLoc;

		      // If context.method was "throw" but the delegate handled the
		      // exception, let the outer generator proceed normally. If
		      // context.method was "next", forget context.arg since it has been
		      // "consumed" by the delegate iterator. If context.method was
		      // "return", allow the original .return call to continue in the
		      // outer generator.
		      if (context.method !== "return") {
		        context.method = "next";
		        context.arg = undefined$1;
		      }

		    } else {
		      // Re-yield the result returned by the delegate method.
		      return info;
		    }

		    // The delegate iterator is finished, so forget it and continue with
		    // the outer generator.
		    context.delegate = null;
		    return ContinueSentinel;
		  }

		  // Define Generator.prototype.{next,throw,return} in terms of the
		  // unified ._invoke helper method.
		  defineIteratorMethods(Gp);

		  define(Gp, toStringTagSymbol, "Generator");

		  // A Generator should always return itself as the iterator object when the
		  // @@iterator function is called on it. Some browsers' implementations of the
		  // iterator prototype chain incorrectly implement this, causing the Generator
		  // object to not be returned from this call. This ensures that doesn't happen.
		  // See https://github.com/facebook/regenerator/issues/274 for more details.
		  define(Gp, iteratorSymbol, function() {
		    return this;
		  });

		  define(Gp, "toString", function() {
		    return "[object Generator]";
		  });

		  function pushTryEntry(locs) {
		    var entry = { tryLoc: locs[0] };

		    if (1 in locs) {
		      entry.catchLoc = locs[1];
		    }

		    if (2 in locs) {
		      entry.finallyLoc = locs[2];
		      entry.afterLoc = locs[3];
		    }

		    this.tryEntries.push(entry);
		  }

		  function resetTryEntry(entry) {
		    var record = entry.completion || {};
		    record.type = "normal";
		    delete record.arg;
		    entry.completion = record;
		  }

		  function Context(tryLocsList) {
		    // The root entry object (effectively a try statement without a catch
		    // or a finally block) gives us a place to store values thrown from
		    // locations where there is no enclosing try statement.
		    this.tryEntries = [{ tryLoc: "root" }];
		    tryLocsList.forEach(pushTryEntry, this);
		    this.reset(true);
		  }

		  exports.keys = function(val) {
		    var object = Object(val);
		    var keys = [];
		    for (var key in object) {
		      keys.push(key);
		    }
		    keys.reverse();

		    // Rather than returning an object with a next method, we keep
		    // things simple and return the next function itself.
		    return function next() {
		      while (keys.length) {
		        var key = keys.pop();
		        if (key in object) {
		          next.value = key;
		          next.done = false;
		          return next;
		        }
		      }

		      // To avoid creating an additional object, we just hang the .value
		      // and .done properties off the next function object itself. This
		      // also ensures that the minifier will not anonymize the function.
		      next.done = true;
		      return next;
		    };
		  };

		  function values(iterable) {
		    if (iterable != null) {
		      var iteratorMethod = iterable[iteratorSymbol];
		      if (iteratorMethod) {
		        return iteratorMethod.call(iterable);
		      }

		      if (typeof iterable.next === "function") {
		        return iterable;
		      }

		      if (!isNaN(iterable.length)) {
		        var i = -1, next = function next() {
		          while (++i < iterable.length) {
		            if (hasOwn.call(iterable, i)) {
		              next.value = iterable[i];
		              next.done = false;
		              return next;
		            }
		          }

		          next.value = undefined$1;
		          next.done = true;

		          return next;
		        };

		        return next.next = next;
		      }
		    }

		    throw new TypeError(typeof iterable + " is not iterable");
		  }
		  exports.values = values;

		  function doneResult() {
		    return { value: undefined$1, done: true };
		  }

		  Context.prototype = {
		    constructor: Context,

		    reset: function(skipTempReset) {
		      this.prev = 0;
		      this.next = 0;
		      // Resetting context._sent for legacy support of Babel's
		      // function.sent implementation.
		      this.sent = this._sent = undefined$1;
		      this.done = false;
		      this.delegate = null;

		      this.method = "next";
		      this.arg = undefined$1;

		      this.tryEntries.forEach(resetTryEntry);

		      if (!skipTempReset) {
		        for (var name in this) {
		          // Not sure about the optimal order of these conditions:
		          if (name.charAt(0) === "t" &&
		              hasOwn.call(this, name) &&
		              !isNaN(+name.slice(1))) {
		            this[name] = undefined$1;
		          }
		        }
		      }
		    },

		    stop: function() {
		      this.done = true;

		      var rootEntry = this.tryEntries[0];
		      var rootRecord = rootEntry.completion;
		      if (rootRecord.type === "throw") {
		        throw rootRecord.arg;
		      }

		      return this.rval;
		    },

		    dispatchException: function(exception) {
		      if (this.done) {
		        throw exception;
		      }

		      var context = this;
		      function handle(loc, caught) {
		        record.type = "throw";
		        record.arg = exception;
		        context.next = loc;

		        if (caught) {
		          // If the dispatched exception was caught by a catch block,
		          // then let that catch block handle the exception normally.
		          context.method = "next";
		          context.arg = undefined$1;
		        }

		        return !! caught;
		      }

		      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
		        var entry = this.tryEntries[i];
		        var record = entry.completion;

		        if (entry.tryLoc === "root") {
		          // Exception thrown outside of any try block that could handle
		          // it, so set the completion value of the entire function to
		          // throw the exception.
		          return handle("end");
		        }

		        if (entry.tryLoc <= this.prev) {
		          var hasCatch = hasOwn.call(entry, "catchLoc");
		          var hasFinally = hasOwn.call(entry, "finallyLoc");

		          if (hasCatch && hasFinally) {
		            if (this.prev < entry.catchLoc) {
		              return handle(entry.catchLoc, true);
		            } else if (this.prev < entry.finallyLoc) {
		              return handle(entry.finallyLoc);
		            }

		          } else if (hasCatch) {
		            if (this.prev < entry.catchLoc) {
		              return handle(entry.catchLoc, true);
		            }

		          } else if (hasFinally) {
		            if (this.prev < entry.finallyLoc) {
		              return handle(entry.finallyLoc);
		            }

		          } else {
		            throw new Error("try statement without catch or finally");
		          }
		        }
		      }
		    },

		    abrupt: function(type, arg) {
		      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
		        var entry = this.tryEntries[i];
		        if (entry.tryLoc <= this.prev &&
		            hasOwn.call(entry, "finallyLoc") &&
		            this.prev < entry.finallyLoc) {
		          var finallyEntry = entry;
		          break;
		        }
		      }

		      if (finallyEntry &&
		          (type === "break" ||
		           type === "continue") &&
		          finallyEntry.tryLoc <= arg &&
		          arg <= finallyEntry.finallyLoc) {
		        // Ignore the finally entry if control is not jumping to a
		        // location outside the try/catch block.
		        finallyEntry = null;
		      }

		      var record = finallyEntry ? finallyEntry.completion : {};
		      record.type = type;
		      record.arg = arg;

		      if (finallyEntry) {
		        this.method = "next";
		        this.next = finallyEntry.finallyLoc;
		        return ContinueSentinel;
		      }

		      return this.complete(record);
		    },

		    complete: function(record, afterLoc) {
		      if (record.type === "throw") {
		        throw record.arg;
		      }

		      if (record.type === "break" ||
		          record.type === "continue") {
		        this.next = record.arg;
		      } else if (record.type === "return") {
		        this.rval = this.arg = record.arg;
		        this.method = "return";
		        this.next = "end";
		      } else if (record.type === "normal" && afterLoc) {
		        this.next = afterLoc;
		      }

		      return ContinueSentinel;
		    },

		    finish: function(finallyLoc) {
		      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
		        var entry = this.tryEntries[i];
		        if (entry.finallyLoc === finallyLoc) {
		          this.complete(entry.completion, entry.afterLoc);
		          resetTryEntry(entry);
		          return ContinueSentinel;
		        }
		      }
		    },

		    "catch": function(tryLoc) {
		      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
		        var entry = this.tryEntries[i];
		        if (entry.tryLoc === tryLoc) {
		          var record = entry.completion;
		          if (record.type === "throw") {
		            var thrown = record.arg;
		            resetTryEntry(entry);
		          }
		          return thrown;
		        }
		      }

		      // The context.catch method must only be called with a location
		      // argument that corresponds to a known catch block.
		      throw new Error("illegal catch attempt");
		    },

		    delegateYield: function(iterable, resultName, nextLoc) {
		      this.delegate = {
		        iterator: values(iterable),
		        resultName: resultName,
		        nextLoc: nextLoc
		      };

		      if (this.method === "next") {
		        // Deliberately forget the last sent value so that we don't
		        // accidentally pass it on to the delegate.
		        this.arg = undefined$1;
		      }

		      return ContinueSentinel;
		    }
		  };

		  // Regardless of whether this script is executing as a CommonJS module
		  // or not, return the runtime object so that we can declare the variable
		  // regeneratorRuntime in the outer scope, which allows this module to be
		  // injected easily by `bin/regenerator --include-runtime script.js`.
		  return exports;

		}(
		  // If this script is executing as a CommonJS module, use module.exports
		  // as the regeneratorRuntime namespace. Otherwise create a new empty
		  // object. Either way, the resulting object will be used to initialize
		  // the regeneratorRuntime variable at the top of this file.
		  module.exports 
		));

		try {
		  regeneratorRuntime = runtime;
		} catch (accidentalStrictMode) {
		  // This module should not be running in strict mode, so the above
		  // assignment should always work unless something is misconfigured. Just
		  // in case runtime.js accidentally runs in strict mode, in modern engines
		  // we can explicitly access globalThis. In older engines we can escape
		  // strict mode using a global Function call. This could conceivably fail
		  // if a Content Security Policy forbids using Function, but in that case
		  // the proper solution is to fix the accidental strict mode problem. If
		  // you've misconfigured your bundler to force strict mode and applied a
		  // CSP to forbid Function, and you're not willing to fix either of those
		  // problems, please detail your unique predicament in a GitHub issue.
		  if (typeof globalThis === "object") {
		    globalThis.regeneratorRuntime = runtime;
		  } else {
		    Function("r", "regeneratorRuntime = r")(runtime);
		  }
		} 
	} (runtime));
	return runtime.exports;
}

requireRuntime();

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

//export a logger function that will be used to log messages
function logger(debug, level, message) {
    if (debug) {
        switch (level) {
            case "info":
                console.info(message);
                break;
            case "warn":
                console.warn(message);
                break;
            case "error":
                console.error(message);
                break;
            default:
                console.log(message);
                break;
        }
    }
}

/**
 * Custom error class for CrowdHandler SDK with actionable error messages.
 * All SDK errors are instances of this class, providing consistent error handling.
 *
 * @example
 * try {
 *   const { client } = crowdhandler.init({ publicKey: 'invalid' });
 * } catch (error) {
 *   // error is always a CrowdHandlerError
 *   console.log(error.code);       // 'INVALID_API_KEY'
 *   console.log(error.message);    // Human-readable message
 *   console.log(error.suggestion); // Helpful next steps
 *   console.log(error.statusCode); // HTTP status if applicable
 * }
 */
var CrowdHandlerError = /** @class */ (function (_super) {
    __extends(CrowdHandlerError, _super);
    function CrowdHandlerError(code, message, suggestion, statusCode, context) {
        var _this = _super.call(this, message) || this;
        _this.name = 'CrowdHandlerError';
        _this.code = code;
        _this.statusCode = statusCode;
        _this.suggestion = suggestion;
        _this.context = context;
        // Maintains proper stack trace for where our error was thrown
        if (Error.captureStackTrace) {
            Error.captureStackTrace(_this, CrowdHandlerError);
        }
        return _this;
    }
    /**
     * Returns a formatted error message with all context
     */
    CrowdHandlerError.prototype.toString = function () {
        var errorMsg = "".concat(this.name, " [").concat(this.code, "]: ").concat(this.message);
        if (this.suggestion) {
            errorMsg += "\n\uD83D\uDCA1 Suggestion: ".concat(this.suggestion);
        }
        if (this.statusCode) {
            errorMsg += "\n\uD83D\uDCCA Status Code: ".concat(this.statusCode);
        }
        if (this.context && Object.keys(this.context).length > 0) {
            errorMsg += "\n\uD83D\uDD0D Context: ".concat(JSON.stringify(this.context, null, 2));
        }
        return errorMsg;
    };
    return CrowdHandlerError;
}(Error));
/**
 * Common error codes used throughout the SDK.
 * Use these constants to handle specific error conditions.
 *
 * @example
 * try {
 *   await client.domains().get();
 * } catch (error) {
 *   if (error.code === ErrorCodes.MISSING_PRIVATE_KEY) {
 *     console.log('Need to initialize with private key');
 *   }
 * }
 */
var ErrorCodes = {
    // Network errors
    API_CONNECTION_FAILED: 'API_CONNECTION_FAILED',
    API_TIMEOUT: 'API_TIMEOUT',
    API_INVALID_RESPONSE: 'API_INVALID_RESPONSE',
    // Authentication errors
    INVALID_PUBLIC_KEY: 'INVALID_PUBLIC_KEY',
    INVALID_PRIVATE_KEY: 'INVALID_PRIVATE_KEY',
    MISSING_PRIVATE_KEY: 'MISSING_PRIVATE_KEY',
    AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',
    // Configuration errors
    INVALID_CONFIG: 'INVALID_CONFIG',
    INVALID_MODE: 'INVALID_MODE',
    MISSING_CONTEXT: 'MISSING_CONTEXT',
    INVALID_CONTEXT: 'INVALID_CONTEXT',
    // Validation errors
    VALIDATION_FAILED: 'VALIDATION_FAILED',
    INVALID_TOKEN: 'INVALID_TOKEN',
    SIGNATURE_MISMATCH: 'SIGNATURE_MISMATCH',
    // API response errors
    RATE_LIMITED: 'RATE_LIMITED',
    DOMAIN_NOT_FOUND: 'DOMAIN_NOT_FOUND',
    ROOM_NOT_FOUND: 'ROOM_NOT_FOUND',
    SESSION_NOT_FOUND: 'SESSION_NOT_FOUND',
    // Runtime errors
    METHOD_NOT_AVAILABLE: 'METHOD_NOT_AVAILABLE',
    BROWSER_ONLY: 'BROWSER_ONLY',
    SERVER_ONLY: 'SERVER_ONLY',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};
/**
 * Factory functions for creating common CrowdHandler errors.
 * Used internally by the SDK to ensure consistent error messages.
 * @internal
 */
var createError = {
    apiConnection: function (originalError) {
        var isTimeout = originalError.code === 'ECONNABORTED' || originalError.code === 'ETIMEDOUT';
        var isRefused = originalError.code === 'ECONNREFUSED';
        if (isTimeout) {
            return new CrowdHandlerError(ErrorCodes.API_TIMEOUT, 'Request to CrowdHandler API timed out', 'Try increasing the timeout option or check your network connection', undefined, { originalError: originalError.message });
        }
        if (isRefused) {
            return new CrowdHandlerError(ErrorCodes.API_CONNECTION_FAILED, 'Could not connect to CrowdHandler API', 'Check your internet connection and firewall settings. If the problem persists, check https://status.crowdhandler.com', undefined, { originalError: originalError.message });
        }
        return new CrowdHandlerError(ErrorCodes.API_CONNECTION_FAILED, "Network error: ".concat(originalError.message), 'Check your network connection and try again', undefined, { originalError: originalError.message });
    },
    invalidApiKey: function (keyType) {
        var code = keyType === 'public' ? ErrorCodes.INVALID_PUBLIC_KEY : ErrorCodes.INVALID_PRIVATE_KEY;
        return new CrowdHandlerError(code, "Invalid ".concat(keyType, " key"), "Check your CrowdHandler dashboard for the correct ".concat(keyType, " key"), 401);
    },
    missingPrivateKey: function (method) {
        return new CrowdHandlerError(ErrorCodes.MISSING_PRIVATE_KEY, "".concat(method, " requires a private key"), "Initialize with: crowdhandler.init({ publicKey, privateKey })", 403);
    },
    missingContext: function (method) {
        var example = typeof window !== 'undefined'
            ? 'crowdhandler.init({ publicKey })'
            : 'crowdhandler.init({ publicKey, request: req, response: res })';
        return new CrowdHandlerError(ErrorCodes.MISSING_CONTEXT, "".concat(method, " requires request context"), "Initialize with: ".concat(example), 400);
    },
    invalidResponse: function (response) {
        return new CrowdHandlerError(ErrorCodes.API_INVALID_RESPONSE, 'Received invalid response from CrowdHandler API', 'This might be a temporary issue. If it persists, contact support@crowdhandler.com', 502, { response: JSON.stringify(response).substring(0, 200) });
    },
    rateLimited: function (retryAfter) {
        return new CrowdHandlerError(ErrorCodes.RATE_LIMITED, 'API rate limit exceeded', retryAfter
            ? "Wait ".concat(retryAfter, " seconds before retrying")
            : 'Reduce the frequency of API calls', 429, { retryAfter: retryAfter });
    },
    resourceNotFound: function (resourceType, resourceId) {
        var errorCode = {
            domain: ErrorCodes.DOMAIN_NOT_FOUND,
            room: ErrorCodes.ROOM_NOT_FOUND,
            session: ErrorCodes.SESSION_NOT_FOUND,
        }[resourceType] || ErrorCodes.API_INVALID_RESPONSE;
        return new CrowdHandlerError(errorCode, "".concat(resourceType, " not found: ").concat(resourceId), "Check that the ".concat(resourceType, " ID is correct and that you have access to it"), 404, { resourceType: resourceType, resourceId: resourceId });
    }
};

var APIResponse = zod.z.object({}).catchall(zod.z.any());
zod.z
    .object({
    error: zod.z.string().optional(),
    message: zod.z.string().optional(),
    statusCode: zod.z.number().optional(),
})
    .catchall(zod.z.any());
var BaseClient = /** @class */ (function () {
    function BaseClient(apiUrl, key, options) {
        if (options === void 0) { options = {}; }
        this.debug = options.debug || false;
        this.apiUrl = options.apiUrl || apiUrl;
        this.key = key;
        this.timeout = options.timeout || 5000;
        axios__default["default"].defaults.timeout = this.timeout;
    }
    /**
     * Wraps any error into a CrowdHandlerError
     */
    BaseClient.prototype.wrapError = function (error) {
        var _a;
        // Already a CrowdHandlerError
        if (error instanceof CrowdHandlerError) {
            return error;
        }
        // Zod validation error
        if (error.name === 'ZodError') {
            return new CrowdHandlerError(ErrorCodes.API_INVALID_RESPONSE, 'Invalid response format from API', 'This might be a temporary issue. If it persists, contact support@crowdhandler.com', undefined, { parseError: error.message });
        }
        // Generic unknown error
        return new CrowdHandlerError(ErrorCodes.UNKNOWN_ERROR, error.message || 'An unexpected error occurred', 'Please try again. If the problem persists, contact support@crowdhandler.com', undefined, {
            errorType: (_a = error.constructor) === null || _a === void 0 ? void 0 : _a.name,
            stack: error.stack
        });
    };
    BaseClient.prototype.errorHandler = function (error) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            var status_1, data, retryAfter, urlMatch, resourceType, resourceId, errorMessage;
            return __generator(this, function (_e) {
                // If it's already a CrowdHandlerError, just re-throw it
                if (error instanceof CrowdHandlerError) {
                    throw error;
                }
                if (error.response) {
                    status_1 = error.response.status;
                    data = error.response.data;
                    logger(this.debug, "error", "API Error - Status: ".concat(status_1, " - ").concat(JSON.stringify(data)));
                    logger(this.debug, "error", "Response headers: ".concat(JSON.stringify(error.response.headers)));
                    // Handle specific HTTP status codes
                    if (status_1 === 401) {
                        throw createError.invalidApiKey('public');
                    }
                    if (status_1 === 429) {
                        retryAfter = error.response.headers['retry-after'];
                        throw createError.rateLimited(retryAfter);
                    }
                    if (status_1 === 404) {
                        urlMatch = (_b = (_a = error.config) === null || _a === void 0 ? void 0 : _a.url) === null || _b === void 0 ? void 0 : _b.match(/\/v1\/(\w+)\/(\w+)/);
                        if (urlMatch) {
                            resourceType = urlMatch[1], resourceId = urlMatch[2];
                            throw createError.resourceNotFound(resourceType, resourceId);
                        }
                    }
                    errorMessage = (data === null || data === void 0 ? void 0 : data.error) || (data === null || data === void 0 ? void 0 : data.message) || "API request failed with status ".concat(status_1);
                    throw new CrowdHandlerError(ErrorCodes.API_INVALID_RESPONSE, errorMessage, status_1 >= 500
                        ? 'This appears to be a server error. Please try again later or contact support@crowdhandler.com'
                        : 'Please check your request parameters and try again', status_1, {
                        url: (_c = error.config) === null || _c === void 0 ? void 0 : _c.url,
                        method: (_d = error.config) === null || _d === void 0 ? void 0 : _d.method,
                        responseData: JSON.stringify(data).substring(0, 200)
                    });
                }
                else if (error.request) {
                    // The request was made but no response was received
                    logger(this.debug, "error", "No response received: ".concat(error.message));
                    throw createError.apiConnection(error);
                }
                else {
                    // Something happened in setting up the request
                    logger(this.debug, "error", "Request setup error: ".concat(error.message));
                    // Use wrapError to ensure we always throw CrowdHandlerError
                    throw this.wrapError(error);
                }
            });
        });
    };
    BaseClient.prototype.httpDELETE = function (path, body) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 4]);
                        return [4 /*yield*/, axios__default["default"].delete(this.apiUrl + path, {
                                headers: {
                                    "x-api-key": this.key,
                                },
                            })];
                    case 1:
                        response = _a.sent();
                        try {
                            return [2 /*return*/, APIResponse.parse(response.data)];
                        }
                        catch (parseError) {
                            throw this.wrapError(parseError);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        error_1 = _a.sent();
                        return [4 /*yield*/, this.errorHandler(error_1)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    BaseClient.prototype.httpGET = function (path, params) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 4]);
                        return [4 /*yield*/, axios__default["default"].get(this.apiUrl + path, {
                                params: params,
                                headers: {
                                    "x-api-key": this.key,
                                },
                            })];
                    case 1:
                        response = _a.sent();
                        try {
                            return [2 /*return*/, APIResponse.parse(response.data)];
                        }
                        catch (parseError) {
                            throw this.wrapError(parseError);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        error_2 = _a.sent();
                        return [4 /*yield*/, this.errorHandler(error_2)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    BaseClient.prototype.httpPOST = function (path, body, headers, schema) {
        if (schema === void 0) { schema = APIResponse; }
        return __awaiter(this, void 0, void 0, function () {
            var response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 4]);
                        return [4 /*yield*/, axios__default["default"].post(this.apiUrl + path, body, {
                                headers: __assign({ "x-api-key": this.key }, headers),
                            })];
                    case 1:
                        response = _a.sent();
                        try {
                            return [2 /*return*/, schema.parse(response.data)];
                        }
                        catch (parseError) {
                            throw this.wrapError(parseError);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        error_3 = _a.sent();
                        return [4 /*yield*/, this.errorHandler(error_3)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    BaseClient.prototype.httpPUT = function (path, body) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios__default["default"].put(this.apiUrl + path, body, {
                                headers: {
                                    "x-api-key": this.key,
                                },
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, APIResponse.parse(response.data)];
                    case 2:
                        error_4 = _a.sent();
                        return [2 /*return*/, this.errorHandler(error_4)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return BaseClient;
}());

var Resource = /** @class */ (function (_super) {
    __extends(Resource, _super);
    function Resource(key, path, options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        var _a = options !== null && options !== void 0 ? options : {}; _a.timeout; _a.debug; var _d = _a.apiUrl, apiUrl = _d === void 0 ? "https://api.crowdhandler.com" : _d;
        _this = _super.call(this, apiUrl, key, options) || this;
        _this.path = path;
        return _this;
    }
    Resource.prototype.formatPath = function (path, id) {
        // If id is not provided, replace it with an empty string.
        id = id || "";
        //this.path may contain a placeholder for the id. replace it with the actual id.
        path = path.replace("ID_PLACEHOLDER", id);
        return path;
    };
    Resource.prototype.delete = function (id, body) {
        this.path = this.formatPath(this.path, id);
        return _super.prototype.httpDELETE.call(this, this.path, body);
    };
    Resource.prototype.get = function (id, params) {
        //Handle id being an optional parameter
        if (!id) {
            id = "";
        }
        this.path = this.formatPath(this.path, id);
        // Extract custom parameters and spread them with other params
        var _a = params || {}, custom = _a.custom, standardParams = __rest(_a, ["custom"]);
        var requestParams = __assign(__assign({}, standardParams), custom // Spread custom parameters at the root level
        );
        return _super.prototype.httpGET.call(this, this.path, requestParams);
    };
    Resource.prototype.post = function (body) {
        this.path = this.formatPath(this.path, "");
        // Extract custom parameters and spread them with other body params
        var _a = body || {}, custom = _a.custom, standardBody = __rest(_a, ["custom"]);
        var requestBody = __assign(__assign({}, standardBody), custom // Spread custom parameters at the root level
        );
        return _super.prototype.httpPOST.call(this, this.path, requestBody);
    };
    Resource.prototype.put = function (id, body) {
        this.path = this.formatPath(this.path, id);
        return _super.prototype.httpPUT.call(this, this.path, body);
    };
    return Resource;
}(BaseClient));

var PublicClient = /** @class */ (function (_super) {
    __extends(PublicClient, _super);
    function PublicClient(key, options) {
        if (options === void 0) { options = {}; }
        var _a = options !== null && options !== void 0 ? options : {}; _a.timeout; _a.debug; var _d = _a.apiUrl, apiUrl = _d === void 0 ? "https://api.crowdhandler.com" : _d;
        return _super.call(this, apiUrl, key, options) || this;
    }
    PublicClient.prototype.requests = function () {
        return new Resource(this.key, "/v1/requests/ID_PLACEHOLDER", { timeout: this.timeout, debug: this.debug, apiUrl: this.apiUrl });
    };
    PublicClient.prototype.responses = function () {
        return new Resource(this.key, "/v1/responses/ID_PLACEHOLDER", { timeout: this.timeout, debug: this.debug, apiUrl: this.apiUrl });
    };
    PublicClient.prototype.rooms = function () {
        return new Resource(this.key, "/v1/rooms/", { timeout: this.timeout, debug: this.debug, apiUrl: this.apiUrl });
    };
    return PublicClient;
}(BaseClient));

var PrivateClient = /** @class */ (function (_super) {
    __extends(PrivateClient, _super);
    function PrivateClient(key, options) {
        if (options === void 0) { options = {}; }
        var _a = options !== null && options !== void 0 ? options : {}; _a.timeout; _a.debug; var _d = _a.apiUrl, apiUrl = _d === void 0 ? "https://api.crowdhandler.com" : _d;
        return _super.call(this, apiUrl, key, options) || this;
    }
    PrivateClient.prototype.account = function () {
        return new Resource(this.key, "/v1/account/", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.accountPlan = function () {
        return new Resource(this.key, "/v1/account/plan", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.codes = function () {
        return new Resource(this.key, "/v1/codes/ID_PLACEHOLDER", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.domains = function () {
        return new Resource(this.key, "/v1/domains/ID_PLACEHOLDER", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.domainIPs = function () {
        return new Resource(this.key, "/v1/domains/ID_PLACEHOLDER/ips", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.domainReports = function () {
        return new Resource(this.key, "/v1/domains/ID_PLACEHOLDER/reports", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.domainRequests = function () {
        return new Resource(this.key, "/v1/domains/ID_PLACEHOLDER/requests", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.domainRooms = function () {
        return new Resource(this.key, "/v1/domains/ID_PLACEHOLDER/rooms", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.domainURLs = function () {
        return new Resource(this.key, "/v1/domains/ID_PLACEHOLDER/urls", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.groups = function () {
        return new Resource(this.key, "/v1/groups/ID_PLACEHOLDER", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.groupBatch = function () {
        return new Resource(this.key, "/v1/groups/ID_PLACEHOLDER/batch", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.groupCodes = function () {
        return new Resource(this.key, "/v1/groups/ID_PLACEHOLDER/codes", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.ips = function () {
        return new Resource(this.key, "/v1/ips/ID_PLACEHOLDER", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.reports = function () {
        return new Resource(this.key, "/v1/reports/ID_PLACEHOLDER", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.rooms = function () {
        return new Resource(this.key, "/v1/rooms/ID_PLACEHOLDER", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.roomReports = function () {
        return new Resource(this.key, "/v1/rooms/ID_PLACEHOLDER/reports", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.roomSessions = function () {
        return new Resource(this.key, "/v1/rooms/ID_PLACEHOLDER/sessions", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.sessions = function () {
        return new Resource(this.key, "/v1/sessions/ID_PLACEHOLDER", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.templates = function () {
        return new Resource(this.key, "/v1/templates/ID_PLACEHOLDER", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    return PrivateClient;
}(BaseClient));

/**
 * Unified CrowdHandler API client that combines public and private API access.
 *
 * This client provides a single interface to all CrowdHandler API endpoints,
 * with intelligent error messages when attempting to use private endpoints
 * without a private key.
 *
 * @example
 * // Public API only
 * const client = new Client({ publicKey: 'pk_xyz' });
 * const rooms = await client.rooms().get();
 *
 * @example
 * // Public and Private API
 * const client = new Client({
 *   publicKey: 'pk_xyz',
 *   privateKey: 'sk_xyz'
 * });
 * const domains = await client.domains().get();
 */
var Client = /** @class */ (function () {
    function Client(config) {
        this.publicClient = new PublicClient(config.publicKey, config.options);
        this.hasPrivateAccess = !!config.privateKey;
        if (config.privateKey) {
            this.privateClient = new PrivateClient(config.privateKey, config.options);
        }
    }
    // ===== Public API Methods (always available) =====
    /**
     * Access request resources
     * @returns Resource instance for request operations
     *
     * @example
     * const request = await client.requests().get('req_123');
     */
    Client.prototype.requests = function () {
        return this.publicClient.requests();
    };
    /**
     * Access response resources
     * @returns Resource instance for response operations
     *
     * @example
     * const response = await client.responses().get('res_123');
     */
    Client.prototype.responses = function () {
        return this.publicClient.responses();
    };
    /**
     * Access room resources
     * @returns Resource instance for room operations
     *
     * @example
     * const rooms = await client.rooms().get();
     * const room = await client.rooms().get('room_123');
     */
    Client.prototype.rooms = function () {
        return this.publicClient.rooms();
    };
    // ===== Private API Methods (require privateKey) =====
    /**
     * Access account information (requires private key)
     * @returns Resource instance for account operations
     * @throws {CrowdHandlerError} When no private key is configured
     *
     * @example
     * const account = await client.account().get();
     */
    Client.prototype.account = function () {
        this.requirePrivateAccess('account()');
        return this.privateClient.account();
    };
    Client.prototype.accountPlan = function () {
        this.requirePrivateAccess('accountPlan()');
        return this.privateClient.accountPlan();
    };
    Client.prototype.codes = function () {
        this.requirePrivateAccess('codes()');
        return this.privateClient.codes();
    };
    /**
     * Access domain resources (requires private key)
     * @returns Resource instance for domain operations
     * @throws {CrowdHandlerError} When no private key is configured
     *
     * @example
     * const domains = await client.domains().get();
     * const domain = await client.domains().get('dom_123');
     * const newDomain = await client.domains().post({ domain: 'example.com' });
     */
    Client.prototype.domains = function () {
        this.requirePrivateAccess('domains()');
        return this.privateClient.domains();
    };
    Client.prototype.domainIPs = function () {
        this.requirePrivateAccess('domainIPs()');
        return this.privateClient.domainIPs();
    };
    Client.prototype.domainReports = function () {
        this.requirePrivateAccess('domainReports()');
        return this.privateClient.domainReports();
    };
    Client.prototype.domainRequests = function () {
        this.requirePrivateAccess('domainRequests()');
        return this.privateClient.domainRequests();
    };
    Client.prototype.domainRooms = function () {
        this.requirePrivateAccess('domainRooms()');
        return this.privateClient.domainRooms();
    };
    Client.prototype.domainURLs = function () {
        this.requirePrivateAccess('domainURLs()');
        return this.privateClient.domainURLs();
    };
    Client.prototype.groups = function () {
        this.requirePrivateAccess('groups()');
        return this.privateClient.groups();
    };
    Client.prototype.groupBatch = function () {
        this.requirePrivateAccess('groupBatch()');
        return this.privateClient.groupBatch();
    };
    Client.prototype.groupCodes = function () {
        this.requirePrivateAccess('groupCodes()');
        return this.privateClient.groupCodes();
    };
    Client.prototype.ips = function () {
        this.requirePrivateAccess('ips()');
        return this.privateClient.ips();
    };
    Client.prototype.reports = function () {
        this.requirePrivateAccess('reports()');
        return this.privateClient.reports();
    };
    Client.prototype.roomReports = function () {
        this.requirePrivateAccess('roomReports()');
        return this.privateClient.roomReports();
    };
    Client.prototype.roomSessions = function () {
        this.requirePrivateAccess('roomSessions()');
        return this.privateClient.roomSessions();
    };
    /**
     * Access session resources (requires private key)
     * @returns Resource instance for session operations
     * @throws {CrowdHandlerError} When no private key is configured
     *
     * @example
     * const sessions = await client.sessions().get();
     * const session = await client.sessions().get('ses_123');
     */
    Client.prototype.sessions = function () {
        this.requirePrivateAccess('sessions()');
        return this.privateClient.sessions();
    };
    Client.prototype.templates = function () {
        this.requirePrivateAccess('templates()');
        return this.privateClient.templates();
    };
    // ===== Internal Methods =====
    /**
     * Get the internal PublicClient instance (used by Gatekeeper)
     */
    Client.prototype.getPublicClient = function () {
        return this.publicClient;
    };
    /**
     * Check if private API access is available
     */
    Client.prototype.hasPrivateAPIAccess = function () {
        return this.hasPrivateAccess;
    };
    // ===== Helper Methods =====
    Client.prototype.requirePrivateAccess = function (method) {
        if (!this.hasPrivateAccess) {
            throw createError.missingPrivateKey(method);
        }
    };
    return Client;
}());

var BrowserHandler = /** @class */ (function () {
    function BrowserHandler() {
    }
    BrowserHandler.prototype.getCookies = function () {
        return document.cookie;
    };
    BrowserHandler.prototype.getHost = function () {
        return window.location.host;
    };
    BrowserHandler.prototype.getProtocol = function () {
        return window.location.protocol;
    };
    BrowserHandler.prototype.getPath = function () {
        if (!window.location.search) {
            return window.location.pathname;
        }
        else {
            return "".concat(window.location.pathname).concat(window.location.search);
        }
    };
    BrowserHandler.prototype.getAbsoluteUri = function () {
        return window.location.href;
    };
    BrowserHandler.prototype.setCookie = function (value, cookieName, domain) {
        if (cookieName === void 0) { cookieName = "crowdhandler"; }
        var cookieOptions = {
            path: "/",
            secure: true, // cookie will only be sent over HTTPS
        };
        // Add domain if provided
        if (domain) {
            cookieOptions.domain = domain;
        }
        document.cookie = "".concat(cookieName, "=").concat(value, "; ").concat(Object.keys(cookieOptions)
            .map(function (key) { return "".concat(key, "=").concat(cookieOptions[key]); })
            .join("; "));
    };
    BrowserHandler.prototype.getLocalStorageItem = function (key) {
        return localStorage.getItem(key);
    };
    BrowserHandler.prototype.setLocalStorageItem = function (key, value) {
        localStorage.setItem(key, value);
    };
    BrowserHandler.prototype.redirect = function (url) {
        window.location.href = url;
    };
    return BrowserHandler;
}());

var LambdaRequestHandler = /** @class */ (function () {
    function LambdaRequestHandler(event /*context: any, callback: any*/) {
        this.request = event;
    }
    LambdaRequestHandler.prototype.getHeader = function (headername) {
        var headers = this.request.headers;
        var headerValue = headers[headername.toLowerCase()];
        if (!headerValue) {
            return "";
        }
        return headerValue[0].value;
    };
    LambdaRequestHandler.prototype.getCookies = function () {
        var headers = this.request.headers;
        var cookies = headers.cookie;
        if (!cookies) {
            return "";
        }
        return cookies[0].value;
    };
    LambdaRequestHandler.prototype.getHost = function () {
        return this.request.headers.host[0].value;
    };
    LambdaRequestHandler.prototype.getProtocol = function () {
        return this.request.headers["cloudfront-forwarded-proto"][0].value;
    };
    LambdaRequestHandler.prototype.getPath = function () {
        if (!this.request.querystring) {
            return this.request.uri;
        }
        else {
            return "".concat(this.request.uri, "?").concat(this.request.querystring);
        }
    };
    LambdaRequestHandler.prototype.getAbsoluteUri = function () {
        var protocol = this.getProtocol();
        var host = this.getHost();
        var path = this.getPath();
        return "".concat(protocol, "://").concat(host).concat(path);
    };
    LambdaRequestHandler.prototype.getUserHostAddress = function () {
        return this.request.clientIp;
    };
    LambdaRequestHandler.prototype.setHeader = function (headerName, headerValue) {
        this.request.headers[headerName] = [
            {
                key: headerName,
                value: headerValue,
            },
        ];
    };
    LambdaRequestHandler.prototype.redirect = function (url) {
        var response = {
            status: "302",
            statusDescription: "Found",
            headers: {
                location: [
                    {
                        key: "Location",
                        value: url,
                    },
                ],
                /*"set-cookie": [
                    {
                      key: "Set-Cookie",
                      value: `crowdhandler=${token}; path=/; Secure; HttpOnly`,
                    },
                  ],*/
                "cache-control": [
                    {
                        key: "Cache-Control",
                        value: "no-cache, no-store, must-revalidate",
                    },
                ],
                expires: [
                    {
                        key: "Expires",
                        value: "Fri, 01 Jan 1970 00:00:00 GMT",
                    },
                ],
                pragma: [
                    {
                        key: "Pragma",
                        value: "no-cache",
                    },
                ],
            },
        };
        return response;
    };
    return LambdaRequestHandler;
}());

var LambdaResponseHandler = /** @class */ (function () {
    function LambdaResponseHandler(requestEvent, responseEvent) {
        // Handle data in a Lambda@Edge environment
        this.request = requestEvent;
        this.response = responseEvent;
    }
    LambdaResponseHandler.prototype.getHeader = function (headername) {
        var headers = this.request.headers;
        var headerValue = headers[headername.toLowerCase()];
        if (!headerValue) {
            return "";
        }
        return headerValue[0].value;
    };
    LambdaResponseHandler.prototype.getHost = function () {
        return this.request.headers.host[0].value;
    };
    LambdaResponseHandler.prototype.getProtocol = function () {
        return this.request.headers["cloudfront-forwarded-proto"][0].value;
    };
    LambdaResponseHandler.prototype.getPath = function () {
        return this.request.uri;
    };
    LambdaResponseHandler.prototype.setCookie = function (value, cookieName, domain) {
        if (cookieName === void 0) { cookieName = "crowdhandler"; }
        var cookieOptions = {
            path: "/",
            secure: true, // cookie will only be sent over HTTPS
        };
        // Add domain if provided
        if (domain) {
            cookieOptions.domain = domain;
        }
        // Append cookie to response header
        var cookieHeader = "".concat(cookieName, "=").concat(value, "; ").concat(Object.keys(cookieOptions)
            .map(function (key) { return "".concat(key, "=").concat(cookieOptions[key]); })
            .join("; "));
        var setCookieHeader = this.response.headers["set-cookie"] || [];
        setCookieHeader.push({ key: "Set-Cookie", value: cookieHeader });
        this.response.headers["set-cookie"] = setCookieHeader;
        return this.response;
    };
    return LambdaResponseHandler;
}());

var NodeJSHandler = /** @class */ (function () {
    function NodeJSHandler(req, res) {
        // Handle data in a non-Lambda environment
        this.request = req;
        this.response = res;
    }
    NodeJSHandler.prototype.getHeader = function (headername) {
        var headerValue = this.request.header(headername);
        if (!headerValue) {
            return "";
        }
        return headerValue;
    };
    NodeJSHandler.prototype.getCookies = function () {
        return this.request.get("cookie");
    };
    NodeJSHandler.prototype.getHost = function () {
        return this.request.get("host");
    };
    NodeJSHandler.prototype.getProtocol = function () {
        return this.request.protocol;
    };
    NodeJSHandler.prototype.getPath = function () {
        return this.request.originalUrl;
    };
    NodeJSHandler.prototype.getAbsoluteUri = function () {
        return (this.request.protocol +
            "://" +
            this.request.get("host") +
            this.request.originalUrl);
    };
    NodeJSHandler.prototype.getUserHostAddress = function () {
        return this.request.ip;
    };
    NodeJSHandler.prototype.setCookie = function (value, cookieName, domain) {
        if (cookieName === void 0) { cookieName = "crowdhandler"; }
        var cookieOptions = {
            path: "/",
            secure: true, // cookie will only be sent over HTTPS
        };
        // Add domain if provided
        if (domain) {
            cookieOptions.domain = domain;
        }
        //Append cookie to response header
        return this.response.setHeader("Set-Cookie", "".concat(cookieName, "=").concat(value, "; ").concat(Object.keys(cookieOptions)
            .map(function (key) { return "".concat(key, "=").concat(cookieOptions[key]); })
            .join("; ")));
    };
    NodeJSHandler.prototype.redirect = function (url) {
        this.response.setHeader("Cache-Control", "no-cache, no-store, max-age=0");
        this.response.setHeader("Pragma", "no-cache");
        this.response.setHeader("Expires", 0);
        this.response.setHeader("Location", url);
        this.response.statusCode = 302;
        return this.response.end();
    };
    return NodeJSHandler;
}());

//Create a base class that will act as a switch depending on the environment
var RequestContext = /** @class */ (function () {
    //constructor(event: CloudFrontEvent, req?: any, res?: any) {
    function RequestContext(params) {
        var _a;
        //Lambda@Edge event
        if (params && params.lambdaEvent) {
            //Create a switch based on the event type
            switch ((_a = params.lambdaEvent) === null || _a === void 0 ? void 0 : _a.Records[0].cf.config.eventType) {
                case "viewer-request":
                case "origin-request":
                    //update the event type to be a CloudFrontRequestEvent
                    var requestEvent = params.lambdaEvent;
                    return new LambdaRequestHandler(requestEvent.Records[0].cf.request);
                case "viewer-response":
                case "origin-response":
                    //update the event type to be a CloudFrontResponseEvent
                    var responseEvent = params.lambdaEvent;
                    return new LambdaResponseHandler(responseEvent.Records[0].cf.request, responseEvent.Records[0].cf.response);
            }
            //NodeJS HTTP request
        }
        else if (params && params.request && params.response) {
            return new NodeJSHandler(params.request, params.response);
            //Default to Browser request
        }
        else {
            return new BrowserHandler();
        }
    }
    return RequestContext;
}());

function ignoredPatternsCheck(path, patterns) {
    //Handle static file extensions
    var result = patterns.test(path);
    return result;
}

// Lite Validator types
var RoomConfig = zod.z.object({
    domain: zod.z.string(),
    urlPattern: zod.z.string().optional(),
    patternType: zod.z.enum(['regex', 'contains', 'all']).optional(),
    queueActivatesOn: zod.z.number().optional(),
    slug: zod.z.string(),
    timeout: zod.z.number().optional()
});
var RoomsConfig = zod.z.array(RoomConfig);
//Gatekeeper Options
zod.z.object({
    debug: zod.z.boolean().optional(),
    fallbackSlug: zod.z.string().optional(),
    mode: zod.z.string().optional(),
    timeout: zod.z.number().optional(),
    trustOnFail: zod.z.boolean().optional(),
    cookieName: zod.z.string().optional(),
    liteValidator: zod.z.boolean().optional(),
    roomsConfig: RoomsConfig.optional(),
    waitingRoom: zod.z.boolean().optional(),
});
zod.z.object({
    publicKey: zod.z.string(),
    privateKey: zod.z.string().optional(),
});
zod.z
    .object({
    "ch-code": zod.z.string().optional(),
    "ch-id": zod.z.string().optional(),
    "ch-id-signature": zod.z.string().optional(),
    "ch-public-key": zod.z.string().optional(),
    "ch-requested": zod.z.string().optional(),
    "ch-token": zod.z.string().optional(),
})
    .catchall(zod.z.any());
var SpecialParametersObject = zod.z.object({
    chCode: zod.z.string(),
    chID: zod.z.string(),
    chIDSignature: zod.z.string(),
    chPublicKey: zod.z.string(),
    chRequested: zod.z.string(),
});
// Request configuration for session status API calls
zod.z.object({
    agent: zod.z.string().optional(),
    ip: zod.z.string().optional(),
    lang: zod.z.string().optional(),
    url: zod.z.string().optional(),
    slug: zod.z.string().optional(),
    // Allow custom parameters to be passed through
    custom: zod.z.record(zod.z.any()).optional(),
});
zod.z.object({
    targetURL: zod.z.string(),
    specialParameters: SpecialParametersObject,
});
zod.z
    .object({
    hostname: zod.z.string(),
    path: zod.z.string(),
})
    .catchall(zod.z.any());
//Cookie object structure validation
var CookieObject = zod.z
    .object({
    tokens: zod.z.array(zod.z.any()),
    deployment: zod.z.string().optional(),
})
    .catchall(zod.z.any());
var LocalStorageObject = zod.z.object({
    countdown: zod.z.record(zod.z.unknown()),
    positions: zod.z.record(zod.z.unknown()),
    token: zod.z.record(zod.z.string()),
});
zod.z.object({
    storageName: zod.z.string(),
    localStorageValue: zod.z.string(),
});
//Response structure validation
var RoomMetaObject = zod.z
    .object({
    domain: zod.z.string().nullable(),
    patternType: zod.z.string().nullable(),
    queueActivatesOn: zod.z.string().nullable(),
    slug: zod.z.string().nullable(),
    status: zod.z.boolean().nullable(),
    timeout: zod.z.number().nullable(),
})
    .catchall(zod.z.any());
zod.z.array(zod.z.object({
    gen: zod.z.string(),
    sig: zod.z.string(),
}));
zod.z.object({
    expiration: zod.z.nullable(zod.z.boolean()),
    success: zod.z.nullable(zod.z.boolean()),
});
zod.z.object({
    chIDSignature: zod.z.string().optional(),
    crowdhandlerCookieValue: CookieObject.optional(),
});
zod.z.object({
    //object can contain anything and we don't know any of the possible values
    crowdhandlerCookieValue: CookieObject.optional(),
    chID: zod.z.string().optional(),
    localStorageValue: LocalStorageObject.optional(),
    simpleCookieValue: zod.z.string().optional(),
});
zod.z.object({
    token: zod.z.string(),
    touched: zod.z.number(),
    touchedSig: zod.z.string(),
    signatures: zod.z.array(zod.z.any()),
});
zod.z.object({
    tokenDatestamp: zod.z.number(),
    tokenDatestampSignature: zod.z.string(),
    tokenSignature: zod.z.string(),
    tokenSignatureGenerated: zod.z.string(),
    tokenSignatures: zod.z.array(zod.z.any()),
    tokenValue: zod.z.string(),
});
// Custom parameters that can be passed to validateRequest
zod.z.object({
    custom: zod.z.record(zod.z.any()).optional(),
});
zod.z.object({
    promoted: zod.z.boolean(),
    stripParams: zod.z.boolean(),
    setCookie: zod.z.boolean(),
    cookieValue: zod.z.string().optional(),
    setLocalStorage: zod.z.boolean(),
    localStorageValue: zod.z.string().optional(),
    responseID: zod.z.string().optional(),
    slug: zod.z.string().optional(),
    targetURL: zod.z.string().optional(),
    deployment: zod.z.string().optional(),
    hash: zod.z.string().nullable().optional(),
    token: zod.z.string().optional(),
    requested: zod.z.string().optional(),
    liteValidatorRedirect: zod.z.boolean().optional(),
    liteValidatorUrl: zod.z.string().optional(),
    domain: zod.z.string().optional(),
});
var HttpErrorWrapper = zod.z.object({
    result: zod.z.object({
        error: zod.z.string().nullable(),
        status: zod.z.number().nullable(),
    }),
});
zod.z.object({
    result: zod.z
        .object({
        hash: zod.z.string().nullable().optional(),
        promoted: zod.z.number().nullable(),
        status: zod.z.number().nullable(),
        slug: zod.z.string().nullable().optional(),
        token: zod.z.string().nullable().optional(),
        urlRedirect: zod.z.string().nullable().optional(),
        requested: zod.z.string().nullable().optional(),
    })
        .catchall(zod.z.any()),
});
var RecordPerformanceOptions = zod.z.object({
    statusCode: zod.z.number().optional().default(200),
    sample: zod.z.number().optional().default(0.2),
    overrideElapsed: zod.z.number().optional(),
    responseID: zod.z.string().optional(),
});
// Mode constants
var Modes = {
    FULL: 'full',
    HYBRID: 'hybrid',
    CLIENTSIDE: 'clientside',
    AUTO: 'auto'
};

var ConfigParse = /** @class */ (function () {
    function ConfigParse(config, host, path, patterns) {
        this.roomMeta = {
            domain: null,
            patternType: null,
            queueActivatesOn: null,
            slug: null,
            status: false,
            timeout: null,
        };
        this.config = config;
        this.host = host;
        this.path = path;
        this.patterns = patterns;
    }
    ConfigParse.prototype.patternEvaulation = function (item) {
        switch (item.patternType) {
            case "regex":
                var regex = new RegExp(item.urlPattern);
                return regex.test(this.path);
            case "contains":
                var contains = item.urlPattern;
                return this.path.includes(contains);
            case "all":
                return true;
        }
    };
    ConfigParse.prototype.parse = function () {
        var _this = this;
        var staticAsset = ignoredPatternsCheck(this.path, this.patterns);
        if (staticAsset) {
            return RoomMetaObject.parse(this.roomMeta);
        }
        var filteredResults;
        filteredResults = this.config.filter(function (item) {
            if (item.domain === "https://".concat(_this.host)) {
                return item;
            }
        });
        for (var _i = 0, filteredResults_1 = filteredResults; _i < filteredResults_1.length; _i++) {
            var item = filteredResults_1[_i];
            if (this.patternEvaulation(item) === true) {
                //Populate the roomMeta object.
                //Use slug as a guard to make sure if we've already found a match we don't override it with weaker ones as we loop.
                if (this.roomMeta.slug === null) {
                    this.roomMeta.domain = item.domain;
                    this.roomMeta.patternType = item.patternType;
                    this.roomMeta.queueActivatesOn = item.queueActivatesOn;
                    this.roomMeta.slug = item.slug;
                    this.roomMeta.status = true;
                    this.roomMeta.timeout = item.timeout;
                }
            }
        }
        return RoomMetaObject.parse(this.roomMeta);
    };
    return ConfigParse;
}());

var ProcessURL = /** @class */ (function () {
    function ProcessURL(request, debug) {
        if (debug === void 0) { debug = false; }
        this.host = request.getHost();
        this.path = request.getPath();
        this.specialParameters = {
            chCode: "",
            chID: "",
            chIDSignature: "",
            chPublicKey: "",
            chRequested: "",
        };
        this.debug = debug;
    }
    ProcessURL.prototype.parseURL = function () {
        if (!this.host) {
            logger(this.debug, "warn", "No host found in request object.");
            return {
                targetURL: "",
                specialParameters: this.specialParameters,
            };
        }
        if (!this.path) {
            logger(this.debug, "warn", "No path found in request object.");
            return {
                targetURL: "",
                specialParameters: this.specialParameters,
            };
        }
        //Extract query string from this.path
        function extractQueryString(path) {
            var queryString;
            if (path.includes("?")) {
                queryString = path.split("?")[1];
            }
            return queryString;
        }
        function formatQueryString(q) {
            if (q) {
                return qparse__default["default"].parse(q, { sort: false });
            }
        }
        var unprocessedQueryString;
        unprocessedQueryString = extractQueryString(this.path);
        if (unprocessedQueryString) {
            this.queryString = formatQueryString(unprocessedQueryString);
        }
        //Destructure special params from query string if they are present
        var _a = this.queryString || {}, chCode = _a["ch-code"], chID = _a["ch-id"], chIDSignature = _a["ch-id-signature"], chPublicKey = _a["ch-public-key"], chRequested = _a["ch-requested"];
        //Override chCode value if the current one is unusable
        if (!chCode || chCode === "undefined" || chCode === "null") {
            chCode = "";
        }
        this.specialParameters.chCode = chCode;
        //Override chID value if the current one is unusable
        if (!chID || chID === "undefined" || chID === "null") {
            chID = "";
        }
        this.specialParameters.chID = chID;
        //Override chIDSignature value if the current one is unusable
        if (!chIDSignature ||
            chIDSignature === "undefined" ||
            chIDSignature === "null") {
            chIDSignature = "";
        }
        this.specialParameters.chIDSignature = chIDSignature;
        //Override chPublicKey value if the current one is unusable
        if (!chPublicKey || chPublicKey === "undefined" || chPublicKey === "null") {
            chPublicKey = "";
        }
        this.specialParameters.chPublicKey = chPublicKey;
        //Override chRequested value if the current one is unusable
        if (!chRequested || chRequested === "undefined" || chRequested === "null") {
            chRequested = "";
        }
        this.specialParameters.chRequested = chRequested;
        // Process the query string
        var processedQueryString = this.processQueryString(this.queryString);
        //We no longer need the query string in the path
        this.path = this.path.split("?")[0];
        if (processedQueryString) {
            this.targetURL = encodeURIComponent("https://".concat(this.host).concat(this.path, "?").concat(processedQueryString));
        }
        else {
            this.targetURL = encodeURIComponent("https://".concat(this.host).concat(this.path));
        }
        return {
            targetURL: this.targetURL,
            specialParameters: this.specialParameters,
        };
    };
    ProcessURL.prototype.processQueryString = function (queryString) {
        var processedQueryString;
        if (queryString) {
            delete queryString["ch-code"];
            delete queryString["ch-fresh"];
            delete queryString["ch-id"];
            delete queryString["ch-id-signature"];
            delete queryString["ch-public-key"];
            delete queryString["ch-requested"];
        }
        //Convert to usable querystring format
        if (queryString && Object.keys(queryString).length !== 0) {
            processedQueryString = qparse__default["default"].stringify(queryString, { sort: false });
        }
        else {
            processedQueryString = "";
        }
        return processedQueryString;
    };
    return ProcessURL;
}());

function generateSignature(input) {
    var hash = jsSha256.sha256(input);
    return hash;
}

var Signature = /** @class */ (function () {
    function Signature(activeConfig, hashedPrivateKey, signatureType, simpleSignature, complexSignature, token, cookie, requested, specialParameters, debug) {
        if (simpleSignature === void 0) { simpleSignature = []; }
        if (debug === void 0) { debug = false; }
        this.hashCandidates = [];
        this.validationResponse = {
            expiration: null,
            success: null,
        };
        this.activeConfig = activeConfig;
        this.hashedPrivateKey = hashedPrivateKey;
        this.signatureType = signatureType;
        this.complexSignature = complexSignature;
        this.simpleSignature = simpleSignature;
        this.token = token;
        this.cookie = cookie;
        this.requested = requested;
        this.specialParameters = specialParameters;
        this.debug = debug;
        if (this.requested) {
            this.specialParameters.chRequested = this.requested;
        }
        if (this.specialParameters.chRequested) {
            this.freshSignature = true;
        }
        else {
            this.freshSignature = false;
        }
    }
    Signature.prototype.getHashCandidates = function () {
        var generatedHistory = [];
        //Check that the cookie is in a format that we can work with
        try {
            if (this.cookie) {
                CookieObject.parse(this.cookie);
                if (!this.freshSignature && this.cookie) {
                    this.activeCookie = this.cookie.tokens[this.cookie.tokens.length - 1];
                }
            }
        }
        catch (error) {
            logger(this.debug, "error", error);
        }
        if (this.simpleSignature && this.simpleSignature.length > 0) {
            this.hashCandidates.unshift("".concat(this.hashedPrivateKey).concat(this.activeConfig.slug).concat(this.activeConfig.queueActivatesOn).concat(this.token).concat(this.specialParameters.chRequested));
        }
        else if (this.complexSignature && this.complexSignature.length > 0) {
            //If we have a signature that is active, we can use that to generate the hash
            for (var _i = 0, _a = this.complexSignature; _i < _a.length; _i++) {
                var item = _a[_i];
                generatedHistory.unshift(item.gen);
            }
            //Generate possible hash candidates
            for (var _b = 0, generatedHistory_1 = generatedHistory; _b < generatedHistory_1.length; _b++) {
                var item = generatedHistory_1[_b];
                this.hashCandidates.push("".concat(this.hashedPrivateKey).concat(this.activeConfig.slug).concat(this.activeConfig.queueActivatesOn).concat(this.token).concat(item));
            }
        }
        else {
            this.validationResponse.expiration = false;
            this.validationResponse.success = false;
            return;
        }
    };
    Signature.prototype.hashValidation = function () {
        if (this.freshSignature) {
            var requiredHash_1 = generateSignature(this.hashCandidates[0]);
            if (this.simpleSignature.some(function (item) { return item === requiredHash_1; }) === true) {
                this.matchedSignature = requiredHash_1;
            }
        }
        else if (this.complexSignature && this.complexSignature.length > 0) {
            var _loop_1 = function (hash) {
                var requiredHash_2 = generateSignature(hash);
                if (this_1.complexSignature.some(function (item) { return item.sig === requiredHash_2; }) ===
                    true) {
                    this_1.matchedSignature = requiredHash_2;
                    return "break";
                }
            };
            var this_1 = this;
            for (var _i = 0, _a = this.hashCandidates; _i < _a.length; _i++) {
                var hash = _a[_i];
                var state_1 = _loop_1(hash);
                if (state_1 === "break")
                    break;
            }
        }
        //No signature matches found. Validation failed.
        if (!this.matchedSignature) {
            this.validationResponse.expiration = false;
            this.validationResponse.success = false;
            return;
        }
    };
    Signature.prototype.hashExpiration = function () {
        function minutesSinceTokenCreated(datestamp) {
            //UTC
            var currentDatestamp = new Date().getTime();
            //Time passed since creation time in minutes
            var minutesPassed = (currentDatestamp - datestamp) / 1000 / 60;
            //One decimal place
            minutesPassed = Math.round(minutesPassed * 10) / 10;
            return minutesPassed;
        }
        //This will only be true if we're dealing with a request that has recently been promoted from the waiting room or lite-validator.
        if (this.freshSignature && this.specialParameters.chRequested) {
            if (minutesSinceTokenCreated(Date.parse(this.specialParameters.chRequested)) < this.activeConfig.timeout) {
                this.validationResponse.expiration = false;
                this.validationResponse.success = true;
                return;
            }
        }
        else if (this.activeCookie &&
            this.activeCookie.touchedSig ===
                generateSignature("".concat(this.hashedPrivateKey).concat(this.activeCookie.touched)) &&
            minutesSinceTokenCreated(this.activeCookie.touched) <
                this.activeConfig.timeout) {
            this.validationResponse.expiration = false;
            this.validationResponse.success = true;
            return;
        }
        else {
            //catch all
            this.validationResponse.expiration = true;
            this.validationResponse.success = false;
            return;
        }
    };
    Signature.prototype.validateSignature = function () {
        try {
            this.getHashCandidates();
            if (this.validationResponse.success !== null) {
                return this.validationResponse;
            }
        }
        catch (error) {
            logger(this.debug, "error", error);
            this.validationResponse.expiration = false;
            this.validationResponse.success = false;
            return this.validationResponse;
        }
        try {
            this.hashValidation();
            if (this.validationResponse.success !== null) {
                return this.validationResponse;
            }
        }
        catch (error) {
            logger(this.debug, "error", error);
            this.validationResponse.expiration = false;
            this.validationResponse.success = false;
            return this.validationResponse;
        }
        try {
            this.hashExpiration();
            return this.validationResponse;
        }
        catch (error) {
            logger(this.debug, "error", error);
            this.validationResponse.expiration = false;
            this.validationResponse.success = false;
            return this.validationResponse;
        }
    };
    return Signature;
}());

var GenerateCookieObject = /** @class */ (function () {
    function GenerateCookieObject(tokenObjectProperties) {
        this.tokenDatestamp = tokenObjectProperties.tokenDatestamp;
        this.tokenDatestampSignature =
            tokenObjectProperties.tokenDatestampSignature;
        this.tokenSignature = tokenObjectProperties.tokenSignature;
        this.tokenSignatureGenerated =
            tokenObjectProperties.tokenSignatureGenerated;
        this.tokenSignatures = tokenObjectProperties.tokenSignatures;
        this.tokenValue = tokenObjectProperties.tokenValue;
    }
    GenerateCookieObject.prototype.signatureObject = function () {
        var signatureObj = {
            gen: this.tokenSignatureGenerated,
            sig: this.tokenSignature,
        };
        return signatureObj;
    };
    GenerateCookieObject.prototype.tokenObject = function () {
        var tokenObj = {
            token: this.tokenValue,
            touched: this.tokenDatestamp,
            touchedSig: this.tokenDatestampSignature,
            signatures: this.tokenSignatures,
        };
        return tokenObj;
    };
    return GenerateCookieObject;
}());

//Get source IP address of the request in node.js
//Response structure validation
zod.z
    .object({
    headers: zod.z.object({}).catchall(zod.z.any()),
})
    .catchall(zod.z.any());
function getIP(request) {
    var ip = request.getHeader("x-forwarded-for") || request.getUserHostAddress();
    if (ip.indexOf(",") > -1) {
        // If there are multiple IPs in the x-forwarded-for header,
        // get the client's IP address, not the proxy addresses
        var ips = ip.split(",");
        ip = ips[0].trim();
    }
    return ip;
}

//Response structure validation
zod.z
    .object({
    headers: zod.z.object({}).catchall(zod.z.any()),
})
    .catchall(zod.z.any());
function getLang(request) {
    var lang;
    var langStr = request.getHeader("accept-language");
    if (langStr) {
        lang = langStr;
    }
    return lang;
}

//Response structure validation
zod.z
    .object({
    headers: zod.z.object({}).catchall(zod.z.any()),
})
    .catchall(zod.z.any());
function getUserAgent(request) {
    var userAgent;
    var userAgentStr = request.getHeader("user-agent");
    if (userAgentStr) {
        userAgent = userAgentStr;
    }
    return userAgent;
}

//Create a class that will be used to create a timer
var Timer = /** @class */ (function () {
    //Create a constructor that will be used to initialize the timer
    function Timer() {
        //Initialize the timer
        this.timer = Date.now();
    }
    //Create a method that will be used to stop the timer
    Timer.prototype.elapsed = function () {
        //Stop the timer
        return Date.now() - this.timer;
    };
    return Timer;
}());

var Gatekeeper = /** @class */ (function () {
    function Gatekeeper(PublicClient, request, keyPair, options) {
        this.WAIT_URL = "https://wait.crowdhandler.com";
        this.ignore = /^((?!.*\?).*(\.(avi|css|eot|gif|ico|jpg|jpeg|js|json|mov|mp4|mpeg|mpg|og[g|v]|pdf|png|svg|ttf|txt|wmv|woff|woff2|xml))$)/;
        this.options = {
            debug: false,
            fallbackSlug: "",
            mode: "full",
            timeout: 5000,
            trustOnFail: true,
            waitingRoom: false,
        };
        this.cookies = [];
        this.simpleSignature = [];
        this.complexSignature = [];
        this.specialParameters = {
            chCode: "",
            chID: "",
            chIDSignature: "",
            chPublicKey: "",
            chRequested: "",
        };
        this.PublicClient = PublicClient;
        this.REQUEST = request;
        this.publicKey = keyPair.publicKey;
        this.privateKey = keyPair.privateKey;
        //Merge provided options with defaults
        this.options = Object.assign({}, this.options, options);
        // Set cookie name from options or use default
        this.STORAGE_NAME = this.options.cookieName || "crowdhandler";
        //Hash the private key if mode is set to hybrid
        //Check if privateKey is provided when mode is set to "hybrid"
        if (this.options.mode === "hybrid" &&
            (this.privateKey === undefined || this.privateKey === "")) {
            throw new Error("privateKey must be provided when mode is set to 'hybrid'");
        }
        if (this.options.mode === "hybrid" && this.privateKey !== undefined) {
            try {
                this.hashedPrivateKey = generateSignature(this.privateKey);
            }
            catch (error) {
                logger(this.options.debug, "Error generating private key hash: ", error);
            }
        }
        this.host = this.REQUEST.getHost();
        this.path = this.REQUEST.getPath();
        if (this.options.mode === "full" || this.options.mode === "hybrid") {
            this.ip = getIP(this.REQUEST);
            this.lang = getLang(this.REQUEST);
            this.agent = getUserAgent(this.REQUEST);
        }
        //Start the timer
        this.timer = new Timer();
        // Extract slug if this is a waiting room implementation
        if (this.options.waitingRoom) {
            this.extractSlugFromPath();
        }
    }
    //Set the host using your own method if you're not happy with the default
    /**
     * Override the request host for testing or special routing needs.
     *
     * @param {string} host - The host to use (e.g., 'example.com')
     */
    Gatekeeper.prototype.overrideHost = function (host) {
        this.host = host;
    };
    //Set the path using your own method if you're not happy with the default
    Gatekeeper.prototype.overridePath = function (path) {
        this.path = path;
    };
    //Set the IP using your own method if you're not happy with the default
    Gatekeeper.prototype.overrideIP = function (ip) {
        this.ip = ip;
    };
    //Set the language using your own method if you're not happy with the default
    Gatekeeper.prototype.overrideLang = function (lang) {
        this.lang = lang;
    };
    //Set the user agent using your own method if you're not happy with the default
    Gatekeeper.prototype.overrideUserAgent = function (agent) {
        this.agent = agent;
    };
    //Set the cookie using your own method if you're not happy with the default
    Gatekeeper.prototype.overrideCookie = function (cookie) {
        this.cookies = cookie;
    };
    /**
     * Overrides the default CrowdHandler waiting room with your custom URL.
     *
     * @param {string} url - The custom waiting room URL
     *
     * @example
     * // Redirect to your custom queue page
     * gatekeeper.overrideWaitingRoomUrl('https://mysite.com/custom-queue');
     */
    Gatekeeper.prototype.overrideWaitingRoomUrl = function (url) {
        this.WAIT_URL = url;
    };
    /* If you have your own regular expression for urls to ignore set it here
     * @param string $regExp Regular Expression
     */
    Gatekeeper.prototype.setIgnoreUrls = function (regExp) {
        this.ignore = regExp;
    };
    /*
     * Fetch the room config feed
     * @return object
     */
    Gatekeeper.prototype.getConfig = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, configParse, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.PublicClient.rooms().get()];
                    case 1:
                        response = _a.sent();
                        configParse = new ConfigParse(response.result, this.host, this.path, this.ignore);
                        result = configParse.parse();
                        this.activeConfig = RoomMetaObject.parse(result);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieves the current session status using GET call if a token is available, or POST call otherwise.
     * @param {object} customParams - Optional custom parameters to include in the API request
     * @returns {Promise<void>} A Promise that resolves when the method has completed.
     */
    Gatekeeper.prototype.getSessionStatus = function (customParams) {
        return __awaiter(this, void 0, void 0, function () {
            var requestConfig, url, _a, error_1, _b, error_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        requestConfig = {};
                        // Always include these if they exist
                        if (this.agent)
                            requestConfig.agent = this.agent;
                        if (this.ip)
                            requestConfig.ip = this.ip;
                        if (this.lang)
                            requestConfig.lang = this.lang;
                        // Include either slug OR url, but not both
                        if (this.slug) {
                            requestConfig.slug = this.slug;
                            logger(this.options.debug, "info", "Using slug in request: ".concat(this.slug));
                        }
                        else {
                            url = "https://".concat(this.host).concat(this.path);
                            requestConfig.url = url;
                            logger(this.options.debug, "info", "Using URL in request: ".concat(url));
                        }
                        // Include custom parameters if provided
                        if (customParams && Object.keys(customParams).length > 0) {
                            requestConfig.custom = customParams;
                            logger(this.options.debug, "info", "Including custom parameters: ".concat(JSON.stringify(customParams)));
                        }
                        if (!this.token) return [3 /*break*/, 5];
                        logger(this.options.debug, "info", "Token found, performing a session GET call.");
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        _a = this;
                        return [4 /*yield*/, this.PublicClient.requests().get(this.token, requestConfig)];
                    case 2:
                        _a.sessionStatus = _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _c.sent();
                        logger(this.options.debug, "error", "Session GET call failed with error: ".concat(error_1));
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 9];
                    case 5:
                        logger(this.options.debug, "info", "Token not found, performing a session POST call.");
                        _c.label = 6;
                    case 6:
                        _c.trys.push([6, 8, , 9]);
                        _b = this;
                        return [4 /*yield*/, this.PublicClient.requests().post(requestConfig)];
                    case 7:
                        _b.sessionStatus = _c.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        error_2 = _c.sent();
                        logger(this.options.debug, "error", "Session POST call failed with error: ".concat(error_2));
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Processes the URL from the request to extract the target URL and any special parameters.
     */
    Gatekeeper.prototype.processURL = function () {
        try {
            var processURLInstance = new ProcessURL(this.REQUEST);
            var result = processURLInstance.parseURL();
            if (result) {
                // If this is a waiting room implementation, check for url parameter
                if (this.options.waitingRoom) {
                    var urlFromQuery = this.extractUrlFromWaitingRoomQuery();
                    if (urlFromQuery) {
                        logger(this.options.debug, "info", "[WaitingRoom] Using url from query parameter: ".concat(urlFromQuery));
                        this.targetURL = urlFromQuery;
                        this.specialParameters = result.specialParameters;
                        return;
                    }
                    // If no url param, targetURL will be set from API response urlRedirect
                    logger(this.options.debug, "info", "[WaitingRoom] No url query parameter found, will use urlRedirect from API response");
                    this.targetURL = ""; // Empty until we get API response
                    this.specialParameters = result.specialParameters;
                    return;
                }
                // Standard behavior - use the current URL as targetURL
                this.targetURL = result.targetURL;
                this.specialParameters = result.specialParameters;
            }
            else {
                throw new Error("Failed to parse URL.");
            }
        }
        catch (error) {
            logger(this.options.debug, "error", "Error while processing URL: ".concat(error));
        }
    };
    /**
     * Extracts the signature from the given signature source.
     * @param signatureSource - The source from which to extract the signature.
     */
    Gatekeeper.prototype.getSignature = function (signatureSource) {
        try {
            if (signatureSource.chIDSignature) {
                // Simple signature case
                this.simpleSignature = [signatureSource.chIDSignature];
                this.signatureType = "simple";
            }
            else if (signatureSource.crowdhandlerCookieValue) {
                // Complex signature case
                this.cookieValue = CookieObject.parse(signatureSource.crowdhandlerCookieValue);
                // Assuming that the last token's signatures are needed
                this.complexSignature =
                    this.cookieValue.tokens[this.cookieValue.tokens.length - 1].signatures;
                this.signatureType = "complex";
            }
        }
        catch (error) {
            logger(this.options.debug, "error", "Failed to get signature: ".concat(error));
        }
    };
    /**
     * Extracts and sets the token from various sources (URL params, cookies, etc).
     * This is an internal method used during request validation.
     * @param options - The options for extracting the token.
     */
    Gatekeeper.prototype.extractToken = function (options) {
        var _a, _b, _c, _d;
        // Use option values if provided, else fall back to constructor values
        var chID = (_a = options === null || options === void 0 ? void 0 : options.chID) !== null && _a !== void 0 ? _a : this.specialParameters.chID;
        var crowdhandlerCookieValue = (_b = options === null || options === void 0 ? void 0 : options.crowdhandlerCookieValue) !== null && _b !== void 0 ? _b : this.cookieValue;
        (_c = options === null || options === void 0 ? void 0 : options.localStorageValue) !== null && _c !== void 0 ? _c : this.localStorageValue;
        var simpleCookieValue = (_d = options === null || options === void 0 ? void 0 : options.simpleCookieValue) !== null && _d !== void 0 ? _d : this.simpleCookieValue;
        if (chID) {
            logger(this.options.debug, "info", "chID parameter found");
            this.extractTokenFromChID(chID);
        }
        else if (crowdhandlerCookieValue && this.options.mode === "hybrid") {
            logger(this.options.debug, "info", "complex cookie found");
            this.extractTokenFromComplexCookie(crowdhandlerCookieValue);
        }
        else if (simpleCookieValue) {
            logger(this.options.debug, "info", "simple cookie found");
            this.extractTokenFromSimpleCookie(simpleCookieValue);
        }
        else {
            logger(this.options.debug, "info", "Token not found or invalid format");
        }
    };
    /**
     * Verifies if the given token is valid based on its format.
     * @param token - The token to be validated.
     * @returns True if the token is valid, false otherwise.
     */
    Gatekeeper.prototype.isValidToken = function (token) {
        var tokenPattern = /^tok.*/;
        return tokenPattern.test(token);
    };
    /**
     * Extracts and sets the token from the provided chID if it's valid.
     * @param chID - The chID to extract the token from.
     * @throws {Error} When the token format is invalid.
     */
    Gatekeeper.prototype.extractTokenFromChID = function (chID) {
        if (!this.isValidToken(chID)) {
            throw new Error("Invalid token format: ".concat(chID));
        }
        this.token = chID;
    };
    /**
     * Extracts and sets the token from a complex cookie value if it's valid.
     * @param crowdhandlerCookieValue - The crowdhandler cookie value to extract the token from.
     * @throws {Error} When the token format is invalid.
     */
    Gatekeeper.prototype.extractTokenFromComplexCookie = function (crowdhandlerCookieValue) {
        try {
            this.cookieValue = CookieObject.parse(crowdhandlerCookieValue);
            // Ensure tokens array is not empty
            if (this.cookieValue.tokens.length === 0) {
                throw new Error("No tokens found in the cookie value.");
            }
            var extractedToken = this.cookieValue.tokens[this.cookieValue.tokens.length - 1].token;
            if (!this.isValidToken(extractedToken)) {
                throw new Error("Invalid token format: ".concat(extractedToken));
            }
            this.token = extractedToken;
        }
        catch (error) {
            logger(this.options.debug, "error", "Failed to extract token from complex cookie: ".concat(error));
        }
    };
    /**
     * Extracts and sets the token from a simple cookie value if it's valid.
     * @param simpleCookieValue - The simple cookie value to extract the token from.
     * @throws {Error} When the token format is invalid.
     */
    Gatekeeper.prototype.extractTokenFromSimpleCookie = function (simpleCookieValue) {
        try {
            if (!this.isValidToken(simpleCookieValue)) {
                throw new Error("Invalid token format: ".concat(simpleCookieValue));
            }
            this.token = simpleCookieValue;
        }
        catch (error) {
            logger(this.options.debug, "error", "Failed to extract token from simple cookie: ".concat(error));
        }
    };
    /**
     * Extracts the slug from the URL path when in waiting room mode.
     * If the first path segment is 'ch', the slug is in the second segment.
     * Otherwise, the slug is the first path segment.
     */
    Gatekeeper.prototype.extractSlugFromPath = function () {
        try {
            // Remove leading slash and query string, then split by /
            var pathWithoutQuery = this.path.split('?')[0];
            var cleanPath = pathWithoutQuery.startsWith('/') ? pathWithoutQuery.slice(1) : pathWithoutQuery;
            var segments = cleanPath.split('/').filter(function (s) { return s.length > 0; });
            if (segments.length === 0) {
                logger(this.options.debug, "info", "[WaitingRoom] No path segments found for slug extraction");
                return;
            }
            var slugIndex = 0;
            // If first segment is 'ch', slug is in the second segment
            if (segments[0] === 'ch') {
                slugIndex = 1;
                if (segments.length <= 1) {
                    logger(this.options.debug, "info", "[WaitingRoom] Path starts with /ch/ but no slug segment found");
                    return;
                }
            }
            this.slug = segments[slugIndex];
            logger(this.options.debug, "info", "[WaitingRoom] Extracted slug from path: ".concat(this.slug));
        }
        catch (error) {
            logger(this.options.debug, "error", "[WaitingRoom] Failed to extract slug from path: ".concat(error));
        }
    };
    /**
     * Extracts the target URL from query parameters when in waiting room mode.
     * Returns the encoded URL value if found, otherwise returns empty string.
     */
    Gatekeeper.prototype.extractUrlFromWaitingRoomQuery = function () {
        try {
            // Get the full URL including query parameters
            var fullPath = this.REQUEST.getPath();
            if (!fullPath || !fullPath.includes('?')) {
                return "";
            }
            // Extract query string
            var queryString = fullPath.split('?')[1];
            if (!queryString) {
                return "";
            }
            // Parse query parameters manually to avoid automatic decoding
            // URLSearchParams.get() automatically decodes values, which we don't want
            var urlMatch = queryString.match(/(?:^|&)url=([^&]*)/);
            if (urlMatch && urlMatch[1]) {
                var urlParam = urlMatch[1];
                // The URL parameter value is encoded, return as-is without decoding
                logger(this.options.debug, "info", "[WaitingRoom] Found url parameter (encoded): ".concat(urlParam));
                return urlParam;
            }
            return "";
        }
        catch (error) {
            logger(this.options.debug, "error", "[WaitingRoom] Failed to extract url from query: ".concat(error));
            return "";
        }
    };
    /**
     * Retrieves the token from local storage if possible.
     * @throws {Error} When the storage key or local storage value is undefined.
     */
    Gatekeeper.prototype.getTokenFromLocalStorage = function () {
        try {
            if (!this.storageKey) {
                throw new Error("Storage key is not defined.");
            }
            if (!this.localStorageValue || !this.localStorageValue.token) {
                throw new Error("Local storage value is not defined or does not contain a token.");
            }
            var token = this.localStorageValue.token[this.storageKey];
            if (!this.isValidToken(token)) {
                throw new Error("Invalid token format: ".concat(token));
            }
            this.token = token;
        }
        catch (error) {
            logger(this.options.debug, "error", "Failed to get token from local storage: ".concat(error));
        }
    };
    /**
     * Validates the signature.
     *
     * @returns the result of signature validation
     */
    Gatekeeper.prototype.validateSignature = function () {
        var signature = new Signature(this.activeConfig, this.hashedPrivateKey, this.signatureType, this.simpleSignature, this.complexSignature, this.token, this.cookieValue, this.requested, this.specialParameters, this.options.debug);
        return signature.validateSignature();
    };
    /**
     * Convenience method that handles the complete redirect flow for non-promoted users.
     * Automatically manages cookies and redirects.
     *
     * @returns {string} Success message after redirect
     * @throws {Error} If unable to determine redirect URL
     *
     * @example
     * if (!result.promoted) {
     *   return gatekeeper.redirectIfNotPromoted();
     * }
     */
    Gatekeeper.prototype.redirectIfNotPromoted = function () {
        try {
            var redirectUrl = this.getRedirectUrl();
            if (!redirectUrl) {
                throw new Error("Unable to determine redirect URL");
            }
            return this.REQUEST.redirect(redirectUrl);
        }
        catch (error) {
            logger(this.options.debug, "error", "Failed to redirect: ".concat(error));
            return "Redirect failed: ".concat(error.message);
        }
    };
    /**
     * Redirects promoted users from waiting room to target site with fresh CrowdHandler parameters.
     * Used when waitingRoom option is true and user is promoted.
     *
     * @returns {string} Success message after redirect
     * @throws {Error} If unable to determine redirect URL
     *
     * @example
     * if (result.promoted && config.waitingRoom) {
     *   return gatekeeper.redirectIfPromoted();
     * }
     */
    Gatekeeper.prototype.redirectIfPromoted = function () {
        var _a, _b, _c, _d, _e, _f;
        try {
            // Get target URL from either this.targetURL or API response
            var destinationUrl = this.targetURL;
            // If no targetURL and we have session status with urlRedirect, use that
            if (!destinationUrl && ((_b = (_a = this.sessionStatus) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b.urlRedirect)) {
                destinationUrl = encodeURIComponent(this.sessionStatus.result.urlRedirect);
                logger(this.options.debug, "info", "[WaitingRoom] Using urlRedirect from API: ".concat(this.sessionStatus.result.urlRedirect));
            }
            if (!destinationUrl) {
                throw new Error("Unable to determine destination URL for promoted redirect");
            }
            // Decode once to get the actual URL
            var decodedURL = decodeURIComponent(destinationUrl);
            // Parse URL to handle parameters properly
            var urlParts = decodedURL.split('?');
            var baseUrl = urlParts[0];
            var queryString = urlParts[1] || '';
            // Parse existing parameters while preserving their values
            var existingParams = [];
            if (queryString) {
                var params = queryString.split('&');
                for (var _i = 0, params_1 = params; _i < params_1.length; _i++) {
                    var param = params_1[_i];
                    var key = param.split('=')[0];
                    // Skip CrowdHandler parameters
                    if (!['ch-id', 'ch-id-signature', 'ch-requested', 'ch-code', 'ch-fresh'].includes(key)) {
                        existingParams.push(param);
                    }
                }
            }
            // Build new CrowdHandler parameters
            var chParams = [
                "ch-id=".concat(encodeURIComponent(this.token || '')),
                "ch-id-signature=".concat(encodeURIComponent(((_d = (_c = this.sessionStatus) === null || _c === void 0 ? void 0 : _c.result) === null || _d === void 0 ? void 0 : _d.hash) || '')),
                "ch-requested=".concat(encodeURIComponent(((_f = (_e = this.sessionStatus) === null || _e === void 0 ? void 0 : _e.result) === null || _f === void 0 ? void 0 : _f.requested) || this.requested || this.specialParameters.chRequested || '')),
                "ch-code=".concat(encodeURIComponent(this.specialParameters.chCode || '')),
                "ch-fresh=true"
            ];
            // Construct final URL
            var allParams = existingParams.concat(chParams);
            var finalUrl = baseUrl + (allParams.length > 0 ? '?' + allParams.join('&') : '');
            logger(this.options.debug, "info", "[WaitingRoom] Redirecting promoted user to: ".concat(finalUrl));
            return this.REQUEST.redirect(finalUrl);
        }
        catch (error) {
            logger(this.options.debug, "error", "Failed to redirect promoted user: ".concat(error));
            return "Redirect failed: ".concat(error.message);
        }
    };
    /**
     * Redirects the request to the decoded target URL.
     *
     * @param targetURL The target URL to redirect to.
     * @throws {Error} If decoding or redirecting fails.
     */
    /**
     * Removes CrowdHandler tracking parameters from URLs. Use when result.stripParams is true
     * to keep URLs clean.
     *
     * @param {string} targetURL - The encoded URL to clean and redirect to (from result.targetURL)
     * @throws {Error} If the decoded URL is not a valid HTTP(S) URL
     *
     * @example
     * if (result.stripParams) {
     *   return gatekeeper.redirectToCleanUrl(result.targetURL);
     * }
     */
    Gatekeeper.prototype.redirectToCleanUrl = function (targetURL) {
        try {
            var decodedUrl = decodeURIComponent(targetURL);
            // If decodedUrl is not a valid URL, throw an error.
            if (!/^http[s]?:\/\/.*/.test(decodedUrl)) {
                throw new Error("Decoded URL is not a valid URL");
            }
            this.REQUEST.redirect(decodedUrl);
        }
        catch (error) {
            logger(this.options.debug, "error", "Failed to redirect to clean URL: ".concat(error));
            throw error;
        }
    };
    /**
     * Generates a redirect URL based on multiple fallback conditions.
     *
     * @throws {Error} If targetURL, token, or publicKey is missing or invalid.
     * @returns The generated redirect URL.
     */
    Gatekeeper.prototype.getRedirectUrl = function () {
        var _a, _b, _c;
        try {
            var slug = ((_b = (_a = this.sessionStatus) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b.slug) ||
                ((_c = this.activeConfig) === null || _c === void 0 ? void 0 : _c.slug) ||
                this.options.fallbackSlug ||
                "";
            logger(this.options.debug, "info", "Generating redirect URL with slug: ".concat(slug));
            logger(this.options.debug, "info", "Target URL: ".concat(this.targetURL));
            logger(this.options.debug, "info", "Token: ".concat(this.token));
            logger(this.options.debug, "info", "Public Key: ".concat(this.publicKey));
            var redirectUrl = "".concat(this.WAIT_URL, "/").concat(slug, "?url=").concat(this.targetURL, "&ch-code=&ch-id=").concat(this.token, "&ch-public-key=").concat(this.publicKey);
            logger(this.options.debug, "info", "Generated redirect URL: ".concat(redirectUrl));
            return redirectUrl;
        }
        catch (error) {
            logger(this.options.debug, "error", "Failed to generate redirect URL: ".concat(error));
            throw error;
        }
    };
    /**
     * Generates token and signature objects for cookies.
     *
     * @throws {Error} If token generation fails.
     */
    Gatekeeper.prototype.generateCookieObjects = function () {
        try {
            var tokenDatestamp = new Date().getTime();
            var signatureGenerated = "";
            // Prioritise API response data over parameter data.
            signatureGenerated = this.requested || this.specialParameters.chRequested;
            var cookieObject = new GenerateCookieObject({
                tokenDatestamp: tokenDatestamp,
                tokenDatestampSignature: generateSignature("".concat(this.hashedPrivateKey).concat(tokenDatestamp)),
                tokenSignature: this.simpleSignature[0],
                tokenSignatureGenerated: signatureGenerated,
                tokenSignatures: this.complexSignature,
                tokenValue: this.token,
            });
            this.cookieSignatureObject = cookieObject.signatureObject();
            this.cookieTokenObject = cookieObject.tokenObject();
        }
        catch (error) {
            logger(this.options.debug, "error", "Failed to generate cookie objects: ".concat(error));
            throw error;
        }
    };
    // //TODO: Convert to an independent class for full local storage functionality
    // /**
    //  * Updates the token in the local storage object.
    //  * If no local storage object exists, creates a new one.
    //  * @param token - The new token to update in local storage.
    //  */
    Gatekeeper.prototype.updateLocalStorageToken = function (token) {
        var _a;
        try {
            if (this.localStorageValue && this.storageKey) {
                // Update the existing LocalStorageObject token field.
                this.localStorageValue.token[this.storageKey] = token;
            }
            else if (this.storageKey) {
                // Create a new LocalStorageObject if it doesn't exist.
                this.localStorageValue = {
                    countdown: {},
                    positions: {},
                    token: (_a = {}, _a[this.storageKey] = token, _a),
                };
            }
        }
        catch (error) {
            logger(this.options.debug, "error", "Failed to update local storage token: ".concat(error));
        }
    };
    /**
     * Retrieves and processes cookies from request or override.
     */
    Gatekeeper.prototype.getCookie = function () {
        try {
            // Get cookies from request or override.
            var cookies = this.cookies.length === 0 ? this.REQUEST.getCookies() : this.cookies;
            // If no cookies, there is no further processing needed.
            if (!cookies) {
                logger(this.options.debug, "info", "No cookies found.");
                return;
            }
            // Split the cookies string into individual cookie strings.
            var cookieArray = cookies.split(";");
            for (var _i = 0, cookieArray_1 = cookieArray; _i < cookieArray_1.length; _i++) {
                var cookieStr = cookieArray_1[_i];
                var _a = cookieStr.trim().split("="), cookieName = _a[0], cookieValueParts = _a.slice(1);
                var cookieValue = cookieValueParts.join("=");
                // If this is the cookie we're interested in, process it.
                if (cookieName === this.STORAGE_NAME) {
                    if (this.options.mode === "hybrid") {
                        var decodedCookie = decodeURIComponent(cookieValue);
                        var processedCookie = JSON.parse(decodedCookie);
                        this.cookieValue = processedCookie;
                    }
                    else {
                        this.simpleCookieValue = cookieValue;
                    }
                }
            }
        }
        catch (error) {
            logger(this.options.debug, "error", "Failed to get or process cookies: ".concat(error));
        }
    };
    //TODO: Improve this method alongside refactor of validateRequestHybridMode
    Gatekeeper.prototype.generateCookie = function (tokens, deployment) {
        return {
            integration: "JSDK",
            tokens: tokens,
            deployment: deployment || "",
        };
    };
    /**
     * Detects if a domain pattern contains a wildcard and extracts the root domain for cookie setting
     * @param domainPattern - The domain pattern from room config (e.g., "https://*.example.com")
     * @returns Object with isWildcard flag and optional rootDomain for cookie
     */
    Gatekeeper.prototype.detectWildcardAndRoot = function (domainPattern) {
        // Check if there's a wildcard after https://
        var match = domainPattern.match(/^https:\/\/[^a-z0-9]*\*[^a-z0-9]*([a-z0-9].*)$/i);
        if (!match) {
            return { isWildcard: false };
        }
        // match[1] is everything from first alphanumeric onward
        var domainPart = match[1]; // e.g., "example.com" or "example.*"
        // Check if there's a wildcard at the end - can't use wildcard cookies for these
        if (domainPart.includes('*')) {
            logger(this.options.debug, "info", "Domain has trailing wildcard, cannot use root domain cookie");
            return { isWildcard: false };
        }
        // Extract root domain (last two parts for cookie domain)
        var parts = domainPart.split('.');
        var rootDomain = parts.length >= 2
            ? ".".concat(parts.slice(-2).join('.'))
            : ".".concat(domainPart);
        return {
            isWildcard: true,
            rootDomain: rootDomain
        };
    };
    /**
     * Sets the CrowdHandler session cookie. Always call this when result.setCookie is true
     * to maintain the user's queue position.
     *
     * @param {string} value - The cookie value to set (from result.cookieValue)
     * @param {string} domain - Optional domain pattern to determine cookie domain scope
     * @returns {boolean} True if the cookie was successfully set, false otherwise
     *
     * @example
     * if (result.setCookie) {
     *   gatekeeper.setCookie(result.cookieValue, result.domain);
     * }
     */
    Gatekeeper.prototype.setCookie = function (value, domain) {
        try {
            // Determine cookie domain if domain pattern is provided
            var cookieDomain = void 0;
            if (domain) {
                var _a = this.detectWildcardAndRoot(domain), isWildcard = _a.isWildcard, rootDomain = _a.rootDomain;
                if (isWildcard && rootDomain) {
                    cookieDomain = rootDomain;
                    logger(this.options.debug, "info", "Setting cookie with domain: ".concat(cookieDomain));
                }
            }
            // Set the cookie with the provided value and options
            this.REQUEST.setCookie(value, this.STORAGE_NAME, cookieDomain);
            return true;
        }
        catch (error) {
            logger(this.options.debug, "error", error);
            return false;
        }
    };
    /**
     * Set a local storage item.
     *
     * @param options - Optional. An object containing the storage name and the local storage value.
     *
     * @throws If an error occurs while setting the local storage item, an Error is thrown and caught, logged with the logger,
     * and the function returns false.
     *
     * @returns True if the local storage item was successfully set, false otherwise.
     */
    Gatekeeper.prototype.setLocalStorage = function (options) {
        try {
            // determine the name to use
            var nameToUse = (options === null || options === void 0 ? void 0 : options.storageName) || this.STORAGE_NAME;
            // determine the value to use
            var valueToUse = (options === null || options === void 0 ? void 0 : options.localStorageValue) || JSON.stringify(this.localStorageValue);
            // set the local storage item
            this.REQUEST.setLocalStorageItem(nameToUse, valueToUse);
            return true;
        }
        catch (error) {
            logger(this.options.debug, "error", error);
            return false;
        }
    };
    /**
     * Get a local storage item.
     *
     * @throws If an error occurs while getting or parsing the local storage item,
     * an Error is thrown and caught, logged with the logger, and the function returns null.
     *
     * @returns The value from local storage parsed as a LocalStorageObject, or null if an error occurs or if the item does not exist.
     */
    Gatekeeper.prototype.getLocalStorage = function () {
        try {
            var crowdhandler = localStorage.getItem(this.STORAGE_NAME);
            if (crowdhandler) {
                var localStorageValue = LocalStorageObject.parse(JSON.parse(crowdhandler));
                this.localStorageValue = localStorageValue; // still assign it to the class property if you need
                return localStorageValue;
            }
            logger(this.options.debug, "Info: No data found in local storage for key:", this.STORAGE_NAME);
            return null;
        }
        catch (error) {
            logger(this.options.debug, "Error reading from local storage:", error);
            return null;
        }
    };
    /**
     * Records performance metrics to help CrowdHandler optimize queue flow and capacity.
     *
     * @param {RecordPerformanceOptions} options - Optional performance recording options:
     * - `sample` {number} - Sample rate (0-1). Default: 0.2 (20% of requests)
     * - `statusCode` {number} - HTTP status code. Default: 200
     * - `overrideElapsed` {number} - Override elapsed time in ms
     * - `responseID` {string} - Specific response ID to record
     *
     * @example
     * // Simple usage (recommended)
     * await gatekeeper.recordPerformance();
     *
     * @example
     * // With custom options
     * await gatekeeper.recordPerformance({
     *   sample: 0.2,  // Sample 20% of requests
     *   statusCode: 200
     * });
     */
    Gatekeeper.prototype.recordPerformance = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var validatedOptions, statusCode, sample, overrideElapsed, responseID, lottery, currentResponseID, elapsed;
            return __generator(this, function (_a) {
                try {
                    validatedOptions = options
                        ? RecordPerformanceOptions.parse(options)
                        : {
                            statusCode: 200,
                            sample: 0.2,
                            overrideElapsed: undefined,
                            responseID: undefined, // no responseID
                        };
                    statusCode = validatedOptions.statusCode, sample = validatedOptions.sample, overrideElapsed = validatedOptions.overrideElapsed, responseID = validatedOptions.responseID;
                    lottery = Math.random();
                    currentResponseID = responseID || this.responseID;
                    // If there's no responseID or if the random number is higher than the sample rate, return early
                    if (!currentResponseID || lottery >= sample) {
                        return [2 /*return*/];
                    }
                    elapsed = overrideElapsed !== undefined ? overrideElapsed : this.timer.elapsed();
                    // Asynchronously send the performance data to CrowdHandler, no need to await the promise
                    this.PublicClient.responses().put(currentResponseID, {
                        httpCode: statusCode,
                        time: elapsed,
                    });
                }
                catch (error) {
                    logger(this.options.debug, "Error recording performance:", error);
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Extracts the creation date from a token's base60 encoded timestamp
     */
    Gatekeeper.prototype.tokenCreationDate = function (token) {
        var base60 = "0123456789ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz";
        var tok_meta = token.slice(4, 10);
        var year = base60.indexOf(tok_meta[0]);
        var month = base60.indexOf(tok_meta[1]) - 1;
        var day = base60.indexOf(tok_meta[2]);
        var hour = base60.indexOf(tok_meta[3]);
        var minute = base60.indexOf(tok_meta[4]);
        var second = base60.indexOf(tok_meta[5]);
        return Date.UTC(2000 + year, month, day, hour, minute, second);
    };
    /**
     * Checks if a token is older than 12 hours
     */
    Gatekeeper.prototype.isOldToken = function (token) {
        logger(this.options.debug, "info", "[Lite Validator] Checking token age for: ".concat(token));
        if (!token || !token.startsWith("tok")) {
            logger(this.options.debug, "info", "[Lite Validator] Token not in a format that we can timestamp.");
            return false;
        }
        // Only handle tok0 format tokens
        if (!token.startsWith("tok0")) {
            logger(this.options.debug, "info", "[Lite Validator] Token format '".concat(token.substring(0, 4), "' not supported for age checking"));
            return false;
        }
        var dateStampUTC = new Date().getTime();
        var tokenCreated = this.tokenCreationDate(token);
        var tokenCreatedDate = new Date(tokenCreated);
        var differenceInHours = (dateStampUTC - tokenCreated) / (1000 * 60 * 60);
        logger(this.options.debug, "info", "[Lite Validator] Token created: ".concat(tokenCreatedDate.toISOString(), ", Age: ").concat(differenceInHours.toFixed(2), " hours"));
        if (differenceInHours > 12) {
            logger(this.options.debug, "info", "[Lite Validator] Token is older than 12 hours - will trigger redirect");
            return true;
        }
        logger(this.options.debug, "info", "[Lite Validator] Token is fresh (< 12 hours old)");
        return false;
    };
    /**
     * Checks if the current request matches any configured room patterns
     * Rooms are pre-ordered by precedence (regex → contains → all)
     * First match wins
     */
    Gatekeeper.prototype.matchRoomConfig = function () {
        var _this = this;
        var roomMeta = {
            domain: null,
            patternType: null,
            queueActivatesOn: null,
            slug: null,
            status: false,
            timeout: null,
        };
        if (!this.options.roomsConfig || this.options.roomsConfig.length === 0) {
            logger(this.options.debug, "info", "[Lite Validator] No rooms config provided or empty array");
            return roomMeta;
        }
        var host = this.host;
        // Note: this.path already includes query string from all REQUEST handlers
        var path = this.path;
        var fullDomain = "https://".concat(host);
        logger(this.options.debug, "info", "[Lite Validator] Checking rooms for domain: ".concat(fullDomain, ", path: ").concat(path));
        logger(this.options.debug, "info", "[Lite Validator] Total rooms in config: ".concat(this.options.roomsConfig.length));
        // Filter rooms by domain
        var filteredResults = this.options.roomsConfig.filter(function (item) {
            var matches = item.domain === fullDomain;
            if (matches) {
                logger(_this.options.debug, "info", "[Lite Validator] Domain match found: ".concat(item.slug));
            }
            return matches;
        });
        logger(this.options.debug, "info", "[Lite Validator] Rooms matching domain: ".concat(filteredResults.length));
        // Find first match - rooms are pre-ordered by precedence
        for (var _i = 0, filteredResults_1 = filteredResults; _i < filteredResults_1.length; _i++) {
            var item = filteredResults_1[_i];
            logger(this.options.debug, "info", "[Lite Validator] Testing room '".concat(item.slug, "' with pattern '").concat(item.urlPattern, "' (type: ").concat(item.patternType, ")"));
            if (this.patternCheck(item, path) === true) {
                logger(this.options.debug, "info", "[Lite Validator] MATCH FOUND: Room '".concat(item.slug, "' matches current path"));
                // First match is the best match
                roomMeta.domain = item.domain;
                roomMeta.patternType = item.patternType;
                roomMeta.queueActivatesOn = item.queueActivatesOn;
                roomMeta.slug = item.slug;
                roomMeta.status = true;
                roomMeta.timeout = item.timeout;
                break; // Stop at first match
            }
        }
        if (!roomMeta.status) {
            logger(this.options.debug, "info", "[Lite Validator] No matching room found for current path");
        }
        return roomMeta;
    };
    /**
     * Pattern checking logic - matches reference implementation
     */
    Gatekeeper.prototype.patternCheck = function (item, path) {
        switch (item.patternType) {
            case "regex":
                if (!item.urlPattern)
                    return false;
                var regex = new RegExp(item.urlPattern);
                return regex.test(path);
            case "contains":
                if (!item.urlPattern)
                    return false;
                return path.includes(item.urlPattern);
            case "all":
                return true;
            default:
                return false;
        }
    };
    /**
     * Determines if the request should be redirected to the lite validator
     */
    Gatekeeper.prototype.shouldRedirectToLiteValidator = function () {
        logger(this.options.debug, "info", "[Lite Validator] === Starting lite validator check ===");
        logger(this.options.debug, "info", "[Lite Validator] Lite validator enabled: ".concat(this.options.liteValidator));
        logger(this.options.debug, "info", "[Lite Validator] Rooms config provided: ".concat(!!this.options.roomsConfig));
        logger(this.options.debug, "info", "[Lite Validator] Current token: ".concat(this.token || 'NO TOKEN'));
        if (!this.options.liteValidator || !this.options.roomsConfig) {
            logger(this.options.debug, "info", "[Lite Validator] Lite validator disabled or no rooms config - skipping");
            return { redirect: false };
        }
        // Check if current path matches any protected room
        var roomMatch = this.matchRoomConfig();
        if (!roomMatch.status) {
            logger(this.options.debug, "info", "[Lite Validator] No room match - skipping lite validator");
            return { redirect: false };
        }
        logger(this.options.debug, "info", "[Lite Validator] Room matched: ".concat(roomMatch.slug || 'match found'));
        // Check if token is missing or old
        var tokenMissing = !this.token;
        var tokenIsOld = this.token ? this.isOldToken(this.token) : false;
        logger(this.options.debug, "info", "[Lite Validator] Token missing: ".concat(tokenMissing, ", Token old: ").concat(tokenIsOld));
        if (tokenMissing || tokenIsOld) {
            var redirectUrl = this.buildLiteValidatorUrl();
            logger(this.options.debug, "info", "[Lite Validator] REDIRECT REQUIRED to: ".concat(redirectUrl));
            return { redirect: true, url: redirectUrl, domain: roomMatch.domain };
        }
        logger(this.options.debug, "info", "[Lite Validator] Token is valid - no redirect needed");
        return { redirect: false, domain: roomMatch.domain };
    };
    /**
     * Builds the lite validator redirect URL
     */
    Gatekeeper.prototype.buildLiteValidatorUrl = function () {
        var apiUrl = this.PublicClient.apiUrl || 'https://api.crowdhandler.com';
        var baseUrl = "".concat(apiUrl, "/v1/redirect/requests");
        // targetURL is already encoded by ProcessURL
        var targetUrl = this.targetURL || '';
        var code = this.specialParameters.chCode || '';
        var params = "ch-public-key=".concat(this.publicKey, "&url=").concat(targetUrl, "&ch-code=").concat(code);
        return this.token
            ? "".concat(baseUrl, "/").concat(this.token, "?").concat(params)
            : "".concat(baseUrl, "?").concat(params);
    };
    /**
     * The primary method for validating requests against CrowdHandler's queue system.
     * Determines whether a user should be granted access to your protected resource or sent to a waiting room.
     *
     * @param {object} params - Optional parameters to customize the validation
     * @param {Record<string, any>} params.custom - Custom parameters to pass to the CrowdHandler API
     * @returns {Promise<ValidateRequestObject>} Instructions on how to handle the request:
     * - `promoted` {boolean} - true = grant access, false = send to waiting room
     * - `setCookie` {boolean} - true = update the user's session cookie
     * - `cookieValue` {string} - The session token to store in the cookie
     * - `stripParams` {boolean} - true = remove CrowdHandler URL parameters
     * - `targetURL` {string} - Where to redirect (clean URL or waiting room)
     * - `slug` {string} - The waiting room slug (when not promoted)
     * - `responseID` {string} - Response ID for performance tracking (when promoted)
     * - `deployment` {string} - Deployment identifier from the API
     * - `token` {string} - The session token
     * - `hash` {string | null} - Signature hash for validation (when available)
     * - `liteValidatorRedirect` {boolean} - Whether to redirect for lite validation
     * - `liteValidatorUrl` {string} - URL for lite validator redirect
     *
     * @example
     * const result = await gatekeeper.validateRequest();
     * if (!result.promoted) {
     *   return gatekeeper.redirectIfNotPromoted();
     * }
     *
     * @example
     * // With custom parameters
     * const result = await gatekeeper.validateRequest({
     *   custom: {
     *     userId: 'user123',
     *     sessionId: 'session456',
     *     customField: 'value'
     *   }
     * });
     *
     * @throws {CrowdHandlerError} When API connection fails (check error.code === 'API_CONNECTION_FAILED')
     */
    Gatekeeper.prototype.validateRequest = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.options.mode;
                        switch (_a) {
                            case "hybrid": return [3 /*break*/, 1];
                            case "full": return [3 /*break*/, 3];
                            case "clientside": return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 7];
                    case 1: return [4 /*yield*/, this.validateRequestHybridMode(params === null || params === void 0 ? void 0 : params.custom)];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3: return [4 /*yield*/, this.validateRequestFullMode(params === null || params === void 0 ? void 0 : params.custom)];
                    case 4: return [2 /*return*/, _b.sent()];
                    case 5: return [4 /*yield*/, this.validateRequestClientSideMode(params === null || params === void 0 ? void 0 : params.custom)];
                    case 6: return [2 /*return*/, _b.sent()];
                    case 7:
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Validate request in a client-side mode.
     *
     * This method checks for a CrowdHandler cookie and gets the session status for the request.
     * It works the same as full mode but runs in browser environments.
     *
     * @param {Record<string, any>} customParams - Optional custom parameters to include in the API request
     * @return {Promise<z.infer<typeof validateRequestObject>>} Result of the validation process.
     */
    Gatekeeper.prototype.validateRequestClientSideMode = function (customParams) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var result, liteCheck, sessionStatusType, _b, promoted, slug, token, responseID, deployment, hash, requested, domain, error_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        result = {
                            promoted: false,
                            stripParams: false,
                            setCookie: false,
                            setLocalStorage: false,
                            cookieValue: "",
                            responseID: "",
                            slug: "",
                            targetURL: "",
                            deployment: "",
                            hash: null,
                            token: "",
                            requested: "",
                        };
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        // Log details for debugging
                        logger(this.options.debug, "info", "IP: ".concat(this.ip));
                        logger(this.options.debug, "info", "Agent: ".concat(this.agent));
                        logger(this.options.debug, "info", "Host: ".concat(this.host));
                        logger(this.options.debug, "info", "Path: ".concat(this.path));
                        logger(this.options.debug, "info", "Lang: ".concat(this.lang));
                        // Skip paths that match the ignore pattern
                        if (ignoredPatternsCheck(this.path, this.ignore)) {
                            logger(this.options.debug, "info", "Ignored path: ".concat(this.path));
                            result.promoted = true;
                            return [2 /*return*/, result];
                        }
                        this.processURL();
                        result.targetURL = this.targetURL || "";
                        this.getCookie();
                        this.extractToken();
                        // Lite validator check - EARLY EXIT
                        logger(this.options.debug, "info", "[Lite Validator] Performing lite validator check in validateRequestClientSideMode");
                        liteCheck = this.shouldRedirectToLiteValidator();
                        // Store domain from lite validator if available
                        if (liteCheck.domain) {
                            result.domain = liteCheck.domain;
                        }
                        if (liteCheck.redirect) {
                            logger(this.options.debug, "info", "[Lite Validator] Lite validator redirect triggered in clientside mode");
                            result.liteValidatorRedirect = true;
                            result.liteValidatorUrl = liteCheck.url;
                            result.promoted = false;
                            return [2 /*return*/, result];
                        }
                        logger(this.options.debug, "info", "[Lite Validator] Continuing with normal validation");
                        return [4 /*yield*/, this.getSessionStatus(customParams)];
                    case 2:
                        _c.sent();
                        sessionStatusType = HttpErrorWrapper.safeParse(this.sessionStatus);
                        // Handle session status errors
                        if (sessionStatusType.success) {
                            if (((_a = this.sessionStatus) === null || _a === void 0 ? void 0 : _a.result.status) !== 200) {
                                // Can't process the request but we can trust it if trustOnFail is set to true
                                result.promoted = this.options.trustOnFail;
                                if (!this.options.trustOnFail)
                                    result.slug = this.options.fallbackSlug;
                                return [2 /*return*/, result];
                            }
                        }
                        // Processing based on promotion status
                        if (this.sessionStatus) {
                            _b = this.sessionStatus.result, promoted = _b.promoted, slug = _b.slug, token = _b.token, responseID = _b.responseID, deployment = _b.deployment, hash = _b.hash, requested = _b.requested, domain = _b.domain;
                            result.promoted = promoted === 1;
                            // Pass domain from API response if available
                            if (domain) {
                                result.domain = domain;
                            }
                            result.slug = slug || result.slug;
                            this.token = token || this.token;
                            result.token = token || result.token;
                            result.deployment = deployment || result.deployment;
                            result.hash = hash || null;
                            result.requested = requested || result.requested;
                            // Always set cookie if we have a token (for both promoted and non-promoted users)
                            if (token) {
                                result.setCookie = true;
                                result.cookieValue = token;
                            }
                            if (promoted === 1) {
                                result.responseID = responseID || result.responseID;
                                this.responseID = responseID || "";
                                if (this.specialParameters.chRequested) {
                                    result.stripParams = true;
                                }
                            }
                        }
                        return [2 /*return*/, result];
                    case 3:
                        error_3 = _c.sent();
                        logger(this.options.debug, "error", "An error occurred during request validation: ".concat(error_3));
                        throw error_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Validates the request by making full use of CrowdHandler API.
     * It handles the request and sets the necessary response based on the session status and API response.
     * @param {Record<string, any>} customParams - Optional custom parameters to include in the API request
     * @return {Promise<z.infer<typeof ValidateRequestObject>>} - The resulting status after validating the request.
     */
    Gatekeeper.prototype.validateRequestFullMode = function (customParams) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var result, liteCheck, sessionStatusType, _b, promoted, slug, token, responseID, deployment, hash, requested, domain, error_4;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        result = {
                            promoted: false,
                            stripParams: false,
                            setCookie: false,
                            setLocalStorage: false,
                            cookieValue: "",
                            responseID: "",
                            slug: "",
                            targetURL: "",
                            deployment: "",
                            hash: null,
                            token: "",
                            requested: "",
                        };
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        // Log details for debugging
                        logger(this.options.debug, "info", "IP: ".concat(this.ip));
                        logger(this.options.debug, "info", "Agent: ".concat(this.agent));
                        logger(this.options.debug, "info", "Host: ".concat(this.host));
                        logger(this.options.debug, "info", "Path: ".concat(this.path));
                        logger(this.options.debug, "info", "Lang: ".concat(this.lang));
                        // Skip paths that match the ignore pattern
                        if (ignoredPatternsCheck(this.path, this.ignore)) {
                            logger(this.options.debug, "info", "Ignored path: ".concat(this.path));
                            result.promoted = true;
                            return [2 /*return*/, result];
                        }
                        this.processURL();
                        result.targetURL = this.targetURL;
                        this.getCookie();
                        this.extractToken();
                        // Lite validator check - EARLY EXIT
                        logger(this.options.debug, "info", "[Lite Validator] Performing lite validator check in validateRequestClientSideMode");
                        liteCheck = this.shouldRedirectToLiteValidator();
                        // Store domain from lite validator if available
                        if (liteCheck.domain) {
                            result.domain = liteCheck.domain;
                        }
                        if (liteCheck.redirect) {
                            logger(this.options.debug, "info", "[Lite Validator] Lite validator redirect triggered in clientside mode");
                            result.liteValidatorRedirect = true;
                            result.liteValidatorUrl = liteCheck.url;
                            result.promoted = false;
                            return [2 /*return*/, result];
                        }
                        logger(this.options.debug, "info", "[Lite Validator] Continuing with normal validation");
                        return [4 /*yield*/, this.getSessionStatus(customParams)];
                    case 2:
                        _c.sent();
                        sessionStatusType = HttpErrorWrapper.safeParse(this.sessionStatus);
                        // Handle session status errors
                        if (sessionStatusType.success) {
                            if (((_a = this.sessionStatus) === null || _a === void 0 ? void 0 : _a.result.status) !== 200) {
                                // Can't process the request but we can trust it if trustOnFail is set to true
                                result.promoted = this.options.trustOnFail;
                                if (!this.options.trustOnFail)
                                    result.slug = this.options.fallbackSlug;
                                return [2 /*return*/, result];
                            }
                        }
                        // Processing based on promotion status
                        if (this.sessionStatus) {
                            _b = this.sessionStatus.result, promoted = _b.promoted, slug = _b.slug, token = _b.token, responseID = _b.responseID, deployment = _b.deployment, hash = _b.hash, requested = _b.requested, domain = _b.domain;
                            result.promoted = promoted === 1;
                            // Pass domain from API response if available
                            if (domain) {
                                result.domain = domain;
                            }
                            result.slug = slug || result.slug;
                            this.token = token || this.token;
                            result.token = token || result.token;
                            result.deployment = deployment || result.deployment;
                            result.hash = hash || null;
                            result.requested = requested || result.requested;
                            // Always set cookie if we have a token (for both promoted and non-promoted users)
                            if (token) {
                                result.setCookie = true;
                                result.cookieValue = token;
                            }
                            if (promoted === 1) {
                                result.responseID = responseID || result.responseID;
                                this.responseID = responseID || "";
                                if (this.specialParameters.chRequested) {
                                    result.stripParams = true;
                                }
                            }
                        }
                        return [2 /*return*/, result];
                    case 3:
                        error_4 = _c.sent();
                        logger(this.options.debug, "error", "An error occurred during request validation: ".concat(error_4));
                        throw error_4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //TODO: This method is a complex beast and needs refactoring
    /**
     * Validate request using signature and/or Crowdhandler API when required
     * @param {Record<string, any>} customParams - Optional custom parameters to include in the API request
     */
    Gatekeeper.prototype.validateRequestHybridMode = function (customParams) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var signatures, tokens, freshToken, freshSignature, result, liteCheck, configStatusType, sessionStatusType, token, hash, error_5, validationResult, sessionStatusType, hash, token, error_6, _i, _c, item, _d, _e, item;
            var _this = this;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        signatures = [];
                        tokens = [];
                        result = {
                            promoted: false,
                            stripParams: false,
                            setCookie: false,
                            setLocalStorage: false,
                            cookieValue: "",
                            responseID: "",
                            slug: "",
                            targetURL: "",
                            deployment: "",
                            hash: null,
                            token: "",
                            requested: "",
                        };
                        logger(this.options.debug, "info", "IP: " + this.ip);
                        logger(this.options.debug, "info", "Agent: " + this.agent);
                        logger(this.options.debug, "info", "Host: " + this.host);
                        logger(this.options.debug, "info", "Path: " + this.path);
                        logger(this.options.debug, "info", "Lang: " + this.lang);
                        //Bypass paths that match the ignore patterns
                        if (ignoredPatternsCheck(this.path, this.ignore)) {
                            logger(this.options.debug, "info", "Ignored path: " + this.path);
                            result.promoted = true;
                            return [2 /*return*/, result];
                        }
                        this.processURL();
                        result.targetURL = this.targetURL;
                        this.getCookie();
                        this.extractToken();
                        liteCheck = this.shouldRedirectToLiteValidator();
                        // Store domain from lite validator if available
                        if (liteCheck.domain) {
                            result.domain = liteCheck.domain;
                        }
                        if (liteCheck.redirect) {
                            result.liteValidatorRedirect = true;
                            result.liteValidatorUrl = liteCheck.url;
                            result.promoted = false;
                            return [2 /*return*/, result];
                        }
                        return [4 /*yield*/, this.getConfig()];
                    case 1:
                        _f.sent();
                        configStatusType = HttpErrorWrapper.safeParse(this.activeConfig);
                        if (configStatusType.success) {
                            if (this.activeConfig && this.activeConfig.result.status !== 200) {
                                //Can't process the request but we can trust it if trustOnFail is set to true
                                if (this.options.trustOnFail) {
                                    result.promoted = true;
                                }
                                else {
                                    result.promoted = false;
                                    result.slug = this.options.fallbackSlug;
                                }
                                return [2 /*return*/, result];
                            }
                        }
                        //Working with a real config file from here
                        if (this.activeConfig.status === false) {
                            logger(this.options.debug, "info", "Config succesfully fetched but no check required.");
                            result.promoted = true;
                            return [2 /*return*/, result];
                        }
                        //Attempt to retrieve crowdhandler cookie
                        this.getCookie();
                        logger(this.options.debug, "info", "Cookie: " + this.cookieValue);
                        // Extract deployment from cookie if available
                        if (this.cookieValue && this.cookieValue.deployment) {
                            result.deployment = this.cookieValue.deployment;
                        }
                        this.getSignature({
                            chIDSignature: this.specialParameters.chIDSignature,
                            crowdhandlerCookieValue: this.cookieValue,
                        });
                        this.extractToken();
                        logger(this.options.debug, "info", "Signature: " + this.simpleSignature);
                        logger(this.options.debug, "info", "Complex Signature: " + this.complexSignature);
                        logger(this.options.debug, "info", "Token: " + this.token);
                        if (!((this.simpleSignature.length === 0 ||
                            this.complexSignature.length === 0) &&
                            !this.token)) return [3 /*break*/, 5];
                        logger(this.options.debug, "info", "Missing signature and/or token, doing a check.");
                        _f.label = 2;
                    case 2:
                        _f.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.getSessionStatus(customParams)];
                    case 3:
                        _f.sent();
                        sessionStatusType = HttpErrorWrapper.safeParse(this.sessionStatus);
                        if (sessionStatusType.success) {
                            if (this.sessionStatus && this.sessionStatus.result.status !== 200) {
                                //Can't process the request but we can trust it if trustOnFail is set to true
                                if (this.options.trustOnFail) {
                                    result.promoted = true;
                                }
                                else {
                                    result.promoted = false;
                                    result.slug = this.options.fallbackSlug;
                                }
                                return [2 /*return*/, result];
                            }
                        }
                        token = void 0;
                        // Pass domain from API response if available
                        if (this.sessionStatus && this.sessionStatus.result.domain) {
                            result.domain = this.sessionStatus.result.domain;
                        }
                        if (this.sessionStatus && this.sessionStatus.result.promoted === 0) {
                            if (this.sessionStatus.result.token) {
                                token = this.sessionStatus.result.token;
                                result.token = token;
                                this.extractToken({ chID: token });
                            }
                            result.promoted = false;
                            return [2 /*return*/, result];
                        }
                        else if (this.sessionStatus &&
                            this.sessionStatus.result.promoted === 1) {
                            result.promoted = true;
                            result.setCookie = true;
                            hash = void 0;
                            if (this.sessionStatus.result.requested) {
                                this.requested = this.sessionStatus.result.requested;
                            }
                            if (this.sessionStatus.result.deployment) {
                                this.deployment = this.sessionStatus.result.deployment;
                                result.deployment = this.deployment;
                            }
                            if (this.sessionStatus.result.hash) {
                                hash = this.sessionStatus.result.hash;
                                result.hash = hash;
                                this.getSignature({ chIDSignature: hash });
                            }
                            if (this.sessionStatus.result.token) {
                                token = this.sessionStatus.result.token;
                                result.token = token;
                                this.extractToken({ chID: token });
                            }
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_5 = _f.sent();
                        logger(this.options.debug, "error", error_5);
                        return [3 /*break*/, 5];
                    case 5:
                        logger(this.options.debug, "info", "Signature and token found. Validating...");
                        validationResult = this.validateSignature();
                        if (!(validationResult.success === false)) return [3 /*break*/, 9];
                        logger(this.options.debug, "info", "Signature not valid. Checking against API.");
                        _f.label = 6;
                    case 6:
                        _f.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, this.getSessionStatus(customParams)];
                    case 7:
                        _f.sent();
                        sessionStatusType = HttpErrorWrapper.safeParse(this.sessionStatus);
                        if (sessionStatusType.success) {
                            if (this.sessionStatus && this.sessionStatus.result.status !== 200) {
                                //Can't process the request but we can trust it if trustOnFail is set to true
                                if (this.options.trustOnFail) {
                                    result.promoted = true;
                                }
                                else {
                                    result.promoted = false;
                                    result.slug = this.options.fallbackSlug;
                                }
                                return [2 /*return*/, result];
                            }
                        }
                        // Pass domain from API response if available
                        if (this.sessionStatus && this.sessionStatus.result.domain) {
                            result.domain = this.sessionStatus.result.domain;
                        }
                        if (this.sessionStatus && this.sessionStatus.result.promoted === 0) {
                            result.promoted = false;
                            return [2 /*return*/, result];
                        }
                        else if (this.sessionStatus &&
                            this.sessionStatus.result.promoted === 1) {
                            hash = void 0;
                            token = void 0;
                            if (this.sessionStatus.result.requested) {
                                this.requested = this.sessionStatus.result.requested;
                            }
                            if (this.sessionStatus.result.deployment) {
                                this.deployment = this.sessionStatus.result.deployment;
                                result.deployment = this.deployment;
                            }
                            if (this.sessionStatus.result.hash) {
                                hash = this.sessionStatus.result.hash;
                                result.hash = hash;
                                this.getSignature({ chIDSignature: hash });
                            }
                            if (this.sessionStatus.result.token) {
                                token = this.sessionStatus.result.token;
                                result.token = token;
                                this.extractToken({ chID: token });
                            }
                        }
                        return [3 /*break*/, 9];
                    case 8:
                        error_6 = _f.sent();
                        logger(this.options.debug, "error", error_6);
                        return [3 /*break*/, 9];
                    case 9:
                        //part 2 here
                        //We've established that we have a valid signature at this point
                        logger(this.options.debug, "info", "Signature is valid.");
                        try {
                            // Only parse cookieValue if it exists
                            if (this.cookieValue) {
                                this.cookieValue = CookieObject.parse(this.cookieValue);
                                if (this.cookieValue) {
                                    for (_i = 0, _c = this.cookieValue.tokens; _i < _c.length; _i++) {
                                        item = _c[_i];
                                        tokens.push(item);
                                    }
                                }
                            }
                        }
                        catch (error) {
                            logger(this.options.debug, "error", error);
                        }
                        //Determine if we're working with a new token or a previously seen one
                        if ((Array.isArray(tokens) && tokens.length === 0) ||
                            (Array.isArray(tokens) && tokens[tokens.length - 1].token !== this.token)) {
                            freshToken = true;
                        }
                        else {
                            freshToken = false;
                            //We want to work with the most recent array of signatures
                            for (_d = 0, _e = tokens[tokens.length - 1].signatures; _d < _e.length; _d++) {
                                item = _e[_d];
                                signatures.push(item);
                            }
                        }
                        this.generateCookieObjects();
                        if (this.signatureType === "simple" &&
                            signatures.some(function (item) { return item.sig === _this.simpleSignature; }) === false) {
                            signatures.push(this.cookieSignatureObject);
                            freshSignature = true;
                        }
                        if (freshToken) {
                            //Reset the array. It's important we don't allow the PMUSER_CREDENTIALS variable exceed the byte limit.
                            tokens = [];
                            if (this.cookieTokenObject) {
                                this.cookieTokenObject.signatures = signatures;
                            }
                            tokens.push(this.cookieTokenObject);
                        }
                        else {
                            tokens[tokens.length - 1].signatures = signatures;
                            tokens[tokens.length - 1].touched = (_a = this.cookieTokenObject) === null || _a === void 0 ? void 0 : _a.touched;
                            tokens[tokens.length - 1].touchedSig = (_b = this.cookieTokenObject) === null || _b === void 0 ? void 0 : _b.touchedSig;
                        }
                        try {
                            this.cookieValue = this.generateCookie(tokens, this.deployment);
                        }
                        catch (error) {
                            logger(this.options.debug, "error", error);
                            // Handle the error as appropriate for your application...
                        }
                        result.cookieValue = JSON.stringify(this.cookieValue);
                        if (freshSignature && this.specialParameters.chRequested) {
                            result.stripParams = true;
                        }
                        //If we made it all the way here, we can assume the user is promoted and a cookie should be set.
                        result.promoted = true;
                        result.setCookie = true;
                        result.token = this.token;
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return Gatekeeper;
}());

// Implementation
function init(config) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    // Validate configuration
    if (!config.publicKey) {
        throw new CrowdHandlerError(ErrorCodes.INVALID_CONFIG, 'publicKey is required', 'Provide your public key from the CrowdHandler dashboard: crowdhandler.init({ publicKey: "YOUR_KEY" })');
    }
    // Create unified client
    var client = new Client({
        publicKey: config.publicKey,
        privateKey: config.privateKey,
        options: config.options
    });
    // Check if context was provided
    var hasContext = !!((config.request && config.response) ||
        config.lambdaEdgeEvent ||
        (typeof window !== 'undefined' && !config.request && !config.response && !config.lambdaEdgeEvent));
    // Create gatekeeper if context provided
    var gatekeeper;
    if (hasContext) {
        // Create RequestContext
        var context = void 0;
        if (config.lambdaEdgeEvent) {
            context = new RequestContext({ lambdaEvent: config.lambdaEdgeEvent });
        }
        else if (config.request && config.response) {
            context = new RequestContext({ request: config.request, response: config.response });
        }
        else if (typeof window !== 'undefined') {
            context = new RequestContext({});
        }
        else {
            throw new CrowdHandlerError(ErrorCodes.INVALID_CONTEXT, 'Invalid context configuration', 'Provide either:\n' +
                '- { request, response } for Express/Node.js\n' +
                '- { lambdaEdgeEvent } for Lambda@Edge\n' +
                '- Nothing for browser environment');
        }
        // Auto-detect mode
        var mode = detectMode(config);
        // Prepare gatekeeper options
        var gatekeeperOptions = {
            mode: mode,
            debug: (_a = config.options) === null || _a === void 0 ? void 0 : _a.debug,
            timeout: (_b = config.options) === null || _b === void 0 ? void 0 : _b.timeout,
            trustOnFail: (_c = config.options) === null || _c === void 0 ? void 0 : _c.trustOnFail,
            fallbackSlug: (_d = config.options) === null || _d === void 0 ? void 0 : _d.fallbackSlug,
            cookieName: (_e = config.options) === null || _e === void 0 ? void 0 : _e.cookieName,
            liteValidator: (_f = config.options) === null || _f === void 0 ? void 0 : _f.liteValidator,
            roomsConfig: (_g = config.options) === null || _g === void 0 ? void 0 : _g.roomsConfig,
            waitingRoom: (_h = config.options) === null || _h === void 0 ? void 0 : _h.waitingRoom
        };
        // Create gatekeeper using the public client from our unified client
        gatekeeper = new Gatekeeper(client.getPublicClient(), context, {
            publicKey: config.publicKey,
            privateKey: config.privateKey
        }, gatekeeperOptions);
    }
    return { client: client, gatekeeper: gatekeeper };
}
/**
 * Detect the appropriate mode based on configuration and environment
 */
function detectMode(config) {
    var _a;
    // Explicit mode takes precedence
    if (((_a = config.options) === null || _a === void 0 ? void 0 : _a.mode) && config.options.mode !== 'auto') {
        // Validate mode requirements
        if (config.options.mode === 'hybrid' && !config.privateKey) {
            throw new CrowdHandlerError(ErrorCodes.INVALID_MODE, 'Hybrid mode requires a privateKey', 'Either provide a privateKey or use "full" mode');
        }
        return config.options.mode;
    }
    // Auto-detect based on environment
    if (typeof window !== 'undefined') {
        return 'clientside';
    }
    // Default to 'full' mode for server environments
    // (hybrid mode must be explicitly chosen)
    return 'full';
}

/**
 * CrowdHandler JavaScript SDK
 *
 * @packageDocumentation
 */
// Export individual error codes for better autocomplete
var CROWDHANDLER_ERRORS = {
    // Configuration errors
    INVALID_CONFIG: 'INVALID_CONFIG',
    INVALID_MODE: 'INVALID_MODE',
    INVALID_CONTEXT: 'INVALID_CONTEXT',
    MISSING_PRIVATE_KEY: 'MISSING_PRIVATE_KEY',
    // API errors
    API_CONNECTION_FAILED: 'API_CONNECTION_FAILED',
    API_TIMEOUT: 'API_TIMEOUT',
    API_INVALID_RESPONSE: 'API_INVALID_RESPONSE',
    INVALID_API_KEY: 'INVALID_API_KEY',
    RATE_LIMITED: 'RATE_LIMITED',
    // Resource errors
    RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
    DOMAIN_NOT_FOUND: 'DOMAIN_NOT_FOUND',
    ROOM_NOT_FOUND: 'ROOM_NOT_FOUND',
    SESSION_NOT_FOUND: 'SESSION_NOT_FOUND',
    // Generic errors
    UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

exports.CROWDHANDLER_ERRORS = CROWDHANDLER_ERRORS;
exports.Client = Client;
exports.CrowdHandlerError = CrowdHandlerError;
exports.ErrorCodes = ErrorCodes;
exports.Modes = Modes;
exports.init = init;
//# sourceMappingURL=crowdhandler.cjs.js.map
