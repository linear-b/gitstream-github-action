exports.id = 888;
exports.ids = [888];
exports.modules = {

/***/ 23105:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(60470);

var callBindBasic = __webpack_require__(88705);

/** @type {(thisArg: string, searchString: string, position?: number) => number} */
var $indexOf = callBindBasic([GetIntrinsic('%String.prototype.indexOf%')]);

/** @type {import('.')} */
module.exports = function callBoundIntrinsic(name, allowMissing) {
	// eslint-disable-next-line no-extra-parens
	var intrinsic = /** @type {Parameters<typeof callBindBasic>[0][0]} */ (GetIntrinsic(name, !!allowMissing));
	if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
		return callBindBasic([intrinsic]);
	}
	return intrinsic;
};


/***/ }),

/***/ 60506:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var hasMap = typeof Map === 'function' && Map.prototype;
var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, 'size') : null;
var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === 'function' ? mapSizeDescriptor.get : null;
var mapForEach = hasMap && Map.prototype.forEach;
var hasSet = typeof Set === 'function' && Set.prototype;
var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, 'size') : null;
var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === 'function' ? setSizeDescriptor.get : null;
var setForEach = hasSet && Set.prototype.forEach;
var hasWeakMap = typeof WeakMap === 'function' && WeakMap.prototype;
var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
var hasWeakSet = typeof WeakSet === 'function' && WeakSet.prototype;
var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
var hasWeakRef = typeof WeakRef === 'function' && WeakRef.prototype;
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
var bigIntValueOf = typeof BigInt === 'function' ? BigInt.prototype.valueOf : null;
var gOPS = Object.getOwnPropertySymbols;
var symToString = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? Symbol.prototype.toString : null;
var hasShammedSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'object';
// ie, `has-tostringtag/shams
var toStringTag = typeof Symbol === 'function' && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? 'object' : 'symbol')
    ? Symbol.toStringTag
    : null;
var isEnumerable = Object.prototype.propertyIsEnumerable;

var gPO = (typeof Reflect === 'function' ? Reflect.getPrototypeOf : Object.getPrototypeOf) || (
    [].__proto__ === Array.prototype // eslint-disable-line no-proto
        ? function (O) {
            return O.__proto__; // eslint-disable-line no-proto
        }
        : null
);

function addNumericSeparator(num, str) {
    if (
        num === Infinity
        || num === -Infinity
        || num !== num
        || (num && num > -1000 && num < 1000)
        || $test.call(/e/, str)
    ) {
        return str;
    }
    var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
    if (typeof num === 'number') {
        var int = num < 0 ? -$floor(-num) : $floor(num); // trunc(num)
        if (int !== num) {
            var intStr = String(int);
            var dec = $slice.call(str, intStr.length + 1);
            return $replace.call(intStr, sepRegex, '$&_') + '.' + $replace.call($replace.call(dec, /([0-9]{3})/g, '$&_'), /_$/, '');
        }
    }
    return $replace.call(str, sepRegex, '$&_');
}

var utilInspect = __webpack_require__(58502);
var inspectCustom = utilInspect.custom;
var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;

var quotes = {
    __proto__: null,
    'double': '"',
    single: "'"
};
var quoteREs = {
    __proto__: null,
    'double': /(["\\])/g,
    single: /(['\\])/g
};

module.exports = function inspect_(obj, options, depth, seen) {
    var opts = options || {};

    if (has(opts, 'quoteStyle') && !has(quotes, opts.quoteStyle)) {
        throw new TypeError('option "quoteStyle" must be "single" or "double"');
    }
    if (
        has(opts, 'maxStringLength') && (typeof opts.maxStringLength === 'number'
            ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity
            : opts.maxStringLength !== null
        )
    ) {
        throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
    }
    var customInspect = has(opts, 'customInspect') ? opts.customInspect : true;
    if (typeof customInspect !== 'boolean' && customInspect !== 'symbol') {
        throw new TypeError('option "customInspect", if provided, must be `true`, `false`, or `\'symbol\'`');
    }

    if (
        has(opts, 'indent')
        && opts.indent !== null
        && opts.indent !== '\t'
        && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)
    ) {
        throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
    }
    if (has(opts, 'numericSeparator') && typeof opts.numericSeparator !== 'boolean') {
        throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
    }
    var numericSeparator = opts.numericSeparator;

    if (typeof obj === 'undefined') {
        return 'undefined';
    }
    if (obj === null) {
        return 'null';
    }
    if (typeof obj === 'boolean') {
        return obj ? 'true' : 'false';
    }

    if (typeof obj === 'string') {
        return inspectString(obj, opts);
    }
    if (typeof obj === 'number') {
        if (obj === 0) {
            return Infinity / obj > 0 ? '0' : '-0';
        }
        var str = String(obj);
        return numericSeparator ? addNumericSeparator(obj, str) : str;
    }
    if (typeof obj === 'bigint') {
        var bigIntStr = String(obj) + 'n';
        return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
    }

    var maxDepth = typeof opts.depth === 'undefined' ? 5 : opts.depth;
    if (typeof depth === 'undefined') { depth = 0; }
    if (depth >= maxDepth && maxDepth > 0 && typeof obj === 'object') {
        return isArray(obj) ? '[Array]' : '[Object]';
    }

    var indent = getIndent(opts, depth);

    if (typeof seen === 'undefined') {
        seen = [];
    } else if (indexOf(seen, obj) >= 0) {
        return '[Circular]';
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
            if (has(opts, 'quoteStyle')) {
                newOpts.quoteStyle = opts.quoteStyle;
            }
            return inspect_(value, newOpts, depth + 1, seen);
        }
        return inspect_(value, opts, depth + 1, seen);
    }

    if (typeof obj === 'function' && !isRegExp(obj)) { // in older engines, regexes are callable
        var name = nameOf(obj);
        var keys = arrObjKeys(obj, inspect);
        return '[Function' + (name ? ': ' + name : ' (anonymous)') + ']' + (keys.length > 0 ? ' { ' + $join.call(keys, ', ') + ' }' : '');
    }
    if (isSymbol(obj)) {
        var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, '$1') : symToString.call(obj);
        return typeof obj === 'object' && !hasShammedSymbols ? markBoxed(symString) : symString;
    }
    if (isElement(obj)) {
        var s = '<' + $toLowerCase.call(String(obj.nodeName));
        var attrs = obj.attributes || [];
        for (var i = 0; i < attrs.length; i++) {
            s += ' ' + attrs[i].name + '=' + wrapQuotes(quote(attrs[i].value), 'double', opts);
        }
        s += '>';
        if (obj.childNodes && obj.childNodes.length) { s += '...'; }
        s += '</' + $toLowerCase.call(String(obj.nodeName)) + '>';
        return s;
    }
    if (isArray(obj)) {
        if (obj.length === 0) { return '[]'; }
        var xs = arrObjKeys(obj, inspect);
        if (indent && !singleLineValues(xs)) {
            return '[' + indentedJoin(xs, indent) + ']';
        }
        return '[ ' + $join.call(xs, ', ') + ' ]';
    }
    if (isError(obj)) {
        var parts = arrObjKeys(obj, inspect);
        if (!('cause' in Error.prototype) && 'cause' in obj && !isEnumerable.call(obj, 'cause')) {
            return '{ [' + String(obj) + '] ' + $join.call($concat.call('[cause]: ' + inspect(obj.cause), parts), ', ') + ' }';
        }
        if (parts.length === 0) { return '[' + String(obj) + ']'; }
        return '{ [' + String(obj) + '] ' + $join.call(parts, ', ') + ' }';
    }
    if (typeof obj === 'object' && customInspect) {
        if (inspectSymbol && typeof obj[inspectSymbol] === 'function' && utilInspect) {
            return utilInspect(obj, { depth: maxDepth - depth });
        } else if (customInspect !== 'symbol' && typeof obj.inspect === 'function') {
            return obj.inspect();
        }
    }
    if (isMap(obj)) {
        var mapParts = [];
        if (mapForEach) {
            mapForEach.call(obj, function (value, key) {
                mapParts.push(inspect(key, obj, true) + ' => ' + inspect(value, obj));
            });
        }
        return collectionOf('Map', mapSize.call(obj), mapParts, indent);
    }
    if (isSet(obj)) {
        var setParts = [];
        if (setForEach) {
            setForEach.call(obj, function (value) {
                setParts.push(inspect(value, obj));
            });
        }
        return collectionOf('Set', setSize.call(obj), setParts, indent);
    }
    if (isWeakMap(obj)) {
        return weakCollectionOf('WeakMap');
    }
    if (isWeakSet(obj)) {
        return weakCollectionOf('WeakSet');
    }
    if (isWeakRef(obj)) {
        return weakCollectionOf('WeakRef');
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
    // note: in IE 8, sometimes `global !== window` but both are the prototypes of each other
    /* eslint-env browser */
    if (typeof window !== 'undefined' && obj === window) {
        return '{ [object Window] }';
    }
    if (
        (typeof globalThis !== 'undefined' && obj === globalThis)
        || (typeof global !== 'undefined' && obj === global)
    ) {
        return '{ [object globalThis] }';
    }
    if (!isDate(obj) && !isRegExp(obj)) {
        var ys = arrObjKeys(obj, inspect);
        var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
        var protoTag = obj instanceof Object ? '' : 'null prototype';
        var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? 'Object' : '';
        var constructorTag = isPlainObject || typeof obj.constructor !== 'function' ? '' : obj.constructor.name ? obj.constructor.name + ' ' : '';
        var tag = constructorTag + (stringTag || protoTag ? '[' + $join.call($concat.call([], stringTag || [], protoTag || []), ': ') + '] ' : '');
        if (ys.length === 0) { return tag + '{}'; }
        if (indent) {
            return tag + '{' + indentedJoin(ys, indent) + '}';
        }
        return tag + '{ ' + $join.call(ys, ', ') + ' }';
    }
    return String(obj);
};

function wrapQuotes(s, defaultStyle, opts) {
    var style = opts.quoteStyle || defaultStyle;
    var quoteChar = quotes[style];
    return quoteChar + s + quoteChar;
}

function quote(s) {
    return $replace.call(String(s), /"/g, '&quot;');
}

function isArray(obj) { return toStr(obj) === '[object Array]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isDate(obj) { return toStr(obj) === '[object Date]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isRegExp(obj) { return toStr(obj) === '[object RegExp]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isError(obj) { return toStr(obj) === '[object Error]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isString(obj) { return toStr(obj) === '[object String]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isNumber(obj) { return toStr(obj) === '[object Number]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isBoolean(obj) { return toStr(obj) === '[object Boolean]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }

// Symbol and BigInt do have Symbol.toStringTag by spec, so that can't be used to eliminate false positives
function isSymbol(obj) {
    if (hasShammedSymbols) {
        return obj && typeof obj === 'object' && obj instanceof Symbol;
    }
    if (typeof obj === 'symbol') {
        return true;
    }
    if (!obj || typeof obj !== 'object' || !symToString) {
        return false;
    }
    try {
        symToString.call(obj);
        return true;
    } catch (e) {}
    return false;
}

function isBigInt(obj) {
    if (!obj || typeof obj !== 'object' || !bigIntValueOf) {
        return false;
    }
    try {
        bigIntValueOf.call(obj);
        return true;
    } catch (e) {}
    return false;
}

var hasOwn = Object.prototype.hasOwnProperty || function (key) { return key in this; };
function has(obj, key) {
    return hasOwn.call(obj, key);
}

function toStr(obj) {
    return objectToString.call(obj);
}

function nameOf(f) {
    if (f.name) { return f.name; }
    var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
    if (m) { return m[1]; }
    return null;
}

function indexOf(xs, x) {
    if (xs.indexOf) { return xs.indexOf(x); }
    for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) { return i; }
    }
    return -1;
}

function isMap(x) {
    if (!mapSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        mapSize.call(x);
        try {
            setSize.call(x);
        } catch (s) {
            return true;
        }
        return x instanceof Map; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakMap(x) {
    if (!weakMapHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakMapHas.call(x, weakMapHas);
        try {
            weakSetHas.call(x, weakSetHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakMap; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakRef(x) {
    if (!weakRefDeref || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakRefDeref.call(x);
        return true;
    } catch (e) {}
    return false;
}

function isSet(x) {
    if (!setSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        setSize.call(x);
        try {
            mapSize.call(x);
        } catch (m) {
            return true;
        }
        return x instanceof Set; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakSet(x) {
    if (!weakSetHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakSetHas.call(x, weakSetHas);
        try {
            weakMapHas.call(x, weakMapHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakSet; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isElement(x) {
    if (!x || typeof x !== 'object') { return false; }
    if (typeof HTMLElement !== 'undefined' && x instanceof HTMLElement) {
        return true;
    }
    return typeof x.nodeName === 'string' && typeof x.getAttribute === 'function';
}

function inspectString(str, opts) {
    if (str.length > opts.maxStringLength) {
        var remaining = str.length - opts.maxStringLength;
        var trailer = '... ' + remaining + ' more character' + (remaining > 1 ? 's' : '');
        return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
    }
    var quoteRE = quoteREs[opts.quoteStyle || 'single'];
    quoteRE.lastIndex = 0;
    // eslint-disable-next-line no-control-regex
    var s = $replace.call($replace.call(str, quoteRE, '\\$1'), /[\x00-\x1f]/g, lowbyte);
    return wrapQuotes(s, 'single', opts);
}

function lowbyte(c) {
    var n = c.charCodeAt(0);
    var x = {
        8: 'b',
        9: 't',
        10: 'n',
        12: 'f',
        13: 'r'
    }[n];
    if (x) { return '\\' + x; }
    return '\\x' + (n < 0x10 ? '0' : '') + $toUpperCase.call(n.toString(16));
}

function markBoxed(str) {
    return 'Object(' + str + ')';
}

function weakCollectionOf(type) {
    return type + ' { ? }';
}

function collectionOf(type, size, entries, indent) {
    var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ', ');
    return type + ' (' + size + ') {' + joinedEntries + '}';
}

function singleLineValues(xs) {
    for (var i = 0; i < xs.length; i++) {
        if (indexOf(xs[i], '\n') >= 0) {
            return false;
        }
    }
    return true;
}

function getIndent(opts, depth) {
    var baseIndent;
    if (opts.indent === '\t') {
        baseIndent = '\t';
    } else if (typeof opts.indent === 'number' && opts.indent > 0) {
        baseIndent = $join.call(Array(opts.indent + 1), ' ');
    } else {
        return null;
    }
    return {
        base: baseIndent,
        prev: $join.call(Array(depth + 1), baseIndent)
    };
}

function indentedJoin(xs, indent) {
    if (xs.length === 0) { return ''; }
    var lineJoiner = '\n' + indent.prev + indent.base;
    return lineJoiner + $join.call(xs, ',' + lineJoiner) + '\n' + indent.prev;
}

function arrObjKeys(obj, inspect) {
    var isArr = isArray(obj);
    var xs = [];
    if (isArr) {
        xs.length = obj.length;
        for (var i = 0; i < obj.length; i++) {
            xs[i] = has(obj, i) ? inspect(obj[i], obj) : '';
        }
    }
    var syms = typeof gOPS === 'function' ? gOPS(obj) : [];
    var symMap;
    if (hasShammedSymbols) {
        symMap = {};
        for (var k = 0; k < syms.length; k++) {
            symMap['$' + syms[k]] = syms[k];
        }
    }

    for (var key in obj) { // eslint-disable-line no-restricted-syntax
        if (!has(obj, key)) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
        if (isArr && String(Number(key)) === key && key < obj.length) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
        if (hasShammedSymbols && symMap['$' + key] instanceof Symbol) {
            // this is to prevent shammed Symbols, which are stored as strings, from being included in the string key section
            continue; // eslint-disable-line no-restricted-syntax, no-continue
        } else if ($test.call(/[^\w$]/, key)) {
            xs.push(inspect(key, obj) + ': ' + inspect(obj[key], obj));
        } else {
            xs.push(key + ': ' + inspect(obj[key], obj));
        }
    }
    if (typeof gOPS === 'function') {
        for (var j = 0; j < syms.length; j++) {
            if (isEnumerable.call(obj, syms[j])) {
                xs.push('[' + inspect(syms[j]) + ']: ' + inspect(obj[syms[j]], obj));
            }
        }
    }
    return xs;
}


/***/ }),

/***/ 58502:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(39023).inspect;


/***/ }),

/***/ 43379:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = __webpack_require__(73505);


/***/ }),

/***/ 30742:
/***/ ((module) => {

"use strict";


const WIN_SLASH = '\\\\/';
const WIN_NO_SLASH = `[^${WIN_SLASH}]`;

/**
 * Posix glob regex
 */

const DOT_LITERAL = '\\.';
const PLUS_LITERAL = '\\+';
const QMARK_LITERAL = '\\?';
const SLASH_LITERAL = '\\/';
const ONE_CHAR = '(?=.)';
const QMARK = '[^/]';
const END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
const START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
const DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
const NO_DOT = `(?!${DOT_LITERAL})`;
const NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
const NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
const NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
const QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
const STAR = `${QMARK}*?`;
const SEP = '/';

const POSIX_CHARS = {
  DOT_LITERAL,
  PLUS_LITERAL,
  QMARK_LITERAL,
  SLASH_LITERAL,
  ONE_CHAR,
  QMARK,
  END_ANCHOR,
  DOTS_SLASH,
  NO_DOT,
  NO_DOTS,
  NO_DOT_SLASH,
  NO_DOTS_SLASH,
  QMARK_NO_DOT,
  STAR,
  START_ANCHOR,
  SEP
};

/**
 * Windows glob regex
 */

const WINDOWS_CHARS = {
  ...POSIX_CHARS,

  SLASH_LITERAL: `[${WIN_SLASH}]`,
  QMARK: WIN_NO_SLASH,
  STAR: `${WIN_NO_SLASH}*?`,
  DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
  NO_DOT: `(?!${DOT_LITERAL})`,
  NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
  NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
  NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
  QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
  START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
  END_ANCHOR: `(?:[${WIN_SLASH}]|$)`,
  SEP: '\\'
};

/**
 * POSIX Bracket Regex
 */

const POSIX_REGEX_SOURCE = {
  alnum: 'a-zA-Z0-9',
  alpha: 'a-zA-Z',
  ascii: '\\x00-\\x7F',
  blank: ' \\t',
  cntrl: '\\x00-\\x1F\\x7F',
  digit: '0-9',
  graph: '\\x21-\\x7E',
  lower: 'a-z',
  print: '\\x20-\\x7E ',
  punct: '\\-!"#$%&\'()\\*+,./:;<=>?@[\\]^_`{|}~',
  space: ' \\t\\r\\n\\v\\f',
  upper: 'A-Z',
  word: 'A-Za-z0-9_',
  xdigit: 'A-Fa-f0-9'
};

module.exports = {
  MAX_LENGTH: 1024 * 64,
  POSIX_REGEX_SOURCE,

  // regular expressions
  REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
  REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
  REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
  REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
  REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
  REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,

  // Replace globs with equivalent patterns to reduce parsing time.
  REPLACEMENTS: {
    '***': '*',
    '**/**': '**',
    '**/**/**': '**'
  },

  // Digits
  CHAR_0: 48, /* 0 */
  CHAR_9: 57, /* 9 */

  // Alphabet chars.
  CHAR_UPPERCASE_A: 65, /* A */
  CHAR_LOWERCASE_A: 97, /* a */
  CHAR_UPPERCASE_Z: 90, /* Z */
  CHAR_LOWERCASE_Z: 122, /* z */

  CHAR_LEFT_PARENTHESES: 40, /* ( */
  CHAR_RIGHT_PARENTHESES: 41, /* ) */

  CHAR_ASTERISK: 42, /* * */

  // Non-alphabetic chars.
  CHAR_AMPERSAND: 38, /* & */
  CHAR_AT: 64, /* @ */
  CHAR_BACKWARD_SLASH: 92, /* \ */
  CHAR_CARRIAGE_RETURN: 13, /* \r */
  CHAR_CIRCUMFLEX_ACCENT: 94, /* ^ */
  CHAR_COLON: 58, /* : */
  CHAR_COMMA: 44, /* , */
  CHAR_DOT: 46, /* . */
  CHAR_DOUBLE_QUOTE: 34, /* " */
  CHAR_EQUAL: 61, /* = */
  CHAR_EXCLAMATION_MARK: 33, /* ! */
  CHAR_FORM_FEED: 12, /* \f */
  CHAR_FORWARD_SLASH: 47, /* / */
  CHAR_GRAVE_ACCENT: 96, /* ` */
  CHAR_HASH: 35, /* # */
  CHAR_HYPHEN_MINUS: 45, /* - */
  CHAR_LEFT_ANGLE_BRACKET: 60, /* < */
  CHAR_LEFT_CURLY_BRACE: 123, /* { */
  CHAR_LEFT_SQUARE_BRACKET: 91, /* [ */
  CHAR_LINE_FEED: 10, /* \n */
  CHAR_NO_BREAK_SPACE: 160, /* \u00A0 */
  CHAR_PERCENT: 37, /* % */
  CHAR_PLUS: 43, /* + */
  CHAR_QUESTION_MARK: 63, /* ? */
  CHAR_RIGHT_ANGLE_BRACKET: 62, /* > */
  CHAR_RIGHT_CURLY_BRACE: 125, /* } */
  CHAR_RIGHT_SQUARE_BRACKET: 93, /* ] */
  CHAR_SEMICOLON: 59, /* ; */
  CHAR_SINGLE_QUOTE: 39, /* ' */
  CHAR_SPACE: 32, /*   */
  CHAR_TAB: 9, /* \t */
  CHAR_UNDERSCORE: 95, /* _ */
  CHAR_VERTICAL_LINE: 124, /* | */
  CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279, /* \uFEFF */

  /**
   * Create EXTGLOB_CHARS
   */

  extglobChars(chars) {
    return {
      '!': { type: 'negate', open: '(?:(?!(?:', close: `))${chars.STAR})` },
      '?': { type: 'qmark', open: '(?:', close: ')?' },
      '+': { type: 'plus', open: '(?:', close: ')+' },
      '*': { type: 'star', open: '(?:', close: ')*' },
      '@': { type: 'at', open: '(?:', close: ')' }
    };
  },

  /**
   * Create GLOB_CHARS
   */

  globChars(win32) {
    return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
  }
};


/***/ }),

/***/ 31276:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const constants = __webpack_require__(30742);
const utils = __webpack_require__(32430);

/**
 * Constants
 */

const {
  MAX_LENGTH,
  POSIX_REGEX_SOURCE,
  REGEX_NON_SPECIAL_CHARS,
  REGEX_SPECIAL_CHARS_BACKREF,
  REPLACEMENTS
} = constants;

/**
 * Helpers
 */

const expandRange = (args, options) => {
  if (typeof options.expandRange === 'function') {
    return options.expandRange(...args, options);
  }

  args.sort();
  const value = `[${args.join('-')}]`;

  try {
    /* eslint-disable-next-line no-new */
    new RegExp(value);
  } catch (ex) {
    return args.map(v => utils.escapeRegex(v)).join('..');
  }

  return value;
};

/**
 * Create the message for a syntax error
 */

const syntaxError = (type, char) => {
  return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
};

/**
 * Parse the given input string.
 * @param {String} input
 * @param {Object} options
 * @return {Object}
 */

const parse = (input, options) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected a string');
  }

  input = REPLACEMENTS[input] || input;

  const opts = { ...options };
  const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;

  let len = input.length;
  if (len > max) {
    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
  }

  const bos = { type: 'bos', value: '', output: opts.prepend || '' };
  const tokens = [bos];

  const capture = opts.capture ? '' : '?:';

  // create constants based on platform, for windows or posix
  const PLATFORM_CHARS = constants.globChars(opts.windows);
  const EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS);

  const {
    DOT_LITERAL,
    PLUS_LITERAL,
    SLASH_LITERAL,
    ONE_CHAR,
    DOTS_SLASH,
    NO_DOT,
    NO_DOT_SLASH,
    NO_DOTS_SLASH,
    QMARK,
    QMARK_NO_DOT,
    STAR,
    START_ANCHOR
  } = PLATFORM_CHARS;

  const globstar = (opts) => {
    return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
  };

  const nodot = opts.dot ? '' : NO_DOT;
  const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
  let star = opts.bash === true ? globstar(opts) : STAR;

  if (opts.capture) {
    star = `(${star})`;
  }

  // minimatch options support
  if (typeof opts.noext === 'boolean') {
    opts.noextglob = opts.noext;
  }

  const state = {
    input,
    index: -1,
    start: 0,
    dot: opts.dot === true,
    consumed: '',
    output: '',
    prefix: '',
    backtrack: false,
    negated: false,
    brackets: 0,
    braces: 0,
    parens: 0,
    quotes: 0,
    globstar: false,
    tokens
  };

  input = utils.removePrefix(input, state);
  len = input.length;

  const extglobs = [];
  const braces = [];
  const stack = [];
  let prev = bos;
  let value;

  /**
   * Tokenizing helpers
   */

  const eos = () => state.index === len - 1;
  const peek = state.peek = (n = 1) => input[state.index + n];
  const advance = state.advance = () => input[++state.index];
  const remaining = () => input.slice(state.index + 1);
  const consume = (value = '', num = 0) => {
    state.consumed += value;
    state.index += num;
  };
  const append = token => {
    state.output += token.output != null ? token.output : token.value;
    consume(token.value);
  };

  const negate = () => {
    let count = 1;

    while (peek() === '!' && (peek(2) !== '(' || peek(3) === '?')) {
      advance();
      state.start++;
      count++;
    }

    if (count % 2 === 0) {
      return false;
    }

    state.negated = true;
    state.start++;
    return true;
  };

  const increment = type => {
    state[type]++;
    stack.push(type);
  };

  const decrement = type => {
    state[type]--;
    stack.pop();
  };

  /**
   * Push tokens onto the tokens array. This helper speeds up
   * tokenizing by 1) helping us avoid backtracking as much as possible,
   * and 2) helping us avoid creating extra tokens when consecutive
   * characters are plain text. This improves performance and simplifies
   * lookbehinds.
   */

  const push = tok => {
    if (prev.type === 'globstar') {
      const isBrace = state.braces > 0 && (tok.type === 'comma' || tok.type === 'brace');
      const isExtglob = tok.extglob === true || (extglobs.length && (tok.type === 'pipe' || tok.type === 'paren'));

      if (tok.type !== 'slash' && tok.type !== 'paren' && !isBrace && !isExtglob) {
        state.output = state.output.slice(0, -prev.output.length);
        prev.type = 'star';
        prev.value = '*';
        prev.output = star;
        state.output += prev.output;
      }
    }

    if (extglobs.length && tok.type !== 'paren' && !EXTGLOB_CHARS[tok.value]) {
      extglobs[extglobs.length - 1].inner += tok.value;
    }

    if (tok.value || tok.output) append(tok);
    if (prev && prev.type === 'text' && tok.type === 'text') {
      prev.value += tok.value;
      prev.output = (prev.output || '') + tok.value;
      return;
    }

    tok.prev = prev;
    tokens.push(tok);
    prev = tok;
  };

  const extglobOpen = (type, value) => {
    const token = { ...EXTGLOB_CHARS[value], conditions: 1, inner: '' };

    token.prev = prev;
    token.parens = state.parens;
    token.output = state.output;
    const output = (opts.capture ? '(' : '') + token.open;

    increment('parens');
    push({ type, value, output: state.output ? '' : ONE_CHAR });
    push({ type: 'paren', extglob: true, value: advance(), output });
    extglobs.push(token);
  };

  const extglobClose = token => {
    let output = token.close + (opts.capture ? ')' : '');

    if (token.type === 'negate') {
      let extglobStar = star;

      if (token.inner && token.inner.length > 1 && token.inner.includes('/')) {
        extglobStar = globstar(opts);
      }

      if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) {
        output = token.close = `)$))${extglobStar}`;
      }

      if (token.prev.type === 'bos' && eos()) {
        state.negatedExtglob = true;
      }
    }

    push({ type: 'paren', extglob: true, value, output });
    decrement('parens');
  };

  /**
   * Fast paths
   */

  if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
    let backslashes = false;

    let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index) => {
      if (first === '\\') {
        backslashes = true;
        return m;
      }

      if (first === '?') {
        if (esc) {
          return esc + first + (rest ? QMARK.repeat(rest.length) : '');
        }
        if (index === 0) {
          return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : '');
        }
        return QMARK.repeat(chars.length);
      }

      if (first === '.') {
        return DOT_LITERAL.repeat(chars.length);
      }

      if (first === '*') {
        if (esc) {
          return esc + first + (rest ? star : '');
        }
        return star;
      }
      return esc ? m : `\\${m}`;
    });

    if (backslashes === true) {
      if (opts.unescape === true) {
        output = output.replace(/\\/g, '');
      } else {
        output = output.replace(/\\+/g, m => {
          return m.length % 2 === 0 ? '\\\\' : (m ? '\\' : '');
        });
      }
    }

    if (output === input && opts.contains === true) {
      state.output = input;
      return state;
    }

    state.output = utils.wrapOutput(output, state, options);
    return state;
  }

  /**
   * Tokenize input until we reach end-of-string
   */

  while (!eos()) {
    value = advance();

    if (value === '\u0000') {
      continue;
    }

    /**
     * Escaped characters
     */

    if (value === '\\') {
      const next = peek();

      if (next === '/' && opts.bash !== true) {
        continue;
      }

      if (next === '.' || next === ';') {
        continue;
      }

      if (!next) {
        value += '\\';
        push({ type: 'text', value });
        continue;
      }

      // collapse slashes to reduce potential for exploits
      const match = /^\\+/.exec(remaining());
      let slashes = 0;

      if (match && match[0].length > 2) {
        slashes = match[0].length;
        state.index += slashes;
        if (slashes % 2 !== 0) {
          value += '\\';
        }
      }

      if (opts.unescape === true) {
        value = advance() || '';
      } else {
        value += advance() || '';
      }

      if (state.brackets === 0) {
        push({ type: 'text', value });
        continue;
      }
    }

    /**
     * If we're inside a regex character class, continue
     * until we reach the closing bracket.
     */

    if (state.brackets > 0 && (value !== ']' || prev.value === '[' || prev.value === '[^')) {
      if (opts.posix !== false && value === ':') {
        const inner = prev.value.slice(1);
        if (inner.includes('[')) {
          prev.posix = true;

          if (inner.includes(':')) {
            const idx = prev.value.lastIndexOf('[');
            const pre = prev.value.slice(0, idx);
            const rest = prev.value.slice(idx + 2);
            const posix = POSIX_REGEX_SOURCE[rest];
            if (posix) {
              prev.value = pre + posix;
              state.backtrack = true;
              advance();

              if (!bos.output && tokens.indexOf(prev) === 1) {
                bos.output = ONE_CHAR;
              }
              continue;
            }
          }
        }
      }

      if ((value === '[' && peek() !== ':') || (value === '-' && peek() === ']')) {
        value = `\\${value}`;
      }

      if (value === ']' && (prev.value === '[' || prev.value === '[^')) {
        value = `\\${value}`;
      }

      if (opts.posix === true && value === '!' && prev.value === '[') {
        value = '^';
      }

      prev.value += value;
      append({ value });
      continue;
    }

    /**
     * If we're inside a quoted string, continue
     * until we reach the closing double quote.
     */

    if (state.quotes === 1 && value !== '"') {
      value = utils.escapeRegex(value);
      prev.value += value;
      append({ value });
      continue;
    }

    /**
     * Double quotes
     */

    if (value === '"') {
      state.quotes = state.quotes === 1 ? 0 : 1;
      if (opts.keepQuotes === true) {
        push({ type: 'text', value });
      }
      continue;
    }

    /**
     * Parentheses
     */

    if (value === '(') {
      increment('parens');
      push({ type: 'paren', value });
      continue;
    }

    if (value === ')') {
      if (state.parens === 0 && opts.strictBrackets === true) {
        throw new SyntaxError(syntaxError('opening', '('));
      }

      const extglob = extglobs[extglobs.length - 1];
      if (extglob && state.parens === extglob.parens + 1) {
        extglobClose(extglobs.pop());
        continue;
      }

      push({ type: 'paren', value, output: state.parens ? ')' : '\\)' });
      decrement('parens');
      continue;
    }

    /**
     * Square brackets
     */

    if (value === '[') {
      if (opts.nobracket === true || !remaining().includes(']')) {
        if (opts.nobracket !== true && opts.strictBrackets === true) {
          throw new SyntaxError(syntaxError('closing', ']'));
        }

        value = `\\${value}`;
      } else {
        increment('brackets');
      }

      push({ type: 'bracket', value });
      continue;
    }

    if (value === ']') {
      if (opts.nobracket === true || (prev && prev.type === 'bracket' && prev.value.length === 1)) {
        push({ type: 'text', value, output: `\\${value}` });
        continue;
      }

      if (state.brackets === 0) {
        if (opts.strictBrackets === true) {
          throw new SyntaxError(syntaxError('opening', '['));
        }

        push({ type: 'text', value, output: `\\${value}` });
        continue;
      }

      decrement('brackets');

      const prevValue = prev.value.slice(1);
      if (prev.posix !== true && prevValue[0] === '^' && !prevValue.includes('/')) {
        value = `/${value}`;
      }

      prev.value += value;
      append({ value });

      // when literal brackets are explicitly disabled
      // assume we should match with a regex character class
      if (opts.literalBrackets === false || utils.hasRegexChars(prevValue)) {
        continue;
      }

      const escaped = utils.escapeRegex(prev.value);
      state.output = state.output.slice(0, -prev.value.length);

      // when literal brackets are explicitly enabled
      // assume we should escape the brackets to match literal characters
      if (opts.literalBrackets === true) {
        state.output += escaped;
        prev.value = escaped;
        continue;
      }

      // when the user specifies nothing, try to match both
      prev.value = `(${capture}${escaped}|${prev.value})`;
      state.output += prev.value;
      continue;
    }

    /**
     * Braces
     */

    if (value === '{' && opts.nobrace !== true) {
      increment('braces');

      const open = {
        type: 'brace',
        value,
        output: '(',
        outputIndex: state.output.length,
        tokensIndex: state.tokens.length
      };

      braces.push(open);
      push(open);
      continue;
    }

    if (value === '}') {
      const brace = braces[braces.length - 1];

      if (opts.nobrace === true || !brace) {
        push({ type: 'text', value, output: value });
        continue;
      }

      let output = ')';

      if (brace.dots === true) {
        const arr = tokens.slice();
        const range = [];

        for (let i = arr.length - 1; i >= 0; i--) {
          tokens.pop();
          if (arr[i].type === 'brace') {
            break;
          }
          if (arr[i].type !== 'dots') {
            range.unshift(arr[i].value);
          }
        }

        output = expandRange(range, opts);
        state.backtrack = true;
      }

      if (brace.comma !== true && brace.dots !== true) {
        const out = state.output.slice(0, brace.outputIndex);
        const toks = state.tokens.slice(brace.tokensIndex);
        brace.value = brace.output = '\\{';
        value = output = '\\}';
        state.output = out;
        for (const t of toks) {
          state.output += (t.output || t.value);
        }
      }

      push({ type: 'brace', value, output });
      decrement('braces');
      braces.pop();
      continue;
    }

    /**
     * Pipes
     */

    if (value === '|') {
      if (extglobs.length > 0) {
        extglobs[extglobs.length - 1].conditions++;
      }
      push({ type: 'text', value });
      continue;
    }

    /**
     * Commas
     */

    if (value === ',') {
      let output = value;

      const brace = braces[braces.length - 1];
      if (brace && stack[stack.length - 1] === 'braces') {
        brace.comma = true;
        output = '|';
      }

      push({ type: 'comma', value, output });
      continue;
    }

    /**
     * Slashes
     */

    if (value === '/') {
      // if the beginning of the glob is "./", advance the start
      // to the current index, and don't add the "./" characters
      // to the state. This greatly simplifies lookbehinds when
      // checking for BOS characters like "!" and "." (not "./")
      if (prev.type === 'dot' && state.index === state.start + 1) {
        state.start = state.index + 1;
        state.consumed = '';
        state.output = '';
        tokens.pop();
        prev = bos; // reset "prev" to the first token
        continue;
      }

      push({ type: 'slash', value, output: SLASH_LITERAL });
      continue;
    }

    /**
     * Dots
     */

    if (value === '.') {
      if (state.braces > 0 && prev.type === 'dot') {
        if (prev.value === '.') prev.output = DOT_LITERAL;
        const brace = braces[braces.length - 1];
        prev.type = 'dots';
        prev.output += value;
        prev.value += value;
        brace.dots = true;
        continue;
      }

      if ((state.braces + state.parens) === 0 && prev.type !== 'bos' && prev.type !== 'slash') {
        push({ type: 'text', value, output: DOT_LITERAL });
        continue;
      }

      push({ type: 'dot', value, output: DOT_LITERAL });
      continue;
    }

    /**
     * Question marks
     */

    if (value === '?') {
      const isGroup = prev && prev.value === '(';
      if (!isGroup && opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        extglobOpen('qmark', value);
        continue;
      }

      if (prev && prev.type === 'paren') {
        const next = peek();
        let output = value;

        if (next === '<' && !utils.supportsLookbehinds()) {
          throw new Error('Node.js v10 or higher is required for regex lookbehinds');
        }

        if ((prev.value === '(' && !/[!=<:]/.test(next)) || (next === '<' && !/<([!=]|\w+>)/.test(remaining()))) {
          output = `\\${value}`;
        }

        push({ type: 'text', value, output });
        continue;
      }

      if (opts.dot !== true && (prev.type === 'slash' || prev.type === 'bos')) {
        push({ type: 'qmark', value, output: QMARK_NO_DOT });
        continue;
      }

      push({ type: 'qmark', value, output: QMARK });
      continue;
    }

    /**
     * Exclamation
     */

    if (value === '!') {
      if (opts.noextglob !== true && peek() === '(') {
        if (peek(2) !== '?' || !/[!=<:]/.test(peek(3))) {
          extglobOpen('negate', value);
          continue;
        }
      }

      if (opts.nonegate !== true && state.index === 0) {
        negate();
        continue;
      }
    }

    /**
     * Plus
     */

    if (value === '+') {
      if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        extglobOpen('plus', value);
        continue;
      }

      if ((prev && prev.value === '(') || opts.regex === false) {
        push({ type: 'plus', value, output: PLUS_LITERAL });
        continue;
      }

      if ((prev && (prev.type === 'bracket' || prev.type === 'paren' || prev.type === 'brace')) || state.parens > 0) {
        push({ type: 'plus', value });
        continue;
      }

      push({ type: 'plus', value: PLUS_LITERAL });
      continue;
    }

    /**
     * Plain text
     */

    if (value === '@') {
      if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        push({ type: 'at', extglob: true, value, output: '' });
        continue;
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Plain text
     */

    if (value !== '*') {
      if (value === '$' || value === '^') {
        value = `\\${value}`;
      }

      const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
      if (match) {
        value += match[0];
        state.index += match[0].length;
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Stars
     */

    if (prev && (prev.type === 'globstar' || prev.star === true)) {
      prev.type = 'star';
      prev.star = true;
      prev.value += value;
      prev.output = star;
      state.backtrack = true;
      state.globstar = true;
      consume(value);
      continue;
    }

    let rest = remaining();
    if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
      extglobOpen('star', value);
      continue;
    }

    if (prev.type === 'star') {
      if (opts.noglobstar === true) {
        consume(value);
        continue;
      }

      const prior = prev.prev;
      const before = prior.prev;
      const isStart = prior.type === 'slash' || prior.type === 'bos';
      const afterStar = before && (before.type === 'star' || before.type === 'globstar');

      if (opts.bash === true && (!isStart || (rest[0] && rest[0] !== '/'))) {
        push({ type: 'star', value, output: '' });
        continue;
      }

      const isBrace = state.braces > 0 && (prior.type === 'comma' || prior.type === 'brace');
      const isExtglob = extglobs.length && (prior.type === 'pipe' || prior.type === 'paren');
      if (!isStart && prior.type !== 'paren' && !isBrace && !isExtglob) {
        push({ type: 'star', value, output: '' });
        continue;
      }

      // strip consecutive `/**/`
      while (rest.slice(0, 3) === '/**') {
        const after = input[state.index + 4];
        if (after && after !== '/') {
          break;
        }
        rest = rest.slice(3);
        consume('/**', 3);
      }

      if (prior.type === 'bos' && eos()) {
        prev.type = 'globstar';
        prev.value += value;
        prev.output = globstar(opts);
        state.output = prev.output;
        state.globstar = true;
        consume(value);
        continue;
      }

      if (prior.type === 'slash' && prior.prev.type !== 'bos' && !afterStar && eos()) {
        state.output = state.output.slice(0, -(prior.output + prev.output).length);
        prior.output = `(?:${prior.output}`;

        prev.type = 'globstar';
        prev.output = globstar(opts) + (opts.strictSlashes ? ')' : '|$)');
        prev.value += value;
        state.globstar = true;
        state.output += prior.output + prev.output;
        consume(value);
        continue;
      }

      if (prior.type === 'slash' && prior.prev.type !== 'bos' && rest[0] === '/') {
        const end = rest[1] !== void 0 ? '|$' : '';

        state.output = state.output.slice(0, -(prior.output + prev.output).length);
        prior.output = `(?:${prior.output}`;

        prev.type = 'globstar';
        prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
        prev.value += value;

        state.output += prior.output + prev.output;
        state.globstar = true;

        consume(value + advance());

        push({ type: 'slash', value: '/', output: '' });
        continue;
      }

      if (prior.type === 'bos' && rest[0] === '/') {
        prev.type = 'globstar';
        prev.value += value;
        prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
        state.output = prev.output;
        state.globstar = true;
        consume(value + advance());
        push({ type: 'slash', value: '/', output: '' });
        continue;
      }

      // remove single star from output
      state.output = state.output.slice(0, -prev.output.length);

      // reset previous token to globstar
      prev.type = 'globstar';
      prev.output = globstar(opts);
      prev.value += value;

      // reset output with globstar
      state.output += prev.output;
      state.globstar = true;
      consume(value);
      continue;
    }

    const token = { type: 'star', value, output: star };

    if (opts.bash === true) {
      token.output = '.*?';
      if (prev.type === 'bos' || prev.type === 'slash') {
        token.output = nodot + token.output;
      }
      push(token);
      continue;
    }

    if (prev && (prev.type === 'bracket' || prev.type === 'paren') && opts.regex === true) {
      token.output = value;
      push(token);
      continue;
    }

    if (state.index === state.start || prev.type === 'slash' || prev.type === 'dot') {
      if (prev.type === 'dot') {
        state.output += NO_DOT_SLASH;
        prev.output += NO_DOT_SLASH;

      } else if (opts.dot === true) {
        state.output += NO_DOTS_SLASH;
        prev.output += NO_DOTS_SLASH;

      } else {
        state.output += nodot;
        prev.output += nodot;
      }

      if (peek() !== '*') {
        state.output += ONE_CHAR;
        prev.output += ONE_CHAR;
      }
    }

    push(token);
  }

  while (state.brackets > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', ']'));
    state.output = utils.escapeLast(state.output, '[');
    decrement('brackets');
  }

  while (state.parens > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', ')'));
    state.output = utils.escapeLast(state.output, '(');
    decrement('parens');
  }

  while (state.braces > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', '}'));
    state.output = utils.escapeLast(state.output, '{');
    decrement('braces');
  }

  if (opts.strictSlashes !== true && (prev.type === 'star' || prev.type === 'bracket')) {
    push({ type: 'maybe_slash', value: '', output: `${SLASH_LITERAL}?` });
  }

  // rebuild the output if we had to backtrack at any point
  if (state.backtrack === true) {
    state.output = '';

    for (const token of state.tokens) {
      state.output += token.output != null ? token.output : token.value;

      if (token.suffix) {
        state.output += token.suffix;
      }
    }
  }

  return state;
};

