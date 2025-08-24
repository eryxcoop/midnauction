import {
  require_onchain_runtime
} from "./chunk-BHZHBNKN.js";
import {
  __commonJS
} from "./chunk-V4OQ3NZ2.js";

// (disabled):node_modules/object-inspect/util.inspect
var require_util = __commonJS({
  "(disabled):node_modules/object-inspect/util.inspect"() {
  }
});

// node_modules/object-inspect/index.js
var require_object_inspect = __commonJS({
  "node_modules/object-inspect/index.js"(exports, module) {
    var hasMap = typeof Map === "function" && Map.prototype;
    var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null;
    var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === "function" ? mapSizeDescriptor.get : null;
    var mapForEach = hasMap && Map.prototype.forEach;
    var hasSet = typeof Set === "function" && Set.prototype;
    var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null;
    var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === "function" ? setSizeDescriptor.get : null;
    var setForEach = hasSet && Set.prototype.forEach;
    var hasWeakMap = typeof WeakMap === "function" && WeakMap.prototype;
    var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
    var hasWeakSet = typeof WeakSet === "function" && WeakSet.prototype;
    var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
    var hasWeakRef = typeof WeakRef === "function" && WeakRef.prototype;
    var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
    var booleanValueOf = Boolean.prototype.valueOf;
    var objectToString = Object.prototype.toString;
    var functionToString = Function.prototype.toString;
    var $match = String.prototype.match;
    var $slice = String.prototype.slice;
    var $replace = String.prototype.replace;
    var $toUpperCase = String.prototype.toUpperCase;
    var $toLowerCase = String.prototype.toLowerCase;
    var $test = RegExp.prototype.test;
    var $concat = Array.prototype.concat;
    var $join = Array.prototype.join;
    var $arrSlice = Array.prototype.slice;
    var $floor = Math.floor;
    var bigIntValueOf = typeof BigInt === "function" ? BigInt.prototype.valueOf : null;
    var gOPS = Object.getOwnPropertySymbols;
    var symToString = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol.prototype.toString : null;
    var hasShammedSymbols = typeof Symbol === "function" && typeof Symbol.iterator === "object";
    var toStringTag = typeof Symbol === "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? "object" : "symbol") ? Symbol.toStringTag : null;
    var isEnumerable = Object.prototype.propertyIsEnumerable;
    var gPO = (typeof Reflect === "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(O) {
      return O.__proto__;
    } : null);
    function addNumericSeparator(num, str) {
      if (num === Infinity || num === -Infinity || num !== num || num && num > -1e3 && num < 1e3 || $test.call(/e/, str)) {
        return str;
      }
      var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
      if (typeof num === "number") {
        var int = num < 0 ? -$floor(-num) : $floor(num);
        if (int !== num) {
          var intStr = String(int);
          var dec = $slice.call(str, intStr.length + 1);
          return $replace.call(intStr, sepRegex, "$&_") + "." + $replace.call($replace.call(dec, /([0-9]{3})/g, "$&_"), /_$/, "");
        }
      }
      return $replace.call(str, sepRegex, "$&_");
    }
    var utilInspect = require_util();
    var inspectCustom = utilInspect.custom;
    var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;
    var quotes = {
      __proto__: null,
      "double": '"',
      single: "'"
    };
    var quoteREs = {
      __proto__: null,
      "double": /(["\\])/g,
      single: /(['\\])/g
    };
    module.exports = function inspect_(obj, options, depth, seen) {
      var opts = options || {};
      if (has(opts, "quoteStyle") && !has(quotes, opts.quoteStyle)) {
        throw new TypeError('option "quoteStyle" must be "single" or "double"');
      }
      if (has(opts, "maxStringLength") && (typeof opts.maxStringLength === "number" ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity : opts.maxStringLength !== null)) {
        throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
      }
      var customInspect = has(opts, "customInspect") ? opts.customInspect : true;
      if (typeof customInspect !== "boolean" && customInspect !== "symbol") {
        throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
      }
      if (has(opts, "indent") && opts.indent !== null && opts.indent !== "	" && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)) {
        throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
      }
      if (has(opts, "numericSeparator") && typeof opts.numericSeparator !== "boolean") {
        throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
      }
      var numericSeparator = opts.numericSeparator;
      if (typeof obj === "undefined") {
        return "undefined";
      }
      if (obj === null) {
        return "null";
      }
      if (typeof obj === "boolean") {
        return obj ? "true" : "false";
      }
      if (typeof obj === "string") {
        return inspectString(obj, opts);
      }
      if (typeof obj === "number") {
        if (obj === 0) {
          return Infinity / obj > 0 ? "0" : "-0";
        }
        var str = String(obj);
        return numericSeparator ? addNumericSeparator(obj, str) : str;
      }
      if (typeof obj === "bigint") {
        var bigIntStr = String(obj) + "n";
        return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
      }
      var maxDepth = typeof opts.depth === "undefined" ? 5 : opts.depth;
      if (typeof depth === "undefined") {
        depth = 0;
      }
      if (depth >= maxDepth && maxDepth > 0 && typeof obj === "object") {
        return isArray(obj) ? "[Array]" : "[Object]";
      }
      var indent = getIndent(opts, depth);
      if (typeof seen === "undefined") {
        seen = [];
      } else if (indexOf(seen, obj) >= 0) {
        return "[Circular]";
      }
      function inspect(value, from, noIndent) {
        if (from) {
          seen = $arrSlice.call(seen);
          seen.push(from);
        }
        if (noIndent) {
          var newOpts = {
            depth: opts.depth
          };
          if (has(opts, "quoteStyle")) {
            newOpts.quoteStyle = opts.quoteStyle;
          }
          return inspect_(value, newOpts, depth + 1, seen);
        }
        return inspect_(value, opts, depth + 1, seen);
      }
      if (typeof obj === "function" && !isRegExp(obj)) {
        var name = nameOf(obj);
        var keys = arrObjKeys(obj, inspect);
        return "[Function" + (name ? ": " + name : " (anonymous)") + "]" + (keys.length > 0 ? " { " + $join.call(keys, ", ") + " }" : "");
      }
      if (isSymbol(obj)) {
        var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, "$1") : symToString.call(obj);
        return typeof obj === "object" && !hasShammedSymbols ? markBoxed(symString) : symString;
      }
      if (isElement(obj)) {
        var s = "<" + $toLowerCase.call(String(obj.nodeName));
        var attrs = obj.attributes || [];
        for (var i = 0; i < attrs.length; i++) {
          s += " " + attrs[i].name + "=" + wrapQuotes(quote(attrs[i].value), "double", opts);
        }
        s += ">";
        if (obj.childNodes && obj.childNodes.length) {
          s += "...";
        }
        s += "</" + $toLowerCase.call(String(obj.nodeName)) + ">";
        return s;
      }
      if (isArray(obj)) {
        if (obj.length === 0) {
          return "[]";
        }
        var xs = arrObjKeys(obj, inspect);
        if (indent && !singleLineValues(xs)) {
          return "[" + indentedJoin(xs, indent) + "]";
        }
        return "[ " + $join.call(xs, ", ") + " ]";
      }
      if (isError(obj)) {
        var parts = arrObjKeys(obj, inspect);
        if (!("cause" in Error.prototype) && "cause" in obj && !isEnumerable.call(obj, "cause")) {
          return "{ [" + String(obj) + "] " + $join.call($concat.call("[cause]: " + inspect(obj.cause), parts), ", ") + " }";
        }
        if (parts.length === 0) {
          return "[" + String(obj) + "]";
        }
        return "{ [" + String(obj) + "] " + $join.call(parts, ", ") + " }";
      }
      if (typeof obj === "object" && customInspect) {
        if (inspectSymbol && typeof obj[inspectSymbol] === "function" && utilInspect) {
          return utilInspect(obj, { depth: maxDepth - depth });
        } else if (customInspect !== "symbol" && typeof obj.inspect === "function") {
          return obj.inspect();
        }
      }
      if (isMap(obj)) {
        var mapParts = [];
        if (mapForEach) {
          mapForEach.call(obj, function(value, key) {
            mapParts.push(inspect(key, obj, true) + " => " + inspect(value, obj));
          });
        }
        return collectionOf("Map", mapSize.call(obj), mapParts, indent);
      }
      if (isSet(obj)) {
        var setParts = [];
        if (setForEach) {
          setForEach.call(obj, function(value) {
            setParts.push(inspect(value, obj));
          });
        }
        return collectionOf("Set", setSize.call(obj), setParts, indent);
      }
      if (isWeakMap(obj)) {
        return weakCollectionOf("WeakMap");
      }
      if (isWeakSet(obj)) {
        return weakCollectionOf("WeakSet");
      }
      if (isWeakRef(obj)) {
        return weakCollectionOf("WeakRef");
      }
      if (isNumber(obj)) {
        return markBoxed(inspect(Number(obj)));
      }
      if (isBigInt(obj)) {
        return markBoxed(inspect(bigIntValueOf.call(obj)));
      }
      if (isBoolean(obj)) {
        return markBoxed(booleanValueOf.call(obj));
      }
      if (isString(obj)) {
        return markBoxed(inspect(String(obj)));
      }
      if (typeof window !== "undefined" && obj === window) {
        return "{ [object Window] }";
      }
      if (typeof globalThis !== "undefined" && obj === globalThis || typeof global !== "undefined" && obj === global) {
        return "{ [object globalThis] }";
      }
      if (!isDate(obj) && !isRegExp(obj)) {
        var ys = arrObjKeys(obj, inspect);
        var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
        var protoTag = obj instanceof Object ? "" : "null prototype";
        var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? "Object" : "";
        var constructorTag = isPlainObject || typeof obj.constructor !== "function" ? "" : obj.constructor.name ? obj.constructor.name + " " : "";
        var tag = constructorTag + (stringTag || protoTag ? "[" + $join.call($concat.call([], stringTag || [], protoTag || []), ": ") + "] " : "");
        if (ys.length === 0) {
          return tag + "{}";
        }
        if (indent) {
          return tag + "{" + indentedJoin(ys, indent) + "}";
        }
        return tag + "{ " + $join.call(ys, ", ") + " }";
      }
      return String(obj);
    };
    function wrapQuotes(s, defaultStyle, opts) {
      var style = opts.quoteStyle || defaultStyle;
      var quoteChar = quotes[style];
      return quoteChar + s + quoteChar;
    }
    function quote(s) {
      return $replace.call(String(s), /"/g, "&quot;");
    }
    function canTrustToString(obj) {
      return !toStringTag || !(typeof obj === "object" && (toStringTag in obj || typeof obj[toStringTag] !== "undefined"));
    }
    function isArray(obj) {
      return toStr(obj) === "[object Array]" && canTrustToString(obj);
    }
    function isDate(obj) {
      return toStr(obj) === "[object Date]" && canTrustToString(obj);
    }
    function isRegExp(obj) {
      return toStr(obj) === "[object RegExp]" && canTrustToString(obj);
    }
    function isError(obj) {
      return toStr(obj) === "[object Error]" && canTrustToString(obj);
    }
    function isString(obj) {
      return toStr(obj) === "[object String]" && canTrustToString(obj);
    }
    function isNumber(obj) {
      return toStr(obj) === "[object Number]" && canTrustToString(obj);
    }
    function isBoolean(obj) {
      return toStr(obj) === "[object Boolean]" && canTrustToString(obj);
    }
    function isSymbol(obj) {
      if (hasShammedSymbols) {
        return obj && typeof obj === "object" && obj instanceof Symbol;
      }
      if (typeof obj === "symbol") {
        return true;
      }
      if (!obj || typeof obj !== "object" || !symToString) {
        return false;
      }
      try {
        symToString.call(obj);
        return true;
      } catch (e) {
      }
      return false;
    }
    function isBigInt(obj) {
      if (!obj || typeof obj !== "object" || !bigIntValueOf) {
        return false;
      }
      try {
        bigIntValueOf.call(obj);
        return true;
      } catch (e) {
      }
      return false;
    }
    var hasOwn = Object.prototype.hasOwnProperty || function(key) {
      return key in this;
    };
    function has(obj, key) {
      return hasOwn.call(obj, key);
    }
    function toStr(obj) {
      return objectToString.call(obj);
    }
    function nameOf(f) {
      if (f.name) {
        return f.name;
      }
      var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
      if (m) {
        return m[1];
      }
      return null;
    }
    function indexOf(xs, x) {
      if (xs.indexOf) {
        return xs.indexOf(x);
      }
      for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) {
          return i;
        }
      }
      return -1;
    }
    function isMap(x) {
      if (!mapSize || !x || typeof x !== "object") {
        return false;
      }
      try {
        mapSize.call(x);
        try {
          setSize.call(x);
        } catch (s) {
          return true;
        }
        return x instanceof Map;
      } catch (e) {
      }
      return false;
    }
    function isWeakMap(x) {
      if (!weakMapHas || !x || typeof x !== "object") {
        return false;
      }
      try {
        weakMapHas.call(x, weakMapHas);
        try {
          weakSetHas.call(x, weakSetHas);
        } catch (s) {
          return true;
        }
        return x instanceof WeakMap;
      } catch (e) {
      }
      return false;
    }
    function isWeakRef(x) {
      if (!weakRefDeref || !x || typeof x !== "object") {
        return false;
      }
      try {
        weakRefDeref.call(x);
        return true;
      } catch (e) {
      }
      return false;
    }
    function isSet(x) {
      if (!setSize || !x || typeof x !== "object") {
        return false;
      }
      try {
        setSize.call(x);
        try {
          mapSize.call(x);
        } catch (m) {
          return true;
        }
        return x instanceof Set;
      } catch (e) {
      }
      return false;
    }
    function isWeakSet(x) {
      if (!weakSetHas || !x || typeof x !== "object") {
        return false;
      }
      try {
        weakSetHas.call(x, weakSetHas);
        try {
          weakMapHas.call(x, weakMapHas);
        } catch (s) {
          return true;
        }
        return x instanceof WeakSet;
      } catch (e) {
      }
      return false;
    }
    function isElement(x) {
      if (!x || typeof x !== "object") {
        return false;
      }
      if (typeof HTMLElement !== "undefined" && x instanceof HTMLElement) {
        return true;
      }
      return typeof x.nodeName === "string" && typeof x.getAttribute === "function";
    }
    function inspectString(str, opts) {
      if (str.length > opts.maxStringLength) {
        var remaining = str.length - opts.maxStringLength;
        var trailer = "... " + remaining + " more character" + (remaining > 1 ? "s" : "");
        return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
      }
      var quoteRE = quoteREs[opts.quoteStyle || "single"];
      quoteRE.lastIndex = 0;
      var s = $replace.call($replace.call(str, quoteRE, "\\$1"), /[\x00-\x1f]/g, lowbyte);
      return wrapQuotes(s, "single", opts);
    }
    function lowbyte(c) {
      var n = c.charCodeAt(0);
      var x = {
        8: "b",
        9: "t",
        10: "n",
        12: "f",
        13: "r"
      }[n];
      if (x) {
        return "\\" + x;
      }
      return "\\x" + (n < 16 ? "0" : "") + $toUpperCase.call(n.toString(16));
    }
    function markBoxed(str) {
      return "Object(" + str + ")";
    }
    function weakCollectionOf(type) {
      return type + " { ? }";
    }
    function collectionOf(type, size, entries, indent) {
      var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ", ");
      return type + " (" + size + ") {" + joinedEntries + "}";
    }
    function singleLineValues(xs) {
      for (var i = 0; i < xs.length; i++) {
        if (indexOf(xs[i], "\n") >= 0) {
          return false;
        }
      }
      return true;
    }
    function getIndent(opts, depth) {
      var baseIndent;
      if (opts.indent === "	") {
        baseIndent = "	";
      } else if (typeof opts.indent === "number" && opts.indent > 0) {
        baseIndent = $join.call(Array(opts.indent + 1), " ");
      } else {
        return null;
      }
      return {
        base: baseIndent,
        prev: $join.call(Array(depth + 1), baseIndent)
      };
    }
    function indentedJoin(xs, indent) {
      if (xs.length === 0) {
        return "";
      }
      var lineJoiner = "\n" + indent.prev + indent.base;
      return lineJoiner + $join.call(xs, "," + lineJoiner) + "\n" + indent.prev;
    }
    function arrObjKeys(obj, inspect) {
      var isArr = isArray(obj);
      var xs = [];
      if (isArr) {
        xs.length = obj.length;
        for (var i = 0; i < obj.length; i++) {
          xs[i] = has(obj, i) ? inspect(obj[i], obj) : "";
        }
      }
      var syms = typeof gOPS === "function" ? gOPS(obj) : [];
      var symMap;
      if (hasShammedSymbols) {
        symMap = {};
        for (var k = 0; k < syms.length; k++) {
          symMap["$" + syms[k]] = syms[k];
        }
      }
      for (var key in obj) {
        if (!has(obj, key)) {
          continue;
        }
        if (isArr && String(Number(key)) === key && key < obj.length) {
          continue;
        }
        if (hasShammedSymbols && symMap["$" + key] instanceof Symbol) {
          continue;
        } else if ($test.call(/[^\w$]/, key)) {
          xs.push(inspect(key, obj) + ": " + inspect(obj[key], obj));
        } else {
          xs.push(key + ": " + inspect(obj[key], obj));
        }
      }
      if (typeof gOPS === "function") {
        for (var j = 0; j < syms.length; j++) {
          if (isEnumerable.call(obj, syms[j])) {
            xs.push("[" + inspect(syms[j]) + "]: " + inspect(obj[syms[j]], obj));
          }
        }
      }
      return xs;
    }
  }
});

