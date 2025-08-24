import {
  require_lodash
} from "./chunk-NB6U6WGT.js";
import {
  getLedgerNetworkId
} from "./chunk-TXGPLY3S.js";
import "./chunk-FT6GD4E2.js";
import "./chunk-YSRWTMAP.js";
import "./chunk-BHZHBNKN.js";
import {
  require_browser_ponyfill
} from "./chunk-5GTCT7JP.js";
import {
  InvalidProtocolSchemeError,
  createUnbalancedTx
} from "./chunk-EDDV2GWR.js";
import {
  Transaction
} from "./chunk-CLR33FOK.js";
import {
  __commonJS,
  __toESM
} from "./chunk-V4OQ3NZ2.js";

// node_modules/fetch-retry/dist/fetch-retry.umd.js
var require_fetch_retry_umd = __commonJS({
  "node_modules/fetch-retry/dist/fetch-retry.umd.js"(exports, module) {
    (function(global, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.fetchRetry = factory());
    })(exports, (function() {
      "use strict";
      var fetchRetry2 = function(fetch2, defaults) {
        defaults = defaults || {};
        if (typeof fetch2 !== "function") {
          throw new ArgumentError("fetch must be a function");
        }
        if (typeof defaults !== "object") {
          throw new ArgumentError("defaults must be an object");
        }
        if (defaults.retries !== void 0 && !isPositiveInteger(defaults.retries)) {
          throw new ArgumentError("retries must be a positive integer");
        }
        if (defaults.retryDelay !== void 0 && !isPositiveInteger(defaults.retryDelay) && typeof defaults.retryDelay !== "function") {
          throw new ArgumentError("retryDelay must be a positive integer or a function returning a positive integer");
        }
        if (defaults.retryOn !== void 0 && !Array.isArray(defaults.retryOn) && typeof defaults.retryOn !== "function") {
          throw new ArgumentError("retryOn property expects an array or function");
        }
        var baseDefaults = {
          retries: 3,
          retryDelay: 1e3,
          retryOn: []
        };
        defaults = Object.assign(baseDefaults, defaults);
        return function fetchRetry3(input, init) {
          var retries = defaults.retries;
          var retryDelay = defaults.retryDelay;
          var retryOn = defaults.retryOn;
          if (init && init.retries !== void 0) {
            if (isPositiveInteger(init.retries)) {
              retries = init.retries;
            } else {
              throw new ArgumentError("retries must be a positive integer");
            }
          }
          if (init && init.retryDelay !== void 0) {
            if (isPositiveInteger(init.retryDelay) || typeof init.retryDelay === "function") {
              retryDelay = init.retryDelay;
            } else {
              throw new ArgumentError("retryDelay must be a positive integer or a function returning a positive integer");
            }
          }
          if (init && init.retryOn) {
            if (Array.isArray(init.retryOn) || typeof init.retryOn === "function") {
              retryOn = init.retryOn;
            } else {
              throw new ArgumentError("retryOn property expects an array or function");
            }
          }
          return new Promise(function(resolve, reject) {
            var wrappedFetch = function(attempt) {
              var _input = typeof Request !== "undefined" && input instanceof Request ? input.clone() : input;
              fetch2(_input, init).then(function(response) {
                if (Array.isArray(retryOn) && retryOn.indexOf(response.status) === -1) {
                  resolve(response);
                } else if (typeof retryOn === "function") {
                  try {
                    return Promise.resolve(retryOn(attempt, null, response)).then(function(retryOnResponse) {
                      if (retryOnResponse) {
                        retry(attempt, null, response);
                      } else {
                        resolve(response);
                      }
                    }).catch(reject);
                  } catch (error) {
                    reject(error);
                  }
                } else {
                  if (attempt < retries) {
                    retry(attempt, null, response);
                  } else {
                    resolve(response);
                  }
                }
              }).catch(function(error) {
                if (typeof retryOn === "function") {
                  try {
                    Promise.resolve(retryOn(attempt, error, null)).then(function(retryOnResponse) {
                      if (retryOnResponse) {
                        retry(attempt, error, null);
                      } else {
                        reject(error);
                      }
                    }).catch(function(error2) {
                      reject(error2);
                    });
                  } catch (error2) {
                    reject(error2);
                  }
                } else if (attempt < retries) {
                  retry(attempt, error, null);
                } else {
                  reject(error);
                }
              });
            };
            function retry(attempt, error, response) {
              var delay = typeof retryDelay === "function" ? retryDelay(attempt, error, response) : retryDelay;
              setTimeout(function() {
                wrappedFetch(++attempt);
              }, delay);
            }
            wrappedFetch(0);
          });
        };
      };
      function isPositiveInteger(value) {
        return Number.isInteger(value) && value >= 0;
      }
      function ArgumentError(message) {
        this.name = "ArgumentError";
        this.message = message;
      }
      return fetchRetry2;
    }));
  }
});