/**
 * Fast paths for creating regular expressions for common glob patterns.
 * This can significantly speed up processing and has very little downside
 * impact when none of the fast paths match.
 */

parse.fastpaths = (input, options) => {
  const opts = { ...options };
  const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
  const len = input.length;
  if (len > max) {
    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
  }

  input = REPLACEMENTS[input] || input;

  // create constants based on platform, for windows or posix
  const {
    DOT_LITERAL,
    SLASH_LITERAL,
    ONE_CHAR,
    DOTS_SLASH,
    NO_DOT,
    NO_DOTS,
    NO_DOTS_SLASH,
    STAR,
    START_ANCHOR
  } = constants.globChars(opts.windows);

  const nodot = opts.dot ? NO_DOTS : NO_DOT;
  const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
  const capture = opts.capture ? '' : '?:';
  const state = { negated: false, prefix: '' };
  let star = opts.bash === true ? '.*?' : STAR;

  if (opts.capture) {
    star = `(${star})`;
  }

  const globstar = (opts) => {
    if (opts.noglobstar === true) return star;
    return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
  };

  const create = str => {
    switch (str) {
      case '*':
        return `${nodot}${ONE_CHAR}${star}`;

      case '.*':
        return `${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '*.*':
        return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '*/*':
        return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;

      case '**':
        return nodot + globstar(opts);

      case '**/*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;

      case '**/*.*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '**/.*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;

      default: {
        const match = /^(.*?)\.(\w+)$/.exec(str);
        if (!match) return;

        const source = create(match[1]);
        if (!source) return;

        return source + DOT_LITERAL + match[2];
      }
    }
  };

  const output = utils.removePrefix(input, state);
  let source = create(output);

  if (source && opts.strictSlashes !== true) {
    source += `${SLASH_LITERAL}?`;
  }

  return source;
};

module.exports = parse;


/***/ }),

/***/ 73505:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const scan = __webpack_require__(19818);
const parse = __webpack_require__(31276);
const utils = __webpack_require__(32430);
const constants = __webpack_require__(30742);
const isObject = val => val && typeof val === 'object' && !Array.isArray(val);

/**
 * Creates a matcher function from one or more glob patterns. The
 * returned function takes a string to match as its first argument,
 * and returns true if the string is a match. The returned matcher
 * function also takes a boolean as the second argument that, when true,
 * returns an object with additional information.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch(glob[, options]);
 *
 * const isMatch = picomatch('*.!(*a)');
 * console.log(isMatch('a.a')); //=> false
 * console.log(isMatch('a.b')); //=> true
 * ```
 * @name picomatch
 * @param {String|Array} `globs` One or more glob patterns.
 * @param {Object=} `options`
 * @return {Function=} Returns a matcher function.
 * @api public
 */

const picomatch = (glob, options, returnState = false) => {
  if (Array.isArray(glob)) {
    const fns = glob.map(input => picomatch(input, options, returnState));
    const arrayMatcher = str => {
      for (const isMatch of fns) {
        const state = isMatch(str);
        if (state) return state;
      }
      return false;
    };
    return arrayMatcher;
  }

  const isState = isObject(glob) && glob.tokens && glob.input;

  if (glob === '' || (typeof glob !== 'string' && !isState)) {
    throw new TypeError('Expected pattern to be a non-empty string');
  }

  const opts = options || {};
  const posix = opts.windows;
  const regex = isState
    ? picomatch.compileRe(glob, options)
    : picomatch.makeRe(glob, options, false, true);

  const state = regex.state;
  delete regex.state;

  let isIgnored = () => false;
  if (opts.ignore) {
    const ignoreOpts = { ...options, ignore: null, onMatch: null, onResult: null };
    isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
  }

  const matcher = (input, returnObject = false) => {
    const { isMatch, match, output } = picomatch.test(input, regex, options, { glob, posix });
    const result = { glob, state, regex, posix, input, output, match, isMatch };

    if (typeof opts.onResult === 'function') {
      opts.onResult(result);
    }

    if (isMatch === false) {
      result.isMatch = false;
      return returnObject ? result : false;
    }

    if (isIgnored(input)) {
      if (typeof opts.onIgnore === 'function') {
        opts.onIgnore(result);
      }
      result.isMatch = false;
      return returnObject ? result : false;
    }

    if (typeof opts.onMatch === 'function') {
      opts.onMatch(result);
    }
    return returnObject ? result : true;
  };

  if (returnState) {
    matcher.state = state;
  }

  return matcher;
};

/**
 * Test `input` with the given `regex`. This is used by the main
 * `picomatch()` function to test the input string.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.test(input, regex[, options]);
 *
 * console.log(picomatch.test('foo/bar', /^(?:([^/]*?)\/([^/]*?))$/));
 * // { isMatch: true, match: [ 'foo/', 'foo', 'bar' ], output: 'foo/bar' }
 * ```
 * @param {String} `input` String to test.
 * @param {RegExp} `regex`
 * @return {Object} Returns an object with matching info.
 * @api public
 */

picomatch.test = (input, regex, options, { glob, posix } = {}) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected input to be a string');
  }

  if (input === '') {
    return { isMatch: false, output: '' };
  }

  const opts = options || {};
  const format = opts.format || (posix ? utils.toPosixSlashes : null);
  let match = input === glob;
  let output = (match && format) ? format(input) : input;

  if (match === false) {
    output = format ? format(input) : input;
    match = output === glob;
  }

  if (match === false || opts.capture === true) {
    if (opts.matchBase === true || opts.basename === true) {
      match = picomatch.matchBase(input, regex, options, posix);
    } else {
      match = regex.exec(output);
    }
  }

  return { isMatch: Boolean(match), match, output };
};

/**
 * Match the basename of a filepath.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.matchBase(input, glob[, options]);
 * console.log(picomatch.matchBase('foo/bar.js', '*.js'); // true
 * ```
 * @param {String} `input` String to test.
 * @param {RegExp|String} `glob` Glob pattern or regex created by [.makeRe](#makeRe).
 * @return {Boolean}
 * @api public
 */

picomatch.matchBase = (input, glob, options) => {
  const regex = glob instanceof RegExp ? glob : picomatch.makeRe(glob, options);
  return regex.test(utils.basename(input));
};

/**
 * Returns true if **any** of the given glob `patterns` match the specified `string`.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.isMatch(string, patterns[, options]);
 *
 * console.log(picomatch.isMatch('a.a', ['b.*', '*.a'])); //=> true
 * console.log(picomatch.isMatch('a.a', 'b.*')); //=> false
 * ```
 * @param {String|Array} str The string to test.
 * @param {String|Array} patterns One or more glob patterns to use for matching.
 * @param {Object} [options] See available [options](#options).
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

picomatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);

/**
 * Parse a glob pattern to create the source string for a regular
 * expression.
 *
 * ```js
 * const picomatch = require('picomatch');
 * const result = picomatch.parse(pattern[, options]);
 * ```
 * @param {String} `pattern`
 * @param {Object} `options`
 * @return {Object} Returns an object with useful properties and output to be used as a regex source string.
 * @api public
 */

picomatch.parse = (pattern, options) => {
  if (Array.isArray(pattern)) return pattern.map(p => picomatch.parse(p, options));
  return parse(pattern, { ...options, fastpaths: false });
};

/**
 * Scan a glob pattern to separate the pattern into segments.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.scan(input[, options]);
 *
 * const result = picomatch.scan('!./foo/*.js');
 * console.log(result);
 * { prefix: '!./',
 *   input: '!./foo/*.js',
 *   start: 3,
 *   base: 'foo',
 *   glob: '*.js',
 *   isBrace: false,
 *   isBracket: false,
 *   isGlob: true,
 *   isExtglob: false,
 *   isGlobstar: false,
 *   negated: true }
 * ```
 * @param {String} `input` Glob pattern to scan.
 * @param {Object} `options`
 * @return {Object} Returns an object with
 * @api public
 */

picomatch.scan = (input, options) => scan(input, options);

/**
 * Create a regular expression from a parsed glob pattern.
 *
 * ```js
 * const picomatch = require('picomatch');
 * const state = picomatch.parse('*.js');
 * // picomatch.compileRe(state[, options]);
 *
 * console.log(picomatch.compileRe(state));
 * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
 * ```
 * @param {String} `state` The object returned from the `.parse` method.
 * @param {Object} `options`
 * @return {RegExp} Returns a regex created from the given pattern.
 * @api public
 */

picomatch.compileRe = (parsed, options, returnOutput = false, returnState = false) => {
  if (returnOutput === true) {
    return parsed.output;
  }

  const opts = options || {};
  const prepend = opts.contains ? '' : '^';
  const append = opts.contains ? '' : '$';

  let source = `${prepend}(?:${parsed.output})${append}`;
  if (parsed && parsed.negated === true) {
    source = `^(?!${source}).*$`;
  }

  const regex = picomatch.toRegex(source, options);
  if (returnState === true) {
    regex.state = parsed;
  }

  return regex;
};

picomatch.makeRe = (input, options, returnOutput = false, returnState = false) => {
  if (!input || typeof input !== 'string') {
    throw new TypeError('Expected a non-empty string');
  }

  const opts = options || {};
  let parsed = { negated: false, fastpaths: true };
  let prefix = '';
  let output;

  if (input.startsWith('./')) {
    input = input.slice(2);
    prefix = parsed.prefix = './';
  }

  if (opts.fastpaths !== false && (input[0] === '.' || input[0] === '*')) {
    output = parse.fastpaths(input, options);
  }

  if (output === undefined) {
    parsed = parse(input, options);
    parsed.prefix = prefix + (parsed.prefix || '');
  } else {
    parsed.output = output;
  }

  return picomatch.compileRe(parsed, options, returnOutput, returnState);
};

/**
 * Create a regular expression from the given regex source string.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.toRegex(source[, options]);
 *
 * const { output } = picomatch.parse('*.js');
 * console.log(picomatch.toRegex(output));
 * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
 * ```
 * @param {String} `source` Regular expression source string.
 * @param {Object} `options`
 * @return {RegExp}
 * @api public
 */

picomatch.toRegex = (source, options) => {
  try {
    const opts = options || {};
    return new RegExp(source, opts.flags || (opts.nocase ? 'i' : ''));
  } catch (err) {
    if (options && options.debug === true) throw err;
    return /$^/;
  }
};

/**
 * Picomatch constants.
 * @return {Object}
 */

picomatch.constants = constants;

/**
 * Expose "picomatch"
 */

module.exports = picomatch;


/***/ }),

/***/ 19818:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const utils = __webpack_require__(32430);
const {
  CHAR_ASTERISK,             /* * */
  CHAR_AT,                   /* @ */
  CHAR_BACKWARD_SLASH,       /* \ */
  CHAR_COMMA,                /* , */
  CHAR_DOT,                  /* . */
  CHAR_EXCLAMATION_MARK,     /* ! */
  CHAR_FORWARD_SLASH,        /* / */
  CHAR_LEFT_CURLY_BRACE,     /* { */
  CHAR_LEFT_PARENTHESES,     /* ( */
  CHAR_LEFT_SQUARE_BRACKET,  /* [ */
  CHAR_PLUS,                 /* + */
  CHAR_QUESTION_MARK,        /* ? */
  CHAR_RIGHT_CURLY_BRACE,    /* } */
  CHAR_RIGHT_PARENTHESES,    /* ) */
  CHAR_RIGHT_SQUARE_BRACKET  /* ] */
} = __webpack_require__(30742);

const isPathSeparator = code => {
  return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
};

const depth = token => {
  if (token.isPrefix !== true) {
    token.depth = token.isGlobstar ? Infinity : 1;
  }
};

/**
 * Quickly scans a glob pattern and returns an object with a handful of
 * useful properties, like `isGlob`, `path` (the leading non-glob, if it exists),
 * `glob` (the actual pattern), and `negated` (true if the path starts with `!`).
 *
 * ```js
 * const pm = require('picomatch');
 * console.log(pm.scan('foo/bar/*.js'));
 * { isGlob: true, input: 'foo/bar/*.js', base: 'foo/bar', glob: '*.js' }
 * ```
 * @param {String} `str`
 * @param {Object} `options`
 * @return {Object} Returns an object with tokens and regex source string.
 * @api public
 */

const scan = (input, options) => {
  const opts = options || {};

  const length = input.length - 1;
  const scanToEnd = opts.parts === true || opts.scanToEnd === true;
  const slashes = [];
  const tokens = [];
  const parts = [];

  let str = input;
  let index = -1;
  let start = 0;
  let lastIndex = 0;
  let isBrace = false;
  let isBracket = false;
  let isGlob = false;
  let isExtglob = false;
  let isGlobstar = false;
  let braceEscaped = false;
  let backslashes = false;
  let negated = false;
  let finished = false;
  let braces = 0;
  let prev;
  let code;
  let token = { value: '', depth: 0, isGlob: false };

  const eos = () => index >= length;
  const peek = () => str.charCodeAt(index + 1);
  const advance = () => {
    prev = code;
    return str.charCodeAt(++index);
  };

  while (index < length) {
    code = advance();
    let next;

    if (code === CHAR_BACKWARD_SLASH) {
      backslashes = token.backslashes = true;
      code = advance();

      if (code === CHAR_LEFT_CURLY_BRACE) {
        braceEscaped = true;
      }
      continue;
    }

    if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
      braces++;

      while (eos() !== true && (code = advance())) {
        if (code === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          advance();
          continue;
        }

        if (code === CHAR_LEFT_CURLY_BRACE) {
          braces++;
          continue;
        }

        if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
          isBrace = token.isBrace = true;
          isGlob = token.isGlob = true;
          finished = true;

          if (scanToEnd === true) {
            continue;
          }

          break;
        }

        if (braceEscaped !== true && code === CHAR_COMMA) {
          isBrace = token.isBrace = true;
          isGlob = token.isGlob = true;
          finished = true;

          if (scanToEnd === true) {
            continue;
          }

          break;
        }

        if (code === CHAR_RIGHT_CURLY_BRACE) {
          braces--;

          if (braces === 0) {
            braceEscaped = false;
            isBrace = token.isBrace = true;
            finished = true;
            break;
          }
        }
      }

      if (scanToEnd === true) {
        continue;
      }

      break;
    }

    if (code === CHAR_FORWARD_SLASH) {
      slashes.push(index);
      tokens.push(token);
      token = { value: '', depth: 0, isGlob: false };

      if (finished === true) continue;
      if (prev === CHAR_DOT && index === (start + 1)) {
        start += 2;
        continue;
      }

      lastIndex = index + 1;
      continue;
    }

    if (opts.noext !== true) {
      const isExtglobChar = code === CHAR_PLUS
        || code === CHAR_AT
        || code === CHAR_ASTERISK
        || code === CHAR_QUESTION_MARK
        || code === CHAR_EXCLAMATION_MARK;

      if (isExtglobChar === true && peek() === CHAR_LEFT_PARENTHESES) {
        isGlob = token.isGlob = true;
        isExtglob = token.isExtglob = true;
        finished = true;

        if (scanToEnd === true) {
          while (eos() !== true && (code = advance())) {
            if (code === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              code = advance();
              continue;
            }

            if (code === CHAR_RIGHT_PARENTHESES) {
              isGlob = token.isGlob = true;
              finished = true;
              break;
            }
          }
          continue;
        }
        break;
      }
    }

    if (code === CHAR_ASTERISK) {
      if (prev === CHAR_ASTERISK) isGlobstar = token.isGlobstar = true;
      isGlob = token.isGlob = true;
      finished = true;

      if (scanToEnd === true) {
        continue;
      }
      break;
    }

    if (code === CHAR_QUESTION_MARK) {
      isGlob = token.isGlob = true;
      finished = true;

      if (scanToEnd === true) {
        continue;
      }
      break;
    }

    if (code === CHAR_LEFT_SQUARE_BRACKET) {
      while (eos() !== true && (next = advance())) {
        if (next === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          advance();
          continue;
        }

        if (next === CHAR_RIGHT_SQUARE_BRACKET) {
          isBracket = token.isBracket = true;
          isGlob = token.isGlob = true;
          finished = true;

          if (scanToEnd === true) {
            continue;
          }
          break;
        }
      }
    }

    if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
      negated = token.negated = true;
      start++;
      continue;
    }

    if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
      isGlob = token.isGlob = true;

      if (scanToEnd === true) {
        while (eos() !== true && (code = advance())) {
          if (code === CHAR_LEFT_PARENTHESES) {
            backslashes = token.backslashes = true;
            code = advance();
            continue;
          }

          if (code === CHAR_RIGHT_PARENTHESES) {
            finished = true;
            break;
          }
        }
        continue;
      }
      break;
    }

    if (isGlob === true) {
      finished = true;

      if (scanToEnd === true) {
        continue;
      }

      break;
    }
  }

  if (opts.noext === true) {
    isExtglob = false;
    isGlob = false;
  }

  let base = str;
  let prefix = '';
  let glob = '';

  if (start > 0) {
    prefix = str.slice(0, start);
    str = str.slice(start);
    lastIndex -= start;
  }

  if (base && isGlob === true && lastIndex > 0) {
    base = str.slice(0, lastIndex);
    glob = str.slice(lastIndex);
  } else if (isGlob === true) {
    base = '';
    glob = str;
  } else {
    base = str;
  }

  if (base && base !== '' && base !== '/' && base !== str) {
    if (isPathSeparator(base.charCodeAt(base.length - 1))) {
      base = base.slice(0, -1);
    }
  }

  if (opts.unescape === true) {
    if (glob) glob = utils.removeBackslashes(glob);

    if (base && backslashes === true) {
      base = utils.removeBackslashes(base);
    }
  }

  const state = {
    prefix,
    input,
    start,
    base,
    glob,
    isBrace,
    isBracket,
    isGlob,
    isExtglob,
    isGlobstar,
    negated
  };

  if (opts.tokens === true) {
    state.maxDepth = 0;
    if (!isPathSeparator(code)) {
      tokens.push(token);
    }
    state.tokens = tokens;
  }

  if (opts.parts === true || opts.tokens === true) {
    let prevIndex;

    for (let idx = 0; idx < slashes.length; idx++) {
      const n = prevIndex ? prevIndex + 1 : start;
      const i = slashes[idx];
      const value = input.slice(n, i);
      if (opts.tokens) {
        if (idx === 0 && start !== 0) {
          tokens[idx].isPrefix = true;
          tokens[idx].value = prefix;
        } else {
          tokens[idx].value = value;
        }
        depth(tokens[idx]);
        state.maxDepth += tokens[idx].depth;
      }
      if (idx !== 0 || value !== '') {
        parts.push(value);
      }
      prevIndex = i;
    }

    if (prevIndex && prevIndex + 1 < input.length) {
      const value = input.slice(prevIndex + 1);
      parts.push(value);

      if (opts.tokens) {
        tokens[tokens.length - 1].value = value;
        depth(tokens[tokens.length - 1]);
        state.maxDepth += tokens[tokens.length - 1].depth;
      }
    }

    state.slashes = slashes;
    state.parts = parts;
  }

  return state;
};

module.exports = scan;


/***/ }),

/***/ 32430:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


const {
  REGEX_BACKSLASH,
  REGEX_REMOVE_BACKSLASH,
  REGEX_SPECIAL_CHARS,
  REGEX_SPECIAL_CHARS_GLOBAL
} = __webpack_require__(30742);

exports.isObject = val => val !== null && typeof val === 'object' && !Array.isArray(val);
exports.hasRegexChars = str => REGEX_SPECIAL_CHARS.test(str);
exports.isRegexChar = str => str.length === 1 && exports.hasRegexChars(str);
exports.escapeRegex = str => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, '\\$1');
exports.toPosixSlashes = str => str.replace(REGEX_BACKSLASH, '/');

exports.removeBackslashes = str => {
  return str.replace(REGEX_REMOVE_BACKSLASH, match => {
    return match === '\\' ? '' : match;
  });
};

exports.supportsLookbehinds = () => {
  const segs = process.version.slice(1).split('.').map(Number);
  if (segs.length === 3 && segs[0] >= 9 || (segs[0] === 8 && segs[1] >= 10)) {
    return true;
  }
  return false;
};

exports.escapeLast = (input, char, lastIdx) => {
  const idx = input.lastIndexOf(char, lastIdx);
  if (idx === -1) return input;
  if (input[idx - 1] === '\\') return exports.escapeLast(input, char, idx - 1);
  return `${input.slice(0, idx)}\\${input.slice(idx)}`;
};