// node_modules/@midnight-ntwrk/compact-runtime/dist/version.js
var require_version = __commonJS({
  "node_modules/@midnight-ntwrk/compact-runtime/dist/version.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.versionString = void 0;
    exports.versionString = "0.8.1";
  }
});

// node_modules/@midnight-ntwrk/compact-runtime/dist/utils.js
var require_utils = __commonJS({
  "node_modules/@midnight-ntwrk/compact-runtime/dist/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CONTRACT_ADDRESS_BYTE_LENGTH = exports.HEX_REGEX_NO_PREFIX = void 0;
    exports.isContractAddress = isContractAddress;
    exports.HEX_REGEX_NO_PREFIX = /^([0-9A-Fa-f]{2})*$/;
    exports.CONTRACT_ADDRESS_BYTE_LENGTH = 35;
    function isContractAddress(x) {
      return typeof x === "string" && x.length === exports.CONTRACT_ADDRESS_BYTE_LENGTH * 2 && exports.HEX_REGEX_NO_PREFIX.test(x);
    }
  }
});

// node_modules/@midnight-ntwrk/compact-runtime/dist/contract-dependencies.js
var require_contract_dependencies = __commonJS({
  "node_modules/@midnight-ntwrk/compact-runtime/dist/contract-dependencies.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.contractDependencies = void 0;
    var runtime_1 = require_runtime();
    var utils_1 = require_utils();
    function isCompactVector(x) {
      return Array.isArray(x) && x.every((element) => isCompactValue(element));
    }
    function isCompactStruct(x) {
      return typeof x === "object" && x !== null && x !== void 0 && Object.entries(x).every(([key, value]) => typeof key === "string" && isCompactValue(value));
    }
    function isCompactValue(x) {
      return (0, utils_1.isContractAddress)(x) || isCompactVector(x) || isCompactStruct(x);
    }
    var expectedValueError = (expected, actual) => {
      throw new runtime_1.CompactError(`Expected ${expected} but received ${JSON.stringify(actual)}`);
    };
    function assertIsContractAddress(value) {
      if (!(0, utils_1.isContractAddress)(value)) {
        expectedValueError("contract address", value);
      }
    }
    function assertIsCompactVector(value) {
      if (!isCompactVector(value)) {
        expectedValueError("vector", value);
      }
    }
    function assertIsCompactStruct(value) {
      if (!isCompactStruct(value)) {
        expectedValueError("struct", value);
      }
    }
    function assertIsCompactValue(x) {
      if (!isCompactValue(x)) {
        expectedValueError("Compact value", x);
      }
    }
    function toCompactValue(x) {
      assertIsCompactValue(x);
      return x;
    }
    var compactValueDependencies = (sparseCompactType, compactValue, dependencies) => {
      if (sparseCompactType.tag == "contractAddress") {
        assertIsContractAddress(compactValue);
        dependencies.add(compactValue);
      } else if (sparseCompactType.tag == "struct") {
        assertIsCompactStruct(compactValue);
        Object.keys(compactValue).forEach((structElementId) => compactValueDependencies(sparseCompactType.elements[structElementId], compactValue[structElementId], dependencies));
      } else {
        assertIsCompactVector(compactValue);
        compactValue.forEach((vectorElement) => compactValueDependencies(sparseCompactType.sparseType, vectorElement, dependencies));
      }
    };
    var alignedValueToCompactValue = (descriptor, { value }) => toCompactValue(descriptor.fromValue(value));
    var stateValueToCompactValue = (descriptor, stateValue) => alignedValueToCompactValue(descriptor, stateValue.asCell());
    var compactCellDependencies = (sparseCompactCellADT, state, dependencies) => {
      const { sparseType, descriptor } = sparseCompactCellADT.valueType;
      compactValueDependencies(sparseType, stateValueToCompactValue(descriptor, state), dependencies);
    };
    var compactArrayLikeADTDependencies = (sparseCompactArrayLikeADT, states, dependencies) => {
      const { sparseType, descriptor } = sparseCompactArrayLikeADT.valueType;
      states.forEach((state) => compactValueDependencies(sparseType, stateValueToCompactValue(descriptor, state), dependencies));
    };
    var compactMapADTDependencies = (sparseCompactMapADT, stateMap, dependencies) => {
      const { keyType, valueType } = sparseCompactMapADT;
      stateMap.keys().forEach((key) => {
        if (keyType) {
          compactValueDependencies(keyType.sparseType, alignedValueToCompactValue(keyType.descriptor, key), dependencies);
        }
        if (valueType) {
          const value = stateMap.get(key);
          if (!value) {
            throw new runtime_1.CompactError(`State map ${stateMap.toString(false)} contains key without corresponding value`);
          }
          if (valueType.tag == "compactValue") {
            compactValueDependencies(valueType.sparseType, stateValueToCompactValue(valueType.descriptor, value), dependencies);
          } else {
            compactADTDependencies(valueType, value, dependencies);
          }
        }
      });
    };
    function assertCastSucceeded(s, stateValue, expectedCastOutput) {
      if (!s) {
        throw new runtime_1.CompactError(`State ${stateValue.toString(false)} cannot be cast to a ${expectedCastOutput}`);
      }
    }
    var compactADTDependencies = (sparseCompactADT, stateValue, dependencies) => {
      if (sparseCompactADT.tag == "cell") {
        compactCellDependencies(sparseCompactADT, stateValue, dependencies);
      } else if (sparseCompactADT.tag == "map") {
        const stateMap = stateValue.asMap();
        assertCastSucceeded(stateMap, stateValue, "map");
        compactMapADTDependencies(sparseCompactADT, stateMap, dependencies);
      } else if (sparseCompactADT.tag == "list" || sparseCompactADT.tag == "set") {
        const states = stateValue.asArray();
        assertCastSucceeded(states, stateValue, "array");
        compactArrayLikeADTDependencies(sparseCompactADT, states, dependencies);
      }
    };
    var castToStateArray = (state) => {
      const ledgerState = state.asArray();
      assertCastSucceeded(ledgerState, state, "array");
      return ledgerState;
    };
    var publicLedgerSegmentsDependencies = (publicLedgerSegments, state, dependencies) => {
      const ledgerState = castToStateArray(state);
      Object.keys(publicLedgerSegments).map(parseInt).forEach((idx) => {
        const referenceLocations = publicLedgerSegments.indices[idx];
        if ("tag" in referenceLocations && referenceLocations["tag"] === "publicLedgerArray") {
          publicLedgerSegmentsDependencies(referenceLocations, ledgerState[idx], dependencies);
        } else {
          compactADTDependencies(referenceLocations, ledgerState[idx], dependencies);
        }
      });
    };
    var contractDependencies = (contractReferenceLocations, state) => {
      const dependencies = /* @__PURE__ */ new Set();
      if (contractReferenceLocations.indices) {
        publicLedgerSegmentsDependencies(contractReferenceLocations, state, dependencies);
      }
      return [...dependencies];
    };
    exports.contractDependencies = contractDependencies;
  }
});

