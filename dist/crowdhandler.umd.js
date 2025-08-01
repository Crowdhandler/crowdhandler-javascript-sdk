/**
 * CrowdHandler JavaScript SDK v2.1.2
 * (c) 2025 CrowdHandler
 * @license ISC
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.crowdhandler = {}));
})(this, (function (exports) { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : "object" !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

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

	var axios$2 = {exports: {}};

	/* axios v0.27.2 | (c) 2022 by Matt Zabriskie */
	var axios$1 = axios$2.exports;

	var hasRequiredAxios;

	function requireAxios () {
		if (hasRequiredAxios) return axios$2.exports;
		hasRequiredAxios = 1;
		(function (module, exports) {
			(function webpackUniversalModuleDefinition(root, factory) {
				module.exports = factory();
			})(axios$1, function() {
			return /******/ (function(modules) { // webpackBootstrap
			/******/ 	// The module cache
			/******/ 	var installedModules = {};
			/******/
			/******/ 	// The require function
			/******/ 	function __webpack_require__(moduleId) {
			/******/
			/******/ 		// Check if module is in cache
			/******/ 		if(installedModules[moduleId]) {
			/******/ 			return installedModules[moduleId].exports;
			/******/ 		}
			/******/ 		// Create a new module (and put it into the cache)
			/******/ 		var module = installedModules[moduleId] = {
			/******/ 			i: moduleId,
			/******/ 			l: false,
			/******/ 			exports: {}
			/******/ 		};
			/******/
			/******/ 		// Execute the module function
			/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
			/******/
			/******/ 		// Flag the module as loaded
			/******/ 		module.l = true;
			/******/
			/******/ 		// Return the exports of the module
			/******/ 		return module.exports;
			/******/ 	}
			/******/
			/******/
			/******/ 	// expose the modules object (__webpack_modules__)
			/******/ 	__webpack_require__.m = modules;
			/******/
			/******/ 	// expose the module cache
			/******/ 	__webpack_require__.c = installedModules;
			/******/
			/******/ 	// define getter function for harmony exports
			/******/ 	__webpack_require__.d = function(exports, name, getter) {
			/******/ 		if(!__webpack_require__.o(exports, name)) {
			/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
			/******/ 		}
			/******/ 	};
			/******/
			/******/ 	// define __esModule on exports
			/******/ 	__webpack_require__.r = function(exports) {
			/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
			/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
			/******/ 		}
			/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
			/******/ 	};
			/******/
			/******/ 	// create a fake namespace object
			/******/ 	// mode & 1: value is a module id, require it
			/******/ 	// mode & 2: merge all properties of value into the ns
			/******/ 	// mode & 4: return value when already ns object
			/******/ 	// mode & 8|1: behave like require
			/******/ 	__webpack_require__.t = function(value, mode) {
			/******/ 		if(mode & 1) value = __webpack_require__(value);
			/******/ 		if(mode & 8) return value;
			/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
			/******/ 		var ns = Object.create(null);
			/******/ 		__webpack_require__.r(ns);
			/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
			/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
			/******/ 		return ns;
			/******/ 	};
			/******/
			/******/ 	// getDefaultExport function for compatibility with non-harmony modules
			/******/ 	__webpack_require__.n = function(module) {
			/******/ 		var getter = module && module.__esModule ?
			/******/ 			function getDefault() { return module['default']; } :
			/******/ 			function getModuleExports() { return module; };
			/******/ 		__webpack_require__.d(getter, 'a', getter);
			/******/ 		return getter;
			/******/ 	};
			/******/
			/******/ 	// Object.prototype.hasOwnProperty.call
			/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
			/******/
			/******/ 	// __webpack_public_path__
			/******/ 	__webpack_require__.p = "";
			/******/
			/******/
			/******/ 	// Load entry module and return exports
			/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
			/******/ })
			/************************************************************************/
			/******/ ({

			/***/ "./index.js":
			/*!******************!*\
			  !*** ./index.js ***!
			  \******************/
			/*! no static exports found */
			/***/ (function(module, exports, __webpack_require__) {

			module.exports = __webpack_require__(/*! ./lib/axios */ "./lib/axios.js");

			/***/ }),

			/***/ "./lib/adapters/xhr.js":
			/*!*****************************!*\
			  !*** ./lib/adapters/xhr.js ***!
			  \*****************************/
			/*! no static exports found */
			/***/ (function(module, exports, __webpack_require__) {


			var utils = __webpack_require__(/*! ./../utils */ "./lib/utils.js");
			var settle = __webpack_require__(/*! ./../core/settle */ "./lib/core/settle.js");
			var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./lib/helpers/cookies.js");
			var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./lib/helpers/buildURL.js");
			var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./lib/core/buildFullPath.js");
			var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./lib/helpers/parseHeaders.js");
			var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./lib/helpers/isURLSameOrigin.js");
			var transitionalDefaults = __webpack_require__(/*! ../defaults/transitional */ "./lib/defaults/transitional.js");
			var AxiosError = __webpack_require__(/*! ../core/AxiosError */ "./lib/core/AxiosError.js");
			var CanceledError = __webpack_require__(/*! ../cancel/CanceledError */ "./lib/cancel/CanceledError.js");
			var parseProtocol = __webpack_require__(/*! ../helpers/parseProtocol */ "./lib/helpers/parseProtocol.js");

			module.exports = function xhrAdapter(config) {
			  return new Promise(function dispatchXhrRequest(resolve, reject) {
			    var requestData = config.data;
			    var requestHeaders = config.headers;
			    var responseType = config.responseType;
			    var onCanceled;
			    function done() {
			      if (config.cancelToken) {
			        config.cancelToken.unsubscribe(onCanceled);
			      }

			      if (config.signal) {
			        config.signal.removeEventListener('abort', onCanceled);
			      }
			    }

			    if (utils.isFormData(requestData) && utils.isStandardBrowserEnv()) {
			      delete requestHeaders['Content-Type']; // Let the browser set it
			    }

			    var request = new XMLHttpRequest();

			    // HTTP basic authentication
			    if (config.auth) {
			      var username = config.auth.username || '';
			      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
			      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
			    }

			    var fullPath = buildFullPath(config.baseURL, config.url);

			    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

			    // Set the request timeout in MS
			    request.timeout = config.timeout;

			    function onloadend() {
			      if (!request) {
			        return;
			      }
			      // Prepare the response
			      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
			      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
			        request.responseText : request.response;
			      var response = {
			        data: responseData,
			        status: request.status,
			        statusText: request.statusText,
			        headers: responseHeaders,
			        config: config,
			        request: request
			      };

			      settle(function _resolve(value) {
			        resolve(value);
			        done();
			      }, function _reject(err) {
			        reject(err);
			        done();
			      }, response);

			      // Clean up request
			      request = null;
			    }

			    if ('onloadend' in request) {
			      // Use onloadend if available
			      request.onloadend = onloadend;
			    } else {
			      // Listen for ready state to emulate onloadend
			      request.onreadystatechange = function handleLoad() {
			        if (!request || request.readyState !== 4) {
			          return;
			        }

			        // The request errored out and we didn't get a response, this will be
			        // handled by onerror instead
			        // With one exception: request that using file: protocol, most browsers
			        // will return status as 0 even though it's a successful request
			        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
			          return;
			        }
			        // readystate handler is calling before onerror or ontimeout handlers,
			        // so we should call onloadend on the next 'tick'
			        setTimeout(onloadend);
			      };
			    }

			    // Handle browser request cancellation (as opposed to a manual cancellation)
			    request.onabort = function handleAbort() {
			      if (!request) {
			        return;
			      }

			      reject(new AxiosError('Request aborted', AxiosError.ECONNABORTED, config, request));

			      // Clean up request
			      request = null;
			    };

			    // Handle low level network errors
			    request.onerror = function handleError() {
			      // Real errors are hidden from us by the browser
			      // onerror should only fire if it's a network error
			      reject(new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request, request));

			      // Clean up request
			      request = null;
			    };

			    // Handle timeout
			    request.ontimeout = function handleTimeout() {
			      var timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
			      var transitional = config.transitional || transitionalDefaults;
			      if (config.timeoutErrorMessage) {
			        timeoutErrorMessage = config.timeoutErrorMessage;
			      }
			      reject(new AxiosError(
			        timeoutErrorMessage,
			        transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
			        config,
			        request));

			      // Clean up request
			      request = null;
			    };

			    // Add xsrf header
			    // This is only done if running in a standard browser environment.
			    // Specifically not if we're in a web worker, or react-native.
			    if (utils.isStandardBrowserEnv()) {
			      // Add xsrf header
			      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
			        cookies.read(config.xsrfCookieName) :
			        undefined;

			      if (xsrfValue) {
			        requestHeaders[config.xsrfHeaderName] = xsrfValue;
			      }
			    }

			    // Add headers to the request
			    if ('setRequestHeader' in request) {
			      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
			        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
			          // Remove Content-Type if data is undefined
			          delete requestHeaders[key];
			        } else {
			          // Otherwise add header to the request
			          request.setRequestHeader(key, val);
			        }
			      });
			    }

			    // Add withCredentials to request if needed
			    if (!utils.isUndefined(config.withCredentials)) {
			      request.withCredentials = !!config.withCredentials;
			    }

			    // Add responseType to request if needed
			    if (responseType && responseType !== 'json') {
			      request.responseType = config.responseType;
			    }

			    // Handle progress if needed
			    if (typeof config.onDownloadProgress === 'function') {
			      request.addEventListener('progress', config.onDownloadProgress);
			    }

			    // Not all browsers support upload events
			    if (typeof config.onUploadProgress === 'function' && request.upload) {
			      request.upload.addEventListener('progress', config.onUploadProgress);
			    }

			    if (config.cancelToken || config.signal) {
			      // Handle cancellation
			      // eslint-disable-next-line func-names
			      onCanceled = function(cancel) {
			        if (!request) {
			          return;
			        }
			        reject(!cancel || (cancel && cancel.type) ? new CanceledError() : cancel);
			        request.abort();
			        request = null;
			      };

			      config.cancelToken && config.cancelToken.subscribe(onCanceled);
			      if (config.signal) {
			        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
			      }
			    }

			    if (!requestData) {
			      requestData = null;
			    }

			    var protocol = parseProtocol(fullPath);

			    if (protocol && [ 'http', 'https', 'file' ].indexOf(protocol) === -1) {
			      reject(new AxiosError('Unsupported protocol ' + protocol + ':', AxiosError.ERR_BAD_REQUEST, config));
			      return;
			    }


			    // Send the request
			    request.send(requestData);
			  });
			};


			/***/ }),

			/***/ "./lib/axios.js":
			/*!**********************!*\
			  !*** ./lib/axios.js ***!
			  \**********************/
			/*! no static exports found */
			/***/ (function(module, exports, __webpack_require__) {


			var utils = __webpack_require__(/*! ./utils */ "./lib/utils.js");
			var bind = __webpack_require__(/*! ./helpers/bind */ "./lib/helpers/bind.js");
			var Axios = __webpack_require__(/*! ./core/Axios */ "./lib/core/Axios.js");
			var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./lib/core/mergeConfig.js");
			var defaults = __webpack_require__(/*! ./defaults */ "./lib/defaults/index.js");

			/**
			 * Create an instance of Axios
			 *
			 * @param {Object} defaultConfig The default config for the instance
			 * @return {Axios} A new instance of Axios
			 */
			function createInstance(defaultConfig) {
			  var context = new Axios(defaultConfig);
			  var instance = bind(Axios.prototype.request, context);

			  // Copy axios.prototype to instance
			  utils.extend(instance, Axios.prototype, context);

			  // Copy context to instance
			  utils.extend(instance, context);

			  // Factory for creating new instances
			  instance.create = function create(instanceConfig) {
			    return createInstance(mergeConfig(defaultConfig, instanceConfig));
			  };

			  return instance;
			}

			// Create the default instance to be exported
			var axios = createInstance(defaults);

			// Expose Axios class to allow class inheritance
			axios.Axios = Axios;

			// Expose Cancel & CancelToken
			axios.CanceledError = __webpack_require__(/*! ./cancel/CanceledError */ "./lib/cancel/CanceledError.js");
			axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./lib/cancel/CancelToken.js");
			axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./lib/cancel/isCancel.js");
			axios.VERSION = __webpack_require__(/*! ./env/data */ "./lib/env/data.js").version;
			axios.toFormData = __webpack_require__(/*! ./helpers/toFormData */ "./lib/helpers/toFormData.js");

			// Expose AxiosError class
			axios.AxiosError = __webpack_require__(/*! ../lib/core/AxiosError */ "./lib/core/AxiosError.js");

			// alias for CanceledError for backward compatibility
			axios.Cancel = axios.CanceledError;

			// Expose all/spread
			axios.all = function all(promises) {
			  return Promise.all(promises);
			};
			axios.spread = __webpack_require__(/*! ./helpers/spread */ "./lib/helpers/spread.js");

			// Expose isAxiosError
			axios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ "./lib/helpers/isAxiosError.js");

			module.exports = axios;

			// Allow use of default import syntax in TypeScript
			module.exports.default = axios;


			/***/ }),

			/***/ "./lib/cancel/CancelToken.js":
			/*!***********************************!*\
			  !*** ./lib/cancel/CancelToken.js ***!
			  \***********************************/
			/*! no static exports found */
			/***/ (function(module, exports, __webpack_require__) {


			var CanceledError = __webpack_require__(/*! ./CanceledError */ "./lib/cancel/CanceledError.js");

			/**
			 * A `CancelToken` is an object that can be used to request cancellation of an operation.
			 *
			 * @class
			 * @param {Function} executor The executor function.
			 */
			function CancelToken(executor) {
			  if (typeof executor !== 'function') {
			    throw new TypeError('executor must be a function.');
			  }

			  var resolvePromise;

			  this.promise = new Promise(function promiseExecutor(resolve) {
			    resolvePromise = resolve;
			  });

			  var token = this;

			  // eslint-disable-next-line func-names
			  this.promise.then(function(cancel) {
			    if (!token._listeners) return;

			    var i;
			    var l = token._listeners.length;

			    for (i = 0; i < l; i++) {
			      token._listeners[i](cancel);
			    }
			    token._listeners = null;
			  });

			  // eslint-disable-next-line func-names
			  this.promise.then = function(onfulfilled) {
			    var _resolve;
			    // eslint-disable-next-line func-names
			    var promise = new Promise(function(resolve) {
			      token.subscribe(resolve);
			      _resolve = resolve;
			    }).then(onfulfilled);

			    promise.cancel = function reject() {
			      token.unsubscribe(_resolve);
			    };

			    return promise;
			  };

			  executor(function cancel(message) {
			    if (token.reason) {
			      // Cancellation has already been requested
			      return;
			    }

			    token.reason = new CanceledError(message);
			    resolvePromise(token.reason);
			  });
			}

			/**
			 * Throws a `CanceledError` if cancellation has been requested.
			 */
			CancelToken.prototype.throwIfRequested = function throwIfRequested() {
			  if (this.reason) {
			    throw this.reason;
			  }
			};

			/**
			 * Subscribe to the cancel signal
			 */

			CancelToken.prototype.subscribe = function subscribe(listener) {
			  if (this.reason) {
			    listener(this.reason);
			    return;
			  }

			  if (this._listeners) {
			    this._listeners.push(listener);
			  } else {
			    this._listeners = [listener];
			  }
			};

			/**
			 * Unsubscribe from the cancel signal
			 */

			CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
			  if (!this._listeners) {
			    return;
			  }
			  var index = this._listeners.indexOf(listener);
			  if (index !== -1) {
			    this._listeners.splice(index, 1);
			  }
			};

			/**
			 * Returns an object that contains a new `CancelToken` and a function that, when called,
			 * cancels the `CancelToken`.
			 */
			CancelToken.source = function source() {
			  var cancel;
			  var token = new CancelToken(function executor(c) {
			    cancel = c;
			  });
			  return {
			    token: token,
			    cancel: cancel
			  };
			};

			module.exports = CancelToken;


			/***/ }),

			/***/ "./lib/cancel/CanceledError.js":
			/*!*************************************!*\
			  !*** ./lib/cancel/CanceledError.js ***!
			  \*************************************/
			/*! no static exports found */
			/***/ (function(module, exports, __webpack_require__) {


			var AxiosError = __webpack_require__(/*! ../core/AxiosError */ "./lib/core/AxiosError.js");
			var utils = __webpack_require__(/*! ../utils */ "./lib/utils.js");

			/**
			 * A `CanceledError` is an object that is thrown when an operation is canceled.
			 *
			 * @class
			 * @param {string=} message The message.
			 */
			function CanceledError(message) {
			  // eslint-disable-next-line no-eq-null,eqeqeq
			  AxiosError.call(this, message == null ? 'canceled' : message, AxiosError.ERR_CANCELED);
			  this.name = 'CanceledError';
			}

			utils.inherits(CanceledError, AxiosError, {
			  __CANCEL__: true
			});

			module.exports = CanceledError;


			/***/ }),

			/***/ "./lib/cancel/isCancel.js":
			/*!********************************!*\
			  !*** ./lib/cancel/isCancel.js ***!
			  \********************************/
			/*! no static exports found */
			/***/ (function(module, exports, __webpack_require__) {


			module.exports = function isCancel(value) {
			  return !!(value && value.__CANCEL__);
			};


			/***/ }),

			/***/ "./lib/core/Axios.js":
			/*!***************************!*\
			  !*** ./lib/core/Axios.js ***!
			  \***************************/
			/*! no static exports found */
			/***/ (function(module, exports, __webpack_require__) {


			var utils = __webpack_require__(/*! ./../utils */ "./lib/utils.js");
			var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./lib/helpers/buildURL.js");
			var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./lib/core/InterceptorManager.js");
			var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./lib/core/dispatchRequest.js");
			var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./lib/core/mergeConfig.js");
			var buildFullPath = __webpack_require__(/*! ./buildFullPath */ "./lib/core/buildFullPath.js");
			var validator = __webpack_require__(/*! ../helpers/validator */ "./lib/helpers/validator.js");

			var validators = validator.validators;
			/**
			 * Create a new instance of Axios
			 *
			 * @param {Object} instanceConfig The default config for the instance
			 */
			function Axios(instanceConfig) {
			  this.defaults = instanceConfig;
			  this.interceptors = {
			    request: new InterceptorManager(),
			    response: new InterceptorManager()
			  };
			}

			/**
			 * Dispatch a request
			 *
			 * @param {Object} config The config specific for this request (merged with this.defaults)
			 */
			Axios.prototype.request = function request(configOrUrl, config) {
			  /*eslint no-param-reassign:0*/
			  // Allow for axios('example/url'[, config]) a la fetch API
			  if (typeof configOrUrl === 'string') {
			    config = config || {};
			    config.url = configOrUrl;
			  } else {
			    config = configOrUrl || {};
			  }

			  config = mergeConfig(this.defaults, config);

			  // Set config.method
			  if (config.method) {
			    config.method = config.method.toLowerCase();
			  } else if (this.defaults.method) {
			    config.method = this.defaults.method.toLowerCase();
			  } else {
			    config.method = 'get';
			  }

			  var transitional = config.transitional;

			  if (transitional !== undefined) {
			    validator.assertOptions(transitional, {
			      silentJSONParsing: validators.transitional(validators.boolean),
			      forcedJSONParsing: validators.transitional(validators.boolean),
			      clarifyTimeoutError: validators.transitional(validators.boolean)
			    }, false);
			  }

			  // filter out skipped interceptors
			  var requestInterceptorChain = [];
			  var synchronousRequestInterceptors = true;
			  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
			    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
			      return;
			    }

			    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

			    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
			  });

			  var responseInterceptorChain = [];
			  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
			    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
			  });

			  var promise;

			  if (!synchronousRequestInterceptors) {
			    var chain = [dispatchRequest, undefined];

			    Array.prototype.unshift.apply(chain, requestInterceptorChain);
			    chain = chain.concat(responseInterceptorChain);

			    promise = Promise.resolve(config);
			    while (chain.length) {
			      promise = promise.then(chain.shift(), chain.shift());
			    }

			    return promise;
			  }


			  var newConfig = config;
			  while (requestInterceptorChain.length) {
			    var onFulfilled = requestInterceptorChain.shift();
			    var onRejected = requestInterceptorChain.shift();
			    try {
			      newConfig = onFulfilled(newConfig);
			    } catch (error) {
			      onRejected(error);
			      break;
			    }
			  }

			  try {
			    promise = dispatchRequest(newConfig);
			  } catch (error) {
			    return Promise.reject(error);
			  }

			  while (responseInterceptorChain.length) {
			    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
			  }

			  return promise;
			};

			Axios.prototype.getUri = function getUri(config) {
			  config = mergeConfig(this.defaults, config);
			  var fullPath = buildFullPath(config.baseURL, config.url);
			  return buildURL(fullPath, config.params, config.paramsSerializer);
			};

			// Provide aliases for supported request methods
			utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
			  /*eslint func-names:0*/
			  Axios.prototype[method] = function(url, config) {
			    return this.request(mergeConfig(config || {}, {
			      method: method,
			      url: url,
			      data: (config || {}).data
			    }));
			  };
			});

			utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
			  /*eslint func-names:0*/

			  function generateHTTPMethod(isForm) {
			    return function httpMethod(url, data, config) {
			      return this.request(mergeConfig(config || {}, {
			        method: method,
			        headers: isForm ? {
			          'Content-Type': 'multipart/form-data'
			        } : {},
			        url: url,
			        data: data
			      }));
			    };
			  }

			  Axios.prototype[method] = generateHTTPMethod();

			  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
			});

			module.exports = Axios;


			/***/ }),

			/***/ "./lib/core/AxiosError.js":
			/*!********************************!*\
			  !*** ./lib/core/AxiosError.js ***!
			  \********************************/
			/*! no static exports found */
			/***/ (function(module, exports, __webpack_require__) {


			var utils = __webpack_require__(/*! ../utils */ "./lib/utils.js");

			/**
			 * Create an Error with the specified message, config, error code, request and response.
			 *
			 * @param {string} message The error message.
			 * @param {string} [code] The error code (for example, 'ECONNABORTED').
			 * @param {Object} [config] The config.
			 * @param {Object} [request] The request.
			 * @param {Object} [response] The response.
			 * @returns {Error} The created error.
			 */
			function AxiosError(message, code, config, request, response) {
			  Error.call(this);
			  this.message = message;
			  this.name = 'AxiosError';
			  code && (this.code = code);
			  config && (this.config = config);
			  request && (this.request = request);
			  response && (this.response = response);
			}

			utils.inherits(AxiosError, Error, {
			  toJSON: function toJSON() {
			    return {
			      // Standard
			      message: this.message,
			      name: this.name,
			      // Microsoft
			      description: this.description,
			      number: this.number,
			      // Mozilla
			      fileName: this.fileName,
			      lineNumber: this.lineNumber,
			      columnNumber: this.columnNumber,
			      stack: this.stack,
			      // Axios
			      config: this.config,
			      code: this.code,
			      status: this.response && this.response.status ? this.response.status : null
			    };
			  }
			});

			var prototype = AxiosError.prototype;
			var descriptors = {};

			[
			  'ERR_BAD_OPTION_VALUE',
			  'ERR_BAD_OPTION',
			  'ECONNABORTED',
			  'ETIMEDOUT',
			  'ERR_NETWORK',
			  'ERR_FR_TOO_MANY_REDIRECTS',
			  'ERR_DEPRECATED',
			  'ERR_BAD_RESPONSE',
			  'ERR_BAD_REQUEST',
			  'ERR_CANCELED'
			// eslint-disable-next-line func-names
			].forEach(function(code) {
			  descriptors[code] = {value: code};
			});

			Object.defineProperties(AxiosError, descriptors);
			Object.defineProperty(prototype, 'isAxiosError', {value: true});

			// eslint-disable-next-line func-names
			AxiosError.from = function(error, code, config, request, response, customProps) {
			  var axiosError = Object.create(prototype);

			  utils.toFlatObject(error, axiosError, function filter(obj) {
			    return obj !== Error.prototype;
			  });

			  AxiosError.call(axiosError, error.message, code, config, request, response);

			  axiosError.name = error.name;

			  customProps && Object.assign(axiosError, customProps);

			  return axiosError;
			};

			module.exports = AxiosError;


			/***/ }),

			/***/ "./lib/core/InterceptorManager.js":
			/*!****************************************!*\
			  !*** ./lib/core/InterceptorManager.js ***!
			  \****************************************/
			/*! no static exports found */
			/***/ (function(module, exports, __webpack_require__) {


			var utils = __webpack_require__(/*! ./../utils */ "./lib/utils.js");

			function InterceptorManager() {
			  this.handlers = [];
			}

			/**
			 * Add a new interceptor to the stack
			 *
			 * @param {Function} fulfilled The function to handle `then` for a `Promise`
			 * @param {Function} rejected The function to handle `reject` for a `Promise`
			 *
			 * @return {Number} An ID used to remove interceptor later
			 */
			InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
			  this.handlers.push({
			    fulfilled: fulfilled,
			    rejected: rejected,
			    synchronous: options ? options.synchronous : false,
			    runWhen: options ? options.runWhen : null
			  });
			  return this.handlers.length - 1;
			};

			/**
			 * Remove an interceptor from the stack
			 *
			 * @param {Number} id The ID that was returned by `use`
			 */
			InterceptorManager.prototype.eject = function eject(id) {
			  if (this.handlers[id]) {
			    this.handlers[id] = null;
			  }
			};

			/**
			 * Iterate over all the registered interceptors
			 *
			 * This method is particularly useful for skipping over any
			 * interceptors that may have become `null` calling `eject`.
			 *
			 * @param {Function} fn The function to call for each interceptor
			 */
			InterceptorManager.prototype.forEach = function forEach(fn) {
			  utils.forEach(this.handlers, function forEachHandler(h) {
			    if (h !== null) {
			      fn(h);
			    }
			  });
			};

			module.exports = InterceptorManager;


			/***/ }),

			/***/ "./lib/core/buildFullPath.js":
			/*!***********************************!*\
			  !*** ./lib/core/buildFullPath.js ***!
			  \***********************************/
			/*! no static exports found */
			/***/ (function(module, exports, __webpack_require__) {


			var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./lib/helpers/isAbsoluteURL.js");
			var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./lib/helpers/combineURLs.js");

			/**
			 * Creates a new URL by combining the baseURL with the requestedURL,
			 * only when the requestedURL is not already an absolute URL.
			 * If the requestURL is absolute, this function returns the requestedURL untouched.
			 *
			 * @param {string} baseURL The base URL
			 * @param {string} requestedURL Absolute or relative URL to combine
			 * @returns {string} The combined full path
			 */
			module.exports = function buildFullPath(baseURL, requestedURL) {
			  if (baseURL && !isAbsoluteURL(requestedURL)) {
			    return combineURLs(baseURL, requestedURL);
			  }
			  return requestedURL;
			};


			/***/ }),

			/***/ "./lib/core/dispatchRequest.js":
			/*!*************************************!*\
			  !*** ./lib/core/dispatchRequest.js ***!
			  \*************************************/
			/*! no static exports found */
			/***/ (function(module, exports, __webpack_require__) {


			var utils = __webpack_require__(/*! ./../utils */ "./lib/utils.js");
			var transformData = __webpack_require__(/*! ./transformData */ "./lib/core/transformData.js");
			var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./lib/cancel/isCancel.js");
			var defaults = __webpack_require__(/*! ../defaults */ "./lib/defaults/index.js");
			var CanceledError = __webpack_require__(/*! ../cancel/CanceledError */ "./lib/cancel/CanceledError.js");

			/**
			 * Throws a `CanceledError` if cancellation has been requested.
			 */
			function throwIfCancellationRequested(config) {
			  if (config.cancelToken) {
			    config.cancelToken.throwIfRequested();
			  }

			  if (config.signal && config.signal.aborted) {
			    throw new CanceledError();
			  }
			}

			/**
			 * Dispatch a request to the server using the configured adapter.
			 *
			 * @param {object} config The config that is to be used for the request
			 * @returns {Promise} The Promise to be fulfilled
			 */
			module.exports = function dispatchRequest(config) {
			  throwIfCancellationRequested(config);

			  // Ensure headers exist
			  config.headers = config.headers || {};

			  // Transform request data
			  config.data = transformData.call(
			    config,
			    config.data,
			    config.headers,
			    config.transformRequest
			  );

			  // Flatten headers
			  config.headers = utils.merge(
			    config.headers.common || {},
			    config.headers[config.method] || {},
			    config.headers
			  );

			  utils.forEach(
			    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
			    function cleanHeaderConfig(method) {
			      delete config.headers[method];
			    }
			  );

			  var adapter = config.adapter || defaults.adapter;

			  return adapter(config).then(function onAdapterResolution(response) {
			    throwIfCancellationRequested(config);

			    // Transform response data
			    response.data = transformData.call(
			      config,
			      response.data,
			      response.headers,
			      config.transformResponse
			    );

			    return response;
			  }, function onAdapterRejection(reason) {
			    if (!isCancel(reason)) {
			      throwIfCancellationRequested(config);

			      // Transform response data
			      if (reason && reason.response) {
			        reason.response.data = transformData.call(
			          config,
			          reason.response.data,
			          reason.response.headers,
			          config.transformResponse
			        );
			      }
			    }

			    return Promise.reject(reason);
			  });
			};


			/***/ }),

			/***/ "./lib/core/mergeConfig.js":
			/*!*********************************!*\
			  !*** ./lib/core/mergeConfig.js ***!
			  \*********************************/
			/*! no static exports found */
			/***/ (function(module, exports, __webpack_require__) {


			var utils = __webpack_require__(/*! ../utils */ "./lib/utils.js");

			/**
			 * Config-specific merge-function which creates a new config-object
			 * by merging two configuration objects together.
			 *
			 * @param {Object} config1
			 * @param {Object} config2
			 * @returns {Object} New object resulting from merging config2 to config1
			 */
			module.exports = function mergeConfig(config1, config2) {
			  // eslint-disable-next-line no-param-reassign
			  config2 = config2 || {};
			  var config = {};

			  function getMergedValue(target, source) {
			    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
			      return utils.merge(target, source);
			    } else if (utils.isPlainObject(source)) {
			      return utils.merge({}, source);
			    } else if (utils.isArray(source)) {
			      return source.slice();
			    }
			    return source;
			  }

			  // eslint-disable-next-line consistent-return
			  function mergeDeepProperties(prop) {
			    if (!utils.isUndefined(config2[prop])) {
			      return getMergedValue(config1[prop], config2[prop]);
			    } else if (!utils.isUndefined(config1[prop])) {
			      return getMergedValue(undefined, config1[prop]);
			    }
			  }

			  // eslint-disable-next-line consistent-return
			  function valueFromConfig2(prop) {
			    if (!utils.isUndefined(config2[prop])) {
			      return getMergedValue(undefined, config2[prop]);
			    }
			  }

			  // eslint-disable-next-line consistent-return
			  function defaultToConfig2(prop) {
			    if (!utils.isUndefined(config2[prop])) {
			      return getMergedValue(undefined, config2[prop]);
			    } else if (!utils.isUndefined(config1[prop])) {
			      return getMergedValue(undefined, config1[prop]);
			    }
			  }

			  // eslint-disable-next-line consistent-return
			  function mergeDirectKeys(prop) {
			    if (prop in config2) {
			      return getMergedValue(config1[prop], config2[prop]);
			    } else if (prop in config1) {
			      return getMergedValue(undefined, config1[prop]);
			    }
			  }

			  var mergeMap = {
			    'url': valueFromConfig2,
			    'method': valueFromConfig2,
			    'data': valueFromConfig2,
			    'baseURL': defaultToConfig2,
			    'transformRequest': defaultToConfig2,
			    'transformResponse': defaultToConfig2,
			    'paramsSerializer': defaultToConfig2,
			    'timeout': defaultToConfig2,
			    'timeoutMessage': defaultToConfig2,
			    'withCredentials': defaultToConfig2,
			    'adapter': defaultToConfig2,
			    'responseType': defaultToConfig2,
			    'xsrfCookieName': defaultToConfig2,
			    'xsrfHeaderName': defaultToConfig2,
			    'onUploadProgress': defaultToConfig2,
			    'onDownloadProgress': defaultToConfig2,
			    'decompress': defaultToConfig2,
			    'maxContentLength': defaultToConfig2,
			    'maxBodyLength': defaultToConfig2,
			    'beforeRedirect': defaultToConfig2,
			    'transport': defaultToConfig2,
			    'httpAgent': defaultToConfig2,
			    'httpsAgent': defaultToConfig2,
			    'cancelToken': defaultToConfig2,
			    'socketPath': defaultToConfig2,
			    'responseEncoding': defaultToConfig2,
			    'validateStatus': mergeDirectKeys
			  };

			  utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
			    var merge = mergeMap[prop] || mergeDeepProperties;
			    var configValue = merge(prop);
			    (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
			  });

			  return config;
			};


			/***/ }),

			/***/ "./lib/core/settle.js":
			/*!****************************!*\
			  !*** ./lib/core/settle.js ***!
			  \****************************/
			/*! no static exports found */
			/***/ (function(module, exports, __webpack_require__) {


			var AxiosError = __webpack_require__(/*! ./AxiosError */ "./lib/core/AxiosError.js");

			/**
			 * Resolve or reject a Promise based on response status.
			 *
			 * @param {Function} resolve A function that resolves the promise.
			 * @param {Function} reject A function that rejects the promise.
			 * @param {object} response The response.
			 */
			module.exports = function settle(resolve, reject, response) {
			  var validateStatus = response.config.validateStatus;
			  if (!response.status || !validateStatus || validateStatus(response.status)) {
			    resolve(response);
			  } else {
			    reject(new AxiosError(
			      'Request failed with status code ' + response.status,
			      [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
			      response.config,
			      response.request,
			      response
			    ));
			  }
			};


			/***/ }),

			/***/ "./lib/core/transformData.js":
			/*!***********************************!*\
			  !*** ./lib/core/transformData.js ***!
			  \***********************************/
			/*! no static exports found */
			/***/ (function(module, exports, __webpack_require__) {


			var utils = __webpack_require__(/*! ./../utils */ "./lib/utils.js");
			var defaults = __webpack_require__(/*! ../defaults */ "./lib/defaults/index.js");

			/**
			 * Transform the data for a request or a response
			 *
			 * @param {Object|String} data The data to be transformed
			 * @param {Array} headers The headers for the request or response
			 * @param {Array|Function} fns A single function or Array of functions
			 * @returns {*} The resulting transformed data
			 */
			module.exports = function transformData(data, headers, fns) {
			  var context = this || defaults;
			  /*eslint no-param-reassign:0*/
			  utils.forEach(fns, function transform(fn) {
			    data = fn.call(context, data, headers);
			  });

			  return data;
			};


			/***/ }),

			/***/ "./lib/defaults/index.js":
			/*!*******************************!*\
			  !*** ./lib/defaults/index.js ***!
			  \*******************************/
			/*! no static exports found */
			/***/ (function(module, exports, __webpack_require__) {


			var utils = __webpack_require__(/*! ../utils */ "./lib/utils.js");
			var normalizeHeaderName = __webpack_require__(/*! ../helpers/normalizeHeaderName */ "./lib/helpers/normalizeHeaderName.js");
			var AxiosError = __webpack_require__(/*! ../core/AxiosError */ "./lib/core/AxiosError.js");
			var transitionalDefaults = __webpack_require__(/*! ./transitional */ "./lib/defaults/transitional.js");
			var toFormData = __webpack_require__(/*! ../helpers/toFormData */ "./lib/helpers/toFormData.js");

			var DEFAULT_CONTENT_TYPE = {
			  'Content-Type': 'application/x-www-form-urlencoded'
			};

			function setContentTypeIfUnset(headers, value) {
			  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
			    headers['Content-Type'] = value;
			  }
			}

			function getDefaultAdapter() {
			  var adapter;
			  if (typeof XMLHttpRequest !== 'undefined') {
			    // For browsers use XHR adapter
			    adapter = __webpack_require__(/*! ../adapters/xhr */ "./lib/adapters/xhr.js");
			  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
			    // For node use HTTP adapter
			    adapter = __webpack_require__(/*! ../adapters/http */ "./lib/adapters/xhr.js");
			  }
			  return adapter;
			}

			function stringifySafely(rawValue, parser, encoder) {
			  if (utils.isString(rawValue)) {
			    try {
			      (parser || JSON.parse)(rawValue);
			      return utils.trim(rawValue);
			    } catch (e) {
			      if (e.name !== 'SyntaxError') {
			        throw e;
			      }
			    }
			  }

			  return (encoder || JSON.stringify)(rawValue);
			}

			var defaults = {

			  transitional: transitionalDefaults,

			  adapter: getDefaultAdapter(),

			  transformRequest: [function transformRequest(data, headers) {
			    normalizeHeaderName(headers, 'Accept');
			    normalizeHeaderName(headers, 'Content-Type');

			    if (utils.isFormData(data) ||
			      utils.isArrayBuffer(data) ||
			      utils.isBuffer(data) ||
			      utils.isStream(data) ||
			      utils.isFile(data) ||
			      utils.isBlob(data)
			    ) {
			      return data;
			    }
			    if (utils.isArrayBufferView(data)) {
			      return data.buffer;
			    }
			    if (utils.isURLSearchParams(data)) {
			      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
			      return data.toString();
			    }

			    var isObjectPayload = utils.isObject(data);
			    var contentType = headers && headers['Content-Type'];

			    var isFileList;

			    if ((isFileList = utils.isFileList(data)) || (isObjectPayload && contentType === 'multipart/form-data')) {
			      var _FormData = this.env && this.env.FormData;
			      return toFormData(isFileList ? {'files[]': data} : data, _FormData && new _FormData());
			    } else if (isObjectPayload || contentType === 'application/json') {
			      setContentTypeIfUnset(headers, 'application/json');
			      return stringifySafely(data);
			    }

			    return data;
			  }],

			  transformResponse: [function transformResponse(data) {
			    var transitional = this.transitional || defaults.transitional;
			    var silentJSONParsing = transitional && transitional.silentJSONParsing;
			    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
			    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

			    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
			      try {
			        return JSON.parse(data);
			      } catch (e) {
			        if (strictJSONParsing) {
			          if (e.name === 'SyntaxError') {
			            throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
			          }
			          throw e;
			        }
			      }
			    }

			    return data;
			  }],

			  /**
			   * A timeout in milliseconds to abort a request. If set to 0 (default) a
			   * timeout is not created.
			   */
			  timeout: 0,

			  xsrfCookieName: 'XSRF-TOKEN',
			  xsrfHeaderName: 'X-XSRF-TOKEN',

			  maxContentLength: -1,
			  maxBodyLength: -1,

			  env: {
			    FormData: __webpack_require__(/*! ./env/FormData */ "./lib/helpers/null.js")
			  },

			  validateStatus: function validateStatus(status) {
			    return status >= 200 && status < 300;
			  },

			  headers: {
			    common: {
			      'Accept': 'application/json, text/plain, */*'
			    }
			  }
			};

			utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
			  defaults.headers[method] = {};
			});

			utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
			  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
			});

			module.exports = defaults;


			/***/ }),

			/***/ "./lib/defaults/transitional.js":
			/*!**************************************!*\
			  !*** ./lib/defaults/transitional.js ***!
			  \**************************************/
			/*! no static exports found */
			/***/ (function(module, exports, __webpack_require__) {


			module.exports = {
			  silentJSONParsing: true,
			  forcedJSONParsing: true,
			  clarifyTimeoutError: false
			};


			/***/ }),

			/***/ "./lib/env/data.js":
			/*!*************************!*\
			  !*** ./lib/env/data.js ***!
			  \*************************/
			/*! no static exports found */
			/***/ (function(module, exports) {

			module.exports = {
			  "version": "0.27.2"
			};

			/***/ }),

			/***/ "./lib/helpers/bind.js":
			/*!*****************************!*\
			  !*** ./lib/helpers/bind.js ***!
			  \*****************************/
			/*! no static exports found */
			/***/ (function(module, exports, __webpack_require__) {


			module.exports = function bind(fn, thisArg) {
			  return function wrap() {
			    var args = new Array(arguments.length);
			    for (var i = 0; i < args.length; i++) {
			      args[i] = arguments[i];
			    }
			    return fn.apply(thisArg, args);
			  };
			};


			/***/ }),

			/***/ "./lib/helpers/buildURL.js":
			/*!*********************************!*\
			  !*** ./lib/helpers/buildURL.js ***!
			  \*********************************/
			/*! no static exports found */
			/***/ (function(module, exports, __webpack_require__) {


			var utils = __webpack_require__(/*! ./../utils */ "./lib/utils.js");

			function encode(val) {
			  return encodeURIComponent(val).
			    replace(/%3A/gi, ':').
			    replace(/%24/g, '$').
			    replace(/%2C/gi, ',').
			    replace(/%20/g, '+').
			    replace(/%5B/gi, '[').
			    replace(/%5D/gi, ']');
			}

			/**
			 * Build a URL by appending params to the end
			 *
			 * @param {string} url The base of the url (e.g., http://www.google.com)
			 * @param {object} [params] The params to be appended
			 * @returns {string} The formatted url
			 */
			module.exports = function buildURL(url, params, paramsSerializer) {
			  /*eslint no-param-reassign:0*/
			  if (!params) {
			    return url;
			  }

			  var serializedParams;
			  if (paramsSerializer) {
			    serializedParams = paramsSerializer(params);
			  } else if (utils.isURLSearchParams(params)) {
			    serializedParams = params.toString();
			  } else {
			    var parts = [];

			    utils.forEach(params, function serialize(val, key) {
			      if (val === null || typeof val === 'undefined') {
			        return;
			      }

			      if (utils.isArray(val)) {
			        key = key + '[]';
			      } else {
			        val = [val];
			      }

			      utils.forEach(val, function parseValue(v) {
			        if (utils.isDate(v)) {
			          v = v.toISOString();
			        } else if (utils.isObject(v)) {
			          v = JSON.stringify(v);
			        }
			        parts.push(encode(key) + '=' + encode(v));
			      });
			    });

			    serializedParams = parts.join('&');
			  }

			  if (serializedParams) {
			    var hashmarkIndex = url.indexOf('#');
			    if (hashmarkIndex !== -1) {
			      url = url.slice(0, hashmarkIndex);
			    }

			    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
			  }

			  return url;
			};


			/***/ }),

			/***/ "./lib/helpers/combineURLs.js":
			/*!************************************!*\
			  !*** ./lib/helpers/combineURLs.js ***!
			  \************************************/
			/*! no static exports found */
			/***/ (function(module, exports, __webpack_require__) {


			/**
			 * Creates a new URL by combining the specified URLs
			 *
			 * @param {string} baseURL The base URL
			 * @param {string} relativeURL The relative URL
			 * @returns {string} The combined URL
			 */
			module.exports = function combineURLs(baseURL, relativeURL) {
			  return relativeURL
			    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
			    : baseURL;
			};


			/***/ }),

			/***/ "./lib/helpers/cookies.js":
			/*!********************************!*\
			  !*** ./lib/helpers/cookies.js ***!
			  \********************************/
			/*! no static exports found */
			/***/ (function(module, exports, __webpack_require__) {


			var utils = __webpack_require__(/*! ./../utils */ "./lib/utils.js");

			module.exports = (
			  utils.isStandardBrowserEnv() ?

			  // Standard browser envs support document.cookie
			    (function standardBrowserEnv() {
			      return {
			        write: function write(name, value, expires, path, domain, secure) {
			          var cookie = [];
			          cookie.push(name + '=' + encodeURIComponent(value));

			          if (utils.isNumber(expires)) {
			            cookie.push('expires=' + new Date(expires).toGMTString());
			          }

			          if (utils.isString(path)) {
			            cookie.push('path=' + path);
			          }

			          if (utils.isString(domain)) {
			            cookie.push('domain=' + domain);
			          }

			          if (secure === true) {
			            cookie.push('secure');
			          }

			          document.cookie = cookie.join('; ');
			        },

			        read: function read(name) {
			          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
			          return (match ? decodeURIComponent(match[3]) : null);
			        },

			        remove: function remove(name) {
			          this.write(name, '', Date.now() - 86400000);
			        }
			      };
			    })() :

			  // Non standard browser env (web workers, react-native) lack needed support.
			    (function nonStandardBrowserEnv() {
			      return {
			        write: function write() {},
			        read: function read() { return null; },
			        remove: function remove() {}
			      };
			    })()
			);


			/***/ }),

			/***/ "./lib/helpers/isAbsoluteURL.js":
			/*!**************************************!*\
			  !*** ./lib/helpers/isAbsoluteURL.js ***!
			  \**************************************/
			/*! no static exports found */
			/***/ (function(module, exports, __webpack_require__) {


			/**
			 * Determines whether the specified URL is absolute
			 *
			 * @param {string} url The URL to test
			 * @returns {boolean} True if the specified URL is absolute, otherwise false
			 */
			module.exports = function isAbsoluteURL(url) {
			  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
			  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
			  // by any combination of letters, digits, plus, period, or hyphen.
			  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
			};


			/***/ }),

			/***/ "./lib/helpers/isAxiosError.js":
			/*!*************************************!*\
			  !*** ./lib/helpers/isAxiosError.js ***!
			  \*************************************/
			/*! no static exports found */
			/***/ (function(module, exports, __webpack_require__) {


			var utils = __webpack_require__(/*! ./../utils */ "./lib/utils.js");

			/**
			 * Determines whether the payload is an error thrown by Axios
			 *
			 * @param {*} payload The value to test
			 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
			 */
			module.exports = function isAxiosError(payload) {
			  return utils.isObject(payload) && (payload.isAxiosError === true);
			};


			/***/ }),

			/***/ "./lib/helpers/isURLSameOrigin.js":
			/*!****************************************!*\
			  !*** ./lib/helpers/isURLSameOrigin.js ***!
			  \****************************************/
			/*! no static exports found */
			/***/ (function(module, exports, __webpack_require__) {


			var utils = __webpack_require__(/*! ./../utils */ "./lib/utils.js");

			module.exports = (
			  utils.isStandardBrowserEnv() ?

			  // Standard browser envs have full support of the APIs needed to test
			  // whether the request URL is of the same origin as current location.
			    (function standardBrowserEnv() {
			      var msie = /(msie|trident)/i.test(navigator.userAgent);
			      var urlParsingNode = document.createElement('a');
			      var originURL;

			      /**
			    * Parse a URL to discover it's components
			    *
			    * @param {String} url The URL to be parsed
			    * @returns {Object}
			    */
			      function resolveURL(url) {
			        var href = url;

			        if (msie) {
			        // IE needs attribute set twice to normalize properties
			          urlParsingNode.setAttribute('href', href);
			          href = urlParsingNode.href;
			        }

			        urlParsingNode.setAttribute('href', href);

			        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
			        return {
			          href: urlParsingNode.href,
			          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
			          host: urlParsingNode.host,
			          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
			          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
			          hostname: urlParsingNode.hostname,
			          port: urlParsingNode.port,
			          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
			            urlParsingNode.pathname :
			            '/' + urlParsingNode.pathname
			        };
			      }

			      originURL = resolveURL(window.location.href);

			      /**
			    * Determine if a URL shares the same origin as the current location
			    *
			    * @param {String} requestURL The URL to test
			    * @returns {boolean} True if URL shares the same origin, otherwise false
			    */
			      return function isURLSameOrigin(requestURL) {
			        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
			        return (parsed.protocol === originURL.protocol &&
			            parsed.host === originURL.host);
			      };
			    })() :

			  // Non standard browser envs (web workers, react-native) lack needed support.
			    (function nonStandardBrowserEnv() {
			      return function isURLSameOrigin() {
			        return true;
			      };
			    })()
			);


			/***/ }),

			/***/ "./lib/helpers/normalizeHeaderName.js":
			/*!********************************************!*\
			  !*** ./lib/helpers/normalizeHeaderName.js ***!
			  \********************************************/
			/*! no static exports found */
			/***/ (function(module, exports, __webpack_require__) {


			var utils = __webpack_require__(/*! ../utils */ "./lib/utils.js");

			module.exports = function normalizeHeaderName(headers, normalizedName) {
			  utils.forEach(headers, function processHeader(value, name) {
			    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
			      headers[normalizedName] = value;
			      delete headers[name];
			    }
			  });
			};


			/***/ }),

			/***/ "./lib/helpers/null.js":
			/*!*****************************!*\
			  !*** ./lib/helpers/null.js ***!
			  \*****************************/
			/*! no static exports found */
			/***/ (function(module, exports) {

			// eslint-disable-next-line strict
			module.exports = null;


			/***/ }),

			/***/ "./lib/helpers/parseHeaders.js":
			/*!*************************************!*\
			  !*** ./lib/helpers/parseHeaders.js ***!
			  \*************************************/
			/*! no static exports found */
			/***/ (function(module, exports, __webpack_require__) {


			var utils = __webpack_require__(/*! ./../utils */ "./lib/utils.js");

			// Headers whose duplicates are ignored by node
			// c.f. https://nodejs.org/api/http.html#http_message_headers
			var ignoreDuplicateOf = [
			  'age', 'authorization', 'content-length', 'content-type', 'etag',
			  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
			  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
			  'referer', 'retry-after', 'user-agent'
			];

			/**
			 * Parse headers into an object
			 *
			 * ```
			 * Date: Wed, 27 Aug 2014 08:58:49 GMT
			 * Content-Type: application/json
			 * Connection: keep-alive
			 * Transfer-Encoding: chunked
			 * ```
			 *
			 * @param {String} headers Headers needing to be parsed
			 * @returns {Object} Headers parsed into an object
			 */
			module.exports = function parseHeaders(headers) {
			  var parsed = {};
			  var key;
			  var val;
			  var i;

			  if (!headers) { return parsed; }

			  utils.forEach(headers.split('\n'), function parser(line) {
			    i = line.indexOf(':');
			    key = utils.trim(line.substr(0, i)).toLowerCase();
			    val = utils.trim(line.substr(i + 1));

			    if (key) {
			      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
			        return;
			      }
			      if (key === 'set-cookie') {
			        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
			      } else {
			        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
			      }
			    }
			  });

			  return parsed;
			};


			/***/ }),

			/***/ "./lib/helpers/parseProtocol.js":
			/*!**************************************!*\
			  !*** ./lib/helpers/parseProtocol.js ***!
			  \**************************************/
			/*! no static exports found */
			/***/ (function(module, exports, __webpack_require__) {


			module.exports = function parseProtocol(url) {
			  var match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
			  return match && match[1] || '';
			};


			/***/ }),

			/***/ "./lib/helpers/spread.js":
			/*!*******************************!*\
			  !*** ./lib/helpers/spread.js ***!
			  \*******************************/
			/*! no static exports found */
			/***/ (function(module, exports, __webpack_require__) {


			/**
			 * Syntactic sugar for invoking a function and expanding an array for arguments.
			 *
			 * Common use case would be to use `Function.prototype.apply`.
			 *
			 *  ```js
			 *  function f(x, y, z) {}
			 *  var args = [1, 2, 3];
			 *  f.apply(null, args);
			 *  ```
			 *
			 * With `spread` this example can be re-written.
			 *
			 *  ```js
			 *  spread(function(x, y, z) {})([1, 2, 3]);
			 *  ```
			 *
			 * @param {Function} callback
			 * @returns {Function}
			 */
			module.exports = function spread(callback) {
			  return function wrap(arr) {
			    return callback.apply(null, arr);
			  };
			};


			/***/ }),

			/***/ "./lib/helpers/toFormData.js":
			/*!***********************************!*\
			  !*** ./lib/helpers/toFormData.js ***!
			  \***********************************/
			/*! no static exports found */
			/***/ (function(module, exports, __webpack_require__) {


			var utils = __webpack_require__(/*! ../utils */ "./lib/utils.js");

			/**
			 * Convert a data object to FormData
			 * @param {Object} obj
			 * @param {?Object} [formData]
			 * @returns {Object}
			 **/

			function toFormData(obj, formData) {
			  // eslint-disable-next-line no-param-reassign
			  formData = formData || new FormData();

			  var stack = [];

			  function convertValue(value) {
			    if (value === null) return '';

			    if (utils.isDate(value)) {
			      return value.toISOString();
			    }

			    if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
			      return typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
			    }

			    return value;
			  }

			  function build(data, parentKey) {
			    if (utils.isPlainObject(data) || utils.isArray(data)) {
			      if (stack.indexOf(data) !== -1) {
			        throw Error('Circular reference detected in ' + parentKey);
			      }

			      stack.push(data);

			      utils.forEach(data, function each(value, key) {
			        if (utils.isUndefined(value)) return;
			        var fullKey = parentKey ? parentKey + '.' + key : key;
			        var arr;

			        if (value && !parentKey && typeof value === 'object') {
			          if (utils.endsWith(key, '{}')) {
			            // eslint-disable-next-line no-param-reassign
			            value = JSON.stringify(value);
			          } else if (utils.endsWith(key, '[]') && (arr = utils.toArray(value))) {
			            // eslint-disable-next-line func-names
			            arr.forEach(function(el) {
			              !utils.isUndefined(el) && formData.append(fullKey, convertValue(el));
			            });
			            return;
			          }
			        }

			        build(value, fullKey);
			      });

			      stack.pop();
			    } else {
			      formData.append(parentKey, convertValue(data));
			    }
			  }

			  build(obj);

			  return formData;
			}

			module.exports = toFormData;


			/***/ }),

			/***/ "./lib/helpers/validator.js":
			/*!**********************************!*\
			  !*** ./lib/helpers/validator.js ***!
			  \**********************************/
			/*! no static exports found */
			/***/ (function(module, exports, __webpack_require__) {


			var VERSION = __webpack_require__(/*! ../env/data */ "./lib/env/data.js").version;
			var AxiosError = __webpack_require__(/*! ../core/AxiosError */ "./lib/core/AxiosError.js");

			var validators = {};

			// eslint-disable-next-line func-names
			['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
			  validators[type] = function validator(thing) {
			    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
			  };
			});

			var deprecatedWarnings = {};

			/**
			 * Transitional option validator
			 * @param {function|boolean?} validator - set to false if the transitional option has been removed
			 * @param {string?} version - deprecated version / removed since version
			 * @param {string?} message - some message with additional info
			 * @returns {function}
			 */
			validators.transitional = function transitional(validator, version, message) {
			  function formatMessage(opt, desc) {
			    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
			  }

			  // eslint-disable-next-line func-names
			  return function(value, opt, opts) {
			    if (validator === false) {
			      throw new AxiosError(
			        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
			        AxiosError.ERR_DEPRECATED
			      );
			    }

			    if (version && !deprecatedWarnings[opt]) {
			      deprecatedWarnings[opt] = true;
			      // eslint-disable-next-line no-console
			      console.warn(
			        formatMessage(
			          opt,
			          ' has been deprecated since v' + version + ' and will be removed in the near future'
			        )
			      );
			    }

			    return validator ? validator(value, opt, opts) : true;
			  };
			};

			/**
			 * Assert object's properties type
			 * @param {object} options
			 * @param {object} schema
			 * @param {boolean?} allowUnknown
			 */

			function assertOptions(options, schema, allowUnknown) {
			  if (typeof options !== 'object') {
			    throw new AxiosError('options must be an object', AxiosError.ERR_BAD_OPTION_VALUE);
			  }
			  var keys = Object.keys(options);
			  var i = keys.length;
			  while (i-- > 0) {
			    var opt = keys[i];
			    var validator = schema[opt];
			    if (validator) {
			      var value = options[opt];
			      var result = value === undefined || validator(value, opt, options);
			      if (result !== true) {
			        throw new AxiosError('option ' + opt + ' must be ' + result, AxiosError.ERR_BAD_OPTION_VALUE);
			      }
			      continue;
			    }
			    if (allowUnknown !== true) {
			      throw new AxiosError('Unknown option ' + opt, AxiosError.ERR_BAD_OPTION);
			    }
			  }
			}

			module.exports = {
			  assertOptions: assertOptions,
			  validators: validators
			};


			/***/ }),

			/***/ "./lib/utils.js":
			/*!**********************!*\
			  !*** ./lib/utils.js ***!
			  \**********************/
			/*! no static exports found */
			/***/ (function(module, exports, __webpack_require__) {


			var bind = __webpack_require__(/*! ./helpers/bind */ "./lib/helpers/bind.js");

			// utils is a library of generic helper functions non-specific to axios

			var toString = Object.prototype.toString;

			// eslint-disable-next-line func-names
			var kindOf = (function(cache) {
			  // eslint-disable-next-line func-names
			  return function(thing) {
			    var str = toString.call(thing);
			    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
			  };
			})(Object.create(null));

			function kindOfTest(type) {
			  type = type.toLowerCase();
			  return function isKindOf(thing) {
			    return kindOf(thing) === type;
			  };
			}

			/**
			 * Determine if a value is an Array
			 *
			 * @param {Object} val The value to test
			 * @returns {boolean} True if value is an Array, otherwise false
			 */
			function isArray(val) {
			  return Array.isArray(val);
			}

			/**
			 * Determine if a value is undefined
			 *
			 * @param {Object} val The value to test
			 * @returns {boolean} True if the value is undefined, otherwise false
			 */
			function isUndefined(val) {
			  return typeof val === 'undefined';
			}

			/**
			 * Determine if a value is a Buffer
			 *
			 * @param {Object} val The value to test
			 * @returns {boolean} True if value is a Buffer, otherwise false
			 */
			function isBuffer(val) {
			  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
			    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
			}

			/**
			 * Determine if a value is an ArrayBuffer
			 *
			 * @function
			 * @param {Object} val The value to test
			 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
			 */
			var isArrayBuffer = kindOfTest('ArrayBuffer');


			/**
			 * Determine if a value is a view on an ArrayBuffer
			 *
			 * @param {Object} val The value to test
			 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
			 */
			function isArrayBufferView(val) {
			  var result;
			  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
			    result = ArrayBuffer.isView(val);
			  } else {
			    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
			  }
			  return result;
			}

			/**
			 * Determine if a value is a String
			 *
			 * @param {Object} val The value to test
			 * @returns {boolean} True if value is a String, otherwise false
			 */
			function isString(val) {
			  return typeof val === 'string';
			}

			/**
			 * Determine if a value is a Number
			 *
			 * @param {Object} val The value to test
			 * @returns {boolean} True if value is a Number, otherwise false
			 */
			function isNumber(val) {
			  return typeof val === 'number';
			}

			/**
			 * Determine if a value is an Object
			 *
			 * @param {Object} val The value to test
			 * @returns {boolean} True if value is an Object, otherwise false
			 */
			function isObject(val) {
			  return val !== null && typeof val === 'object';
			}

			/**
			 * Determine if a value is a plain Object
			 *
			 * @param {Object} val The value to test
			 * @return {boolean} True if value is a plain Object, otherwise false
			 */
			function isPlainObject(val) {
			  if (kindOf(val) !== 'object') {
			    return false;
			  }

			  var prototype = Object.getPrototypeOf(val);
			  return prototype === null || prototype === Object.prototype;
			}

			/**
			 * Determine if a value is a Date
			 *
			 * @function
			 * @param {Object} val The value to test
			 * @returns {boolean} True if value is a Date, otherwise false
			 */
			var isDate = kindOfTest('Date');

			/**
			 * Determine if a value is a File
			 *
			 * @function
			 * @param {Object} val The value to test
			 * @returns {boolean} True if value is a File, otherwise false
			 */
			var isFile = kindOfTest('File');

			/**
			 * Determine if a value is a Blob
			 *
			 * @function
			 * @param {Object} val The value to test
			 * @returns {boolean} True if value is a Blob, otherwise false
			 */
			var isBlob = kindOfTest('Blob');

			/**
			 * Determine if a value is a FileList
			 *
			 * @function
			 * @param {Object} val The value to test
			 * @returns {boolean} True if value is a File, otherwise false
			 */
			var isFileList = kindOfTest('FileList');

			/**
			 * Determine if a value is a Function
			 *
			 * @param {Object} val The value to test
			 * @returns {boolean} True if value is a Function, otherwise false
			 */
			function isFunction(val) {
			  return toString.call(val) === '[object Function]';
			}

			/**
			 * Determine if a value is a Stream
			 *
			 * @param {Object} val The value to test
			 * @returns {boolean} True if value is a Stream, otherwise false
			 */
			function isStream(val) {
			  return isObject(val) && isFunction(val.pipe);
			}

			/**
			 * Determine if a value is a FormData
			 *
			 * @param {Object} thing The value to test
			 * @returns {boolean} True if value is an FormData, otherwise false
			 */
			function isFormData(thing) {
			  var pattern = '[object FormData]';
			  return thing && (
			    (typeof FormData === 'function' && thing instanceof FormData) ||
			    toString.call(thing) === pattern ||
			    (isFunction(thing.toString) && thing.toString() === pattern)
			  );
			}

			/**
			 * Determine if a value is a URLSearchParams object
			 * @function
			 * @param {Object} val The value to test
			 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
			 */
			var isURLSearchParams = kindOfTest('URLSearchParams');

			/**
			 * Trim excess whitespace off the beginning and end of a string
			 *
			 * @param {String} str The String to trim
			 * @returns {String} The String freed of excess whitespace
			 */
			function trim(str) {
			  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
			}

			/**
			 * Determine if we're running in a standard browser environment
			 *
			 * This allows axios to run in a web worker, and react-native.
			 * Both environments support XMLHttpRequest, but not fully standard globals.
			 *
			 * web workers:
			 *  "object" -> undefined
			 *  typeof document -> undefined
			 *
			 * react-native:
			 *  navigator.product -> 'ReactNative'
			 * nativescript
			 *  navigator.product -> 'NativeScript' or 'NS'
			 */
			function isStandardBrowserEnv() {
			  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
			                                           navigator.product === 'NativeScript' ||
			                                           navigator.product === 'NS')) {
			    return false;
			  }
			  return (
			    typeof document !== 'undefined'
			  );
			}

			/**
			 * Iterate over an Array or an Object invoking a function for each item.
			 *
			 * If `obj` is an Array callback will be called passing
			 * the value, index, and complete array for each item.
			 *
			 * If 'obj' is an Object callback will be called passing
			 * the value, key, and complete object for each property.
			 *
			 * @param {Object|Array} obj The object to iterate
			 * @param {Function} fn The callback to invoke for each item
			 */
			function forEach(obj, fn) {
			  // Don't bother if no value provided
			  if (obj === null || typeof obj === 'undefined') {
			    return;
			  }

			  // Force an array if not already something iterable
			  if (typeof obj !== 'object') {
			    /*eslint no-param-reassign:0*/
			    obj = [obj];
			  }

			  if (isArray(obj)) {
			    // Iterate over array values
			    for (var i = 0, l = obj.length; i < l; i++) {
			      fn.call(null, obj[i], i, obj);
			    }
			  } else {
			    // Iterate over object keys
			    for (var key in obj) {
			      if (Object.prototype.hasOwnProperty.call(obj, key)) {
			        fn.call(null, obj[key], key, obj);
			      }
			    }
			  }
			}

			/**
			 * Accepts varargs expecting each argument to be an object, then
			 * immutably merges the properties of each object and returns result.
			 *
			 * When multiple objects contain the same key the later object in
			 * the arguments list will take precedence.
			 *
			 * Example:
			 *
			 * ```js
			 * var result = merge({foo: 123}, {foo: 456});
			 * console.log(result.foo); // outputs 456
			 * ```
			 *
			 * @param {Object} obj1 Object to merge
			 * @returns {Object} Result of all merge properties
			 */
			function merge(/* obj1, obj2, obj3, ... */) {
			  var result = {};
			  function assignValue(val, key) {
			    if (isPlainObject(result[key]) && isPlainObject(val)) {
			      result[key] = merge(result[key], val);
			    } else if (isPlainObject(val)) {
			      result[key] = merge({}, val);
			    } else if (isArray(val)) {
			      result[key] = val.slice();
			    } else {
			      result[key] = val;
			    }
			  }

			  for (var i = 0, l = arguments.length; i < l; i++) {
			    forEach(arguments[i], assignValue);
			  }
			  return result;
			}

			/**
			 * Extends object a by mutably adding to it the properties of object b.
			 *
			 * @param {Object} a The object to be extended
			 * @param {Object} b The object to copy properties from
			 * @param {Object} thisArg The object to bind function to
			 * @return {Object} The resulting value of object a
			 */
			function extend(a, b, thisArg) {
			  forEach(b, function assignValue(val, key) {
			    if (thisArg && typeof val === 'function') {
			      a[key] = bind(val, thisArg);
			    } else {
			      a[key] = val;
			    }
			  });
			  return a;
			}

			/**
			 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
			 *
			 * @param {string} content with BOM
			 * @return {string} content value without BOM
			 */
			function stripBOM(content) {
			  if (content.charCodeAt(0) === 0xFEFF) {
			    content = content.slice(1);
			  }
			  return content;
			}

			/**
			 * Inherit the prototype methods from one constructor into another
			 * @param {function} constructor
			 * @param {function} superConstructor
			 * @param {object} [props]
			 * @param {object} [descriptors]
			 */

			function inherits(constructor, superConstructor, props, descriptors) {
			  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
			  constructor.prototype.constructor = constructor;
			  props && Object.assign(constructor.prototype, props);
			}

			/**
			 * Resolve object with deep prototype chain to a flat object
			 * @param {Object} sourceObj source object
			 * @param {Object} [destObj]
			 * @param {Function} [filter]
			 * @returns {Object}
			 */

			function toFlatObject(sourceObj, destObj, filter) {
			  var props;
			  var i;
			  var prop;
			  var merged = {};

			  destObj = destObj || {};

			  do {
			    props = Object.getOwnPropertyNames(sourceObj);
			    i = props.length;
			    while (i-- > 0) {
			      prop = props[i];
			      if (!merged[prop]) {
			        destObj[prop] = sourceObj[prop];
			        merged[prop] = true;
			      }
			    }
			    sourceObj = Object.getPrototypeOf(sourceObj);
			  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

			  return destObj;
			}

			/*
			 * determines whether a string ends with the characters of a specified string
			 * @param {String} str
			 * @param {String} searchString
			 * @param {Number} [position= 0]
			 * @returns {boolean}
			 */
			function endsWith(str, searchString, position) {
			  str = String(str);
			  if (position === undefined || position > str.length) {
			    position = str.length;
			  }
			  position -= searchString.length;
			  var lastIndex = str.indexOf(searchString, position);
			  return lastIndex !== -1 && lastIndex === position;
			}


			/**
			 * Returns new array from array like object
			 * @param {*} [thing]
			 * @returns {Array}
			 */
			function toArray(thing) {
			  if (!thing) return null;
			  var i = thing.length;
			  if (isUndefined(i)) return null;
			  var arr = new Array(i);
			  while (i-- > 0) {
			    arr[i] = thing[i];
			  }
			  return arr;
			}

			// eslint-disable-next-line func-names
			var isTypedArray = (function(TypedArray) {
			  // eslint-disable-next-line func-names
			  return function(thing) {
			    return TypedArray && thing instanceof TypedArray;
			  };
			})(typeof Uint8Array !== 'undefined' && Object.getPrototypeOf(Uint8Array));

			module.exports = {
			  isArray: isArray,
			  isArrayBuffer: isArrayBuffer,
			  isBuffer: isBuffer,
			  isFormData: isFormData,
			  isArrayBufferView: isArrayBufferView,
			  isString: isString,
			  isNumber: isNumber,
			  isObject: isObject,
			  isPlainObject: isPlainObject,
			  isUndefined: isUndefined,
			  isDate: isDate,
			  isFile: isFile,
			  isBlob: isBlob,
			  isFunction: isFunction,
			  isStream: isStream,
			  isURLSearchParams: isURLSearchParams,
			  isStandardBrowserEnv: isStandardBrowserEnv,
			  forEach: forEach,
			  merge: merge,
			  extend: extend,
			  trim: trim,
			  stripBOM: stripBOM,
			  inherits: inherits,
			  toFlatObject: toFlatObject,
			  kindOf: kindOf,
			  kindOfTest: kindOfTest,
			  endsWith: endsWith,
			  toArray: toArray,
			  isTypedArray: isTypedArray,
			  isFileList: isFileList
			};


			/***/ })

			/******/ });
			});
			
		} (axios$2, axios$2.exports));
		return axios$2.exports;
	}

	var axiosExports = requireAxios();
	var axios = /*@__PURE__*/getDefaultExportFromCjs(axiosExports);

	var util;
	(function (util) {
	    util.assertEqual = (val) => val;
	    function assertIs(_arg) { }
	    util.assertIs = assertIs;
	    function assertNever(_x) {
	        throw new Error();
	    }
	    util.assertNever = assertNever;
	    util.arrayToEnum = (items) => {
	        const obj = {};
	        for (const item of items) {
	            obj[item] = item;
	        }
	        return obj;
	    };
	    util.getValidEnumValues = (obj) => {
	        const validKeys = util.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
	        const filtered = {};
	        for (const k of validKeys) {
	            filtered[k] = obj[k];
	        }
	        return util.objectValues(filtered);
	    };
	    util.objectValues = (obj) => {
	        return util.objectKeys(obj).map(function (e) {
	            return obj[e];
	        });
	    };
	    util.objectKeys = typeof Object.keys === "function" // eslint-disable-line ban/ban
	        ? (obj) => Object.keys(obj) // eslint-disable-line ban/ban
	        : (object) => {
	            const keys = [];
	            for (const key in object) {
	                if (Object.prototype.hasOwnProperty.call(object, key)) {
	                    keys.push(key);
	                }
	            }
	            return keys;
	        };
	    util.find = (arr, checker) => {
	        for (const item of arr) {
	            if (checker(item))
	                return item;
	        }
	        return undefined;
	    };
	    util.isInteger = typeof Number.isInteger === "function"
	        ? (val) => Number.isInteger(val) // eslint-disable-line ban/ban
	        : (val) => typeof val === "number" && isFinite(val) && Math.floor(val) === val;
	    function joinValues(array, separator = " | ") {
	        return array
	            .map((val) => (typeof val === "string" ? `'${val}'` : val))
	            .join(separator);
	    }
	    util.joinValues = joinValues;
	    util.jsonStringifyReplacer = (_, value) => {
	        if (typeof value === "bigint") {
	            return value.toString();
	        }
	        return value;
	    };
	})(util || (util = {}));
	var objectUtil;
	(function (objectUtil) {
	    objectUtil.mergeShapes = (first, second) => {
	        return {
	            ...first,
	            ...second, // second overwrites first
	        };
	    };
	})(objectUtil || (objectUtil = {}));
	const ZodParsedType = util.arrayToEnum([
	    "string",
	    "nan",
	    "number",
	    "integer",
	    "float",
	    "boolean",
	    "date",
	    "bigint",
	    "symbol",
	    "function",
	    "undefined",
	    "null",
	    "array",
	    "object",
	    "unknown",
	    "promise",
	    "void",
	    "never",
	    "map",
	    "set",
	]);
	const getParsedType = (data) => {
	    const t = typeof data;
	    switch (t) {
	        case "undefined":
	            return ZodParsedType.undefined;
	        case "string":
	            return ZodParsedType.string;
	        case "number":
	            return isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
	        case "boolean":
	            return ZodParsedType.boolean;
	        case "function":
	            return ZodParsedType.function;
	        case "bigint":
	            return ZodParsedType.bigint;
	        case "symbol":
	            return ZodParsedType.symbol;
	        case "object":
	            if (Array.isArray(data)) {
	                return ZodParsedType.array;
	            }
	            if (data === null) {
	                return ZodParsedType.null;
	            }
	            if (data.then &&
	                typeof data.then === "function" &&
	                data.catch &&
	                typeof data.catch === "function") {
	                return ZodParsedType.promise;
	            }
	            if (typeof Map !== "undefined" && data instanceof Map) {
	                return ZodParsedType.map;
	            }
	            if (typeof Set !== "undefined" && data instanceof Set) {
	                return ZodParsedType.set;
	            }
	            if (typeof Date !== "undefined" && data instanceof Date) {
	                return ZodParsedType.date;
	            }
	            return ZodParsedType.object;
	        default:
	            return ZodParsedType.unknown;
	    }
	};

	const ZodIssueCode = util.arrayToEnum([
	    "invalid_type",
	    "invalid_literal",
	    "custom",
	    "invalid_union",
	    "invalid_union_discriminator",
	    "invalid_enum_value",
	    "unrecognized_keys",
	    "invalid_arguments",
	    "invalid_return_type",
	    "invalid_date",
	    "invalid_string",
	    "too_small",
	    "too_big",
	    "invalid_intersection_types",
	    "not_multiple_of",
	    "not_finite",
	]);
	const quotelessJson = (obj) => {
	    const json = JSON.stringify(obj, null, 2);
	    return json.replace(/"([^"]+)":/g, "$1:");
	};
	class ZodError extends Error {
	    constructor(issues) {
	        super();
	        this.issues = [];
	        this.addIssue = (sub) => {
	            this.issues = [...this.issues, sub];
	        };
	        this.addIssues = (subs = []) => {
	            this.issues = [...this.issues, ...subs];
	        };
	        const actualProto = new.target.prototype;
	        if (Object.setPrototypeOf) {
	            // eslint-disable-next-line ban/ban
	            Object.setPrototypeOf(this, actualProto);
	        }
	        else {
	            this.__proto__ = actualProto;
	        }
	        this.name = "ZodError";
	        this.issues = issues;
	    }
	    get errors() {
	        return this.issues;
	    }
	    format(_mapper) {
	        const mapper = _mapper ||
	            function (issue) {
	                return issue.message;
	            };
	        const fieldErrors = { _errors: [] };
	        const processError = (error) => {
	            for (const issue of error.issues) {
	                if (issue.code === "invalid_union") {
	                    issue.unionErrors.map(processError);
	                }
	                else if (issue.code === "invalid_return_type") {
	                    processError(issue.returnTypeError);
	                }
	                else if (issue.code === "invalid_arguments") {
	                    processError(issue.argumentsError);
	                }
	                else if (issue.path.length === 0) {
	                    fieldErrors._errors.push(mapper(issue));
	                }
	                else {
	                    let curr = fieldErrors;
	                    let i = 0;
	                    while (i < issue.path.length) {
	                        const el = issue.path[i];
	                        const terminal = i === issue.path.length - 1;
	                        if (!terminal) {
	                            curr[el] = curr[el] || { _errors: [] };
	                            // if (typeof el === "string") {
	                            //   curr[el] = curr[el] || { _errors: [] };
	                            // } else if (typeof el === "number") {
	                            //   const errorArray: any = [];
	                            //   errorArray._errors = [];
	                            //   curr[el] = curr[el] || errorArray;
	                            // }
	                        }
	                        else {
	                            curr[el] = curr[el] || { _errors: [] };
	                            curr[el]._errors.push(mapper(issue));
	                        }
	                        curr = curr[el];
	                        i++;
	                    }
	                }
	            }
	        };
	        processError(this);
	        return fieldErrors;
	    }
	    toString() {
	        return this.message;
	    }
	    get message() {
	        return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
	    }
	    get isEmpty() {
	        return this.issues.length === 0;
	    }
	    flatten(mapper = (issue) => issue.message) {
	        const fieldErrors = {};
	        const formErrors = [];
	        for (const sub of this.issues) {
	            if (sub.path.length > 0) {
	                fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
	                fieldErrors[sub.path[0]].push(mapper(sub));
	            }
	            else {
	                formErrors.push(mapper(sub));
	            }
	        }
	        return { formErrors, fieldErrors };
	    }
	    get formErrors() {
	        return this.flatten();
	    }
	}
	ZodError.create = (issues) => {
	    const error = new ZodError(issues);
	    return error;
	};

	const errorMap = (issue, _ctx) => {
	    let message;
	    switch (issue.code) {
	        case ZodIssueCode.invalid_type:
	            if (issue.received === ZodParsedType.undefined) {
	                message = "Required";
	            }
	            else {
	                message = `Expected ${issue.expected}, received ${issue.received}`;
	            }
	            break;
	        case ZodIssueCode.invalid_literal:
	            message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
	            break;
	        case ZodIssueCode.unrecognized_keys:
	            message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
	            break;
	        case ZodIssueCode.invalid_union:
	            message = `Invalid input`;
	            break;
	        case ZodIssueCode.invalid_union_discriminator:
	            message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
	            break;
	        case ZodIssueCode.invalid_enum_value:
	            message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
	            break;
	        case ZodIssueCode.invalid_arguments:
	            message = `Invalid function arguments`;
	            break;
	        case ZodIssueCode.invalid_return_type:
	            message = `Invalid function return type`;
	            break;
	        case ZodIssueCode.invalid_date:
	            message = `Invalid date`;
	            break;
	        case ZodIssueCode.invalid_string:
	            if (typeof issue.validation === "object") {
	                if ("includes" in issue.validation) {
	                    message = `Invalid input: must include "${issue.validation.includes}"`;
	                    if (typeof issue.validation.position === "number") {
	                        message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
	                    }
	                }
	                else if ("startsWith" in issue.validation) {
	                    message = `Invalid input: must start with "${issue.validation.startsWith}"`;
	                }
	                else if ("endsWith" in issue.validation) {
	                    message = `Invalid input: must end with "${issue.validation.endsWith}"`;
	                }
	                else {
	                    util.assertNever(issue.validation);
	                }
	            }
	            else if (issue.validation !== "regex") {
	                message = `Invalid ${issue.validation}`;
	            }
	            else {
	                message = "Invalid";
	            }
	            break;
	        case ZodIssueCode.too_small:
	            if (issue.type === "array")
	                message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
	            else if (issue.type === "string")
	                message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
	            else if (issue.type === "number")
	                message = `Number must be ${issue.exact
                    ? `exactly equal to `
                    : issue.inclusive
                        ? `greater than or equal to `
                        : `greater than `}${issue.minimum}`;
	            else if (issue.type === "date")
	                message = `Date must be ${issue.exact
                    ? `exactly equal to `
                    : issue.inclusive
                        ? `greater than or equal to `
                        : `greater than `}${new Date(Number(issue.minimum))}`;
	            else
	                message = "Invalid input";
	            break;
	        case ZodIssueCode.too_big:
	            if (issue.type === "array")
	                message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
	            else if (issue.type === "string")
	                message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
	            else if (issue.type === "number")
	                message = `Number must be ${issue.exact
                    ? `exactly`
                    : issue.inclusive
                        ? `less than or equal to`
                        : `less than`} ${issue.maximum}`;
	            else if (issue.type === "bigint")
	                message = `BigInt must be ${issue.exact
                    ? `exactly`
                    : issue.inclusive
                        ? `less than or equal to`
                        : `less than`} ${issue.maximum}`;
	            else if (issue.type === "date")
	                message = `Date must be ${issue.exact
                    ? `exactly`
                    : issue.inclusive
                        ? `smaller than or equal to`
                        : `smaller than`} ${new Date(Number(issue.maximum))}`;
	            else
	                message = "Invalid input";
	            break;
	        case ZodIssueCode.custom:
	            message = `Invalid input`;
	            break;
	        case ZodIssueCode.invalid_intersection_types:
	            message = `Intersection results could not be merged`;
	            break;
	        case ZodIssueCode.not_multiple_of:
	            message = `Number must be a multiple of ${issue.multipleOf}`;
	            break;
	        case ZodIssueCode.not_finite:
	            message = "Number must be finite";
	            break;
	        default:
	            message = _ctx.defaultError;
	            util.assertNever(issue);
	    }
	    return { message };
	};

	let overrideErrorMap = errorMap;
	function setErrorMap(map) {
	    overrideErrorMap = map;
	}
	function getErrorMap() {
	    return overrideErrorMap;
	}

	const makeIssue = (params) => {
	    const { data, path, errorMaps, issueData } = params;
	    const fullPath = [...path, ...(issueData.path || [])];
	    const fullIssue = {
	        ...issueData,
	        path: fullPath,
	    };
	    let errorMessage = "";
	    const maps = errorMaps
	        .filter((m) => !!m)
	        .slice()
	        .reverse();
	    for (const map of maps) {
	        errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
	    }
	    return {
	        ...issueData,
	        path: fullPath,
	        message: issueData.message || errorMessage,
	    };
	};
	const EMPTY_PATH = [];
	function addIssueToContext(ctx, issueData) {
	    const issue = makeIssue({
	        issueData: issueData,
	        data: ctx.data,
	        path: ctx.path,
	        errorMaps: [
	            ctx.common.contextualErrorMap,
	            ctx.schemaErrorMap,
	            getErrorMap(),
	            errorMap, // then global default map
	        ].filter((x) => !!x),
	    });
	    ctx.common.issues.push(issue);
	}
	class ParseStatus {
	    constructor() {
	        this.value = "valid";
	    }
	    dirty() {
	        if (this.value === "valid")
	            this.value = "dirty";
	    }
	    abort() {
	        if (this.value !== "aborted")
	            this.value = "aborted";
	    }
	    static mergeArray(status, results) {
	        const arrayValue = [];
	        for (const s of results) {
	            if (s.status === "aborted")
	                return INVALID;
	            if (s.status === "dirty")
	                status.dirty();
	            arrayValue.push(s.value);
	        }
	        return { status: status.value, value: arrayValue };
	    }
	    static async mergeObjectAsync(status, pairs) {
	        const syncPairs = [];
	        for (const pair of pairs) {
	            syncPairs.push({
	                key: await pair.key,
	                value: await pair.value,
	            });
	        }
	        return ParseStatus.mergeObjectSync(status, syncPairs);
	    }
	    static mergeObjectSync(status, pairs) {
	        const finalObject = {};
	        for (const pair of pairs) {
	            const { key, value } = pair;
	            if (key.status === "aborted")
	                return INVALID;
	            if (value.status === "aborted")
	                return INVALID;
	            if (key.status === "dirty")
	                status.dirty();
	            if (value.status === "dirty")
	                status.dirty();
	            if (typeof value.value !== "undefined" || pair.alwaysSet) {
	                finalObject[key.value] = value.value;
	            }
	        }
	        return { status: status.value, value: finalObject };
	    }
	}
	const INVALID = Object.freeze({
	    status: "aborted",
	});
	const DIRTY = (value) => ({ status: "dirty", value });
	const OK = (value) => ({ status: "valid", value });
	const isAborted = (x) => x.status === "aborted";
	const isDirty = (x) => x.status === "dirty";
	const isValid = (x) => x.status === "valid";
	const isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;

	var errorUtil;
	(function (errorUtil) {
	    errorUtil.errToObj = (message) => typeof message === "string" ? { message } : message || {};
	    errorUtil.toString = (message) => typeof message === "string" ? message : message === null || message === void 0 ? void 0 : message.message;
	})(errorUtil || (errorUtil = {}));

	class ParseInputLazyPath {
	    constructor(parent, value, path, key) {
	        this._cachedPath = [];
	        this.parent = parent;
	        this.data = value;
	        this._path = path;
	        this._key = key;
	    }
	    get path() {
	        if (!this._cachedPath.length) {
	            if (this._key instanceof Array) {
	                this._cachedPath.push(...this._path, ...this._key);
	            }
	            else {
	                this._cachedPath.push(...this._path, this._key);
	            }
	        }
	        return this._cachedPath;
	    }
	}
	const handleResult = (ctx, result) => {
	    if (isValid(result)) {
	        return { success: true, data: result.value };
	    }
	    else {
	        if (!ctx.common.issues.length) {
	            throw new Error("Validation failed but no issues detected.");
	        }
	        return {
	            success: false,
	            get error() {
	                if (this._error)
	                    return this._error;
	                const error = new ZodError(ctx.common.issues);
	                this._error = error;
	                return this._error;
	            },
	        };
	    }
	};
	function processCreateParams(params) {
	    if (!params)
	        return {};
	    const { errorMap, invalid_type_error, required_error, description } = params;
	    if (errorMap && (invalid_type_error || required_error)) {
	        throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
	    }
	    if (errorMap)
	        return { errorMap: errorMap, description };
	    const customMap = (iss, ctx) => {
	        if (iss.code !== "invalid_type")
	            return { message: ctx.defaultError };
	        if (typeof ctx.data === "undefined") {
	            return { message: required_error !== null && required_error !== void 0 ? required_error : ctx.defaultError };
	        }
	        return { message: invalid_type_error !== null && invalid_type_error !== void 0 ? invalid_type_error : ctx.defaultError };
	    };
	    return { errorMap: customMap, description };
	}
	class ZodType {
	    constructor(def) {
	        /** Alias of safeParseAsync */
	        this.spa = this.safeParseAsync;
	        this._def = def;
	        this.parse = this.parse.bind(this);
	        this.safeParse = this.safeParse.bind(this);
	        this.parseAsync = this.parseAsync.bind(this);
	        this.safeParseAsync = this.safeParseAsync.bind(this);
	        this.spa = this.spa.bind(this);
	        this.refine = this.refine.bind(this);
	        this.refinement = this.refinement.bind(this);
	        this.superRefine = this.superRefine.bind(this);
	        this.optional = this.optional.bind(this);
	        this.nullable = this.nullable.bind(this);
	        this.nullish = this.nullish.bind(this);
	        this.array = this.array.bind(this);
	        this.promise = this.promise.bind(this);
	        this.or = this.or.bind(this);
	        this.and = this.and.bind(this);
	        this.transform = this.transform.bind(this);
	        this.brand = this.brand.bind(this);
	        this.default = this.default.bind(this);
	        this.catch = this.catch.bind(this);
	        this.describe = this.describe.bind(this);
	        this.pipe = this.pipe.bind(this);
	        this.isNullable = this.isNullable.bind(this);
	        this.isOptional = this.isOptional.bind(this);
	    }
	    get description() {
	        return this._def.description;
	    }
	    _getType(input) {
	        return getParsedType(input.data);
	    }
	    _getOrReturnCtx(input, ctx) {
	        return (ctx || {
	            common: input.parent.common,
	            data: input.data,
	            parsedType: getParsedType(input.data),
	            schemaErrorMap: this._def.errorMap,
	            path: input.path,
	            parent: input.parent,
	        });
	    }
	    _processInputParams(input) {
	        return {
	            status: new ParseStatus(),
	            ctx: {
	                common: input.parent.common,
	                data: input.data,
	                parsedType: getParsedType(input.data),
	                schemaErrorMap: this._def.errorMap,
	                path: input.path,
	                parent: input.parent,
	            },
	        };
	    }
	    _parseSync(input) {
	        const result = this._parse(input);
	        if (isAsync(result)) {
	            throw new Error("Synchronous parse encountered promise.");
	        }
	        return result;
	    }
	    _parseAsync(input) {
	        const result = this._parse(input);
	        return Promise.resolve(result);
	    }
	    parse(data, params) {
	        const result = this.safeParse(data, params);
	        if (result.success)
	            return result.data;
	        throw result.error;
	    }
	    safeParse(data, params) {
	        var _a;
	        const ctx = {
	            common: {
	                issues: [],
	                async: (_a = params === null || params === void 0 ? void 0 : params.async) !== null && _a !== void 0 ? _a : false,
	                contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap,
	            },
	            path: (params === null || params === void 0 ? void 0 : params.path) || [],
	            schemaErrorMap: this._def.errorMap,
	            parent: null,
	            data,
	            parsedType: getParsedType(data),
	        };
	        const result = this._parseSync({ data, path: ctx.path, parent: ctx });
	        return handleResult(ctx, result);
	    }
	    async parseAsync(data, params) {
	        const result = await this.safeParseAsync(data, params);
	        if (result.success)
	            return result.data;
	        throw result.error;
	    }
	    async safeParseAsync(data, params) {
	        const ctx = {
	            common: {
	                issues: [],
	                contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap,
	                async: true,
	            },
	            path: (params === null || params === void 0 ? void 0 : params.path) || [],
	            schemaErrorMap: this._def.errorMap,
	            parent: null,
	            data,
	            parsedType: getParsedType(data),
	        };
	        const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
	        const result = await (isAsync(maybeAsyncResult)
	            ? maybeAsyncResult
	            : Promise.resolve(maybeAsyncResult));
	        return handleResult(ctx, result);
	    }
	    refine(check, message) {
	        const getIssueProperties = (val) => {
	            if (typeof message === "string" || typeof message === "undefined") {
	                return { message };
	            }
	            else if (typeof message === "function") {
	                return message(val);
	            }
	            else {
	                return message;
	            }
	        };
	        return this._refinement((val, ctx) => {
	            const result = check(val);
	            const setError = () => ctx.addIssue({
	                code: ZodIssueCode.custom,
	                ...getIssueProperties(val),
	            });
	            if (typeof Promise !== "undefined" && result instanceof Promise) {
	                return result.then((data) => {
	                    if (!data) {
	                        setError();
	                        return false;
	                    }
	                    else {
	                        return true;
	                    }
	                });
	            }
	            if (!result) {
	                setError();
	                return false;
	            }
	            else {
	                return true;
	            }
	        });
	    }
	    refinement(check, refinementData) {
	        return this._refinement((val, ctx) => {
	            if (!check(val)) {
	                ctx.addIssue(typeof refinementData === "function"
	                    ? refinementData(val, ctx)
	                    : refinementData);
	                return false;
	            }
	            else {
	                return true;
	            }
	        });
	    }
	    _refinement(refinement) {
	        return new ZodEffects({
	            schema: this,
	            typeName: ZodFirstPartyTypeKind.ZodEffects,
	            effect: { type: "refinement", refinement },
	        });
	    }
	    superRefine(refinement) {
	        return this._refinement(refinement);
	    }
	    optional() {
	        return ZodOptional.create(this, this._def);
	    }
	    nullable() {
	        return ZodNullable.create(this, this._def);
	    }
	    nullish() {
	        return this.nullable().optional();
	    }
	    array() {
	        return ZodArray.create(this, this._def);
	    }
	    promise() {
	        return ZodPromise.create(this, this._def);
	    }
	    or(option) {
	        return ZodUnion.create([this, option], this._def);
	    }
	    and(incoming) {
	        return ZodIntersection.create(this, incoming, this._def);
	    }
	    transform(transform) {
	        return new ZodEffects({
	            ...processCreateParams(this._def),
	            schema: this,
	            typeName: ZodFirstPartyTypeKind.ZodEffects,
	            effect: { type: "transform", transform },
	        });
	    }
	    default(def) {
	        const defaultValueFunc = typeof def === "function" ? def : () => def;
	        return new ZodDefault({
	            ...processCreateParams(this._def),
	            innerType: this,
	            defaultValue: defaultValueFunc,
	            typeName: ZodFirstPartyTypeKind.ZodDefault,
	        });
	    }
	    brand() {
	        return new ZodBranded({
	            typeName: ZodFirstPartyTypeKind.ZodBranded,
	            type: this,
	            ...processCreateParams(this._def),
	        });
	    }
	    catch(def) {
	        const catchValueFunc = typeof def === "function" ? def : () => def;
	        return new ZodCatch({
	            ...processCreateParams(this._def),
	            innerType: this,
	            catchValue: catchValueFunc,
	            typeName: ZodFirstPartyTypeKind.ZodCatch,
	        });
	    }
	    describe(description) {
	        const This = this.constructor;
	        return new This({
	            ...this._def,
	            description,
	        });
	    }
	    pipe(target) {
	        return ZodPipeline.create(this, target);
	    }
	    isOptional() {
	        return this.safeParse(undefined).success;
	    }
	    isNullable() {
	        return this.safeParse(null).success;
	    }
	}
	const cuidRegex = /^c[^\s-]{8,}$/i;
	const cuid2Regex = /^[a-z][a-z0-9]*$/;
	const ulidRegex = /[0-9A-HJKMNP-TV-Z]{26}/;
	const uuidRegex = /^([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}|00000000-0000-0000-0000-000000000000)$/i;
	// from https://stackoverflow.com/a/46181/1550155
	// old version: too slow, didn't support unicode
	// const emailRegex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
	//old email regex
	// const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@((?!-)([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{1,})[^-<>()[\].,;:\s@"]$/i;
	// eslint-disable-next-line
	const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\])|(\[IPv6:(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))\])|([A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])*(\.[A-Za-z]{2,})+))$/;
	// from https://thekevinscott.com/emojis-in-javascript/#writing-a-regular-expression
	const emojiRegex = /^(\p{Extended_Pictographic}|\p{Emoji_Component})+$/u;
	const ipv4Regex = /^(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))$/;
	const ipv6Regex = /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/;
	// Adapted from https://stackoverflow.com/a/3143231
	const datetimeRegex = (args) => {
	    if (args.precision) {
	        if (args.offset) {
	            return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${args.precision}}(([+-]\\d{2}(:?\\d{2})?)|Z)$`);
	        }
	        else {
	            return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${args.precision}}Z$`);
	        }
	    }
	    else if (args.precision === 0) {
	        if (args.offset) {
	            return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(([+-]\\d{2}(:?\\d{2})?)|Z)$`);
	        }
	        else {
	            return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$`);
	        }
	    }
	    else {
	        if (args.offset) {
	            return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(([+-]\\d{2}(:?\\d{2})?)|Z)$`);
	        }
	        else {
	            return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?Z$`);
	        }
	    }
	};
	function isValidIP(ip, version) {
	    if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
	        return true;
	    }
	    if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
	        return true;
	    }
	    return false;
	}
	class ZodString extends ZodType {
	    constructor() {
	        super(...arguments);
	        this._regex = (regex, validation, message) => this.refinement((data) => regex.test(data), {
	            validation,
	            code: ZodIssueCode.invalid_string,
	            ...errorUtil.errToObj(message),
	        });
	        /**
	         * @deprecated Use z.string().min(1) instead.
	         * @see {@link ZodString.min}
	         */
	        this.nonempty = (message) => this.min(1, errorUtil.errToObj(message));
	        this.trim = () => new ZodString({
	            ...this._def,
	            checks: [...this._def.checks, { kind: "trim" }],
	        });
	        this.toLowerCase = () => new ZodString({
	            ...this._def,
	            checks: [...this._def.checks, { kind: "toLowerCase" }],
	        });
	        this.toUpperCase = () => new ZodString({
	            ...this._def,
	            checks: [...this._def.checks, { kind: "toUpperCase" }],
	        });
	    }
	    _parse(input) {
	        if (this._def.coerce) {
	            input.data = String(input.data);
	        }
	        const parsedType = this._getType(input);
	        if (parsedType !== ZodParsedType.string) {
	            const ctx = this._getOrReturnCtx(input);
	            addIssueToContext(ctx, {
	                code: ZodIssueCode.invalid_type,
	                expected: ZodParsedType.string,
	                received: ctx.parsedType,
	            }
	            //
	            );
	            return INVALID;
	        }
	        const status = new ParseStatus();
	        let ctx = undefined;
	        for (const check of this._def.checks) {
	            if (check.kind === "min") {
	                if (input.data.length < check.value) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    addIssueToContext(ctx, {
	                        code: ZodIssueCode.too_small,
	                        minimum: check.value,
	                        type: "string",
	                        inclusive: true,
	                        exact: false,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "max") {
	                if (input.data.length > check.value) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    addIssueToContext(ctx, {
	                        code: ZodIssueCode.too_big,
	                        maximum: check.value,
	                        type: "string",
	                        inclusive: true,
	                        exact: false,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "length") {
	                const tooBig = input.data.length > check.value;
	                const tooSmall = input.data.length < check.value;
	                if (tooBig || tooSmall) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    if (tooBig) {
	                        addIssueToContext(ctx, {
	                            code: ZodIssueCode.too_big,
	                            maximum: check.value,
	                            type: "string",
	                            inclusive: true,
	                            exact: true,
	                            message: check.message,
	                        });
	                    }
	                    else if (tooSmall) {
	                        addIssueToContext(ctx, {
	                            code: ZodIssueCode.too_small,
	                            minimum: check.value,
	                            type: "string",
	                            inclusive: true,
	                            exact: true,
	                            message: check.message,
	                        });
	                    }
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "email") {
	                if (!emailRegex.test(input.data)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    addIssueToContext(ctx, {
	                        validation: "email",
	                        code: ZodIssueCode.invalid_string,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "emoji") {
	                if (!emojiRegex.test(input.data)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    addIssueToContext(ctx, {
	                        validation: "emoji",
	                        code: ZodIssueCode.invalid_string,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "uuid") {
	                if (!uuidRegex.test(input.data)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    addIssueToContext(ctx, {
	                        validation: "uuid",
	                        code: ZodIssueCode.invalid_string,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "cuid") {
	                if (!cuidRegex.test(input.data)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    addIssueToContext(ctx, {
	                        validation: "cuid",
	                        code: ZodIssueCode.invalid_string,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "cuid2") {
	                if (!cuid2Regex.test(input.data)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    addIssueToContext(ctx, {
	                        validation: "cuid2",
	                        code: ZodIssueCode.invalid_string,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "ulid") {
	                if (!ulidRegex.test(input.data)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    addIssueToContext(ctx, {
	                        validation: "ulid",
	                        code: ZodIssueCode.invalid_string,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "url") {
	                try {
	                    new URL(input.data);
	                }
	                catch (_a) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    addIssueToContext(ctx, {
	                        validation: "url",
	                        code: ZodIssueCode.invalid_string,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "regex") {
	                check.regex.lastIndex = 0;
	                const testResult = check.regex.test(input.data);
	                if (!testResult) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    addIssueToContext(ctx, {
	                        validation: "regex",
	                        code: ZodIssueCode.invalid_string,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "trim") {
	                input.data = input.data.trim();
	            }
	            else if (check.kind === "includes") {
	                if (!input.data.includes(check.value, check.position)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    addIssueToContext(ctx, {
	                        code: ZodIssueCode.invalid_string,
	                        validation: { includes: check.value, position: check.position },
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "toLowerCase") {
	                input.data = input.data.toLowerCase();
	            }
	            else if (check.kind === "toUpperCase") {
	                input.data = input.data.toUpperCase();
	            }
	            else if (check.kind === "startsWith") {
	                if (!input.data.startsWith(check.value)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    addIssueToContext(ctx, {
	                        code: ZodIssueCode.invalid_string,
	                        validation: { startsWith: check.value },
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "endsWith") {
	                if (!input.data.endsWith(check.value)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    addIssueToContext(ctx, {
	                        code: ZodIssueCode.invalid_string,
	                        validation: { endsWith: check.value },
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "datetime") {
	                const regex = datetimeRegex(check);
	                if (!regex.test(input.data)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    addIssueToContext(ctx, {
	                        code: ZodIssueCode.invalid_string,
	                        validation: "datetime",
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "ip") {
	                if (!isValidIP(input.data, check.version)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    addIssueToContext(ctx, {
	                        validation: "ip",
	                        code: ZodIssueCode.invalid_string,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else {
	                util.assertNever(check);
	            }
	        }
	        return { status: status.value, value: input.data };
	    }
	    _addCheck(check) {
	        return new ZodString({
	            ...this._def,
	            checks: [...this._def.checks, check],
	        });
	    }
	    email(message) {
	        return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
	    }
	    url(message) {
	        return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
	    }
	    emoji(message) {
	        return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
	    }
	    uuid(message) {
	        return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
	    }
	    cuid(message) {
	        return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
	    }
	    cuid2(message) {
	        return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
	    }
	    ulid(message) {
	        return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
	    }
	    ip(options) {
	        return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
	    }
	    datetime(options) {
	        var _a;
	        if (typeof options === "string") {
	            return this._addCheck({
	                kind: "datetime",
	                precision: null,
	                offset: false,
	                message: options,
	            });
	        }
	        return this._addCheck({
	            kind: "datetime",
	            precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
	            offset: (_a = options === null || options === void 0 ? void 0 : options.offset) !== null && _a !== void 0 ? _a : false,
	            ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message),
	        });
	    }
	    regex(regex, message) {
	        return this._addCheck({
	            kind: "regex",
	            regex: regex,
	            ...errorUtil.errToObj(message),
	        });
	    }
	    includes(value, options) {
	        return this._addCheck({
	            kind: "includes",
	            value: value,
	            position: options === null || options === void 0 ? void 0 : options.position,
	            ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message),
	        });
	    }
	    startsWith(value, message) {
	        return this._addCheck({
	            kind: "startsWith",
	            value: value,
	            ...errorUtil.errToObj(message),
	        });
	    }
	    endsWith(value, message) {
	        return this._addCheck({
	            kind: "endsWith",
	            value: value,
	            ...errorUtil.errToObj(message),
	        });
	    }
	    min(minLength, message) {
	        return this._addCheck({
	            kind: "min",
	            value: minLength,
	            ...errorUtil.errToObj(message),
	        });
	    }
	    max(maxLength, message) {
	        return this._addCheck({
	            kind: "max",
	            value: maxLength,
	            ...errorUtil.errToObj(message),
	        });
	    }
	    length(len, message) {
	        return this._addCheck({
	            kind: "length",
	            value: len,
	            ...errorUtil.errToObj(message),
	        });
	    }
	    get isDatetime() {
	        return !!this._def.checks.find((ch) => ch.kind === "datetime");
	    }
	    get isEmail() {
	        return !!this._def.checks.find((ch) => ch.kind === "email");
	    }
	    get isURL() {
	        return !!this._def.checks.find((ch) => ch.kind === "url");
	    }
	    get isEmoji() {
	        return !!this._def.checks.find((ch) => ch.kind === "emoji");
	    }
	    get isUUID() {
	        return !!this._def.checks.find((ch) => ch.kind === "uuid");
	    }
	    get isCUID() {
	        return !!this._def.checks.find((ch) => ch.kind === "cuid");
	    }
	    get isCUID2() {
	        return !!this._def.checks.find((ch) => ch.kind === "cuid2");
	    }
	    get isULID() {
	        return !!this._def.checks.find((ch) => ch.kind === "ulid");
	    }
	    get isIP() {
	        return !!this._def.checks.find((ch) => ch.kind === "ip");
	    }
	    get minLength() {
	        let min = null;
	        for (const ch of this._def.checks) {
	            if (ch.kind === "min") {
	                if (min === null || ch.value > min)
	                    min = ch.value;
	            }
	        }
	        return min;
	    }
	    get maxLength() {
	        let max = null;
	        for (const ch of this._def.checks) {
	            if (ch.kind === "max") {
	                if (max === null || ch.value < max)
	                    max = ch.value;
	            }
	        }
	        return max;
	    }
	}
	ZodString.create = (params) => {
	    var _a;
	    return new ZodString({
	        checks: [],
	        typeName: ZodFirstPartyTypeKind.ZodString,
	        coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
	        ...processCreateParams(params),
	    });
	};
	// https://stackoverflow.com/questions/3966484/why-does-modulus-operator-return-fractional-number-in-javascript/31711034#31711034
	function floatSafeRemainder(val, step) {
	    const valDecCount = (val.toString().split(".")[1] || "").length;
	    const stepDecCount = (step.toString().split(".")[1] || "").length;
	    const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
	    const valInt = parseInt(val.toFixed(decCount).replace(".", ""));
	    const stepInt = parseInt(step.toFixed(decCount).replace(".", ""));
	    return (valInt % stepInt) / Math.pow(10, decCount);
	}
	class ZodNumber extends ZodType {
	    constructor() {
	        super(...arguments);
	        this.min = this.gte;
	        this.max = this.lte;
	        this.step = this.multipleOf;
	    }
	    _parse(input) {
	        if (this._def.coerce) {
	            input.data = Number(input.data);
	        }
	        const parsedType = this._getType(input);
	        if (parsedType !== ZodParsedType.number) {
	            const ctx = this._getOrReturnCtx(input);
	            addIssueToContext(ctx, {
	                code: ZodIssueCode.invalid_type,
	                expected: ZodParsedType.number,
	                received: ctx.parsedType,
	            });
	            return INVALID;
	        }
	        let ctx = undefined;
	        const status = new ParseStatus();
	        for (const check of this._def.checks) {
	            if (check.kind === "int") {
	                if (!util.isInteger(input.data)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    addIssueToContext(ctx, {
	                        code: ZodIssueCode.invalid_type,
	                        expected: "integer",
	                        received: "float",
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "min") {
	                const tooSmall = check.inclusive
	                    ? input.data < check.value
	                    : input.data <= check.value;
	                if (tooSmall) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    addIssueToContext(ctx, {
	                        code: ZodIssueCode.too_small,
	                        minimum: check.value,
	                        type: "number",
	                        inclusive: check.inclusive,
	                        exact: false,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "max") {
	                const tooBig = check.inclusive
	                    ? input.data > check.value
	                    : input.data >= check.value;
	                if (tooBig) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    addIssueToContext(ctx, {
	                        code: ZodIssueCode.too_big,
	                        maximum: check.value,
	                        type: "number",
	                        inclusive: check.inclusive,
	                        exact: false,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "multipleOf") {
	                if (floatSafeRemainder(input.data, check.value) !== 0) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    addIssueToContext(ctx, {
	                        code: ZodIssueCode.not_multiple_of,
	                        multipleOf: check.value,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "finite") {
	                if (!Number.isFinite(input.data)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    addIssueToContext(ctx, {
	                        code: ZodIssueCode.not_finite,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else {
	                util.assertNever(check);
	            }
	        }
	        return { status: status.value, value: input.data };
	    }
	    gte(value, message) {
	        return this.setLimit("min", value, true, errorUtil.toString(message));
	    }
	    gt(value, message) {
	        return this.setLimit("min", value, false, errorUtil.toString(message));
	    }
	    lte(value, message) {
	        return this.setLimit("max", value, true, errorUtil.toString(message));
	    }
	    lt(value, message) {
	        return this.setLimit("max", value, false, errorUtil.toString(message));
	    }
	    setLimit(kind, value, inclusive, message) {
	        return new ZodNumber({
	            ...this._def,
	            checks: [
	                ...this._def.checks,
	                {
	                    kind,
	                    value,
	                    inclusive,
	                    message: errorUtil.toString(message),
	                },
	            ],
	        });
	    }
	    _addCheck(check) {
	        return new ZodNumber({
	            ...this._def,
	            checks: [...this._def.checks, check],
	        });
	    }
	    int(message) {
	        return this._addCheck({
	            kind: "int",
	            message: errorUtil.toString(message),
	        });
	    }
	    positive(message) {
	        return this._addCheck({
	            kind: "min",
	            value: 0,
	            inclusive: false,
	            message: errorUtil.toString(message),
	        });
	    }
	    negative(message) {
	        return this._addCheck({
	            kind: "max",
	            value: 0,
	            inclusive: false,
	            message: errorUtil.toString(message),
	        });
	    }
	    nonpositive(message) {
	        return this._addCheck({
	            kind: "max",
	            value: 0,
	            inclusive: true,
	            message: errorUtil.toString(message),
	        });
	    }
	    nonnegative(message) {
	        return this._addCheck({
	            kind: "min",
	            value: 0,
	            inclusive: true,
	            message: errorUtil.toString(message),
	        });
	    }
	    multipleOf(value, message) {
	        return this._addCheck({
	            kind: "multipleOf",
	            value: value,
	            message: errorUtil.toString(message),
	        });
	    }
	    finite(message) {
	        return this._addCheck({
	            kind: "finite",
	            message: errorUtil.toString(message),
	        });
	    }
	    safe(message) {
	        return this._addCheck({
	            kind: "min",
	            inclusive: true,
	            value: Number.MIN_SAFE_INTEGER,
	            message: errorUtil.toString(message),
	        })._addCheck({
	            kind: "max",
	            inclusive: true,
	            value: Number.MAX_SAFE_INTEGER,
	            message: errorUtil.toString(message),
	        });
	    }
	    get minValue() {
	        let min = null;
	        for (const ch of this._def.checks) {
	            if (ch.kind === "min") {
	                if (min === null || ch.value > min)
	                    min = ch.value;
	            }
	        }
	        return min;
	    }
	    get maxValue() {
	        let max = null;
	        for (const ch of this._def.checks) {
	            if (ch.kind === "max") {
	                if (max === null || ch.value < max)
	                    max = ch.value;
	            }
	        }
	        return max;
	    }
	    get isInt() {
	        return !!this._def.checks.find((ch) => ch.kind === "int" ||
	            (ch.kind === "multipleOf" && util.isInteger(ch.value)));
	    }
	    get isFinite() {
	        let max = null, min = null;
	        for (const ch of this._def.checks) {
	            if (ch.kind === "finite" ||
	                ch.kind === "int" ||
	                ch.kind === "multipleOf") {
	                return true;
	            }
	            else if (ch.kind === "min") {
	                if (min === null || ch.value > min)
	                    min = ch.value;
	            }
	            else if (ch.kind === "max") {
	                if (max === null || ch.value < max)
	                    max = ch.value;
	            }
	        }
	        return Number.isFinite(min) && Number.isFinite(max);
	    }
	}
	ZodNumber.create = (params) => {
	    return new ZodNumber({
	        checks: [],
	        typeName: ZodFirstPartyTypeKind.ZodNumber,
	        coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
	        ...processCreateParams(params),
	    });
	};
	class ZodBigInt extends ZodType {
	    constructor() {
	        super(...arguments);
	        this.min = this.gte;
	        this.max = this.lte;
	    }
	    _parse(input) {
	        if (this._def.coerce) {
	            input.data = BigInt(input.data);
	        }
	        const parsedType = this._getType(input);
	        if (parsedType !== ZodParsedType.bigint) {
	            const ctx = this._getOrReturnCtx(input);
	            addIssueToContext(ctx, {
	                code: ZodIssueCode.invalid_type,
	                expected: ZodParsedType.bigint,
	                received: ctx.parsedType,
	            });
	            return INVALID;
	        }
	        let ctx = undefined;
	        const status = new ParseStatus();
	        for (const check of this._def.checks) {
	            if (check.kind === "min") {
	                const tooSmall = check.inclusive
	                    ? input.data < check.value
	                    : input.data <= check.value;
	                if (tooSmall) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    addIssueToContext(ctx, {
	                        code: ZodIssueCode.too_small,
	                        type: "bigint",
	                        minimum: check.value,
	                        inclusive: check.inclusive,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "max") {
	                const tooBig = check.inclusive
	                    ? input.data > check.value
	                    : input.data >= check.value;
	                if (tooBig) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    addIssueToContext(ctx, {
	                        code: ZodIssueCode.too_big,
	                        type: "bigint",
	                        maximum: check.value,
	                        inclusive: check.inclusive,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "multipleOf") {
	                if (input.data % check.value !== BigInt(0)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    addIssueToContext(ctx, {
	                        code: ZodIssueCode.not_multiple_of,
	                        multipleOf: check.value,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else {
	                util.assertNever(check);
	            }
	        }
	        return { status: status.value, value: input.data };
	    }
	    gte(value, message) {
	        return this.setLimit("min", value, true, errorUtil.toString(message));
	    }
	    gt(value, message) {
	        return this.setLimit("min", value, false, errorUtil.toString(message));
	    }
	    lte(value, message) {
	        return this.setLimit("max", value, true, errorUtil.toString(message));
	    }
	    lt(value, message) {
	        return this.setLimit("max", value, false, errorUtil.toString(message));
	    }
	    setLimit(kind, value, inclusive, message) {
	        return new ZodBigInt({
	            ...this._def,
	            checks: [
	                ...this._def.checks,
	                {
	                    kind,
	                    value,
	                    inclusive,
	                    message: errorUtil.toString(message),
	                },
	            ],
	        });
	    }
	    _addCheck(check) {
	        return new ZodBigInt({
	            ...this._def,
	            checks: [...this._def.checks, check],
	        });
	    }
	    positive(message) {
	        return this._addCheck({
	            kind: "min",
	            value: BigInt(0),
	            inclusive: false,
	            message: errorUtil.toString(message),
	        });
	    }
	    negative(message) {
	        return this._addCheck({
	            kind: "max",
	            value: BigInt(0),
	            inclusive: false,
	            message: errorUtil.toString(message),
	        });
	    }
	    nonpositive(message) {
	        return this._addCheck({
	            kind: "max",
	            value: BigInt(0),
	            inclusive: true,
	            message: errorUtil.toString(message),
	        });
	    }
	    nonnegative(message) {
	        return this._addCheck({
	            kind: "min",
	            value: BigInt(0),
	            inclusive: true,
	            message: errorUtil.toString(message),
	        });
	    }
	    multipleOf(value, message) {
	        return this._addCheck({
	            kind: "multipleOf",
	            value,
	            message: errorUtil.toString(message),
	        });
	    }
	    get minValue() {
	        let min = null;
	        for (const ch of this._def.checks) {
	            if (ch.kind === "min") {
	                if (min === null || ch.value > min)
	                    min = ch.value;
	            }
	        }
	        return min;
	    }
	    get maxValue() {
	        let max = null;
	        for (const ch of this._def.checks) {
	            if (ch.kind === "max") {
	                if (max === null || ch.value < max)
	                    max = ch.value;
	            }
	        }
	        return max;
	    }
	}
	ZodBigInt.create = (params) => {
	    var _a;
	    return new ZodBigInt({
	        checks: [],
	        typeName: ZodFirstPartyTypeKind.ZodBigInt,
	        coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
	        ...processCreateParams(params),
	    });
	};
	class ZodBoolean extends ZodType {
	    _parse(input) {
	        if (this._def.coerce) {
	            input.data = Boolean(input.data);
	        }
	        const parsedType = this._getType(input);
	        if (parsedType !== ZodParsedType.boolean) {
	            const ctx = this._getOrReturnCtx(input);
	            addIssueToContext(ctx, {
	                code: ZodIssueCode.invalid_type,
	                expected: ZodParsedType.boolean,
	                received: ctx.parsedType,
	            });
	            return INVALID;
	        }
	        return OK(input.data);
	    }
	}
	ZodBoolean.create = (params) => {
	    return new ZodBoolean({
	        typeName: ZodFirstPartyTypeKind.ZodBoolean,
	        coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
	        ...processCreateParams(params),
	    });
	};
	class ZodDate extends ZodType {
	    _parse(input) {
	        if (this._def.coerce) {
	            input.data = new Date(input.data);
	        }
	        const parsedType = this._getType(input);
	        if (parsedType !== ZodParsedType.date) {
	            const ctx = this._getOrReturnCtx(input);
	            addIssueToContext(ctx, {
	                code: ZodIssueCode.invalid_type,
	                expected: ZodParsedType.date,
	                received: ctx.parsedType,
	            });
	            return INVALID;
	        }
	        if (isNaN(input.data.getTime())) {
	            const ctx = this._getOrReturnCtx(input);
	            addIssueToContext(ctx, {
	                code: ZodIssueCode.invalid_date,
	            });
	            return INVALID;
	        }
	        const status = new ParseStatus();
	        let ctx = undefined;
	        for (const check of this._def.checks) {
	            if (check.kind === "min") {
	                if (input.data.getTime() < check.value) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    addIssueToContext(ctx, {
	                        code: ZodIssueCode.too_small,
	                        message: check.message,
	                        inclusive: true,
	                        exact: false,
	                        minimum: check.value,
	                        type: "date",
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "max") {
	                if (input.data.getTime() > check.value) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    addIssueToContext(ctx, {
	                        code: ZodIssueCode.too_big,
	                        message: check.message,
	                        inclusive: true,
	                        exact: false,
	                        maximum: check.value,
	                        type: "date",
	                    });
	                    status.dirty();
	                }
	            }
	            else {
	                util.assertNever(check);
	            }
	        }
	        return {
	            status: status.value,
	            value: new Date(input.data.getTime()),
	        };
	    }
	    _addCheck(check) {
	        return new ZodDate({
	            ...this._def,
	            checks: [...this._def.checks, check],
	        });
	    }
	    min(minDate, message) {
	        return this._addCheck({
	            kind: "min",
	            value: minDate.getTime(),
	            message: errorUtil.toString(message),
	        });
	    }
	    max(maxDate, message) {
	        return this._addCheck({
	            kind: "max",
	            value: maxDate.getTime(),
	            message: errorUtil.toString(message),
	        });
	    }
	    get minDate() {
	        let min = null;
	        for (const ch of this._def.checks) {
	            if (ch.kind === "min") {
	                if (min === null || ch.value > min)
	                    min = ch.value;
	            }
	        }
	        return min != null ? new Date(min) : null;
	    }
	    get maxDate() {
	        let max = null;
	        for (const ch of this._def.checks) {
	            if (ch.kind === "max") {
	                if (max === null || ch.value < max)
	                    max = ch.value;
	            }
	        }
	        return max != null ? new Date(max) : null;
	    }
	}
	ZodDate.create = (params) => {
	    return new ZodDate({
	        checks: [],
	        coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
	        typeName: ZodFirstPartyTypeKind.ZodDate,
	        ...processCreateParams(params),
	    });
	};
	class ZodSymbol extends ZodType {
	    _parse(input) {
	        const parsedType = this._getType(input);
	        if (parsedType !== ZodParsedType.symbol) {
	            const ctx = this._getOrReturnCtx(input);
	            addIssueToContext(ctx, {
	                code: ZodIssueCode.invalid_type,
	                expected: ZodParsedType.symbol,
	                received: ctx.parsedType,
	            });
	            return INVALID;
	        }
	        return OK(input.data);
	    }
	}
	ZodSymbol.create = (params) => {
	    return new ZodSymbol({
	        typeName: ZodFirstPartyTypeKind.ZodSymbol,
	        ...processCreateParams(params),
	    });
	};
	class ZodUndefined extends ZodType {
	    _parse(input) {
	        const parsedType = this._getType(input);
	        if (parsedType !== ZodParsedType.undefined) {
	            const ctx = this._getOrReturnCtx(input);
	            addIssueToContext(ctx, {
	                code: ZodIssueCode.invalid_type,
	                expected: ZodParsedType.undefined,
	                received: ctx.parsedType,
	            });
	            return INVALID;
	        }
	        return OK(input.data);
	    }
	}
	ZodUndefined.create = (params) => {
	    return new ZodUndefined({
	        typeName: ZodFirstPartyTypeKind.ZodUndefined,
	        ...processCreateParams(params),
	    });
	};
	class ZodNull extends ZodType {
	    _parse(input) {
	        const parsedType = this._getType(input);
	        if (parsedType !== ZodParsedType.null) {
	            const ctx = this._getOrReturnCtx(input);
	            addIssueToContext(ctx, {
	                code: ZodIssueCode.invalid_type,
	                expected: ZodParsedType.null,
	                received: ctx.parsedType,
	            });
	            return INVALID;
	        }
	        return OK(input.data);
	    }
	}
	ZodNull.create = (params) => {
	    return new ZodNull({
	        typeName: ZodFirstPartyTypeKind.ZodNull,
	        ...processCreateParams(params),
	    });
	};
	class ZodAny extends ZodType {
	    constructor() {
	        super(...arguments);
	        // to prevent instances of other classes from extending ZodAny. this causes issues with catchall in ZodObject.
	        this._any = true;
	    }
	    _parse(input) {
	        return OK(input.data);
	    }
	}
	ZodAny.create = (params) => {
	    return new ZodAny({
	        typeName: ZodFirstPartyTypeKind.ZodAny,
	        ...processCreateParams(params),
	    });
	};
	class ZodUnknown extends ZodType {
	    constructor() {
	        super(...arguments);
	        // required
	        this._unknown = true;
	    }
	    _parse(input) {
	        return OK(input.data);
	    }
	}
	ZodUnknown.create = (params) => {
	    return new ZodUnknown({
	        typeName: ZodFirstPartyTypeKind.ZodUnknown,
	        ...processCreateParams(params),
	    });
	};
	class ZodNever extends ZodType {
	    _parse(input) {
	        const ctx = this._getOrReturnCtx(input);
	        addIssueToContext(ctx, {
	            code: ZodIssueCode.invalid_type,
	            expected: ZodParsedType.never,
	            received: ctx.parsedType,
	        });
	        return INVALID;
	    }
	}
	ZodNever.create = (params) => {
	    return new ZodNever({
	        typeName: ZodFirstPartyTypeKind.ZodNever,
	        ...processCreateParams(params),
	    });
	};
	class ZodVoid extends ZodType {
	    _parse(input) {
	        const parsedType = this._getType(input);
	        if (parsedType !== ZodParsedType.undefined) {
	            const ctx = this._getOrReturnCtx(input);
	            addIssueToContext(ctx, {
	                code: ZodIssueCode.invalid_type,
	                expected: ZodParsedType.void,
	                received: ctx.parsedType,
	            });
	            return INVALID;
	        }
	        return OK(input.data);
	    }
	}
	ZodVoid.create = (params) => {
	    return new ZodVoid({
	        typeName: ZodFirstPartyTypeKind.ZodVoid,
	        ...processCreateParams(params),
	    });
	};
	class ZodArray extends ZodType {
	    _parse(input) {
	        const { ctx, status } = this._processInputParams(input);
	        const def = this._def;
	        if (ctx.parsedType !== ZodParsedType.array) {
	            addIssueToContext(ctx, {
	                code: ZodIssueCode.invalid_type,
	                expected: ZodParsedType.array,
	                received: ctx.parsedType,
	            });
	            return INVALID;
	        }
	        if (def.exactLength !== null) {
	            const tooBig = ctx.data.length > def.exactLength.value;
	            const tooSmall = ctx.data.length < def.exactLength.value;
	            if (tooBig || tooSmall) {
	                addIssueToContext(ctx, {
	                    code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
	                    minimum: (tooSmall ? def.exactLength.value : undefined),
	                    maximum: (tooBig ? def.exactLength.value : undefined),
	                    type: "array",
	                    inclusive: true,
	                    exact: true,
	                    message: def.exactLength.message,
	                });
	                status.dirty();
	            }
	        }
	        if (def.minLength !== null) {
	            if (ctx.data.length < def.minLength.value) {
	                addIssueToContext(ctx, {
	                    code: ZodIssueCode.too_small,
	                    minimum: def.minLength.value,
	                    type: "array",
	                    inclusive: true,
	                    exact: false,
	                    message: def.minLength.message,
	                });
	                status.dirty();
	            }
	        }
	        if (def.maxLength !== null) {
	            if (ctx.data.length > def.maxLength.value) {
	                addIssueToContext(ctx, {
	                    code: ZodIssueCode.too_big,
	                    maximum: def.maxLength.value,
	                    type: "array",
	                    inclusive: true,
	                    exact: false,
	                    message: def.maxLength.message,
	                });
	                status.dirty();
	            }
	        }
	        if (ctx.common.async) {
	            return Promise.all([...ctx.data].map((item, i) => {
	                return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
	            })).then((result) => {
	                return ParseStatus.mergeArray(status, result);
	            });
	        }
	        const result = [...ctx.data].map((item, i) => {
	            return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
	        });
	        return ParseStatus.mergeArray(status, result);
	    }
	    get element() {
	        return this._def.type;
	    }
	    min(minLength, message) {
	        return new ZodArray({
	            ...this._def,
	            minLength: { value: minLength, message: errorUtil.toString(message) },
	        });
	    }
	    max(maxLength, message) {
	        return new ZodArray({
	            ...this._def,
	            maxLength: { value: maxLength, message: errorUtil.toString(message) },
	        });
	    }
	    length(len, message) {
	        return new ZodArray({
	            ...this._def,
	            exactLength: { value: len, message: errorUtil.toString(message) },
	        });
	    }
	    nonempty(message) {
	        return this.min(1, message);
	    }
	}
	ZodArray.create = (schema, params) => {
	    return new ZodArray({
	        type: schema,
	        minLength: null,
	        maxLength: null,
	        exactLength: null,
	        typeName: ZodFirstPartyTypeKind.ZodArray,
	        ...processCreateParams(params),
	    });
	};
	function deepPartialify(schema) {
	    if (schema instanceof ZodObject) {
	        const newShape = {};
	        for (const key in schema.shape) {
	            const fieldSchema = schema.shape[key];
	            newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
	        }
	        return new ZodObject({
	            ...schema._def,
	            shape: () => newShape,
	        });
	    }
	    else if (schema instanceof ZodArray) {
	        return new ZodArray({
	            ...schema._def,
	            type: deepPartialify(schema.element),
	        });
	    }
	    else if (schema instanceof ZodOptional) {
	        return ZodOptional.create(deepPartialify(schema.unwrap()));
	    }
	    else if (schema instanceof ZodNullable) {
	        return ZodNullable.create(deepPartialify(schema.unwrap()));
	    }
	    else if (schema instanceof ZodTuple) {
	        return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
	    }
	    else {
	        return schema;
	    }
	}
	class ZodObject extends ZodType {
	    constructor() {
	        super(...arguments);
	        this._cached = null;
	        /**
	         * @deprecated In most cases, this is no longer needed - unknown properties are now silently stripped.
	         * If you want to pass through unknown properties, use `.passthrough()` instead.
	         */
	        this.nonstrict = this.passthrough;
	        // extend<
	        //   Augmentation extends ZodRawShape,
	        //   NewOutput extends util.flatten<{
	        //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
	        //       ? Augmentation[k]["_output"]
	        //       : k extends keyof Output
	        //       ? Output[k]
	        //       : never;
	        //   }>,
	        //   NewInput extends util.flatten<{
	        //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
	        //       ? Augmentation[k]["_input"]
	        //       : k extends keyof Input
	        //       ? Input[k]
	        //       : never;
	        //   }>
	        // >(
	        //   augmentation: Augmentation
	        // ): ZodObject<
	        //   extendShape<T, Augmentation>,
	        //   UnknownKeys,
	        //   Catchall,
	        //   NewOutput,
	        //   NewInput
	        // > {
	        //   return new ZodObject({
	        //     ...this._def,
	        //     shape: () => ({
	        //       ...this._def.shape(),
	        //       ...augmentation,
	        //     }),
	        //   }) as any;
	        // }
	        /**
	         * @deprecated Use `.extend` instead
	         *  */
	        this.augment = this.extend;
	    }
	    _getCached() {
	        if (this._cached !== null)
	            return this._cached;
	        const shape = this._def.shape();
	        const keys = util.objectKeys(shape);
	        return (this._cached = { shape, keys });
	    }
	    _parse(input) {
	        const parsedType = this._getType(input);
	        if (parsedType !== ZodParsedType.object) {
	            const ctx = this._getOrReturnCtx(input);
	            addIssueToContext(ctx, {
	                code: ZodIssueCode.invalid_type,
	                expected: ZodParsedType.object,
	                received: ctx.parsedType,
	            });
	            return INVALID;
	        }
	        const { status, ctx } = this._processInputParams(input);
	        const { shape, keys: shapeKeys } = this._getCached();
	        const extraKeys = [];
	        if (!(this._def.catchall instanceof ZodNever &&
	            this._def.unknownKeys === "strip")) {
	            for (const key in ctx.data) {
	                if (!shapeKeys.includes(key)) {
	                    extraKeys.push(key);
	                }
	            }
	        }
	        const pairs = [];
	        for (const key of shapeKeys) {
	            const keyValidator = shape[key];
	            const value = ctx.data[key];
	            pairs.push({
	                key: { status: "valid", value: key },
	                value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
	                alwaysSet: key in ctx.data,
	            });
	        }
	        if (this._def.catchall instanceof ZodNever) {
	            const unknownKeys = this._def.unknownKeys;
	            if (unknownKeys === "passthrough") {
	                for (const key of extraKeys) {
	                    pairs.push({
	                        key: { status: "valid", value: key },
	                        value: { status: "valid", value: ctx.data[key] },
	                    });
	                }
	            }
	            else if (unknownKeys === "strict") {
	                if (extraKeys.length > 0) {
	                    addIssueToContext(ctx, {
	                        code: ZodIssueCode.unrecognized_keys,
	                        keys: extraKeys,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (unknownKeys === "strip") ;
	            else {
	                throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
	            }
	        }
	        else {
	            // run catchall validation
	            const catchall = this._def.catchall;
	            for (const key of extraKeys) {
	                const value = ctx.data[key];
	                pairs.push({
	                    key: { status: "valid", value: key },
	                    value: catchall._parse(new ParseInputLazyPath(ctx, value, ctx.path, key) //, ctx.child(key), value, getParsedType(value)
	                    ),
	                    alwaysSet: key in ctx.data,
	                });
	            }
	        }
	        if (ctx.common.async) {
	            return Promise.resolve()
	                .then(async () => {
	                const syncPairs = [];
	                for (const pair of pairs) {
	                    const key = await pair.key;
	                    syncPairs.push({
	                        key,
	                        value: await pair.value,
	                        alwaysSet: pair.alwaysSet,
	                    });
	                }
	                return syncPairs;
	            })
	                .then((syncPairs) => {
	                return ParseStatus.mergeObjectSync(status, syncPairs);
	            });
	        }
	        else {
	            return ParseStatus.mergeObjectSync(status, pairs);
	        }
	    }
	    get shape() {
	        return this._def.shape();
	    }
	    strict(message) {
	        errorUtil.errToObj;
	        return new ZodObject({
	            ...this._def,
	            unknownKeys: "strict",
	            ...(message !== undefined
	                ? {
	                    errorMap: (issue, ctx) => {
	                        var _a, _b, _c, _d;
	                        const defaultError = (_c = (_b = (_a = this._def).errorMap) === null || _b === void 0 ? void 0 : _b.call(_a, issue, ctx).message) !== null && _c !== void 0 ? _c : ctx.defaultError;
	                        if (issue.code === "unrecognized_keys")
	                            return {
	                                message: (_d = errorUtil.errToObj(message).message) !== null && _d !== void 0 ? _d : defaultError,
	                            };
	                        return {
	                            message: defaultError,
	                        };
	                    },
	                }
	                : {}),
	        });
	    }
	    strip() {
	        return new ZodObject({
	            ...this._def,
	            unknownKeys: "strip",
	        });
	    }
	    passthrough() {
	        return new ZodObject({
	            ...this._def,
	            unknownKeys: "passthrough",
	        });
	    }
	    // const AugmentFactory =
	    //   <Def extends ZodObjectDef>(def: Def) =>
	    //   <Augmentation extends ZodRawShape>(
	    //     augmentation: Augmentation
	    //   ): ZodObject<
	    //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
	    //     Def["unknownKeys"],
	    //     Def["catchall"]
	    //   > => {
	    //     return new ZodObject({
	    //       ...def,
	    //       shape: () => ({
	    //         ...def.shape(),
	    //         ...augmentation,
	    //       }),
	    //     }) as any;
	    //   };
	    extend(augmentation) {
	        return new ZodObject({
	            ...this._def,
	            shape: () => ({
	                ...this._def.shape(),
	                ...augmentation,
	            }),
	        });
	    }
	    /**
	     * Prior to zod@1.0.12 there was a bug in the
	     * inferred type of merged objects. Please
	     * upgrade if you are experiencing issues.
	     */
	    merge(merging) {
	        const merged = new ZodObject({
	            unknownKeys: merging._def.unknownKeys,
	            catchall: merging._def.catchall,
	            shape: () => ({
	                ...this._def.shape(),
	                ...merging._def.shape(),
	            }),
	            typeName: ZodFirstPartyTypeKind.ZodObject,
	        });
	        return merged;
	    }
	    // merge<
	    //   Incoming extends AnyZodObject,
	    //   Augmentation extends Incoming["shape"],
	    //   NewOutput extends {
	    //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
	    //       ? Augmentation[k]["_output"]
	    //       : k extends keyof Output
	    //       ? Output[k]
	    //       : never;
	    //   },
	    //   NewInput extends {
	    //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
	    //       ? Augmentation[k]["_input"]
	    //       : k extends keyof Input
	    //       ? Input[k]
	    //       : never;
	    //   }
	    // >(
	    //   merging: Incoming
	    // ): ZodObject<
	    //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
	    //   Incoming["_def"]["unknownKeys"],
	    //   Incoming["_def"]["catchall"],
	    //   NewOutput,
	    //   NewInput
	    // > {
	    //   const merged: any = new ZodObject({
	    //     unknownKeys: merging._def.unknownKeys,
	    //     catchall: merging._def.catchall,
	    //     shape: () =>
	    //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
	    //     typeName: ZodFirstPartyTypeKind.ZodObject,
	    //   }) as any;
	    //   return merged;
	    // }
	    setKey(key, schema) {
	        return this.augment({ [key]: schema });
	    }
	    // merge<Incoming extends AnyZodObject>(
	    //   merging: Incoming
	    // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
	    // ZodObject<
	    //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
	    //   Incoming["_def"]["unknownKeys"],
	    //   Incoming["_def"]["catchall"]
	    // > {
	    //   // const mergedShape = objectUtil.mergeShapes(
	    //   //   this._def.shape(),
	    //   //   merging._def.shape()
	    //   // );
	    //   const merged: any = new ZodObject({
	    //     unknownKeys: merging._def.unknownKeys,
	    //     catchall: merging._def.catchall,
	    //     shape: () =>
	    //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
	    //     typeName: ZodFirstPartyTypeKind.ZodObject,
	    //   }) as any;
	    //   return merged;
	    // }
	    catchall(index) {
	        return new ZodObject({
	            ...this._def,
	            catchall: index,
	        });
	    }
	    pick(mask) {
	        const shape = {};
	        util.objectKeys(mask).forEach((key) => {
	            if (mask[key] && this.shape[key]) {
	                shape[key] = this.shape[key];
	            }
	        });
	        return new ZodObject({
	            ...this._def,
	            shape: () => shape,
	        });
	    }
	    omit(mask) {
	        const shape = {};
	        util.objectKeys(this.shape).forEach((key) => {
	            if (!mask[key]) {
	                shape[key] = this.shape[key];
	            }
	        });
	        return new ZodObject({
	            ...this._def,
	            shape: () => shape,
	        });
	    }
	    /**
	     * @deprecated
	     */
	    deepPartial() {
	        return deepPartialify(this);
	    }
	    partial(mask) {
	        const newShape = {};
	        util.objectKeys(this.shape).forEach((key) => {
	            const fieldSchema = this.shape[key];
	            if (mask && !mask[key]) {
	                newShape[key] = fieldSchema;
	            }
	            else {
	                newShape[key] = fieldSchema.optional();
	            }
	        });
	        return new ZodObject({
	            ...this._def,
	            shape: () => newShape,
	        });
	    }
	    required(mask) {
	        const newShape = {};
	        util.objectKeys(this.shape).forEach((key) => {
	            if (mask && !mask[key]) {
	                newShape[key] = this.shape[key];
	            }
	            else {
	                const fieldSchema = this.shape[key];
	                let newField = fieldSchema;
	                while (newField instanceof ZodOptional) {
	                    newField = newField._def.innerType;
	                }
	                newShape[key] = newField;
	            }
	        });
	        return new ZodObject({
	            ...this._def,
	            shape: () => newShape,
	        });
	    }
	    keyof() {
	        return createZodEnum(util.objectKeys(this.shape));
	    }
	}
	ZodObject.create = (shape, params) => {
	    return new ZodObject({
	        shape: () => shape,
	        unknownKeys: "strip",
	        catchall: ZodNever.create(),
	        typeName: ZodFirstPartyTypeKind.ZodObject,
	        ...processCreateParams(params),
	    });
	};
	ZodObject.strictCreate = (shape, params) => {
	    return new ZodObject({
	        shape: () => shape,
	        unknownKeys: "strict",
	        catchall: ZodNever.create(),
	        typeName: ZodFirstPartyTypeKind.ZodObject,
	        ...processCreateParams(params),
	    });
	};
	ZodObject.lazycreate = (shape, params) => {
	    return new ZodObject({
	        shape,
	        unknownKeys: "strip",
	        catchall: ZodNever.create(),
	        typeName: ZodFirstPartyTypeKind.ZodObject,
	        ...processCreateParams(params),
	    });
	};
	class ZodUnion extends ZodType {
	    _parse(input) {
	        const { ctx } = this._processInputParams(input);
	        const options = this._def.options;
	        function handleResults(results) {
	            // return first issue-free validation if it exists
	            for (const result of results) {
	                if (result.result.status === "valid") {
	                    return result.result;
	                }
	            }
	            for (const result of results) {
	                if (result.result.status === "dirty") {
	                    // add issues from dirty option
	                    ctx.common.issues.push(...result.ctx.common.issues);
	                    return result.result;
	                }
	            }
	            // return invalid
	            const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
	            addIssueToContext(ctx, {
	                code: ZodIssueCode.invalid_union,
	                unionErrors,
	            });
	            return INVALID;
	        }
	        if (ctx.common.async) {
	            return Promise.all(options.map(async (option) => {
	                const childCtx = {
	                    ...ctx,
	                    common: {
	                        ...ctx.common,
	                        issues: [],
	                    },
	                    parent: null,
	                };
	                return {
	                    result: await option._parseAsync({
	                        data: ctx.data,
	                        path: ctx.path,
	                        parent: childCtx,
	                    }),
	                    ctx: childCtx,
	                };
	            })).then(handleResults);
	        }
	        else {
	            let dirty = undefined;
	            const issues = [];
	            for (const option of options) {
	                const childCtx = {
	                    ...ctx,
	                    common: {
	                        ...ctx.common,
	                        issues: [],
	                    },
	                    parent: null,
	                };
	                const result = option._parseSync({
	                    data: ctx.data,
	                    path: ctx.path,
	                    parent: childCtx,
	                });
	                if (result.status === "valid") {
	                    return result;
	                }
	                else if (result.status === "dirty" && !dirty) {
	                    dirty = { result, ctx: childCtx };
	                }
	                if (childCtx.common.issues.length) {
	                    issues.push(childCtx.common.issues);
	                }
	            }
	            if (dirty) {
	                ctx.common.issues.push(...dirty.ctx.common.issues);
	                return dirty.result;
	            }
	            const unionErrors = issues.map((issues) => new ZodError(issues));
	            addIssueToContext(ctx, {
	                code: ZodIssueCode.invalid_union,
	                unionErrors,
	            });
	            return INVALID;
	        }
	    }
	    get options() {
	        return this._def.options;
	    }
	}
	ZodUnion.create = (types, params) => {
	    return new ZodUnion({
	        options: types,
	        typeName: ZodFirstPartyTypeKind.ZodUnion,
	        ...processCreateParams(params),
	    });
	};
	/////////////////////////////////////////////////////
	/////////////////////////////////////////////////////
	//////////                                 //////////
	//////////      ZodDiscriminatedUnion      //////////
	//////////                                 //////////
	/////////////////////////////////////////////////////
	/////////////////////////////////////////////////////
	const getDiscriminator = (type) => {
	    if (type instanceof ZodLazy) {
	        return getDiscriminator(type.schema);
	    }
	    else if (type instanceof ZodEffects) {
	        return getDiscriminator(type.innerType());
	    }
	    else if (type instanceof ZodLiteral) {
	        return [type.value];
	    }
	    else if (type instanceof ZodEnum) {
	        return type.options;
	    }
	    else if (type instanceof ZodNativeEnum) {
	        // eslint-disable-next-line ban/ban
	        return Object.keys(type.enum);
	    }
	    else if (type instanceof ZodDefault) {
	        return getDiscriminator(type._def.innerType);
	    }
	    else if (type instanceof ZodUndefined) {
	        return [undefined];
	    }
	    else if (type instanceof ZodNull) {
	        return [null];
	    }
	    else {
	        return null;
	    }
	};
	class ZodDiscriminatedUnion extends ZodType {
	    _parse(input) {
	        const { ctx } = this._processInputParams(input);
	        if (ctx.parsedType !== ZodParsedType.object) {
	            addIssueToContext(ctx, {
	                code: ZodIssueCode.invalid_type,
	                expected: ZodParsedType.object,
	                received: ctx.parsedType,
	            });
	            return INVALID;
	        }
	        const discriminator = this.discriminator;
	        const discriminatorValue = ctx.data[discriminator];
	        const option = this.optionsMap.get(discriminatorValue);
	        if (!option) {
	            addIssueToContext(ctx, {
	                code: ZodIssueCode.invalid_union_discriminator,
	                options: Array.from(this.optionsMap.keys()),
	                path: [discriminator],
	            });
	            return INVALID;
	        }
	        if (ctx.common.async) {
	            return option._parseAsync({
	                data: ctx.data,
	                path: ctx.path,
	                parent: ctx,
	            });
	        }
	        else {
	            return option._parseSync({
	                data: ctx.data,
	                path: ctx.path,
	                parent: ctx,
	            });
	        }
	    }
	    get discriminator() {
	        return this._def.discriminator;
	    }
	    get options() {
	        return this._def.options;
	    }
	    get optionsMap() {
	        return this._def.optionsMap;
	    }
	    /**
	     * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
	     * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
	     * have a different value for each object in the union.
	     * @param discriminator the name of the discriminator property
	     * @param types an array of object schemas
	     * @param params
	     */
	    static create(discriminator, options, params) {
	        // Get all the valid discriminator values
	        const optionsMap = new Map();
	        // try {
	        for (const type of options) {
	            const discriminatorValues = getDiscriminator(type.shape[discriminator]);
	            if (!discriminatorValues) {
	                throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
	            }
	            for (const value of discriminatorValues) {
	                if (optionsMap.has(value)) {
	                    throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
	                }
	                optionsMap.set(value, type);
	            }
	        }
	        return new ZodDiscriminatedUnion({
	            typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
	            discriminator,
	            options,
	            optionsMap,
	            ...processCreateParams(params),
	        });
	    }
	}
	function mergeValues(a, b) {
	    const aType = getParsedType(a);
	    const bType = getParsedType(b);
	    if (a === b) {
	        return { valid: true, data: a };
	    }
	    else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
	        const bKeys = util.objectKeys(b);
	        const sharedKeys = util
	            .objectKeys(a)
	            .filter((key) => bKeys.indexOf(key) !== -1);
	        const newObj = { ...a, ...b };
	        for (const key of sharedKeys) {
	            const sharedValue = mergeValues(a[key], b[key]);
	            if (!sharedValue.valid) {
	                return { valid: false };
	            }
	            newObj[key] = sharedValue.data;
	        }
	        return { valid: true, data: newObj };
	    }
	    else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
	        if (a.length !== b.length) {
	            return { valid: false };
	        }
	        const newArray = [];
	        for (let index = 0; index < a.length; index++) {
	            const itemA = a[index];
	            const itemB = b[index];
	            const sharedValue = mergeValues(itemA, itemB);
	            if (!sharedValue.valid) {
	                return { valid: false };
	            }
	            newArray.push(sharedValue.data);
	        }
	        return { valid: true, data: newArray };
	    }
	    else if (aType === ZodParsedType.date &&
	        bType === ZodParsedType.date &&
	        +a === +b) {
	        return { valid: true, data: a };
	    }
	    else {
	        return { valid: false };
	    }
	}
	class ZodIntersection extends ZodType {
	    _parse(input) {
	        const { status, ctx } = this._processInputParams(input);
	        const handleParsed = (parsedLeft, parsedRight) => {
	            if (isAborted(parsedLeft) || isAborted(parsedRight)) {
	                return INVALID;
	            }
	            const merged = mergeValues(parsedLeft.value, parsedRight.value);
	            if (!merged.valid) {
	                addIssueToContext(ctx, {
	                    code: ZodIssueCode.invalid_intersection_types,
	                });
	                return INVALID;
	            }
	            if (isDirty(parsedLeft) || isDirty(parsedRight)) {
	                status.dirty();
	            }
	            return { status: status.value, value: merged.data };
	        };
	        if (ctx.common.async) {
	            return Promise.all([
	                this._def.left._parseAsync({
	                    data: ctx.data,
	                    path: ctx.path,
	                    parent: ctx,
	                }),
	                this._def.right._parseAsync({
	                    data: ctx.data,
	                    path: ctx.path,
	                    parent: ctx,
	                }),
	            ]).then(([left, right]) => handleParsed(left, right));
	        }
	        else {
	            return handleParsed(this._def.left._parseSync({
	                data: ctx.data,
	                path: ctx.path,
	                parent: ctx,
	            }), this._def.right._parseSync({
	                data: ctx.data,
	                path: ctx.path,
	                parent: ctx,
	            }));
	        }
	    }
	}
	ZodIntersection.create = (left, right, params) => {
	    return new ZodIntersection({
	        left: left,
	        right: right,
	        typeName: ZodFirstPartyTypeKind.ZodIntersection,
	        ...processCreateParams(params),
	    });
	};
	class ZodTuple extends ZodType {
	    _parse(input) {
	        const { status, ctx } = this._processInputParams(input);
	        if (ctx.parsedType !== ZodParsedType.array) {
	            addIssueToContext(ctx, {
	                code: ZodIssueCode.invalid_type,
	                expected: ZodParsedType.array,
	                received: ctx.parsedType,
	            });
	            return INVALID;
	        }
	        if (ctx.data.length < this._def.items.length) {
	            addIssueToContext(ctx, {
	                code: ZodIssueCode.too_small,
	                minimum: this._def.items.length,
	                inclusive: true,
	                exact: false,
	                type: "array",
	            });
	            return INVALID;
	        }
	        const rest = this._def.rest;
	        if (!rest && ctx.data.length > this._def.items.length) {
	            addIssueToContext(ctx, {
	                code: ZodIssueCode.too_big,
	                maximum: this._def.items.length,
	                inclusive: true,
	                exact: false,
	                type: "array",
	            });
	            status.dirty();
	        }
	        const items = [...ctx.data]
	            .map((item, itemIndex) => {
	            const schema = this._def.items[itemIndex] || this._def.rest;
	            if (!schema)
	                return null;
	            return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
	        })
	            .filter((x) => !!x); // filter nulls
	        if (ctx.common.async) {
	            return Promise.all(items).then((results) => {
	                return ParseStatus.mergeArray(status, results);
	            });
	        }
	        else {
	            return ParseStatus.mergeArray(status, items);
	        }
	    }
	    get items() {
	        return this._def.items;
	    }
	    rest(rest) {
	        return new ZodTuple({
	            ...this._def,
	            rest,
	        });
	    }
	}
	ZodTuple.create = (schemas, params) => {
	    if (!Array.isArray(schemas)) {
	        throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
	    }
	    return new ZodTuple({
	        items: schemas,
	        typeName: ZodFirstPartyTypeKind.ZodTuple,
	        rest: null,
	        ...processCreateParams(params),
	    });
	};
	class ZodRecord extends ZodType {
	    get keySchema() {
	        return this._def.keyType;
	    }
	    get valueSchema() {
	        return this._def.valueType;
	    }
	    _parse(input) {
	        const { status, ctx } = this._processInputParams(input);
	        if (ctx.parsedType !== ZodParsedType.object) {
	            addIssueToContext(ctx, {
	                code: ZodIssueCode.invalid_type,
	                expected: ZodParsedType.object,
	                received: ctx.parsedType,
	            });
	            return INVALID;
	        }
	        const pairs = [];
	        const keyType = this._def.keyType;
	        const valueType = this._def.valueType;
	        for (const key in ctx.data) {
	            pairs.push({
	                key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
	                value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
	            });
	        }
	        if (ctx.common.async) {
	            return ParseStatus.mergeObjectAsync(status, pairs);
	        }
	        else {
	            return ParseStatus.mergeObjectSync(status, pairs);
	        }
	    }
	    get element() {
	        return this._def.valueType;
	    }
	    static create(first, second, third) {
	        if (second instanceof ZodType) {
	            return new ZodRecord({
	                keyType: first,
	                valueType: second,
	                typeName: ZodFirstPartyTypeKind.ZodRecord,
	                ...processCreateParams(third),
	            });
	        }
	        return new ZodRecord({
	            keyType: ZodString.create(),
	            valueType: first,
	            typeName: ZodFirstPartyTypeKind.ZodRecord,
	            ...processCreateParams(second),
	        });
	    }
	}
	class ZodMap extends ZodType {
	    _parse(input) {
	        const { status, ctx } = this._processInputParams(input);
	        if (ctx.parsedType !== ZodParsedType.map) {
	            addIssueToContext(ctx, {
	                code: ZodIssueCode.invalid_type,
	                expected: ZodParsedType.map,
	                received: ctx.parsedType,
	            });
	            return INVALID;
	        }
	        const keyType = this._def.keyType;
	        const valueType = this._def.valueType;
	        const pairs = [...ctx.data.entries()].map(([key, value], index) => {
	            return {
	                key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
	                value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"])),
	            };
	        });
	        if (ctx.common.async) {
	            const finalMap = new Map();
	            return Promise.resolve().then(async () => {
	                for (const pair of pairs) {
	                    const key = await pair.key;
	                    const value = await pair.value;
	                    if (key.status === "aborted" || value.status === "aborted") {
	                        return INVALID;
	                    }
	                    if (key.status === "dirty" || value.status === "dirty") {
	                        status.dirty();
	                    }
	                    finalMap.set(key.value, value.value);
	                }
	                return { status: status.value, value: finalMap };
	            });
	        }
	        else {
	            const finalMap = new Map();
	            for (const pair of pairs) {
	                const key = pair.key;
	                const value = pair.value;
	                if (key.status === "aborted" || value.status === "aborted") {
	                    return INVALID;
	                }
	                if (key.status === "dirty" || value.status === "dirty") {
	                    status.dirty();
	                }
	                finalMap.set(key.value, value.value);
	            }
	            return { status: status.value, value: finalMap };
	        }
	    }
	}
	ZodMap.create = (keyType, valueType, params) => {
	    return new ZodMap({
	        valueType,
	        keyType,
	        typeName: ZodFirstPartyTypeKind.ZodMap,
	        ...processCreateParams(params),
	    });
	};
	class ZodSet extends ZodType {
	    _parse(input) {
	        const { status, ctx } = this._processInputParams(input);
	        if (ctx.parsedType !== ZodParsedType.set) {
	            addIssueToContext(ctx, {
	                code: ZodIssueCode.invalid_type,
	                expected: ZodParsedType.set,
	                received: ctx.parsedType,
	            });
	            return INVALID;
	        }
	        const def = this._def;
	        if (def.minSize !== null) {
	            if (ctx.data.size < def.minSize.value) {
	                addIssueToContext(ctx, {
	                    code: ZodIssueCode.too_small,
	                    minimum: def.minSize.value,
	                    type: "set",
	                    inclusive: true,
	                    exact: false,
	                    message: def.minSize.message,
	                });
	                status.dirty();
	            }
	        }
	        if (def.maxSize !== null) {
	            if (ctx.data.size > def.maxSize.value) {
	                addIssueToContext(ctx, {
	                    code: ZodIssueCode.too_big,
	                    maximum: def.maxSize.value,
	                    type: "set",
	                    inclusive: true,
	                    exact: false,
	                    message: def.maxSize.message,
	                });
	                status.dirty();
	            }
	        }
	        const valueType = this._def.valueType;
	        function finalizeSet(elements) {
	            const parsedSet = new Set();
	            for (const element of elements) {
	                if (element.status === "aborted")
	                    return INVALID;
	                if (element.status === "dirty")
	                    status.dirty();
	                parsedSet.add(element.value);
	            }
	            return { status: status.value, value: parsedSet };
	        }
	        const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
	        if (ctx.common.async) {
	            return Promise.all(elements).then((elements) => finalizeSet(elements));
	        }
	        else {
	            return finalizeSet(elements);
	        }
	    }
	    min(minSize, message) {
	        return new ZodSet({
	            ...this._def,
	            minSize: { value: minSize, message: errorUtil.toString(message) },
	        });
	    }
	    max(maxSize, message) {
	        return new ZodSet({
	            ...this._def,
	            maxSize: { value: maxSize, message: errorUtil.toString(message) },
	        });
	    }
	    size(size, message) {
	        return this.min(size, message).max(size, message);
	    }
	    nonempty(message) {
	        return this.min(1, message);
	    }
	}
	ZodSet.create = (valueType, params) => {
	    return new ZodSet({
	        valueType,
	        minSize: null,
	        maxSize: null,
	        typeName: ZodFirstPartyTypeKind.ZodSet,
	        ...processCreateParams(params),
	    });
	};
	class ZodFunction extends ZodType {
	    constructor() {
	        super(...arguments);
	        this.validate = this.implement;
	    }
	    _parse(input) {
	        const { ctx } = this._processInputParams(input);
	        if (ctx.parsedType !== ZodParsedType.function) {
	            addIssueToContext(ctx, {
	                code: ZodIssueCode.invalid_type,
	                expected: ZodParsedType.function,
	                received: ctx.parsedType,
	            });
	            return INVALID;
	        }
	        function makeArgsIssue(args, error) {
	            return makeIssue({
	                data: args,
	                path: ctx.path,
	                errorMaps: [
	                    ctx.common.contextualErrorMap,
	                    ctx.schemaErrorMap,
	                    getErrorMap(),
	                    errorMap,
	                ].filter((x) => !!x),
	                issueData: {
	                    code: ZodIssueCode.invalid_arguments,
	                    argumentsError: error,
	                },
	            });
	        }
	        function makeReturnsIssue(returns, error) {
	            return makeIssue({
	                data: returns,
	                path: ctx.path,
	                errorMaps: [
	                    ctx.common.contextualErrorMap,
	                    ctx.schemaErrorMap,
	                    getErrorMap(),
	                    errorMap,
	                ].filter((x) => !!x),
	                issueData: {
	                    code: ZodIssueCode.invalid_return_type,
	                    returnTypeError: error,
	                },
	            });
	        }
	        const params = { errorMap: ctx.common.contextualErrorMap };
	        const fn = ctx.data;
	        if (this._def.returns instanceof ZodPromise) {
	            return OK(async (...args) => {
	                const error = new ZodError([]);
	                const parsedArgs = await this._def.args
	                    .parseAsync(args, params)
	                    .catch((e) => {
	                    error.addIssue(makeArgsIssue(args, e));
	                    throw error;
	                });
	                const result = await fn(...parsedArgs);
	                const parsedReturns = await this._def.returns._def.type
	                    .parseAsync(result, params)
	                    .catch((e) => {
	                    error.addIssue(makeReturnsIssue(result, e));
	                    throw error;
	                });
	                return parsedReturns;
	            });
	        }
	        else {
	            return OK((...args) => {
	                const parsedArgs = this._def.args.safeParse(args, params);
	                if (!parsedArgs.success) {
	                    throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
	                }
	                const result = fn(...parsedArgs.data);
	                const parsedReturns = this._def.returns.safeParse(result, params);
	                if (!parsedReturns.success) {
	                    throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
	                }
	                return parsedReturns.data;
	            });
	        }
	    }
	    parameters() {
	        return this._def.args;
	    }
	    returnType() {
	        return this._def.returns;
	    }
	    args(...items) {
	        return new ZodFunction({
	            ...this._def,
	            args: ZodTuple.create(items).rest(ZodUnknown.create()),
	        });
	    }
	    returns(returnType) {
	        return new ZodFunction({
	            ...this._def,
	            returns: returnType,
	        });
	    }
	    implement(func) {
	        const validatedFunc = this.parse(func);
	        return validatedFunc;
	    }
	    strictImplement(func) {
	        const validatedFunc = this.parse(func);
	        return validatedFunc;
	    }
	    static create(args, returns, params) {
	        return new ZodFunction({
	            args: (args
	                ? args
	                : ZodTuple.create([]).rest(ZodUnknown.create())),
	            returns: returns || ZodUnknown.create(),
	            typeName: ZodFirstPartyTypeKind.ZodFunction,
	            ...processCreateParams(params),
	        });
	    }
	}
	class ZodLazy extends ZodType {
	    get schema() {
	        return this._def.getter();
	    }
	    _parse(input) {
	        const { ctx } = this._processInputParams(input);
	        const lazySchema = this._def.getter();
	        return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
	    }
	}
	ZodLazy.create = (getter, params) => {
	    return new ZodLazy({
	        getter: getter,
	        typeName: ZodFirstPartyTypeKind.ZodLazy,
	        ...processCreateParams(params),
	    });
	};
	class ZodLiteral extends ZodType {
	    _parse(input) {
	        if (input.data !== this._def.value) {
	            const ctx = this._getOrReturnCtx(input);
	            addIssueToContext(ctx, {
	                received: ctx.data,
	                code: ZodIssueCode.invalid_literal,
	                expected: this._def.value,
	            });
	            return INVALID;
	        }
	        return { status: "valid", value: input.data };
	    }
	    get value() {
	        return this._def.value;
	    }
	}
	ZodLiteral.create = (value, params) => {
	    return new ZodLiteral({
	        value: value,
	        typeName: ZodFirstPartyTypeKind.ZodLiteral,
	        ...processCreateParams(params),
	    });
	};
	function createZodEnum(values, params) {
	    return new ZodEnum({
	        values: values,
	        typeName: ZodFirstPartyTypeKind.ZodEnum,
	        ...processCreateParams(params),
	    });
	}
	class ZodEnum extends ZodType {
	    _parse(input) {
	        if (typeof input.data !== "string") {
	            const ctx = this._getOrReturnCtx(input);
	            const expectedValues = this._def.values;
	            addIssueToContext(ctx, {
	                expected: util.joinValues(expectedValues),
	                received: ctx.parsedType,
	                code: ZodIssueCode.invalid_type,
	            });
	            return INVALID;
	        }
	        if (this._def.values.indexOf(input.data) === -1) {
	            const ctx = this._getOrReturnCtx(input);
	            const expectedValues = this._def.values;
	            addIssueToContext(ctx, {
	                received: ctx.data,
	                code: ZodIssueCode.invalid_enum_value,
	                options: expectedValues,
	            });
	            return INVALID;
	        }
	        return OK(input.data);
	    }
	    get options() {
	        return this._def.values;
	    }
	    get enum() {
	        const enumValues = {};
	        for (const val of this._def.values) {
	            enumValues[val] = val;
	        }
	        return enumValues;
	    }
	    get Values() {
	        const enumValues = {};
	        for (const val of this._def.values) {
	            enumValues[val] = val;
	        }
	        return enumValues;
	    }
	    get Enum() {
	        const enumValues = {};
	        for (const val of this._def.values) {
	            enumValues[val] = val;
	        }
	        return enumValues;
	    }
	    extract(values) {
	        return ZodEnum.create(values);
	    }
	    exclude(values) {
	        return ZodEnum.create(this.options.filter((opt) => !values.includes(opt)));
	    }
	}
	ZodEnum.create = createZodEnum;
	class ZodNativeEnum extends ZodType {
	    _parse(input) {
	        const nativeEnumValues = util.getValidEnumValues(this._def.values);
	        const ctx = this._getOrReturnCtx(input);
	        if (ctx.parsedType !== ZodParsedType.string &&
	            ctx.parsedType !== ZodParsedType.number) {
	            const expectedValues = util.objectValues(nativeEnumValues);
	            addIssueToContext(ctx, {
	                expected: util.joinValues(expectedValues),
	                received: ctx.parsedType,
	                code: ZodIssueCode.invalid_type,
	            });
	            return INVALID;
	        }
	        if (nativeEnumValues.indexOf(input.data) === -1) {
	            const expectedValues = util.objectValues(nativeEnumValues);
	            addIssueToContext(ctx, {
	                received: ctx.data,
	                code: ZodIssueCode.invalid_enum_value,
	                options: expectedValues,
	            });
	            return INVALID;
	        }
	        return OK(input.data);
	    }
	    get enum() {
	        return this._def.values;
	    }
	}
	ZodNativeEnum.create = (values, params) => {
	    return new ZodNativeEnum({
	        values: values,
	        typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
	        ...processCreateParams(params),
	    });
	};
	class ZodPromise extends ZodType {
	    unwrap() {
	        return this._def.type;
	    }
	    _parse(input) {
	        const { ctx } = this._processInputParams(input);
	        if (ctx.parsedType !== ZodParsedType.promise &&
	            ctx.common.async === false) {
	            addIssueToContext(ctx, {
	                code: ZodIssueCode.invalid_type,
	                expected: ZodParsedType.promise,
	                received: ctx.parsedType,
	            });
	            return INVALID;
	        }
	        const promisified = ctx.parsedType === ZodParsedType.promise
	            ? ctx.data
	            : Promise.resolve(ctx.data);
	        return OK(promisified.then((data) => {
	            return this._def.type.parseAsync(data, {
	                path: ctx.path,
	                errorMap: ctx.common.contextualErrorMap,
	            });
	        }));
	    }
	}
	ZodPromise.create = (schema, params) => {
	    return new ZodPromise({
	        type: schema,
	        typeName: ZodFirstPartyTypeKind.ZodPromise,
	        ...processCreateParams(params),
	    });
	};
	class ZodEffects extends ZodType {
	    innerType() {
	        return this._def.schema;
	    }
	    sourceType() {
	        return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects
	            ? this._def.schema.sourceType()
	            : this._def.schema;
	    }
	    _parse(input) {
	        const { status, ctx } = this._processInputParams(input);
	        const effect = this._def.effect || null;
	        if (effect.type === "preprocess") {
	            const processed = effect.transform(ctx.data);
	            if (ctx.common.async) {
	                return Promise.resolve(processed).then((processed) => {
	                    return this._def.schema._parseAsync({
	                        data: processed,
	                        path: ctx.path,
	                        parent: ctx,
	                    });
	                });
	            }
	            else {
	                return this._def.schema._parseSync({
	                    data: processed,
	                    path: ctx.path,
	                    parent: ctx,
	                });
	            }
	        }
	        const checkCtx = {
	            addIssue: (arg) => {
	                addIssueToContext(ctx, arg);
	                if (arg.fatal) {
	                    status.abort();
	                }
	                else {
	                    status.dirty();
	                }
	            },
	            get path() {
	                return ctx.path;
	            },
	        };
	        checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
	        if (effect.type === "refinement") {
	            const executeRefinement = (acc
	            // effect: RefinementEffect<any>
	            ) => {
	                const result = effect.refinement(acc, checkCtx);
	                if (ctx.common.async) {
	                    return Promise.resolve(result);
	                }
	                if (result instanceof Promise) {
	                    throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
	                }
	                return acc;
	            };
	            if (ctx.common.async === false) {
	                const inner = this._def.schema._parseSync({
	                    data: ctx.data,
	                    path: ctx.path,
	                    parent: ctx,
	                });
	                if (inner.status === "aborted")
	                    return INVALID;
	                if (inner.status === "dirty")
	                    status.dirty();
	                // return value is ignored
	                executeRefinement(inner.value);
	                return { status: status.value, value: inner.value };
	            }
	            else {
	                return this._def.schema
	                    ._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx })
	                    .then((inner) => {
	                    if (inner.status === "aborted")
	                        return INVALID;
	                    if (inner.status === "dirty")
	                        status.dirty();
	                    return executeRefinement(inner.value).then(() => {
	                        return { status: status.value, value: inner.value };
	                    });
	                });
	            }
	        }
	        if (effect.type === "transform") {
	            if (ctx.common.async === false) {
	                const base = this._def.schema._parseSync({
	                    data: ctx.data,
	                    path: ctx.path,
	                    parent: ctx,
	                });
	                if (!isValid(base))
	                    return base;
	                const result = effect.transform(base.value, checkCtx);
	                if (result instanceof Promise) {
	                    throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
	                }
	                return { status: status.value, value: result };
	            }
	            else {
	                return this._def.schema
	                    ._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx })
	                    .then((base) => {
	                    if (!isValid(base))
	                        return base;
	                    return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({ status: status.value, value: result }));
	                });
	            }
	        }
	        util.assertNever(effect);
	    }
	}
	ZodEffects.create = (schema, effect, params) => {
	    return new ZodEffects({
	        schema,
	        typeName: ZodFirstPartyTypeKind.ZodEffects,
	        effect,
	        ...processCreateParams(params),
	    });
	};
	ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
	    return new ZodEffects({
	        schema,
	        effect: { type: "preprocess", transform: preprocess },
	        typeName: ZodFirstPartyTypeKind.ZodEffects,
	        ...processCreateParams(params),
	    });
	};
	class ZodOptional extends ZodType {
	    _parse(input) {
	        const parsedType = this._getType(input);
	        if (parsedType === ZodParsedType.undefined) {
	            return OK(undefined);
	        }
	        return this._def.innerType._parse(input);
	    }
	    unwrap() {
	        return this._def.innerType;
	    }
	}
	ZodOptional.create = (type, params) => {
	    return new ZodOptional({
	        innerType: type,
	        typeName: ZodFirstPartyTypeKind.ZodOptional,
	        ...processCreateParams(params),
	    });
	};
	class ZodNullable extends ZodType {
	    _parse(input) {
	        const parsedType = this._getType(input);
	        if (parsedType === ZodParsedType.null) {
	            return OK(null);
	        }
	        return this._def.innerType._parse(input);
	    }
	    unwrap() {
	        return this._def.innerType;
	    }
	}
	ZodNullable.create = (type, params) => {
	    return new ZodNullable({
	        innerType: type,
	        typeName: ZodFirstPartyTypeKind.ZodNullable,
	        ...processCreateParams(params),
	    });
	};
	class ZodDefault extends ZodType {
	    _parse(input) {
	        const { ctx } = this._processInputParams(input);
	        let data = ctx.data;
	        if (ctx.parsedType === ZodParsedType.undefined) {
	            data = this._def.defaultValue();
	        }
	        return this._def.innerType._parse({
	            data,
	            path: ctx.path,
	            parent: ctx,
	        });
	    }
	    removeDefault() {
	        return this._def.innerType;
	    }
	}
	ZodDefault.create = (type, params) => {
	    return new ZodDefault({
	        innerType: type,
	        typeName: ZodFirstPartyTypeKind.ZodDefault,
	        defaultValue: typeof params.default === "function"
	            ? params.default
	            : () => params.default,
	        ...processCreateParams(params),
	    });
	};
	class ZodCatch extends ZodType {
	    _parse(input) {
	        const { ctx } = this._processInputParams(input);
	        // newCtx is used to not collect issues from inner types in ctx
	        const newCtx = {
	            ...ctx,
	            common: {
	                ...ctx.common,
	                issues: [],
	            },
	        };
	        const result = this._def.innerType._parse({
	            data: newCtx.data,
	            path: newCtx.path,
	            parent: {
	                ...newCtx,
	            },
	        });
	        if (isAsync(result)) {
	            return result.then((result) => {
	                return {
	                    status: "valid",
	                    value: result.status === "valid"
	                        ? result.value
	                        : this._def.catchValue({
	                            get error() {
	                                return new ZodError(newCtx.common.issues);
	                            },
	                            input: newCtx.data,
	                        }),
	                };
	            });
	        }
	        else {
	            return {
	                status: "valid",
	                value: result.status === "valid"
	                    ? result.value
	                    : this._def.catchValue({
	                        get error() {
	                            return new ZodError(newCtx.common.issues);
	                        },
	                        input: newCtx.data,
	                    }),
	            };
	        }
	    }
	    removeCatch() {
	        return this._def.innerType;
	    }
	}
	ZodCatch.create = (type, params) => {
	    return new ZodCatch({
	        innerType: type,
	        typeName: ZodFirstPartyTypeKind.ZodCatch,
	        catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
	        ...processCreateParams(params),
	    });
	};
	class ZodNaN extends ZodType {
	    _parse(input) {
	        const parsedType = this._getType(input);
	        if (parsedType !== ZodParsedType.nan) {
	            const ctx = this._getOrReturnCtx(input);
	            addIssueToContext(ctx, {
	                code: ZodIssueCode.invalid_type,
	                expected: ZodParsedType.nan,
	                received: ctx.parsedType,
	            });
	            return INVALID;
	        }
	        return { status: "valid", value: input.data };
	    }
	}
	ZodNaN.create = (params) => {
	    return new ZodNaN({
	        typeName: ZodFirstPartyTypeKind.ZodNaN,
	        ...processCreateParams(params),
	    });
	};
	const BRAND = Symbol("zod_brand");
	class ZodBranded extends ZodType {
	    _parse(input) {
	        const { ctx } = this._processInputParams(input);
	        const data = ctx.data;
	        return this._def.type._parse({
	            data,
	            path: ctx.path,
	            parent: ctx,
	        });
	    }
	    unwrap() {
	        return this._def.type;
	    }
	}
	class ZodPipeline extends ZodType {
	    _parse(input) {
	        const { status, ctx } = this._processInputParams(input);
	        if (ctx.common.async) {
	            const handleAsync = async () => {
	                const inResult = await this._def.in._parseAsync({
	                    data: ctx.data,
	                    path: ctx.path,
	                    parent: ctx,
	                });
	                if (inResult.status === "aborted")
	                    return INVALID;
	                if (inResult.status === "dirty") {
	                    status.dirty();
	                    return DIRTY(inResult.value);
	                }
	                else {
	                    return this._def.out._parseAsync({
	                        data: inResult.value,
	                        path: ctx.path,
	                        parent: ctx,
	                    });
	                }
	            };
	            return handleAsync();
	        }
	        else {
	            const inResult = this._def.in._parseSync({
	                data: ctx.data,
	                path: ctx.path,
	                parent: ctx,
	            });
	            if (inResult.status === "aborted")
	                return INVALID;
	            if (inResult.status === "dirty") {
	                status.dirty();
	                return {
	                    status: "dirty",
	                    value: inResult.value,
	                };
	            }
	            else {
	                return this._def.out._parseSync({
	                    data: inResult.value,
	                    path: ctx.path,
	                    parent: ctx,
	                });
	            }
	        }
	    }
	    static create(a, b) {
	        return new ZodPipeline({
	            in: a,
	            out: b,
	            typeName: ZodFirstPartyTypeKind.ZodPipeline,
	        });
	    }
	}
	const custom = (check, params = {}, 
	/*
	 * @deprecated
	 *
	 * Pass `fatal` into the params object instead:
	 *
	 * ```ts
	 * z.string().custom((val) => val.length > 5, { fatal: false })
	 * ```
	 *
	 */
	fatal) => {
	    if (check)
	        return ZodAny.create().superRefine((data, ctx) => {
	            var _a, _b;
	            if (!check(data)) {
	                const p = typeof params === "function"
	                    ? params(data)
	                    : typeof params === "string"
	                        ? { message: params }
	                        : params;
	                const _fatal = (_b = (_a = p.fatal) !== null && _a !== void 0 ? _a : fatal) !== null && _b !== void 0 ? _b : true;
	                const p2 = typeof p === "string" ? { message: p } : p;
	                ctx.addIssue({ code: "custom", ...p2, fatal: _fatal });
	            }
	        });
	    return ZodAny.create();
	};
	const late = {
	    object: ZodObject.lazycreate,
	};
	var ZodFirstPartyTypeKind;
	(function (ZodFirstPartyTypeKind) {
	    ZodFirstPartyTypeKind["ZodString"] = "ZodString";
	    ZodFirstPartyTypeKind["ZodNumber"] = "ZodNumber";
	    ZodFirstPartyTypeKind["ZodNaN"] = "ZodNaN";
	    ZodFirstPartyTypeKind["ZodBigInt"] = "ZodBigInt";
	    ZodFirstPartyTypeKind["ZodBoolean"] = "ZodBoolean";
	    ZodFirstPartyTypeKind["ZodDate"] = "ZodDate";
	    ZodFirstPartyTypeKind["ZodSymbol"] = "ZodSymbol";
	    ZodFirstPartyTypeKind["ZodUndefined"] = "ZodUndefined";
	    ZodFirstPartyTypeKind["ZodNull"] = "ZodNull";
	    ZodFirstPartyTypeKind["ZodAny"] = "ZodAny";
	    ZodFirstPartyTypeKind["ZodUnknown"] = "ZodUnknown";
	    ZodFirstPartyTypeKind["ZodNever"] = "ZodNever";
	    ZodFirstPartyTypeKind["ZodVoid"] = "ZodVoid";
	    ZodFirstPartyTypeKind["ZodArray"] = "ZodArray";
	    ZodFirstPartyTypeKind["ZodObject"] = "ZodObject";
	    ZodFirstPartyTypeKind["ZodUnion"] = "ZodUnion";
	    ZodFirstPartyTypeKind["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
	    ZodFirstPartyTypeKind["ZodIntersection"] = "ZodIntersection";
	    ZodFirstPartyTypeKind["ZodTuple"] = "ZodTuple";
	    ZodFirstPartyTypeKind["ZodRecord"] = "ZodRecord";
	    ZodFirstPartyTypeKind["ZodMap"] = "ZodMap";
	    ZodFirstPartyTypeKind["ZodSet"] = "ZodSet";
	    ZodFirstPartyTypeKind["ZodFunction"] = "ZodFunction";
	    ZodFirstPartyTypeKind["ZodLazy"] = "ZodLazy";
	    ZodFirstPartyTypeKind["ZodLiteral"] = "ZodLiteral";
	    ZodFirstPartyTypeKind["ZodEnum"] = "ZodEnum";
	    ZodFirstPartyTypeKind["ZodEffects"] = "ZodEffects";
	    ZodFirstPartyTypeKind["ZodNativeEnum"] = "ZodNativeEnum";
	    ZodFirstPartyTypeKind["ZodOptional"] = "ZodOptional";
	    ZodFirstPartyTypeKind["ZodNullable"] = "ZodNullable";
	    ZodFirstPartyTypeKind["ZodDefault"] = "ZodDefault";
	    ZodFirstPartyTypeKind["ZodCatch"] = "ZodCatch";
	    ZodFirstPartyTypeKind["ZodPromise"] = "ZodPromise";
	    ZodFirstPartyTypeKind["ZodBranded"] = "ZodBranded";
	    ZodFirstPartyTypeKind["ZodPipeline"] = "ZodPipeline";
	})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
	const instanceOfType = (
	// const instanceOfType = <T extends new (...args: any[]) => any>(
	cls, params = {
	    message: `Input not instance of ${cls.name}`,
	}) => custom((data) => data instanceof cls, params);
	const stringType = ZodString.create;
	const numberType = ZodNumber.create;
	const nanType = ZodNaN.create;
	const bigIntType = ZodBigInt.create;
	const booleanType = ZodBoolean.create;
	const dateType = ZodDate.create;
	const symbolType = ZodSymbol.create;
	const undefinedType = ZodUndefined.create;
	const nullType = ZodNull.create;
	const anyType = ZodAny.create;
	const unknownType = ZodUnknown.create;
	const neverType = ZodNever.create;
	const voidType = ZodVoid.create;
	const arrayType = ZodArray.create;
	const objectType = ZodObject.create;
	const strictObjectType = ZodObject.strictCreate;
	const unionType = ZodUnion.create;
	const discriminatedUnionType = ZodDiscriminatedUnion.create;
	const intersectionType = ZodIntersection.create;
	const tupleType = ZodTuple.create;
	const recordType = ZodRecord.create;
	const mapType = ZodMap.create;
	const setType = ZodSet.create;
	const functionType = ZodFunction.create;
	const lazyType = ZodLazy.create;
	const literalType = ZodLiteral.create;
	const enumType = ZodEnum.create;
	const nativeEnumType = ZodNativeEnum.create;
	const promiseType = ZodPromise.create;
	const effectsType = ZodEffects.create;
	const optionalType = ZodOptional.create;
	const nullableType = ZodNullable.create;
	const preprocessType = ZodEffects.createWithPreprocess;
	const pipelineType = ZodPipeline.create;
	const ostring = () => stringType().optional();
	const onumber = () => numberType().optional();
	const oboolean = () => booleanType().optional();
	const coerce = {
	    string: ((arg) => ZodString.create({ ...arg, coerce: true })),
	    number: ((arg) => ZodNumber.create({ ...arg, coerce: true })),
	    boolean: ((arg) => ZodBoolean.create({
	        ...arg,
	        coerce: true,
	    })),
	    bigint: ((arg) => ZodBigInt.create({ ...arg, coerce: true })),
	    date: ((arg) => ZodDate.create({ ...arg, coerce: true })),
	};
	const NEVER = INVALID;

	var z = /*#__PURE__*/Object.freeze({
	    __proto__: null,
	    defaultErrorMap: errorMap,
	    setErrorMap: setErrorMap,
	    getErrorMap: getErrorMap,
	    makeIssue: makeIssue,
	    EMPTY_PATH: EMPTY_PATH,
	    addIssueToContext: addIssueToContext,
	    ParseStatus: ParseStatus,
	    INVALID: INVALID,
	    DIRTY: DIRTY,
	    OK: OK,
	    isAborted: isAborted,
	    isDirty: isDirty,
	    isValid: isValid,
	    isAsync: isAsync,
	    get util () { return util; },
	    get objectUtil () { return objectUtil; },
	    ZodParsedType: ZodParsedType,
	    getParsedType: getParsedType,
	    ZodType: ZodType,
	    ZodString: ZodString,
	    ZodNumber: ZodNumber,
	    ZodBigInt: ZodBigInt,
	    ZodBoolean: ZodBoolean,
	    ZodDate: ZodDate,
	    ZodSymbol: ZodSymbol,
	    ZodUndefined: ZodUndefined,
	    ZodNull: ZodNull,
	    ZodAny: ZodAny,
	    ZodUnknown: ZodUnknown,
	    ZodNever: ZodNever,
	    ZodVoid: ZodVoid,
	    ZodArray: ZodArray,
	    ZodObject: ZodObject,
	    ZodUnion: ZodUnion,
	    ZodDiscriminatedUnion: ZodDiscriminatedUnion,
	    ZodIntersection: ZodIntersection,
	    ZodTuple: ZodTuple,
	    ZodRecord: ZodRecord,
	    ZodMap: ZodMap,
	    ZodSet: ZodSet,
	    ZodFunction: ZodFunction,
	    ZodLazy: ZodLazy,
	    ZodLiteral: ZodLiteral,
	    ZodEnum: ZodEnum,
	    ZodNativeEnum: ZodNativeEnum,
	    ZodPromise: ZodPromise,
	    ZodEffects: ZodEffects,
	    ZodTransformer: ZodEffects,
	    ZodOptional: ZodOptional,
	    ZodNullable: ZodNullable,
	    ZodDefault: ZodDefault,
	    ZodCatch: ZodCatch,
	    ZodNaN: ZodNaN,
	    BRAND: BRAND,
	    ZodBranded: ZodBranded,
	    ZodPipeline: ZodPipeline,
	    custom: custom,
	    Schema: ZodType,
	    ZodSchema: ZodType,
	    late: late,
	    get ZodFirstPartyTypeKind () { return ZodFirstPartyTypeKind; },
	    coerce: coerce,
	    any: anyType,
	    array: arrayType,
	    bigint: bigIntType,
	    boolean: booleanType,
	    date: dateType,
	    discriminatedUnion: discriminatedUnionType,
	    effect: effectsType,
	    'enum': enumType,
	    'function': functionType,
	    'instanceof': instanceOfType,
	    intersection: intersectionType,
	    lazy: lazyType,
	    literal: literalType,
	    map: mapType,
	    nan: nanType,
	    nativeEnum: nativeEnumType,
	    never: neverType,
	    'null': nullType,
	    nullable: nullableType,
	    number: numberType,
	    object: objectType,
	    oboolean: oboolean,
	    onumber: onumber,
	    optional: optionalType,
	    ostring: ostring,
	    pipeline: pipelineType,
	    preprocess: preprocessType,
	    promise: promiseType,
	    record: recordType,
	    set: setType,
	    strictObject: strictObjectType,
	    string: stringType,
	    symbol: symbolType,
	    transformer: effectsType,
	    tuple: tupleType,
	    'undefined': undefinedType,
	    union: unionType,
	    unknown: unknownType,
	    'void': voidType,
	    NEVER: NEVER,
	    ZodIssueCode: ZodIssueCode,
	    quotelessJson: quotelessJson,
	    ZodError: ZodError
	});

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
	        var example = 'crowdhandler.init({ publicKey })'
	            ;
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

	var APIResponse = z.object({}).catchall(z.any());
	z
	    .object({
	    error: z.string().optional(),
	    message: z.string().optional(),
	    statusCode: z.number().optional(),
	})
	    .catchall(z.any());
	var BaseClient = /** @class */ (function () {
	    function BaseClient(apiUrl, key, options) {
	        if (options === void 0) { options = {}; }
	        this.debug = options.debug || false;
	        this.apiUrl = options.apiUrl || apiUrl;
	        this.key = key;
	        this.timeout = options.timeout || 5000;
	        axios.defaults.timeout = this.timeout;
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
	                        return [4 /*yield*/, axios.delete(this.apiUrl + path, {
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
	                        return [4 /*yield*/, axios.get(this.apiUrl + path, {
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
	                        return [4 /*yield*/, axios.post(this.apiUrl + path, body, {
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
	                        return [4 /*yield*/, axios.put(this.apiUrl + path, body, {
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
	        return _super.prototype.httpGET.call(this, this.path, params);
	    };
	    Resource.prototype.post = function (body) {
	        this.path = this.formatPath(this.path, "");
	        return _super.prototype.httpPOST.call(this, this.path, body);
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
	    BrowserHandler.prototype.setCookie = function (value, cookieName) {
	        if (cookieName === void 0) { cookieName = "crowdhandler"; }
	        var cookieOptions = {
	            path: "/",
	            secure: true, // cookie will only be sent over HTTPS
	        };
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
	    LambdaResponseHandler.prototype.setCookie = function (value, cookieName) {
	        if (cookieName === void 0) { cookieName = "crowdhandler"; }
	        var cookieOptions = {
	            path: "/",
	            secure: true, // cookie will only be sent over HTTPS
	        };
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
	    NodeJSHandler.prototype.setCookie = function (value, cookieName) {
	        if (cookieName === void 0) { cookieName = "crowdhandler"; }
	        var cookieOptions = {
	            path: "/",
	            secure: true, // cookie will only be sent over HTTPS
	        };
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
	var RoomConfig = z.object({
	    domain: z.string(),
	    urlPattern: z.string().optional(),
	    patternType: z.enum(['regex', 'contains', 'all']).optional(),
	    queueActivatesOn: z.number().optional(),
	    slug: z.string(),
	    timeout: z.number().optional()
	});
	var RoomsConfig = z.array(RoomConfig);
	//Gatekeeper Options
	z.object({
	    debug: z.boolean().optional(),
	    fallbackSlug: z.string().optional(),
	    mode: z.string().optional(),
	    timeout: z.number().optional(),
	    trustOnFail: z.boolean().optional(),
	    cookieName: z.string().optional(),
	    liteValidator: z.boolean().optional(),
	    roomsConfig: RoomsConfig.optional(),
	    waitingRoom: z.boolean().optional(),
	});
	z.object({
	    publicKey: z.string(),
	    privateKey: z.string().optional(),
	});
	z
	    .object({
	    "ch-code": z.string().optional(),
	    "ch-id": z.string().optional(),
	    "ch-id-signature": z.string().optional(),
	    "ch-public-key": z.string().optional(),
	    "ch-requested": z.string().optional(),
	    "ch-token": z.string().optional(),
	})
	    .catchall(z.any());
	var SpecialParametersObject = z.object({
	    chCode: z.string(),
	    chID: z.string(),
	    chIDSignature: z.string(),
	    chPublicKey: z.string(),
	    chRequested: z.string(),
	});
	// Request configuration for session status API calls
	z.object({
	    agent: z.string().optional(),
	    ip: z.string().optional(),
	    lang: z.string().optional(),
	    url: z.string().optional(),
	    slug: z.string().optional(),
	});
	z.object({
	    targetURL: z.string(),
	    specialParameters: SpecialParametersObject,
	});
	z
	    .object({
	    hostname: z.string(),
	    path: z.string(),
	})
	    .catchall(z.any());
	//Cookie object structure validation
	var CookieObject = z
	    .object({
	    tokens: z.array(z.any()),
	    deployment: z.string().optional(),
	})
	    .catchall(z.any());
	var LocalStorageObject = z.object({
	    countdown: z.record(z.unknown()),
	    positions: z.record(z.unknown()),
	    token: z.record(z.string()),
	});
	z.object({
	    storageName: z.string(),
	    localStorageValue: z.string(),
	});
	//Response structure validation
	var RoomMetaObject = z
	    .object({
	    domain: z.string().nullable(),
	    patternType: z.string().nullable(),
	    queueActivatesOn: z.string().nullable(),
	    slug: z.string().nullable(),
	    status: z.boolean().nullable(),
	    timeout: z.number().nullable(),
	})
	    .catchall(z.any());
	z.array(z.object({
	    gen: z.string(),
	    sig: z.string(),
	}));
	z.object({
	    expiration: z.nullable(z.boolean()),
	    success: z.nullable(z.boolean()),
	});
	z.object({
	    chIDSignature: z.string().optional(),
	    crowdhandlerCookieValue: CookieObject.optional(),
	});
	z.object({
	    //object can contain anything and we don't know any of the possible values
	    crowdhandlerCookieValue: CookieObject.optional(),
	    chID: z.string().optional(),
	    localStorageValue: LocalStorageObject.optional(),
	    simpleCookieValue: z.string().optional(),
	});
	z.object({
	    token: z.string(),
	    touched: z.number(),
	    touchedSig: z.string(),
	    signatures: z.array(z.any()),
	});
	z.object({
	    tokenDatestamp: z.number(),
	    tokenDatestampSignature: z.string(),
	    tokenSignature: z.string(),
	    tokenSignatureGenerated: z.string(),
	    tokenSignatures: z.array(z.any()),
	    tokenValue: z.string(),
	});
	z.object({
	    promoted: z.boolean(),
	    stripParams: z.boolean(),
	    setCookie: z.boolean(),
	    cookieValue: z.string().optional(),
	    setLocalStorage: z.boolean(),
	    localStorageValue: z.string().optional(),
	    responseID: z.string().optional(),
	    slug: z.string().optional(),
	    targetURL: z.string().optional(),
	    deployment: z.string().optional(),
	    hash: z.string().nullable().optional(),
	    token: z.string().optional(),
	    requested: z.string().optional(),
	    liteValidatorRedirect: z.boolean().optional(),
	    liteValidatorUrl: z.string().optional(),
	});
	var HttpErrorWrapper = z.object({
	    result: z.object({
	        error: z.string().nullable(),
	        status: z.number().nullable(),
	    }),
	});
	z.object({
	    result: z
	        .object({
	        hash: z.string().nullable().optional(),
	        promoted: z.number().nullable(),
	        status: z.number().nullable(),
	        slug: z.string().nullable().optional(),
	        token: z.string().nullable().optional(),
	        urlRedirect: z.string().nullable().optional(),
	        requested: z.string().nullable().optional(),
	    })
	        .catchall(z.any()),
	});
	var RecordPerformanceOptions = z.object({
	    statusCode: z.number().optional().default(200),
	    sample: z.number().optional().default(0.2),
	    overrideElapsed: z.number().optional(),
	    responseID: z.string().optional(),
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

	var queryString = {};

	var strictUriEncode;
	var hasRequiredStrictUriEncode;

	function requireStrictUriEncode () {
		if (hasRequiredStrictUriEncode) return strictUriEncode;
		hasRequiredStrictUriEncode = 1;
		strictUriEncode = str => encodeURIComponent(str).replace(/[!'()*]/g, x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);
		return strictUriEncode;
	}

	var decodeUriComponent;
	var hasRequiredDecodeUriComponent;

	function requireDecodeUriComponent () {
		if (hasRequiredDecodeUriComponent) return decodeUriComponent;
		hasRequiredDecodeUriComponent = 1;
		var token = '%[a-f0-9]{2}';
		var singleMatcher = new RegExp('(' + token + ')|([^%]+?)', 'gi');
		var multiMatcher = new RegExp('(' + token + ')+', 'gi');

		function decodeComponents(components, split) {
			try {
				// Try to decode the entire string first
				return [decodeURIComponent(components.join(''))];
			} catch (err) {
				// Do nothing
			}

			if (components.length === 1) {
				return components;
			}

			split = split || 1;

			// Split the array in 2 parts
			var left = components.slice(0, split);
			var right = components.slice(split);

			return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
		}

		function decode(input) {
			try {
				return decodeURIComponent(input);
			} catch (err) {
				var tokens = input.match(singleMatcher) || [];

				for (var i = 1; i < tokens.length; i++) {
					input = decodeComponents(tokens, i).join('');

					tokens = input.match(singleMatcher) || [];
				}

				return input;
			}
		}

		function customDecodeURIComponent(input) {
			// Keep track of all the replacements and prefill the map with the `BOM`
			var replaceMap = {
				'%FE%FF': '\uFFFD\uFFFD',
				'%FF%FE': '\uFFFD\uFFFD'
			};

			var match = multiMatcher.exec(input);
			while (match) {
				try {
					// Decode as big chunks as possible
					replaceMap[match[0]] = decodeURIComponent(match[0]);
				} catch (err) {
					var result = decode(match[0]);

					if (result !== match[0]) {
						replaceMap[match[0]] = result;
					}
				}

				match = multiMatcher.exec(input);
			}

			// Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
			replaceMap['%C2'] = '\uFFFD';

			var entries = Object.keys(replaceMap);

			for (var i = 0; i < entries.length; i++) {
				// Replace all decoded components
				var key = entries[i];
				input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
			}

			return input;
		}

		decodeUriComponent = function (encodedURI) {
			if (typeof encodedURI !== 'string') {
				throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');
			}

			try {
				encodedURI = encodedURI.replace(/\+/g, ' ');

				// Try the built in decoder first
				return decodeURIComponent(encodedURI);
			} catch (err) {
				// Fallback to a more advanced decoder
				return customDecodeURIComponent(encodedURI);
			}
		};
		return decodeUriComponent;
	}

	var splitOnFirst;
	var hasRequiredSplitOnFirst;

	function requireSplitOnFirst () {
		if (hasRequiredSplitOnFirst) return splitOnFirst;
		hasRequiredSplitOnFirst = 1;

		splitOnFirst = (string, separator) => {
			if (!(typeof string === 'string' && typeof separator === 'string')) {
				throw new TypeError('Expected the arguments to be of type `string`');
			}

			if (separator === '') {
				return [string];
			}

			const separatorIndex = string.indexOf(separator);

			if (separatorIndex === -1) {
				return [string];
			}

			return [
				string.slice(0, separatorIndex),
				string.slice(separatorIndex + separator.length)
			];
		};
		return splitOnFirst;
	}

	var filterObj;
	var hasRequiredFilterObj;

	function requireFilterObj () {
		if (hasRequiredFilterObj) return filterObj;
		hasRequiredFilterObj = 1;
		filterObj = function (obj, predicate) {
			var ret = {};
			var keys = Object.keys(obj);
			var isArr = Array.isArray(predicate);

			for (var i = 0; i < keys.length; i++) {
				var key = keys[i];
				var val = obj[key];

				if (isArr ? predicate.indexOf(key) !== -1 : predicate(key, val, obj)) {
					ret[key] = val;
				}
			}

			return ret;
		};
		return filterObj;
	}

	var hasRequiredQueryString;

	function requireQueryString () {
		if (hasRequiredQueryString) return queryString;
		hasRequiredQueryString = 1;
		(function (exports) {
			const strictUriEncode = requireStrictUriEncode();
			const decodeComponent = requireDecodeUriComponent();
			const splitOnFirst = requireSplitOnFirst();
			const filterObject = requireFilterObj();

			const isNullOrUndefined = value => value === null || value === undefined;

			const encodeFragmentIdentifier = Symbol('encodeFragmentIdentifier');

			function encoderForArrayFormat(options) {
				switch (options.arrayFormat) {
					case 'index':
						return key => (result, value) => {
							const index = result.length;

							if (
								value === undefined ||
								(options.skipNull && value === null) ||
								(options.skipEmptyString && value === '')
							) {
								return result;
							}

							if (value === null) {
								return [...result, [encode(key, options), '[', index, ']'].join('')];
							}

							return [
								...result,
								[encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join('')
							];
						};

					case 'bracket':
						return key => (result, value) => {
							if (
								value === undefined ||
								(options.skipNull && value === null) ||
								(options.skipEmptyString && value === '')
							) {
								return result;
							}

							if (value === null) {
								return [...result, [encode(key, options), '[]'].join('')];
							}

							return [...result, [encode(key, options), '[]=', encode(value, options)].join('')];
						};

					case 'colon-list-separator':
						return key => (result, value) => {
							if (
								value === undefined ||
								(options.skipNull && value === null) ||
								(options.skipEmptyString && value === '')
							) {
								return result;
							}

							if (value === null) {
								return [...result, [encode(key, options), ':list='].join('')];
							}

							return [...result, [encode(key, options), ':list=', encode(value, options)].join('')];
						};

					case 'comma':
					case 'separator':
					case 'bracket-separator': {
						const keyValueSep = options.arrayFormat === 'bracket-separator' ?
							'[]=' :
							'=';

						return key => (result, value) => {
							if (
								value === undefined ||
								(options.skipNull && value === null) ||
								(options.skipEmptyString && value === '')
							) {
								return result;
							}

							// Translate null to an empty string so that it doesn't serialize as 'null'
							value = value === null ? '' : value;

							if (result.length === 0) {
								return [[encode(key, options), keyValueSep, encode(value, options)].join('')];
							}

							return [[result, encode(value, options)].join(options.arrayFormatSeparator)];
						};
					}

					default:
						return key => (result, value) => {
							if (
								value === undefined ||
								(options.skipNull && value === null) ||
								(options.skipEmptyString && value === '')
							) {
								return result;
							}

							if (value === null) {
								return [...result, encode(key, options)];
							}

							return [...result, [encode(key, options), '=', encode(value, options)].join('')];
						};
				}
			}

			function parserForArrayFormat(options) {
				let result;

				switch (options.arrayFormat) {
					case 'index':
						return (key, value, accumulator) => {
							result = /\[(\d*)\]$/.exec(key);

							key = key.replace(/\[\d*\]$/, '');

							if (!result) {
								accumulator[key] = value;
								return;
							}

							if (accumulator[key] === undefined) {
								accumulator[key] = {};
							}

							accumulator[key][result[1]] = value;
						};

					case 'bracket':
						return (key, value, accumulator) => {
							result = /(\[\])$/.exec(key);
							key = key.replace(/\[\]$/, '');

							if (!result) {
								accumulator[key] = value;
								return;
							}

							if (accumulator[key] === undefined) {
								accumulator[key] = [value];
								return;
							}

							accumulator[key] = [].concat(accumulator[key], value);
						};

					case 'colon-list-separator':
						return (key, value, accumulator) => {
							result = /(:list)$/.exec(key);
							key = key.replace(/:list$/, '');

							if (!result) {
								accumulator[key] = value;
								return;
							}

							if (accumulator[key] === undefined) {
								accumulator[key] = [value];
								return;
							}

							accumulator[key] = [].concat(accumulator[key], value);
						};

					case 'comma':
					case 'separator':
						return (key, value, accumulator) => {
							const isArray = typeof value === 'string' && value.includes(options.arrayFormatSeparator);
							const isEncodedArray = (typeof value === 'string' && !isArray && decode(value, options).includes(options.arrayFormatSeparator));
							value = isEncodedArray ? decode(value, options) : value;
							const newValue = isArray || isEncodedArray ? value.split(options.arrayFormatSeparator).map(item => decode(item, options)) : value === null ? value : decode(value, options);
							accumulator[key] = newValue;
						};

					case 'bracket-separator':
						return (key, value, accumulator) => {
							const isArray = /(\[\])$/.test(key);
							key = key.replace(/\[\]$/, '');

							if (!isArray) {
								accumulator[key] = value ? decode(value, options) : value;
								return;
							}

							const arrayValue = value === null ?
								[] :
								value.split(options.arrayFormatSeparator).map(item => decode(item, options));

							if (accumulator[key] === undefined) {
								accumulator[key] = arrayValue;
								return;
							}

							accumulator[key] = [].concat(accumulator[key], arrayValue);
						};

					default:
						return (key, value, accumulator) => {
							if (accumulator[key] === undefined) {
								accumulator[key] = value;
								return;
							}

							accumulator[key] = [].concat(accumulator[key], value);
						};
				}
			}

			function validateArrayFormatSeparator(value) {
				if (typeof value !== 'string' || value.length !== 1) {
					throw new TypeError('arrayFormatSeparator must be single character string');
				}
			}

			function encode(value, options) {
				if (options.encode) {
					return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
				}

				return value;
			}

			function decode(value, options) {
				if (options.decode) {
					return decodeComponent(value);
				}

				return value;
			}

			function keysSorter(input) {
				if (Array.isArray(input)) {
					return input.sort();
				}

				if (typeof input === 'object') {
					return keysSorter(Object.keys(input))
						.sort((a, b) => Number(a) - Number(b))
						.map(key => input[key]);
				}

				return input;
			}

			function removeHash(input) {
				const hashStart = input.indexOf('#');
				if (hashStart !== -1) {
					input = input.slice(0, hashStart);
				}

				return input;
			}

			function getHash(url) {
				let hash = '';
				const hashStart = url.indexOf('#');
				if (hashStart !== -1) {
					hash = url.slice(hashStart);
				}

				return hash;
			}

			function extract(input) {
				input = removeHash(input);
				const queryStart = input.indexOf('?');
				if (queryStart === -1) {
					return '';
				}

				return input.slice(queryStart + 1);
			}

			function parseValue(value, options) {
				if (options.parseNumbers && !Number.isNaN(Number(value)) && (typeof value === 'string' && value.trim() !== '')) {
					value = Number(value);
				} else if (options.parseBooleans && value !== null && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
					value = value.toLowerCase() === 'true';
				}

				return value;
			}

			function parse(query, options) {
				options = Object.assign({
					decode: true,
					sort: true,
					arrayFormat: 'none',
					arrayFormatSeparator: ',',
					parseNumbers: false,
					parseBooleans: false
				}, options);

				validateArrayFormatSeparator(options.arrayFormatSeparator);

				const formatter = parserForArrayFormat(options);

				// Create an object with no prototype
				const ret = Object.create(null);

				if (typeof query !== 'string') {
					return ret;
				}

				query = query.trim().replace(/^[?#&]/, '');

				if (!query) {
					return ret;
				}

				for (const param of query.split('&')) {
					if (param === '') {
						continue;
					}

					let [key, value] = splitOnFirst(options.decode ? param.replace(/\+/g, ' ') : param, '=');

					// Missing `=` should be `null`:
					// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
					value = value === undefined ? null : ['comma', 'separator', 'bracket-separator'].includes(options.arrayFormat) ? value : decode(value, options);
					formatter(decode(key, options), value, ret);
				}

				for (const key of Object.keys(ret)) {
					const value = ret[key];
					if (typeof value === 'object' && value !== null) {
						for (const k of Object.keys(value)) {
							value[k] = parseValue(value[k], options);
						}
					} else {
						ret[key] = parseValue(value, options);
					}
				}

				if (options.sort === false) {
					return ret;
				}

				return (options.sort === true ? Object.keys(ret).sort() : Object.keys(ret).sort(options.sort)).reduce((result, key) => {
					const value = ret[key];
					if (Boolean(value) && typeof value === 'object' && !Array.isArray(value)) {
						// Sort object keys, not values
						result[key] = keysSorter(value);
					} else {
						result[key] = value;
					}

					return result;
				}, Object.create(null));
			}

			exports.extract = extract;
			exports.parse = parse;

			exports.stringify = (object, options) => {
				if (!object) {
					return '';
				}

				options = Object.assign({
					encode: true,
					strict: true,
					arrayFormat: 'none',
					arrayFormatSeparator: ','
				}, options);

				validateArrayFormatSeparator(options.arrayFormatSeparator);

				const shouldFilter = key => (
					(options.skipNull && isNullOrUndefined(object[key])) ||
					(options.skipEmptyString && object[key] === '')
				);

				const formatter = encoderForArrayFormat(options);

				const objectCopy = {};

				for (const key of Object.keys(object)) {
					if (!shouldFilter(key)) {
						objectCopy[key] = object[key];
					}
				}

				const keys = Object.keys(objectCopy);

				if (options.sort !== false) {
					keys.sort(options.sort);
				}

				return keys.map(key => {
					const value = object[key];

					if (value === undefined) {
						return '';
					}

					if (value === null) {
						return encode(key, options);
					}

					if (Array.isArray(value)) {
						if (value.length === 0 && options.arrayFormat === 'bracket-separator') {
							return encode(key, options) + '[]';
						}

						return value
							.reduce(formatter(key), [])
							.join('&');
					}

					return encode(key, options) + '=' + encode(value, options);
				}).filter(x => x.length > 0).join('&');
			};

			exports.parseUrl = (url, options) => {
				options = Object.assign({
					decode: true
				}, options);

				const [url_, hash] = splitOnFirst(url, '#');

				return Object.assign(
					{
						url: url_.split('?')[0] || '',
						query: parse(extract(url), options)
					},
					options && options.parseFragmentIdentifier && hash ? {fragmentIdentifier: decode(hash, options)} : {}
				);
			};

			exports.stringifyUrl = (object, options) => {
				options = Object.assign({
					encode: true,
					strict: true,
					[encodeFragmentIdentifier]: true
				}, options);

				const url = removeHash(object.url).split('?')[0] || '';
				const queryFromUrl = exports.extract(object.url);
				const parsedQueryFromUrl = exports.parse(queryFromUrl, {sort: false});

				const query = Object.assign(parsedQueryFromUrl, object.query);
				let queryString = exports.stringify(query, options);
				if (queryString) {
					queryString = `?${queryString}`;
				}

				let hash = getHash(object.url);
				if (object.fragmentIdentifier) {
					hash = `#${options[encodeFragmentIdentifier] ? encode(object.fragmentIdentifier, options) : object.fragmentIdentifier}`;
				}

				return `${url}${queryString}${hash}`;
			};

			exports.pick = (input, filter, options) => {
				options = Object.assign({
					parseFragmentIdentifier: true,
					[encodeFragmentIdentifier]: false
				}, options);

				const {url, query, fragmentIdentifier} = exports.parseUrl(input, options);
				return exports.stringifyUrl({
					url,
					query: filterObject(query, filter),
					fragmentIdentifier
				}, options);
			};

			exports.exclude = (input, filter, options) => {
				const exclusionFilter = Array.isArray(filter) ? key => !filter.includes(key) : (key, value) => !filter(key, value);

				return exports.pick(input, exclusionFilter, options);
			}; 
		} (queryString));
		return queryString;
	}

	var queryStringExports = requireQueryString();
	var qparse = /*@__PURE__*/getDefaultExportFromCjs(queryStringExports);

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
	                return qparse.parse(q, { sort: false });
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
	            processedQueryString = qparse.stringify(queryString, { sort: false });
	        }
	        else {
	            processedQueryString = "";
	        }
	        return processedQueryString;
	    };
	    return ProcessURL;
	}());

	var sha256 = {exports: {}};

	/**
	 * [js-sha256]{@link https://github.com/emn178/js-sha256}
	 *
	 * @version 0.9.0
	 * @author Chen, Yi-Cyuan [emn178@gmail.com]
	 * @copyright Chen, Yi-Cyuan 2014-2017
	 * @license MIT
	 */
	sha256.exports;

	var hasRequiredSha256;

	function requireSha256 () {
		if (hasRequiredSha256) return sha256.exports;
		hasRequiredSha256 = 1;
		(function (module) {
			/*jslint bitwise: true */
			(function () {

			  var ERROR = 'input is invalid type';
			  var WINDOW = "object" === 'object';
			  var root = WINDOW ? window : {};
			  if (root.JS_SHA256_NO_WINDOW) {
			    WINDOW = false;
			  }
			  var WEB_WORKER = !WINDOW && typeof self === 'object';
			  var NODE_JS = !root.JS_SHA256_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
			  if (NODE_JS) {
			    root = commonjsGlobal;
			  } else if (WEB_WORKER) {
			    root = self;
			  }
			  var COMMON_JS = !root.JS_SHA256_NO_COMMON_JS && 'object' === 'object' && module.exports;
			  var ARRAY_BUFFER = !root.JS_SHA256_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
			  var HEX_CHARS = '0123456789abcdef'.split('');
			  var EXTRA = [-2147483648, 8388608, 32768, 128];
			  var SHIFT = [24, 16, 8, 0];
			  var K = [
			    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
			    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
			    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
			    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
			    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
			    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
			    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
			    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
			  ];
			  var OUTPUT_TYPES = ['hex', 'array', 'digest', 'arrayBuffer'];

			  var blocks = [];

			  if (root.JS_SHA256_NO_NODE_JS || !Array.isArray) {
			    Array.isArray = function (obj) {
			      return Object.prototype.toString.call(obj) === '[object Array]';
			    };
			  }

			  if (ARRAY_BUFFER && (root.JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
			    ArrayBuffer.isView = function (obj) {
			      return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
			    };
			  }

			  var createOutputMethod = function (outputType, is224) {
			    return function (message) {
			      return new Sha256(is224, true).update(message)[outputType]();
			    };
			  };

			  var createMethod = function (is224) {
			    var method = createOutputMethod('hex', is224);
			    if (NODE_JS) {
			      method = nodeWrap(method, is224);
			    }
			    method.create = function () {
			      return new Sha256(is224);
			    };
			    method.update = function (message) {
			      return method.create().update(message);
			    };
			    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
			      var type = OUTPUT_TYPES[i];
			      method[type] = createOutputMethod(type, is224);
			    }
			    return method;
			  };

			  var nodeWrap = function (method, is224) {
			    var crypto = eval("require('crypto')");
			    var Buffer = eval("require('buffer').Buffer");
			    var algorithm = is224 ? 'sha224' : 'sha256';
			    var nodeMethod = function (message) {
			      if (typeof message === 'string') {
			        return crypto.createHash(algorithm).update(message, 'utf8').digest('hex');
			      } else {
			        if (message === null || message === undefined) {
			          throw new Error(ERROR);
			        } else if (message.constructor === ArrayBuffer) {
			          message = new Uint8Array(message);
			        }
			      }
			      if (Array.isArray(message) || ArrayBuffer.isView(message) ||
			        message.constructor === Buffer) {
			        return crypto.createHash(algorithm).update(new Buffer(message)).digest('hex');
			      } else {
			        return method(message);
			      }
			    };
			    return nodeMethod;
			  };

			  var createHmacOutputMethod = function (outputType, is224) {
			    return function (key, message) {
			      return new HmacSha256(key, is224, true).update(message)[outputType]();
			    };
			  };

			  var createHmacMethod = function (is224) {
			    var method = createHmacOutputMethod('hex', is224);
			    method.create = function (key) {
			      return new HmacSha256(key, is224);
			    };
			    method.update = function (key, message) {
			      return method.create(key).update(message);
			    };
			    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
			      var type = OUTPUT_TYPES[i];
			      method[type] = createHmacOutputMethod(type, is224);
			    }
			    return method;
			  };

			  function Sha256(is224, sharedMemory) {
			    if (sharedMemory) {
			      blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] =
			        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
			        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
			        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
			      this.blocks = blocks;
			    } else {
			      this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			    }

			    if (is224) {
			      this.h0 = 0xc1059ed8;
			      this.h1 = 0x367cd507;
			      this.h2 = 0x3070dd17;
			      this.h3 = 0xf70e5939;
			      this.h4 = 0xffc00b31;
			      this.h5 = 0x68581511;
			      this.h6 = 0x64f98fa7;
			      this.h7 = 0xbefa4fa4;
			    } else { // 256
			      this.h0 = 0x6a09e667;
			      this.h1 = 0xbb67ae85;
			      this.h2 = 0x3c6ef372;
			      this.h3 = 0xa54ff53a;
			      this.h4 = 0x510e527f;
			      this.h5 = 0x9b05688c;
			      this.h6 = 0x1f83d9ab;
			      this.h7 = 0x5be0cd19;
			    }

			    this.block = this.start = this.bytes = this.hBytes = 0;
			    this.finalized = this.hashed = false;
			    this.first = true;
			    this.is224 = is224;
			  }

			  Sha256.prototype.update = function (message) {
			    if (this.finalized) {
			      return;
			    }
			    var notString, type = typeof message;
			    if (type !== 'string') {
			      if (type === 'object') {
			        if (message === null) {
			          throw new Error(ERROR);
			        } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
			          message = new Uint8Array(message);
			        } else if (!Array.isArray(message)) {
			          if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
			            throw new Error(ERROR);
			          }
			        }
			      } else {
			        throw new Error(ERROR);
			      }
			      notString = true;
			    }
			    var code, index = 0, i, length = message.length, blocks = this.blocks;

			    while (index < length) {
			      if (this.hashed) {
			        this.hashed = false;
			        blocks[0] = this.block;
			        blocks[16] = blocks[1] = blocks[2] = blocks[3] =
			          blocks[4] = blocks[5] = blocks[6] = blocks[7] =
			          blocks[8] = blocks[9] = blocks[10] = blocks[11] =
			          blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
			      }

			      if (notString) {
			        for (i = this.start; index < length && i < 64; ++index) {
			          blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
			        }
			      } else {
			        for (i = this.start; index < length && i < 64; ++index) {
			          code = message.charCodeAt(index);
			          if (code < 0x80) {
			            blocks[i >> 2] |= code << SHIFT[i++ & 3];
			          } else if (code < 0x800) {
			            blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
			            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
			          } else if (code < 0xd800 || code >= 0xe000) {
			            blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
			            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
			            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
			          } else {
			            code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
			            blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
			            blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
			            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
			            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
			          }
			        }
			      }

			      this.lastByteIndex = i;
			      this.bytes += i - this.start;
			      if (i >= 64) {
			        this.block = blocks[16];
			        this.start = i - 64;
			        this.hash();
			        this.hashed = true;
			      } else {
			        this.start = i;
			      }
			    }
			    if (this.bytes > 4294967295) {
			      this.hBytes += this.bytes / 4294967296 << 0;
			      this.bytes = this.bytes % 4294967296;
			    }
			    return this;
			  };

			  Sha256.prototype.finalize = function () {
			    if (this.finalized) {
			      return;
			    }
			    this.finalized = true;
			    var blocks = this.blocks, i = this.lastByteIndex;
			    blocks[16] = this.block;
			    blocks[i >> 2] |= EXTRA[i & 3];
			    this.block = blocks[16];
			    if (i >= 56) {
			      if (!this.hashed) {
			        this.hash();
			      }
			      blocks[0] = this.block;
			      blocks[16] = blocks[1] = blocks[2] = blocks[3] =
			        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
			        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
			        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
			    }
			    blocks[14] = this.hBytes << 3 | this.bytes >>> 29;
			    blocks[15] = this.bytes << 3;
			    this.hash();
			  };

			  Sha256.prototype.hash = function () {
			    var a = this.h0, b = this.h1, c = this.h2, d = this.h3, e = this.h4, f = this.h5, g = this.h6,
			      h = this.h7, blocks = this.blocks, j, s0, s1, maj, t1, t2, ch, ab, da, cd, bc;

			    for (j = 16; j < 64; ++j) {
			      // rightrotate
			      t1 = blocks[j - 15];
			      s0 = ((t1 >>> 7) | (t1 << 25)) ^ ((t1 >>> 18) | (t1 << 14)) ^ (t1 >>> 3);
			      t1 = blocks[j - 2];
			      s1 = ((t1 >>> 17) | (t1 << 15)) ^ ((t1 >>> 19) | (t1 << 13)) ^ (t1 >>> 10);
			      blocks[j] = blocks[j - 16] + s0 + blocks[j - 7] + s1 << 0;
			    }

			    bc = b & c;
			    for (j = 0; j < 64; j += 4) {
			      if (this.first) {
			        if (this.is224) {
			          ab = 300032;
			          t1 = blocks[0] - 1413257819;
			          h = t1 - 150054599 << 0;
			          d = t1 + 24177077 << 0;
			        } else {
			          ab = 704751109;
			          t1 = blocks[0] - 210244248;
			          h = t1 - 1521486534 << 0;
			          d = t1 + 143694565 << 0;
			        }
			        this.first = false;
			      } else {
			        s0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
			        s1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
			        ab = a & b;
			        maj = ab ^ (a & c) ^ bc;
			        ch = (e & f) ^ (~e & g);
			        t1 = h + s1 + ch + K[j] + blocks[j];
			        t2 = s0 + maj;
			        h = d + t1 << 0;
			        d = t1 + t2 << 0;
			      }
			      s0 = ((d >>> 2) | (d << 30)) ^ ((d >>> 13) | (d << 19)) ^ ((d >>> 22) | (d << 10));
			      s1 = ((h >>> 6) | (h << 26)) ^ ((h >>> 11) | (h << 21)) ^ ((h >>> 25) | (h << 7));
			      da = d & a;
			      maj = da ^ (d & b) ^ ab;
			      ch = (h & e) ^ (~h & f);
			      t1 = g + s1 + ch + K[j + 1] + blocks[j + 1];
			      t2 = s0 + maj;
			      g = c + t1 << 0;
			      c = t1 + t2 << 0;
			      s0 = ((c >>> 2) | (c << 30)) ^ ((c >>> 13) | (c << 19)) ^ ((c >>> 22) | (c << 10));
			      s1 = ((g >>> 6) | (g << 26)) ^ ((g >>> 11) | (g << 21)) ^ ((g >>> 25) | (g << 7));
			      cd = c & d;
			      maj = cd ^ (c & a) ^ da;
			      ch = (g & h) ^ (~g & e);
			      t1 = f + s1 + ch + K[j + 2] + blocks[j + 2];
			      t2 = s0 + maj;
			      f = b + t1 << 0;
			      b = t1 + t2 << 0;
			      s0 = ((b >>> 2) | (b << 30)) ^ ((b >>> 13) | (b << 19)) ^ ((b >>> 22) | (b << 10));
			      s1 = ((f >>> 6) | (f << 26)) ^ ((f >>> 11) | (f << 21)) ^ ((f >>> 25) | (f << 7));
			      bc = b & c;
			      maj = bc ^ (b & d) ^ cd;
			      ch = (f & g) ^ (~f & h);
			      t1 = e + s1 + ch + K[j + 3] + blocks[j + 3];
			      t2 = s0 + maj;
			      e = a + t1 << 0;
			      a = t1 + t2 << 0;
			    }

			    this.h0 = this.h0 + a << 0;
			    this.h1 = this.h1 + b << 0;
			    this.h2 = this.h2 + c << 0;
			    this.h3 = this.h3 + d << 0;
			    this.h4 = this.h4 + e << 0;
			    this.h5 = this.h5 + f << 0;
			    this.h6 = this.h6 + g << 0;
			    this.h7 = this.h7 + h << 0;
			  };

			  Sha256.prototype.hex = function () {
			    this.finalize();

			    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5,
			      h6 = this.h6, h7 = this.h7;

			    var hex = HEX_CHARS[(h0 >> 28) & 0x0F] + HEX_CHARS[(h0 >> 24) & 0x0F] +
			      HEX_CHARS[(h0 >> 20) & 0x0F] + HEX_CHARS[(h0 >> 16) & 0x0F] +
			      HEX_CHARS[(h0 >> 12) & 0x0F] + HEX_CHARS[(h0 >> 8) & 0x0F] +
			      HEX_CHARS[(h0 >> 4) & 0x0F] + HEX_CHARS[h0 & 0x0F] +
			      HEX_CHARS[(h1 >> 28) & 0x0F] + HEX_CHARS[(h1 >> 24) & 0x0F] +
			      HEX_CHARS[(h1 >> 20) & 0x0F] + HEX_CHARS[(h1 >> 16) & 0x0F] +
			      HEX_CHARS[(h1 >> 12) & 0x0F] + HEX_CHARS[(h1 >> 8) & 0x0F] +
			      HEX_CHARS[(h1 >> 4) & 0x0F] + HEX_CHARS[h1 & 0x0F] +
			      HEX_CHARS[(h2 >> 28) & 0x0F] + HEX_CHARS[(h2 >> 24) & 0x0F] +
			      HEX_CHARS[(h2 >> 20) & 0x0F] + HEX_CHARS[(h2 >> 16) & 0x0F] +
			      HEX_CHARS[(h2 >> 12) & 0x0F] + HEX_CHARS[(h2 >> 8) & 0x0F] +
			      HEX_CHARS[(h2 >> 4) & 0x0F] + HEX_CHARS[h2 & 0x0F] +
			      HEX_CHARS[(h3 >> 28) & 0x0F] + HEX_CHARS[(h3 >> 24) & 0x0F] +
			      HEX_CHARS[(h3 >> 20) & 0x0F] + HEX_CHARS[(h3 >> 16) & 0x0F] +
			      HEX_CHARS[(h3 >> 12) & 0x0F] + HEX_CHARS[(h3 >> 8) & 0x0F] +
			      HEX_CHARS[(h3 >> 4) & 0x0F] + HEX_CHARS[h3 & 0x0F] +
			      HEX_CHARS[(h4 >> 28) & 0x0F] + HEX_CHARS[(h4 >> 24) & 0x0F] +
			      HEX_CHARS[(h4 >> 20) & 0x0F] + HEX_CHARS[(h4 >> 16) & 0x0F] +
			      HEX_CHARS[(h4 >> 12) & 0x0F] + HEX_CHARS[(h4 >> 8) & 0x0F] +
			      HEX_CHARS[(h4 >> 4) & 0x0F] + HEX_CHARS[h4 & 0x0F] +
			      HEX_CHARS[(h5 >> 28) & 0x0F] + HEX_CHARS[(h5 >> 24) & 0x0F] +
			      HEX_CHARS[(h5 >> 20) & 0x0F] + HEX_CHARS[(h5 >> 16) & 0x0F] +
			      HEX_CHARS[(h5 >> 12) & 0x0F] + HEX_CHARS[(h5 >> 8) & 0x0F] +
			      HEX_CHARS[(h5 >> 4) & 0x0F] + HEX_CHARS[h5 & 0x0F] +
			      HEX_CHARS[(h6 >> 28) & 0x0F] + HEX_CHARS[(h6 >> 24) & 0x0F] +
			      HEX_CHARS[(h6 >> 20) & 0x0F] + HEX_CHARS[(h6 >> 16) & 0x0F] +
			      HEX_CHARS[(h6 >> 12) & 0x0F] + HEX_CHARS[(h6 >> 8) & 0x0F] +
			      HEX_CHARS[(h6 >> 4) & 0x0F] + HEX_CHARS[h6 & 0x0F];
			    if (!this.is224) {
			      hex += HEX_CHARS[(h7 >> 28) & 0x0F] + HEX_CHARS[(h7 >> 24) & 0x0F] +
			        HEX_CHARS[(h7 >> 20) & 0x0F] + HEX_CHARS[(h7 >> 16) & 0x0F] +
			        HEX_CHARS[(h7 >> 12) & 0x0F] + HEX_CHARS[(h7 >> 8) & 0x0F] +
			        HEX_CHARS[(h7 >> 4) & 0x0F] + HEX_CHARS[h7 & 0x0F];
			    }
			    return hex;
			  };

			  Sha256.prototype.toString = Sha256.prototype.hex;

			  Sha256.prototype.digest = function () {
			    this.finalize();

			    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5,
			      h6 = this.h6, h7 = this.h7;

			    var arr = [
			      (h0 >> 24) & 0xFF, (h0 >> 16) & 0xFF, (h0 >> 8) & 0xFF, h0 & 0xFF,
			      (h1 >> 24) & 0xFF, (h1 >> 16) & 0xFF, (h1 >> 8) & 0xFF, h1 & 0xFF,
			      (h2 >> 24) & 0xFF, (h2 >> 16) & 0xFF, (h2 >> 8) & 0xFF, h2 & 0xFF,
			      (h3 >> 24) & 0xFF, (h3 >> 16) & 0xFF, (h3 >> 8) & 0xFF, h3 & 0xFF,
			      (h4 >> 24) & 0xFF, (h4 >> 16) & 0xFF, (h4 >> 8) & 0xFF, h4 & 0xFF,
			      (h5 >> 24) & 0xFF, (h5 >> 16) & 0xFF, (h5 >> 8) & 0xFF, h5 & 0xFF,
			      (h6 >> 24) & 0xFF, (h6 >> 16) & 0xFF, (h6 >> 8) & 0xFF, h6 & 0xFF
			    ];
			    if (!this.is224) {
			      arr.push((h7 >> 24) & 0xFF, (h7 >> 16) & 0xFF, (h7 >> 8) & 0xFF, h7 & 0xFF);
			    }
			    return arr;
			  };

			  Sha256.prototype.array = Sha256.prototype.digest;

			  Sha256.prototype.arrayBuffer = function () {
			    this.finalize();

			    var buffer = new ArrayBuffer(this.is224 ? 28 : 32);
			    var dataView = new DataView(buffer);
			    dataView.setUint32(0, this.h0);
			    dataView.setUint32(4, this.h1);
			    dataView.setUint32(8, this.h2);
			    dataView.setUint32(12, this.h3);
			    dataView.setUint32(16, this.h4);
			    dataView.setUint32(20, this.h5);
			    dataView.setUint32(24, this.h6);
			    if (!this.is224) {
			      dataView.setUint32(28, this.h7);
			    }
			    return buffer;
			  };

			  function HmacSha256(key, is224, sharedMemory) {
			    var i, type = typeof key;
			    if (type === 'string') {
			      var bytes = [], length = key.length, index = 0, code;
			      for (i = 0; i < length; ++i) {
			        code = key.charCodeAt(i);
			        if (code < 0x80) {
			          bytes[index++] = code;
			        } else if (code < 0x800) {
			          bytes[index++] = (0xc0 | (code >> 6));
			          bytes[index++] = (0x80 | (code & 0x3f));
			        } else if (code < 0xd800 || code >= 0xe000) {
			          bytes[index++] = (0xe0 | (code >> 12));
			          bytes[index++] = (0x80 | ((code >> 6) & 0x3f));
			          bytes[index++] = (0x80 | (code & 0x3f));
			        } else {
			          code = 0x10000 + (((code & 0x3ff) << 10) | (key.charCodeAt(++i) & 0x3ff));
			          bytes[index++] = (0xf0 | (code >> 18));
			          bytes[index++] = (0x80 | ((code >> 12) & 0x3f));
			          bytes[index++] = (0x80 | ((code >> 6) & 0x3f));
			          bytes[index++] = (0x80 | (code & 0x3f));
			        }
			      }
			      key = bytes;
			    } else {
			      if (type === 'object') {
			        if (key === null) {
			          throw new Error(ERROR);
			        } else if (ARRAY_BUFFER && key.constructor === ArrayBuffer) {
			          key = new Uint8Array(key);
			        } else if (!Array.isArray(key)) {
			          if (!ARRAY_BUFFER || !ArrayBuffer.isView(key)) {
			            throw new Error(ERROR);
			          }
			        }
			      } else {
			        throw new Error(ERROR);
			      }
			    }

			    if (key.length > 64) {
			      key = (new Sha256(is224, true)).update(key).array();
			    }

			    var oKeyPad = [], iKeyPad = [];
			    for (i = 0; i < 64; ++i) {
			      var b = key[i] || 0;
			      oKeyPad[i] = 0x5c ^ b;
			      iKeyPad[i] = 0x36 ^ b;
			    }

			    Sha256.call(this, is224, sharedMemory);

			    this.update(iKeyPad);
			    this.oKeyPad = oKeyPad;
			    this.inner = true;
			    this.sharedMemory = sharedMemory;
			  }
			  HmacSha256.prototype = new Sha256();

			  HmacSha256.prototype.finalize = function () {
			    Sha256.prototype.finalize.call(this);
			    if (this.inner) {
			      this.inner = false;
			      var innerHash = this.array();
			      Sha256.call(this, this.is224, this.sharedMemory);
			      this.update(this.oKeyPad);
			      this.update(innerHash);
			      Sha256.prototype.finalize.call(this);
			    }
			  };

			  var exports = createMethod();
			  exports.sha256 = exports;
			  exports.sha224 = createMethod(true);
			  exports.sha256.hmac = createHmacMethod();
			  exports.sha224.hmac = createHmacMethod(true);

			  if (COMMON_JS) {
			    module.exports = exports;
			  } else {
			    root.sha256 = exports.sha256;
			    root.sha224 = exports.sha224;
			  }
			})(); 
		} (sha256));
		return sha256.exports;
	}

	var sha256Exports = requireSha256();

	function generateSignature(input) {
	    var hash = sha256Exports.sha256(input);
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
	z
	    .object({
	    headers: z.object({}).catchall(z.any()),
	})
	    .catchall(z.any());
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
	z
	    .object({
	    headers: z.object({}).catchall(z.any()),
	})
	    .catchall(z.any());
	function getLang(request) {
	    var lang;
	    var langStr = request.getHeader("accept-language");
	    if (langStr) {
	        lang = langStr;
	    }
	    return lang;
	}

	//Response structure validation
	z
	    .object({
	    headers: z.object({}).catchall(z.any()),
	})
	    .catchall(z.any());
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
	     * @returns {Promise<void>} A Promise that resolves when the method has completed.
	     */
	    Gatekeeper.prototype.getSessionStatus = function () {
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
	     * Sets the CrowdHandler session cookie. Always call this when result.setCookie is true
	     * to maintain the user's queue position.
	     *
	     * @param {string} value - The cookie value to set (from result.cookieValue)
	     * @returns {boolean} True if the cookie was successfully set, false otherwise
	     *
	     * @example
	     * if (result.setCookie) {
	     *   gatekeeper.setCookie(result.cookieValue);
	     * }
	     */
	    Gatekeeper.prototype.setCookie = function (value) {
	        try {
	            // Set the cookie with the provided value and options
	            this.REQUEST.setCookie(value, this.STORAGE_NAME);
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
	            return { redirect: true, url: redirectUrl };
	        }
	        logger(this.options.debug, "info", "[Lite Validator] Token is valid - no redirect needed");
	        return { redirect: false };
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
	     * @throws {CrowdHandlerError} When API connection fails (check error.code === 'API_CONNECTION_FAILED')
	     */
	    Gatekeeper.prototype.validateRequest = function () {
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
	                    case 1: return [4 /*yield*/, this.validateRequestHybridMode()];
	                    case 2: return [2 /*return*/, _b.sent()];
	                    case 3: return [4 /*yield*/, this.validateRequestFullMode()];
	                    case 4: return [2 /*return*/, _b.sent()];
	                    case 5: return [4 /*yield*/, this.validateRequestClientSideMode()];
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
	     * @return {Promise<z.infer<typeof validateRequestObject>>} Result of the validation process.
	     */
	    Gatekeeper.prototype.validateRequestClientSideMode = function () {
	        var _a;
	        return __awaiter(this, void 0, void 0, function () {
	            var result, liteCheck, sessionStatusType, _b, promoted, slug, token, responseID, deployment, hash, requested, error_3;
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
	                        if (liteCheck.redirect) {
	                            logger(this.options.debug, "info", "[Lite Validator] Lite validator redirect triggered in clientside mode");
	                            result.liteValidatorRedirect = true;
	                            result.liteValidatorUrl = liteCheck.url;
	                            result.promoted = false;
	                            return [2 /*return*/, result];
	                        }
	                        logger(this.options.debug, "info", "[Lite Validator] Continuing with normal validation");
	                        return [4 /*yield*/, this.getSessionStatus()];
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
	                            _b = this.sessionStatus.result, promoted = _b.promoted, slug = _b.slug, token = _b.token, responseID = _b.responseID, deployment = _b.deployment, hash = _b.hash, requested = _b.requested;
	                            result.promoted = promoted === 1;
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
	     * @return {Promise<z.infer<typeof ValidateRequestObject>>} - The resulting status after validating the request.
	     */
	    Gatekeeper.prototype.validateRequestFullMode = function () {
	        var _a;
	        return __awaiter(this, void 0, void 0, function () {
	            var result, liteCheck, sessionStatusType, _b, promoted, slug, token, responseID, deployment, hash, requested, error_4;
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
	                        if (liteCheck.redirect) {
	                            logger(this.options.debug, "info", "[Lite Validator] Lite validator redirect triggered in clientside mode");
	                            result.liteValidatorRedirect = true;
	                            result.liteValidatorUrl = liteCheck.url;
	                            result.promoted = false;
	                            return [2 /*return*/, result];
	                        }
	                        logger(this.options.debug, "info", "[Lite Validator] Continuing with normal validation");
	                        return [4 /*yield*/, this.getSessionStatus()];
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
	                            _b = this.sessionStatus.result, promoted = _b.promoted, slug = _b.slug, token = _b.token, responseID = _b.responseID, deployment = _b.deployment, hash = _b.hash, requested = _b.requested;
	                            result.promoted = promoted === 1;
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
	     */
	    Gatekeeper.prototype.validateRequestHybridMode = function () {
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
	                        return [4 /*yield*/, this.getSessionStatus()];
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
	                        return [4 /*yield*/, this.getSessionStatus()];
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
	        (!config.request && !config.response && !config.lambdaEdgeEvent));
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
	        else {
	            context = new RequestContext({});
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
	    {
	        return 'clientside';
	    }
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

	Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=crowdhandler.umd.js.map