exports.removePrefix = (input, state = {}) => {
  let output = input;
  if (output.startsWith('./')) {
    output = output.slice(2);
    state.prefix = './';
  }
  return output;
};

exports.wrapOutput = (input, state = {}, options = {}) => {
  const prepend = options.contains ? '' : '^';
  const append = options.contains ? '' : '$';

  let output = `${prepend}(?:${input})${append}`;
  if (state.negated === true) {
    output = `(?:^(?!${output}).*$)`;
  }
  return output;
};

exports.basename = (path, { windows } = {}) => {
  if (windows) {
    return path.replace(/[\\/]$/, '').replace(/.*[\\/]/, '');
  } else {
    return path.replace(/\/$/, '').replace(/.*\//, '');
  }
};


/***/ }),

/***/ 86032:
/***/ ((module) => {

"use strict";


var replace = String.prototype.replace;
var percentTwenties = /%20/g;

var Format = {
    RFC1738: 'RFC1738',
    RFC3986: 'RFC3986'
};

module.exports = {
    'default': Format.RFC3986,
    formatters: {
        RFC1738: function (value) {
            return replace.call(value, percentTwenties, '+');
        },
        RFC3986: function (value) {
            return String(value);
        }
    },
    RFC1738: Format.RFC1738,
    RFC3986: Format.RFC3986
};


/***/ }),

/***/ 40240:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var stringify = __webpack_require__(71293);
var parse = __webpack_require__(79091);
var formats = __webpack_require__(86032);

module.exports = {
    formats: formats,
    parse: parse,
    stringify: stringify
};


/***/ }),

/***/ 79091:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(25225);

var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

var defaults = {
    allowDots: false,
    allowEmptyArrays: false,
    allowPrototypes: false,
    allowSparse: false,
    arrayLimit: 20,
    charset: 'utf-8',
    charsetSentinel: false,
    comma: false,
    decodeDotInKeys: false,
    decoder: utils.decode,
    delimiter: '&',
    depth: 5,
    duplicates: 'combine',
    ignoreQueryPrefix: false,
    interpretNumericEntities: false,
    parameterLimit: 1000,
    parseArrays: true,
    plainObjects: false,
    strictDepth: false,
    strictNullHandling: false,
    throwOnLimitExceeded: false
};

var interpretNumericEntities = function (str) {
    return str.replace(/&#(\d+);/g, function ($0, numberStr) {
        return String.fromCharCode(parseInt(numberStr, 10));
    });
};

var parseArrayValue = function (val, options, currentArrayLength) {
    if (val && typeof val === 'string' && options.comma && val.indexOf(',') > -1) {
        return val.split(',');
    }

    if (options.throwOnLimitExceeded && currentArrayLength >= options.arrayLimit) {
        throw new RangeError('Array limit exceeded. Only ' + options.arrayLimit + ' element' + (options.arrayLimit === 1 ? '' : 's') + ' allowed in an array.');
    }

    return val;
};

// This is what browsers will submit when the ✓ character occurs in an
// application/x-www-form-urlencoded body and the encoding of the page containing
// the form is iso-8859-1, or when the submitted form has an accept-charset
// attribute of iso-8859-1. Presumably also with other charsets that do not contain
// the ✓ character, such as us-ascii.
var isoSentinel = 'utf8=%26%2310003%3B'; // encodeURIComponent('&#10003;')

// These are the percent-encoded utf-8 octets representing a checkmark, indicating that the request actually is utf-8 encoded.
var charsetSentinel = 'utf8=%E2%9C%93'; // encodeURIComponent('✓')

var parseValues = function parseQueryStringValues(str, options) {
    var obj = { __proto__: null };

    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
    cleanStr = cleanStr.replace(/%5B/gi, '[').replace(/%5D/gi, ']');

    var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
    var parts = cleanStr.split(
        options.delimiter,
        options.throwOnLimitExceeded ? limit + 1 : limit
    );

    if (options.throwOnLimitExceeded && parts.length > limit) {
        throw new RangeError('Parameter limit exceeded. Only ' + limit + ' parameter' + (limit === 1 ? '' : 's') + ' allowed.');
    }

    var skipIndex = -1; // Keep track of where the utf8 sentinel was found
    var i;

    var charset = options.charset;
    if (options.charsetSentinel) {
        for (i = 0; i < parts.length; ++i) {
            if (parts[i].indexOf('utf8=') === 0) {
                if (parts[i] === charsetSentinel) {
                    charset = 'utf-8';
                } else if (parts[i] === isoSentinel) {
                    charset = 'iso-8859-1';
                }
                skipIndex = i;
                i = parts.length; // The eslint settings do not allow break;
            }
        }
    }

    for (i = 0; i < parts.length; ++i) {
        if (i === skipIndex) {
            continue;
        }
        var part = parts[i];

        var bracketEqualsPos = part.indexOf(']=');
        var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

        var key;
        var val;
        if (pos === -1) {
            key = options.decoder(part, defaults.decoder, charset, 'key');
            val = options.strictNullHandling ? null : '';
        } else {
            key = options.decoder(part.slice(0, pos), defaults.decoder, charset, 'key');

            val = utils.maybeMap(
                parseArrayValue(
                    part.slice(pos + 1),
                    options,
                    isArray(obj[key]) ? obj[key].length : 0
                ),
                function (encodedVal) {
                    return options.decoder(encodedVal, defaults.decoder, charset, 'value');
                }
            );
        }

        if (val && options.interpretNumericEntities && charset === 'iso-8859-1') {
            val = interpretNumericEntities(String(val));
        }

        if (part.indexOf('[]=') > -1) {
            val = isArray(val) ? [val] : val;
        }

        var existing = has.call(obj, key);
        if (existing && options.duplicates === 'combine') {
            obj[key] = utils.combine(obj[key], val);
        } else if (!existing || options.duplicates === 'last') {
            obj[key] = val;
        }
    }

    return obj;
};

var parseObject = function (chain, val, options, valuesParsed) {
    var currentArrayLength = 0;
    if (chain.length > 0 && chain[chain.length - 1] === '[]') {
        var parentKey = chain.slice(0, -1).join('');
        currentArrayLength = Array.isArray(val) && val[parentKey] ? val[parentKey].length : 0;
    }

    var leaf = valuesParsed ? val : parseArrayValue(val, options, currentArrayLength);

    for (var i = chain.length - 1; i >= 0; --i) {
        var obj;
        var root = chain[i];

        if (root === '[]' && options.parseArrays) {
            obj = options.allowEmptyArrays && (leaf === '' || (options.strictNullHandling && leaf === null))
                ? []
                : utils.combine([], leaf);
        } else {
            obj = options.plainObjects ? { __proto__: null } : {};
            var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
            var decodedRoot = options.decodeDotInKeys ? cleanRoot.replace(/%2E/g, '.') : cleanRoot;
            var index = parseInt(decodedRoot, 10);
            if (!options.parseArrays && decodedRoot === '') {
                obj = { 0: leaf };
            } else if (
                !isNaN(index)
                && root !== decodedRoot
                && String(index) === decodedRoot
                && index >= 0
                && (options.parseArrays && index <= options.arrayLimit)
            ) {
                obj = [];
                obj[index] = leaf;
            } else if (decodedRoot !== '__proto__') {
                obj[decodedRoot] = leaf;
            }
        }

        leaf = obj;
    }

    return leaf;
};

var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
    if (!givenKey) {
        return;
    }

    // Transform dot notation to bracket notation
    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

    // The regex chunks

    var brackets = /(\[[^[\]]*])/;
    var child = /(\[[^[\]]*])/g;

    // Get the parent

    var segment = options.depth > 0 && brackets.exec(key);
    var parent = segment ? key.slice(0, segment.index) : key;

    // Stash the parent if it exists

    var keys = [];
    if (parent) {
        // If we aren't using plain objects, optionally prefix keys that would overwrite object prototype properties
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
            if (!options.allowPrototypes) {
                return;
            }
        }

        keys.push(parent);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
            if (!options.allowPrototypes) {
                return;
            }
        }
        keys.push(segment[1]);
    }

    // If there's a remainder, check strictDepth option for throw, else just add whatever is left

    if (segment) {
        if (options.strictDepth === true) {
            throw new RangeError('Input depth exceeded depth option of ' + options.depth + ' and strictDepth is true');
        }
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return parseObject(keys, val, options, valuesParsed);
};

var normalizeParseOptions = function normalizeParseOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (typeof opts.allowEmptyArrays !== 'undefined' && typeof opts.allowEmptyArrays !== 'boolean') {
        throw new TypeError('`allowEmptyArrays` option can only be `true` or `false`, when provided');
    }

    if (typeof opts.decodeDotInKeys !== 'undefined' && typeof opts.decodeDotInKeys !== 'boolean') {
        throw new TypeError('`decodeDotInKeys` option can only be `true` or `false`, when provided');
    }

    if (opts.decoder !== null && typeof opts.decoder !== 'undefined' && typeof opts.decoder !== 'function') {
        throw new TypeError('Decoder has to be a function.');
    }

    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }

    if (typeof opts.throwOnLimitExceeded !== 'undefined' && typeof opts.throwOnLimitExceeded !== 'boolean') {
        throw new TypeError('`throwOnLimitExceeded` option must be a boolean');
    }

    var charset = typeof opts.charset === 'undefined' ? defaults.charset : opts.charset;

    var duplicates = typeof opts.duplicates === 'undefined' ? defaults.duplicates : opts.duplicates;

    if (duplicates !== 'combine' && duplicates !== 'first' && duplicates !== 'last') {
        throw new TypeError('The duplicates option must be either combine, first, or last');
    }

    var allowDots = typeof opts.allowDots === 'undefined' ? opts.decodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;

    return {
        allowDots: allowDots,
        allowEmptyArrays: typeof opts.allowEmptyArrays === 'boolean' ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
        allowPrototypes: typeof opts.allowPrototypes === 'boolean' ? opts.allowPrototypes : defaults.allowPrototypes,
        allowSparse: typeof opts.allowSparse === 'boolean' ? opts.allowSparse : defaults.allowSparse,
        arrayLimit: typeof opts.arrayLimit === 'number' ? opts.arrayLimit : defaults.arrayLimit,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        comma: typeof opts.comma === 'boolean' ? opts.comma : defaults.comma,
        decodeDotInKeys: typeof opts.decodeDotInKeys === 'boolean' ? opts.decodeDotInKeys : defaults.decodeDotInKeys,
        decoder: typeof opts.decoder === 'function' ? opts.decoder : defaults.decoder,
        delimiter: typeof opts.delimiter === 'string' || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
        // eslint-disable-next-line no-implicit-coercion, no-extra-parens
        depth: (typeof opts.depth === 'number' || opts.depth === false) ? +opts.depth : defaults.depth,
        duplicates: duplicates,
        ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
        interpretNumericEntities: typeof opts.interpretNumericEntities === 'boolean' ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
        parameterLimit: typeof opts.parameterLimit === 'number' ? opts.parameterLimit : defaults.parameterLimit,
        parseArrays: opts.parseArrays !== false,
        plainObjects: typeof opts.plainObjects === 'boolean' ? opts.plainObjects : defaults.plainObjects,
        strictDepth: typeof opts.strictDepth === 'boolean' ? !!opts.strictDepth : defaults.strictDepth,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling,
        throwOnLimitExceeded: typeof opts.throwOnLimitExceeded === 'boolean' ? opts.throwOnLimitExceeded : false
    };
};

module.exports = function (str, opts) {
    var options = normalizeParseOptions(opts);

    if (str === '' || str === null || typeof str === 'undefined') {
        return options.plainObjects ? { __proto__: null } : {};
    }

    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
    var obj = options.plainObjects ? { __proto__: null } : {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options, typeof str === 'string');
        obj = utils.merge(obj, newObj, options);
    }

    if (options.allowSparse === true) {
        return obj;
    }

    return utils.compact(obj);
};


/***/ }),

/***/ 71293:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var getSideChannel = __webpack_require__(94753);
var utils = __webpack_require__(25225);
var formats = __webpack_require__(86032);
var has = Object.prototype.hasOwnProperty;

var arrayPrefixGenerators = {
    brackets: function brackets(prefix) {
        return prefix + '[]';
    },
    comma: 'comma',
    indices: function indices(prefix, key) {
        return prefix + '[' + key + ']';
    },
    repeat: function repeat(prefix) {
        return prefix;
    }
};

var isArray = Array.isArray;
var push = Array.prototype.push;
var pushToArray = function (arr, valueOrArray) {
    push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
};

var toISO = Date.prototype.toISOString;

var defaultFormat = formats['default'];
var defaults = {
    addQueryPrefix: false,
    allowDots: false,
    allowEmptyArrays: false,
    arrayFormat: 'indices',
    charset: 'utf-8',
    charsetSentinel: false,
    commaRoundTrip: false,
    delimiter: '&',
    encode: true,
    encodeDotInKeys: false,
    encoder: utils.encode,
    encodeValuesOnly: false,
    filter: void undefined,
    format: defaultFormat,
    formatter: formats.formatters[defaultFormat],
    // deprecated
    indices: false,
    serializeDate: function serializeDate(date) {
        return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
};

var isNonNullishPrimitive = function isNonNullishPrimitive(v) {
    return typeof v === 'string'
        || typeof v === 'number'
        || typeof v === 'boolean'
        || typeof v === 'symbol'
        || typeof v === 'bigint';
};

var sentinel = {};

var stringify = function stringify(
    object,
    prefix,
    generateArrayPrefix,
    commaRoundTrip,
    allowEmptyArrays,
    strictNullHandling,
    skipNulls,
    encodeDotInKeys,
    encoder,
    filter,
    sort,
    allowDots,
    serializeDate,
    format,
    formatter,
    encodeValuesOnly,
    charset,
    sideChannel
) {
    var obj = object;

    var tmpSc = sideChannel;
    var step = 0;
    var findFlag = false;
    while ((tmpSc = tmpSc.get(sentinel)) !== void undefined && !findFlag) {
        // Where object last appeared in the ref tree
        var pos = tmpSc.get(object);
        step += 1;
        if (typeof pos !== 'undefined') {
            if (pos === step) {
                throw new RangeError('Cyclic object value');
            } else {
                findFlag = true; // Break while
            }
        }
        if (typeof tmpSc.get(sentinel) === 'undefined') {
            step = 0;
        }
    }

    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
        obj = serializeDate(obj);
    } else if (generateArrayPrefix === 'comma' && isArray(obj)) {
        obj = utils.maybeMap(obj, function (value) {
            if (value instanceof Date) {
                return serializeDate(value);
            }
            return value;
        });
    }

    if (obj === null) {
        if (strictNullHandling) {
            return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, 'key', format) : prefix;
        }

        obj = '';
    }

    if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
        if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, 'key', format);
            return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder, charset, 'value', format))];
        }
        return [formatter(prefix) + '=' + formatter(String(obj))];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys;
    if (generateArrayPrefix === 'comma' && isArray(obj)) {
        // we need to join elements in
        if (encodeValuesOnly && encoder) {
            obj = utils.maybeMap(obj, encoder);
        }
        objKeys = [{ value: obj.length > 0 ? obj.join(',') || null : void undefined }];
    } else if (isArray(filter)) {
        objKeys = filter;
    } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
    }

    var encodedPrefix = encodeDotInKeys ? String(prefix).replace(/\./g, '%2E') : String(prefix);

    var adjustedPrefix = commaRoundTrip && isArray(obj) && obj.length === 1 ? encodedPrefix + '[]' : encodedPrefix;

    if (allowEmptyArrays && isArray(obj) && obj.length === 0) {
        return adjustedPrefix + '[]';
    }

    for (var j = 0; j < objKeys.length; ++j) {
        var key = objKeys[j];
        var value = typeof key === 'object' && key && typeof key.value !== 'undefined'
            ? key.value
            : obj[key];

        if (skipNulls && value === null) {
            continue;
        }

        var encodedKey = allowDots && encodeDotInKeys ? String(key).replace(/\./g, '%2E') : String(key);
        var keyPrefix = isArray(obj)
            ? typeof generateArrayPrefix === 'function' ? generateArrayPrefix(adjustedPrefix, encodedKey) : adjustedPrefix
            : adjustedPrefix + (allowDots ? '.' + encodedKey : '[' + encodedKey + ']');

        sideChannel.set(object, step);
        var valueSideChannel = getSideChannel();
        valueSideChannel.set(sentinel, sideChannel);
        pushToArray(values, stringify(
            value,
            keyPrefix,
            generateArrayPrefix,
            commaRoundTrip,
            allowEmptyArrays,
            strictNullHandling,
            skipNulls,
            encodeDotInKeys,
            generateArrayPrefix === 'comma' && encodeValuesOnly && isArray(obj) ? null : encoder,
            filter,
            sort,
            allowDots,
            serializeDate,
            format,
            formatter,
            encodeValuesOnly,
            charset,
            valueSideChannel
        ));
    }

    return values;
};

var normalizeStringifyOptions = function normalizeStringifyOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (typeof opts.allowEmptyArrays !== 'undefined' && typeof opts.allowEmptyArrays !== 'boolean') {
        throw new TypeError('`allowEmptyArrays` option can only be `true` or `false`, when provided');
    }

    if (typeof opts.encodeDotInKeys !== 'undefined' && typeof opts.encodeDotInKeys !== 'boolean') {
        throw new TypeError('`encodeDotInKeys` option can only be `true` or `false`, when provided');
    }

    if (opts.encoder !== null && typeof opts.encoder !== 'undefined' && typeof opts.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
    }

    var charset = opts.charset || defaults.charset;
    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }

    var format = formats['default'];
    if (typeof opts.format !== 'undefined') {
        if (!has.call(formats.formatters, opts.format)) {
            throw new TypeError('Unknown format option provided.');
        }
        format = opts.format;
    }
    var formatter = formats.formatters[format];

    var filter = defaults.filter;
    if (typeof opts.filter === 'function' || isArray(opts.filter)) {
        filter = opts.filter;
    }

    var arrayFormat;
    if (opts.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = opts.arrayFormat;
    } else if ('indices' in opts) {
        arrayFormat = opts.indices ? 'indices' : 'repeat';
    } else {
        arrayFormat = defaults.arrayFormat;
    }

    if ('commaRoundTrip' in opts && typeof opts.commaRoundTrip !== 'boolean') {
        throw new TypeError('`commaRoundTrip` must be a boolean, or absent');
    }

    var allowDots = typeof opts.allowDots === 'undefined' ? opts.encodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;

    return {
        addQueryPrefix: typeof opts.addQueryPrefix === 'boolean' ? opts.addQueryPrefix : defaults.addQueryPrefix,
        allowDots: allowDots,
        allowEmptyArrays: typeof opts.allowEmptyArrays === 'boolean' ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
        arrayFormat: arrayFormat,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        commaRoundTrip: !!opts.commaRoundTrip,
        delimiter: typeof opts.delimiter === 'undefined' ? defaults.delimiter : opts.delimiter,
        encode: typeof opts.encode === 'boolean' ? opts.encode : defaults.encode,
        encodeDotInKeys: typeof opts.encodeDotInKeys === 'boolean' ? opts.encodeDotInKeys : defaults.encodeDotInKeys,
        encoder: typeof opts.encoder === 'function' ? opts.encoder : defaults.encoder,
        encodeValuesOnly: typeof opts.encodeValuesOnly === 'boolean' ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
        filter: filter,
        format: format,
        formatter: formatter,
        serializeDate: typeof opts.serializeDate === 'function' ? opts.serializeDate : defaults.serializeDate,
        skipNulls: typeof opts.skipNulls === 'boolean' ? opts.skipNulls : defaults.skipNulls,
        sort: typeof opts.sort === 'function' ? opts.sort : null,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

module.exports = function (object, opts) {
    var obj = object;
    var options = normalizeStringifyOptions(opts);

    var objKeys;
    var filter;

    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    } else if (isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
    }

    var keys = [];

    if (typeof obj !== 'object' || obj === null) {
        return '';
    }

    var generateArrayPrefix = arrayPrefixGenerators[options.arrayFormat];
    var commaRoundTrip = generateArrayPrefix === 'comma' && options.commaRoundTrip;

    if (!objKeys) {
        objKeys = Object.keys(obj);
    }

    if (options.sort) {
        objKeys.sort(options.sort);
    }

    var sideChannel = getSideChannel();
    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];
        var value = obj[key];

        if (options.skipNulls && value === null) {
            continue;
        }
        pushToArray(keys, stringify(
            value,
            key,
            generateArrayPrefix,
            commaRoundTrip,
            options.allowEmptyArrays,
            options.strictNullHandling,
            options.skipNulls,
            options.encodeDotInKeys,
            options.encode ? options.encoder : null,
            options.filter,
            options.sort,
            options.allowDots,
            options.serializeDate,
            options.format,
            options.formatter,
            options.encodeValuesOnly,
            options.charset,
            sideChannel
        ));
    }

    var joined = keys.join(options.delimiter);
    var prefix = options.addQueryPrefix === true ? '?' : '';

    if (options.charsetSentinel) {
        if (options.charset === 'iso-8859-1') {
            // encodeURIComponent('&#10003;'), the "numeric entity" representation of a checkmark
            prefix += 'utf8=%26%2310003%3B&';
        } else {
            // encodeURIComponent('✓')
            prefix += 'utf8=%E2%9C%93&';
        }
    }

    return joined.length > 0 ? prefix + joined : '';
};


/***/ }),

/***/ 25225:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var formats = __webpack_require__(86032);

var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

var hexTable = (function () {
    var array = [];
    for (var i = 0; i < 256; ++i) {
        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }

    return array;
}());

var compactQueue = function compactQueue(queue) {
    while (queue.length > 1) {
        var item = queue.pop();
        var obj = item.obj[item.prop];

        if (isArray(obj)) {
            var compacted = [];

            for (var j = 0; j < obj.length; ++j) {
                if (typeof obj[j] !== 'undefined') {
                    compacted.push(obj[j]);
                }
            }

            item.obj[item.prop] = compacted;
        }
    }
};

var arrayToObject = function arrayToObject(source, options) {
    var obj = options && options.plainObjects ? { __proto__: null } : {};
    for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }

    return obj;
};

var merge = function merge(target, source, options) {
    /* eslint no-param-reassign: 0 */
    if (!source) {
        return target;
    }

    if (typeof source !== 'object' && typeof source !== 'function') {
        if (isArray(target)) {
            target.push(source);
        } else if (target && typeof target === 'object') {
            if (
                (options && (options.plainObjects || options.allowPrototypes))
                || !has.call(Object.prototype, source)
            ) {
                target[source] = true;
            }
        } else {
            return [target, source];
        }

        return target;
    }

    if (!target || typeof target !== 'object') {
        return [target].concat(source);
    }

    var mergeTarget = target;
    if (isArray(target) && !isArray(source)) {
        mergeTarget = arrayToObject(target, options);
    }

    if (isArray(target) && isArray(source)) {
        source.forEach(function (item, i) {
            if (has.call(target, i)) {
                var targetItem = target[i];
                if (targetItem && typeof targetItem === 'object' && item && typeof item === 'object') {
                    target[i] = merge(targetItem, item, options);
                } else {
                    target.push(item);
                }
            } else {
                target[i] = item;
            }
        });
        return target;
    }

    return Object.keys(source).reduce(function (acc, key) {
        var value = source[key];

        if (has.call(acc, key)) {
            acc[key] = merge(acc[key], value, options);
        } else {
            acc[key] = value;
        }
        return acc;
    }, mergeTarget);
};

var assign = function assignSingleSource(target, source) {
    return Object.keys(source).reduce(function (acc, key) {
        acc[key] = source[key];
        return acc;
    }, target);
};

var decode = function (str, defaultDecoder, charset) {
    var strWithoutPlus = str.replace(/\+/g, ' ');
    if (charset === 'iso-8859-1') {
        // unescape never throws, no try...catch needed:
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
    }
    // utf-8
    try {
        return decodeURIComponent(strWithoutPlus);
    } catch (e) {
        return strWithoutPlus;
    }
};

var limit = 1024;

/* eslint operator-linebreak: [2, "before"] */

var encode = function encode(str, defaultEncoder, charset, kind, format) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    var string = str;
    if (typeof str === 'symbol') {
        string = Symbol.prototype.toString.call(str);
    } else if (typeof str !== 'string') {
        string = String(str);
    }

    if (charset === 'iso-8859-1') {
        return escape(string).replace(/%u[0-9a-f]{4}/gi, function ($0) {
            return '%26%23' + parseInt($0.slice(2), 16) + '%3B';
        });
    }

    var out = '';
    for (var j = 0; j < string.length; j += limit) {
        var segment = string.length >= limit ? string.slice(j, j + limit) : string;
        var arr = [];

        for (var i = 0; i < segment.length; ++i) {
            var c = segment.charCodeAt(i);
            if (
                c === 0x2D // -
                || c === 0x2E // .
                || c === 0x5F // _
                || c === 0x7E // ~
                || (c >= 0x30 && c <= 0x39) // 0-9
                || (c >= 0x41 && c <= 0x5A) // a-z
                || (c >= 0x61 && c <= 0x7A) // A-Z
                || (format === formats.RFC1738 && (c === 0x28 || c === 0x29)) // ( )
            ) {
                arr[arr.length] = segment.charAt(i);
                continue;
            }

            if (c < 0x80) {
                arr[arr.length] = hexTable[c];
                continue;
            }

            if (c < 0x800) {
                arr[arr.length] = hexTable[0xC0 | (c >> 6)]
                    + hexTable[0x80 | (c & 0x3F)];
                continue;
            }

            if (c < 0xD800 || c >= 0xE000) {
                arr[arr.length] = hexTable[0xE0 | (c >> 12)]
                    + hexTable[0x80 | ((c >> 6) & 0x3F)]
                    + hexTable[0x80 | (c & 0x3F)];
                continue;
            }

            i += 1;
            c = 0x10000 + (((c & 0x3FF) << 10) | (segment.charCodeAt(i) & 0x3FF));

            arr[arr.length] = hexTable[0xF0 | (c >> 18)]
                + hexTable[0x80 | ((c >> 12) & 0x3F)]
                + hexTable[0x80 | ((c >> 6) & 0x3F)]
                + hexTable[0x80 | (c & 0x3F)];
        }

        out += arr.join('');
    }

    return out;
};

var compact = function compact(value) {
    var queue = [{ obj: { o: value }, prop: 'o' }];
    var refs = [];

    for (var i = 0; i < queue.length; ++i) {
        var item = queue[i];
        var obj = item.obj[item.prop];

        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
            var key = keys[j];
            var val = obj[key];
            if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
                queue.push({ obj: obj, prop: key });
                refs.push(val);
            }
        }
    }

    compactQueue(queue);

    return value;
};

var isRegExp = function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

var isBuffer = function isBuffer(obj) {
    if (!obj || typeof obj !== 'object') {
        return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};

var combine = function combine(a, b) {
    return [].concat(a, b);
};

var maybeMap = function maybeMap(val, fn) {
    if (isArray(val)) {
        var mapped = [];
        for (var i = 0; i < val.length; i += 1) {
            mapped.push(fn(val[i]));
        }
        return mapped;
    }
    return fn(val);
};

module.exports = {
    arrayToObject: arrayToObject,
    assign: assign,
    combine: combine,
    compact: compact,
    decode: decode,
    encode: encode,
    isBuffer: isBuffer,
    isRegExp: isRegExp,
    maybeMap: maybeMap,
    merge: merge
};


/***/ }),

/***/ 8649:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const RateLimiterRedis = __webpack_require__(54336);
const RateLimiterMongo = __webpack_require__(28439);
const RateLimiterMySQL = __webpack_require__(67793);
const RateLimiterPostgres = __webpack_require__(3740);
const { RateLimiterClusterMaster, RateLimiterClusterMasterPM2, RateLimiterCluster } = __webpack_require__(10565);
const RateLimiterMemory = __webpack_require__(24544);
const RateLimiterMemcache = __webpack_require__(73250);
const RLWrapperBlackAndWhite = __webpack_require__(87383);
const RLWrapperTimeouts = __webpack_require__(24016);
const RateLimiterUnion = __webpack_require__(10244);
const RateLimiterQueue = __webpack_require__(52860);
const BurstyRateLimiter = __webpack_require__(85860);
const RateLimiterRes = __webpack_require__(80449);
const RateLimiterDynamo = __webpack_require__(82309);
const RateLimiterPrisma = __webpack_require__(16323);
const RateLimiterDrizzle = __webpack_require__(50673);
const RateLimiterDrizzleNonAtomic = __webpack_require__(75347);
const RateLimiterValkey = __webpack_require__(32193);
const RateLimiterValkeyGlide = __webpack_require__(53756);
const RateLimiterSQLite = __webpack_require__(73283);
const RateLimiterEtcd = __webpack_require__(36481);
const RateLimiterEtcdNonAtomic = __webpack_require__(15299);
const RateLimiterQueueError = __webpack_require__(27948);
const RateLimiterEtcdTransactionFailedError = __webpack_require__(43184);

module.exports = {
  RateLimiterRedis,
  RateLimiterMongo,
  RateLimiterMySQL,
  RateLimiterPostgres,
  RateLimiterMemory,
  RateLimiterMemcache,
  RateLimiterClusterMaster,
  RateLimiterClusterMasterPM2,
  RateLimiterCluster,
  RLWrapperBlackAndWhite,
  RLWrapperTimeouts,
  RateLimiterUnion,
  RateLimiterQueue,
  BurstyRateLimiter,
  RateLimiterRes,
  RateLimiterDynamo,
  RateLimiterPrisma,
  RateLimiterValkey,
  RateLimiterValkeyGlide,
  RateLimiterSQLite,
  RateLimiterEtcd,
  RateLimiterDrizzle,
  RateLimiterDrizzleNonAtomic,
  RateLimiterEtcdNonAtomic,
  RateLimiterQueueError,
  RateLimiterEtcdTransactionFailedError,
};


/***/ }),

/***/ 85860:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const RateLimiterRes = __webpack_require__(80449);

/**
 * Bursty rate limiter exposes only msBeforeNext time and doesn't expose points from bursty limiter by default
 * @type {BurstyRateLimiter}
 */
module.exports = class BurstyRateLimiter {
  constructor(rateLimiter, burstLimiter) {
    this._rateLimiter = rateLimiter;
    this._burstLimiter = burstLimiter
  }

  /**
   * Merge rate limiter response objects. Responses can be null
   *
   * @param {RateLimiterRes} [rlRes] Rate limiter response
   * @param {RateLimiterRes} [blRes] Bursty limiter response
   */
  _combineRes(rlRes, blRes) {
    if (!rlRes) {
      return null
    }

    return new RateLimiterRes(
      rlRes.remainingPoints,
      Math.min(rlRes.msBeforeNext, blRes ? blRes.msBeforeNext : 0),
      rlRes.consumedPoints,
      rlRes.isFirstInDuration
    )
  }

  /**
   * @param key
   * @param pointsToConsume
   * @param options
   * @returns {Promise<any>}
   */
  consume(key, pointsToConsume = 1, options = {}) {
    return this._rateLimiter.consume(key, pointsToConsume, options)
      .catch((rlRej) => {
        if (rlRej instanceof RateLimiterRes) {
          return this._burstLimiter.consume(key, pointsToConsume, options)
            .then((blRes) => {
              return Promise.resolve(this._combineRes(rlRej, blRes))
            })
            .catch((blRej) => {
                if (blRej instanceof RateLimiterRes) {
                  return Promise.reject(this._combineRes(rlRej, blRej))
                } else {
                  return Promise.reject(blRej)
                }
              }
            )
        } else {
          return Promise.reject(rlRej)
        }
      })
  }

  /**
   * It doesn't expose available points from burstLimiter
   *
   * @param key
   * @returns {Promise<RateLimiterRes>}
   */
  get(key) {
    return Promise.all([
      this._rateLimiter.get(key),
      this._burstLimiter.get(key),
    ]).then(([rlRes, blRes]) => {
      return this._combineRes(rlRes, blRes);
    });
  }

  get points() {
    return this._rateLimiter.points;
  }
};


/***/ }),