// node_modules/@midnight-ntwrk/compact-runtime/dist/runtime.js
var require_runtime = __commonJS({
  "node_modules/@midnight-ntwrk/compact-runtime/dist/runtime.js"(exports) {
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CompactTypeField = exports.CompactTypeMerkleTreePath = exports.CompactTypeMerkleTreePathEntry = exports.CompactTypeMerkleTreeDigest = exports.CompactTypeCurvePoint = exports.constructorContext = exports.decodeZswapLocalState = exports.decodeRecipient = exports.encodeZswapLocalState = exports.encodeRecipient = exports.emptyZswapLocalState = exports.DUMMY_ADDRESS = exports.MAX_FIELD = exports.contractDependencies = exports.tokenType = exports.dummyContractAddress = exports.decodeQualifiedCoinInfo = exports.decodeCoinInfo = exports.encodeQualifiedCoinInfo = exports.encodeCoinInfo = exports.decodeCoinPublicKey = exports.encodeCoinPublicKey = exports.decodeContractAddress = exports.encodeContractAddress = exports.decodeTokenType = exports.encodeTokenType = exports.verifySignature = exports.signatureVerifyingKey = exports.signData = exports.sampleSigningKey = exports.sampleTokenType = exports.sampleContractAddress = exports.NetworkId = exports.leafHash = exports.coinCommitment = exports.maxAlignedSize = exports.bigIntToValue = exports.valueToBigInt = exports.VmStack = exports.VmResults = exports.StateValue = exports.StateMap = exports.StateBoundedMerkleTree = exports.QueryResults = exports.QueryContext = exports.ContractMaintenanceAuthority = exports.ContractState = exports.ContractOperation = exports.runProgram = exports.CostModel = void 0;
    exports.CompactError = exports.CompactTypeOpaqueString = exports.CompactTypeOpaqueUint8Array = exports.CompactTypeBytes = exports.CompactTypeBoolean = exports.CompactTypeVector = exports.CompactTypeUnsignedInteger = exports.CompactTypeEnum = void 0;
    exports.alignedConcat = alignedConcat;
    exports.transientHash = transientHash;
    exports.transientCommit = transientCommit;
    exports.persistentHash = persistentHash;
    exports.persistentCommit = persistentCommit;
    exports.degradeToTransient = degradeToTransient;
    exports.upgradeFromTransient = upgradeFromTransient;
    exports.hashToCurve = hashToCurve;
    exports.ecAdd = ecAdd;
    exports.ecMul = ecMul;
    exports.ecMulGenerator = ecMulGenerator;
    exports.createZswapInput = createZswapInput;
    exports.createZswapOutput = createZswapOutput;
    exports.ownPublicKey = ownPublicKey;
    exports.witnessContext = witnessContext;
    exports.checkProofData = checkProofData;
    exports.assert = assert;
    exports.type_error = type_error;
    exports.convert_bigint_to_Uint8Array = convert_bigint_to_Uint8Array;
    exports.convert_Uint8Array_to_bigint = convert_Uint8Array_to_bigint;
    exports.addField = addField;
    exports.subField = subField;
    exports.mulField = mulField;
    var inspect = require_object_inspect();
    var ocrt = require_onchain_runtime();
    __exportStar(require_version(), exports);
    var onchain_runtime_1 = require_onchain_runtime();
    Object.defineProperty(exports, "CostModel", { enumerable: true, get: function() {
      return onchain_runtime_1.CostModel;
    } });
    Object.defineProperty(exports, "runProgram", { enumerable: true, get: function() {
      return onchain_runtime_1.runProgram;
    } });
    Object.defineProperty(exports, "ContractOperation", { enumerable: true, get: function() {
      return onchain_runtime_1.ContractOperation;
    } });
    Object.defineProperty(exports, "ContractState", { enumerable: true, get: function() {
      return onchain_runtime_1.ContractState;
    } });
    Object.defineProperty(exports, "ContractMaintenanceAuthority", { enumerable: true, get: function() {
      return onchain_runtime_1.ContractMaintenanceAuthority;
    } });
    Object.defineProperty(exports, "QueryContext", { enumerable: true, get: function() {
      return onchain_runtime_1.QueryContext;
    } });
    Object.defineProperty(exports, "QueryResults", { enumerable: true, get: function() {
      return onchain_runtime_1.QueryResults;
    } });
    Object.defineProperty(exports, "StateBoundedMerkleTree", { enumerable: true, get: function() {
      return onchain_runtime_1.StateBoundedMerkleTree;
    } });
    Object.defineProperty(exports, "StateMap", { enumerable: true, get: function() {
      return onchain_runtime_1.StateMap;
    } });
    Object.defineProperty(exports, "StateValue", { enumerable: true, get: function() {
      return onchain_runtime_1.StateValue;
    } });
    Object.defineProperty(exports, "VmResults", { enumerable: true, get: function() {
      return onchain_runtime_1.VmResults;
    } });
    Object.defineProperty(exports, "VmStack", { enumerable: true, get: function() {
      return onchain_runtime_1.VmStack;
    } });
    Object.defineProperty(exports, "valueToBigInt", { enumerable: true, get: function() {
      return onchain_runtime_1.valueToBigInt;
    } });
    Object.defineProperty(exports, "bigIntToValue", { enumerable: true, get: function() {
      return onchain_runtime_1.bigIntToValue;
    } });
    Object.defineProperty(exports, "maxAlignedSize", { enumerable: true, get: function() {
      return onchain_runtime_1.maxAlignedSize;
    } });
    Object.defineProperty(exports, "coinCommitment", { enumerable: true, get: function() {
      return onchain_runtime_1.coinCommitment;
    } });
    Object.defineProperty(exports, "leafHash", { enumerable: true, get: function() {
      return onchain_runtime_1.leafHash;
    } });
    Object.defineProperty(exports, "NetworkId", { enumerable: true, get: function() {
      return onchain_runtime_1.NetworkId;
    } });
    Object.defineProperty(exports, "sampleContractAddress", { enumerable: true, get: function() {
      return onchain_runtime_1.sampleContractAddress;
    } });
    Object.defineProperty(exports, "sampleTokenType", { enumerable: true, get: function() {
      return onchain_runtime_1.sampleTokenType;
    } });
    Object.defineProperty(exports, "sampleSigningKey", { enumerable: true, get: function() {
      return onchain_runtime_1.sampleSigningKey;
    } });
    Object.defineProperty(exports, "signData", { enumerable: true, get: function() {
      return onchain_runtime_1.signData;
    } });
    Object.defineProperty(exports, "signatureVerifyingKey", { enumerable: true, get: function() {
      return onchain_runtime_1.signatureVerifyingKey;
    } });
    Object.defineProperty(exports, "verifySignature", { enumerable: true, get: function() {
      return onchain_runtime_1.verifySignature;
    } });
    Object.defineProperty(exports, "encodeTokenType", { enumerable: true, get: function() {
      return onchain_runtime_1.encodeTokenType;
    } });
    Object.defineProperty(exports, "decodeTokenType", { enumerable: true, get: function() {
      return onchain_runtime_1.decodeTokenType;
    } });
    Object.defineProperty(exports, "encodeContractAddress", { enumerable: true, get: function() {
      return onchain_runtime_1.encodeContractAddress;
    } });
    Object.defineProperty(exports, "decodeContractAddress", { enumerable: true, get: function() {
      return onchain_runtime_1.decodeContractAddress;
    } });
    Object.defineProperty(exports, "encodeCoinPublicKey", { enumerable: true, get: function() {
      return onchain_runtime_1.encodeCoinPublicKey;
    } });
    Object.defineProperty(exports, "decodeCoinPublicKey", { enumerable: true, get: function() {
      return onchain_runtime_1.decodeCoinPublicKey;
    } });
    Object.defineProperty(exports, "encodeCoinInfo", { enumerable: true, get: function() {
      return onchain_runtime_1.encodeCoinInfo;
    } });
    Object.defineProperty(exports, "encodeQualifiedCoinInfo", { enumerable: true, get: function() {
      return onchain_runtime_1.encodeQualifiedCoinInfo;
    } });
    Object.defineProperty(exports, "decodeCoinInfo", { enumerable: true, get: function() {
      return onchain_runtime_1.decodeCoinInfo;
    } });
    Object.defineProperty(exports, "decodeQualifiedCoinInfo", { enumerable: true, get: function() {
      return onchain_runtime_1.decodeQualifiedCoinInfo;
    } });
    Object.defineProperty(exports, "dummyContractAddress", { enumerable: true, get: function() {
      return onchain_runtime_1.dummyContractAddress;
    } });
    Object.defineProperty(exports, "tokenType", { enumerable: true, get: function() {
      return onchain_runtime_1.tokenType;
    } });
    var contract_dependencies_1 = require_contract_dependencies();
    Object.defineProperty(exports, "contractDependencies", { enumerable: true, get: function() {
      return contract_dependencies_1.contractDependencies;
    } });
    exports.MAX_FIELD = ocrt.maxField();
    var FIELD_MODULUS = exports.MAX_FIELD + 1n;
    exports.DUMMY_ADDRESS = ocrt.dummyContractAddress();
    function alignedConcat(...values) {
      const res = { value: [], alignment: [] };
      for (const value of values) {
        res.value = res.value.concat(value.value);
        res.alignment = res.alignment.concat(value.alignment);
      }
      return res;
    }
    function transientHash(rt_type, value) {
      return ocrt.valueToBigInt(ocrt.transientHash(rt_type.alignment(), rt_type.toValue(value)));
    }
    function transientCommit(rt_type, value, opening) {
      return ocrt.valueToBigInt(ocrt.transientCommit(rt_type.alignment(), rt_type.toValue(value), ocrt.bigIntToValue(opening)));
    }
    function persistentHash(rt_type, value) {
      const wrapped = ocrt.persistentHash(rt_type.alignment(), rt_type.toValue(value))[0];
      const res = new Uint8Array(32);
      res.set(wrapped, 0);
      return res;
    }
    function persistentCommit(rt_type, value, opening) {
      if (opening.length != 32) {
        throw new CompactError("Expected 32-byte string");
      }
      const wrapped = ocrt.persistentCommit(rt_type.alignment(), rt_type.toValue(value), [opening])[0];
      const res = new Uint8Array(32);
      res.set(wrapped, 0);
      return res;
    }
    function degradeToTransient(x) {
      if (x.length != 32) {
        throw new CompactError("Expected 32-byte string");
      }
      return ocrt.valueToBigInt(ocrt.degradeToTransient([x]));
    }
    function upgradeFromTransient(x) {
      const wrapped = ocrt.upgradeFromTransient(ocrt.bigIntToValue(x))[0];
      const res = new Uint8Array(32);
      res.set(wrapped, 0);
      return res;
    }
    function hashToCurve(rt_type, x) {
      return new CompactTypeCurvePoint().fromValue(ocrt.hashToCurve(rt_type.alignment(), rt_type.toValue(x)));
    }
    function ecAdd(a, b) {
      const rt_type = new CompactTypeCurvePoint();
      return rt_type.fromValue(ocrt.ecAdd(rt_type.toValue(a), rt_type.toValue(b)));
    }
    function ecMul(a, b) {
      const rt_type = new CompactTypeCurvePoint();
      return rt_type.fromValue(ocrt.ecMul(rt_type.toValue(a), ocrt.bigIntToValue(b)));
    }
    function ecMulGenerator(b) {
      return new CompactTypeCurvePoint().fromValue(ocrt.ecMulGenerator(ocrt.bigIntToValue(b)));
    }
    var emptyZswapLocalState = (coinPublicKey) => ({
      coinPublicKey: { bytes: ocrt.encodeCoinPublicKey(coinPublicKey) },
      currentIndex: 0n,
      inputs: [],
      outputs: []
    });
    exports.emptyZswapLocalState = emptyZswapLocalState;
    var encodeRecipient = ({ is_left, left, right }) => ({
      is_left,
      left: { bytes: ocrt.encodeCoinPublicKey(left) },
      right: { bytes: ocrt.encodeContractAddress(right) }
    });
    exports.encodeRecipient = encodeRecipient;
    var encodeZswapLocalState = (state) => ({
      coinPublicKey: { bytes: ocrt.encodeCoinPublicKey(state.coinPublicKey) },
      currentIndex: state.currentIndex,
      inputs: state.inputs.map(ocrt.encodeQualifiedCoinInfo),
      outputs: state.outputs.map(({ coinInfo, recipient }) => ({
        coinInfo: ocrt.encodeCoinInfo(coinInfo),
        recipient: (0, exports.encodeRecipient)(recipient)
      }))
    });
    exports.encodeZswapLocalState = encodeZswapLocalState;
    var decodeRecipient = ({ is_left, left, right }) => ({
      is_left,
      left: ocrt.decodeCoinPublicKey(left.bytes),
      right: ocrt.decodeContractAddress(right.bytes)
    });
    exports.decodeRecipient = decodeRecipient;
    var decodeZswapLocalState = (state) => ({
      coinPublicKey: ocrt.decodeCoinPublicKey(state.coinPublicKey.bytes),
      currentIndex: state.currentIndex,
      inputs: state.inputs.map(ocrt.decodeQualifiedCoinInfo),
      outputs: state.outputs.map(({ coinInfo, recipient }) => ({
        coinInfo: ocrt.decodeCoinInfo(coinInfo),
        recipient: (0, exports.decodeRecipient)(recipient)
      }))
    });
    exports.decodeZswapLocalState = decodeZswapLocalState;
    function createZswapInput(circuitContext, qualifiedCoinInfo) {
      circuitContext.currentZswapLocalState = {
        ...circuitContext.currentZswapLocalState,
        inputs: circuitContext.currentZswapLocalState.inputs.concat(qualifiedCoinInfo)
      };
    }
    function createCoinCommitment(coinInfo, recipient) {
      return ocrt.coinCommitment({
        value: coinInfoDescriptor.toValue(coinInfo),
        alignment: coinInfoDescriptor.alignment()
      }, {
        value: eitherDescriptor.toValue(recipient),
        alignment: eitherDescriptor.alignment()
      });
    }
    function createZswapOutput(circuitContext, coinInfo, recipient) {
      circuitContext.transactionContext = circuitContext.transactionContext.insertCommitment(Buffer.from(bytesDescriptor.fromValue(createCoinCommitment(coinInfo, recipient).value)).toString("hex"), circuitContext.currentZswapLocalState.currentIndex);
      circuitContext.currentZswapLocalState = {
        ...circuitContext.currentZswapLocalState,
        currentIndex: circuitContext.currentZswapLocalState.currentIndex + 1n,
        outputs: circuitContext.currentZswapLocalState.outputs.concat({
          coinInfo,
          recipient
        })
      };
    }
    function ownPublicKey(circuitContext) {
      return circuitContext.currentZswapLocalState.coinPublicKey;
    }
    function witnessContext(ledger, privateState, contractAddress) {
      return {
        ledger,
        privateState,
        contractAddress
      };
    }
    function checkProofData(zkir, proofData) {
      return ocrt.checkProofData(zkir, proofData.input, proofData.output, proofData.publicTranscript, proofData.privateTranscriptOutputs);
    }
    var constructorContext = (initialPrivateState, coinPublicKey) => ({
      initialPrivateState,
      initialZswapLocalState: (0, exports.emptyZswapLocalState)(coinPublicKey)
    });
    exports.constructorContext = constructorContext;
    var CompactTypeCurvePoint = class {
      alignment() {
        return [
          { tag: "atom", value: { tag: "field" } },
          { tag: "atom", value: { tag: "field" } }
        ];
      }
      fromValue(value) {
        const x = value.shift();
        const y = value.shift();
        if (x == void 0 || y == void 0) {
          throw new CompactError("expected CurvePoint");
        } else {
          return {
            x: ocrt.valueToBigInt([x]),
            y: ocrt.valueToBigInt([y])
          };
        }
      }
      toValue(value) {
        return ocrt.bigIntToValue(value.x).concat(ocrt.bigIntToValue(value.y));
      }
    };
    exports.CompactTypeCurvePoint = CompactTypeCurvePoint;
    var CompactTypeMerkleTreeDigest = class {
      alignment() {
        return [{ tag: "atom", value: { tag: "field" } }];
      }
      fromValue(value) {
        const val = value.shift();
        if (val == void 0) {
          throw new CompactError("expected MerkleTreeDigest");
        } else {
          return { field: ocrt.valueToBigInt([val]) };
        }
      }
      toValue(value) {
        return ocrt.bigIntToValue(value.field);
      }
    };
    exports.CompactTypeMerkleTreeDigest = CompactTypeMerkleTreeDigest;
    var CompactTypeMerkleTreePathEntry = class {
      constructor() {
        this.digest = new CompactTypeMerkleTreeDigest();
        this.bool = new CompactTypeBoolean();
      }
      alignment() {
        return this.digest.alignment().concat(this.bool.alignment());
      }
      fromValue(value) {
        const sibling = this.digest.fromValue(value);
        const goes_left = this.bool.fromValue(value);
        return {
          sibling,
          goes_left
        };
      }
      toValue(value) {
        return this.digest.toValue(value.sibling).concat(this.bool.toValue(value.goes_left));
      }
    };
    exports.CompactTypeMerkleTreePathEntry = CompactTypeMerkleTreePathEntry;
    var CompactTypeMerkleTreePath = class {
      constructor(n, leaf) {
        this.leaf = leaf;
        this.path = new CompactTypeVector(n, new CompactTypeMerkleTreePathEntry());
      }
      alignment() {
        return this.leaf.alignment().concat(this.path.alignment());
      }
      fromValue(value) {
        const leaf = this.leaf.fromValue(value);
        const path = this.path.fromValue(value);
        return {
          leaf,
          path
        };
      }
      toValue(value) {
        return this.leaf.toValue(value.leaf).concat(this.path.toValue(value.path));
      }
    };
    exports.CompactTypeMerkleTreePath = CompactTypeMerkleTreePath;
    var CompactTypeField = class {
      alignment() {
        return [{ tag: "atom", value: { tag: "field" } }];
      }
      fromValue(value) {
        const val = value.shift();
        if (val == void 0) {
          throw new CompactError("expected Field");
        } else {
          return ocrt.valueToBigInt([val]);
        }
      }
      toValue(value) {
        return ocrt.bigIntToValue(value);
      }
    };
    exports.CompactTypeField = CompactTypeField;
    var CompactTypeEnum = class {
      constructor(maxValue, length) {
        this.maxValue = maxValue;
        this.length = length;
      }
      alignment() {
        return [{ tag: "atom", value: { tag: "bytes", length: this.length } }];
      }
      fromValue(value) {
        const val = value.shift();
        if (val == void 0) {
          throw new CompactError(`expected Enum[<=${this.maxValue}]`);
        } else {
          let res = 0;
          for (let i = 0; i < val.length; i++) {
            res += (1 << 8 * i) * val[i];
          }
          if (res > this.maxValue) {
            throw new CompactError(`expected UnsignedInteger[<=${this.maxValue}]`);
          }
          return res;
        }
      }
      toValue(value) {
        return new CompactTypeField().toValue(BigInt(value));
      }
    };
    exports.CompactTypeEnum = CompactTypeEnum;
    var CompactTypeUnsignedInteger = class {
      constructor(maxValue, length) {
        this.maxValue = maxValue;
        this.length = length;
      }
      alignment() {
        return [{ tag: "atom", value: { tag: "bytes", length: this.length } }];
      }
      fromValue(value) {
        const val = value.shift();
        if (val == void 0) {
          throw new CompactError(`expected UnsignedInteger[<=${this.maxValue}]`);
        } else {
          let res = 0n;
          for (let i = 0; i < val.length; i++) {
            res += (1n << 8n * BigInt(i)) * BigInt(val[i]);
          }
          if (res > this.maxValue) {
            throw new CompactError(`expected UnsignedInteger[<=${this.maxValue}]`);
          }
          return res;
        }
      }
      toValue(value) {
        return new CompactTypeField().toValue(value);
      }
    };
    exports.CompactTypeUnsignedInteger = CompactTypeUnsignedInteger;
    var CompactTypeVector = class {
      constructor(length, type) {
        this.length = length;
        this.type = type;
      }
      alignment() {
        const inner = this.type.alignment();
        let res = [];
        for (let i = 0; i < this.length; i++) {
          res = res.concat(inner);
        }
        return res;
      }
      fromValue(value) {
        const res = [];
        for (let i = 0; i < this.length; i++) {
          res.push(this.type.fromValue(value));
        }
        return res;
      }
      toValue(value) {
        if (value.length != this.length) {
          throw new CompactError(`expected ${this.length}-element array`);
        }
        let res = [];
        for (let i = 0; i < this.length; i++) {
          res = res.concat(this.type.toValue(value[i]));
        }
        return res;
      }
    };
    exports.CompactTypeVector = CompactTypeVector;
    var CompactTypeBoolean = class {
      alignment() {
        return [{ tag: "atom", value: { tag: "bytes", length: 1 } }];
      }
      fromValue(value) {
        const val = value.shift();
        if (val == void 0 || val.length > 1 || val.length == 1 && val[0] != 1) {
          throw new CompactError("expected Boolean");
        }
        return val.length == 1;
      }
      toValue(value) {
        if (value) {
          return [new Uint8Array([1])];
        } else {
          return [new Uint8Array(0)];
        }
      }
    };
    exports.CompactTypeBoolean = CompactTypeBoolean;
    var CompactTypeBytes = class {
      constructor(length) {
        this.length = length;
      }
      alignment() {
        return [{ tag: "atom", value: { tag: "bytes", length: this.length } }];
      }
      fromValue(value) {
        const val = value.shift();
        if (val == void 0 || val.length > this.length) {
          throw new CompactError(`expected Bytes[${this.length}]`);
        }
        if (val.length == this.length) {
          return val;
        }
        const res = new Uint8Array(this.length);
        res.set(val, 0);
        return res;
      }
      toValue(value) {
        let end = value.length;
        while (end > 0 && value[end - 1] == 0) {
          end -= 1;
        }
        return [value.slice(0, end)];
      }
    };
    exports.CompactTypeBytes = CompactTypeBytes;
    var CompactTypeOpaqueUint8Array = class {
      alignment() {
        return [{ tag: "atom", value: { tag: "compress" } }];
      }
      fromValue(value) {
        return value.shift();
      }
      toValue(value) {
        return [value];
      }
    };
    exports.CompactTypeOpaqueUint8Array = CompactTypeOpaqueUint8Array;
    var CompactTypeOpaqueString = class {
      alignment() {
        return [{ tag: "atom", value: { tag: "compress" } }];
      }
      fromValue(value) {
        return new TextDecoder("utf-8").decode(value.shift());
      }
      toValue(value) {
        return [new TextEncoder().encode(value)];
      }
    };
    exports.CompactTypeOpaqueString = CompactTypeOpaqueString;
    var CompactError = class extends Error {
      constructor(msg) {
        super(msg);
        this.name = "CompactError";
      }
    };
    exports.CompactError = CompactError;
    function assert(b, s) {
      if (!b) {
        const msg = `failed assert: ${s}`;
        throw new CompactError(msg);
      }
    }
    function type_error(who, what, where, type, x) {
      const msg = `type error: ${who} ${what} at ${where}; expected value of type ${type} but received ${inspect(x)}`;
      throw new CompactError(msg);
    }
    function convert_bigint_to_Uint8Array(n, x) {
      const x_0 = x;
      const a = new Uint8Array(n);
      for (let i = 0; i < n; i++) {
        a[i] = Number(x & 0xffn);
        x = x / 0x100n;
        if (x == 0n)
          return a;
      }
      const msg = `range error: ${x_0} cannot be decomposed into ${n} bytes`;
      throw new CompactError(msg);
    }
    function convert_Uint8Array_to_bigint(n, a) {
      let x = 0n;
      for (let i = n - 1; i >= 0; i -= 1) {
        x = x * 0x100n + BigInt(a[i]);
      }
      if (x > exports.MAX_FIELD) {
        const msg = `range error: ${x} is greater than maximum for the field ${exports.MAX_FIELD}`;
        throw new CompactError(msg);
      }
      return x;
    }
    function addField(x, y) {
      const t = x + y;
      return t < FIELD_MODULUS ? t : t - FIELD_MODULUS;
    }
    function subField(x, y) {
      const t = x - y;
      return t >= 0 ? t : t + FIELD_MODULUS;
    }
    function mulField(x, y) {
      return x * y % FIELD_MODULUS;
    }
    var bytesDescriptor = new CompactTypeBytes(32);
    var uintDescriptor = new CompactTypeUnsignedInteger(18446744073709551615n, 8);
    var CoinInfoDescriptor = class {
      alignment() {
        return bytesDescriptor.alignment().concat(bytesDescriptor.alignment().concat(uintDescriptor.alignment()));
      }
      fromValue(value) {
        return {
          nonce: bytesDescriptor.fromValue(value),
          color: bytesDescriptor.fromValue(value),
          value: uintDescriptor.fromValue(value)
        };
      }
      toValue(value) {
        return bytesDescriptor.toValue(value.nonce).concat(bytesDescriptor.toValue(value.color).concat(uintDescriptor.toValue(value.value)));
      }
    };
    var coinInfoDescriptor = new CoinInfoDescriptor();
    var ZswapCoinPublicKeyDescriptor = class {
      alignment() {
        return bytesDescriptor.alignment();
      }
      fromValue(value) {
        return {
          bytes: bytesDescriptor.fromValue(value)
        };
      }
      toValue(value) {
        return bytesDescriptor.toValue(value.bytes);
      }
    };
    var ContractAddressDescriptor = class {
      alignment() {
        return bytesDescriptor.alignment();
      }
      fromValue(value) {
        return {
          bytes: bytesDescriptor.fromValue(value)
        };
      }
      toValue(value) {
        return bytesDescriptor.toValue(value.bytes);
      }
    };
    var contractAddressDescriptor = new ContractAddressDescriptor();
    var zswapCoinPublicKeyDescriptor = new ZswapCoinPublicKeyDescriptor();
    var booleanDescriptor = new CompactTypeBoolean();
    var EitherDescriptor = class {
      alignment() {
        return booleanDescriptor.alignment().concat(zswapCoinPublicKeyDescriptor.alignment().concat(contractAddressDescriptor.alignment()));
      }
      fromValue(value) {
        return {
          is_left: booleanDescriptor.fromValue(value),
          left: zswapCoinPublicKeyDescriptor.fromValue(value),
          right: contractAddressDescriptor.fromValue(value)
        };
      }
      toValue(value) {
        return booleanDescriptor.toValue(value.is_left).concat(zswapCoinPublicKeyDescriptor.toValue(value.left).concat(contractAddressDescriptor.toValue(value.right)));
      }
    };
    var eitherDescriptor = new EitherDescriptor();
  }
});

export {
  require_runtime
};
//# sourceMappingURL=chunk-YSRWTMAP.js.map