// node_modules/@protobufjs/utf8/index.js
var require_utf8 = __commonJS({
  "node_modules/@protobufjs/utf8/index.js"(exports) {
    "use strict";
    var utf82 = exports;
    utf82.length = function utf8_length(string) {
      var len = 0, c = 0;
      for (var i = 0; i < string.length; ++i) {
        c = string.charCodeAt(i);
        if (c < 128)
          len += 1;
        else if (c < 2048)
          len += 2;
        else if ((c & 64512) === 55296 && (string.charCodeAt(i + 1) & 64512) === 56320) {
          ++i;
          len += 4;
        } else
          len += 3;
      }
      return len;
    };
    utf82.read = function utf8_read(buffer, start, end) {
      var len = end - start;
      if (len < 1)
        return "";
      var parts = null, chunk = [], i = 0, t;
      while (start < end) {
        t = buffer[start++];
        if (t < 128)
          chunk[i++] = t;
        else if (t > 191 && t < 224)
          chunk[i++] = (t & 31) << 6 | buffer[start++] & 63;
        else if (t > 239 && t < 365) {
          t = ((t & 7) << 18 | (buffer[start++] & 63) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63) - 65536;
          chunk[i++] = 55296 + (t >> 10);
          chunk[i++] = 56320 + (t & 1023);
        } else
          chunk[i++] = (t & 15) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63;
        if (i > 8191) {
          (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
          i = 0;
        }
      }
      if (parts) {
        if (i)
          parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
        return parts.join("");
      }
      return String.fromCharCode.apply(String, chunk.slice(0, i));
    };
    utf82.write = function utf8_write(string, buffer, offset) {
      var start = offset, c1, c2;
      for (var i = 0; i < string.length; ++i) {
        c1 = string.charCodeAt(i);
        if (c1 < 128) {
          buffer[offset++] = c1;
        } else if (c1 < 2048) {
          buffer[offset++] = c1 >> 6 | 192;
          buffer[offset++] = c1 & 63 | 128;
        } else if ((c1 & 64512) === 55296 && ((c2 = string.charCodeAt(i + 1)) & 64512) === 56320) {
          c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
          ++i;
          buffer[offset++] = c1 >> 18 | 240;
          buffer[offset++] = c1 >> 12 & 63 | 128;
          buffer[offset++] = c1 >> 6 & 63 | 128;
          buffer[offset++] = c1 & 63 | 128;
        } else {
          buffer[offset++] = c1 >> 12 | 224;
          buffer[offset++] = c1 >> 6 & 63 | 128;
          buffer[offset++] = c1 & 63 | 128;
        }
      }
      return offset - start;
    };
  }
});

// node_modules/@protobufjs/float/index.js
var require_float = __commonJS({
  "node_modules/@protobufjs/float/index.js"(exports, module) {
    "use strict";
    module.exports = factory(factory);
    function factory(exports2) {
      if (typeof Float32Array !== "undefined") (function() {
        var f32 = new Float32Array([-0]), f8b = new Uint8Array(f32.buffer), le = f8b[3] === 128;
        function writeFloat_f32_cpy(val, buf, pos) {
          f32[0] = val;
          buf[pos] = f8b[0];
          buf[pos + 1] = f8b[1];
          buf[pos + 2] = f8b[2];
          buf[pos + 3] = f8b[3];
        }
        function writeFloat_f32_rev(val, buf, pos) {
          f32[0] = val;
          buf[pos] = f8b[3];
          buf[pos + 1] = f8b[2];
          buf[pos + 2] = f8b[1];
          buf[pos + 3] = f8b[0];
        }
        exports2.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
        exports2.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;
        function readFloat_f32_cpy(buf, pos) {
          f8b[0] = buf[pos];
          f8b[1] = buf[pos + 1];
          f8b[2] = buf[pos + 2];
          f8b[3] = buf[pos + 3];
          return f32[0];
        }
        function readFloat_f32_rev(buf, pos) {
          f8b[3] = buf[pos];
          f8b[2] = buf[pos + 1];
          f8b[1] = buf[pos + 2];
          f8b[0] = buf[pos + 3];
          return f32[0];
        }
        exports2.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
        exports2.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;
      })();
      else (function() {
        function writeFloat_ieee754(writeUint, val, buf, pos) {
          var sign = val < 0 ? 1 : 0;
          if (sign)
            val = -val;
          if (val === 0)
            writeUint(1 / val > 0 ? (
              /* positive */
              0
            ) : (
              /* negative 0 */
              2147483648
            ), buf, pos);
          else if (isNaN(val))
            writeUint(2143289344, buf, pos);
          else if (val > 34028234663852886e22)
            writeUint((sign << 31 | 2139095040) >>> 0, buf, pos);
          else if (val < 11754943508222875e-54)
            writeUint((sign << 31 | Math.round(val / 1401298464324817e-60)) >>> 0, buf, pos);
          else {
            var exponent = Math.floor(Math.log(val) / Math.LN2), mantissa = Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607;
            writeUint((sign << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf, pos);
          }
        }
        exports2.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
        exports2.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);
        function readFloat_ieee754(readUint, buf, pos) {
          var uint = readUint(buf, pos), sign = (uint >> 31) * 2 + 1, exponent = uint >>> 23 & 255, mantissa = uint & 8388607;
          return exponent === 255 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 1401298464324817e-60 * mantissa : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608);
        }
        exports2.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
        exports2.readFloatBE = readFloat_ieee754.bind(null, readUintBE);
      })();
      if (typeof Float64Array !== "undefined") (function() {
        var f64 = new Float64Array([-0]), f8b = new Uint8Array(f64.buffer), le = f8b[7] === 128;
        function writeDouble_f64_cpy(val, buf, pos) {
          f64[0] = val;
          buf[pos] = f8b[0];
          buf[pos + 1] = f8b[1];
          buf[pos + 2] = f8b[2];
          buf[pos + 3] = f8b[3];
          buf[pos + 4] = f8b[4];
          buf[pos + 5] = f8b[5];
          buf[pos + 6] = f8b[6];
          buf[pos + 7] = f8b[7];
        }
        function writeDouble_f64_rev(val, buf, pos) {
          f64[0] = val;
          buf[pos] = f8b[7];
          buf[pos + 1] = f8b[6];
          buf[pos + 2] = f8b[5];
          buf[pos + 3] = f8b[4];
          buf[pos + 4] = f8b[3];
          buf[pos + 5] = f8b[2];
          buf[pos + 6] = f8b[1];
          buf[pos + 7] = f8b[0];
        }
        exports2.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
        exports2.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;
        function readDouble_f64_cpy(buf, pos) {
          f8b[0] = buf[pos];
          f8b[1] = buf[pos + 1];
          f8b[2] = buf[pos + 2];
          f8b[3] = buf[pos + 3];
          f8b[4] = buf[pos + 4];
          f8b[5] = buf[pos + 5];
          f8b[6] = buf[pos + 6];
          f8b[7] = buf[pos + 7];
          return f64[0];
        }
        function readDouble_f64_rev(buf, pos) {
          f8b[7] = buf[pos];
          f8b[6] = buf[pos + 1];
          f8b[5] = buf[pos + 2];
          f8b[4] = buf[pos + 3];
          f8b[3] = buf[pos + 4];
          f8b[2] = buf[pos + 5];
          f8b[1] = buf[pos + 6];
          f8b[0] = buf[pos + 7];
          return f64[0];
        }
        exports2.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
        exports2.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;
      })();
      else (function() {
        function writeDouble_ieee754(writeUint, off0, off1, val, buf, pos) {
          var sign = val < 0 ? 1 : 0;
          if (sign)
            val = -val;
          if (val === 0) {
            writeUint(0, buf, pos + off0);
            writeUint(1 / val > 0 ? (
              /* positive */
              0
            ) : (
              /* negative 0 */
              2147483648
            ), buf, pos + off1);
          } else if (isNaN(val)) {
            writeUint(0, buf, pos + off0);
            writeUint(2146959360, buf, pos + off1);
          } else if (val > 17976931348623157e292) {
            writeUint(0, buf, pos + off0);
            writeUint((sign << 31 | 2146435072) >>> 0, buf, pos + off1);
          } else {
            var mantissa;
            if (val < 22250738585072014e-324) {
              mantissa = val / 5e-324;
              writeUint(mantissa >>> 0, buf, pos + off0);
              writeUint((sign << 31 | mantissa / 4294967296) >>> 0, buf, pos + off1);
            } else {
              var exponent = Math.floor(Math.log(val) / Math.LN2);
              if (exponent === 1024)
                exponent = 1023;
              mantissa = val * Math.pow(2, -exponent);
              writeUint(mantissa * 4503599627370496 >>> 0, buf, pos + off0);
              writeUint((sign << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0, buf, pos + off1);
            }
          }
        }
        exports2.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
        exports2.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);
        function readDouble_ieee754(readUint, off0, off1, buf, pos) {
          var lo = readUint(buf, pos + off0), hi = readUint(buf, pos + off1);
          var sign = (hi >> 31) * 2 + 1, exponent = hi >>> 20 & 2047, mantissa = 4294967296 * (hi & 1048575) + lo;
          return exponent === 2047 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 5e-324 * mantissa : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
        }
        exports2.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
        exports2.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);
      })();
      return exports2;
    }
    function writeUintLE(val, buf, pos) {
      buf[pos] = val & 255;
      buf[pos + 1] = val >>> 8 & 255;
      buf[pos + 2] = val >>> 16 & 255;
      buf[pos + 3] = val >>> 24;
    }
    function writeUintBE(val, buf, pos) {
      buf[pos] = val >>> 24;
      buf[pos + 1] = val >>> 16 & 255;
      buf[pos + 2] = val >>> 8 & 255;
      buf[pos + 3] = val & 255;
    }
    function readUintLE(buf, pos) {
      return (buf[pos] | buf[pos + 1] << 8 | buf[pos + 2] << 16 | buf[pos + 3] << 24) >>> 0;
    }
    function readUintBE(buf, pos) {
      return (buf[pos] << 24 | buf[pos + 1] << 16 | buf[pos + 2] << 8 | buf[pos + 3]) >>> 0;
    }
  }
});