/***/ 87383:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const RateLimiterRes = __webpack_require__(80449);

module.exports = class RLWrapperBlackAndWhite {
  constructor(opts = {}) {
    this.limiter = opts.limiter;
    this.blackList = opts.blackList;
    this.whiteList = opts.whiteList;
    this.isBlackListed = opts.isBlackListed;
    this.isWhiteListed = opts.isWhiteListed;
    this.runActionAnyway = opts.runActionAnyway;
  }

  get limiter() {
    return this._limiter;
  }

  set limiter(value) {
    if (typeof value === 'undefined') {
      throw new Error('limiter is not set');
    }

    this._limiter = value;
  }

  get runActionAnyway() {
    return this._runActionAnyway;
  }

  set runActionAnyway(value) {
    this._runActionAnyway = typeof value === 'undefined' ? false : value;
  }

  get blackList() {
    return this._blackList;
  }

  set blackList(value) {
    this._blackList = Array.isArray(value) ? value : [];
  }

  get isBlackListed() {
    return this._isBlackListed;
  }

  set isBlackListed(func) {
    if (typeof func === 'undefined') {
      func = () => false;
    }
    if (typeof func !== 'function') {
      throw new Error('isBlackListed must be function');
    }
    this._isBlackListed = func;
  }

  get whiteList() {
    return this._whiteList;
  }

  set whiteList(value) {
    this._whiteList = Array.isArray(value) ? value : [];
  }

  get isWhiteListed() {
    return this._isWhiteListed;
  }

  set isWhiteListed(func) {
    if (typeof func === 'undefined') {
      func = () => false;
    }
    if (typeof func !== 'function') {
      throw new Error('isWhiteListed must be function');
    }
    this._isWhiteListed = func;
  }

  isBlackListedSomewhere(key) {
    return this.blackList.indexOf(key) >= 0 || this.isBlackListed(key);
  }

  isWhiteListedSomewhere(key) {
    return this.whiteList.indexOf(key) >= 0 || this.isWhiteListed(key);
  }

  getBlackRes() {
    return new RateLimiterRes(0, Number.MAX_SAFE_INTEGER, 0, false);
  }

  getWhiteRes() {
    return new RateLimiterRes(Number.MAX_SAFE_INTEGER, 0, 0, false);
  }

  rejectBlack() {
    return Promise.reject(this.getBlackRes());
  }

  resolveBlack() {
    return Promise.resolve(this.getBlackRes());
  }

  resolveWhite() {
    return Promise.resolve(this.getWhiteRes());
  }

  consume(key, pointsToConsume = 1) {
    let res;
    if (this.isWhiteListedSomewhere(key)) {
      res = this.resolveWhite();
    } else if (this.isBlackListedSomewhere(key)) {
      res = this.rejectBlack();
    }

    if (typeof res === 'undefined') {
      return this.limiter.consume(key, pointsToConsume);
    }

    if (this.runActionAnyway) {
      this.limiter.consume(key, pointsToConsume).catch(() => {});
    }
    return res;
  }

  block(key, secDuration) {
    let res;
    if (this.isWhiteListedSomewhere(key)) {
      res = this.resolveWhite();
    } else if (this.isBlackListedSomewhere(key)) {
      res = this.resolveBlack();
    }

    if (typeof res === 'undefined') {
      return this.limiter.block(key, secDuration);
    }

    if (this.runActionAnyway) {
      this.limiter.block(key, secDuration).catch(() => {});
    }
    return res;
  }

  penalty(key, points) {
    let res;
    if (this.isWhiteListedSomewhere(key)) {
      res = this.resolveWhite();
    } else if (this.isBlackListedSomewhere(key)) {
      res = this.resolveBlack();
    }

    if (typeof res === 'undefined') {
      return this.limiter.penalty(key, points);
    }

    if (this.runActionAnyway) {
      this.limiter.penalty(key, points).catch(() => {});
    }
    return res;
  }

  reward(key, points) {
    let res;
    if (this.isWhiteListedSomewhere(key)) {
      res = this.resolveWhite();
    } else if (this.isBlackListedSomewhere(key)) {
      res = this.resolveBlack();
    }

    if (typeof res === 'undefined') {
      return this.limiter.reward(key, points);
    }

    if (this.runActionAnyway) {
      this.limiter.reward(key, points).catch(() => {});
    }
    return res;
  }

  get(key) {
    let res;
    if (this.isWhiteListedSomewhere(key)) {
      res = this.resolveWhite();
    } else if (this.isBlackListedSomewhere(key)) {
      res = this.resolveBlack();
    }

    if (typeof res === 'undefined' || this.runActionAnyway) {
      return this.limiter.get(key);
    }

    return res;
  }

  delete(key) {
    return this.limiter.delete(key);
  }
};


/***/ }),

/***/ 24016:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const RateLimiterAbstract = __webpack_require__(88569);
const RateLimiterInsuredAbstract = __webpack_require__(33847);

module.exports = class RLWrapperTimeouts extends RateLimiterInsuredAbstract {
  constructor(opts= {}) {
    super(opts);
    this.limiter = opts.limiter;
    this.timeoutMs = opts.timeoutMs || 0;
  }

  get limiter() {
    return this._limiter;
  }

  set limiter(limiter) {
    if (!(limiter instanceof RateLimiterAbstract)) {
      throw new TypeError('limiter must be an instance of RateLimiterAbstract');
    }
    this._limiter = limiter;
    if (!this.insuranceLimiter && limiter instanceof RateLimiterInsuredAbstract) {
      this.insuranceLimiter = limiter.insuranceLimiter;
    }
  }

  get timeoutMs() {
    return this._timeoutMs;
  }

  set timeoutMs(value) {
    if (typeof value !== 'number' || value < 0) {
      throw new TypeError('timeoutMs must be a non-negative number');
    }
    this._timeoutMs = value;
  }

  _run(funcName, params) {
    return new Promise(async (resolve, reject) => {
      const timeout = setTimeout(() => {
        return reject(new Error('Operation timed out'));
      }, this.timeoutMs);

      await this.limiter[funcName](...params)
        .then((result) => {
          clearTimeout(timeout);
          resolve(result);
        })
        .catch((err) => {
          clearTimeout(timeout);
          reject(err);
        });
    });
  }

  _consume(key, pointsToConsume = 1, options = {}) {
    return this._run('consume', [key, pointsToConsume, options]);
  }

  _penalty(key, points = 1, options = {}) {
    return this._run('penalty', [key, points, options]);
  }

  _reward(key, points = 1, options = {}) {
    return this._run('reward', [key, points, options]);
  }

  _get(key, options = {}) {
    return this._run('get', [key, options]);
  }

  _set(key, points, secDuration, options = {}) {
    return this._run('set', [key, points, secDuration, options]);
  }

  _block(key, secDuration, options = {}) {
    return this._run('block', [key, secDuration, options]);
  }

  _delete(key, options = {}) {
    return this._run('delete', [key, options]);
  }

}


/***/ }),

/***/ 88569:
/***/ ((module) => {

module.exports = class RateLimiterAbstract {
  /**
   *
   * @param opts Object Defaults {
   *   points: 4, // Number of points
   *   duration: 1, // Per seconds
   *   blockDuration: 0, // Block if consumed more than points in current duration for blockDuration seconds
   *   execEvenly: false, // Execute allowed actions evenly over duration
   *   execEvenlyMinDelayMs: duration * 1000 / points, // ms, works with execEvenly=true option
   *   keyPrefix: 'rlflx',
   * }
   */
  constructor(opts = {}) {
    this.points = opts.points;
    this.duration = opts.duration;
    this.blockDuration = opts.blockDuration;
    this.execEvenly = opts.execEvenly;
    this.execEvenlyMinDelayMs = opts.execEvenlyMinDelayMs;
    this.keyPrefix = opts.keyPrefix;
  }

  get points() {
    return this._points;
  }

  set points(value) {
    this._points = value >= 0 ? value : 4;
  }

  get duration() {
    return this._duration;
  }

  set duration(value) {
    this._duration = typeof value === 'undefined' ? 1 : value;
  }

  get msDuration() {
    return this.duration * 1000;
  }

  get blockDuration() {
    return this._blockDuration;
  }

  set blockDuration(value) {
    this._blockDuration = typeof value === 'undefined' ? 0 : value;
  }

  get msBlockDuration() {
    return this.blockDuration * 1000;
  }

  get execEvenly() {
    return this._execEvenly;
  }

  set execEvenly(value) {
    this._execEvenly = typeof value === 'undefined' ? false : Boolean(value);
  }

  get execEvenlyMinDelayMs() {
    return this._execEvenlyMinDelayMs;
  }

  set execEvenlyMinDelayMs(value) {
    this._execEvenlyMinDelayMs = typeof value === 'undefined' ? Math.ceil(this.msDuration / this.points) : value;
  }

  get keyPrefix() {
    return this._keyPrefix;
  }

  set keyPrefix(value) {
    if (typeof value === 'undefined') {
      value = 'rlflx';
    }
    if (typeof value !== 'string') {
      throw new Error('keyPrefix must be string');
    }
    this._keyPrefix = value;
  }

  _getKeySecDuration(options = {}) {
    return options && options.customDuration >= 0
      ? options.customDuration
      : this.duration;
  }

  getKey(key) {
    return this.keyPrefix.length > 0 ? `${this.keyPrefix}:${key}` : key;
  }

  parseKey(rlKey) {
    return rlKey.substring(this.keyPrefix.length);
  }

  consume() {
    throw new Error("You have to implement the method 'consume'!");
  }

  penalty() {
    throw new Error("You have to implement the method 'penalty'!");
  }

  reward() {
    throw new Error("You have to implement the method 'reward'!");
  }

  get() {
    throw new Error("You have to implement the method 'get'!");
  }

  set() {
    throw new Error("You have to implement the method 'set'!");
  }

  block() {
    throw new Error("You have to implement the method 'block'!");
  }

  delete() {
    throw new Error("You have to implement the method 'delete'!");
  }
};


/***/ }),

/***/ 10565:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Implements rate limiting in cluster using built-in IPC
 *
 * Two classes are described here: master and worker
 * Master have to be create in the master process without any options.
 * Any number of rate limiters can be created in workers, but each rate limiter must be with unique keyPrefix
 *
 * Workflow:
 * 1. master rate limiter created in master process
 * 2. worker rate limiter sends 'init' message with necessary options during creating
 * 3. master receives options and adds new rate limiter by keyPrefix if it isn't created yet
 * 4. master sends 'init' back to worker's rate limiter
 * 5. worker can process requests immediately,
 *    but they will be postponed by 'workerWaitInit' until master sends 'init' to worker
 * 6. every request to worker rate limiter creates a promise
 * 7. if master doesn't response for 'timeout', promise is rejected
 * 8. master sends 'resolve' or 'reject' command to worker
 * 9. worker resolves or rejects promise depending on message from master
 *
 */

const cluster = __webpack_require__(29907);
const crypto = __webpack_require__(76982);
const RateLimiterAbstract = __webpack_require__(88569);
const RateLimiterMemory = __webpack_require__(24544);
const RateLimiterRes = __webpack_require__(80449);

const channel = 'rate_limiter_flexible';
let masterInstance = null;

const masterSendToWorker = function (worker, msg, type, res) {
  let data;
  if (res === null || res === true || res === false) {
    data = res;
  } else {
    data = {
      remainingPoints: res.remainingPoints,
      msBeforeNext: res.msBeforeNext,
      consumedPoints: res.consumedPoints,
      isFirstInDuration: res.isFirstInDuration,
    };
  }
  worker.send({
    channel,
    keyPrefix: msg.keyPrefix, // which rate limiter exactly
    promiseId: msg.promiseId,
    type,
    data,
  });
};

const workerWaitInit = function (payload) {
  setTimeout(() => {
    if (this._initiated) {
      process.send(payload);
      // Promise will be removed by timeout if too long
    } else if (typeof this._promises[payload.promiseId] !== 'undefined') {
      workerWaitInit.call(this, payload);
    }
  }, 30);
};

const workerSendToMaster = function (func, promiseId, key, arg, opts) {
  const payload = {
    channel,
    keyPrefix: this.keyPrefix,
    func,
    promiseId,
    data: {
      key,
      arg,
      opts,
    },
  };

  if (!this._initiated) {
    // Wait init before sending messages to master
    workerWaitInit.call(this, payload);
  } else {
    process.send(payload);
  }
};

const masterProcessMsg = function (worker, msg) {
  if (!msg || msg.channel !== channel || typeof this._rateLimiters[msg.keyPrefix] === 'undefined') {
    return false;
  }

  let promise;

  switch (msg.func) {
    case 'consume':
      promise = this._rateLimiters[msg.keyPrefix].consume(msg.data.key, msg.data.arg, msg.data.opts);
      break;
    case 'penalty':
      promise = this._rateLimiters[msg.keyPrefix].penalty(msg.data.key, msg.data.arg, msg.data.opts);
      break;
    case 'reward':
      promise = this._rateLimiters[msg.keyPrefix].reward(msg.data.key, msg.data.arg, msg.data.opts);
      break;
    case 'block':
      promise = this._rateLimiters[msg.keyPrefix].block(msg.data.key, msg.data.arg, msg.data.opts);
      break;
    case 'get':
      promise = this._rateLimiters[msg.keyPrefix].get(msg.data.key, msg.data.opts);
      break;
    case 'delete':
      promise = this._rateLimiters[msg.keyPrefix].delete(msg.data.key, msg.data.opts);
      break;
    default:
      return false;
  }

  if (promise) {
    promise
      .then((res) => {
        masterSendToWorker(worker, msg, 'resolve', res);
      })
      .catch((rejRes) => {
        masterSendToWorker(worker, msg, 'reject', rejRes);
      });
  }
};

const workerProcessMsg = function (msg) {
  if (!msg || msg.channel !== channel || msg.keyPrefix !== this.keyPrefix) {
    return false;
  }

  if (this._promises[msg.promiseId]) {
    clearTimeout(this._promises[msg.promiseId].timeoutId);
    let res;
    if (msg.data === null || msg.data === true || msg.data === false) {
      res = msg.data;
    } else {
      res = new RateLimiterRes(
        msg.data.remainingPoints,
        msg.data.msBeforeNext,
        msg.data.consumedPoints,
        msg.data.isFirstInDuration // eslint-disable-line comma-dangle
      );
    }

    switch (msg.type) {
      case 'resolve':
        this._promises[msg.promiseId].resolve(res);
        break;
      case 'reject':
        this._promises[msg.promiseId].reject(res);
        break;
      default:
        throw new Error(`RateLimiterCluster: no such message type '${msg.type}'`);
    }

    delete this._promises[msg.promiseId];
  }
};
/**
 * Prepare options to send to master
 * Master will create rate limiter depending on options
 *
 * @returns {{points: *, duration: *, blockDuration: *, execEvenly: *, execEvenlyMinDelayMs: *, keyPrefix: *}}
 */
const getOpts = function () {
  return {
    points: this.points,
    duration: this.duration,
    blockDuration: this.blockDuration,
    execEvenly: this.execEvenly,
    execEvenlyMinDelayMs: this.execEvenlyMinDelayMs,
    keyPrefix: this.keyPrefix,
  };
};

const savePromise = function (resolve, reject) {
  const hrtime = process.hrtime();
  let promiseId = hrtime[0].toString() + hrtime[1].toString();

  if (typeof this._promises[promiseId] !== 'undefined') {
    promiseId += crypto.randomBytes(12).toString('base64');
  }

  this._promises[promiseId] = {
    resolve,
    reject,
    timeoutId: setTimeout(() => {
      delete this._promises[promiseId];
      reject(new Error('RateLimiterCluster timeout: no answer from master in time'));
    }, this.timeoutMs),
  };

  return promiseId;
};

class RateLimiterClusterMaster {
  constructor() {
    if (masterInstance) {
      return masterInstance;
    }

    this._rateLimiters = {};

    cluster.setMaxListeners(0);

    cluster.on('message', (worker, msg) => {
      if (msg && msg.channel === channel && msg.type === 'init') {
        // If init request, check or create rate limiter by key prefix and send 'init' back to worker
        if (typeof this._rateLimiters[msg.opts.keyPrefix] === 'undefined') {
          this._rateLimiters[msg.opts.keyPrefix] = new RateLimiterMemory(msg.opts);
        }

        worker.send({
          channel,
          type: 'init',
          keyPrefix: msg.opts.keyPrefix,
        });
      } else {
        masterProcessMsg.call(this, worker, msg);
      }
    });

    masterInstance = this;
  }
}

class RateLimiterClusterMasterPM2 {
  constructor(pm2) {
    if (masterInstance) {
      return masterInstance;
    }

    this._rateLimiters = {};

    pm2.launchBus((err, pm2Bus) => {
      pm2Bus.on('process:msg', (packet) => {
        const msg = packet.raw;
        if (msg && msg.channel === channel && msg.type === 'init') {
          // If init request, check or create rate limiter by key prefix and send 'init' back to worker
          if (typeof this._rateLimiters[msg.opts.keyPrefix] === 'undefined') {
            this._rateLimiters[msg.opts.keyPrefix] = new RateLimiterMemory(msg.opts);
          }

          pm2.sendDataToProcessId(packet.process.pm_id, {
            data: {},
            topic: channel,
            channel,
            type: 'init',
            keyPrefix: msg.opts.keyPrefix,
          }, (sendErr, res) => {
            if (sendErr) {
              console.log(sendErr, res);
            }
          });
        } else {
          const worker = {
            send: (msgData) => {
              const pm2Message = msgData;
              pm2Message.topic = channel;
              if (typeof pm2Message.data === 'undefined') {
                pm2Message.data = {};
              }
              pm2.sendDataToProcessId(packet.process.pm_id, pm2Message, (sendErr, res) => {
                if (sendErr) {
                  console.log(sendErr, res);
                }
              });
            },
          };
          masterProcessMsg.call(this, worker, msg);
        }
      });
    });

    masterInstance = this;
  }
}

class RateLimiterClusterWorker extends RateLimiterAbstract {
  get timeoutMs() {
    return this._timeoutMs;
  }

  set timeoutMs(value) {
    this._timeoutMs = typeof value === 'undefined' ? 5000 : Math.abs(parseInt(value));
  }

  constructor(opts = {}) {
    super(opts);

    process.setMaxListeners(0);

    this.timeoutMs = opts.timeoutMs;

    this._initiated = false;

    process.on('message', (msg) => {
      if (msg && msg.channel === channel && msg.type === 'init' && msg.keyPrefix === this.keyPrefix) {
        this._initiated = true;
      } else {
        workerProcessMsg.call(this, msg);
      }
    });

    // Create limiter on master with specific options
    process.send({
      channel,
      type: 'init',
      opts: getOpts.call(this),
    });

    this._promises = {};
  }

  consume(key, pointsToConsume = 1, options = {}) {
    return new Promise((resolve, reject) => {
      const promiseId = savePromise.call(this, resolve, reject);

      workerSendToMaster.call(this, 'consume', promiseId, key, pointsToConsume, options);
    });
  }

  penalty(key, points = 1, options = {}) {
    return new Promise((resolve, reject) => {
      const promiseId = savePromise.call(this, resolve, reject);

      workerSendToMaster.call(this, 'penalty', promiseId, key, points, options);
    });
  }

  reward(key, points = 1, options = {}) {
    return new Promise((resolve, reject) => {
      const promiseId = savePromise.call(this, resolve, reject);

      workerSendToMaster.call(this, 'reward', promiseId, key, points, options);
    });
  }

  block(key, secDuration, options = {}) {
    return new Promise((resolve, reject) => {
      const promiseId = savePromise.call(this, resolve, reject);

      workerSendToMaster.call(this, 'block', promiseId, key, secDuration, options);
    });
  }

  get(key, options = {}) {
    return new Promise((resolve, reject) => {
      const promiseId = savePromise.call(this, resolve, reject);

      workerSendToMaster.call(this, 'get', promiseId, key, options);
    });
  }

  delete(key, options = {}) {
    return new Promise((resolve, reject) => {
      const promiseId = savePromise.call(this, resolve, reject);

      workerSendToMaster.call(this, 'delete', promiseId, key, options);
    });
  }
}

module.exports = {
  RateLimiterClusterMaster,
  RateLimiterClusterMasterPM2,
  RateLimiterCluster: RateLimiterClusterWorker,
};


/***/ }),

/***/ 50673:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

let drizzleOperators = null;
const CLEANUP_INTERVAL_MS = 300000; // 5 minutes
const EXPIRED_THRESHOLD_MS = 3600000; // 1 hour

class RateLimiterDrizzleError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RateLimiterDrizzleError';
  }
}

async function getDrizzleOperators() {
  if (drizzleOperators) return drizzleOperators;

  try {
    // Use dynamic import to prevent static analysis tools from detecting the import
    function getPackageName() {
      return ['drizzle', 'orm'].join('-');
    }
    const drizzleOrm = await __webpack_require__(65407)(`${getPackageName()}`);
    const { and, or, gt, lt, eq, isNull, sql } = drizzleOrm.default || drizzleOrm;
    drizzleOperators = { and, or, gt, lt, eq, isNull, sql };
    return drizzleOperators;
  } catch (error) {
    throw new RateLimiterDrizzleError(
      'drizzle-orm is not installed. Please install drizzle-orm to use RateLimiterDrizzle.'
    );
  }
}

const RateLimiterStoreAbstract = __webpack_require__(65140);
const RateLimiterRes = __webpack_require__(80449);

class RateLimiterDrizzle extends RateLimiterStoreAbstract {
  constructor(opts) {
    super(opts);

    if (!opts?.schema) {
      throw new RateLimiterDrizzleError('Drizzle schema is required');
    }

    if (!opts?.storeClient) {
      throw new RateLimiterDrizzleError('Drizzle client is required');
    }

    this.schema = opts.schema;
    this.drizzleClient = opts.storeClient;
    this.clearExpiredByTimeout = opts.clearExpiredByTimeout ?? true;

    if (this.clearExpiredByTimeout) {
      this._clearExpiredHourAgo();
    }
  }

  _getRateLimiterRes(rlKey, changedPoints, result) {
    const res = new RateLimiterRes();

    let doc = result;
    res.isFirstInDuration = doc.points === changedPoints;
    res.consumedPoints = doc.points;
    res.remainingPoints = Math.max(this.points - res.consumedPoints, 0);
    res.msBeforeNext = doc.expire !== null
      ? Math.max(new Date(doc.expire).getTime() - Date.now(), 0)
      : -1;

    return res;
  }

  async _upsert(key, points, msDuration, forceExpire = false) {
    if (!this.drizzleClient) {
      return Promise.reject(new RateLimiterDrizzleError('Drizzle client is not established'))
    }

    const { eq, sql } = await getDrizzleOperators();
    const now = new Date();
    const newExpire = msDuration > 0 ? new Date(now.getTime() + msDuration) : null;

    const query = await this.drizzleClient.transaction(async (tx) => {
      const [existingRecord] = await tx
        .select()
        .from(this.schema)
        .where(eq(this.schema.key, key))
        .limit(1);

      const shouldUpdateExpire =
        forceExpire ||
        !existingRecord?.expire ||
        existingRecord?.expire <= now ||
        newExpire === null;

      const [data] = await tx
        .insert(this.schema)
        .values({
          key,
          points,
          expire: newExpire,
        })
        .onConflictDoUpdate({
          target: this.schema.key,
          set: {
            points: !shouldUpdateExpire
              ? sql`${this.schema.points} + ${points}`
              : points,
            ...(shouldUpdateExpire && { expire: newExpire }),
          },
        })
        .returning();

      return data;
    })

    return query
  }

  async _get(rlKey) {
    if (!this.drizzleClient) {
      return Promise.reject(new RateLimiterDrizzleError('Drizzle client is not established'))
    }

    const { and, or, gt, eq, isNull } = await getDrizzleOperators();

    const [response] = await this.drizzleClient
      .select()
      .from(this.schema)
      .where(
        and(
          eq(this.schema.key, rlKey),
          or(gt(this.schema.expire, new Date()), isNull(this.schema.expire))
        )
      )
      .limit(1);

    return response || null;

  }

  async _delete(rlKey) {
    if (!this.drizzleClient) {
      return Promise.reject(new RateLimiterDrizzleError('Drizzle client is not established'))
    }

    const { eq } = await getDrizzleOperators();

    const [result] = await this.drizzleClient
      .delete(this.schema)
      .where(eq(this.schema.key, rlKey))
      .returning({ key: this.schema.key });

    return !!result?.key
  }

  _clearExpiredHourAgo() {
    if (this._clearExpiredTimeoutId) {
      clearTimeout(this._clearExpiredTimeoutId);
    }

    this._clearExpiredTimeoutId = setTimeout(async () => {
      try {
        const { lt } = await getDrizzleOperators();
        await this.drizzleClient
          .delete(this.schema)
          .where(lt(this.schema.expire, new Date(Date.now() - EXPIRED_THRESHOLD_MS)));
      } catch (error) {
        console.warn('Failed to clear expired records:', error);
      }

      this._clearExpiredHourAgo();
    }, CLEANUP_INTERVAL_MS);

    this._clearExpiredTimeoutId.unref();
  }
}

module.exports = RateLimiterDrizzle;


/***/ }),

/***/ 75347:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

let drizzleOperators = null;
const CLEANUP_INTERVAL_MS = 300000; // 5 minutes
const EXPIRED_THRESHOLD_MS = 3600000; // 1 hour

class RateLimiterDrizzleError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RateLimiterDrizzleError';
  }
}

async function getDrizzleOperators() {
  if (drizzleOperators) return drizzleOperators;

  try {
    // Use dynamic import to prevent static analysis tools from detecting the import
    function getPackageName() {
      return ['drizzle', 'orm'].join('-');
    }
    const drizzleOrm = await __webpack_require__(65407)(`${getPackageName()}`);
    const { and, or, gt, lt, eq, isNull, sql } = drizzleOrm.default || drizzleOrm;
    drizzleOperators = { and, or, gt, lt, eq, isNull, sql };
    return drizzleOperators;
  } catch (error) {
    throw new RateLimiterDrizzleError(
      'drizzle-orm is not installed. Please install drizzle-orm to use RateLimiterDrizzleNonAtomic.'
    );
  }
}

const RateLimiterStoreAbstract = __webpack_require__(65140);
const RateLimiterRes = __webpack_require__(80449);

class RateLimiterDrizzleNonAtomic extends RateLimiterStoreAbstract {
  constructor(opts) {
    super(opts);

    if (!opts?.schema) {
      throw new RateLimiterDrizzleError('Drizzle schema is required');
    }

    if (!opts?.storeClient) {
      throw new RateLimiterDrizzleError('Drizzle client is required');
    }

    this.schema = opts.schema;
    this.drizzleClient = opts.storeClient;
    this.clearExpiredByTimeout = opts.clearExpiredByTimeout ?? true;

    if (this.clearExpiredByTimeout) {
      this._clearExpiredHourAgo();
    }
  }

  _getRateLimiterRes(rlKey, changedPoints, result) {
    const res = new RateLimiterRes();

    let doc = result;
    res.isFirstInDuration = doc.points === changedPoints;
    res.consumedPoints = doc.points;
    res.remainingPoints = Math.max(this.points - res.consumedPoints, 0);
    res.msBeforeNext = doc.expire !== null
      ? Math.max(new Date(doc.expire).getTime() - Date.now(), 0)
      : -1;

    return res;
  }

  async _upsert(key, points, msDuration, forceExpire = false) {
    if (!this.drizzleClient) {
      return Promise.reject(new RateLimiterDrizzleError('Drizzle client is not established'));
    }

    const { eq } = await getDrizzleOperators();
    const now = new Date();
    const newExpire = msDuration > 0 ? new Date(now.getTime() + msDuration) : null;

    const [existingRecord] = await this.drizzleClient
      .select()
      .from(this.schema)
      .where(eq(this.schema.key, key))
      .limit(1);

    const shouldUpdateExpire =
      forceExpire ||
      !existingRecord ||
      !existingRecord.expire ||
      existingRecord.expire <= now ||
      newExpire === null;

    let newPoints;
    if (existingRecord && !shouldUpdateExpire) {
      newPoints = existingRecord.points + points;
    } else {
      newPoints = points;
    }

    const [data] = await this.drizzleClient
      .insert(this.schema)
      .values({
        key,
        points: newPoints,
        expire: newExpire,
      })
      .onConflictDoUpdate({
        target: this.schema.key,
        set: {
          points: newPoints,
          ...(shouldUpdateExpire && { expire: newExpire }),
        },
      })
      .returning();

    return data;
  }

  async _get(rlKey) {
    if (!this.drizzleClient) {
      return Promise.reject(new RateLimiterDrizzleError('Drizzle client is not established'));
    }

    const { and, or, gt, eq, isNull } = await getDrizzleOperators();

    const [response] = await this.drizzleClient
      .select()
      .from(this.schema)
      .where(
        and(
          eq(this.schema.key, rlKey),
          or(gt(this.schema.expire, new Date()), isNull(this.schema.expire))
        )
      )
      .limit(1);

    return response || null;
  }

  async _delete(rlKey) {
    if (!this.drizzleClient) {
      return Promise.reject(new RateLimiterDrizzleError('Drizzle client is not established'));
    }

    const { eq } = await getDrizzleOperators();

    const [result] = await this.drizzleClient
      .delete(this.schema)
      .where(eq(this.schema.key, rlKey))
      .returning({ key: this.schema.key });

    return !!(result && result.key);
  }

  _clearExpiredHourAgo() {
    if (this._clearExpiredTimeoutId) {
      clearTimeout(this._clearExpiredTimeoutId);
    }

    this._clearExpiredTimeoutId = setTimeout(async () => {
      try {
        const { lt } = await getDrizzleOperators();
        await this.drizzleClient
          .delete(this.schema)
          .where(lt(this.schema.expire, new Date(Date.now() - EXPIRED_THRESHOLD_MS)));
      } catch (error) {
        console.warn('Failed to clear expired records:', error);
      }

      this._clearExpiredHourAgo();
    }, CLEANUP_INTERVAL_MS);

    this._clearExpiredTimeoutId.unref();
  }
}

module.exports = RateLimiterDrizzleNonAtomic;


/***/ }),

/***/ 82309:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const RateLimiterRes = __webpack_require__(80449);
const RateLimiterStoreAbstract = __webpack_require__(65140);

class DynamoItem {
  /**
   * Create a DynamoItem.
   * @param {string} rlKey - The key for the rate limiter.
   * @param {number} points - The number of points.
   * @param {number} expire - The expiration time in seconds.
   */
  constructor(rlKey, points, expire) {
    this.key = rlKey;
    this.points = points;
    this.expire = expire;
  }
}

// Free tier DynamoDB provisioned mode params
const DEFAULT_READ_CAPACITY_UNITS = 25;
const DEFAULT_WRITE_CAPACITY_UNITS = 25;

/**
 * Implementation of RateLimiterStoreAbstract using DynamoDB.
 * @class RateLimiterDynamo
 * @extends RateLimiterStoreAbstract
 */
class RateLimiterDynamo extends RateLimiterStoreAbstract {

    /**
     * Constructs a new instance of the class.
     * The storeClient MUST be an instance of AWS.DynamoDB NOT of AWS.DynamoDBClient.
     *
     * @param {Object} opts - The options for the constructor.
     * @param {function} cb - The callback function (optional).
     * @return {void}
     */
    constructor(opts, cb = null) {
        super(opts);

        this.client = opts.storeClient;
        this.tableName = opts.tableName;
        this.tableCreated = opts.tableCreated;
        this.ttlManuallySet = opts.ttlSet;
        
        if (!this.tableCreated) {
          this._createTable(opts.dynamoTableOpts)
          .then((data) => {
            this.tableCreated = true;

            this._setTTL()
            .finally(() => {
              // Callback invocation
              if (typeof cb === 'function') {
                cb();
              }
            });
            
          })
          .catch( err => {
            //callback invocation
            if (typeof cb === 'function') {
              cb(err);
            } else {
              throw err;
            }
          });

        } else {

          this._setTTL()
          .finally(() => {
            // Callback invocation
            if (typeof cb === 'function') {
              cb();
            }
          });
        }
    }

    get tableName() {
        return this._tableName;
    }

