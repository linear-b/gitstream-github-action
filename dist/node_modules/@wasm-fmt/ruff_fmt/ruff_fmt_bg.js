/**
 * Format the entire Python source code string.
 * @param {string} input
 * @param {string | null} [path]
 * @param {Config | null} [config]
 * @returns {string}
 */
export function format(input, path, config) {
    let deferred4_0;
    let deferred4_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(input, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(path) ? 0 : passStringToWasm0(path, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        var len1 = WASM_VECTOR_LEN;
        wasm.format(retptr, ptr0, len0, ptr1, len1, isLikeNone(config) ? 0 : addHeapObject(config));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        var ptr3 = r0;
        var len3 = r1;
        if (r3) {
            ptr3 = 0; len3 = 0;
            throw takeObject(r2);
        }
        deferred4_0 = ptr3;
        deferred4_1 = len3;
        return getStringFromWasm0(ptr3, len3);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_export4(deferred4_0, deferred4_1, 1);
    }
}

/**
 * Format a specific range of the Python source code string.
 * @param {string} input
 * @param {TextRange} range
 * @param {string | null} [path]
 * @param {Config | null} [config]
 * @returns {PrintedRange}
 */
export function format_range(input, range, path, config) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(input, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(path) ? 0 : passStringToWasm0(path, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        var len1 = WASM_VECTOR_LEN;
        wasm.format_range(retptr, ptr0, len0, addHeapObject(range), ptr1, len1, isLikeNone(config) ? 0 : addHeapObject(config));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}
export function __wbg_Error_8c4e43fe74559d73(arg0, arg1) {
    const ret = Error(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
}
export function __wbg_Number_04624de7d0e8332d(arg0) {
    const ret = Number(getObject(arg0));
    return ret;
}
export function __wbg_String_8f0eb39a4a4c2f66(arg0, arg1) {
    const ret = String(getObject(arg1));
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}
export function __wbg___wbindgen_bigint_get_as_i64_8fcf4ce7f1ca72a2(arg0, arg1) {
    const v = getObject(arg1);
    const ret = typeof(v) === 'bigint' ? v : undefined;
    getDataViewMemory0().setBigInt64(arg0 + 8 * 1, isLikeNone(ret) ? BigInt(0) : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
}
export function __wbg___wbindgen_boolean_get_bbbb1c18aa2f5e25(arg0) {
    const v = getObject(arg0);
    const ret = typeof(v) === 'boolean' ? v : undefined;
    return isLikeNone(ret) ? 0xFFFFFF : ret ? 1 : 0;
}
export function __wbg___wbindgen_debug_string_0bc8482c6e3508ae(arg0, arg1) {
    const ret = debugString(getObject(arg1));
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}
export function __wbg___wbindgen_in_47fa6863be6f2f25(arg0, arg1) {
    const ret = getObject(arg0) in getObject(arg1);
    return ret;
}
export function __wbg___wbindgen_is_bigint_31b12575b56f32fc(arg0) {
    const ret = typeof(getObject(arg0)) === 'bigint';
    return ret;
}
export function __wbg___wbindgen_is_function_0095a73b8b156f76(arg0) {
    const ret = typeof(getObject(arg0)) === 'function';
    return ret;
}
export function __wbg___wbindgen_is_object_5ae8e5880f2c1fbd(arg0) {
    const val = getObject(arg0);
    const ret = typeof(val) === 'object' && val !== null;
    return ret;
}
export function __wbg___wbindgen_is_undefined_9e4d92534c42d778(arg0) {
    const ret = getObject(arg0) === undefined;
    return ret;
}
export function __wbg___wbindgen_jsval_eq_11888390b0186270(arg0, arg1) {
    const ret = getObject(arg0) === getObject(arg1);
    return ret;
}
export function __wbg___wbindgen_jsval_loose_eq_9dd77d8cd6671811(arg0, arg1) {
    const ret = getObject(arg0) == getObject(arg1);
    return ret;
}
export function __wbg___wbindgen_number_get_8ff4255516ccad3e(arg0, arg1) {
    const obj = getObject(arg1);
    const ret = typeof(obj) === 'number' ? obj : undefined;
    getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
}
export function __wbg___wbindgen_string_get_72fb696202c56729(arg0, arg1) {
    const obj = getObject(arg1);
    const ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}
export function __wbg___wbindgen_throw_be289d5034ed271b(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
}
export function __wbg_call_389efe28435a9388() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
}, arguments); }
export function __wbg_done_57b39ecd9addfe81(arg0) {
    const ret = getObject(arg0).done;
    return ret;
}
export function __wbg_entries_58c7934c745daac7(arg0) {
    const ret = Object.entries(getObject(arg0));
    return addHeapObject(ret);
}
export function __wbg_get_9b94d73e6221f75c(arg0, arg1) {
    const ret = getObject(arg0)[arg1 >>> 0];
    return addHeapObject(ret);
}
export function __wbg_get_b3ed3ad4be2bc8ac() { return handleError(function (arg0, arg1) {
    const ret = Reflect.get(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
}, arguments); }
export function __wbg_get_with_ref_key_1dc361bd10053bfe(arg0, arg1) {
    const ret = getObject(arg0)[getObject(arg1)];
    return addHeapObject(ret);
}
export function __wbg_instanceof_ArrayBuffer_c367199e2fa2aa04(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof ArrayBuffer;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
}
export function __wbg_instanceof_Map_53af74335dec57f4(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof Map;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
}
export function __wbg_instanceof_Uint8Array_9b9075935c74707c(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof Uint8Array;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
}
export function __wbg_isArray_d314bb98fcf08331(arg0) {
    const ret = Array.isArray(getObject(arg0));
    return ret;
}
export function __wbg_isSafeInteger_bfbc7332a9768d2a(arg0) {
    const ret = Number.isSafeInteger(getObject(arg0));
    return ret;
}
export function __wbg_iterator_6ff6560ca1568e55() {
    const ret = Symbol.iterator;
    return addHeapObject(ret);
}
export function __wbg_length_32ed9a279acd054c(arg0) {
    const ret = getObject(arg0).length;
    return ret;
}
export function __wbg_length_35a7bace40f36eac(arg0) {
    const ret = getObject(arg0).length;
    return ret;
}
export function __wbg_new_361308b2356cecd0() {
    const ret = new Object();
    return addHeapObject(ret);
}
export function __wbg_new_dd2b680c8bf6ae29(arg0) {
    const ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
}
export function __wbg_next_3482f54c49e8af19() { return handleError(function (arg0) {
    const ret = getObject(arg0).next();
    return addHeapObject(ret);
}, arguments); }
export function __wbg_next_418f80d8f5303233(arg0) {
    const ret = getObject(arg0).next;
    return addHeapObject(ret);
}
export function __wbg_prototypesetcall_bdcdcc5842e4d77d(arg0, arg1, arg2) {
    Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), getObject(arg2));
}
export function __wbg_set_3f1d0b984ed272ed(arg0, arg1, arg2) {
    getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
}
export function __wbg_value_0546255b415e96c1(arg0) {
    const ret = getObject(arg0).value;
    return addHeapObject(ret);
}
export function __wbindgen_cast_0000000000000001(arg0) {
    // Cast intrinsic for `F64 -> Externref`.
    const ret = arg0;
    return addHeapObject(ret);
}
export function __wbindgen_cast_0000000000000002(arg0) {
    // Cast intrinsic for `I64 -> Externref`.
    const ret = arg0;
    return addHeapObject(ret);
}
export function __wbindgen_cast_0000000000000003(arg0, arg1) {
    // Cast intrinsic for `Ref(String) -> Externref`.
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
}
export function __wbindgen_cast_0000000000000004(arg0) {
    // Cast intrinsic for `U64 -> Externref`.
    const ret = BigInt.asUintN(64, arg0);
    return addHeapObject(ret);
}
export function __wbindgen_object_clone_ref(arg0) {
    const ret = getObject(arg0);
    return addHeapObject(ret);
}
export function __wbindgen_object_drop_ref(arg0) {
    takeObject(arg0);
}
function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
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
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getObject(idx) { return heap[idx]; }

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_export3(addHeapObject(e));
    }
}

let heap = new Array(128).fill(undefined);
heap.push(undefined, null, true, false);

let heap_next = heap.length;

function isLikeNone(x) {
    return x === undefined || x === null;
}

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

    for (; offset < len; offset++) {
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
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;


let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}