// node_modules/@midnight-ntwrk/midnight-js-http-client-proof-provider/dist/index.mjs
var import_cross_fetch = __toESM(require_browser_ponyfill(), 1);
var import_fetch_retry = __toESM(require_fetch_retry_umd(), 1);

// node_modules/@dao-xyz/borsh/lib/esm/error.js
var BorshError = class extends Error {
  constructor(message) {
    super(message);
    this.fieldPath = [];
    this.originalMessage = message;
  }
  addToFieldPath(fieldName) {
    this.fieldPath.splice(0, 0, fieldName);
    this.message = this.originalMessage + ". Error originated at field path: " + this.fieldPath.join(".");
  }
};

// node_modules/@dao-xyz/borsh/lib/esm/bigint.js
function writeBufferLEBigInt(num, width, buffer, offset) {
  const hex = num.toString(16);
  const padded = hex.padStart(width * 2, "0").slice(0, width * 2);
  for (const [ix, value] of padded.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)).entries()) {
    buffer[offset + width - 1 - ix] = value;
  }
}
function writeUInt32LE(value, buf, offset) {
  checkInt(value, 0, 4294967295, 3);
  buf[offset] = value;
  buf[offset + 1] = value >>> 8;
  buf[offset + 2] = value >>> 16;
  buf[offset + 3] = value >>> 24;
}
function writeUInt16LE(value, buf, offset) {
  checkInt(value, 0, 65535, 1);
  buf[offset] = value;
  buf[offset + 1] = value >>> 8;
}
var writeBigUint64Le = (bigIntOrNumber, buf, offset) => {
  let lo, hi;
  if (typeof bigIntOrNumber === "bigint") {
    if (bigIntOrNumber <= Number.MAX_SAFE_INTEGER) {
      if (bigIntOrNumber < 0) {
        throw new Error("u64 value can not negative, got " + bigIntOrNumber);
      }
      bigIntOrNumber = Number(bigIntOrNumber);
      lo = bigIntOrNumber >>> 0;
      hi = (bigIntOrNumber - lo) / 4294967296;
    } else {
      if (bigIntOrNumber > 18446744073709551615n) {
        throw new Error("u64 value can exceed mav value got " + bigIntOrNumber);
      }
      lo = Number(bigIntOrNumber & 4294967295n);
      hi = Number(bigIntOrNumber >> 32n & 4294967295n);
    }
  } else {
    if (bigIntOrNumber < 0 || bigIntOrNumber > 18446744073709551615n) {
      throw new Error("u64 value can not negative, got " + bigIntOrNumber);
    }
    lo = bigIntOrNumber >>> 0;
    hi = (bigIntOrNumber - lo) / 4294967296;
  }
  buf[offset] = lo;
  buf[offset + 1] = lo >>> 8;
  buf[offset + 2] = lo >>> 16;
  buf[offset + 3] = lo >>> 24;
  buf[offset + 4] = hi;
  buf[offset + 5] = hi >>> 8;
  buf[offset + 6] = hi >>> 16;
  buf[offset + 7] = hi >>> 24;
};
var checkInt = (value, min, max, byteLength) => {
  if (value > max || value < min) {
    const n = typeof min === "bigint" ? "n" : "";
    let range;
    if (byteLength > 3) {
      if (min === 0 || min === 0n) {
        range = `>= 0${n} and < 2${n} ** ${(byteLength + 1) * 8}${n}`;
      } else {
        range = `>= -(2${n} ** ${(byteLength + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength + 1) * 8 - 1}${n}`;
      }
    } else {
      range = `>= ${min}${n} and <= ${max}${n}`;
    }
    throw new Error("Out of range value: " + range + ", " + value);
  }
};