    set tableName(value) {
        this._tableName = typeof value === 'undefined' ? 'node-rate-limiter-flexible' : value;
    }

    get tableCreated() {
        return this._tableCreated
    }
    
    set tableCreated(value) {
        this._tableCreated = typeof value === 'undefined' ? false : !!value;
    }

    /**
     * Creates a table in the database. Return null if the table already exists.
     * 
     * @param {{readCapacityUnits: number, writeCapacityUnits: number}} tableOpts
     * @return {Promise} A promise that resolves with the result of creating the table.
     */
    async _createTable(tableOpts) {

      const params = {
        TableName: this.tableName,
        AttributeDefinitions: [
          {
            AttributeName: 'key',
            AttributeType: 'S'
          }
        ],
        KeySchema: [
          {
            AttributeName: 'key',
            KeyType: 'HASH'
          }
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: tableOpts && tableOpts.readCapacityUnits ? tableOpts.readCapacityUnits : DEFAULT_READ_CAPACITY_UNITS,
          WriteCapacityUnits: tableOpts && tableOpts.writeCapacityUnits ? tableOpts.writeCapacityUnits : DEFAULT_WRITE_CAPACITY_UNITS
        }
      };
      
      try {
        const data = await this.client.createTable(params);
        return data;
      } catch(err) {
        if (err.__type && err.__type.includes('ResourceInUseException')) {
          return null;
        } else {
          throw err;
        }
      }
    }

    /**
     * Retrieves an item from the table based on the provided key.
     *
     * @param {string} rlKey - The key used to retrieve the item.
     * @throws {Error} Throws an error if the table is not created yet.
     * @return {DynamoItem|null} - The retrieved item, or null if it doesn't exist.
     */
    async _get(rlKey) {

      if (!this.tableCreated) {
        throw new Error('Table is not created yet');
      }

      const params = {
        TableName: this.tableName,
        Key: {
          key: {S: rlKey}
        }
      };
      
      const data = await this.client.getItem(params);
      if(data.Item) {
        return new DynamoItem(
          data.Item.key.S,
          Number(data.Item.points.N),
          Number(data.Item.expire.N)
        );
      } else {
        return null;
      }
    }

    /**
     * Deletes an item from the table based on the given rlKey.
     *
     * @param {string} rlKey - The rlKey of the item to delete.
     * @throws {Error} Throws an error if the table is not created yet.
     * @return {boolean} Returns true if the item was successfully deleted, otherwise false.
     */
    async _delete(rlKey) {

      if (!this.tableCreated) {
        throw new Error('Table is not created yet');
      }

      const params = {
        TableName: this.tableName,
        Key: {
          key: {S: rlKey}
        },
        ConditionExpression: 'attribute_exists(#k)',
        ExpressionAttributeNames: {
          '#k': 'key'  
        }
      }
      
      try {
        const data = await this._client.deleteItem(params);
        return data.$metadata.httpStatusCode === 200;
      } catch(err) {
        // ConditionalCheckFailed, item does not exist in table
        if (err.__type && err.__type.includes('ConditionalCheckFailedException')) {
          return false;
        } else {
          throw err;
        }
      }

    }

    /**
     * Implemented with DynamoDB Atomic Counters. 3 calls are made to DynamoDB but each call is atomic.
     * From the documentation: "UpdateItem calls are naturally serialized within DynamoDB,
     * so there are no race condition concerns with making multiple simultaneous calls."
     * See: https://aws.amazon.com/it/blogs/database/implement-resource-counters-with-amazon-dynamodb/
     * @param {*} rlKey 
     * @param {*} points 
     * @param {*} msDuration 
     * @param {*} forceExpire 
     * @param {*} options 
     * @returns
     */
    async _upsert(rlKey, points, msDuration, forceExpire = false, options = {}) {

      if (!this.tableCreated) {
        throw new Error('Table is not created yet');
      }

      const dateNow = Date.now();
      const dateNowSec = dateNow / 1000;
      /* -1 means never expire, DynamoDb do not support null values in number fields.
         DynamoDb TTL use unix timestamp in seconds.
      */
      const newExpireSec = msDuration > 0 ? (dateNow + msDuration) / 1000 : -1;

      // Force expire, overwrite points. Create a new entry if not exists
      if (forceExpire) {
        return await this._baseUpsert({
          TableName: this.tableName,
          Key: { key: {S: rlKey} },
          UpdateExpression: 'SET points = :points, expire = :expire',
          ExpressionAttributeValues: {
            ':points': {N: points.toString()},
            ':expire': {N: newExpireSec.toString()}
          },
          ReturnValues: 'ALL_NEW'
        });
      }

      try {        
        // First try update, success if entry NOT exists or IS expired
        return await this._baseUpsert({
          TableName: this.tableName,
          Key: { key: {S: rlKey} },
          UpdateExpression: 'SET points = :new_points, expire = :new_expire',
          ExpressionAttributeValues: {
            ':new_points': {N: points.toString()},
            ':new_expire': {N: newExpireSec.toString()},
            ':where_expire': {N: dateNowSec.toString()}
          },
          ConditionExpression: 'expire <= :where_expire OR attribute_not_exists(points)',
          ReturnValues: 'ALL_NEW'
        });

      } catch (err) {
        // Second try update, success if entry exists and IS NOT expired
        return await this._baseUpsert({
          TableName: this.tableName,
          Key: { key: {S: rlKey} },
          UpdateExpression: 'SET points = points + :new_points',
          ExpressionAttributeValues: {
            ':new_points': {N: points.toString()},
            ':where_expire': {N: dateNowSec.toString()}
          },
          ConditionExpression: 'expire > :where_expire',
          ReturnValues: 'ALL_NEW'
        });
      }
    }
    
    /**
     * Asynchronously upserts data into the table. params is a DynamoDB params object.
     *
     * @param {Object} params - The parameters for the upsert operation.
     * @throws {Error} Throws an error if the table is not created yet.
     * @return {DynamoItem} Returns a DynamoItem object with the updated data.
     */
    async _baseUpsert(params) {

      if (!this.tableCreated) {
        throw new Error('Table is not created yet');
      }
      
      try {
        const data = await this.client.updateItem(params);
        return new DynamoItem(
          data.Attributes.key.S,
          Number(data.Attributes.points.N),
          Number(data.Attributes.expire.N)
        );
      } catch (err) {
        //console.log('_baseUpsert', params, err);
        throw err;
      }
    }

    /**
     * Sets the Time-to-Live (TTL) for the table. TTL use the expire field in the table.
     * See: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/howitworks-ttl.html
     *
     * @return {Promise} A promise that resolves when the TTL is successfully set.
     * @throws {Error} Throws an error if the table is not created yet.
     * @returns {Promise}
     */
    async _setTTL() {

      if (!this.tableCreated) {
        throw new Error('Table is not created yet');
      }

      try {
        
        // Check if the TTL is already set
        const isTTLSet = await this._isTTLSet();
        if (isTTLSet) {
          return;
        }

        const params = {
          TableName: this.tableName,
          TimeToLiveSpecification: {
            AttributeName: 'expire',
            Enabled: true
          }
        }

        const res = await this.client.updateTimeToLive(params);
        return res;

      } catch (err) {
        throw err;
      }

    }

    /**
     * Checks if the Time To Live (TTL) feature is set for the DynamoDB table.
     *
     * @return {boolean} Returns true if the TTL feature is enabled for the table, otherwise false.
     * @throws {Error} Throws an error if the table is not created yet or if there is an error while checking the TTL status.
     */
    async _isTTLSet() {
      
      if (!this.tableCreated) {
        throw new Error('Table is not created yet');
      }

      if (this.ttlManuallySet) {
        return true;
      }

      try {

        const res = await this.client.describeTimeToLive({TableName: this.tableName});
        return (
          res.$metadata.httpStatusCode == 200 
          && res.TimeToLiveDescription.TimeToLiveStatus === 'ENABLED'
          && res.TimeToLiveDescription.AttributeName === 'expire'
        );
        
      } catch (err) {
        throw err;
      }
    }

    /**
     * Generate a RateLimiterRes object based on the provided parameters.
     *
     * @param {string} rlKey - The key for the rate limiter.
     * @param {number} changedPoints - The number of points that have changed.
     * @param {DynamoItem} result - The result object of _get() method.
     * @returns {RateLimiterRes} - The generated RateLimiterRes object.
     */
    _getRateLimiterRes(rlKey, changedPoints, result) {

      const res = new RateLimiterRes();
      res.isFirstInDuration = changedPoints === result.points;
      res.consumedPoints = res.isFirstInDuration ? changedPoints : result.points;
      res.remainingPoints = Math.max(this.points - res.consumedPoints, 0);
      // Expire time saved in unix time seconds not ms
      res.msBeforeNext = result.expire != -1 ? Math.max(result.expire * 1000 - Date.now(), 0) : -1;

      return res;
    }

}

module.exports = RateLimiterDynamo;

/***/ }),

/***/ 36481:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const RateLimiterEtcdTransactionFailedError = __webpack_require__(43184);
const RateLimiterEtcdNonAtomic = __webpack_require__(15299);

const MAX_TRANSACTION_TRIES = 5;

class RateLimiterEtcd extends RateLimiterEtcdNonAtomic {
  /**
   * Resolve with object used for {@link _getRateLimiterRes} to generate {@link RateLimiterRes}.
   */
  async _upsert(rlKey, points, msDuration, forceExpire = false) {
    const expire = msDuration > 0 ? Date.now() + msDuration : null;

    let newValue = { points, expire };
    let oldValue;

    // If we need to force the expiration, just set the key.
    if (forceExpire) {
      await this.client
        .put(rlKey)
        .value(JSON.stringify(newValue));
    } else {
      // First try to add a new key
      const added = await this.client
        .if(rlKey, 'Version', '===', '0')
        .then(this.client
          .put(rlKey)
          .value(JSON.stringify(newValue)))
        .commit()
        .then(result => !!result.succeeded);

      // If the key already existed, try to update it in a transaction
      if (!added) {
        let success = false;

        for (let i = 0; i < MAX_TRANSACTION_TRIES; i++) {
          // eslint-disable-next-line no-await-in-loop
          oldValue = await this._get(rlKey);
          newValue = { points: oldValue.points + points, expire };

          // eslint-disable-next-line no-await-in-loop
          success = await this.client
            .if(rlKey, 'Value', '===', JSON.stringify(oldValue))
            .then(this.client
              .put(rlKey)
              .value(JSON.stringify(newValue)))
            .commit()
            .then(result => !!result.succeeded);
          if (success) {
            break;
          }
        }

        if (!success) {
          throw new RateLimiterEtcdTransactionFailedError('Could not set new value in a transaction.');
        }
      }
    }

    return newValue;
  }
}

module.exports = RateLimiterEtcd;


/***/ }),

/***/ 15299:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const RateLimiterStoreAbstract = __webpack_require__(65140);
const RateLimiterRes = __webpack_require__(80449);
const RateLimiterSetupError = __webpack_require__(72922);

class RateLimiterEtcdNonAtomic extends RateLimiterStoreAbstract {
  /**
   * @param {Object} opts
   */
  constructor(opts) {
    super(opts);

    if (!opts.storeClient) {
      throw new RateLimiterSetupError('You need to set the option "storeClient" to an instance of class "Etcd3".');
    }

    this.client = opts.storeClient;
  }

  /**
   * Get RateLimiterRes object filled depending on storeResult, which specific for exact store.
   */
  _getRateLimiterRes(rlKey, changedPoints, result) {
    const res = new RateLimiterRes();

    res.isFirstInDuration = changedPoints === result.points;
    res.consumedPoints = res.isFirstInDuration ? changedPoints : result.points;
    res.remainingPoints = Math.max(this.points - res.consumedPoints, 0);
    res.msBeforeNext = result.expire ? Math.max(result.expire - Date.now(), 0) : -1;

    return res;
  }

  /**
   * Resolve with object used for {@link _getRateLimiterRes} to generate {@link RateLimiterRes}.
   */
  async _upsert(rlKey, points, msDuration, forceExpire = false) {
    const expire = msDuration > 0 ? Date.now() + msDuration : null;

    let newValue = { points, expire };

    // If we need to force the expiration, just set the key.
    if (forceExpire) {
      await this.client
        .put(rlKey)
        .value(JSON.stringify(newValue));
    } else {
      const oldValue = await this._get(rlKey);
      newValue = { points: (oldValue !== null ? oldValue.points : 0) + points, expire };
      await this.client
        .put(rlKey)
        .value(JSON.stringify(newValue));
    }

    return newValue;
  }

  /**
   * Resolve with raw result from Store OR null if rlKey is not set
   * or Reject with error
   */
  async _get(rlKey) {
    return this.client
      .get(rlKey)
      .string()
      .then(result => (result !== null ? JSON.parse(result) : null));
  }

  /**
   * Resolve with true OR false if rlKey doesn't exist.
   * or Reject with error.
   */
  async _delete(rlKey) {
    return this.client
      .delete()
      .key(rlKey)
      .then(result => result.deleted === '1');
  }
}

module.exports = RateLimiterEtcdNonAtomic;


/***/ }),

/***/ 33847:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const RateLimiterAbstract = __webpack_require__(88569);
const RateLimiterRes = __webpack_require__(80449);

module.exports = class RateLimiterInsuredAbstract extends RateLimiterAbstract {
  constructor(opts = {}) {
    super(opts);
    this.insuranceLimiter = opts.insuranceLimiter;
  }

  get insuranceLimiter() {
    return this._insuranceLimiter;
  }

  set insuranceLimiter(value) {
    if (typeof value !== 'undefined' && !(value instanceof RateLimiterAbstract)) {
      throw new Error('insuranceLimiter must be instance of RateLimiterAbstract');
    }
    this._insuranceLimiter = value;
    if (this._insuranceLimiter) {
      this._insuranceLimiter.blockDuration = this.blockDuration;
      this._insuranceLimiter.execEvenly = this.execEvenly;
    }
  }

  _handleError(err, funcName, resolve, reject, params) {
    if (err instanceof RateLimiterRes) {
      reject(err);
    } else if (!(this.insuranceLimiter instanceof RateLimiterAbstract)) {
      reject(err);
    } else {
      this.insuranceLimiter[funcName](...params)
        .then((res) => {
          resolve(res);
        })
        .catch((res) => {
          reject(res);
        });
    }
  }

  _operation(funcName, params) {
    const promise = this[funcName](...params);
    return new Promise((resolve, reject) => {
      return promise.then((res) => {
          resolve(res);
        })
        .catch((err) => {
          if (funcName.startsWith('_')) {
            funcName = funcName.slice(1);
          }
          this._handleError(err, funcName, resolve, reject, params);
        });
    });
  }

  consume(key, pointsToConsume = 1, options = {}) {
    return this._operation('_consume', [key, pointsToConsume, options]);
  }

  penalty(key, points = 1, options = {}) {
    return this._operation('_penalty', [key, points, options]);
  }

  reward(key, points = 1, options = {}) {
    return this._operation('_reward', [key, points, options]);
  }

  get(key, options = {}) {
    return this._operation('_get', [key, options]);
  }

  set(key, points, secDuration, options = {}) {
    return this._operation('_set', [key, points, secDuration, options]);
  }

  block(key, secDuration, options = {}) {
    return this._operation('_block', [key, secDuration, options]);
  }

  delete(key, options = {}) {
    return this._operation('_delete', [key, options]);
  }

  _consume() {
    throw new Error("You have to implement the method '_consume'!");
  }

  _penalty() {
    throw new Error("You have to implement the method '_penalty'!");
  }

  _reward() {
    throw new Error("You have to implement the method '_reward'!");
  }

  _get() {
    throw new Error("You have to implement the method '_get'!");
  }

  _set() {
    throw new Error("You have to implement the method '_set'!");
  }

  _block() {
    throw new Error("You have to implement the method '_block'!");
  }

  _delete() {
    throw new Error("You have to implement the method '_delete'!");
  }

}


/***/ }),

/***/ 73250:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const RateLimiterStoreAbstract = __webpack_require__(65140);
const RateLimiterRes = __webpack_require__(80449);

class RateLimiterMemcache extends RateLimiterStoreAbstract {
  /**
   *
   * @param {Object} opts
   * Defaults {
   *   ... see other in RateLimiterStoreAbstract
   *
   *   storeClient: memcacheClient
   * }
   */
  constructor(opts) {
    super(opts);

    this.client = opts.storeClient;
  }

  _getRateLimiterRes(rlKey, changedPoints, result) {
    const res = new RateLimiterRes();
    res.consumedPoints = parseInt(result.consumedPoints);
    res.isFirstInDuration = result.consumedPoints === changedPoints;
    res.remainingPoints = Math.max(this.points - res.consumedPoints, 0);
    res.msBeforeNext = result.msBeforeNext;

    return res;
  }

  _upsert(rlKey, points, msDuration, forceExpire = false, options = {}) {
    return new Promise((resolve, reject) => {
      const nowMs = Date.now();
      const secDuration = Math.floor(msDuration / 1000);

      if (forceExpire) {
        this.client.set(rlKey, points, secDuration, (err) => {
          if (!err) {
            this.client.set(
              `${rlKey}_expire`,
              secDuration > 0 ? nowMs + (secDuration * 1000) : -1,
              secDuration,
              () => {
                const res = {
                  consumedPoints: points,
                  msBeforeNext: secDuration > 0 ? secDuration * 1000 : -1,
                };
                resolve(res);
              }
            );
          } else {
            reject(err);
          }
        });
      } else {
        this.client.incr(rlKey, points, (err, consumedPoints) => {
          if (err || consumedPoints === false) {
            this.client.add(rlKey, points, secDuration, (errAddKey, createdNew) => {
              if (errAddKey || !createdNew) {
                // Try to upsert again in case of race condition
                if (typeof options.attemptNumber === 'undefined' || options.attemptNumber < 3) {
                  const nextOptions = Object.assign({}, options);
                  nextOptions.attemptNumber = nextOptions.attemptNumber ? (nextOptions.attemptNumber + 1) : 1;

                  this._upsert(rlKey, points, msDuration, forceExpire, nextOptions)
                    .then(resUpsert => resolve(resUpsert))
                    .catch(errUpsert => reject(errUpsert));
                } else {
                  reject(new Error('Can not add key'));
                }
              } else {
                this.client.add(
                  `${rlKey}_expire`,
                  secDuration > 0 ? nowMs + (secDuration * 1000) : -1,
                  secDuration,
                  () => {
                    const res = {
                      consumedPoints: points,
                      msBeforeNext: secDuration > 0 ? secDuration * 1000 : -1,
                    };
                    resolve(res);
                  }
                );
              }
            });
          } else {
            this.client.get(`${rlKey}_expire`, (errGetExpire, resGetExpireMs) => {
              if (errGetExpire) {
                reject(errGetExpire);
              } else {
                const expireMs = resGetExpireMs === false ? 0 : resGetExpireMs;
                const res = {
                  consumedPoints,
                  msBeforeNext: expireMs >= 0 ? Math.max(expireMs - nowMs, 0) : -1,
                };
                resolve(res);
              }
            });
          }
        });
      }
    });
  }

  _get(rlKey) {
    return new Promise((resolve, reject) => {
      const nowMs = Date.now();

      this.client.get(rlKey, (err, consumedPoints) => {
        if (!consumedPoints) {
          resolve(null);
        } else {
          this.client.get(`${rlKey}_expire`, (errGetExpire, resGetExpireMs) => {
            if (errGetExpire) {
              reject(errGetExpire);
            } else {
              const expireMs = resGetExpireMs === false ? 0 : resGetExpireMs;
              const res = {
                consumedPoints,
                msBeforeNext: expireMs >= 0 ? Math.max(expireMs - nowMs, 0) : -1,
              };
              resolve(res);
            }
          });
        }
      });
    });
  }

  _delete(rlKey) {
    return new Promise((resolve, reject) => {
      this.client.del(rlKey, (err, res) => {
        if (err) {
          reject(err);
        } else if (res === false) {
          resolve(res);
        } else {
          this.client.del(`${rlKey}_expire`, (errDelExpire) => {
            if (errDelExpire) {
              reject(errDelExpire);
            } else {
              resolve(res);
            }
          });
        }
      });
    });
  }
}

module.exports = RateLimiterMemcache;


/***/ }),

/***/ 24544:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const RateLimiterAbstract = __webpack_require__(88569);
const MemoryStorage = __webpack_require__(81534);
const RateLimiterRes = __webpack_require__(80449);

class RateLimiterMemory extends RateLimiterAbstract {
  constructor(opts = {}) {
    super(opts);

    this._memoryStorage = new MemoryStorage();
  }
  /**
   *
   * @param key
   * @param pointsToConsume
   * @param {Object} options
   * @returns {Promise<RateLimiterRes>}
   */
  consume(key, pointsToConsume = 1, options = {}) {
    return new Promise((resolve, reject) => {
      const rlKey = this.getKey(key);
      const secDuration = this._getKeySecDuration(options);
      let res = this._memoryStorage.incrby(rlKey, pointsToConsume, secDuration);
      res.remainingPoints = Math.max(this.points - res.consumedPoints, 0);

      if (res.consumedPoints > this.points) {
        // Block only first time when consumed more than points
        if (this.blockDuration > 0 && res.consumedPoints <= (this.points + pointsToConsume)) {
          // Block key
          res = this._memoryStorage.set(rlKey, res.consumedPoints, this.blockDuration);
        }
        reject(res);
      } else if (this.execEvenly && res.msBeforeNext > 0 && !res.isFirstInDuration) {
        // Execute evenly
        let delay = Math.ceil(res.msBeforeNext / (res.remainingPoints + 2));
        if (delay < this.execEvenlyMinDelayMs) {
          delay = res.consumedPoints * this.execEvenlyMinDelayMs;
        }

        setTimeout(resolve, delay, res);
      } else {
        resolve(res);
      }
    });
  }

  penalty(key, points = 1, options = {}) {
    const rlKey = this.getKey(key);
    return new Promise((resolve) => {
      const secDuration = this._getKeySecDuration(options);
      const res = this._memoryStorage.incrby(rlKey, points, secDuration);
      res.remainingPoints = Math.max(this.points - res.consumedPoints, 0);
      resolve(res);
    });
  }

  reward(key, points = 1, options = {}) {
    const rlKey = this.getKey(key);
    return new Promise((resolve) => {
      const secDuration = this._getKeySecDuration(options);
      const res = this._memoryStorage.incrby(rlKey, -points, secDuration);
      res.remainingPoints = Math.max(this.points - res.consumedPoints, 0);
      resolve(res);
    });
  }

  /**
   * Block any key for secDuration seconds
   *
   * @param key
   * @param secDuration
   */
  block(key, secDuration) {
    const msDuration = secDuration * 1000;
    const initPoints = this.points + 1;

    this._memoryStorage.set(this.getKey(key), initPoints, secDuration);
    return Promise.resolve(
      new RateLimiterRes(0, msDuration === 0 ? -1 : msDuration, initPoints)
    );
  }

  set(key, points, secDuration) {
    const msDuration = (secDuration >= 0 ? secDuration : this.duration) * 1000;

    this._memoryStorage.set(this.getKey(key), points, secDuration);
    return Promise.resolve(
      new RateLimiterRes(0, msDuration === 0 ? -1 : msDuration, points)
    );
  }

  get(key) {
    const res = this._memoryStorage.get(this.getKey(key));
    if (res !== null) {
      res.remainingPoints = Math.max(this.points - res.consumedPoints, 0);
    }

    return Promise.resolve(res);
  }

  delete(key) {
    return Promise.resolve(this._memoryStorage.delete(this.getKey(key)));
  }
}

module.exports = RateLimiterMemory;



/***/ }),

/***/ 28439:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const RateLimiterStoreAbstract = __webpack_require__(65140);
const RateLimiterRes = __webpack_require__(80449);

/**
 * Get MongoDB driver version as upsert options differ
 * @params {Object} Client instance
 * @returns {Object} Version Object containing major, feature & minor versions.
 */
function getDriverVersion(client) {
  try {
    const _client = client.client ? client.client : client;

    let _v = [0, 0, 0];
    if (typeof _client.topology === 'undefined') {
      const { version } = _client.options.metadata.driver;
      _v = version.split('|', 1)[0].split('.').map(v => parseInt(v));
    } else {
      const { version } = _client.topology.s.options.metadata.driver;
      _v = version.split('.').map(v => parseInt(v));
    }

    return {
      major: _v[0],
      feature: _v[1],
      patch: _v[2],
    };
  } catch (err) {
    return { major: 0, feature: 0, patch: 0 };
  }
}

class RateLimiterMongo extends RateLimiterStoreAbstract {
  /**
   *
   * @param {Object} opts
   * Defaults {
   *   indexKeyPrefix: {attr1: 1, attr2: 1}
   *   ... see other in RateLimiterStoreAbstract
   *
   *   mongo: MongoClient
   * }
   */
  constructor(opts) {
    super(opts);

    this.dbName = opts.dbName;
    this.tableName = opts.tableName;
    this.indexKeyPrefix = opts.indexKeyPrefix;
    this.disableIndexesCreation = opts.disableIndexesCreation;

    if (opts.mongo) {
      this.client = opts.mongo;
    } else {
      this.client = opts.storeClient;
    }
    if (typeof this.client.then === 'function') {
      // If Promise
      this.client
        .then((conn) => {
          this.client = conn;
          this._initCollection();
          this._driverVersion = getDriverVersion(this.client);
        });
    } else {
      this._initCollection();
      this._driverVersion = getDriverVersion(this.client);
    }
  }

  get dbName() {
    return this._dbName;
  }

  set dbName(value) {
    this._dbName = typeof value === 'undefined' ? RateLimiterMongo.getDbName() : value;
  }

  static getDbName() {
    return 'node-rate-limiter-flexible';
  }

  get tableName() {
    return this._tableName;
  }

  set tableName(value) {
    this._tableName = typeof value === 'undefined' ? this.keyPrefix : value;
  }

  get client() {
    return this._client;
  }

  set client(value) {
    if (typeof value === 'undefined') {
      throw new Error('mongo is not set');
    }
    this._client = value;
  }

  get indexKeyPrefix() {
    return this._indexKeyPrefix;
  }

  set indexKeyPrefix(obj) {
    this._indexKeyPrefix = obj || {};
  }

  get disableIndexesCreation() {
    return this._disableIndexesCreation;
  }
  set disableIndexesCreation(value) {
    this._disableIndexesCreation = !!value;
  }

  async createIndexes() {
    const db = typeof this.client.db === 'function'
      ? this.client.db(this.dbName)
      : this.client;

    const collection = db.collection(this.tableName);
    await collection.createIndex({ expire: -1 }, { expireAfterSeconds: 0 });
    await collection.createIndex(Object.assign({}, this.indexKeyPrefix, { key: 1 }), { unique: true });
  }

  _initCollection() {
    const db = typeof this.client.db === 'function'
      ? this.client.db(this.dbName)
      : this.client;

    const collection = db.collection(this.tableName);
    if (!this.disableIndexesCreation) {
      this.createIndexes().catch((err) => {
        console.error(`Cannot create indexes for mongo collection ${this.tableName}`, err);
      });
    }

    this._collection = collection;
  }

  _getRateLimiterRes(rlKey, changedPoints, result) {
    const res = new RateLimiterRes();

    let doc;
    if (typeof result.value === 'undefined') {
      doc = result;
    } else {
      doc = result.value;
    }

    res.isFirstInDuration = doc.points === changedPoints;
    res.consumedPoints = doc.points;

    res.remainingPoints = Math.max(this.points - res.consumedPoints, 0);
    res.msBeforeNext = doc.expire !== null
      ? Math.max(new Date(doc.expire).getTime() - Date.now(), 0)
      : -1;

    return res;
  }

  _upsert(key, points, msDuration, forceExpire = false, options = {}) {
    if (!this._collection) {
      return Promise.reject(Error('Mongo connection is not established'));
    }

    const docAttrs = options.attrs || {};

    let where;
    let upsertData;
    if (forceExpire) {
      where = { key };
      where = Object.assign(where, docAttrs);
      upsertData = {
        $set: {
          key,
          points,
          expire: msDuration > 0 ? new Date(Date.now() + msDuration) : null,
        },
      };
      upsertData.$set = Object.assign(upsertData.$set, docAttrs);
    } else {
      where = {
        $or: [
          { expire: { $gt: new Date() } },
          { expire: { $eq: null } },
        ],
        key,
      };
      where = Object.assign(where, docAttrs);
      upsertData = {
        $setOnInsert: {
          key,
          expire: msDuration > 0 ? new Date(Date.now() + msDuration) : null,
        },
        $inc: { points },
      };
      upsertData.$setOnInsert = Object.assign(upsertData.$setOnInsert, docAttrs);
    }

    // Options for collection updates differ between driver versions
    const upsertOptions = {
      upsert: true,
    };
    if ((this._driverVersion.major >= 4) ||
        (this._driverVersion.major === 3 &&
          (this._driverVersion.feature >=7) ||
          (this._driverVersion.feature >= 6 &&
              this._driverVersion.patch >= 7 )))
    {
      upsertOptions.returnDocument = 'after';
    } else {
      upsertOptions.returnOriginal = false;
    }

    /*
     * 1. Find actual limit and increment points
     * 2. If limit expired, but Mongo doesn't clean doc by TTL yet, try to replace limit doc completely
     * 3. If 2 or more Mongo threads try to insert the new limit doc, only the first succeed
     * 4. Try to upsert from step 1. Actual limit is created now, points are incremented without problems
     */
    return new Promise((resolve, reject) => {
      this._collection.findOneAndUpdate(
        where,
        upsertData,
        upsertOptions
      ).then((res) => {
        resolve(res);
      }).catch((errUpsert) => {
        if (errUpsert && errUpsert.code === 11000) { // E11000 duplicate key error collection
          const replaceWhere = Object.assign({ // try to replace OLD limit doc
            $or: [
              { expire: { $lte: new Date() } },
              { expire: { $eq: null } },
            ],
            key,
          }, docAttrs);

          const replaceTo = {
            $set: Object.assign({
              key,
              points,
              expire: msDuration > 0 ? new Date(Date.now() + msDuration) : null,
            }, docAttrs)
          };

          this._collection.findOneAndUpdate(
            replaceWhere,
            replaceTo,
            upsertOptions
          ).then((res) => {
            resolve(res);
          }).catch((errReplace) => {
            if (errReplace && errReplace.code === 11000) { // E11000 duplicate key error collection
              this._upsert(key, points, msDuration, forceExpire)
                .then(res => resolve(res))
                .catch(err => reject(err));
            } else {
              reject(errReplace);
            }
          });
        } else {
          reject(errUpsert);
        }
      });
    });
  }

  _get(rlKey, options = {}) {
    if (!this._collection) {
      return Promise.reject(Error('Mongo connection is not established'));
    }

    const docAttrs = options.attrs || {};

    const where = Object.assign({
      key: rlKey,
      $or: [
        { expire: { $gt: new Date() } },
        { expire: { $eq: null } },
      ],
    }, docAttrs);

    return this._collection.findOne(where);
  }

  _delete(rlKey, options = {}) {
    if (!this._collection) {
      return Promise.reject(Error('Mongo connection is not established'));
    }

    const docAttrs = options.attrs || {};
    const where = Object.assign({ key: rlKey }, docAttrs);

    return this._collection.deleteOne(where)
      .then(res => res.deletedCount > 0);
  }
}

module.exports = RateLimiterMongo;


/***/ }),

/***/ 67793:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const RateLimiterStoreAbstract = __webpack_require__(65140);
const RateLimiterRes = __webpack_require__(80449);

