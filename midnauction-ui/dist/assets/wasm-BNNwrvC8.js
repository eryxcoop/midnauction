let __vite__initWasm, commonjsRequire, getAugmentedNamespace, commonjsGlobal, getDefaultExportFromCjs, midnight_onchain_runtime_wasm;
let __tla = (async ()=>{
    commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};
    getDefaultExportFromCjs = function(x) {
        return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    };
    getAugmentedNamespace = function(n) {
        if (Object.prototype.hasOwnProperty.call(n, '__esModule')) return n;
        var f = n.default;
        if (typeof f == "function") {
            var a = function a() {
                if (this instanceof a) {
                    return Reflect.construct(f, arguments, this.constructor);
                }
                return f.apply(this, arguments);
            };
            a.prototype = f.prototype;
        } else a = {};
        Object.defineProperty(a, '__esModule', {
            value: true
        });
        Object.keys(n).forEach(function(k) {
            var d = Object.getOwnPropertyDescriptor(n, k);
            Object.defineProperty(a, k, d.get ? d : {
                enumerable: true,
                get: function() {
                    return n[k];
                }
            });
        });
        return a;
    };
    __vite__initWasm = async (opts = {}, url)=>{
        let result;
        if (url.startsWith("data:")) {
            const urlContent = url.replace(/^data:.*?base64,/, "");
            let bytes;
            if (typeof Buffer === "function" && typeof Buffer.from === "function") {
                bytes = Buffer.from(urlContent, "base64");
            } else if (typeof atob === "function") {
                const binaryString = atob(urlContent);
                bytes = new Uint8Array(binaryString.length);
                for(let i = 0; i < binaryString.length; i++){
                    bytes[i] = binaryString.charCodeAt(i);
                }
            } else {
                throw new Error("Cannot decode base64-encoded data URL");
            }
            result = await WebAssembly.instantiate(bytes, opts);
        } else {
            const response = await fetch(url);
            const contentType = response.headers.get("Content-Type") || "";
            if ("instantiateStreaming" in WebAssembly && contentType.startsWith("application/wasm")) {
                result = await WebAssembly.instantiateStreaming(response, opts);
            } else {
                const buffer = await response.arrayBuffer();
                result = await WebAssembly.instantiate(buffer, opts);
            }
        }
        return result.instance.exports;
    };
    commonjsRequire = function(path) {
        throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
    };
    const __vite__wasmUrl = "/assets/midnight_onchain_runtime_wasm_bg-BvOAsiEe.wasm";
    let wasm$1;
    function __wbg_set_wasm(val) {
        wasm$1 = val;
    }
    function addToExternrefTable0(obj) {
        const idx = wasm$1.__externref_table_alloc();
        wasm$1.__wbindgen_export_2.set(idx, obj);
        return idx;
    }
    function handleError(f, args) {
        try {
            return f.apply(this, args);
        } catch (e) {
            const idx = addToExternrefTable0(e);
            wasm$1.__wbindgen_exn_store(idx);
        }
    }
    let WASM_VECTOR_LEN = 0;
    let cachedUint8ArrayMemory0 = null;
    function getUint8ArrayMemory0() {
        if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
            cachedUint8ArrayMemory0 = new Uint8Array(wasm$1.memory.buffer);
        }
        return cachedUint8ArrayMemory0;
    }
    const lTextEncoder = typeof TextEncoder === 'undefined' ? (commonjsRequire)('util').TextEncoder : TextEncoder;
    let cachedTextEncoder = new lTextEncoder('utf-8');
    const encodeString = (typeof cachedTextEncoder.encodeInto === 'function' ? function(arg, view) {
        return cachedTextEncoder.encodeInto(arg, view);
    } : function(arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    });
    function passStringToWasm0(arg, malloc, realloc) {
        if (realloc === undefined) {
            const buf = cachedTextEncoder.encode(arg);
            const ptr = malloc(buf.length, 1) >>> 0;
            getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
            WASM_VECTOR_LEN = buf.length;
            return ptr;
        }
        let len = arg.length;
        let ptr = malloc(len, 1) >>> 0;
        const mem = getUint8ArrayMemory0();
        let offset = 0;
        for(; offset < len; offset++){
            const code = arg.charCodeAt(offset);
            if (code > 0x7F) break;
            mem[ptr + offset] = code;
        }
        if (offset !== len) {
            if (offset !== 0) {
                arg = arg.slice(offset);
            }
            ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
            const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
            const ret = encodeString(arg, view);
            offset += ret.written;
            ptr = realloc(ptr, len, offset, 1) >>> 0;
        }
        WASM_VECTOR_LEN = offset;
        return ptr;
    }
    let cachedDataViewMemory0 = null;
    function getDataViewMemory0() {
        if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm$1.memory.buffer)) {
            cachedDataViewMemory0 = new DataView(wasm$1.memory.buffer);
        }
        return cachedDataViewMemory0;
    }
    function isLikeNone(x) {
        return x === undefined || x === null;
    }
    const lTextDecoder = typeof TextDecoder === 'undefined' ? (commonjsRequire)('util').TextDecoder : TextDecoder;
    let cachedTextDecoder = new lTextDecoder('utf-8', {
        ignoreBOM: true,
        fatal: true
    });
    cachedTextDecoder.decode();
    function getStringFromWasm0(ptr, len) {
        ptr = ptr >>> 0;
        return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
    }
    const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined') ? {
        register: ()=>{},
        unregister: ()=>{}
    } : new FinalizationRegistry((state)=>{
        wasm$1.__wbindgen_export_5.get(state.dtor)(state.a, state.b);
    });
    function makeMutClosure(arg0, arg1, dtor, f) {
        const state = {
            a: arg0,
            b: arg1,
            cnt: 1,
            dtor
        };
        const real = (...args)=>{
            state.cnt++;
            const a = state.a;
            state.a = 0;
            try {
                return f(a, state.b, ...args);
            } finally{
                if (--state.cnt === 0) {
                    wasm$1.__wbindgen_export_5.get(state.dtor)(a, state.b);
                    CLOSURE_DTORS.unregister(state);
                } else {
                    state.a = a;
                }
            }
        };
        real.original = state;
        CLOSURE_DTORS.register(real, state, state);
        return real;
    }
    function debugString(val) {
        const type = typeof val;
        if (type == 'number' || type == 'boolean' || val == null) {
            return `${val}`;
        }
        if (type == 'string') {
            return `"${val}"`;
        }
        if (type == 'symbol') {
            const description = val.description;
            if (description == null) {
                return 'Symbol';
            } else {
                return `Symbol(${description})`;
            }
        }
        if (type == 'function') {
            const name = val.name;
            if (typeof name == 'string' && name.length > 0) {
                return `Function(${name})`;
            } else {
                return 'Function';
            }
        }
        if (Array.isArray(val)) {
            const length = val.length;
            let debug = '[';
            if (length > 0) {
                debug += debugString(val[0]);
            }
            for(let i = 1; i < length; i++){
                debug += ', ' + debugString(val[i]);
            }
            debug += ']';
            return debug;
        }
        const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
        let className;
        if (builtInMatches && builtInMatches.length > 1) {
            className = builtInMatches[1];
        } else {
            return toString.call(val);
        }
        if (className == 'Object') {
            try {
                return 'Object(' + JSON.stringify(val) + ')';
            } catch (_) {
                return 'Object';
            }
        }
        if (val instanceof Error) {
            return `${val.name}: ${val.message}\n${val.stack}`;
        }
        return className;
    }
    function takeFromExternrefTable0(idx) {
        const value = wasm$1.__wbindgen_export_2.get(idx);
        wasm$1.__externref_table_dealloc(idx);
        return value;
    }
    function _assertClass(instance, klass) {
        if (!(instance instanceof klass)) {
            throw new Error(`expected instance of ${klass.name}`);
        }
    }
    function encodeCoinInfo$1(coin) {
        const ret = wasm$1.encodeCoinInfo(coin);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    function encodeQualifiedCoinInfo$1(coin) {
        const ret = wasm$1.encodeQualifiedCoinInfo(coin);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    function decodeCoinInfo$1(coin) {
        const ret = wasm$1.decodeCoinInfo(coin);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    function decodeQualifiedCoinInfo$1(coin) {
        const ret = wasm$1.decodeQualifiedCoinInfo(coin);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    function encodeTokenType$1(tt) {
        const ptr0 = passStringToWasm0(tt, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm$1.encodeTokenType(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    function decodeTokenType$1(tt) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm$1.decodeTokenType(tt);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0;
                len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally{
            wasm$1.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    function encodeContractAddress$1(addr) {
        const ptr0 = passStringToWasm0(addr, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm$1.encodeContractAddress(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    function decodeContractAddress$1(addr) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm$1.decodeContractAddress(addr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0;
                len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally{
            wasm$1.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    function encodeCoinPublicKey$1(pk) {
        const ptr0 = passStringToWasm0(pk, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm$1.encodeCoinPublicKey(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    function decodeCoinPublicKey$1(pk) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm$1.decodeCoinPublicKey(pk);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0;
                len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally{
            wasm$1.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    function entryPointHash$1(entry_point) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm$1.entryPointHash(entry_point);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0;
                len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally{
            wasm$1.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    function communicationCommitmentRandomness$1() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm$1.communicationCommitmentRandomness();
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0;
                len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally{
            wasm$1.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    function communicationCommitment$1(input, output, rand) {
        let deferred3_0;
        let deferred3_1;
        try {
            const ptr0 = passStringToWasm0(rand, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm$1.communicationCommitment(input, output, ptr0, len0);
            var ptr2 = ret[0];
            var len2 = ret[1];
            if (ret[3]) {
                ptr2 = 0;
                len2 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally{
            wasm$1.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    function sampleSigningKey$1() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm$1.sampleSigningKey();
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0;
                len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally{
            wasm$1.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    function signData$1(key, data) {
        let deferred3_0;
        let deferred3_1;
        try {
            const ptr0 = passStringToWasm0(key, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm$1.signData(ptr0, len0, data);
            var ptr2 = ret[0];
            var len2 = ret[1];
            if (ret[3]) {
                ptr2 = 0;
                len2 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally{
            wasm$1.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    function signatureVerifyingKey$1(key) {
        let deferred3_0;
        let deferred3_1;
        try {
            const ptr0 = passStringToWasm0(key, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm$1.signatureVerifyingKey(ptr0, len0);
            var ptr2 = ret[0];
            var len2 = ret[1];
            if (ret[3]) {
                ptr2 = 0;
                len2 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally{
            wasm$1.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    function verifySignature$1(key, data, signature) {
        const ptr0 = passStringToWasm0(key, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(signature, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm$1.verifySignature(ptr0, len0, data, ptr1, len1);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] !== 0;
    }
    function tokenType$1(domain_sep, contract) {
        let deferred3_0;
        let deferred3_1;
        try {
            const ptr0 = passStringToWasm0(contract, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm$1.tokenType(domain_sep, ptr0, len0);
            var ptr2 = ret[0];
            var len2 = ret[1];
            if (ret[3]) {
                ptr2 = 0;
                len2 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally{
            wasm$1.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    function sampleContractAddress$1() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm$1.sampleContractAddress();
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0;
                len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally{
            wasm$1.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    function sampleTokenType$1() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm$1.sampleTokenType();
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0;
                len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally{
            wasm$1.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    function dummyContractAddress$1() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm$1.dummyContractAddress();
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0;
                len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally{
            wasm$1.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    function coinCommitment$1(coin, recipient) {
        const ret = wasm$1.coinCommitment(coin, recipient);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    function leafHash$1(value) {
        const ret = wasm$1.leafHash(value);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    function maxAlignedSize$1(alignment) {
        const ret = wasm$1.maxAlignedSize(alignment);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return BigInt.asUintN(64, ret[0]);
    }
    function maxField$1() {
        const ret = wasm$1.maxField();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    function checkProofData$1(zkir, input, output, public_transcript, private_transcript_outputs) {
        const ptr0 = passStringToWasm0(zkir, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm$1.checkProofData(ptr0, len0, input, output, public_transcript, private_transcript_outputs);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    function bigIntModFr$1(x) {
        const ret = wasm$1.bigIntModFr(x);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    function valueToBigInt$1(x) {
        const ret = wasm$1.valueToBigInt(x);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    function bigIntToValue$1(x) {
        const ret = wasm$1.bigIntToValue(x);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    function transientHash$1(align, val) {
        const ret = wasm$1.transientHash(align, val);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    function transientCommit$1(align, val, opening) {
        const ret = wasm$1.transientCommit(align, val, opening);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    function persistentHash$1(align, val) {
        const ret = wasm$1.persistentHash(align, val);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    function persistentCommit$1(align, val, opening) {
        const ret = wasm$1.persistentCommit(align, val, opening);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    function degradeToTransient$1(persistent) {
        const ret = wasm$1.degradeToTransient(persistent);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    function upgradeFromTransient$1(transient) {
        const ret = wasm$1.upgradeFromTransient(transient);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    function hashToCurve$1(align, val) {
        const ret = wasm$1.hashToCurve(align, val);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    function ecAdd$1(a, b) {
        const ret = wasm$1.ecAdd(a, b);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    function ecMul$1(a, b) {
        const ret = wasm$1.ecMul(a, b);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    function ecMulGenerator$1(val) {
        const ret = wasm$1.ecMulGenerator(val);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    function getArrayJsValueFromWasm0(ptr, len) {
        ptr = ptr >>> 0;
        const mem = getDataViewMemory0();
        const result = [];
        for(let i = ptr; i < ptr + 4 * len; i += 4){
            result.push(wasm$1.__wbindgen_export_2.get(mem.getUint32(i, true)));
        }
        wasm$1.__externref_drop_slice(ptr, len);
        return result;
    }
    function runProgram$1(initial, ops, cost_model, gas_limit) {
        _assertClass(initial, VmStack);
        _assertClass(cost_model, CostModel);
        const ret = wasm$1.runProgram(initial.__wbg_ptr, ops, cost_model.__wbg_ptr, !isLikeNone(gas_limit), isLikeNone(gas_limit) ? BigInt(0) : gas_limit);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return VmResults.__wrap(ret[0]);
    }
    function __wbg_adapter_54(arg0, arg1, arg2) {
        wasm$1.closure512_externref_shim(arg0, arg1, arg2);
    }
    function __wbg_adapter_286(arg0, arg1, arg2, arg3) {
        wasm$1.closure553_externref_shim(arg0, arg1, arg2, arg3);
    }
    const NetworkId = Object.freeze({
        Undeployed: 0,
        "0": "Undeployed",
        DevNet: 1,
        "1": "DevNet",
        TestNet: 2,
        "2": "TestNet",
        MainNet: 3,
        "3": "MainNet"
    });
    const __wbindgen_enum_ReadableStreamType = [
        "bytes"
    ];
    const ContractMaintenanceAuthorityFinalization = (typeof FinalizationRegistry === 'undefined') ? {
        register: ()=>{},
        unregister: ()=>{}
    } : new FinalizationRegistry((ptr)=>wasm$1.__wbg_contractmaintenanceauthority_free(ptr >>> 0, 1));
    class ContractMaintenanceAuthority {
        static __wrap(ptr) {
            ptr = ptr >>> 0;
            const obj = Object.create(ContractMaintenanceAuthority.prototype);
            obj.__wbg_ptr = ptr;
            ContractMaintenanceAuthorityFinalization.register(obj, obj.__wbg_ptr, obj);
            return obj;
        }
        __destroy_into_raw() {
            const ptr = this.__wbg_ptr;
            this.__wbg_ptr = 0;
            ContractMaintenanceAuthorityFinalization.unregister(this);
            return ptr;
        }
        free() {
            const ptr = this.__destroy_into_raw();
            wasm$1.__wbg_contractmaintenanceauthority_free(ptr, 0);
        }
        constructor(committee, threshold, counter){
            const ret = wasm$1.contractmaintenanceauthority_new(committee, threshold, isLikeNone(counter) ? 0 : addToExternrefTable0(counter));
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            this.__wbg_ptr = ret[0] >>> 0;
            ContractMaintenanceAuthorityFinalization.register(this, this.__wbg_ptr, this);
            return this;
        }
        get committee() {
            const ret = wasm$1.contractmaintenanceauthority_committee(this.__wbg_ptr);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return takeFromExternrefTable0(ret[0]);
        }
        get threshold() {
            const ret = wasm$1.contractmaintenanceauthority_threshold(this.__wbg_ptr);
            return ret >>> 0;
        }
        get counter() {
            const ret = wasm$1.contractmaintenanceauthority_counter(this.__wbg_ptr);
            return ret;
        }
        serialize(netid) {
            const ret = wasm$1.contractmaintenanceauthority_serialize(this.__wbg_ptr, netid);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return takeFromExternrefTable0(ret[0]);
        }
        static deserialize(raw, netid) {
            const ret = wasm$1.contractmaintenanceauthority_deserialize(raw, netid);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return ContractMaintenanceAuthority.__wrap(ret[0]);
        }
        toString(compact) {
            let deferred1_0;
            let deferred1_1;
            try {
                const ret = wasm$1.contractmaintenanceauthority_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
                deferred1_0 = ret[0];
                deferred1_1 = ret[1];
                return getStringFromWasm0(ret[0], ret[1]);
            } finally{
                wasm$1.__wbindgen_free(deferred1_0, deferred1_1, 1);
            }
        }
    }
    const ContractOperationFinalization = (typeof FinalizationRegistry === 'undefined') ? {
        register: ()=>{},
        unregister: ()=>{}
    } : new FinalizationRegistry((ptr)=>wasm$1.__wbg_contractoperation_free(ptr >>> 0, 1));
    class ContractOperation {
        static __wrap(ptr) {
            ptr = ptr >>> 0;
            const obj = Object.create(ContractOperation.prototype);
            obj.__wbg_ptr = ptr;
            ContractOperationFinalization.register(obj, obj.__wbg_ptr, obj);
            return obj;
        }
        __destroy_into_raw() {
            const ptr = this.__wbg_ptr;
            this.__wbg_ptr = 0;
            ContractOperationFinalization.unregister(this);
            return ptr;
        }
        free() {
            const ptr = this.__destroy_into_raw();
            wasm$1.__wbg_contractoperation_free(ptr, 0);
        }
        constructor(){
            const ret = wasm$1.contractoperation_new();
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            this.__wbg_ptr = ret[0] >>> 0;
            ContractOperationFinalization.register(this, this.__wbg_ptr, this);
            return this;
        }
        get verifierKey() {
            const ret = wasm$1.contractoperation_verifier_key(this.__wbg_ptr);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return takeFromExternrefTable0(ret[0]);
        }
        set verifierKey(key) {
            const ret = wasm$1.contractoperation_set_verifier_key(this.__wbg_ptr, key);
            if (ret[1]) {
                throw takeFromExternrefTable0(ret[0]);
            }
        }
        serialize(netid) {
            const ret = wasm$1.contractoperation_serialize(this.__wbg_ptr, netid);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return takeFromExternrefTable0(ret[0]);
        }
        static deserialize(raw, netid) {
            const ret = wasm$1.contractoperation_deserialize(raw, netid);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return ContractOperation.__wrap(ret[0]);
        }
        toString(compact) {
            let deferred1_0;
            let deferred1_1;
            try {
                const ret = wasm$1.contractoperation_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
                deferred1_0 = ret[0];
                deferred1_1 = ret[1];
                return getStringFromWasm0(ret[0], ret[1]);
            } finally{
                wasm$1.__wbindgen_free(deferred1_0, deferred1_1, 1);
            }
        }
    }
    const ContractStateFinalization = (typeof FinalizationRegistry === 'undefined') ? {
        register: ()=>{},
        unregister: ()=>{}
    } : new FinalizationRegistry((ptr)=>wasm$1.__wbg_contractstate_free(ptr >>> 0, 1));
    class ContractState {
        static __wrap(ptr) {
            ptr = ptr >>> 0;
            const obj = Object.create(ContractState.prototype);
            obj.__wbg_ptr = ptr;
            ContractStateFinalization.register(obj, obj.__wbg_ptr, obj);
            return obj;
        }
        __destroy_into_raw() {
            const ptr = this.__wbg_ptr;
            this.__wbg_ptr = 0;
            ContractStateFinalization.unregister(this);
            return ptr;
        }
        free() {
            const ptr = this.__destroy_into_raw();
            wasm$1.__wbg_contractstate_free(ptr, 0);
        }
        constructor(){
            const ret = wasm$1.contractstate_new();
            this.__wbg_ptr = ret >>> 0;
            ContractStateFinalization.register(this, this.__wbg_ptr, this);
            return this;
        }
        get data() {
            const ret = wasm$1.contractstate_data(this.__wbg_ptr);
            return StateValue.__wrap(ret);
        }
        set data(data) {
            _assertClass(data, StateValue);
            wasm$1.contractstate_set_data(this.__wbg_ptr, data.__wbg_ptr);
        }
        get maintenanceAuthority() {
            const ret = wasm$1.contractstate_maintenance_authority(this.__wbg_ptr);
            return ContractMaintenanceAuthority.__wrap(ret);
        }
        set maintenanceAuthority(authority) {
            _assertClass(authority, ContractMaintenanceAuthority);
            wasm$1.contractstate_set_maintenance_authority(this.__wbg_ptr, authority.__wbg_ptr);
        }
        operations() {
            const ret = wasm$1.contractstate_operations(this.__wbg_ptr);
            var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
            wasm$1.__wbindgen_free(ret[0], ret[1] * 4, 4);
            return v1;
        }
        operation(operation) {
            const ret = wasm$1.contractstate_operation(this.__wbg_ptr, operation);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return ret[0] === 0 ? undefined : ContractOperation.__wrap(ret[0]);
        }
        setOperation(operation, value) {
            _assertClass(value, ContractOperation);
            const ret = wasm$1.contractstate_setOperation(this.__wbg_ptr, operation, value.__wbg_ptr);
            if (ret[1]) {
                throw takeFromExternrefTable0(ret[0]);
            }
        }
        query(query, cost_model) {
            _assertClass(cost_model, CostModel);
            const ret = wasm$1.contractstate_query(this.__wbg_ptr, query, cost_model.__wbg_ptr);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return takeFromExternrefTable0(ret[0]);
        }
        serialize(netid) {
            const ret = wasm$1.contractstate_serialize(this.__wbg_ptr, netid);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return takeFromExternrefTable0(ret[0]);
        }
        static deserialize(raw, netid) {
            const ret = wasm$1.contractstate_deserialize(raw, netid);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return ContractState.__wrap(ret[0]);
        }
        toString(compact) {
            let deferred1_0;
            let deferred1_1;
            try {
                const ret = wasm$1.contractstate_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
                deferred1_0 = ret[0];
                deferred1_1 = ret[1];
                return getStringFromWasm0(ret[0], ret[1]);
            } finally{
                wasm$1.__wbindgen_free(deferred1_0, deferred1_1, 1);
            }
        }
    }
    const CostModelFinalization = (typeof FinalizationRegistry === 'undefined') ? {
        register: ()=>{},
        unregister: ()=>{}
    } : new FinalizationRegistry((ptr)=>wasm$1.__wbg_costmodel_free(ptr >>> 0, 1));
    class CostModel {
        static __wrap(ptr) {
            ptr = ptr >>> 0;
            const obj = Object.create(CostModel.prototype);
            obj.__wbg_ptr = ptr;
            CostModelFinalization.register(obj, obj.__wbg_ptr, obj);
            return obj;
        }
        __destroy_into_raw() {
            const ptr = this.__wbg_ptr;
            this.__wbg_ptr = 0;
            CostModelFinalization.unregister(this);
            return ptr;
        }
        free() {
            const ptr = this.__destroy_into_raw();
            wasm$1.__wbg_costmodel_free(ptr, 0);
        }
        constructor(){
            const ret = wasm$1.costmodel_new();
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            this.__wbg_ptr = ret[0] >>> 0;
            CostModelFinalization.register(this, this.__wbg_ptr, this);
            return this;
        }
        static dummyCostModel() {
            const ret = wasm$1.costmodel_dummyCostModel();
            return CostModel.__wrap(ret);
        }
        toString(compact) {
            let deferred1_0;
            let deferred1_1;
            try {
                const ret = wasm$1.costmodel_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
                deferred1_0 = ret[0];
                deferred1_1 = ret[1];
                return getStringFromWasm0(ret[0], ret[1]);
            } finally{
                wasm$1.__wbindgen_free(deferred1_0, deferred1_1, 1);
            }
        }
    }
    const IntoUnderlyingByteSourceFinalization = (typeof FinalizationRegistry === 'undefined') ? {
        register: ()=>{},
        unregister: ()=>{}
    } : new FinalizationRegistry((ptr)=>wasm$1.__wbg_intounderlyingbytesource_free(ptr >>> 0, 1));
    class IntoUnderlyingByteSource {
        __destroy_into_raw() {
            const ptr = this.__wbg_ptr;
            this.__wbg_ptr = 0;
            IntoUnderlyingByteSourceFinalization.unregister(this);
            return ptr;
        }
        free() {
            const ptr = this.__destroy_into_raw();
            wasm$1.__wbg_intounderlyingbytesource_free(ptr, 0);
        }
        get type() {
            const ret = wasm$1.intounderlyingbytesource_type(this.__wbg_ptr);
            return __wbindgen_enum_ReadableStreamType[ret];
        }
        get autoAllocateChunkSize() {
            const ret = wasm$1.intounderlyingbytesource_autoAllocateChunkSize(this.__wbg_ptr);
            return ret >>> 0;
        }
        start(controller) {
            wasm$1.intounderlyingbytesource_start(this.__wbg_ptr, controller);
        }
        pull(controller) {
            const ret = wasm$1.intounderlyingbytesource_pull(this.__wbg_ptr, controller);
            return ret;
        }
        cancel() {
            const ptr = this.__destroy_into_raw();
            wasm$1.intounderlyingbytesource_cancel(ptr);
        }
    }
    const IntoUnderlyingSinkFinalization = (typeof FinalizationRegistry === 'undefined') ? {
        register: ()=>{},
        unregister: ()=>{}
    } : new FinalizationRegistry((ptr)=>wasm$1.__wbg_intounderlyingsink_free(ptr >>> 0, 1));
    class IntoUnderlyingSink {
        __destroy_into_raw() {
            const ptr = this.__wbg_ptr;
            this.__wbg_ptr = 0;
            IntoUnderlyingSinkFinalization.unregister(this);
            return ptr;
        }
        free() {
            const ptr = this.__destroy_into_raw();
            wasm$1.__wbg_intounderlyingsink_free(ptr, 0);
        }
        write(chunk) {
            const ret = wasm$1.intounderlyingsink_write(this.__wbg_ptr, chunk);
            return ret;
        }
        close() {
            const ptr = this.__destroy_into_raw();
            const ret = wasm$1.intounderlyingsink_close(ptr);
            return ret;
        }
        abort(reason) {
            const ptr = this.__destroy_into_raw();
            const ret = wasm$1.intounderlyingsink_abort(ptr, reason);
            return ret;
        }
    }
    const IntoUnderlyingSourceFinalization = (typeof FinalizationRegistry === 'undefined') ? {
        register: ()=>{},
        unregister: ()=>{}
    } : new FinalizationRegistry((ptr)=>wasm$1.__wbg_intounderlyingsource_free(ptr >>> 0, 1));
    class IntoUnderlyingSource {
        __destroy_into_raw() {
            const ptr = this.__wbg_ptr;
            this.__wbg_ptr = 0;
            IntoUnderlyingSourceFinalization.unregister(this);
            return ptr;
        }
        free() {
            const ptr = this.__destroy_into_raw();
            wasm$1.__wbg_intounderlyingsource_free(ptr, 0);
        }
        pull(controller) {
            const ret = wasm$1.intounderlyingsource_pull(this.__wbg_ptr, controller);
            return ret;
        }
        cancel() {
            const ptr = this.__destroy_into_raw();
            wasm$1.intounderlyingsource_cancel(ptr);
        }
    }
    const QueryContextFinalization = (typeof FinalizationRegistry === 'undefined') ? {
        register: ()=>{},
        unregister: ()=>{}
    } : new FinalizationRegistry((ptr)=>wasm$1.__wbg_querycontext_free(ptr >>> 0, 1));
    class QueryContext {
        static __wrap(ptr) {
            ptr = ptr >>> 0;
            const obj = Object.create(QueryContext.prototype);
            obj.__wbg_ptr = ptr;
            QueryContextFinalization.register(obj, obj.__wbg_ptr, obj);
            return obj;
        }
        __destroy_into_raw() {
            const ptr = this.__wbg_ptr;
            this.__wbg_ptr = 0;
            QueryContextFinalization.unregister(this);
            return ptr;
        }
        free() {
            const ptr = this.__destroy_into_raw();
            wasm$1.__wbg_querycontext_free(ptr, 0);
        }
        constructor(state, address){
            _assertClass(state, StateValue);
            const ptr0 = passStringToWasm0(address, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm$1.querycontext_new(state.__wbg_ptr, ptr0, len0);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            this.__wbg_ptr = ret[0] >>> 0;
            QueryContextFinalization.register(this, this.__wbg_ptr, this);
            return this;
        }
        get state() {
            const ret = wasm$1.querycontext_state(this.__wbg_ptr);
            return StateValue.__wrap(ret);
        }
        get address() {
            let deferred2_0;
            let deferred2_1;
            try {
                const ret = wasm$1.querycontext_address(this.__wbg_ptr);
                var ptr1 = ret[0];
                var len1 = ret[1];
                if (ret[3]) {
                    ptr1 = 0;
                    len1 = 0;
                    throw takeFromExternrefTable0(ret[2]);
                }
                deferred2_0 = ptr1;
                deferred2_1 = len1;
                return getStringFromWasm0(ptr1, len1);
            } finally{
                wasm$1.__wbindgen_free(deferred2_0, deferred2_1, 1);
            }
        }
        get effects() {
            const ret = wasm$1.querycontext_effects(this.__wbg_ptr);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return takeFromExternrefTable0(ret[0]);
        }
        set effects(effects) {
            const ret = wasm$1.querycontext_set_effects(this.__wbg_ptr, effects);
            if (ret[1]) {
                throw takeFromExternrefTable0(ret[0]);
            }
        }
        get block() {
            const ret = wasm$1.querycontext_block(this.__wbg_ptr);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return takeFromExternrefTable0(ret[0]);
        }
        set block(block) {
            const ret = wasm$1.querycontext_set_block(this.__wbg_ptr, block);
            if (ret[1]) {
                throw takeFromExternrefTable0(ret[0]);
            }
        }
        get comIndicies() {
            const ret = wasm$1.querycontext_com_indicies(this.__wbg_ptr);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return takeFromExternrefTable0(ret[0]);
        }
        insertCommitment(comm, index) {
            const ptr0 = passStringToWasm0(comm, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm$1.querycontext_insertCommitment(this.__wbg_ptr, ptr0, len0, index);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return QueryContext.__wrap(ret[0]);
        }
        qualify(coin) {
            const ret = wasm$1.querycontext_qualify(this.__wbg_ptr, coin);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return takeFromExternrefTable0(ret[0]);
        }
        runTranscript(transcript, cost_model) {
            _assertClass(cost_model, CostModel);
            const ret = wasm$1.querycontext_runTranscript(this.__wbg_ptr, transcript, cost_model.__wbg_ptr);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return QueryContext.__wrap(ret[0]);
        }
        query(ops, cost_model, gas_limit) {
            _assertClass(cost_model, CostModel);
            const ret = wasm$1.querycontext_query(this.__wbg_ptr, ops, cost_model.__wbg_ptr, !isLikeNone(gas_limit), isLikeNone(gas_limit) ? BigInt(0) : gas_limit);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return QueryResults.__wrap(ret[0]);
        }
        intoTranscript(program, cost_model) {
            _assertClass(cost_model, CostModel);
            const ret = wasm$1.querycontext_intoTranscript(this.__wbg_ptr, program, cost_model.__wbg_ptr);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return takeFromExternrefTable0(ret[0]);
        }
        toString(compact) {
            let deferred1_0;
            let deferred1_1;
            try {
                const ret = wasm$1.querycontext_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
                deferred1_0 = ret[0];
                deferred1_1 = ret[1];
                return getStringFromWasm0(ret[0], ret[1]);
            } finally{
                wasm$1.__wbindgen_free(deferred1_0, deferred1_1, 1);
            }
        }
    }
    const QueryResultsFinalization = (typeof FinalizationRegistry === 'undefined') ? {
        register: ()=>{},
        unregister: ()=>{}
    } : new FinalizationRegistry((ptr)=>wasm$1.__wbg_queryresults_free(ptr >>> 0, 1));
    class QueryResults {
        static __wrap(ptr) {
            ptr = ptr >>> 0;
            const obj = Object.create(QueryResults.prototype);
            obj.__wbg_ptr = ptr;
            QueryResultsFinalization.register(obj, obj.__wbg_ptr, obj);
            return obj;
        }
        __destroy_into_raw() {
            const ptr = this.__wbg_ptr;
            this.__wbg_ptr = 0;
            QueryResultsFinalization.unregister(this);
            return ptr;
        }
        free() {
            const ptr = this.__destroy_into_raw();
            wasm$1.__wbg_queryresults_free(ptr, 0);
        }
        constructor(){
            const ret = wasm$1.queryresults_new();
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            this.__wbg_ptr = ret[0] >>> 0;
            QueryResultsFinalization.register(this, this.__wbg_ptr, this);
            return this;
        }
        get context() {
            const ret = wasm$1.queryresults_context(this.__wbg_ptr);
            return QueryContext.__wrap(ret);
        }
        get events() {
            const ret = wasm$1.queryresults_events(this.__wbg_ptr);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return takeFromExternrefTable0(ret[0]);
        }
        get gasCost() {
            const ret = wasm$1.queryresults_gas_cost(this.__wbg_ptr);
            return BigInt.asUintN(64, ret);
        }
        toString(compact) {
            let deferred1_0;
            let deferred1_1;
            try {
                const ret = wasm$1.queryresults_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
                deferred1_0 = ret[0];
                deferred1_1 = ret[1];
                return getStringFromWasm0(ret[0], ret[1]);
            } finally{
                wasm$1.__wbindgen_free(deferred1_0, deferred1_1, 1);
            }
        }
    }
    const StateBoundedMerkleTreeFinalization = (typeof FinalizationRegistry === 'undefined') ? {
        register: ()=>{},
        unregister: ()=>{}
    } : new FinalizationRegistry((ptr)=>wasm$1.__wbg_stateboundedmerkletree_free(ptr >>> 0, 1));
    class StateBoundedMerkleTree {
        static __wrap(ptr) {
            ptr = ptr >>> 0;
            const obj = Object.create(StateBoundedMerkleTree.prototype);
            obj.__wbg_ptr = ptr;
            StateBoundedMerkleTreeFinalization.register(obj, obj.__wbg_ptr, obj);
            return obj;
        }
        __destroy_into_raw() {
            const ptr = this.__wbg_ptr;
            this.__wbg_ptr = 0;
            StateBoundedMerkleTreeFinalization.unregister(this);
            return ptr;
        }
        free() {
            const ptr = this.__destroy_into_raw();
            wasm$1.__wbg_stateboundedmerkletree_free(ptr, 0);
        }
        constructor(height){
            const ret = wasm$1.stateboundedmerkletree_blank(height);
            this.__wbg_ptr = ret >>> 0;
            StateBoundedMerkleTreeFinalization.register(this, this.__wbg_ptr, this);
            return this;
        }
        get height() {
            const ret = wasm$1.stateboundedmerkletree_height(this.__wbg_ptr);
            return ret;
        }
        root() {
            const ret = wasm$1.stateboundedmerkletree_root(this.__wbg_ptr);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return takeFromExternrefTable0(ret[0]);
        }
        findPathForLeaf(leaf) {
            const ret = wasm$1.stateboundedmerkletree_findPathForLeaf(this.__wbg_ptr, leaf);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return takeFromExternrefTable0(ret[0]);
        }
        pathForLeaf(index, leaf) {
            const ret = wasm$1.stateboundedmerkletree_pathForLeaf(this.__wbg_ptr, index, leaf);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return takeFromExternrefTable0(ret[0]);
        }
        update(index, leaf) {
            const ret = wasm$1.stateboundedmerkletree_update(this.__wbg_ptr, index, leaf);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return StateBoundedMerkleTree.__wrap(ret[0]);
        }
        collapse(start, end) {
            const ret = wasm$1.stateboundedmerkletree_collapse(this.__wbg_ptr, start, end);
            return StateBoundedMerkleTree.__wrap(ret);
        }
        toString(compact) {
            let deferred1_0;
            let deferred1_1;
            try {
                const ret = wasm$1.stateboundedmerkletree_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
                deferred1_0 = ret[0];
                deferred1_1 = ret[1];
                return getStringFromWasm0(ret[0], ret[1]);
            } finally{
                wasm$1.__wbindgen_free(deferred1_0, deferred1_1, 1);
            }
        }
    }
    const StateMapFinalization = (typeof FinalizationRegistry === 'undefined') ? {
        register: ()=>{},
        unregister: ()=>{}
    } : new FinalizationRegistry((ptr)=>wasm$1.__wbg_statemap_free(ptr >>> 0, 1));
    class StateMap {
        static __wrap(ptr) {
            ptr = ptr >>> 0;
            const obj = Object.create(StateMap.prototype);
            obj.__wbg_ptr = ptr;
            StateMapFinalization.register(obj, obj.__wbg_ptr, obj);
            return obj;
        }
        __destroy_into_raw() {
            const ptr = this.__wbg_ptr;
            this.__wbg_ptr = 0;
            StateMapFinalization.unregister(this);
            return ptr;
        }
        free() {
            const ptr = this.__destroy_into_raw();
            wasm$1.__wbg_statemap_free(ptr, 0);
        }
        constructor(){
            const ret = wasm$1.statemap_new();
            this.__wbg_ptr = ret >>> 0;
            StateMapFinalization.register(this, this.__wbg_ptr, this);
            return this;
        }
        keys() {
            const ret = wasm$1.statemap_keys(this.__wbg_ptr);
            if (ret[3]) {
                throw takeFromExternrefTable0(ret[2]);
            }
            var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
            wasm$1.__wbindgen_free(ret[0], ret[1] * 4, 4);
            return v1;
        }
        get(key) {
            const ret = wasm$1.statemap_get(this.__wbg_ptr, key);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return ret[0] === 0 ? undefined : StateValue.__wrap(ret[0]);
        }
        insert(key, value) {
            _assertClass(value, StateValue);
            const ret = wasm$1.statemap_insert(this.__wbg_ptr, key, value.__wbg_ptr);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return StateMap.__wrap(ret[0]);
        }
        remove(key) {
            const ret = wasm$1.statemap_remove(this.__wbg_ptr, key);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return StateMap.__wrap(ret[0]);
        }
        toString(compact) {
            let deferred1_0;
            let deferred1_1;
            try {
                const ret = wasm$1.statemap_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
                deferred1_0 = ret[0];
                deferred1_1 = ret[1];
                return getStringFromWasm0(ret[0], ret[1]);
            } finally{
                wasm$1.__wbindgen_free(deferred1_0, deferred1_1, 1);
            }
        }
    }
    const StateValueFinalization = (typeof FinalizationRegistry === 'undefined') ? {
        register: ()=>{},
        unregister: ()=>{}
    } : new FinalizationRegistry((ptr)=>wasm$1.__wbg_statevalue_free(ptr >>> 0, 1));
    class StateValue {
        static __wrap(ptr) {
            ptr = ptr >>> 0;
            const obj = Object.create(StateValue.prototype);
            obj.__wbg_ptr = ptr;
            StateValueFinalization.register(obj, obj.__wbg_ptr, obj);
            return obj;
        }
        __destroy_into_raw() {
            const ptr = this.__wbg_ptr;
            this.__wbg_ptr = 0;
            StateValueFinalization.unregister(this);
            return ptr;
        }
        free() {
            const ptr = this.__destroy_into_raw();
            wasm$1.__wbg_statevalue_free(ptr, 0);
        }
        constructor(){
            const ret = wasm$1.statevalue_new();
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            this.__wbg_ptr = ret[0] >>> 0;
            StateValueFinalization.register(this, this.__wbg_ptr, this);
            return this;
        }
        type() {
            let deferred1_0;
            let deferred1_1;
            try {
                const ret = wasm$1.statevalue_type(this.__wbg_ptr);
                deferred1_0 = ret[0];
                deferred1_1 = ret[1];
                return getStringFromWasm0(ret[0], ret[1]);
            } finally{
                wasm$1.__wbindgen_free(deferred1_0, deferred1_1, 1);
            }
        }
        static newNull() {
            const ret = wasm$1.statevalue_newNull();
            return StateValue.__wrap(ret);
        }
        static newCell(value) {
            const ret = wasm$1.statevalue_newCell(value);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return StateValue.__wrap(ret[0]);
        }
        static newMap(map) {
            _assertClass(map, StateMap);
            const ret = wasm$1.statevalue_newMap(map.__wbg_ptr);
            return StateValue.__wrap(ret);
        }
        static newBoundedMerkleTree(tree) {
            _assertClass(tree, StateBoundedMerkleTree);
            const ret = wasm$1.statevalue_newBoundedMerkleTree(tree.__wbg_ptr);
            return StateValue.__wrap(ret);
        }
        static newArray() {
            const ret = wasm$1.statevalue_newArray();
            return StateValue.__wrap(ret);
        }
        arrayPush(value) {
            _assertClass(value, StateValue);
            const ret = wasm$1.statevalue_arrayPush(this.__wbg_ptr, value.__wbg_ptr);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return StateValue.__wrap(ret[0]);
        }
        asCell() {
            const ret = wasm$1.statevalue_asCell(this.__wbg_ptr);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return takeFromExternrefTable0(ret[0]);
        }
        asMap() {
            const ret = wasm$1.statevalue_asMap(this.__wbg_ptr);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return ret[0] === 0 ? undefined : StateMap.__wrap(ret[0]);
        }
        asBoundedMerkleTree() {
            const ret = wasm$1.statevalue_asBoundedMerkleTree(this.__wbg_ptr);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return ret[0] === 0 ? undefined : StateBoundedMerkleTree.__wrap(ret[0]);
        }
        asArray() {
            const ret = wasm$1.statevalue_asArray(this.__wbg_ptr);
            if (ret[3]) {
                throw takeFromExternrefTable0(ret[2]);
            }
            let v1;
            if (ret[0] !== 0) {
                v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
                wasm$1.__wbindgen_free(ret[0], ret[1] * 4, 4);
            }
            return v1;
        }
        logSize() {
            const ret = wasm$1.statevalue_logSize(this.__wbg_ptr);
            return ret >>> 0;
        }
        encode() {
            const ret = wasm$1.statevalue_encode(this.__wbg_ptr);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return takeFromExternrefTable0(ret[0]);
        }
        static decode(value) {
            const ret = wasm$1.statevalue_decode(value);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return StateValue.__wrap(ret[0]);
        }
        toString(compact) {
            let deferred1_0;
            let deferred1_1;
            try {
                const ret = wasm$1.statevalue_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
                deferred1_0 = ret[0];
                deferred1_1 = ret[1];
                return getStringFromWasm0(ret[0], ret[1]);
            } finally{
                wasm$1.__wbindgen_free(deferred1_0, deferred1_1, 1);
            }
        }
    }
    const VmResultsFinalization = (typeof FinalizationRegistry === 'undefined') ? {
        register: ()=>{},
        unregister: ()=>{}
    } : new FinalizationRegistry((ptr)=>wasm$1.__wbg_vmresults_free(ptr >>> 0, 1));
    class VmResults {
        static __wrap(ptr) {
            ptr = ptr >>> 0;
            const obj = Object.create(VmResults.prototype);
            obj.__wbg_ptr = ptr;
            VmResultsFinalization.register(obj, obj.__wbg_ptr, obj);
            return obj;
        }
        __destroy_into_raw() {
            const ptr = this.__wbg_ptr;
            this.__wbg_ptr = 0;
            VmResultsFinalization.unregister(this);
            return ptr;
        }
        free() {
            const ptr = this.__destroy_into_raw();
            wasm$1.__wbg_vmresults_free(ptr, 0);
        }
        constructor(){
            const ret = wasm$1.vmresults_new();
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return StateValue.__wrap(ret[0]);
        }
        get stack() {
            const ret = wasm$1.vmresults_stack(this.__wbg_ptr);
            return VmStack.__wrap(ret);
        }
        get events() {
            const ret = wasm$1.vmresults_events(this.__wbg_ptr);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return takeFromExternrefTable0(ret[0]);
        }
        get gasCost() {
            const ret = wasm$1.vmresults_gas_cost(this.__wbg_ptr);
            return BigInt.asUintN(64, ret);
        }
        toString(compact) {
            let deferred1_0;
            let deferred1_1;
            try {
                const ret = wasm$1.vmresults_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
                deferred1_0 = ret[0];
                deferred1_1 = ret[1];
                return getStringFromWasm0(ret[0], ret[1]);
            } finally{
                wasm$1.__wbindgen_free(deferred1_0, deferred1_1, 1);
            }
        }
    }
    const VmStackFinalization = (typeof FinalizationRegistry === 'undefined') ? {
        register: ()=>{},
        unregister: ()=>{}
    } : new FinalizationRegistry((ptr)=>wasm$1.__wbg_vmstack_free(ptr >>> 0, 1));
    class VmStack {
        static __wrap(ptr) {
            ptr = ptr >>> 0;
            const obj = Object.create(VmStack.prototype);
            obj.__wbg_ptr = ptr;
            VmStackFinalization.register(obj, obj.__wbg_ptr, obj);
            return obj;
        }
        __destroy_into_raw() {
            const ptr = this.__wbg_ptr;
            this.__wbg_ptr = 0;
            VmStackFinalization.unregister(this);
            return ptr;
        }
        free() {
            const ptr = this.__destroy_into_raw();
            wasm$1.__wbg_vmstack_free(ptr, 0);
        }
        constructor(){
            const ret = wasm$1.vmstack_new();
            this.__wbg_ptr = ret >>> 0;
            VmStackFinalization.register(this, this.__wbg_ptr, this);
            return this;
        }
        push(value, is_strong) {
            _assertClass(value, StateValue);
            wasm$1.vmstack_push(this.__wbg_ptr, value.__wbg_ptr, is_strong);
        }
        removeLast() {
            wasm$1.vmstack_removeLast(this.__wbg_ptr);
        }
        length() {
            const ret = wasm$1.vmstack_length(this.__wbg_ptr);
            return ret >>> 0;
        }
        get(idx) {
            const ret = wasm$1.vmstack_get(this.__wbg_ptr, idx);
            return ret === 0 ? undefined : StateValue.__wrap(ret);
        }
        isStrong(idx) {
            const ret = wasm$1.vmstack_isStrong(this.__wbg_ptr, idx);
            return ret === 0xFFFFFF ? undefined : ret !== 0;
        }
        toString(compact) {
            let deferred1_0;
            let deferred1_1;
            try {
                const ret = wasm$1.vmstack_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
                deferred1_0 = ret[0];
                deferred1_1 = ret[1];
                return getStringFromWasm0(ret[0], ret[1]);
            } finally{
                wasm$1.__wbindgen_free(deferred1_0, deferred1_1, 1);
            }
        }
    }
    function __wbg_BigInt_470dd987b8190f8e(arg0) {
        const ret = BigInt(arg0);
        return ret;
    }
    function __wbg_BigInt_ddea6d2f55558acb() {
        return handleError(function(arg0) {
            const ret = BigInt(arg0);
            return ret;
        }, arguments);
    }
    function __wbg_String_fed4d24b68977888(arg0, arg1) {
        const ret = String(arg1);
        const ptr1 = passStringToWasm0(ret, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }
    function __wbg_buffer_09165b52af8c5237(arg0) {
        const ret = arg0.buffer;
        return ret;
    }
    function __wbg_buffer_609cc3eee51ed158(arg0) {
        const ret = arg0.buffer;
        return ret;
    }
    function __wbg_byobRequest_77d9adf63337edfb(arg0) {
        const ret = arg0.byobRequest;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }
    function __wbg_byteLength_e674b853d9c77e1d(arg0) {
        const ret = arg0.byteLength;
        return ret;
    }
    function __wbg_byteOffset_fd862df290ef848d(arg0) {
        const ret = arg0.byteOffset;
        return ret;
    }
    function __wbg_call_672a4d21634d4a24() {
        return handleError(function(arg0, arg1) {
            const ret = arg0.call(arg1);
            return ret;
        }, arguments);
    }
    function __wbg_call_7cccdd69e0791ae2() {
        return handleError(function(arg0, arg1, arg2) {
            const ret = arg0.call(arg1, arg2);
            return ret;
        }, arguments);
    }
    function __wbg_close_304cc1fef3466669() {
        return handleError(function(arg0) {
            arg0.close();
        }, arguments);
    }
    function __wbg_close_5ce03e29be453811() {
        return handleError(function(arg0) {
            arg0.close();
        }, arguments);
    }
    function __wbg_contractstate_new(arg0) {
        const ret = ContractState.__wrap(arg0);
        return ret;
    }
    function __wbg_crypto_574e78ad8b13b65f(arg0) {
        const ret = arg0.crypto;
        return ret;
    }
    function __wbg_done_769e5ede4b31c67b(arg0) {
        const ret = arg0.done;
        return ret;
    }
    function __wbg_enqueue_bb16ba72f537dc9e() {
        return handleError(function(arg0, arg1) {
            arg0.enqueue(arg1);
        }, arguments);
    }
    function __wbg_entries_3265d4158b33e5dc(arg0) {
        const ret = Object.entries(arg0);
        return ret;
    }
    function __wbg_getRandomValues_b8f5dbd5f3995a9e() {
        return handleError(function(arg0, arg1) {
            arg0.getRandomValues(arg1);
        }, arguments);
    }
    function __wbg_get_67b2ba62fc30de12() {
        return handleError(function(arg0, arg1) {
            const ret = Reflect.get(arg0, arg1);
            return ret;
        }, arguments);
    }
    function __wbg_get_b9b93047fe3cf45b(arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return ret;
    }
    function __wbg_getwithrefkey_bb8f74a92cb2e784(arg0, arg1) {
        const ret = arg0[arg1];
        return ret;
    }
    function __wbg_instanceof_ArrayBuffer_e14585432e3737fc(arg0) {
        let result;
        try {
            result = arg0 instanceof ArrayBuffer;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    }
    function __wbg_instanceof_Uint8Array_17156bcf118086a9(arg0) {
        let result;
        try {
            result = arg0 instanceof Uint8Array;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    }
    function __wbg_isArray_a1eab7e0d067391b(arg0) {
        const ret = Array.isArray(arg0);
        return ret;
    }
    function __wbg_isSafeInteger_343e2beeeece1bb0(arg0) {
        const ret = Number.isSafeInteger(arg0);
        return ret;
    }
    function __wbg_iterator_9a24c88df860dc65() {
        const ret = Symbol.iterator;
        return ret;
    }
    function __wbg_length_a446193dc22c12f8(arg0) {
        const ret = arg0.length;
        return ret;
    }
    function __wbg_length_e2d2a49132c1b256(arg0) {
        const ret = arg0.length;
        return ret;
    }
    function __wbg_msCrypto_a61aeb35a24c1329(arg0) {
        const ret = arg0.msCrypto;
        return ret;
    }
    function __wbg_new_23a2665fac83c611(arg0, arg1) {
        try {
            var state0 = {
                a: arg0,
                b: arg1
            };
            var cb0 = (arg0, arg1)=>{
                const a = state0.a;
                state0.a = 0;
                try {
                    return __wbg_adapter_286(a, state0.b, arg0, arg1);
                } finally{
                    state0.a = a;
                }
            };
            const ret = new Promise(cb0);
            return ret;
        } finally{
            state0.a = state0.b = 0;
        }
    }
    function __wbg_new_405e22f390576ce2() {
        const ret = new Object();
        return ret;
    }
    function __wbg_new_5e0be73521bc8c17() {
        const ret = new Map();
        return ret;
    }
    function __wbg_new_78feb108b6472713() {
        const ret = new Array();
        return ret;
    }
    function __wbg_new_a12002a7f91c75be(arg0) {
        const ret = new Uint8Array(arg0);
        return ret;
    }
    function __wbg_new_c68d7209be747379(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return ret;
    }
    function __wbg_newnoargs_105ed471475aaf50(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return ret;
    }
    function __wbg_newwithbyteoffsetandlength_d97e637ebe145a9a(arg0, arg1, arg2) {
        const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    }
    function __wbg_newwithlength_a381634e90c276d4(arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return ret;
    }
    function __wbg_next_25feadfc0913fea9(arg0) {
        const ret = arg0.next;
        return ret;
    }
    function __wbg_next_6574e1a8a62d1055() {
        return handleError(function(arg0) {
            const ret = arg0.next();
            return ret;
        }, arguments);
    }
    function __wbg_node_905d3e251edff8a2(arg0) {
        const ret = arg0.node;
        return ret;
    }
    function __wbg_process_dc0fbacc7c1c06f7(arg0) {
        const ret = arg0.process;
        return ret;
    }
    function __wbg_push_737cfc8c1432c2c6(arg0, arg1) {
        const ret = arg0.push(arg1);
        return ret;
    }
    function __wbg_queueMicrotask_97d92b4fcc8a61c5(arg0) {
        queueMicrotask(arg0);
    }
    function __wbg_queueMicrotask_d3219def82552485(arg0) {
        const ret = arg0.queueMicrotask;
        return ret;
    }
    function __wbg_randomFillSync_ac0988aba3254290() {
        return handleError(function(arg0, arg1) {
            arg0.randomFillSync(arg1);
        }, arguments);
    }
    function __wbg_require_60cc747a6bc5215a() {
        return handleError(function() {
            const ret = commonjsRequire;
            return ret;
        }, arguments);
    }
    function __wbg_resolve_4851785c9c5f573d(arg0) {
        const ret = Promise.resolve(arg0);
        return ret;
    }
    function __wbg_respond_1f279fa9f8edcb1c() {
        return handleError(function(arg0, arg1) {
            arg0.respond(arg1 >>> 0);
        }, arguments);
    }
    function __wbg_set_37837023f3d740e8(arg0, arg1, arg2) {
        arg0[arg1 >>> 0] = arg2;
    }
    function __wbg_set_3fda3bac07393de4(arg0, arg1, arg2) {
        arg0[arg1] = arg2;
    }
    function __wbg_set_65595bdd868b3009(arg0, arg1, arg2) {
        arg0.set(arg1, arg2 >>> 0);
    }
    function __wbg_set_8fc6bf8a5b1071d1(arg0, arg1, arg2) {
        const ret = arg0.set(arg1, arg2);
        return ret;
    }
    function __wbg_statevalue_new(arg0) {
        const ret = StateValue.__wrap(arg0);
        return ret;
    }
    function __wbg_static_accessor_GLOBAL_88a902d13a557d07() {
        const ret = typeof global === 'undefined' ? null : global;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }
    function __wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0() {
        const ret = typeof globalThis === 'undefined' ? null : globalThis;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }
    function __wbg_static_accessor_SELF_37c5d418e4bf5819() {
        const ret = typeof self === 'undefined' ? null : self;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }
    function __wbg_static_accessor_WINDOW_5de37043a91a9c40() {
        const ret = typeof window === 'undefined' ? null : window;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }
    function __wbg_subarray_aa9065fa9dc5df96(arg0, arg1, arg2) {
        const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
        return ret;
    }
    function __wbg_then_44b73946d2fb3e7d(arg0, arg1) {
        const ret = arg0.then(arg1);
        return ret;
    }
    function __wbg_toString_b5d4438bc26b267c() {
        return handleError(function(arg0, arg1) {
            const ret = arg0.toString(arg1);
            return ret;
        }, arguments);
    }
    function __wbg_toString_c813bbd34d063839(arg0) {
        const ret = arg0.toString();
        return ret;
    }
    function __wbg_value_cd1ffa7b1ab794f1(arg0) {
        const ret = arg0.value;
        return ret;
    }
    function __wbg_versions_c01dfd4722a88165(arg0) {
        const ret = arg0.versions;
        return ret;
    }
    function __wbg_view_fd8a56e8983f448d(arg0) {
        const ret = arg0.view;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }
    function __wbindgen_bigint_from_i64(arg0) {
        const ret = arg0;
        return ret;
    }
    function __wbindgen_bigint_from_u128(arg0, arg1) {
        const ret = BigInt.asUintN(64, arg0) << BigInt(64) | BigInt.asUintN(64, arg1);
        return ret;
    }
    function __wbindgen_bigint_from_u64(arg0) {
        const ret = BigInt.asUintN(64, arg0);
        return ret;
    }
    function __wbindgen_bigint_get_as_i64(arg0, arg1) {
        const v = arg1;
        const ret = typeof (v) === 'bigint' ? v : undefined;
        getDataViewMemory0().setBigInt64(arg0 + 8 * 1, isLikeNone(ret) ? BigInt(0) : ret, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    }
    function __wbindgen_boolean_get(arg0) {
        const v = arg0;
        const ret = typeof (v) === 'boolean' ? (v ? 1 : 0) : 2;
        return ret;
    }
    function __wbindgen_cb_drop(arg0) {
        const obj = arg0.original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        return ret;
    }
    function __wbindgen_closure_wrapper2600(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 513, __wbg_adapter_54);
        return ret;
    }
    function __wbindgen_debug_string(arg0, arg1) {
        const ret = debugString(arg1);
        const ptr1 = passStringToWasm0(ret, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }
    function __wbindgen_error_new(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return ret;
    }
    function __wbindgen_in(arg0, arg1) {
        const ret = arg0 in arg1;
        return ret;
    }
    function __wbindgen_init_externref_table() {
        const table = wasm$1.__wbindgen_export_2;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
    }
    function __wbindgen_is_bigint(arg0) {
        const ret = typeof (arg0) === 'bigint';
        return ret;
    }
    function __wbindgen_is_function(arg0) {
        const ret = typeof (arg0) === 'function';
        return ret;
    }
    function __wbindgen_is_object(arg0) {
        const val = arg0;
        const ret = typeof (val) === 'object' && val !== null;
        return ret;
    }
    function __wbindgen_is_string(arg0) {
        const ret = typeof (arg0) === 'string';
        return ret;
    }
    function __wbindgen_is_undefined(arg0) {
        const ret = arg0 === undefined;
        return ret;
    }
    function __wbindgen_jsval_eq(arg0, arg1) {
        const ret = arg0 === arg1;
        return ret;
    }
    function __wbindgen_jsval_loose_eq(arg0, arg1) {
        const ret = arg0 == arg1;
        return ret;
    }
    function __wbindgen_memory() {
        const ret = wasm$1.memory;
        return ret;
    }
    function __wbindgen_number_get(arg0, arg1) {
        const obj = arg1;
        const ret = typeof (obj) === 'number' ? obj : undefined;
        getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    }
    function __wbindgen_number_new(arg0) {
        const ret = arg0;
        return ret;
    }
    function __wbindgen_shr(arg0, arg1) {
        const ret = arg0 >> arg1;
        return ret;
    }
    function __wbindgen_string_get(arg0, arg1) {
        const obj = arg1;
        const ret = typeof (obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }
    function __wbindgen_string_new(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    }
    function __wbindgen_throw(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    }
    URL = globalThis.URL;
    const __vite__wasmModule = await __vite__initWasm({
        "./midnight_onchain_runtime_wasm_bg.js": {
            "__wbindgen_boolean_get": __wbindgen_boolean_get,
            "__wbindgen_is_bigint": __wbindgen_is_bigint,
            "__wbindgen_number_get": __wbindgen_number_get,
            "__wbindgen_string_get": __wbindgen_string_get,
            "__wbindgen_is_object": __wbindgen_is_object,
            "__wbindgen_in": __wbindgen_in,
            "__wbindgen_bigint_from_i64": __wbindgen_bigint_from_i64,
            "__wbindgen_jsval_eq": __wbindgen_jsval_eq,
            "__wbindgen_bigint_from_u64": __wbindgen_bigint_from_u64,
            "__wbindgen_error_new": __wbindgen_error_new,
            "__wbindgen_shr": __wbindgen_shr,
            "__wbindgen_is_undefined": __wbindgen_is_undefined,
            "__wbindgen_is_string": __wbindgen_is_string,
            "__wbindgen_number_new": __wbindgen_number_new,
            "__wbg_statevalue_new": __wbg_statevalue_new,
            "__wbg_contractstate_new": __wbg_contractstate_new,
            "__wbindgen_string_new": __wbindgen_string_new,
            "__wbindgen_jsval_loose_eq": __wbindgen_jsval_loose_eq,
            "__wbg_String_fed4d24b68977888": __wbg_String_fed4d24b68977888,
            "__wbindgen_bigint_from_u128": __wbindgen_bigint_from_u128,
            "__wbg_getwithrefkey_bb8f74a92cb2e784": __wbg_getwithrefkey_bb8f74a92cb2e784,
            "__wbg_set_3fda3bac07393de4": __wbg_set_3fda3bac07393de4,
            "__wbindgen_cb_drop": __wbindgen_cb_drop,
            "__wbg_queueMicrotask_d3219def82552485": __wbg_queueMicrotask_d3219def82552485,
            "__wbindgen_is_function": __wbindgen_is_function,
            "__wbg_queueMicrotask_97d92b4fcc8a61c5": __wbg_queueMicrotask_97d92b4fcc8a61c5,
            "__wbg_view_fd8a56e8983f448d": __wbg_view_fd8a56e8983f448d,
            "__wbg_respond_1f279fa9f8edcb1c": __wbg_respond_1f279fa9f8edcb1c,
            "__wbg_close_304cc1fef3466669": __wbg_close_304cc1fef3466669,
            "__wbg_enqueue_bb16ba72f537dc9e": __wbg_enqueue_bb16ba72f537dc9e,
            "__wbg_byobRequest_77d9adf63337edfb": __wbg_byobRequest_77d9adf63337edfb,
            "__wbg_close_5ce03e29be453811": __wbg_close_5ce03e29be453811,
            "__wbg_crypto_574e78ad8b13b65f": __wbg_crypto_574e78ad8b13b65f,
            "__wbg_process_dc0fbacc7c1c06f7": __wbg_process_dc0fbacc7c1c06f7,
            "__wbg_versions_c01dfd4722a88165": __wbg_versions_c01dfd4722a88165,
            "__wbg_node_905d3e251edff8a2": __wbg_node_905d3e251edff8a2,
            "__wbg_require_60cc747a6bc5215a": __wbg_require_60cc747a6bc5215a,
            "__wbg_msCrypto_a61aeb35a24c1329": __wbg_msCrypto_a61aeb35a24c1329,
            "__wbg_randomFillSync_ac0988aba3254290": __wbg_randomFillSync_ac0988aba3254290,
            "__wbg_getRandomValues_b8f5dbd5f3995a9e": __wbg_getRandomValues_b8f5dbd5f3995a9e,
            "__wbg_get_b9b93047fe3cf45b": __wbg_get_b9b93047fe3cf45b,
            "__wbg_length_e2d2a49132c1b256": __wbg_length_e2d2a49132c1b256,
            "__wbg_new_78feb108b6472713": __wbg_new_78feb108b6472713,
            "__wbg_BigInt_470dd987b8190f8e": __wbg_BigInt_470dd987b8190f8e,
            "__wbg_newnoargs_105ed471475aaf50": __wbg_newnoargs_105ed471475aaf50,
            "__wbg_new_5e0be73521bc8c17": __wbg_new_5e0be73521bc8c17,
            "__wbg_next_25feadfc0913fea9": __wbg_next_25feadfc0913fea9,
            "__wbg_next_6574e1a8a62d1055": __wbg_next_6574e1a8a62d1055,
            "__wbg_done_769e5ede4b31c67b": __wbg_done_769e5ede4b31c67b,
            "__wbg_value_cd1ffa7b1ab794f1": __wbg_value_cd1ffa7b1ab794f1,
            "__wbg_iterator_9a24c88df860dc65": __wbg_iterator_9a24c88df860dc65,
            "__wbg_get_67b2ba62fc30de12": __wbg_get_67b2ba62fc30de12,
            "__wbg_call_672a4d21634d4a24": __wbg_call_672a4d21634d4a24,
            "__wbg_new_405e22f390576ce2": __wbg_new_405e22f390576ce2,
            "__wbg_set_37837023f3d740e8": __wbg_set_37837023f3d740e8,
            "__wbg_isArray_a1eab7e0d067391b": __wbg_isArray_a1eab7e0d067391b,
            "__wbg_push_737cfc8c1432c2c6": __wbg_push_737cfc8c1432c2c6,
            "__wbg_instanceof_ArrayBuffer_e14585432e3737fc": __wbg_instanceof_ArrayBuffer_e14585432e3737fc,
            "__wbg_BigInt_ddea6d2f55558acb": __wbg_BigInt_ddea6d2f55558acb,
            "__wbg_toString_b5d4438bc26b267c": __wbg_toString_b5d4438bc26b267c,
            "__wbg_new_c68d7209be747379": __wbg_new_c68d7209be747379,
            "__wbg_toString_c813bbd34d063839": __wbg_toString_c813bbd34d063839,
            "__wbg_call_7cccdd69e0791ae2": __wbg_call_7cccdd69e0791ae2,
            "__wbg_set_8fc6bf8a5b1071d1": __wbg_set_8fc6bf8a5b1071d1,
            "__wbg_isSafeInteger_343e2beeeece1bb0": __wbg_isSafeInteger_343e2beeeece1bb0,
            "__wbg_entries_3265d4158b33e5dc": __wbg_entries_3265d4158b33e5dc,
            "__wbg_new_23a2665fac83c611": __wbg_new_23a2665fac83c611,
            "__wbg_resolve_4851785c9c5f573d": __wbg_resolve_4851785c9c5f573d,
            "__wbg_then_44b73946d2fb3e7d": __wbg_then_44b73946d2fb3e7d,
            "__wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0": __wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0,
            "__wbg_static_accessor_SELF_37c5d418e4bf5819": __wbg_static_accessor_SELF_37c5d418e4bf5819,
            "__wbg_static_accessor_WINDOW_5de37043a91a9c40": __wbg_static_accessor_WINDOW_5de37043a91a9c40,
            "__wbg_static_accessor_GLOBAL_88a902d13a557d07": __wbg_static_accessor_GLOBAL_88a902d13a557d07,
            "__wbg_buffer_609cc3eee51ed158": __wbg_buffer_609cc3eee51ed158,
            "__wbg_newwithbyteoffsetandlength_d97e637ebe145a9a": __wbg_newwithbyteoffsetandlength_d97e637ebe145a9a,
            "__wbg_new_a12002a7f91c75be": __wbg_new_a12002a7f91c75be,
            "__wbg_set_65595bdd868b3009": __wbg_set_65595bdd868b3009,
            "__wbg_length_a446193dc22c12f8": __wbg_length_a446193dc22c12f8,
            "__wbg_instanceof_Uint8Array_17156bcf118086a9": __wbg_instanceof_Uint8Array_17156bcf118086a9,
            "__wbg_newwithlength_a381634e90c276d4": __wbg_newwithlength_a381634e90c276d4,
            "__wbg_buffer_09165b52af8c5237": __wbg_buffer_09165b52af8c5237,
            "__wbg_subarray_aa9065fa9dc5df96": __wbg_subarray_aa9065fa9dc5df96,
            "__wbg_byteLength_e674b853d9c77e1d": __wbg_byteLength_e674b853d9c77e1d,
            "__wbg_byteOffset_fd862df290ef848d": __wbg_byteOffset_fd862df290ef848d,
            "__wbindgen_bigint_get_as_i64": __wbindgen_bigint_get_as_i64,
            "__wbindgen_debug_string": __wbindgen_debug_string,
            "__wbindgen_throw": __wbindgen_throw,
            "__wbindgen_memory": __wbindgen_memory,
            "__wbindgen_closure_wrapper2600": __wbindgen_closure_wrapper2600,
            "__wbindgen_init_externref_table": __wbindgen_init_externref_table
        }
    }, __vite__wasmUrl);
    const memory = __vite__wasmModule.memory;
    const __wbg_queryresults_free = __vite__wasmModule.__wbg_queryresults_free;
    const queryresults_new = __vite__wasmModule.queryresults_new;
    const queryresults_context = __vite__wasmModule.queryresults_context;
    const queryresults_events = __vite__wasmModule.queryresults_events;
    const queryresults_gas_cost = __vite__wasmModule.queryresults_gas_cost;
    const queryresults_toString = __vite__wasmModule.queryresults_toString;
    const __wbg_querycontext_free = __vite__wasmModule.__wbg_querycontext_free;
    const __wbg_costmodel_free = __vite__wasmModule.__wbg_costmodel_free;
    const costmodel_new = __vite__wasmModule.costmodel_new;
    const costmodel_dummyCostModel = __vite__wasmModule.costmodel_dummyCostModel;
    const costmodel_toString = __vite__wasmModule.costmodel_toString;
    const querycontext_new = __vite__wasmModule.querycontext_new;
    const querycontext_state = __vite__wasmModule.querycontext_state;
    const querycontext_address = __vite__wasmModule.querycontext_address;
    const querycontext_effects = __vite__wasmModule.querycontext_effects;
    const querycontext_set_effects = __vite__wasmModule.querycontext_set_effects;
    const querycontext_block = __vite__wasmModule.querycontext_block;
    const querycontext_set_block = __vite__wasmModule.querycontext_set_block;
    const querycontext_com_indicies = __vite__wasmModule.querycontext_com_indicies;
    const querycontext_insertCommitment = __vite__wasmModule.querycontext_insertCommitment;
    const querycontext_qualify = __vite__wasmModule.querycontext_qualify;
    const querycontext_runTranscript = __vite__wasmModule.querycontext_runTranscript;
    const querycontext_query = __vite__wasmModule.querycontext_query;
    const querycontext_intoTranscript = __vite__wasmModule.querycontext_intoTranscript;
    const querycontext_toString = __vite__wasmModule.querycontext_toString;
    const encodeCoinInfo = __vite__wasmModule.encodeCoinInfo;
    const encodeQualifiedCoinInfo = __vite__wasmModule.encodeQualifiedCoinInfo;
    const decodeCoinInfo = __vite__wasmModule.decodeCoinInfo;
    const decodeQualifiedCoinInfo = __vite__wasmModule.decodeQualifiedCoinInfo;
    const encodeTokenType = __vite__wasmModule.encodeTokenType;
    const decodeTokenType = __vite__wasmModule.decodeTokenType;
    const encodeContractAddress = __vite__wasmModule.encodeContractAddress;
    const decodeContractAddress = __vite__wasmModule.decodeContractAddress;
    const encodeCoinPublicKey = __vite__wasmModule.encodeCoinPublicKey;
    const decodeCoinPublicKey = __vite__wasmModule.decodeCoinPublicKey;
    const entryPointHash = __vite__wasmModule.entryPointHash;
    const communicationCommitmentRandomness = __vite__wasmModule.communicationCommitmentRandomness;
    const communicationCommitment = __vite__wasmModule.communicationCommitment;
    const sampleSigningKey = __vite__wasmModule.sampleSigningKey;
    const signData = __vite__wasmModule.signData;
    const signatureVerifyingKey = __vite__wasmModule.signatureVerifyingKey;
    const verifySignature = __vite__wasmModule.verifySignature;
    const tokenType = __vite__wasmModule.tokenType;
    const sampleContractAddress = __vite__wasmModule.sampleContractAddress;
    const sampleTokenType = __vite__wasmModule.sampleTokenType;
    const dummyContractAddress = __vite__wasmModule.dummyContractAddress;
    const coinCommitment = __vite__wasmModule.coinCommitment;
    const leafHash = __vite__wasmModule.leafHash;
    const maxAlignedSize = __vite__wasmModule.maxAlignedSize;
    const maxField = __vite__wasmModule.maxField;
    const checkProofData = __vite__wasmModule.checkProofData;
    const bigIntModFr = __vite__wasmModule.bigIntModFr;
    const valueToBigInt = __vite__wasmModule.valueToBigInt;
    const bigIntToValue = __vite__wasmModule.bigIntToValue;
    const transientHash = __vite__wasmModule.transientHash;
    const transientCommit = __vite__wasmModule.transientCommit;
    const persistentHash = __vite__wasmModule.persistentHash;
    const persistentCommit = __vite__wasmModule.persistentCommit;
    const degradeToTransient = __vite__wasmModule.degradeToTransient;
    const upgradeFromTransient = __vite__wasmModule.upgradeFromTransient;
    const hashToCurve = __vite__wasmModule.hashToCurve;
    const ecAdd = __vite__wasmModule.ecAdd;
    const ecMul = __vite__wasmModule.ecMul;
    const ecMulGenerator = __vite__wasmModule.ecMulGenerator;
    const __wbg_statemap_free = __vite__wasmModule.__wbg_statemap_free;
    const statemap_new = __vite__wasmModule.statemap_new;
    const statemap_keys = __vite__wasmModule.statemap_keys;
    const statemap_get = __vite__wasmModule.statemap_get;
    const statemap_insert = __vite__wasmModule.statemap_insert;
    const statemap_remove = __vite__wasmModule.statemap_remove;
    const statemap_toString = __vite__wasmModule.statemap_toString;
    const __wbg_stateboundedmerkletree_free = __vite__wasmModule.__wbg_stateboundedmerkletree_free;
    const stateboundedmerkletree_blank = __vite__wasmModule.stateboundedmerkletree_blank;
    const stateboundedmerkletree_height = __vite__wasmModule.stateboundedmerkletree_height;
    const stateboundedmerkletree_root = __vite__wasmModule.stateboundedmerkletree_root;
    const stateboundedmerkletree_findPathForLeaf = __vite__wasmModule.stateboundedmerkletree_findPathForLeaf;
    const stateboundedmerkletree_pathForLeaf = __vite__wasmModule.stateboundedmerkletree_pathForLeaf;
    const stateboundedmerkletree_update = __vite__wasmModule.stateboundedmerkletree_update;
    const stateboundedmerkletree_collapse = __vite__wasmModule.stateboundedmerkletree_collapse;
    const stateboundedmerkletree_toString = __vite__wasmModule.stateboundedmerkletree_toString;
    const __wbg_statevalue_free = __vite__wasmModule.__wbg_statevalue_free;
    const statevalue_new = __vite__wasmModule.statevalue_new;
    const statevalue_type = __vite__wasmModule.statevalue_type;
    const statevalue_newNull = __vite__wasmModule.statevalue_newNull;
    const statevalue_newCell = __vite__wasmModule.statevalue_newCell;
    const statevalue_newMap = __vite__wasmModule.statevalue_newMap;
    const statevalue_newBoundedMerkleTree = __vite__wasmModule.statevalue_newBoundedMerkleTree;
    const statevalue_newArray = __vite__wasmModule.statevalue_newArray;
    const statevalue_arrayPush = __vite__wasmModule.statevalue_arrayPush;
    const statevalue_asCell = __vite__wasmModule.statevalue_asCell;
    const statevalue_asMap = __vite__wasmModule.statevalue_asMap;
    const statevalue_asBoundedMerkleTree = __vite__wasmModule.statevalue_asBoundedMerkleTree;
    const statevalue_asArray = __vite__wasmModule.statevalue_asArray;
    const statevalue_logSize = __vite__wasmModule.statevalue_logSize;
    const statevalue_encode = __vite__wasmModule.statevalue_encode;
    const statevalue_decode = __vite__wasmModule.statevalue_decode;
    const statevalue_toString = __vite__wasmModule.statevalue_toString;
    const __wbg_contractstate_free = __vite__wasmModule.__wbg_contractstate_free;
    const contractstate_new = __vite__wasmModule.contractstate_new;
    const contractstate_data = __vite__wasmModule.contractstate_data;
    const contractstate_set_data = __vite__wasmModule.contractstate_set_data;
    const contractstate_maintenance_authority = __vite__wasmModule.contractstate_maintenance_authority;
    const contractstate_set_maintenance_authority = __vite__wasmModule.contractstate_set_maintenance_authority;
    const contractstate_operations = __vite__wasmModule.contractstate_operations;
    const contractstate_operation = __vite__wasmModule.contractstate_operation;
    const contractstate_setOperation = __vite__wasmModule.contractstate_setOperation;
    const contractstate_query = __vite__wasmModule.contractstate_query;
    const contractstate_serialize = __vite__wasmModule.contractstate_serialize;
    const contractstate_deserialize = __vite__wasmModule.contractstate_deserialize;
    const contractstate_toString = __vite__wasmModule.contractstate_toString;
    const __wbg_contractoperation_free = __vite__wasmModule.__wbg_contractoperation_free;
    const contractoperation_new = __vite__wasmModule.contractoperation_new;
    const contractoperation_verifier_key = __vite__wasmModule.contractoperation_verifier_key;
    const contractoperation_set_verifier_key = __vite__wasmModule.contractoperation_set_verifier_key;
    const contractoperation_serialize = __vite__wasmModule.contractoperation_serialize;
    const contractoperation_deserialize = __vite__wasmModule.contractoperation_deserialize;
    const contractoperation_toString = __vite__wasmModule.contractoperation_toString;
    const __wbg_contractmaintenanceauthority_free = __vite__wasmModule.__wbg_contractmaintenanceauthority_free;
    const contractmaintenanceauthority_new = __vite__wasmModule.contractmaintenanceauthority_new;
    const contractmaintenanceauthority_committee = __vite__wasmModule.contractmaintenanceauthority_committee;
    const contractmaintenanceauthority_threshold = __vite__wasmModule.contractmaintenanceauthority_threshold;
    const contractmaintenanceauthority_counter = __vite__wasmModule.contractmaintenanceauthority_counter;
    const contractmaintenanceauthority_serialize = __vite__wasmModule.contractmaintenanceauthority_serialize;
    const contractmaintenanceauthority_deserialize = __vite__wasmModule.contractmaintenanceauthority_deserialize;
    const contractmaintenanceauthority_toString = __vite__wasmModule.contractmaintenanceauthority_toString;
    const __wbg_vmresults_free = __vite__wasmModule.__wbg_vmresults_free;
    const vmresults_new = __vite__wasmModule.vmresults_new;
    const vmresults_stack = __vite__wasmModule.vmresults_stack;
    const vmresults_events = __vite__wasmModule.vmresults_events;
    const vmresults_gas_cost = __vite__wasmModule.vmresults_gas_cost;
    const vmresults_toString = __vite__wasmModule.vmresults_toString;
    const __wbg_vmstack_free = __vite__wasmModule.__wbg_vmstack_free;
    const vmstack_new = __vite__wasmModule.vmstack_new;
    const vmstack_push = __vite__wasmModule.vmstack_push;
    const vmstack_removeLast = __vite__wasmModule.vmstack_removeLast;
    const vmstack_length = __vite__wasmModule.vmstack_length;
    const vmstack_get = __vite__wasmModule.vmstack_get;
    const vmstack_isStrong = __vite__wasmModule.vmstack_isStrong;
    const vmstack_toString = __vite__wasmModule.vmstack_toString;
    const runProgram = __vite__wasmModule.runProgram;
    const __wbg_intounderlyingbytesource_free = __vite__wasmModule.__wbg_intounderlyingbytesource_free;
    const intounderlyingbytesource_type = __vite__wasmModule.intounderlyingbytesource_type;
    const intounderlyingbytesource_autoAllocateChunkSize = __vite__wasmModule.intounderlyingbytesource_autoAllocateChunkSize;
    const intounderlyingbytesource_start = __vite__wasmModule.intounderlyingbytesource_start;
    const intounderlyingbytesource_pull = __vite__wasmModule.intounderlyingbytesource_pull;
    const intounderlyingbytesource_cancel = __vite__wasmModule.intounderlyingbytesource_cancel;
    const __wbg_intounderlyingsource_free = __vite__wasmModule.__wbg_intounderlyingsource_free;
    const intounderlyingsource_pull = __vite__wasmModule.intounderlyingsource_pull;
    const intounderlyingsource_cancel = __vite__wasmModule.intounderlyingsource_cancel;
    const __wbg_intounderlyingsink_free = __vite__wasmModule.__wbg_intounderlyingsink_free;
    const intounderlyingsink_write = __vite__wasmModule.intounderlyingsink_write;
    const intounderlyingsink_close = __vite__wasmModule.intounderlyingsink_close;
    const intounderlyingsink_abort = __vite__wasmModule.intounderlyingsink_abort;
    const __wbindgen_exn_store = __vite__wasmModule.__wbindgen_exn_store;
    const __externref_table_alloc = __vite__wasmModule.__externref_table_alloc;
    const __wbindgen_export_2 = __vite__wasmModule.__wbindgen_export_2;
    const __wbindgen_malloc = __vite__wasmModule.__wbindgen_malloc;
    const __wbindgen_realloc = __vite__wasmModule.__wbindgen_realloc;
    const __wbindgen_export_5 = __vite__wasmModule.__wbindgen_export_5;
    const __externref_table_dealloc = __vite__wasmModule.__externref_table_dealloc;
    const __wbindgen_free = __vite__wasmModule.__wbindgen_free;
    const __externref_drop_slice = __vite__wasmModule.__externref_drop_slice;
    const closure512_externref_shim = __vite__wasmModule.closure512_externref_shim;
    const closure553_externref_shim = __vite__wasmModule.closure553_externref_shim;
    const __wbindgen_start = __vite__wasmModule.__wbindgen_start;
    const wasm = Object.freeze(Object.defineProperty({
        __proto__: null,
        __externref_drop_slice,
        __externref_table_alloc,
        __externref_table_dealloc,
        __wbg_contractmaintenanceauthority_free,
        __wbg_contractoperation_free,
        __wbg_contractstate_free,
        __wbg_costmodel_free,
        __wbg_intounderlyingbytesource_free,
        __wbg_intounderlyingsink_free,
        __wbg_intounderlyingsource_free,
        __wbg_querycontext_free,
        __wbg_queryresults_free,
        __wbg_stateboundedmerkletree_free,
        __wbg_statemap_free,
        __wbg_statevalue_free,
        __wbg_vmresults_free,
        __wbg_vmstack_free,
        __wbindgen_exn_store,
        __wbindgen_export_2,
        __wbindgen_export_5,
        __wbindgen_free,
        __wbindgen_malloc,
        __wbindgen_realloc,
        __wbindgen_start,
        bigIntModFr,
        bigIntToValue,
        checkProofData,
        closure512_externref_shim,
        closure553_externref_shim,
        coinCommitment,
        communicationCommitment,
        communicationCommitmentRandomness,
        contractmaintenanceauthority_committee,
        contractmaintenanceauthority_counter,
        contractmaintenanceauthority_deserialize,
        contractmaintenanceauthority_new,
        contractmaintenanceauthority_serialize,
        contractmaintenanceauthority_threshold,
        contractmaintenanceauthority_toString,
        contractoperation_deserialize,
        contractoperation_new,
        contractoperation_serialize,
        contractoperation_set_verifier_key,
        contractoperation_toString,
        contractoperation_verifier_key,
        contractstate_data,
        contractstate_deserialize,
        contractstate_maintenance_authority,
        contractstate_new,
        contractstate_operation,
        contractstate_operations,
        contractstate_query,
        contractstate_serialize,
        contractstate_setOperation,
        contractstate_set_data,
        contractstate_set_maintenance_authority,
        contractstate_toString,
        costmodel_dummyCostModel,
        costmodel_new,
        costmodel_toString,
        decodeCoinInfo,
        decodeCoinPublicKey,
        decodeContractAddress,
        decodeQualifiedCoinInfo,
        decodeTokenType,
        degradeToTransient,
        dummyContractAddress,
        ecAdd,
        ecMul,
        ecMulGenerator,
        encodeCoinInfo,
        encodeCoinPublicKey,
        encodeContractAddress,
        encodeQualifiedCoinInfo,
        encodeTokenType,
        entryPointHash,
        hashToCurve,
        intounderlyingbytesource_autoAllocateChunkSize,
        intounderlyingbytesource_cancel,
        intounderlyingbytesource_pull,
        intounderlyingbytesource_start,
        intounderlyingbytesource_type,
        intounderlyingsink_abort,
        intounderlyingsink_close,
        intounderlyingsink_write,
        intounderlyingsource_cancel,
        intounderlyingsource_pull,
        leafHash,
        maxAlignedSize,
        maxField,
        memory,
        persistentCommit,
        persistentHash,
        querycontext_address,
        querycontext_block,
        querycontext_com_indicies,
        querycontext_effects,
        querycontext_insertCommitment,
        querycontext_intoTranscript,
        querycontext_new,
        querycontext_qualify,
        querycontext_query,
        querycontext_runTranscript,
        querycontext_set_block,
        querycontext_set_effects,
        querycontext_state,
        querycontext_toString,
        queryresults_context,
        queryresults_events,
        queryresults_gas_cost,
        queryresults_new,
        queryresults_toString,
        runProgram,
        sampleContractAddress,
        sampleSigningKey,
        sampleTokenType,
        signData,
        signatureVerifyingKey,
        stateboundedmerkletree_blank,
        stateboundedmerkletree_collapse,
        stateboundedmerkletree_findPathForLeaf,
        stateboundedmerkletree_height,
        stateboundedmerkletree_pathForLeaf,
        stateboundedmerkletree_root,
        stateboundedmerkletree_toString,
        stateboundedmerkletree_update,
        statemap_get,
        statemap_insert,
        statemap_keys,
        statemap_new,
        statemap_remove,
        statemap_toString,
        statevalue_arrayPush,
        statevalue_asArray,
        statevalue_asBoundedMerkleTree,
        statevalue_asCell,
        statevalue_asMap,
        statevalue_decode,
        statevalue_encode,
        statevalue_logSize,
        statevalue_new,
        statevalue_newArray,
        statevalue_newBoundedMerkleTree,
        statevalue_newCell,
        statevalue_newMap,
        statevalue_newNull,
        statevalue_toString,
        statevalue_type,
        tokenType,
        transientCommit,
        transientHash,
        upgradeFromTransient,
        valueToBigInt,
        verifySignature,
        vmresults_events,
        vmresults_gas_cost,
        vmresults_new,
        vmresults_stack,
        vmresults_toString,
        vmstack_get,
        vmstack_isStrong,
        vmstack_length,
        vmstack_new,
        vmstack_push,
        vmstack_removeLast,
        vmstack_toString
    }, Symbol.toStringTag, {
        value: 'Module'
    }));
    __wbg_set_wasm(wasm);
    __wbindgen_start();
    midnight_onchain_runtime_wasm = Object.freeze(Object.defineProperty({
        __proto__: null,
        ContractMaintenanceAuthority,
        ContractOperation,
        ContractState,
        CostModel,
        IntoUnderlyingByteSource,
        IntoUnderlyingSink,
        IntoUnderlyingSource,
        NetworkId,
        QueryContext,
        QueryResults,
        StateBoundedMerkleTree,
        StateMap,
        StateValue,
        VmResults,
        VmStack,
        __wbg_BigInt_470dd987b8190f8e,
        __wbg_BigInt_ddea6d2f55558acb,
        __wbg_String_fed4d24b68977888,
        __wbg_buffer_09165b52af8c5237,
        __wbg_buffer_609cc3eee51ed158,
        __wbg_byobRequest_77d9adf63337edfb,
        __wbg_byteLength_e674b853d9c77e1d,
        __wbg_byteOffset_fd862df290ef848d,
        __wbg_call_672a4d21634d4a24,
        __wbg_call_7cccdd69e0791ae2,
        __wbg_close_304cc1fef3466669,
        __wbg_close_5ce03e29be453811,
        __wbg_contractstate_new,
        __wbg_crypto_574e78ad8b13b65f,
        __wbg_done_769e5ede4b31c67b,
        __wbg_enqueue_bb16ba72f537dc9e,
        __wbg_entries_3265d4158b33e5dc,
        __wbg_getRandomValues_b8f5dbd5f3995a9e,
        __wbg_get_67b2ba62fc30de12,
        __wbg_get_b9b93047fe3cf45b,
        __wbg_getwithrefkey_bb8f74a92cb2e784,
        __wbg_instanceof_ArrayBuffer_e14585432e3737fc,
        __wbg_instanceof_Uint8Array_17156bcf118086a9,
        __wbg_isArray_a1eab7e0d067391b,
        __wbg_isSafeInteger_343e2beeeece1bb0,
        __wbg_iterator_9a24c88df860dc65,
        __wbg_length_a446193dc22c12f8,
        __wbg_length_e2d2a49132c1b256,
        __wbg_msCrypto_a61aeb35a24c1329,
        __wbg_new_23a2665fac83c611,
        __wbg_new_405e22f390576ce2,
        __wbg_new_5e0be73521bc8c17,
        __wbg_new_78feb108b6472713,
        __wbg_new_a12002a7f91c75be,
        __wbg_new_c68d7209be747379,
        __wbg_newnoargs_105ed471475aaf50,
        __wbg_newwithbyteoffsetandlength_d97e637ebe145a9a,
        __wbg_newwithlength_a381634e90c276d4,
        __wbg_next_25feadfc0913fea9,
        __wbg_next_6574e1a8a62d1055,
        __wbg_node_905d3e251edff8a2,
        __wbg_process_dc0fbacc7c1c06f7,
        __wbg_push_737cfc8c1432c2c6,
        __wbg_queueMicrotask_97d92b4fcc8a61c5,
        __wbg_queueMicrotask_d3219def82552485,
        __wbg_randomFillSync_ac0988aba3254290,
        __wbg_require_60cc747a6bc5215a,
        __wbg_resolve_4851785c9c5f573d,
        __wbg_respond_1f279fa9f8edcb1c,
        __wbg_set_37837023f3d740e8,
        __wbg_set_3fda3bac07393de4,
        __wbg_set_65595bdd868b3009,
        __wbg_set_8fc6bf8a5b1071d1,
        __wbg_set_wasm,
        __wbg_statevalue_new,
        __wbg_static_accessor_GLOBAL_88a902d13a557d07,
        __wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0,
        __wbg_static_accessor_SELF_37c5d418e4bf5819,
        __wbg_static_accessor_WINDOW_5de37043a91a9c40,
        __wbg_subarray_aa9065fa9dc5df96,
        __wbg_then_44b73946d2fb3e7d,
        __wbg_toString_b5d4438bc26b267c,
        __wbg_toString_c813bbd34d063839,
        __wbg_value_cd1ffa7b1ab794f1,
        __wbg_versions_c01dfd4722a88165,
        __wbg_view_fd8a56e8983f448d,
        __wbindgen_bigint_from_i64,
        __wbindgen_bigint_from_u128,
        __wbindgen_bigint_from_u64,
        __wbindgen_bigint_get_as_i64,
        __wbindgen_boolean_get,
        __wbindgen_cb_drop,
        __wbindgen_closure_wrapper2600,
        __wbindgen_debug_string,
        __wbindgen_error_new,
        __wbindgen_in,
        __wbindgen_init_externref_table,
        __wbindgen_is_bigint,
        __wbindgen_is_function,
        __wbindgen_is_object,
        __wbindgen_is_string,
        __wbindgen_is_undefined,
        __wbindgen_jsval_eq,
        __wbindgen_jsval_loose_eq,
        __wbindgen_memory,
        __wbindgen_number_get,
        __wbindgen_number_new,
        __wbindgen_shr,
        __wbindgen_string_get,
        __wbindgen_string_new,
        __wbindgen_throw,
        bigIntModFr: bigIntModFr$1,
        bigIntToValue: bigIntToValue$1,
        checkProofData: checkProofData$1,
        coinCommitment: coinCommitment$1,
        communicationCommitment: communicationCommitment$1,
        communicationCommitmentRandomness: communicationCommitmentRandomness$1,
        decodeCoinInfo: decodeCoinInfo$1,
        decodeCoinPublicKey: decodeCoinPublicKey$1,
        decodeContractAddress: decodeContractAddress$1,
        decodeQualifiedCoinInfo: decodeQualifiedCoinInfo$1,
        decodeTokenType: decodeTokenType$1,
        degradeToTransient: degradeToTransient$1,
        dummyContractAddress: dummyContractAddress$1,
        ecAdd: ecAdd$1,
        ecMul: ecMul$1,
        ecMulGenerator: ecMulGenerator$1,
        encodeCoinInfo: encodeCoinInfo$1,
        encodeCoinPublicKey: encodeCoinPublicKey$1,
        encodeContractAddress: encodeContractAddress$1,
        encodeQualifiedCoinInfo: encodeQualifiedCoinInfo$1,
        encodeTokenType: encodeTokenType$1,
        entryPointHash: entryPointHash$1,
        hashToCurve: hashToCurve$1,
        leafHash: leafHash$1,
        maxAlignedSize: maxAlignedSize$1,
        maxField: maxField$1,
        persistentCommit: persistentCommit$1,
        persistentHash: persistentHash$1,
        runProgram: runProgram$1,
        sampleContractAddress: sampleContractAddress$1,
        sampleSigningKey: sampleSigningKey$1,
        sampleTokenType: sampleTokenType$1,
        signData: signData$1,
        signatureVerifyingKey: signatureVerifyingKey$1,
        tokenType: tokenType$1,
        transientCommit: transientCommit$1,
        transientHash: transientHash$1,
        upgradeFromTransient: upgradeFromTransient$1,
        valueToBigInt: valueToBigInt$1,
        verifySignature: verifySignature$1
    }, Symbol.toStringTag, {
        value: 'Module'
    }));
})();
export { __vite__initWasm as _, commonjsRequire as a, getAugmentedNamespace as b, commonjsGlobal as c, getDefaultExportFromCjs as g, midnight_onchain_runtime_wasm as m, __tla };