// node_modules/@dao-xyz/borsh/lib/esm/binary.js
var import_utf8 = __toESM(require_utf8(), 1);
var import_float = __toESM(require_float(), 1);
var allocUnsafeFn = () => {
  if (globalThis.Buffer) {
    return globalThis.Buffer.allocUnsafe;
  }
  return (len) => new Uint8Array(len);
};
var allocUnsafe = allocUnsafeFn();
var writeStringBufferFnFn = () => {
  if (globalThis.Buffer) {
    return (length) => {
      if (length < 48)
        return import_utf8.default.write;
      return (string, buf, offset) => buf.write(string, offset);
    };
  }
  return () => import_utf8.default.write;
};
var writeStringBufferFn = writeStringBufferFnFn();
var stringLengthFn = () => {
  if (globalThis.Buffer) {
    return globalThis.Buffer.byteLength;
  }
  return import_utf8.default.length;
};
var BinaryWriter = class _BinaryWriter {
  constructor() {
    this.totalSize = 0;
    this._writes = () => this._buf = allocUnsafe(this.totalSize);
    this._writesTail = this._writes;
  }
  bool(value) {
    return _BinaryWriter.bool(value, this);
  }
  static bool(value, writer) {
    let offset = writer.totalSize;
    writer._writes = writer._writes.next = () => writer._buf[offset] = value ? 1 : 0;
    writer.totalSize += 1;
  }
  u8(value) {
    return _BinaryWriter.u8(value, this);
  }
  static u8(value, writer) {
    checkInt(value, 0, 255, 1);
    let offset = writer.totalSize;
    writer._writes = writer._writes.next = () => writer._buf[offset] = value;
    writer.totalSize += 1;
  }
  u16(value) {
    return _BinaryWriter.u16(value, this);
  }
  static u16(value, writer) {
    let offset = writer.totalSize;
    writer._writes = writer._writes.next = () => writeUInt16LE(value, writer._buf, offset);
    writer.totalSize += 2;
  }
  u32(value) {
    return _BinaryWriter.u32(value, this);
  }
  static u32(value, writer) {
    let offset = writer.totalSize;
    writer._writes = writer._writes.next = () => writeUInt32LE(value, writer._buf, offset);
    writer.totalSize += 4;
  }
  u64(value) {
    return _BinaryWriter.u64(value, this);
  }
  static u64(value, writer) {
    let offset = writer.totalSize;
    writer._writes = writer._writes.next = () => writeBigUint64Le(value, writer._buf, offset);
    writer.totalSize += 8;
  }
  u128(value) {
    return _BinaryWriter.u128(value, this);
  }
  static u128(value, writer) {
    let offset = writer.totalSize;
    writer._writes = writer._writes.next = () => writeBufferLEBigInt(value, 16, writer._buf, offset);
    writer.totalSize += 16;
  }
  u256(value) {
    return _BinaryWriter.u256(value, this);
  }
  static u256(value, writer) {
    let offset = writer.totalSize;
    writer._writes = writer._writes.next = () => writeBufferLEBigInt(value, 32, writer._buf, offset);
    writer.totalSize += 32;
  }
  u512(value) {
    return _BinaryWriter.u512(value, this);
  }
  static u512(value, writer) {
    let offset = writer.totalSize;
    writer._writes = writer._writes.next = () => writeBufferLEBigInt(value, 64, writer._buf, offset);
    writer.totalSize += 64;
  }
  f32(value) {
    return _BinaryWriter.f32(value, this);
  }
  static f32(value, writer) {
    if (Number.isNaN(value)) {
      throw new BorshError("NaN is not supported for f32");
    }
    let offset = writer.totalSize;
    writer._writes = writer._writes.next = () => (0, import_float.writeFloatLE)(value, writer._buf, offset);
    writer.totalSize += 4;
  }
  f64(value) {
    return _BinaryWriter.f64(value, this);
  }
  static f64(value, writer) {
    if (Number.isNaN(value)) {
      throw new BorshError("NaN is not supported for f64");
    }
    let offset = writer.totalSize;
    writer._writes = writer._writes.next = () => (0, import_float.writeDoubleLE)(value, writer._buf, offset);
    writer.totalSize += 8;
  }
  string(str) {
    return _BinaryWriter.string(str, this);
  }
  static string(str, writer) {
    const len = stringLengthFn()(str);
    let offset = writer.totalSize;
    writer._writes = writer._writes.next = () => {
      writeUInt32LE(len, writer._buf, offset);
      writeStringBufferFn(len)(str, writer._buf, offset + 4);
    };
    writer.totalSize += 4 + len;
  }
  static stringCustom(str, writer, lengthWriter = writeUInt32LE, lengthSize = 4) {
    const len = import_utf8.default.length(str);
    let offset = writer.totalSize;
    writer._writes = writer._writes.next = () => {
      lengthWriter(len, writer._buf, offset);
      writeStringBufferFn(len)(str, writer._buf, offset + lengthSize);
    };
    writer.totalSize += lengthSize + len;
  }
  set(array) {
    let offset = this.totalSize;
    this._writes = this._writes.next = () => {
      this._buf.set(array, offset);
    };
    this.totalSize += array.length;
  }
  uint8Array(array) {
    return _BinaryWriter.uint8Array(array, this);
  }
  static uint8Array(array, writer) {
    let offset = writer.totalSize;
    writer._writes = writer._writes.next = () => {
      writeUInt32LE(array.length, writer._buf, offset);
      writer._buf.set(array, offset + 4);
    };
    writer.totalSize += array.length + 4;
  }
  static uint8ArrayCustom(array, writer, lengthWriter = writeUInt32LE, lengthSize = 4) {
    let offset = writer.totalSize;
    writer._writes = writer._writes.next = () => {
      lengthWriter(array.length, writer._buf, offset);
      writer._buf.set(array, offset + lengthSize);
    };
    writer.totalSize += array.length + lengthSize;
  }
  static uint8ArrayFixed(array, writer) {
    let offset = writer.totalSize;
    writer._writes = writer._writes.next = () => {
      writer._buf.set(array, offset);
    };
    writer.totalSize += array.length;
  }
  static smallNumberEncoding(encoding) {
    if (encoding === "u8") {
      return [(value, buf, offset) => buf[offset] = value, 1];
    } else if (encoding === "u16") {
      return [writeUInt16LE, 2];
    } else if (encoding === "u32") {
      return [writeUInt32LE, 4];
    } else {
      throw new Error("Unsupported encoding: " + encoding);
    }
  }
  static write(encoding) {
    if (encoding === "u8") {
      return _BinaryWriter.u8;
    } else if (encoding === "u16") {
      return _BinaryWriter.u16;
    } else if (encoding === "u32") {
      return _BinaryWriter.u32;
    } else if (encoding === "u64") {
      return _BinaryWriter.u64;
    } else if (encoding === "u128") {
      return _BinaryWriter.u128;
    } else if (encoding === "u256") {
      return _BinaryWriter.u256;
    } else if (encoding === "u512") {
      return _BinaryWriter.u512;
    } else if (encoding === "bool") {
      return _BinaryWriter.bool;
    } else if (encoding === "f32") {
      return _BinaryWriter.f32;
    } else if (encoding === "f64") {
      return _BinaryWriter.f64;
    } else if (encoding === "string") {
      return _BinaryWriter.string;
    } else {
      throw new Error("Unsupported encoding: " + encoding);
    }
  }
  finalize() {
    let current = this._writesTail;
    while (current != null) {
      current();
      current = current.next;
    }
    return this._buf;
  }
};