class RateLimiterMySQL extends RateLimiterStoreAbstract {
  /**
   * @callback callback
   * @param {Object} err
   *
   * @param {Object} opts
   * @param {callback} cb
   * Defaults {
   *   ... see other in RateLimiterStoreAbstract
   *
   *   storeClient: anySqlClient,
   *   storeType: 'knex', // required only for Knex instance
   *   dbName: 'string',
   *   tableName: 'string',
   * }
   */
  constructor(opts, cb = null) {
    super(opts);

    this.client = opts.storeClient;
    this.clientType = opts.storeType;

    this.dbName = opts.dbName;
    this.tableName = opts.tableName;

    this.clearExpiredByTimeout = opts.clearExpiredByTimeout;

    this.tableCreated = opts.tableCreated;
    if (!this.tableCreated) {
      this._createDbAndTable()
        .then(() => {
          this.tableCreated = true;
          if (this.clearExpiredByTimeout) {
            this._clearExpiredHourAgo();
          }
          if (typeof cb === 'function') {
            cb();
          }
        })
        .catch((err) => {
          if (typeof cb === 'function') {
            cb(err);
          } else {
            throw err;
          }
        });
    } else {
      if (this.clearExpiredByTimeout) {
        this._clearExpiredHourAgo();
      }
      if (typeof cb === 'function') {
        cb();
      }
    }
  }

  clearExpired(expire) {
    return new Promise((resolve) => {
      this._getConnection()
        .then((conn) => {
          conn.query(`DELETE FROM ??.?? WHERE expire < ?`, [this.dbName, this.tableName, expire], () => {
            this._releaseConnection(conn);
            resolve();
          });
        })
        .catch(() => {
          resolve();
        });
    });
  }

  _clearExpiredHourAgo() {
    if (this._clearExpiredTimeoutId) {
      clearTimeout(this._clearExpiredTimeoutId);
    }
    this._clearExpiredTimeoutId = setTimeout(() => {
      this.clearExpired(Date.now() - 3600000) // Never rejected
        .then(() => {
          this._clearExpiredHourAgo();
        });
    }, 300000);
    this._clearExpiredTimeoutId.unref();
  }

  /**
   *
   * @return Promise<any>
   * @private
   */
  _getConnection() {
    switch (this.clientType) {
      case 'pool':
        return new Promise((resolve, reject) => {
          this.client.getConnection((errConn, conn) => {
            if (errConn) {
              return reject(errConn);
            }

            resolve(conn);
          });
        });
      case 'sequelize':
        return this.client.connectionManager.getConnection();
      case 'knex':
        return this.client.client.acquireConnection();
      default:
        return Promise.resolve(this.client);
    }
  }

  _releaseConnection(conn) {
    switch (this.clientType) {
      case 'pool':
        return conn.release();
      case 'sequelize':
        return this.client.connectionManager.releaseConnection(conn);
      case 'knex':
        return this.client.client.releaseConnection(conn);
      default:
        return true;
    }
  }

  /**
   *
   * @returns {Promise<any>}
   * @private
   */
  _createDbAndTable() {
    return new Promise((resolve, reject) => {
      this._getConnection()
        .then((conn) => {
          conn.query(`CREATE DATABASE IF NOT EXISTS \`${this.dbName}\`;`, (errDb) => {
            if (errDb) {
              this._releaseConnection(conn);
              return reject(errDb);
            }
            conn.query(this._getCreateTableStmt(), (err) => {
              if (err) {
                this._releaseConnection(conn);
                return reject(err);
              }
              this._releaseConnection(conn);
              resolve();
            });
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  _getCreateTableStmt() {
    return `CREATE TABLE IF NOT EXISTS \`${this.dbName}\`.\`${this.tableName}\` (` +
      '`key` VARCHAR(255) CHARACTER SET utf8 NOT NULL,' +
      '`points` INT(9) NOT NULL default 0,' +
      '`expire` BIGINT UNSIGNED,' +
      'PRIMARY KEY (`key`)' +
      ') ENGINE = INNODB;';
  }

  get clientType() {
    return this._clientType;
  }

  set clientType(value) {
    if (typeof value === 'undefined') {
      if (this.client.constructor.name === 'Connection') {
        value = 'connection';
      } else if (this.client.constructor.name === 'Pool') {
        value = 'pool';
      } else if (this.client.constructor.name === 'Sequelize') {
        value = 'sequelize';
      } else {
        throw new Error('storeType is not defined');
      }
    }
    this._clientType = value.toLowerCase();
  }

  get dbName() {
    return this._dbName;
  }

  set dbName(value) {
    this._dbName = typeof value === 'undefined' ? 'rtlmtrflx' : value;
  }

  get tableName() {
    return this._tableName;
  }

  set tableName(value) {
    this._tableName = typeof value === 'undefined' ? this.keyPrefix : value;
  }

  get tableCreated() {
    return this._tableCreated
  }

  set tableCreated(value) {
    this._tableCreated = typeof value === 'undefined' ? false : !!value;
  }

  get clearExpiredByTimeout() {
    return this._clearExpiredByTimeout;
  }

  set clearExpiredByTimeout(value) {
    this._clearExpiredByTimeout = typeof value === 'undefined' ? true : Boolean(value);
  }

  _getRateLimiterRes(rlKey, changedPoints, result) {
    const res = new RateLimiterRes();
    const [row] = result;

    res.isFirstInDuration = changedPoints === row.points;
    res.consumedPoints = res.isFirstInDuration ? changedPoints : row.points;

    res.remainingPoints = Math.max(this.points - res.consumedPoints, 0);
    res.msBeforeNext = row.expire
      ? Math.max(row.expire - Date.now(), 0)
      : -1;

    return res;
  }

  _upsertTransaction(conn, key, points, msDuration, forceExpire) {
    return new Promise((resolve, reject) => {
      conn.query('BEGIN', (errBegin) => {
        if (errBegin) {
          conn.rollback();

          return reject(errBegin);
        }

        const dateNow = Date.now();
        const newExpire = msDuration > 0 ? dateNow + msDuration : null;

        let q;
        let values;
        if (forceExpire) {
          q = `INSERT INTO ??.?? VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE 
            points = ?, 
            expire = ?;`;
          values = [
            this.dbName, this.tableName, key, points, newExpire,
            points,
            newExpire,
          ];
        } else {
          q = `INSERT INTO ??.?? VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE 
            points = IF(expire <= ?, ?, points + (?)), 
            expire = IF(expire <= ?, ?, expire);`;
          values = [
            this.dbName, this.tableName, key, points, newExpire,
            dateNow, points, points,
            dateNow, newExpire,
          ];
        }

        conn.query(q, values, (errUpsert) => {
          if (errUpsert) {
            conn.rollback();

            return reject(errUpsert);
          }
          conn.query('SELECT points, expire FROM ??.?? WHERE `key` = ?;', [this.dbName, this.tableName, key], (errSelect, res) => {
            if (errSelect) {
              conn.rollback();

              return reject(errSelect);
            }

            conn.query('COMMIT', (err) => {
              if (err) {
                conn.rollback();

                return reject(err);
              }

              resolve(res);
            });
          });
        });
      });
    });
  }

  _upsert(key, points, msDuration, forceExpire = false) {
    if (!this.tableCreated) {
      return Promise.reject(Error('Table is not created yet'));
    }

    return new Promise((resolve, reject) => {
      this._getConnection()
        .then((conn) => {
          this._upsertTransaction(conn, key, points, msDuration, forceExpire)
            .then((res) => {
              resolve(res);
              this._releaseConnection(conn);
            })
            .catch((err) => {
              reject(err);
              this._releaseConnection(conn);
            });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  _get(rlKey) {
    if (!this.tableCreated) {
      return Promise.reject(Error('Table is not created yet'));
    }

    return new Promise((resolve, reject) => {
      this._getConnection()
        .then((conn) => {
          conn.query(
            'SELECT points, expire FROM ??.?? WHERE `key` = ? AND (`expire` > ? OR `expire` IS NULL)',
            [this.dbName, this.tableName, rlKey, Date.now()],
            (err, res) => {
              if (err) {
                reject(err);
              } else if (res.length === 0) {
                resolve(null);
              } else {
                resolve(res);
              }

              this._releaseConnection(conn);
            } // eslint-disable-line
          );
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  _delete(rlKey) {
    if (!this.tableCreated) {
      return Promise.reject(Error('Table is not created yet'));
    }

    return new Promise((resolve, reject) => {
      this._getConnection()
        .then((conn) => {
          conn.query(
            'DELETE FROM ??.?? WHERE `key` = ?',
            [this.dbName, this.tableName, rlKey],
            (err, res) => {
              if (err) {
                reject(err);
              } else {
                resolve(res.affectedRows > 0);
              }

              this._releaseConnection(conn);
            } // eslint-disable-line
          );
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = RateLimiterMySQL;


/***/ }),

/***/ 3740:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const RateLimiterStoreAbstract = __webpack_require__(65140);
const RateLimiterRes = __webpack_require__(80449);

class RateLimiterPostgres extends RateLimiterStoreAbstract {
  /**
   * @callback callback
   * @param {Object} err
   *
   * @param {Object} opts
   * @param {callback} cb
   * Defaults {
   *   ... see other in RateLimiterStoreAbstract
   *
   *   storeClient: postgresClient,
   *   storeType: 'knex', // required only for Knex instance
   *   tableName: 'string',
   *   schemaName: 'string', // optional
   * }
   */
  constructor(opts, cb = null) {
    super(opts);

    this.client = opts.storeClient;
    this.clientType = opts.storeType;

    this.tableName = opts.tableName;
    this.schemaName = opts.schemaName;

    this.clearExpiredByTimeout = opts.clearExpiredByTimeout;

    this.tableCreated = opts.tableCreated;
    if (!this.tableCreated) {
      this._createTable()
        .then(() => {
          this.tableCreated = true;
          if (this.clearExpiredByTimeout) {
            this._clearExpiredHourAgo();
          }
          if (typeof cb === 'function') {
            cb();
          }
        })
        .catch((err) => {
          if (typeof cb === 'function') {
            cb(err);
          } else {
            throw err;
          }
        });
    } else {
      if (this.clearExpiredByTimeout) {
        this._clearExpiredHourAgo();
      }
      if (typeof cb === 'function') {
        cb();
      }
    }
  }

  _getTableIdentifier() {
    return this.schemaName ? `"${this.schemaName}"."${this.tableName}"` : `"${this.tableName}"`;
  }

  clearExpired(expire) {
    return new Promise((resolve) => {
      const q = {
        name: 'rlflx-clear-expired',
        text: `DELETE FROM ${this._getTableIdentifier()} WHERE expire < $1`,
        values: [expire],
      };
      this._query(q)
        .then(() => {
          resolve();
        })
        .catch(() => {
          // Deleting expired query is not critical
          resolve();
        });
    });
  }

  /**
   * Delete all rows expired 1 hour ago once per 5 minutes
   *
   * @private
   */
  _clearExpiredHourAgo() {
    if (this._clearExpiredTimeoutId) {
      clearTimeout(this._clearExpiredTimeoutId);
    }
    this._clearExpiredTimeoutId = setTimeout(() => {
      this.clearExpired(Date.now() - 3600000) // Never rejected
        .then(() => {
          this._clearExpiredHourAgo();
        });
    }, 300000);
    this._clearExpiredTimeoutId.unref();
  }

  /**
   *
   * @return Promise<any>
   * @private
   */
  _getConnection() {
    switch (this.clientType) {
      case 'pool':
        return Promise.resolve(this.client);
      case 'sequelize':
        return this.client.connectionManager.getConnection();
      case 'knex':
        return this.client.client.acquireConnection();
      case 'typeorm':
        return Promise.resolve(this.client.driver.master);
      default:
        return Promise.resolve(this.client);
    }
  }

  _releaseConnection(conn) {
    switch (this.clientType) {
      case 'pool':
        return true;
      case 'sequelize':
        return this.client.connectionManager.releaseConnection(conn);
      case 'knex':
        return this.client.client.releaseConnection(conn);
      case 'typeorm':
        return true;
      default:
        return true;
    }
  }

  /**
   *
   * @returns {Promise<any>}
   * @private
   */
  _createTable() {
    return new Promise((resolve, reject) => {
      this._query({
        text: this._getCreateTableStmt(),
      })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          if (err.code === '23505') {
            // Error: duplicate key value violates unique constraint "pg_type_typname_nsp_index"
            // Postgres doesn't handle concurrent table creation
            // It is supposed, that table is created by another worker
            resolve();
          } else {
            reject(err);
          }
        });
    });
  }

  _getCreateTableStmt() {
    return `CREATE TABLE IF NOT EXISTS ${this._getTableIdentifier()} (
      key varchar(255) PRIMARY KEY,
      points integer NOT NULL DEFAULT 0,
      expire bigint
    );`;
  }

  get clientType() {
    return this._clientType;
  }

  set clientType(value) {
    const constructorName = this.client.constructor.name;

    if (typeof value === 'undefined') {
      if (constructorName === 'Client') {
        value = 'client';
      } else if (
        constructorName === 'Pool' ||
        constructorName === 'BoundPool'
      ) {
        value = 'pool';
      } else if (constructorName === 'Sequelize') {
        value = 'sequelize';
      } else {
        throw new Error('storeType is not defined');
      }
    }

    this._clientType = value.toLowerCase();
  }

  get tableName() {
    return this._tableName;
  }

  set tableName(value) {
    this._tableName = typeof value === 'undefined' ? this.keyPrefix : value;
  }

  get schemaName() {
    return this._schemaName;
  }

  set schemaName(value) {
    this._schemaName = value;
  }

  get tableCreated() {
    return this._tableCreated;
  }

  set tableCreated(value) {
    this._tableCreated = typeof value === 'undefined' ? false : !!value;
  }

  get clearExpiredByTimeout() {
    return this._clearExpiredByTimeout;
  }

  set clearExpiredByTimeout(value) {
    this._clearExpiredByTimeout = typeof value === 'undefined' ? true : Boolean(value);
  }

  _getRateLimiterRes(rlKey, changedPoints, result) {
    const res = new RateLimiterRes();
    const row = result.rows[0];

    res.isFirstInDuration = changedPoints === row.points;
    res.consumedPoints = res.isFirstInDuration ? changedPoints : row.points;

    res.remainingPoints = Math.max(this.points - res.consumedPoints, 0);
    res.msBeforeNext = row.expire
      ? Math.max(row.expire - Date.now(), 0)
      : -1;

    return res;
  }

  _query(q) {
    const prefix = this.tableName.toLowerCase();
    const queryObj = { name: `${prefix}:${q.name}`, text: q.text, values: q.values };
    return new Promise((resolve, reject) => {
      this._getConnection()
        .then((conn) => {
          conn.query(queryObj)
            .then((res) => {
              resolve(res);
              this._releaseConnection(conn);
            })
            .catch((err) => {
              reject(err);
              this._releaseConnection(conn);
            });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  _upsert(key, points, msDuration, forceExpire = false) {
    if (!this.tableCreated) {
      return Promise.reject(Error('Table is not created yet'));
    }

    const newExpire = msDuration > 0 ? Date.now() + msDuration : null;
    const expireQ = forceExpire
      ? ' $3 '
      : ` CASE
             WHEN ${this._getTableIdentifier()}.expire <= $4 THEN $3
             ELSE ${this._getTableIdentifier()}.expire
            END `;

    return this._query({
      name: forceExpire ? 'rlflx-upsert-force' : 'rlflx-upsert',
      text: `
            INSERT INTO ${this._getTableIdentifier()} VALUES ($1, $2, $3)
              ON CONFLICT(key) DO UPDATE SET
                points = CASE
                          WHEN (${this._getTableIdentifier()}.expire <= $4 OR 1=${forceExpire ? 1 : 0}) THEN $2
                          ELSE ${this._getTableIdentifier()}.points + ($2)
                         END,
                expire = ${expireQ}
            RETURNING points, expire;`,
      values: [key, points, newExpire, Date.now()],
    });
  }

  _get(rlKey) {
    if (!this.tableCreated) {
      return Promise.reject(Error('Table is not created yet'));
    }

    return new Promise((resolve, reject) => {
      this._query({
        name: 'rlflx-get',
        text: `
            SELECT points, expire FROM ${this._getTableIdentifier()} WHERE key = $1 AND (expire > $2 OR expire IS NULL);`,
        values: [rlKey, Date.now()],
      })
        .then((res) => {
          if (res.rowCount === 0) {
            res = null;
          }
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  _delete(rlKey) {
    if (!this.tableCreated) {
      return Promise.reject(Error('Table is not created yet'));
    }

    return this._query({
      name: 'rlflx-delete',
      text: `DELETE FROM ${this._getTableIdentifier()} WHERE key = $1`,
      values: [rlKey],
    })
      .then(res => res.rowCount > 0);
  }
}

module.exports = RateLimiterPostgres;


/***/ }),

/***/ 16323:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const RateLimiterStoreAbstract = __webpack_require__(65140);
const RateLimiterRes = __webpack_require__(80449);

class RateLimiterPrisma extends RateLimiterStoreAbstract {
  /**
   * Constructor for the rate limiter
   * @param {Object} opts - Options for the rate limiter
   */
  constructor(opts) {
    super(opts);

    this.modelName = opts.tableName || 'RateLimiterFlexible';
    this.prismaClient = opts.storeClient;
    this.clearExpiredByTimeout = opts.clearExpiredByTimeout || true;

    if (!this.prismaClient) {
      throw new Error('Prisma client is not provided');
    }

    if (this.clearExpiredByTimeout) {
      this._clearExpiredHourAgo();
    }
  }

  _getRateLimiterRes(rlKey, changedPoints, result) {
    const res = new RateLimiterRes();

    let doc = result;

    res.isFirstInDuration = doc.points === changedPoints;
    res.consumedPoints = doc.points;

    res.remainingPoints = Math.max(this.points - res.consumedPoints, 0);
    res.msBeforeNext = doc.expire !== null
      ? Math.max(new Date(doc.expire).getTime() - Date.now(), 0)
      : -1;

    return res;
  }

  _upsert(key, points, msDuration, forceExpire = false) {
    if (!this.prismaClient) {
      return Promise.reject(new Error('Prisma client is not established'));
    }

    const now = new Date();
    const newExpire = msDuration > 0 ? new Date(now.getTime() + msDuration) : null;

    return this.prismaClient.$transaction(async (prisma) => {
      const existingRecord = await prisma[this.modelName].findFirst({
        where: { key: key },
      });

      if (existingRecord) {
        // Determine if we should update the expire field
        const shouldUpdateExpire = forceExpire || !existingRecord.expire || existingRecord.expire <= now || newExpire === null;

        return prisma[this.modelName].update({
          where: { key: key },
          data: {
            points: !shouldUpdateExpire ? existingRecord.points + points : points,
            ...(shouldUpdateExpire && { expire: newExpire }),
          },
        });
      } else {
        return prisma[this.modelName].create({
          data: {
            key: key,
            points: points,
            expire: newExpire,
          },
        });
      }
    });
  }

  _get(rlKey) {
    if (!this.prismaClient) {
      return Promise.reject(new Error('Prisma client is not established'));
    }

    return this.prismaClient[this.modelName].findFirst({
      where: {
        AND: [
          { key: rlKey },
          {
            OR: [
              { expire: { gt: new Date() } },
              { expire: null },
            ],
          },
        ],
      },
    });
  }

  _delete(rlKey) {
    if (!this.prismaClient) {
      return Promise.reject(new Error('Prisma client is not established'));
    }

    return this.prismaClient[this.modelName].deleteMany({
      where: {
        key: rlKey,
      },
    }).then(res => res.count > 0);
  }

  _clearExpiredHourAgo() {
    if (this._clearExpiredTimeoutId) {
      clearTimeout(this._clearExpiredTimeoutId);
    }
    this._clearExpiredTimeoutId = setTimeout(async () => {
      await this.prismaClient[this.modelName].deleteMany({
        where: {
          expire: {
            lt: new Date(Date.now() - 3600000),
          },
        },
      });
      this._clearExpiredHourAgo();
    }, 300000); // Clear every 5 minutes
    this._clearExpiredTimeoutId.unref();
  }
}

module.exports = RateLimiterPrisma;


/***/ }),

/***/ 52860:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const RateLimiterQueueError = __webpack_require__(27948)
const MAX_QUEUE_SIZE = 4294967295;
const KEY_DEFAULT = 'limiter';

module.exports = class RateLimiterQueue {
  constructor(limiterFlexible, opts = {
    maxQueueSize: MAX_QUEUE_SIZE,
  }) {
    this._queueLimiters = {
      KEY_DEFAULT: new RateLimiterQueueInternal(limiterFlexible, opts)
    };
    this._limiterFlexible = limiterFlexible;
    this._maxQueueSize = opts.maxQueueSize
  }

  getTokensRemaining(key = KEY_DEFAULT) {
    if (this._queueLimiters[key]) {
      return this._queueLimiters[key].getTokensRemaining()
    } else {
      return Promise.resolve(this._limiterFlexible.points)
    }
  }

  removeTokens(tokens, key = KEY_DEFAULT) {
    if (!this._queueLimiters[key]) {
      this._queueLimiters[key] = new RateLimiterQueueInternal(
        this._limiterFlexible, {
          key,
          maxQueueSize: this._maxQueueSize,
        })
    }

    return this._queueLimiters[key].removeTokens(tokens)
  }
};

class RateLimiterQueueInternal {

  constructor(limiterFlexible, opts = {
    maxQueueSize: MAX_QUEUE_SIZE,
    key: KEY_DEFAULT,
  }) {
    this._key = opts.key;
    this._waitTimeout = null;
    this._queue = [];
    this._limiterFlexible = limiterFlexible;

    this._maxQueueSize = opts.maxQueueSize
  }

  getTokensRemaining() {
    return this._limiterFlexible.get(this._key)
      .then((rlRes) => {
        return rlRes !== null ? rlRes.remainingPoints : this._limiterFlexible.points;
      })
  }

  removeTokens(tokens) {
    const _this = this;

    return new Promise((resolve, reject) => {
      if (tokens > _this._limiterFlexible.points) {
        reject(new RateLimiterQueueError(`Requested tokens ${tokens} exceeds maximum ${_this._limiterFlexible.points} tokens per interval`));
        return
      }

      if (_this._queue.length > 0) {
        _this._queueRequest.call(_this, resolve, reject, tokens);
      } else {
        _this._limiterFlexible.consume(_this._key, tokens)
          .then((res) => {
            resolve(res.remainingPoints);
          })
          .catch((rej) => {
            if (rej instanceof Error) {
              reject(rej);
            } else {
              _this._queueRequest.call(_this, resolve, reject, tokens);
              if (_this._waitTimeout === null) {
                _this._waitTimeout = setTimeout(_this._processFIFO.bind(_this), rej.msBeforeNext);
              }
            }
          });
      }
    })
  }

  _queueRequest(resolve, reject, tokens) {
    const _this = this;
    if (_this._queue.length < _this._maxQueueSize) {
      _this._queue.push({resolve, reject, tokens});
    } else {
      reject(new RateLimiterQueueError(`Number of requests reached it's maximum ${_this._maxQueueSize}`))
    }
  }

  _processFIFO() {
    const _this = this;

    if (_this._waitTimeout !== null) {
      clearTimeout(_this._waitTimeout);
      _this._waitTimeout = null;
    }

    if (_this._queue.length === 0) {
      return;
    }

    const item = _this._queue.shift();
    _this._limiterFlexible.consume(_this._key, item.tokens)
      .then((res) => {
        item.resolve(res.remainingPoints);
        _this._processFIFO.call(_this);
      })
      .catch((rej) => {
        if (rej instanceof Error) {
          item.reject(rej);
          _this._processFIFO.call(_this);
        } else {
          _this._queue.unshift(item);
          if (_this._waitTimeout === null) {
            _this._waitTimeout = setTimeout(_this._processFIFO.bind(_this), rej.msBeforeNext);
          }
        }
      });
  }
}


/***/ }),

/***/ 54336:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const RateLimiterStoreAbstract = __webpack_require__(65140);
const RateLimiterRes = __webpack_require__(80449);

const incrTtlLuaScript = `redis.call('set', KEYS[1], 0, 'EX', ARGV[2], 'NX') \
local consumed = redis.call('incrby', KEYS[1], ARGV[1]) \
local ttl = redis.call('pttl', KEYS[1]) \
if ttl == -1 then \
  redis.call('expire', KEYS[1], ARGV[2]) \
  ttl = 1000 * ARGV[2] \
end \
return {consumed, ttl} \
`;

class RateLimiterRedis extends RateLimiterStoreAbstract {
  /**
   *
   * @param {Object} opts
   * Defaults {
   *   ... see other in RateLimiterStoreAbstract
   *
   *   redis: RedisClient
   *   rejectIfRedisNotReady: boolean = false - reject / invoke insuranceLimiter immediately when redis connection is not "ready"
   * }
   */
  constructor(opts) {
    super(opts);
    this.client = opts.storeClient;

    this._rejectIfRedisNotReady = !!opts.rejectIfRedisNotReady;
    this._incrTtlLuaScript = opts.customIncrTtlLuaScript || incrTtlLuaScript;

    this.useRedisPackage = opts.useRedisPackage || this.client.constructor.name === 'Commander' || false;
    this.useRedis3AndLowerPackage = opts.useRedis3AndLowerPackage;
    if (typeof this.client.defineCommand === 'function') {
      this.client.defineCommand("rlflxIncr", {
        numberOfKeys: 1,
        lua: this._incrTtlLuaScript,
      });
    }
  }

  /**
   * Prevent actual redis call if redis connection is not ready
   * Because of different connection state checks for ioredis and node-redis, only this clients would be actually checked.
   * For any other clients all the requests would be passed directly to redis client
   * @param {String} rlKey
   * @param {Boolean} isReadonly
   * @return {boolean}
   * @private
   */
  _isRedisReady(rlKey, isReadonly) {
    if (!this._rejectIfRedisNotReady) {
      return true;
    }
    // ioredis client
    if (this.client.status) {
      return this.client.status === 'ready';
    }
    // node-redis v3 client
    if (typeof this.client.isReady === 'function') {
      return this.client.isReady();
    }

    // node-redis v4+ (non-cluster) client
    if (typeof this.client.isReady === 'boolean') {
      return this.client.isReady === true;
    }

    // node-redis v4+ cluster client
    if (this.client._slots && typeof this.client._slots.getClient === 'function') {
      if (typeof this.client.isOpen === 'boolean' && this.client.isOpen !== true) {
        return false;
      }

      try {
        const slotClient = this.client._slots.getClient(rlKey, isReadonly);
        return slotClient && slotClient.isReady === true;
      } catch (error) {
        return false;
      }
    }
    return true;
  }

  _getRateLimiterRes(rlKey, changedPoints, result) {
    let [consumed, resTtlMs] = result;
    // Support ioredis results format
    if (Array.isArray(consumed)) {
      [, consumed] = consumed;
      [, resTtlMs] = resTtlMs;
    }

    const res = new RateLimiterRes();
    res.consumedPoints = parseInt(consumed);
    res.isFirstInDuration = res.consumedPoints === changedPoints;
    res.remainingPoints = Math.max(this.points - res.consumedPoints, 0);
    res.msBeforeNext = resTtlMs;

    return res;
  }

  async _upsert(rlKey, points, msDuration, forceExpire = false) {
    if(
      typeof points == 'string'
    ){
      if(!RegExp("^[1-9][0-9]*$").test(points)){
        throw new Error("Consuming string different than integer values is not supported by this package");
      }
    } else if (!Number.isInteger(points)){
      throw new Error("Consuming decimal number of points is not supported by this package");
    }

    if (!this._isRedisReady(rlKey, false)) {
      throw new Error('Redis connection is not ready');
    }

    const secDuration = Math.floor(msDuration / 1000);
    const multi = this.client.multi();

    if (forceExpire) {
      if (secDuration > 0) {
        if(!this.useRedisPackage && !this.useRedis3AndLowerPackage){
          multi.set(rlKey, points, "EX", secDuration);
        }else{
          multi.set(rlKey, points, { EX: secDuration });
        }
      } else {
        multi.set(rlKey, points);
      }

      if(!this.useRedisPackage && !this.useRedis3AndLowerPackage){
        return multi.pttl(rlKey).exec(true);
      }
      return multi.pTTL(rlKey).exec(true);
    }

    if (secDuration > 0) {
      if(!this.useRedisPackage && !this.useRedis3AndLowerPackage){
        return this.client.rlflxIncr(
          [rlKey].concat([String(points), String(secDuration), String(this.points), String(this.duration)]));
      }
      if (this.useRedis3AndLowerPackage) {
        return new Promise((resolve, reject) => {
          const incrCallback = function (err, result) {
            if (err) {
              return reject(err);
            }

            return resolve(result);
          };

          if (typeof this.client.rlflxIncr === 'function') {
            this.client.rlflxIncr(rlKey, points, secDuration, this.points, this.duration, incrCallback);
          } else {
            this.client.eval(this._incrTtlLuaScript, 1, rlKey, points, secDuration, this.points, this.duration, incrCallback);
          }
        });
      } else {
        return this.client.eval(this._incrTtlLuaScript, {
          keys: [rlKey],
          arguments: [String(points), String(secDuration), String(this.points), String(this.duration)],
        });
      }
    } else {
      if(!this.useRedisPackage && !this.useRedis3AndLowerPackage){
        return multi.incrby(rlKey, points).pttl(rlKey).exec(true);
      }

      return multi.incrBy(rlKey, points).pTTL(rlKey).exec(true);
    }
  }

  async _get(rlKey) {
    if (!this._isRedisReady(rlKey, true)) {
      throw new Error('Redis connection is not ready');
    }
    if(!this.useRedisPackage && !this.useRedis3AndLowerPackage){
      return this.client
        .multi()
        .get(rlKey)
        .pttl(rlKey)
        .exec()
        .then((result) => {
          const [[,points]] = result;
          if (points === null) return null;
          return result;
        });
    }

    return this.client
      .multi()
      .get(rlKey)
      .pTTL(rlKey)
      .exec(true)
      .then((result) => {
        const [points] = result;
        if (points === null) return null;
        return result;
      });
  }

  _delete(rlKey) {
    return this.client
      .del(rlKey)
      .then(result => result > 0);
  }
}

module.exports = RateLimiterRedis;


/***/ }),

/***/ 80449:
/***/ ((module) => {

module.exports = class RateLimiterRes {
  constructor(remainingPoints, msBeforeNext, consumedPoints, isFirstInDuration) {
    this.remainingPoints = typeof remainingPoints === 'undefined' ? 0 : remainingPoints; // Remaining points in current duration
    this.msBeforeNext = typeof msBeforeNext === 'undefined' ? 0 : msBeforeNext; // Milliseconds before next action
    this.consumedPoints = typeof consumedPoints === 'undefined' ? 0 : consumedPoints; // Consumed points in current duration
    this.isFirstInDuration = typeof isFirstInDuration === 'undefined' ? false : isFirstInDuration;
  }

  get msBeforeNext() {
    return this._msBeforeNext;
  }

  set msBeforeNext(ms) {
    this._msBeforeNext = ms;
    return this;
  }

  get remainingPoints() {
    return this._remainingPoints;
  }

  set remainingPoints(p) {
    this._remainingPoints = p;
    return this;
  }

  get consumedPoints() {
    return this._consumedPoints;
  }

  set consumedPoints(p) {
    this._consumedPoints = p;
    return this;
  }

  get isFirstInDuration() {
    return this._isFirstInDuration;
  }

  set isFirstInDuration(value) {
    this._isFirstInDuration = Boolean(value);
  }

  _getDecoratedProperties() {
    return {
      remainingPoints: this.remainingPoints,
      msBeforeNext: this.msBeforeNext,
      consumedPoints: this.consumedPoints,
      isFirstInDuration: this.isFirstInDuration,
    };
  }

  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this._getDecoratedProperties();
  }

  toString() {
    return JSON.stringify(this._getDecoratedProperties());
  }

  toJSON() {
    return this._getDecoratedProperties();
  }
};


/***/ }),

/***/ 73283:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const RateLimiterStoreAbstract = __webpack_require__(65140);
const RateLimiterRes = __webpack_require__(80449);

class RateLimiterSQLite extends RateLimiterStoreAbstract {
  /**
   * Internal store type used to determine the SQLite client in use.
   * It can be one of the following:
   * - `"sqlite3".
   * - `"better-sqlite3".
   *
   * @type {("sqlite3" | "better-sqlite3" | null)}
   * @private
   */
  _internalStoreType = null;

  /**
   * @callback callback
   * @param {Object} err
   *
   * @param {Object} opts
   * @param {callback} cb
   * Defaults {
   *   ... see other in RateLimiterStoreAbstract
   *   storeClient: sqliteClient, // SQLite database instance (sqlite3, better-sqlite3, or knex instance)
   *   storeType: 'sqlite3' | 'better-sqlite3' | 'knex', // Optional, defaults to 'sqlite3'
   *   tableName: 'string',
   *   tableCreated: boolean,
   *   clearExpiredByTimeout: boolean,
   * }
   */
  constructor(opts, cb = null) {
    super(opts);

    this.client = opts.storeClient;
    this.storeType = opts.storeType || "sqlite3";
    this.tableName = opts.tableName;
    this.tableCreated = opts.tableCreated || false;
    this.clearExpiredByTimeout = opts.clearExpiredByTimeout;

    this._validateStoreTypes(cb);
    this._validateStoreClient(cb);
    this._setInternalStoreType(cb);
    this._validateTableName(cb);

    if (!this.tableCreated) {
      this._createDbAndTable()
        .then(() => {
          this.tableCreated = true;
          if (this.clearExpiredByTimeout) this._clearExpiredHourAgo();
          if (typeof cb === "function") cb();
        })
        .catch((err) => {
          if (typeof cb === "function") cb(err);
          else throw err;
        });
    } else {
      if (this.clearExpiredByTimeout) this._clearExpiredHourAgo();
      if (typeof cb === "function") cb();
    }
  }
  _validateStoreTypes(cb) {
    const validStoreTypes = ["sqlite3", "better-sqlite3", "knex"];
    if (!validStoreTypes.includes(this.storeType)) {
      const err = new Error(
        `storeType must be one of: ${validStoreTypes.join(", ")}`
      );
      if (typeof cb === "function") return cb(err);
      throw err;
    }
  }
  _validateStoreClient(cb) {
    if (this.storeType === "sqlite3") {
      if (typeof this.client.run !== "function") {
        const err = new Error(
          "storeClient must be an instance of sqlite3.Database when storeType is 'sqlite3' or no storeType was provided"
        );
        if (typeof cb === "function") return cb(err);
        throw err;
      }
    } else if (this.storeType === "better-sqlite3") {
      if (
        typeof this.client.prepare !== "function" ||
        typeof this.client.run !== "undefined"
      ) {
        const err = new Error(
          "storeClient must be an instance of better-sqlite3.Database when storeType is 'better-sqlite3'"
        );
        if (typeof cb === "function") return cb(err);
        throw err;
      }
    } else if (this.storeType === "knex") {
      if (typeof this.client.raw !== "function") {
        const err = new Error(
          "storeClient must be an instance of Knex when storeType is 'knex'"
        );
        if (typeof cb === "function") return cb(err);
        throw err;
      }
    }
  }
  _setInternalStoreType(cb) {
    if (this.storeType === "knex") {
      const knexClientType = this.client.client.config.client;
      if (knexClientType === "sqlite3") {
        this._internalStoreType = "sqlite3";
      } else if (knexClientType === "better-sqlite3") {
        this._internalStoreType = "better-sqlite3";
      } else {
        const err = new Error(
          "Knex must be configured with 'sqlite3' or 'better-sqlite3' for RateLimiterSQLite"
        );
        if (typeof cb === "function") return cb(err);
        throw err;
      }
    } else {
      this._internalStoreType = this.storeType;
    }
  }
  _validateTableName(cb) {
    if (!/^[A-Za-z0-9_]*$/.test(this.tableName)) {
      const err = new Error("Table name must contain only letters and numbers");
      if (typeof cb === "function") return cb(err);
      throw err;
    }
  }

  /**
   * Acquires the database connection based on the storeType.
   * @returns {Promise<Object>} The database client or connection
   */
  async _getConnection() {
    if (this.storeType === "knex") {
      return this.client.client.acquireConnection(); // Acquire raw connection from knex pool
    }
    return this.client; // For sqlite3 and better-sqlite3, return the client directly
  }

  /**
   * Releases the database connection if necessary.
   * @param {Object} conn The database client or connection
   */
  _releaseConnection(conn) {
    if (this.storeType === "knex") {
      this.client.client.releaseConnection(conn);
    }
    // No release needed for direct sqlite3 or better-sqlite3 clients
  }

  async _createDbAndTable() {
    const conn = await this._getConnection();
    try {
      switch (this._internalStoreType) {
        case "sqlite3":
          await new Promise((resolve, reject) => {
            conn.run(this._getCreateTableSQL(), (err) =>
              err ? reject(err) : resolve()
            );
          });
          break;
        case "better-sqlite3":
          conn.prepare(this._getCreateTableSQL()).run();
          break;
        default:
          throw new Error("Unsupported internalStoreType");
      }
    } finally {
      this._releaseConnection(conn);
    }
  }

  _getCreateTableSQL() {
    return `CREATE TABLE IF NOT EXISTS ${this.tableName} (
      key TEXT PRIMARY KEY,
      points INTEGER NOT NULL DEFAULT 0,
      expire INTEGER
    )`;
  }

  _clearExpiredHourAgo() {
    if (this._clearExpiredTimeoutId) clearTimeout(this._clearExpiredTimeoutId);
    this._clearExpiredTimeoutId = setTimeout(() => {
      this.clearExpired(Date.now() - 3600000) // 1 hour ago
        .then(() => this._clearExpiredHourAgo());
    }, 300000); // Every 5 minutes
    this._clearExpiredTimeoutId.unref();
  }

  async clearExpired(nowMs) {
    const sql = `DELETE FROM ${this.tableName} WHERE expire < ?`;
    const conn = await this._getConnection();
    try {
      switch (this._internalStoreType) {
        case "sqlite3":
          await new Promise((resolve, reject) => {
            conn.run(sql, [nowMs], (err) => (err ? reject(err) : resolve()));
          });
          break;
        case "better-sqlite3":
          conn.prepare(sql).run(nowMs);
          break;
        default:
          throw new Error("Unsupported internalStoreType");
      }
    } finally {
      this._releaseConnection(conn);
    }
  }

  _getRateLimiterRes(rlKey, changedPoints, result) {
    const res = new RateLimiterRes();
    res.isFirstInDuration = changedPoints === result.points;
    res.consumedPoints = res.isFirstInDuration ? changedPoints : result.points;
    res.remainingPoints = Math.max(this.points - res.consumedPoints, 0);
    res.msBeforeNext = result.expire
      ? Math.max(result.expire - Date.now(), 0)
      : -1;
    return res;
  }

  async _upsertTransactionSQLite3(conn, upsertQuery, upsertParams) {
    return await new Promise((resolve, reject) => {
      conn.serialize(() => {
        conn.run("SAVEPOINT rate_limiter_trx;", (err) => {
          if (err) return reject(err);
          conn.get(upsertQuery, upsertParams, (err, row) => {
            if (err) {
              conn.run("ROLLBACK TO SAVEPOINT rate_limiter_trx;", () =>
                reject(err)
              );
              return;
            }
            conn.run("RELEASE SAVEPOINT rate_limiter_trx;", () => resolve(row));
          });
        });
      });
    });
  }

  async _upsertTransactionBetterSQLite3(conn, upsertQuery, upsertParams) {
    return conn.transaction(() =>
      conn.prepare(upsertQuery).get(...upsertParams)
    )();
  }
  async _upsertTransaction(rlKey, points, msDuration, forceExpire) {
    const dateNow = Date.now();
    const newExpire = msDuration > 0 ? dateNow + msDuration : null;
    const upsertQuery = forceExpire
      ? `INSERT OR REPLACE INTO ${this.tableName} (key, points, expire) VALUES (?, ?, ?) RETURNING points, expire`
      : `INSERT INTO ${this.tableName} (key, points, expire)
         VALUES (?, ?, ?)
         ON CONFLICT(key) DO UPDATE SET
           points = CASE WHEN expire IS NULL OR expire > ? THEN points + excluded.points ELSE excluded.points END,
           expire = CASE WHEN expire IS NULL OR expire > ? THEN expire ELSE excluded.expire END
         RETURNING points, expire`;
    const upsertParams = forceExpire
      ? [rlKey, points, newExpire]
      : [rlKey, points, newExpire, dateNow, dateNow];

    const conn = await this._getConnection();
    try {
      switch (this._internalStoreType) {
        case "sqlite3":
          return this._upsertTransactionSQLite3(
            conn,
            upsertQuery,
            upsertParams
          );
        case "better-sqlite3":
          return this._upsertTransactionBetterSQLite3(
            conn,
            upsertQuery,
            upsertParams
          );
        default:
          throw new Error("Unsupported internalStoreType");
      }
    } finally {
      this._releaseConnection(conn);
    }
  }

  _upsert(rlKey, points, msDuration, forceExpire = false) {
    if (!this.tableCreated) {
      return Promise.reject(new Error("Table is not created yet"));
    }
    return this._upsertTransaction(rlKey, points, msDuration, forceExpire);
  }

  async _get(rlKey) {
    const sql = `SELECT points, expire FROM ${this.tableName} WHERE key = ? AND (expire > ? OR expire IS NULL)`;
    const now = Date.now();
    const conn = await this._getConnection();
    try {
      switch (this._internalStoreType) {
        case "sqlite3":
          return await new Promise((resolve, reject) => {
            conn.get(sql, [rlKey, now], (err, row) =>
              err ? reject(err) : resolve(row || null)
            );
          });
        case "better-sqlite3":
          return conn.prepare(sql).get(rlKey, now) || null;
        default:
          throw new Error("Unsupported internalStoreType");
      }
    } finally {
      this._releaseConnection(conn);
    }
  }

  async _delete(rlKey) {
    if (!this.tableCreated) {
      return Promise.reject(new Error("Table is not created yet"));
    }
    const sql = `DELETE FROM ${this.tableName} WHERE key = ?`;
    const conn = await this._getConnection();
    try {
      switch (this._internalStoreType) {
        case "sqlite3":
          return await new Promise((resolve, reject) => {
            conn.run(sql, [rlKey], function (err) {
              if (err) reject(err);
              else resolve(this.changes > 0);
            });
          });
        case "better-sqlite3":
          const result = conn.prepare(sql).run(rlKey);
          return result.changes > 0;
        default:
          throw new Error("Unsupported internalStoreType");
      }
    } finally {
      this._releaseConnection(conn);
    }
  }
}

module.exports = RateLimiterSQLite;


/***/ }),

/***/ 65140:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const RateLimiterAbstract = __webpack_require__(88569);
const BlockedKeys = __webpack_require__(38830);
const RateLimiterRes = __webpack_require__(80449);
const RateLimiterInsuredAbstract = __webpack_require__(33847);

module.exports = class RateLimiterStoreAbstract extends RateLimiterInsuredAbstract {
  /**
   *
   * @param opts Object Defaults {
   *   ... see other in RateLimiterAbstract
   *
   *   inMemoryBlockOnConsumed: 40, // Number of points when key is blocked
   *   inMemoryBlockDuration: 10, // Block duration in seconds
   *   insuranceLimiter: RateLimiterAbstract
   * }
   */
  constructor(opts = {}) {
    super(opts);

    this.inMemoryBlockOnConsumed = opts.inMemoryBlockOnConsumed;
    this.inMemoryBlockDuration = opts.inMemoryBlockDuration;
    this._inMemoryBlockedKeys = new BlockedKeys();
  }

  get client() {
    return this._client;
  }

  set client(value) {
    if (typeof value === 'undefined') {
      throw new Error('storeClient is not set');
    }
    this._client = value;
  }

  /**
   * Have to be launched after consume
   * It blocks key and execute evenly depending on result from store
   *
   * It uses _getRateLimiterRes function to prepare RateLimiterRes from store result
   *
   * @param resolve
   * @param reject
   * @param rlKey
   * @param changedPoints
   * @param storeResult
   * @param {Object} options
   * @private
   */
  _afterConsume(resolve, reject, rlKey, changedPoints, storeResult, options = {}) {
    const res = this._getRateLimiterRes(rlKey, changedPoints, storeResult);

    if (this.inMemoryBlockOnConsumed > 0 && !(this.inMemoryBlockDuration > 0)
      && res.consumedPoints >= this.inMemoryBlockOnConsumed
    ) {
      this._inMemoryBlockedKeys.addMs(rlKey, res.msBeforeNext);
      if (res.consumedPoints > this.points) {
        return reject(res);
      } else {
        return resolve(res)
      }
    } else if (res.consumedPoints > this.points) {
      let blockPromise = Promise.resolve();
      // Block only first time when consumed more than points
      if (this.blockDuration > 0 && res.consumedPoints <= (this.points + changedPoints)) {
        res.msBeforeNext = this.msBlockDuration;
        blockPromise = this._block(rlKey, res.consumedPoints, this.msBlockDuration, options);
      }

      if (this.inMemoryBlockOnConsumed > 0 && res.consumedPoints >= this.inMemoryBlockOnConsumed) {
        // Block key for this.inMemoryBlockDuration seconds
        this._inMemoryBlockedKeys.add(rlKey, this.inMemoryBlockDuration);
        res.msBeforeNext = this.msInMemoryBlockDuration;
      }

      blockPromise
        .then(() => {
          reject(res);
        })
        .catch((err) => {
          reject(err);
        });
    } else if (this.execEvenly && res.msBeforeNext > 0 && !res.isFirstInDuration) {
      let delay = Math.ceil(res.msBeforeNext / (res.remainingPoints + 2));
      if (delay < this.execEvenlyMinDelayMs) {
        delay = res.consumedPoints * this.execEvenlyMinDelayMs;
      }

      setTimeout(resolve, delay, res);
    } else {
      resolve(res);
    }
  }

  getInMemoryBlockMsBeforeExpire(rlKey) {
    if (this.inMemoryBlockOnConsumed > 0) {
      return this._inMemoryBlockedKeys.msBeforeExpire(rlKey);
    }

    return 0;
  }

  get inMemoryBlockOnConsumed() {
    return this._inMemoryBlockOnConsumed;
  }

  set inMemoryBlockOnConsumed(value) {
    this._inMemoryBlockOnConsumed = value ? parseInt(value) : 0;
    if (this.inMemoryBlockOnConsumed > 0 && this.points > this.inMemoryBlockOnConsumed) {
      throw new Error('inMemoryBlockOnConsumed option must be greater or equal "points" option');
    }
  }

  get inMemoryBlockDuration() {
    return this._inMemoryBlockDuration;
  }

  set inMemoryBlockDuration(value) {
    this._inMemoryBlockDuration = value ? parseInt(value) : 0;
    if (this.inMemoryBlockDuration > 0 && this.inMemoryBlockOnConsumed === 0) {
      throw new Error('inMemoryBlockOnConsumed option must be set up');
    }
  }

  get msInMemoryBlockDuration() {
    return this._inMemoryBlockDuration * 1000;
  }

  /**
   * Block any key for secDuration seconds
   *
   * @param key
   * @param secDuration
   * @param {Object} options
   *
   * @return Promise<RateLimiterRes>
   */
  block(key, secDuration, options = {}) {
    const msDuration = secDuration * 1000;
    return this._block(this.getKey(key), this.points + 1, msDuration, options);
  }

  /**
   * Set points by key for any duration
   *
   * @param key
   * @param points
   * @param secDuration
   * @param {Object} options
   *
   * @return Promise<RateLimiterRes>
   */
  set(key, points, secDuration, options = {}) {
    const msDuration = (secDuration >= 0 ? secDuration : this.duration) * 1000;
    return this._block(this.getKey(key), points, msDuration, options);
  }

  /**
   *
   * @param key
   * @param pointsToConsume
   * @param {Object} options
   * @returns Promise<RateLimiterRes>
   */
  _consume(key, pointsToConsume = 1, options = {}) {
    return new Promise((resolve, reject) => {
      const rlKey = this.getKey(key);

      const inMemoryBlockMsBeforeExpire = this.getInMemoryBlockMsBeforeExpire(rlKey);
      if (inMemoryBlockMsBeforeExpire > 0) {
        return reject(new RateLimiterRes(0, inMemoryBlockMsBeforeExpire));
      }

      this._upsert(rlKey, pointsToConsume, this._getKeySecDuration(options) * 1000, false, options)
        .then((res) => {
          this._afterConsume(resolve, reject, rlKey, pointsToConsume, res);
        })
        .catch((err) => reject(err));
    });
  }

  /**
   *
   * @param key
   * @param points
   * @param {Object} options
   * @returns Promise<RateLimiterRes>
   */
  _penalty(key, points = 1, options = {}) {
    const rlKey = this.getKey(key);
    return new Promise((resolve, reject) => {
      this._upsert(rlKey, points, this._getKeySecDuration(options) * 1000, false, options)
        .then((res) => {
          resolve(this._getRateLimiterRes(rlKey, points, res));
        })
        .catch((res) => reject(res));
    });
  }

  /**
   *
   * @param key
   * @param points
   * @param {Object} options
   * @returns Promise<RateLimiterRes>
   */
  _reward(key, points = 1, options = {}) {
    const rlKey = this.getKey(key);
    return new Promise((resolve, reject) => {
      this._upsert(rlKey, -points, this._getKeySecDuration(options) * 1000, false, options)
        .then((res) => {
          resolve(this._getRateLimiterRes(rlKey, -points, res));
        })
        .catch((res) => reject(res));
    });
  }

  /**
   *
   * @param key
   * @param {Object} options
   * @returns Promise<RateLimiterRes>|null
   */
  get(key, options = {}) {
    const rlKey = this.getKey(key);
    return new Promise((resolve, reject) => {
      this._get(rlKey, options)
        .then((res) => {
          if (res === null || typeof res === 'undefined') {
            resolve(null);
          } else {
            resolve(this._getRateLimiterRes(rlKey, 0, res));
          }
        })
        .catch((err) => {
          this._handleError(err, 'get', resolve, reject, [key, options]);
        });
    });
  }

  /**
   *
   * @param key
   * @param {Object} options
   * @returns Promise<boolean>
   */
  delete(key, options = {}) {
    const rlKey = this.getKey(key);
    return new Promise((resolve, reject) => {
      this._delete(rlKey, options)
        .then((res) => {
          this._inMemoryBlockedKeys.delete(rlKey);
          resolve(res);
        })
        .catch((err) => {
          this._handleError(err, 'delete', resolve, reject, [key, options]);
        });
    });
  }

  /**
   * Cleanup keys no-matter expired or not.
   */
  deleteInMemoryBlockedAll() {
    this._inMemoryBlockedKeys.delete();
  }

  /**
   * Get RateLimiterRes object filled depending on storeResult, which specific for exact store
   *
   * @param rlKey
   * @param changedPoints
   * @param storeResult
   * @private
   */
  _getRateLimiterRes(rlKey, changedPoints, storeResult) { // eslint-disable-line no-unused-vars
    throw new Error("You have to implement the method '_getRateLimiterRes'!");
  }

  /**
   * Block key for this.msBlockDuration milliseconds
   * Usually, it just prolongs lifetime of key
   *
   * @param rlKey
   * @param initPoints
   * @param msDuration
   * @param {Object} options
   *
   * @return Promise<any>
   */
  _block(rlKey, initPoints, msDuration, options = {}) {
    return new Promise((resolve, reject) => {
      this._upsert(rlKey, initPoints, msDuration, true, options)
        .then(() => {
          resolve(new RateLimiterRes(0, msDuration > 0 ? msDuration : -1, initPoints));
        })
        .catch((err) => {
          this._handleError(err, 'block', resolve, reject, [this.parseKey(rlKey), msDuration / 1000, options]);
        });
    });
  }

  /**
   * Have to be implemented in every limiter
   * Resolve with raw result from Store OR null if rlKey is not set
   * or Reject with error
   *
   * @param rlKey
   * @param {Object} options
   * @private
   *
   * @return Promise<any>
   */
  _get(rlKey, options = {}) { // eslint-disable-line no-unused-vars
    throw new Error("You have to implement the method '_get'!");
  }

  /**
   * Have to be implemented
   * Resolve with true OR false if rlKey doesn't exist
   * or Reject with error
   *
   * @param rlKey
   * @param {Object} options
   * @private
   *
   * @return Promise<any>
   */
  _delete(rlKey, options = {}) { // eslint-disable-line no-unused-vars
    throw new Error("You have to implement the method '_delete'!");
  }

  /**
   * Have to be implemented
   * Resolve with object used for {@link _getRateLimiterRes} to generate {@link RateLimiterRes}
   *
   * @param {string} rlKey
   * @param {number} points
   * @param {number} msDuration
   * @param {boolean} forceExpire
   * @param {Object} options
   * @abstract
   *
   * @return Promise<Object>
   */
  _upsert(rlKey, points, msDuration, forceExpire = false, options = {}) {
    throw new Error("You have to implement the method '_upsert'!");
  }
};


/***/ }),

/***/ 10244:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const RateLimiterAbstract = __webpack_require__(88569);

module.exports = class RateLimiterUnion {
  constructor(...limiters) {
    if (limiters.length < 1) {
      throw new Error('RateLimiterUnion: at least one limiter have to be passed');
    }
    limiters.forEach((limiter) => {
      if (!(limiter instanceof RateLimiterAbstract)) {
        throw new Error('RateLimiterUnion: all limiters have to be instance of RateLimiterAbstract');
      }
    });

    this._limiters = limiters;
  }

  consume(key, points = 1) {
    return new Promise((resolve, reject) => {
      const promises = [];
      this._limiters.forEach((limiter) => {
        promises.push(limiter.consume(key, points).catch(rej => ({ rejected: true, rej })));
      });

      Promise.all(promises)
        .then((res) => {
          const resObj = {};
          let rejected = false;

          res.forEach((item) => {
            if (item.rejected === true) {
              rejected = true;
            }
          });

          for (let i = 0; i < res.length; i++) {
            if (rejected && res[i].rejected === true) {
              resObj[this._limiters[i].keyPrefix] = res[i].rej;
            } else if (!rejected) {
              resObj[this._limiters[i].keyPrefix] = res[i];
            }
          }

          if (rejected) {
            reject(resObj);
          } else {
            resolve(resObj);
          }
        });
    });
  }
};


/***/ }),

/***/ 32193:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const RateLimiterStoreAbstract = __webpack_require__(65140);
const RateLimiterRes = __webpack_require__(80449);

const incrTtlLuaScript = `
server.call('set', KEYS[1], 0, 'EX', ARGV[2], 'NX')
local consumed = server.call('incrby', KEYS[1], ARGV[1])
local ttl = server.call('pttl', KEYS[1])
return {consumed, ttl}
`;

class RateLimiterValkey extends RateLimiterStoreAbstract {
  /**
   *
   * @param {Object} opts
   * Defaults {
   *   ... see other in RateLimiterStoreAbstract
   *
   *   storeClient: ValkeyClient
   *   rejectIfValkeyNotReady: boolean = false - reject / invoke insuranceLimiter immediately when valkey connection is not "ready"
   * }
   */
  constructor(opts) {
    super(opts);
    this.client = opts.storeClient;

    this._rejectIfValkeyNotReady = !!opts.rejectIfValkeyNotReady;
    this._incrTtlLuaScript = opts.customIncrTtlLuaScript || incrTtlLuaScript;

    this.client.defineCommand('rlflxIncr', {
      numberOfKeys: 1,
      lua: this._incrTtlLuaScript,
    });
  }

  /**
   * Prevent actual valkey call if valkey connection is not ready
   * @return {boolean}
   * @private
   */
  _isValkeyReady() {
    if (!this._rejectIfValkeyNotReady) {
      return true;
    }

    return this.client.status === 'ready';
  }

  _getRateLimiterRes(rlKey, changedPoints, result) {
    let consumed;
    let resTtlMs;

    if (Array.isArray(result[0])) {
      [[, consumed], [, resTtlMs]] = result;
    } else {
      [consumed, resTtlMs] = result;
    }

    const res = new RateLimiterRes();
    res.consumedPoints = +consumed;
    res.isFirstInDuration = res.consumedPoints === changedPoints;
    res.remainingPoints = Math.max(this.points - res.consumedPoints, 0);
    res.msBeforeNext = resTtlMs;

    return res;
  }

  _upsert(rlKey, points, msDuration, forceExpire = false) {
    if (!this._isValkeyReady()) {
      throw new Error('Valkey connection is not ready');
    }

    const secDuration = Math.floor(msDuration / 1000);

    if (forceExpire) {
      const multi = this.client.multi();

      if (secDuration > 0) {
        multi.set(rlKey, points, 'EX', secDuration);
      } else {
        multi.set(rlKey, points);
      }

      return multi.pttl(rlKey).exec();
    }

    if (secDuration > 0) {
      return this.client.rlflxIncr([rlKey, String(points), String(secDuration), String(this.points), String(this.duration)]);
    }

    return this.client.multi().incrby(rlKey, points).pttl(rlKey).exec();
  }

  _get(rlKey) {
    if (!this._isValkeyReady()) {
      throw new Error('Valkey connection is not ready');
    }

    return this.client
      .multi()
      .get(rlKey)
      .pttl(rlKey)
      .exec()
      .then((result) => {
        const [[, points]] = result;
        if (points === null) return null;
        return result;
      });
  }

  _delete(rlKey) {
    return this.client
      .del(rlKey)
      .then(result => result > 0);
  }
}

module.exports = RateLimiterValkey;


/***/ }),

/***/ 53756:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* eslint-disable no-unused-vars */
const RateLimiterStoreAbstract = __webpack_require__(65140);
const RateLimiterRes = __webpack_require__(80449);

/**
 * @typedef {import('@valkey/valkey-glide').GlideClient} GlideClient
 * @typedef {import('@valkey/valkey-glide').GlideClusterClient} GlideClusterClient
 */

const DEFAULT_LIBRARY_NAME = 'ratelimiterflexible';

const DEFAULT_VALKEY_SCRIPT = `local key = KEYS[1]
local pointsToConsume = tonumber(ARGV[1])
if tonumber(ARGV[2]) > 0 then
  server.call('set', key, "0", 'EX', ARGV[2], 'NX')
  local consumed = server.call('incrby', key, pointsToConsume)
  local pttl = server.call('pttl', key)
  return {consumed, pttl}
end
local consumed = server.call('incrby', key, pointsToConsume)
local pttl = server.call('pttl', key)
return {consumed, pttl}`;

const GET_VALKEY_SCRIPT = `local key = KEYS[1]
local value = server.call('get', key)
if value == nil then
  return value
end
local pttl = server.call('pttl', key)
return {tonumber(value), pttl}`;

class RateLimiterValkeyGlide extends RateLimiterStoreAbstract {
  /**
   * Constructor for RateLimiterValkeyGlide
   *
   * @param {Object} opts - Configuration options
   * @param {GlideClient|GlideClusterClient} opts.storeClient - Valkey Glide client instance (required)
   * @param {number} [opts.points=4] - Maximum number of points that can be consumed over duration
   * @param {number} [opts.duration=1] - Duration in seconds before points are reset
   * @param {number} [opts.blockDuration=0] - Duration in seconds that a key will be blocked for if consumed more than points
   * @param {boolean} [opts.rejectIfValkeyNotReady=false] - Whether to reject requests if Valkey is not ready
   * @param {boolean} [opts.execEvenly=false] - Delay actions to distribute them evenly over duration
   * @param {number} [opts.execEvenlyMinDelayMs] - Minimum delay between actions when execEvenly is true
   * @param {string} [opts.customFunction] - Custom Lua script for rate limiting logic
   * @param {number} [opts.inMemoryBlockOnConsumed] - Points threshold for in-memory blocking
   * @param {number} [opts.inMemoryBlockDuration] - Duration in seconds for in-memory blocking
   * @param {string} [opts.customFunctionLibName] - Custom name for the function library, defaults to 'ratelimiter'.
   * The name is used to identify the library of the lua function. An custom name should be used only if you
   * you want to use different libraries for different rate limiters, otherwise it is not needed.
   * @param {RateLimiterAbstract} [opts.insuranceLimiter] - Backup limiter to use when the primary client fails
   *
   * @example
   * const rateLimiter = new RateLimiterValkeyGlide({
   *   storeClient: glideClient,
   *   points: 5,
   *   duration: 1
   * });
   *
   * @example <caption>With custom Lua function</caption>
   * const customScript = `local key = KEYS[1]
   * local pointsToConsume = tonumber(ARGV[1]) or 0
   * local secDuration = tonumber(ARGV[2]) or 0
   *
   * -- Custom implementation
   * -- ...
   *
   * -- Must return exactly two values: [consumed_points, ttl_in_ms]
   * return {consumed, ttl}`
   *
   * const rateLimiter = new RateLimiterValkeyGlide({
   *   storeClient: glideClient,
   *   points: 5,
   *   customFunction: customScript
   * });
   *
   * @example <caption>With insurance limiter</caption>
   * const rateLimiter = new RateLimiterValkeyGlide({
   *   storeClient: primaryGlideClient,
   *   points: 5,
   *   duration: 2,
   *   insuranceLimiter: new RateLimiterMemory({
   *     points: 5,
   *     duration: 2
   *   })
   * });
   *
   * @description
   * When providing a custom Lua script via `opts.customFunction`, it must:
   *
   * 1. Accept parameters:
   *    - KEYS[1]: The key being rate limited
   *    - ARGV[1]: Points to consume (as string, use tonumber() to convert)
   *    - ARGV[2]: Duration in seconds (as string, use tonumber() to convert)
   *
   * 2. Return an array with exactly two elements:
   *    - [0]: Consumed points (number)
   *    - [1]: TTL in milliseconds (number)
   *
   * 3. Handle scenarios:
   *    - New key creation: Initialize with expiry for fixed windows
   *    - Key updates: Increment existing counters
   */
  constructor(opts) {
    super(opts);
    this.client = opts.storeClient;
    this._scriptLoaded = false;
    this._getScriptLoaded = false;
    this._rejectIfValkeyNotReady = !!opts.rejectIfValkeyNotReady;
    this._luaScript = opts.customFunction || DEFAULT_VALKEY_SCRIPT;
    this._libraryName = opts.customFunctionLibName || DEFAULT_LIBRARY_NAME;
  }

  /**
   * Ensure scripts are loaded in the Valkey server
   * @returns {Promise<boolean>} True if scripts are loaded
   * @private
   */
  async _loadScripts() {
    if (this._scriptLoaded && this._getScriptLoaded) {
      return true;
    }
    if (!this.client) {
      throw new Error('Valkey client is not set');
    }
    const promises = [];
    if (!this._scriptLoaded) {
      const script = Buffer.from(`#!lua name=${this._libraryName}
        local function consume(KEYS, ARGV)
          ${this._luaScript.trim()}
        end
        server.register_function('consume', consume)`);
      promises.push(this.client.functionLoad(script, { replace: true }));
    } else promises.push(Promise.resolve(this._libraryName));

    if (!this._getScriptLoaded) {
      const script = Buffer.from(`#!lua name=ratelimiter_get
        local function getValue(KEYS, ARGV)
          ${GET_VALKEY_SCRIPT.trim()}
        end
        server.register_function('getValue', getValue)`);
      promises.push(this.client.functionLoad(script, { replace: true }));
    } else promises.push(Promise.resolve('ratelimiter_get'));

    const results = await Promise.all(promises);
    this._scriptLoaded = results[0] === this._libraryName;
    this._getScriptLoaded = results[1] === 'ratelimiter_get';

    if ((!this._scriptLoaded || !this._getScriptLoaded)) {
      throw new Error('Valkey connection is not ready, scripts not loaded');
    }
    return true;
  }

  /**
   * Update or insert the rate limiter record
   *
   * @param {string} rlKey - The rate limiter key
   * @param {number} pointsToConsume - Points to be consumed
   * @param {number} msDuration - Duration in milliseconds
   * @param {boolean} [forceExpire=false] - Whether to force expiration
   * @param {Object} [options={}] - Additional options
   * @returns {Promise<Array>} Array containing consumed points and TTL
   * @private
   */
  async _upsert(rlKey, pointsToConsume, msDuration, forceExpire = false, options = {}) {
    await this._loadScripts();
    const secDuration = Math.floor(msDuration / 1000);
    if (forceExpire) {
      if (secDuration > 0) {
        await this.client.set(
          rlKey,
          String(pointsToConsume),
          { expiry: { type: 'EX', count: secDuration } },
        );
        return [pointsToConsume, secDuration * 1000];
      }
      await this.client.set(rlKey, String(pointsToConsume));
      return [pointsToConsume, -1];
    }
    const result = await this.client.fcall(
      'consume',
      [rlKey],
      [String(pointsToConsume), String(secDuration)],
    );
    return result;
  }

  /**
   * Get the rate limiter record
   *
   * @param {string} rlKey - The rate limiter key
   * @param {Object} [options={}] - Additional options
   * @returns {Promise<Array|null>} Array containing consumed points and TTL, or null if not found
   * @private
   */
  async _get(rlKey, options = {}) {
    await this._loadScripts();
    const res = await this.client.fcall('getValue', [rlKey], []);
    return res.length > 0 ? res : null;
  }

  /**
   * Delete the rate limiter record
   *
   * @param {string} rlKey - The rate limiter key
   * @param {Object} [options={}] - Additional options
   * @returns {Promise<boolean>} True if successful, false otherwise
   * @private
   */
  async _delete(rlKey, options = {}) {
    const result = await this.client.del([rlKey]);
    return result > 0;
  }

  /**
   * Convert raw result to RateLimiterRes object
   *
   * @param {string} rlKey - The rate limiter key
   * @param {number} changedPoints - Points changed in this operation
   * @param {Array|null} result - Result from Valkey operation
   * @returns {RateLimiterRes|null} RateLimiterRes object or null if result is null
   * @private
   */
  _getRateLimiterRes(rlKey, changedPoints, result) {
    if (result === null) {
      return null;
    }
    const res = new RateLimiterRes();
    const [consumedPointsStr, pttl] = result;
    const consumedPoints = Number(consumedPointsStr);

    // Handle consumed points
    res.isFirstInDuration = consumedPoints === changedPoints;
    res.consumedPoints = consumedPoints;
    res.remainingPoints = Math.max(this.points - res.consumedPoints, 0);
    res.msBeforeNext = pttl;
    return res;
  }

  /**
   * Close the rate limiter and release resources
   * Note: The method won't going to close the Valkey client, as it may be shared with other instances.
   * @returns {Promise<void>} Promise that resolves when the rate limiter is closed
   */
  async close() {
    if (this._scriptLoaded) {
      await this.client.functionDelete(this._libraryName);
      this._scriptLoaded = false;
    }
    if (this._getScriptLoaded) {
      await this.client.functionDelete('ratelimiter_get');
      this._getScriptLoaded = false;
    }
    if (this.insuranceLimiter) {
      try {
        await this.insuranceLimiter.close();
      } catch (e) {
        // We can't assume that insuranceLimiter is a Valkey client or any
        // other insuranceLimiter type which implement close method.
      }
    }
    // Clear instance properties to let garbage collector free memory
    this.client = null;
    this._scriptLoaded = false;
    this._getScriptLoaded = false;
    this._rejectIfValkeyNotReady = false;
    this._luaScript = null;
    this._libraryName = null;
    this.insuranceLimiter = null;
  }
}

module.exports = RateLimiterValkeyGlide;


/***/ }),

/***/ 85202:
/***/ ((module) => {

module.exports = class BlockedKeys {
  constructor() {
    this._keys = {}; // {'key': 1526279430331}
    this._addedKeysAmount = 0;
  }

  collectExpired() {
    const now = Date.now();

    Object.keys(this._keys).forEach((key) => {
      if (this._keys[key] <= now) {
        delete this._keys[key];
      }
    });

    this._addedKeysAmount = Object.keys(this._keys).length;
  }

  /**
   * Add new blocked key
   *
   * @param key String
   * @param sec Number
   */
  add(key, sec) {
    this.addMs(key, sec * 1000);
  }

  /**
   * Add new blocked key for ms
   *
   * @param key String
   * @param ms Number
   */
  addMs(key, ms) {
    this._keys[key] = Date.now() + ms;
    this._addedKeysAmount++;
    if (this._addedKeysAmount > 999) {
      this.collectExpired();
    }
  }

  /**
   * 0 means not blocked
   *
   * @param key
   * @returns {number}
   */
  msBeforeExpire(key) {
    const expire = this._keys[key];

    if (expire && expire >= Date.now()) {
      this.collectExpired();
      const now = Date.now();
      return expire >= now ? expire - now : 0;
    }

    return 0;
  }

  /**
   * If key is not given, delete all data in memory
   * 
   * @param {string|undefined} key
   */
  delete(key) {
    if (key) {
      delete this._keys[key];
    } else {
      Object.keys(this._keys).forEach((key) => {
        delete this._keys[key];
      });
    }
  }
};


/***/ }),

/***/ 38830:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const BlockedKeys = __webpack_require__(85202);

module.exports = BlockedKeys;


/***/ }),

/***/ 81534:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Record = __webpack_require__(60749);
const RateLimiterRes = __webpack_require__(80449);

module.exports = class MemoryStorage {
  constructor() {
    /**
     * @type {Object.<string, Record>}
     * @private
     */
    this._storage = {};
  }

  incrby(key, value, durationSec) {
    if (this._storage[key]) {
      const msBeforeExpires = this._storage[key].expiresAt
        ? this._storage[key].expiresAt.getTime() - new Date().getTime()
        : -1;
      if (!this._storage[key].expiresAt || msBeforeExpires > 0) {
        // Change value
        this._storage[key].value = this._storage[key].value + value;

        return new RateLimiterRes(0, msBeforeExpires, this._storage[key].value, false);
      }

      return this.set(key, value, durationSec);
    }
    return this.set(key, value, durationSec);
  }

  set(key, value, durationSec) {
    const durationMs = durationSec * 1000;

    if (this._storage[key] && this._storage[key].timeoutId) {
      clearTimeout(this._storage[key].timeoutId);
    }

    this._storage[key] = new Record(
      value,
      durationMs > 0 ? new Date(Date.now() + durationMs) : null
    );
    if (durationMs > 0) {
      this._storage[key].timeoutId = setTimeout(() => {
        delete this._storage[key];
      }, durationMs);
      if (this._storage[key].timeoutId.unref) {
        this._storage[key].timeoutId.unref();
      }
    }

    return new RateLimiterRes(0, durationMs === 0 ? -1 : durationMs, this._storage[key].value, true);
  }

  /**
   *
   * @param key
   * @returns {*}
   */
  get(key) {
    if (this._storage[key]) {
      const msBeforeExpires = this._storage[key].expiresAt
        ? this._storage[key].expiresAt.getTime() - new Date().getTime()
        : -1;
      return new RateLimiterRes(0, msBeforeExpires, this._storage[key].value, false);
    }
    return null;
  }

  /**
   *
   * @param key
   * @returns {boolean}
   */
  delete(key) {
    if (this._storage[key]) {
      if (this._storage[key].timeoutId) {
        clearTimeout(this._storage[key].timeoutId);
      }
      delete this._storage[key];
      return true;
    }
    return false;
  }
};


/***/ }),

/***/ 60749:
/***/ ((module) => {

module.exports = class Record {
  /**
   *
   * @param value int
   * @param expiresAt Date|int
   * @param timeoutId
   */
  constructor(value, expiresAt, timeoutId = null) {
    this.value = value;
    this.expiresAt = expiresAt;
    this.timeoutId = timeoutId;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = parseInt(value);
  }

  get expiresAt() {
    return this._expiresAt;
  }

  set expiresAt(value) {
    if (!(value instanceof Date) && Number.isInteger(value)) {
      value = new Date(value);
    }
    this._expiresAt = value;
  }

  get timeoutId() {
    return this._timeoutId;
  }

  set timeoutId(value) {
    this._timeoutId = value;
  }
};


/***/ }),

/***/ 43184:
/***/ ((module) => {

module.exports = class RateLimiterEtcdTransactionFailedError extends Error {
  constructor(message) {
    super();
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    this.name = 'RateLimiterEtcdTransactionFailedError';
    this.message = message;
  }
};


/***/ }),

/***/ 27948:
/***/ ((module) => {

module.exports = class RateLimiterQueueError extends Error {
  constructor(message, extra) {
    super();
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    this.name = 'CustomError';
    this.message = message;
    if (extra) {
      this.extra = extra;
    }
  }
};


/***/ }),

/***/ 72922:
/***/ ((module) => {

module.exports = class RateLimiterSetupError extends Error {
  constructor(message) {
    super();
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    this.name = 'RateLimiterSetupError';
    this.message = message;
  }
};


/***/ }),

/***/ 8948:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var inspect = __webpack_require__(60506);

var $TypeError = __webpack_require__(73314);

/*
* This function traverses the list returning the node corresponding to the given key.
*
* That node is also moved to the head of the list, so that if it's accessed again we don't need to traverse the whole list.
* By doing so, all the recently used nodes can be accessed relatively quickly.
*/
/** @type {import('./list.d.ts').listGetNode} */
// eslint-disable-next-line consistent-return
var listGetNode = function (list, key, isDelete) {
	/** @type {typeof list | NonNullable<(typeof list)['next']>} */
	var prev = list;
	/** @type {(typeof list)['next']} */
	var curr;
	// eslint-disable-next-line eqeqeq
	for (; (curr = prev.next) != null; prev = curr) {
		if (curr.key === key) {
			prev.next = curr.next;
			if (!isDelete) {
				// eslint-disable-next-line no-extra-parens
				curr.next = /** @type {NonNullable<typeof list.next>} */ (list.next);
				list.next = curr; // eslint-disable-line no-param-reassign
			}
			return curr;
		}
	}
};

/** @type {import('./list.d.ts').listGet} */
var listGet = function (objects, key) {
	if (!objects) {
		return void undefined;
	}
	var node = listGetNode(objects, key);
	return node && node.value;
};
/** @type {import('./list.d.ts').listSet} */
var listSet = function (objects, key, value) {
	var node = listGetNode(objects, key);
	if (node) {
		node.value = value;
	} else {
		// Prepend the new node to the beginning of the list
		objects.next = /** @type {import('./list.d.ts').ListNode<typeof value, typeof key>} */ ({ // eslint-disable-line no-param-reassign, no-extra-parens
			key: key,
			next: objects.next,
			value: value
		});
	}
};
/** @type {import('./list.d.ts').listHas} */
var listHas = function (objects, key) {
	if (!objects) {
		return false;
	}
	return !!listGetNode(objects, key);
};
/** @type {import('./list.d.ts').listDelete} */
// eslint-disable-next-line consistent-return
var listDelete = function (objects, key) {
	if (objects) {
		return listGetNode(objects, key, true);
	}
};

/** @type {import('.')} */
module.exports = function getSideChannelList() {
	/** @typedef {ReturnType<typeof getSideChannelList>} Channel */
	/** @typedef {Parameters<Channel['get']>[0]} K */
	/** @typedef {Parameters<Channel['set']>[1]} V */

	/** @type {import('./list.d.ts').RootNode<V, K> | undefined} */ var $o;

	/** @type {Channel} */
	var channel = {
		assert: function (key) {
			if (!channel.has(key)) {
				throw new $TypeError('Side channel does not contain ' + inspect(key));
			}
		},
		'delete': function (key) {
			var root = $o && $o.next;
			var deletedNode = listDelete($o, key);
			if (deletedNode && root && root === deletedNode) {
				$o = void undefined;
			}
			return !!deletedNode;
		},
		get: function (key) {
			return listGet($o, key);
		},
		has: function (key) {
			return listHas($o, key);
		},
		set: function (key, value) {
			if (!$o) {
				// Initialize the linked list as an empty node, so that we don't have to special-case handling of the first node: we can always refer to it as (previous node).next, instead of something like (list).head
				$o = {
					next: void undefined
				};
			}
			// eslint-disable-next-line no-extra-parens
			listSet(/** @type {NonNullable<typeof $o>} */ ($o), key, value);
		}
	};
	// @ts-expect-error TODO: figure out why this is erroring
	return channel;
};


/***/ }),

/***/ 82622:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(60470);
var callBound = __webpack_require__(23105);
var inspect = __webpack_require__(60506);

var $TypeError = __webpack_require__(73314);
var $Map = GetIntrinsic('%Map%', true);

/** @type {<K, V>(thisArg: Map<K, V>, key: K) => V} */
var $mapGet = callBound('Map.prototype.get', true);
/** @type {<K, V>(thisArg: Map<K, V>, key: K, value: V) => void} */
var $mapSet = callBound('Map.prototype.set', true);
/** @type {<K, V>(thisArg: Map<K, V>, key: K) => boolean} */
var $mapHas = callBound('Map.prototype.has', true);
/** @type {<K, V>(thisArg: Map<K, V>, key: K) => boolean} */
var $mapDelete = callBound('Map.prototype.delete', true);
/** @type {<K, V>(thisArg: Map<K, V>) => number} */
var $mapSize = callBound('Map.prototype.size', true);

/** @type {import('.')} */
module.exports = !!$Map && /** @type {Exclude<import('.'), false>} */ function getSideChannelMap() {
	/** @typedef {ReturnType<typeof getSideChannelMap>} Channel */
	/** @typedef {Parameters<Channel['get']>[0]} K */
	/** @typedef {Parameters<Channel['set']>[1]} V */

	/** @type {Map<K, V> | undefined} */ var $m;

	/** @type {Channel} */
	var channel = {
		assert: function (key) {
			if (!channel.has(key)) {
				throw new $TypeError('Side channel does not contain ' + inspect(key));
			}
		},
		'delete': function (key) {
			if ($m) {
				var result = $mapDelete($m, key);
				if ($mapSize($m) === 0) {
					$m = void undefined;
				}
				return result;
			}
			return false;
		},
		get: function (key) { // eslint-disable-line consistent-return
			if ($m) {
				return $mapGet($m, key);
			}
		},
		has: function (key) {
			if ($m) {
				return $mapHas($m, key);
			}
			return false;
		},
		set: function (key, value) {
			if (!$m) {
				// @ts-expect-error TS can't handle narrowing a variable inside a closure
				$m = new $Map();
			}
			$mapSet($m, key, value);
		}
	};

	// @ts-expect-error TODO: figure out why TS is erroring here
	return channel;
};


/***/ }),

/***/ 92870:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(60470);
var callBound = __webpack_require__(23105);
var inspect = __webpack_require__(60506);
var getSideChannelMap = __webpack_require__(82622);

var $TypeError = __webpack_require__(73314);
var $WeakMap = GetIntrinsic('%WeakMap%', true);

/** @type {<K extends object, V>(thisArg: WeakMap<K, V>, key: K) => V} */
var $weakMapGet = callBound('WeakMap.prototype.get', true);
/** @type {<K extends object, V>(thisArg: WeakMap<K, V>, key: K, value: V) => void} */
var $weakMapSet = callBound('WeakMap.prototype.set', true);
/** @type {<K extends object, V>(thisArg: WeakMap<K, V>, key: K) => boolean} */
var $weakMapHas = callBound('WeakMap.prototype.has', true);
/** @type {<K extends object, V>(thisArg: WeakMap<K, V>, key: K) => boolean} */
var $weakMapDelete = callBound('WeakMap.prototype.delete', true);

/** @type {import('.')} */
module.exports = $WeakMap
	? /** @type {Exclude<import('.'), false>} */ function getSideChannelWeakMap() {
		/** @typedef {ReturnType<typeof getSideChannelWeakMap>} Channel */
		/** @typedef {Parameters<Channel['get']>[0]} K */
		/** @typedef {Parameters<Channel['set']>[1]} V */

		/** @type {WeakMap<K & object, V> | undefined} */ var $wm;
		/** @type {Channel | undefined} */ var $m;

		/** @type {Channel} */
		var channel = {
			assert: function (key) {
				if (!channel.has(key)) {
					throw new $TypeError('Side channel does not contain ' + inspect(key));
				}
			},
			'delete': function (key) {
				if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
					if ($wm) {
						return $weakMapDelete($wm, key);
					}
				} else if (getSideChannelMap) {
					if ($m) {
						return $m['delete'](key);
					}
				}
				return false;
			},
			get: function (key) {
				if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
					if ($wm) {
						return $weakMapGet($wm, key);
					}
				}
				return $m && $m.get(key);
			},
			has: function (key) {
				if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
					if ($wm) {
						return $weakMapHas($wm, key);
					}
				}
				return !!$m && $m.has(key);
			},
			set: function (key, value) {
				if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
					if (!$wm) {
						$wm = new $WeakMap();
					}
					$weakMapSet($wm, key, value);
				} else if (getSideChannelMap) {
					if (!$m) {
						$m = getSideChannelMap();
					}
					// eslint-disable-next-line no-extra-parens
					/** @type {NonNullable<typeof $m>} */ ($m).set(key, value);
				}
			}
		};

		// @ts-expect-error TODO: figure out why this is erroring
		return channel;
	}
	: getSideChannelMap;