// node_modules/@dao-xyz/borsh/lib/esm/index.js
var PROTOTYPE_POLLUTION_CONTEXT_RANGE = 500;
var PROTOTYPE_DESERIALIZATION_HANDLER_OFFSET = 500;
var PROTOTYPE_DEPENDENCY_HANDLER_OFFSET = PROTOTYPE_DESERIALIZATION_HANDLER_OFFSET + PROTOTYPE_POLLUTION_CONTEXT_RANGE;
var PROTOTYPE_SCHEMA_OFFSET = PROTOTYPE_DESERIALIZATION_HANDLER_OFFSET + PROTOTYPE_POLLUTION_CONTEXT_RANGE * 2;
var MAX_ARRAY_SIZE_ALLOCATION = 1024 * 1024;

// node_modules/@midnight-ntwrk/midnight-js-http-client-proof-provider/dist/index.mjs
var import_lodash = __toESM(require_lodash(), 1);
var retryOptions = {
  retries: 3,
  retryDelay: (attempt) => 2 ** attempt * 1e3,
  retryOn: [500, 503]
};
var fetchRetry = (0, import_fetch_retry.default)(import_cross_fetch.default, retryOptions);
var serializeZKConfig = (zkConfig) => {
  const binaryWriter = new BinaryWriter();
  if (zkConfig) {
    binaryWriter.u32(1);
    binaryWriter.string(zkConfig.circuitId);
    BinaryWriter.uint8ArrayFixed(zkConfig.proverKey, binaryWriter);
    BinaryWriter.uint8ArrayFixed(zkConfig.verifierKey, binaryWriter);
    BinaryWriter.uint8ArrayFixed(zkConfig.zkir, binaryWriter);
  } else {
    binaryWriter.u32(0);
  }
  return binaryWriter.finalize();
};
var serializePayload = (unprovenTx, zkConfig) => new Blob([unprovenTx.serialize(getLedgerNetworkId()), serializeZKConfig(zkConfig)]).arrayBuffer();
var deserializePayload = (arrayBuffer) => createUnbalancedTx(Transaction.deserialize(new Uint8Array(arrayBuffer), getLedgerNetworkId()));
var PROVE_TX_PATH = "/prove-tx";
var DEFAULT_CONFIG = {
  /**
   * The default timeout for prove requests.
   */
  timeout: 3e5,
  /**
   * The default ZK configuration to use. It is overwritten with a proper ZK
   * configuration only if a call transaction is being proven.
   */
  zkConfig: void 0
};
var httpClientProofProvider = (url) => {
  const urlObject = new URL(PROVE_TX_PATH, url);
  if (urlObject.protocol !== "http:" && urlObject.protocol !== "https:") {
    throw new InvalidProtocolSchemeError(urlObject.protocol, ["http:", "https:"]);
  }
  return {
    async proveTx(unprovenTx, partialProveTxConfig) {
      const config = import_lodash.default.defaults(partialProveTxConfig, DEFAULT_CONFIG);
      const response = await fetchRetry(urlObject, {
        method: "POST",
        body: await serializePayload(unprovenTx, config.zkConfig),
        signal: AbortSignal.timeout(config.timeout)
      });
      if (!response.ok) {
        throw new Error(`Failed Proof Server response: url="${response.url}", code="${response.status}", status="${response.statusText}""`);
      }
      return deserializePayload(await response.arrayBuffer());
    }
  };
};
export {
  DEFAULT_CONFIG,
  httpClientProofProvider,
  serializePayload,
  serializeZKConfig
};
//# sourceMappingURL=@midnight-ntwrk_midnight-js-http-client-proof-provider.js.map