/***/ }),

/***/ 94753:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var $TypeError = __webpack_require__(73314);
var inspect = __webpack_require__(60506);
var getSideChannelList = __webpack_require__(8948);
var getSideChannelMap = __webpack_require__(82622);
var getSideChannelWeakMap = __webpack_require__(92870);

var makeChannel = getSideChannelWeakMap || getSideChannelMap || getSideChannelList;

/** @type {import('.')} */
module.exports = function getSideChannel() {
	/** @typedef {ReturnType<typeof getSideChannel>} Channel */

	/** @type {Channel | undefined} */ var $channelData;

	/** @type {Channel} */
	var channel = {
		assert: function (key) {
			if (!channel.has(key)) {
				throw new $TypeError('Side channel does not contain ' + inspect(key));
			}
		},
		'delete': function (key) {
			return !!$channelData && $channelData['delete'](key);
		},
		get: function (key) {
			return $channelData && $channelData.get(key);
		},
		has: function (key) {
			return !!$channelData && $channelData.has(key);
		},
		set: function (key, value) {
			if (!$channelData) {
				$channelData = makeChannel();
			}

			$channelData.set(key, value);
		}
	};
	// @ts-expect-error TODO: figure out why this is erroring
	return channel;
};


/***/ }),

/***/ 4908:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function isLower(char) {
  return char >= 0x61 /* 'a' */ && char <= 0x7a /* 'z' */;
}

function isUpper(char) {
  return char >= 0x41 /* 'A' */ && char <= 0x5a /* 'Z' */;
}

function isDigit(char) {
  return char >= 0x30 /* '0' */ && char <= 0x39 /* '9' */;
}

function toUpper(char) {
  return char - 0x20;
}

function toUpperSafe(char) {
  if (isLower(char)) {
    return char - 0x20;
  }
  return char;
}

function toLower(char) {
  return char + 0x20;
}

function camelize$1(str, separator) {
  var firstChar = str.charCodeAt(0);
  if (isDigit(firstChar) || isUpper(firstChar) || firstChar == separator) {
    return str;
  }
  var out = [];
  var changed = false;
  if (isUpper(firstChar)) {
    changed = true;
    out.push(toLower(firstChar));
  } else {
    out.push(firstChar);
  }

  var length = str.length;
  for (var i = 1; i < length; ++i) {
    var c = str.charCodeAt(i);
    if (c === separator) {
      changed = true;
      c = str.charCodeAt(++i);
      if (isNaN(c)) {
        return str;
      }
      out.push(toUpperSafe(c));
    } else {
      out.push(c);
    }
  }
  return changed ? String.fromCharCode.apply(undefined, out) : str;
}

function decamelize$1(str, separator) {
  var firstChar = str.charCodeAt(0);
  if (!isLower(firstChar)) {
    return str;
  }
  var length = str.length;
  var changed = false;
  var out = [];
  for (var i = 0; i < length; ++i) {
    var c = str.charCodeAt(i);
    if (isUpper(c)) {
      out.push(separator);
      out.push(toLower(c));
      changed = true;
    } else {
      out.push(c);
    }
  }
  return changed ? String.fromCharCode.apply(undefined, out) : str;
}

function pascalize$1(str, separator) {
  var firstChar = str.charCodeAt(0);
  if (isDigit(firstChar) || firstChar == separator) {
    return str;
  }
  var length = str.length;
  var changed = false;
  var out = [];
  for (var i = 0; i < length; ++i) {
    var c = str.charCodeAt(i);
    if (c === separator) {
      changed = true;
      c = str.charCodeAt(++i);
      if (isNaN(c)) {
        return str;
      }
      out.push(toUpperSafe(c));
    } else if (i === 0 && isLower(c)) {
      changed = true;
      out.push(toUpper(c));
    } else {
      out.push(c);
    }
  }
  return changed ? String.fromCharCode.apply(undefined, out) : str;
}

function depascalize$1(str, separator) {
  var firstChar = str.charCodeAt(0);
  if (!isUpper(firstChar)) {
    return str;
  }
  var length = str.length;
  var changed = false;
  var out = [];
  for (var i = 0; i < length; ++i) {
    var c = str.charCodeAt(i);
    if (isUpper(c)) {
      if (i > 0) {
        out.push(separator);
      }
      out.push(toLower(c));
      changed = true;
    } else {
      out.push(c);
    }
  }
  return changed ? String.fromCharCode.apply(undefined, out) : str;
}

function shouldProcessValue(value) {
  return value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object' && !(value instanceof Date) && !(value instanceof Function);
}

function processKeys(obj, fun, opts) {
  var obj2 = void 0;
  if (obj instanceof Array) {
    obj2 = [];
  } else {
    if (typeof obj.prototype !== 'undefined') {
      // return non-plain object unchanged
      return obj;
    }
    obj2 = {};
  }
  for (var key in obj) {
    var value = obj[key];
    if (typeof key === 'string') key = fun(key, opts && opts.separator);
    if (shouldProcessValue(value)) {
      obj2[key] = processKeys(value, fun, opts);
    } else {
      obj2[key] = value;
    }
  }
  return obj2;
}

function processKeysInPlace(obj, fun, opts) {
  var keys = Object.keys(obj);
  for (var idx = 0; idx < keys.length; ++idx) {
    var key = keys[idx];
    var value = obj[key];
    var newKey = fun(key, opts && opts.separator);
    if (newKey !== key) {
      delete obj[key];
    }
    if (shouldProcessValue(value)) {
      obj[newKey] = processKeys(value, fun, opts);
    } else {
      obj[newKey] = value;
    }
  }
  return obj;
}

function camelize$$1(str, separator) {
  return camelize$1(str, separator && separator.charCodeAt(0) || 0x5f /* _ */);
}

function decamelize$$1(str, separator) {
  return decamelize$1(str, separator && separator.charCodeAt(0) || 0x5f /* _ */);
}

function pascalize$$1(str, separator) {
  return pascalize$1(str, separator && separator.charCodeAt(0) || 0x5f /* _ */);
}

function depascalize$$1(str, separator) {
  return depascalize$1(str, separator && separator.charCodeAt(0) || 0x5f /* _ */);
}

function camelizeKeys(obj, opts) {
  opts = opts || {};
  if (!shouldProcessValue(obj)) return obj;
  if (opts.inPlace) return processKeysInPlace(obj, camelize$$1, opts);
  return processKeys(obj, camelize$$1, opts);
}

function decamelizeKeys(obj, opts) {
  opts = opts || {};
  if (!shouldProcessValue(obj)) return obj;
  if (opts.inPlace) return processKeysInPlace(obj, decamelize$$1, opts);
  return processKeys(obj, decamelize$$1, opts);
}

function pascalizeKeys(obj, opts) {
  opts = opts || {};
  if (!shouldProcessValue(obj)) return obj;
  if (opts.inPlace) return processKeysInPlace(obj, pascalize$$1, opts);
  return processKeys(obj, pascalize$$1, opts);
}

function depascalizeKeys(obj, opts) {
  opts = opts || {};
  if (!shouldProcessValue(obj)) return obj;
  if (opts.inPlace) return processKeysInPlace(obj, depascalize$$1, opts);
  return processKeys(obj, depascalize$$1, opts);
}

__webpack_unused_export__ = camelize$$1;
__webpack_unused_export__ = decamelize$$1;
__webpack_unused_export__ = pascalize$$1;
__webpack_unused_export__ = depascalize$$1;
exports.bn = camelizeKeys;
exports.I8 = decamelizeKeys;
__webpack_unused_export__ = pascalizeKeys;
__webpack_unused_export__ = depascalizeKeys;


/***/ }),

/***/ 33888:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GitbeakerRequestError: () => (/* binding */ GitbeakerRequestError),
/* harmony export */   PD: () => (/* binding */ createRequesterFn),
/* harmony export */   Qx: () => (/* binding */ BaseResource),
/* harmony export */   _d: () => (/* binding */ GitbeakerTimeoutError),
/* harmony export */   wA: () => (/* binding */ presetResourceArguments),
/* harmony export */   xQ: () => (/* binding */ GitbeakerRetryError),
/* harmony export */   y9: () => (/* binding */ getMatchingRateLimiter)
/* harmony export */ });
/* unused harmony exports createRateLimiters, defaultOptionsHandler, formatQuery, generateRateLimiterFn */
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(40240);
/* harmony import */ var xcase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4908);
/* harmony import */ var rate_limiter_flexible__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8649);
/* harmony import */ var picomatch_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(43379);





// src/RequesterUtils.ts
var { isMatch: isGlobMatch } = picomatch_browser__WEBPACK_IMPORTED_MODULE_2__;
function generateRateLimiterFn(limit, interval) {
  const limiter = new rate_limiter_flexible__WEBPACK_IMPORTED_MODULE_1__.RateLimiterQueue(
    new rate_limiter_flexible__WEBPACK_IMPORTED_MODULE_1__.RateLimiterMemory({ points: limit, duration: interval })
  );
  return () => limiter.removeTokens(1);
}
function formatQuery(params = {}) {
  const decamelized = (0,xcase__WEBPACK_IMPORTED_MODULE_0__/* .decamelizeKeys */ .I8)(params);
  return (0,qs__WEBPACK_IMPORTED_MODULE_3__.stringify)(decamelized, { arrayFormat: "brackets" });
}
async function defaultOptionsHandler(resourceOptions, {
  body,
  searchParams,
  sudo,
  signal,
  asStream = false,
  method = "GET"
} = {}) {
  const { headers: preconfiguredHeaders, authHeaders, url, agent } = resourceOptions;
  const defaultOptions = {
    method,
    asStream,
    signal,
    prefixUrl: url,
    agent
  };
  defaultOptions.headers = { ...preconfiguredHeaders };
  if (sudo) defaultOptions.headers.sudo = `${sudo}`;
  if (body) {
    if (body instanceof FormData) {
      defaultOptions.body = body;
    } else {
      defaultOptions.body = JSON.stringify((0,xcase__WEBPACK_IMPORTED_MODULE_0__/* .decamelizeKeys */ .I8)(body));
      defaultOptions.headers["content-type"] = "application/json";
    }
  }
  if (Object.keys(authHeaders).length > 0) {
    const [authHeaderKey, authHeaderFn] = Object.entries(authHeaders)[0];
    defaultOptions.headers[authHeaderKey] = await authHeaderFn();
  }
  const q = formatQuery(searchParams);
  if (q) defaultOptions.searchParams = q;
  return Promise.resolve(defaultOptions);
}
function createRateLimiters(rateLimitOptions = {}, rateLimitDuration = 60) {
  const rateLimiters = {};
  Object.entries(rateLimitOptions).forEach(([key, config]) => {
    if (typeof config === "number")
      rateLimiters[key] = generateRateLimiterFn(config, rateLimitDuration);
    else
      rateLimiters[key] = {
        method: config.method.toUpperCase(),
        limit: generateRateLimiterFn(config.limit, rateLimitDuration)
      };
  });
  return rateLimiters;
}
function createRequesterFn(optionsHandler, requestHandler) {
  const methods = ["get", "post", "put", "patch", "delete"];
  return (serviceOptions) => {
    const requester = {};
    const rateLimiters = createRateLimiters(
      serviceOptions.rateLimits,
      serviceOptions.rateLimitDuration
    );
    methods.forEach((m) => {
      requester[m] = async (endpoint, options) => {
        const defaultRequestOptions = await defaultOptionsHandler(serviceOptions, {
          ...options,
          method: m.toUpperCase()
        });
        const requestOptions = await optionsHandler(serviceOptions, defaultRequestOptions);
        return requestHandler(endpoint, { ...requestOptions, rateLimiters });
      };
    });
    return requester;
  };
}
function createPresetConstructor(Constructor, presetConfig) {
  return class extends Constructor {
    constructor(...args) {
      const [config, ...rest] = args;
      super({ ...presetConfig, ...config }, ...rest);
    }
  };
}
function presetResourceArguments(resources, customConfig = {}) {
  const result = {};
  Object.entries(resources).forEach(([key, Constructor]) => {
    if (typeof Constructor === "function") {
      result[key] = createPresetConstructor(
        Constructor,
        customConfig
      );
    } else {
      result[key] = Constructor;
    }
  });
  return result;
}
function getMatchingRateLimiter(endpoint, rateLimiters = {}, method = "GET") {
  const sortedEndpoints = Object.keys(rateLimiters).sort().reverse();
  const match = sortedEndpoints.find((ep) => isGlobMatch(endpoint, ep));
  const rateLimitConfig = match && rateLimiters[match];
  if (typeof rateLimitConfig === "function") return rateLimitConfig;
  if (rateLimitConfig && rateLimitConfig?.method?.toUpperCase() === method.toUpperCase()) {
    return rateLimitConfig.limit;
  }
  return generateRateLimiterFn(3e3, 60);
}

// src/BaseResource.ts
function getDynamicToken(tokenArgument) {
  return tokenArgument instanceof Function ? tokenArgument() : Promise.resolve(tokenArgument);
}
var DEFAULT_RATE_LIMITS = Object.freeze({
  // Default rate limit
  "**": 3e3,
  // Import/Export
  "projects/import": 6,
  "projects/*/export": 6,
  "projects/*/download": 1,
  "groups/import": 6,
  "groups/*/export": 6,
  "groups/*/download": 1,
  // Note creation
  "projects/*/issues/*/notes": {
    method: "post",
    limit: 300
  },
  "projects/*/snippets/*/notes": {
    method: "post",
    limit: 300
  },
  "projects/*/merge_requests/*/notes": {
    method: "post",
    limit: 300
  },
  "groups/*/epics/*/notes": {
    method: "post",
    limit: 300
  },
  // Repositories - get file archive
  "projects/*/repository/archive*": 5,
  // Project Jobs
  "projects/*/jobs": 600,
  // Member deletion
  "projects/*/members": 60,
  "groups/*/members": 60
});
var BaseResource = class {
  url;
  requester;
  queryTimeout;
  headers;
  authHeaders;
  camelize;
  constructor({
    sudo,
    profileToken,
    camelize,
    requesterFn,
    agent,
    profileMode = "execution",
    host = "https://gitlab.com",
    prefixUrl = "",
    queryTimeout = 3e5,
    rateLimitDuration = 60,
    rateLimits = DEFAULT_RATE_LIMITS,
    ...tokens
  }) {
    if (!requesterFn) throw new ReferenceError("requesterFn must be passed");
    this.url = [host, "api", "v4", prefixUrl].join("/");
    this.headers = {};
    this.authHeaders = {};
    this.camelize = camelize;
    this.queryTimeout = queryTimeout;
    if ("oauthToken" in tokens)
      this.authHeaders.authorization = async () => {
        const token = await getDynamicToken(tokens.oauthToken);
        return `Bearer ${token}`;
      };
    else if ("jobToken" in tokens)
      this.authHeaders["job-token"] = async () => getDynamicToken(tokens.jobToken);
    else if ("token" in tokens)
      this.authHeaders["private-token"] = async () => getDynamicToken(tokens.token);
    if (profileToken) {
      this.headers["X-Profile-Token"] = profileToken;
      this.headers["X-Profile-Mode"] = profileMode;
    }
    if (sudo) this.headers.Sudo = `${sudo}`;
    this.requester = requesterFn({ ...this, rateLimits, rateLimitDuration, agent });
  }
};

// src/GitbeakerError.ts
var GitbeakerRequestError = class extends Error {
  cause;
  constructor(message, options) {
    super(message, options);
    this.cause = options?.cause;
    this.name = "GitbeakerRequestError";
  }
};
var GitbeakerTimeoutError = class extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "GitbeakerTimeoutError";
  }
};
var GitbeakerRetryError = class extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "GitbeakerRetryError";
  }
};




/***/ })

};
;