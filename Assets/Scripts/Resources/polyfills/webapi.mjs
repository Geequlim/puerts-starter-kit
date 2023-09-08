/******/ var __webpack_modules__ = ({

/***/ "./node_modules/base64-js/index.js":
/*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {



exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ "./node_modules/buffer/index.js":
/*!**************************************!*\
  !*** ./node_modules/buffer/index.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



const base64 = __webpack_require__(/*! base64-js */ "./node_modules/base64-js/index.js")
const ieee754 = __webpack_require__(/*! ieee754 */ "./node_modules/ieee754/index.js")
const customInspectSymbol =
  (typeof Symbol === 'function' && typeof Symbol['for'] === 'function') // eslint-disable-line dot-notation
    ? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
    : null

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

const K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    const arr = new Uint8Array(1)
    const proto = { foo: function () { return 42 } }
    Object.setPrototypeOf(proto, Uint8Array.prototype)
    Object.setPrototypeOf(arr, proto)
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  const buf = new Uint8Array(length)
  Object.setPrototypeOf(buf, Buffer.prototype)
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayView(value)
  }

  if (value == null) {
    throw new TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof SharedArrayBuffer !== 'undefined' &&
      (isInstance(value, SharedArrayBuffer) ||
      (value && isInstance(value.buffer, SharedArrayBuffer)))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  const valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  const b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(value[Symbol.toPrimitive]('string'), encodingOrOffset, length)
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype)
Object.setPrototypeOf(Buffer, Uint8Array)

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpreted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  const length = byteLength(string, encoding) | 0
  let buf = createBuffer(length)

  const actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  const length = array.length < 0 ? 0 : checked(array.length) | 0
  const buf = createBuffer(length)
  for (let i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayView (arrayView) {
  if (isInstance(arrayView, Uint8Array)) {
    const copy = new Uint8Array(arrayView)
    return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength)
  }
  return fromArrayLike(arrayView)
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  let buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(buf, Buffer.prototype)

  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    const len = checked(obj.length) | 0
    const buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  let x = a.length
  let y = b.length

  for (let i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  let i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  const buffer = Buffer.allocUnsafe(length)
  let pos = 0
  for (i = 0; i < list.length; ++i) {
    let buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      if (pos + buf.length > buffer.length) {
        if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf)
        buf.copy(buffer, pos)
      } else {
        Uint8Array.prototype.set.call(
          buffer,
          buf,
          pos
        )
      }
    } else if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    } else {
      buf.copy(buffer, pos)
    }
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  const len = string.length
  const mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  let loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  let loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  const i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  const len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (let i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  const len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (let i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  const len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (let i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  const length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  let str = ''
  const max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}
if (customInspectSymbol) {
  Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  let x = thisEnd - thisStart
  let y = end - start
  const len = Math.min(x, y)

  const thisCopy = this.slice(thisStart, thisEnd)
  const targetCopy = target.slice(start, end)

  for (let i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  let indexSize = 1
  let arrLength = arr.length
  let valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  let i
  if (dir) {
    let foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      let found = true
      for (let j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  const remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  const strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  let i
  for (i = 0; i < length; ++i) {
    const parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  const remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  let loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
      case 'latin1':
      case 'binary':
        return asciiWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  const res = []

  let i = start
  while (i < end) {
    const firstByte = buf[i]
    let codePoint = null
    let bytesPerSequence = (firstByte > 0xEF)
      ? 4
      : (firstByte > 0xDF)
          ? 3
          : (firstByte > 0xBF)
              ? 2
              : 1

    if (i + bytesPerSequence <= end) {
      let secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
const MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  const len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  let res = ''
  let i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  let ret = ''
  end = Math.min(buf.length, end)

  for (let i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  let ret = ''
  end = Math.min(buf.length, end)

  for (let i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  const len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  let out = ''
  for (let i = start; i < end; ++i) {
    out += hexSliceLookupTable[buf[i]]
  }
  return out
}

function utf16leSlice (buf, start, end) {
  const bytes = buf.slice(start, end)
  let res = ''
  // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
  for (let i = 0; i < bytes.length - 1; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  const len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  const newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(newBuf, Buffer.prototype)

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUintLE =
Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let val = this[offset]
  let mul = 1
  let i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUintBE =
Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  let val = this[offset + --byteLength]
  let mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUint8 =
Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUint16LE =
Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUint16BE =
Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUint32LE =
Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUint32BE =
Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const lo = first +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 24

  const hi = this[++offset] +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    last * 2 ** 24

  return BigInt(lo) + (BigInt(hi) << BigInt(32))
})

Buffer.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const hi = first * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    this[++offset]

  const lo = this[++offset] * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    last

  return (BigInt(hi) << BigInt(32)) + BigInt(lo)
})

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let val = this[offset]
  let mul = 1
  let i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let i = byteLength
  let mul = 1
  let val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  const val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  const val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const val = this[offset + 4] +
    this[offset + 5] * 2 ** 8 +
    this[offset + 6] * 2 ** 16 +
    (last << 24) // Overflow

  return (BigInt(val) << BigInt(32)) +
    BigInt(first +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 24)
})

Buffer.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const val = (first << 24) + // Overflow
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    this[++offset]

  return (BigInt(val) << BigInt(32)) +
    BigInt(this[++offset] * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    last)
})

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUintLE =
Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    const maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  let mul = 1
  let i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUintBE =
Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    const maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  let i = byteLength - 1
  let mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUint8 =
Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUint16LE =
Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUint16BE =
Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUint32LE =
Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUint32BE =
Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function wrtBigUInt64LE (buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7)

  let lo = Number(value & BigInt(0xffffffff))
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff))
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  return offset
}

function wrtBigUInt64BE (buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7)

  let lo = Number(value & BigInt(0xffffffff))
  buf[offset + 7] = lo
  lo = lo >> 8
  buf[offset + 6] = lo
  lo = lo >> 8
  buf[offset + 5] = lo
  lo = lo >> 8
  buf[offset + 4] = lo
  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff))
  buf[offset + 3] = hi
  hi = hi >> 8
  buf[offset + 2] = hi
  hi = hi >> 8
  buf[offset + 1] = hi
  hi = hi >> 8
  buf[offset] = hi
  return offset + 8
}

Buffer.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE (value, offset = 0) {
  return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
})

Buffer.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE (value, offset = 0) {
  return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
})

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    const limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  let i = 0
  let mul = 1
  let sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    const limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  let i = byteLength - 1
  let mul = 1
  let sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE (value, offset = 0) {
  return wrtBigUInt64LE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
})

Buffer.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE (value, offset = 0) {
  return wrtBigUInt64BE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
})

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  const len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      const code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  } else if (typeof val === 'boolean') {
    val = Number(val)
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  let i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    const bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    const len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// CUSTOM ERRORS
// =============

// Simplified versions from Node, changed for Buffer-only usage
const errors = {}
function E (sym, getMessage, Base) {
  errors[sym] = class NodeError extends Base {
    constructor () {
      super()

      Object.defineProperty(this, 'message', {
        value: getMessage.apply(this, arguments),
        writable: true,
        configurable: true
      })

      // Add the error code to the name to include it in the stack trace.
      this.name = `${this.name} [${sym}]`
      // Access the stack to generate the error message including the error code
      // from the name.
      this.stack // eslint-disable-line no-unused-expressions
      // Reset the name to the actual name.
      delete this.name
    }

    get code () {
      return sym
    }

    set code (value) {
      Object.defineProperty(this, 'code', {
        configurable: true,
        enumerable: true,
        value,
        writable: true
      })
    }

    toString () {
      return `${this.name} [${sym}]: ${this.message}`
    }
  }
}

E('ERR_BUFFER_OUT_OF_BOUNDS',
  function (name) {
    if (name) {
      return `${name} is outside of buffer bounds`
    }

    return 'Attempt to access memory outside buffer bounds'
  }, RangeError)
E('ERR_INVALID_ARG_TYPE',
  function (name, actual) {
    return `The "${name}" argument must be of type number. Received type ${typeof actual}`
  }, TypeError)
E('ERR_OUT_OF_RANGE',
  function (str, range, input) {
    let msg = `The value of "${str}" is out of range.`
    let received = input
    if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
      received = addNumericalSeparator(String(input))
    } else if (typeof input === 'bigint') {
      received = String(input)
      if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
        received = addNumericalSeparator(received)
      }
      received += 'n'
    }
    msg += ` It must be ${range}. Received ${received}`
    return msg
  }, RangeError)

function addNumericalSeparator (val) {
  let res = ''
  let i = val.length
  const start = val[0] === '-' ? 1 : 0
  for (; i >= start + 4; i -= 3) {
    res = `_${val.slice(i - 3, i)}${res}`
  }
  return `${val.slice(0, i)}${res}`
}

// CHECK FUNCTIONS
// ===============

function checkBounds (buf, offset, byteLength) {
  validateNumber(offset, 'offset')
  if (buf[offset] === undefined || buf[offset + byteLength] === undefined) {
    boundsError(offset, buf.length - (byteLength + 1))
  }
}

function checkIntBI (value, min, max, buf, offset, byteLength) {
  if (value > max || value < min) {
    const n = typeof min === 'bigint' ? 'n' : ''
    let range
    if (byteLength > 3) {
      if (min === 0 || min === BigInt(0)) {
        range = `>= 0${n} and < 2${n} ** ${(byteLength + 1) * 8}${n}`
      } else {
        range = `>= -(2${n} ** ${(byteLength + 1) * 8 - 1}${n}) and < 2 ** ` +
                `${(byteLength + 1) * 8 - 1}${n}`
      }
    } else {
      range = `>= ${min}${n} and <= ${max}${n}`
    }
    throw new errors.ERR_OUT_OF_RANGE('value', range, value)
  }
  checkBounds(buf, offset, byteLength)
}

function validateNumber (value, name) {
  if (typeof value !== 'number') {
    throw new errors.ERR_INVALID_ARG_TYPE(name, 'number', value)
  }
}

function boundsError (value, length, type) {
  if (Math.floor(value) !== value) {
    validateNumber(value, type)
    throw new errors.ERR_OUT_OF_RANGE(type || 'offset', 'an integer', value)
  }

  if (length < 0) {
    throw new errors.ERR_BUFFER_OUT_OF_BOUNDS()
  }

  throw new errors.ERR_OUT_OF_RANGE(type || 'offset',
                                    `>= ${type ? 1 : 0} and <= ${length}`,
                                    value)
}

// HELPER FUNCTIONS
// ================

const INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  let codePoint
  const length = string.length
  let leadSurrogate = null
  const bytes = []

  for (let i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  const byteArray = []
  for (let i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  let c, hi, lo
  const byteArray = []
  for (let i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  let i
  for (i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

// Create lookup table for `toString('hex')`
// See: https://github.com/feross/buffer/issues/219
const hexSliceLookupTable = (function () {
  const alphabet = '0123456789abcdef'
  const table = new Array(256)
  for (let i = 0; i < 16; ++i) {
    const i16 = i * 16
    for (let j = 0; j < 16; ++j) {
      table[i16 + j] = alphabet[i] + alphabet[j]
    }
  }
  return table
})()

// Return not function with Error if BigInt not supported
function defineBigIntMethod (fn) {
  return typeof BigInt === 'undefined' ? BufferBigIntNotDefined : fn
}

function BufferBigIntNotDefined () {
  throw new Error('BigInt not supported')
}


/***/ }),

/***/ "./src/addons/webapi/animationframe.ts":
/*!*********************************************!*\
  !*** ./src/addons/webapi/animationframe.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
let global_action_id = 0;
let current = /* @__PURE__ */ new Map();
let next = /* @__PURE__ */ new Map();
function cancelAnimationFrame(handle) {
  next.delete(handle);
}
function requestAnimationFrame(callback) {
  next.set(++global_action_id, callback);
  return global_action_id;
}
function tick(now) {
  let temp = current;
  current = next;
  next = temp;
  next.clear();
  for (const [_, action] of current) {
    action(now);
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  tick,
  exports: {
    requestAnimationFrame,
    cancelAnimationFrame
  }
});


/***/ }),

/***/ "./src/addons/webapi/event.ts":
/*!************************************!*\
  !*** ./src/addons/webapi/event.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Event: () => (/* binding */ Event),
/* harmony export */   EventTarget: () => (/* binding */ EventTarget),
/* harmony export */   Phase: () => (/* binding */ Phase),
/* harmony export */   ProgressEvent: () => (/* binding */ ProgressEvent),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var Phase = /* @__PURE__ */ ((Phase2) => {
  Phase2[Phase2["NONE"] = 0] = "NONE";
  Phase2[Phase2["CAPTURING_PHASE"] = 1] = "CAPTURING_PHASE";
  Phase2[Phase2["AT_TARGET"] = 2] = "AT_TARGET";
  Phase2[Phase2["BUBBLING_PHASE"] = 3] = "BUBBLING_PHASE";
  return Phase2;
})(Phase || {});
class Event {
  constructor(type, eventInitDict) {
    this.$type = type;
    if (eventInitDict) {
      this.$bubbles = eventInitDict.bubbles;
      this.$cancelable = eventInitDict.cancelable;
      this.$composed = eventInitDict.composed;
    }
  }
  /**
   * Returns true or false depending on how event was initialized. True if event goes through its target's ancestors in reverse tree order, and false otherwise.
   */
  get bubbles() {
    return this.$bubbles;
  }
  /**
   * Returns true or false depending on how event was initialized. Its return value does not always carry meaning, but true can indicate that part of the operation during which event was dispatched, can be canceled by invoking the preventDefault() method.
   */
  get cancelable() {
    return this.$cancelable;
  }
  /**
   * Returns true or false depending on how event was initialized. True if event invokes listeners past a ShadowRoot node that is the root of its target, and false otherwise.
   */
  get composed() {
    return this.$composed;
  }
  /**
   * Returns the object whose event listener's callback is currently being invoked.
   */
  get currentTarget() {
    return this.$currentTarget;
  }
  /**
   * Returns true if preventDefault() was invoked successfully to indicate cancelation, and false otherwise.
   */
  get defaultPrevented() {
    return this.$defaultPrevented == true;
  }
  /**
   * Returns the event's phase, which is one of NONE, CAPTURING_PHASE, AT_TARGET, and BUBBLING_PHASE.
   */
  get eventPhase() {
    return this.$eventPhase;
  }
  /**
   * Returns true if event was dispatched by the user agent, and false otherwise.
   */
  get isTrusted() {
    return this.$isTrusted;
  }
  /**
   * Returns the object to which event is dispatched (its target).
   */
  get target() {
    return this.$target;
  }
  /**
   * Returns the event's timestamp as the number of milliseconds measured relative to the time origin.
   */
  get timeStamp() {
    return this.$timeStamp;
  }
  /**
   * Returns the type of event, e.g. "click", "hashchange", or "submit".
   */
  get type() {
    return this.$type;
  }
  /**
   * Returns the invocation target objects of event's path (objects on which listeners will be invoked), except for any nodes in shadow trees of which the shadow root's mode is "closed" that are not reachable from event's currentTarget.
   */
  composedPath() {
    return [];
  }
  initEvent(type, bubbles, cancelable) {
    this.$type = type;
    this.$bubbles = bubbles;
    this.$cancelable = cancelable;
    this.$timeStamp = Date.now();
  }
  /**
   * If invoked when the cancelable attribute value is true, and while executing a listener for the event with passive set to false, signals to the operation that caused event to be dispatched that it needs to be canceled.
   */
  preventDefault() {
    if (this.cancelable) {
      this.$defaultPrevented = true;
    }
  }
  /**
   * Invoking this method prevents event from reaching any registered event listeners after the current one finishes running and, when dispatched in a tree, also prevents event from reaching any other objects.
   */
  stopImmediatePropagation() {
    this.$defaultPrevented = true;
    this.cancelBubble = false;
  }
  /**
   * When dispatched in a tree, invoking this method prevents event from reaching any objects other than the current object.
   */
  stopPropagation() {
    if (this.$bubbles) {
      this.cancelBubble = true;
    }
  }
}
class ProgressEvent extends Event {
  constructor(type, eventInitDict) {
    super(type, eventInitDict);
    if (eventInitDict) {
      this.$lengthComputable = eventInitDict.lengthComputable;
      this.$loaded = eventInitDict.loaded;
      this.$total = eventInitDict.total;
    }
  }
  get lengthComputable() {
    return this.$lengthComputable;
  }
  get loaded() {
    return this.$loaded;
  }
  get total() {
    return this.$total;
  }
}
class EventTarget {
  constructor() {
    this.$listeners = {};
  }
  /**
   * Appends an event listener for events whose type attribute value is type. The callback argument sets the callback that will be invoked when the event is dispatched.
   *
   * The options argument sets listener-specific options. For compatibility this can be a boolean, in which case the method behaves exactly as if the value was specified as options's capture.
   *
   * When set to true, options's capture prevents callback from being invoked when the event's eventPhase attribute value is BUBBLING_PHASE. When false (or not present), callback will not be invoked when event's eventPhase attribute value is CAPTURING_PHASE. Either way, callback will be invoked if event's eventPhase attribute value is AT_TARGET.
   *
   * When set to true, options's passive indicates that the callback will not cancel the event by invoking preventDefault(). This is used to enable performance optimizations described in § 2.8 Observing event listeners.
   *
   * When set to true, options's once indicates that the callback will only be invoked once after which the event listener will be removed.
   *
   * The event listener is appended to target's event listener list and is not appended if it has the same type, callback, and capture.
   */
  addEventListener(type, listener, options) {
    if (!listener)
      return;
    if (!(type in this.$listeners)) {
      this.$listeners[type] = [];
    }
    let recorder = { listener };
    if (typeof options === "boolean") {
      recorder.capture = options;
    } else if (typeof options === "object") {
      recorder = __spreadProps(__spreadValues({}, options), { listener });
    }
    this.$listeners[type].push(recorder);
  }
  /**
   * Dispatches a synthetic event event to target and returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise.
   */
  dispatchEvent(event) {
    if (!event || typeof event.type != "string")
      return true;
    const origin_recorders = this.$listeners[event.type];
    if (!origin_recorders)
      return true;
    const recorders = origin_recorders.slice();
    if (!recorders.length)
      return !event.defaultPrevented;
    event["$target"] = this;
    let once_listeners = [];
    for (const recorder of recorders) {
      let listener = null;
      if (recorder.listener.handleEvent) {
        listener = recorder.listener.handleEvent;
      } else {
        listener = recorder.listener;
      }
      if (typeof listener === "function") {
        listener.call(this, event);
      }
      if (recorder.once) {
        once_listeners.push(recorder);
      }
      if (event.defaultPrevented)
        break;
    }
    for (let i = 0; i < once_listeners.length; i++) {
      origin_recorders.splice(origin_recorders.indexOf(once_listeners[i]), 1);
    }
    return !event.defaultPrevented;
  }
  /**
   * Removes the event listener in target's event listener list with the same type, callback, and options.
   */
  removeEventListener(type, listener, options) {
    if (!listener || !(type in this.$listeners))
      return;
    const recorders = this.$listeners[type];
    for (let i = 0; i < recorders.length; i++) {
      const recorder = recorders[i];
      if (recorder.listener === listener) {
        let sameOptions = true;
        if (typeof options === "boolean") {
          sameOptions = recorder.capture == options;
        } else if (typeof options === "object") {
          sameOptions = recorder.capture == options.capture;
        }
        if (sameOptions) {
          recorders.splice(i, 1);
          break;
        }
      }
    }
  }
  /**
   * Removes the event listeners in target's event listener list with the same type
   *
   * Clear all listeners if type is `undefined`
   * */
  clearEventListeners(type) {
    if (typeof type === "string") {
      this.$listeners[type] = void 0;
    } else if (typeof type === "undefined") {
      this.$listeners = {};
    }
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  exports: {
    Phase,
    Event,
    ProgressEvent,
    EventTarget
  }
});


/***/ }),

/***/ "./src/addons/webapi/index.common.ts":
/*!*******************************************!*\
  !*** ./src/addons/webapi/index.common.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   finalize: () => (/* binding */ finalize),
/* harmony export */   initialize: () => (/* binding */ initialize),
/* harmony export */   tick: () => (/* binding */ tick)
/* harmony export */ });
let registered_modules = [];
function initialize(modules) {
  Object.defineProperty(globalThis, "window", { value: globalThis });
  for (const m of modules) {
    if (m.initialize)
      m.initialize();
    if (!m.exports)
      continue;
    for (const key in m.exports) {
      Object.defineProperty(window, key, { value: m.exports[key] });
    }
  }
  registered_modules = modules;
}
function finalize() {
  for (const m of registered_modules) {
    if (m.uninitialize)
      m.uninitialize();
  }
}
function tick() {
  for (const m of registered_modules) {
    if (m.tick && WebAPI.getHighResTimeStamp) {
      m.tick(WebAPI.getHighResTimeStamp());
    }
  }
}
Object.defineProperty(globalThis, "WebAPI", { value: {
  tick,
  finalize,
  getHighResTimeStamp: Date.now
} });


/***/ }),

/***/ "./src/addons/webapi/misc.unity.ts":
/*!*****************************************!*\
  !*** ./src/addons/webapi/misc.unity.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js")["Buffer"];
function btoa(text) {
  return Buffer.from(text).toString("base64");
}
function atob(base64) {
  return Buffer.from(base64, "base64").toString();
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  exports: {
    atob,
    btoa
  }
});


/***/ }),

/***/ "./src/addons/webapi/performance.ts":
/*!******************************************!*\
  !*** ./src/addons/webapi/performance.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _event__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./event */ "./src/addons/webapi/event.ts");

class PerformanceEntry {
  constructor(name, startTime, entryType, duration = 0) {
    this.startTime = startTime;
    this.name = name;
    this.entryType = entryType;
    this.duration = duration;
  }
  toJSON() {
    return {
      duration: this.duration,
      entryType: this.entryType,
      name: this.name,
      startTime: this.startTime
    };
  }
}
class PerformanceMark extends PerformanceEntry {
}
class PerformanceMeasure extends PerformanceEntry {
}
const MARK_TYPE = "mark";
const MEASURE_TYPE = "measure";
class Performance extends _event__WEBPACK_IMPORTED_MODULE_0__.EventTarget {
  constructor() {
    super();
    this._entries = /* @__PURE__ */ new Map();
    this.timeOrigin = Date.now();
  }
  now() {
    return Date.now() - this.timeOrigin;
  }
  getEntries() {
    let ret = [];
    for (const [type, list] of this._entries) {
      ret = ret.concat(list);
    }
    return ret;
  }
  getEntriesByName(name, type) {
    let ret = [];
    for (const [entryType, list] of this._entries) {
      if (type && type != entryType)
        continue;
      list.map((e) => {
        if (e.name == name) {
          ret.push(e);
        }
      });
    }
    return ret;
  }
  getEntriesByType(type) {
    return this._entries.get(type);
  }
  mark(markName) {
    const mark = new PerformanceMark(markName, this.now(), MARK_TYPE);
    let marks = this._entries.get(MARK_TYPE);
    if (!marks) {
      marks = [mark];
      this._entries.set(MARK_TYPE, marks);
    } else {
      marks.push(mark);
    }
    return mark;
  }
  measure(measureName, startMark, endMark) {
    let starts = this.getEntriesByName(startMark, MARK_TYPE);
    if (starts.length == 0)
      throw new Error(`The mark '${startMark}' does not exist.`);
    let ends = this.getEntriesByName(endMark, MARK_TYPE);
    if (ends.length == 0)
      throw new Error(`The mark '${endMark}' does not exist.`);
    const start = starts[starts.length - 1];
    const end = ends[ends.length - 1];
    const measure = new PerformanceMeasure(measureName, start.startTime, MEASURE_TYPE, end.startTime - start.startTime);
    let measures = this._entries.get(MEASURE_TYPE);
    if (!measures) {
      measures = [measure];
      this._entries.set(MEASURE_TYPE, measures);
    } else {
      measures.push(measure);
    }
    return measure;
  }
  clearMarks(markName) {
    let marks = this._entries.get(MARK_TYPE);
    if (marks) {
      marks = marks.filter((m) => m.name === markName);
      this._entries.set(MARK_TYPE, marks);
    }
  }
  clearMeasures(measureName) {
    let measures = this._entries.get(MARK_TYPE);
    if (measures) {
      measures = measures.filter((m) => m.name === measureName);
      this._entries.set(MEASURE_TYPE, measures);
    }
  }
  toJSON() {
    return {
      timeOrigin: this.timeOrigin
    };
  }
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  exports: {
    Performance,
    PerformanceEntry,
    PerformanceMark,
    PerformanceMeasure,
    performance: new Performance()
  }
});


/***/ }),

/***/ "./src/addons/webapi/storage.ts":
/*!**************************************!*\
  !*** ./src/addons/webapi/storage.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Storage: () => (/* binding */ Storage),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Storage {
  constructor() {
    this._items = [];
  }
  /**
   * Returns the number of key/value pairs currently present in the list associated with the object.
   */
  get length() {
    return this._items.length;
  }
  /**
   * Empties the list associated with the object of all key/value pairs, if there are any.
   */
  clear() {
    this._items = [];
    this.flush();
  }
  /**
   * Returns the current value associated with the given key, or null if the given key does not exist in the list associated with the object.
   */
  getItem(key) {
    for (const item of this._items) {
      if (item.key === key)
        return item.value;
    }
    return null;
  }
  /**
   * Returns the name of the nth key in the list, or null if n is greater than or equal to the number of key/value pairs in the object.
   */
  key(index) {
    for (let i = 0; i < this._items.length; i++) {
      if (i === index)
        return this._items[i].key;
    }
    return null;
  }
  /**
   * Removes the key/value pair with the given key from the list associated with the object, if a key/value pair with the given key exists.
   */
  removeItem(key) {
    let idx = -1;
    for (let i = 0; i < this._items.length; i++) {
      if (this._items[i].key === key) {
        idx = i;
        break;
      }
    }
    if (idx != -1) {
      this._items.splice(idx, 1);
      this.flush();
    }
  }
  /**
   * Sets the value of the pair identified by key to value, creating a new key/value pair if none existed for key previously.
   *
   * Throws a "QuotaExceededError" DOMException exception if the new value couldn't be set. (Setting could fail if, e.g., the user has disabled storage for the site, or if the quota has been exceeded.)
   */
  setItem(key, value) {
    let idx = -1;
    for (let i = 0; i < this._items.length; i++) {
      if (this._items[i].key === key) {
        idx = i;
        break;
      }
    }
    if (idx != -1) {
      if (this._items[idx].value != value) {
        this._items[idx].value = value;
        this.flush();
      }
    } else {
      this._items.push({ key, value });
      this.flush();
    }
  }
  flush() {
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  exports: {
    Storage,
    sessionStorage: new Storage()
  }
});


/***/ }),

/***/ "./src/addons/webapi/storage.unity.ts":
/*!********************************************!*\
  !*** ./src/addons/webapi/storage.unity.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var csharp__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! csharp */ "csharp");
/* harmony import */ var csharp__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(csharp__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./storage */ "./src/addons/webapi/storage.ts");


class LocalStorage extends _storage__WEBPACK_IMPORTED_MODULE_1__.Storage {
  constructor(file = `${csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Application.persistentDataPath}/webapi/localStorage.json`) {
    super();
    this.$file = file;
    this.$directory = csharp__WEBPACK_IMPORTED_MODULE_0__.System.IO.Path.GetDirectoryName(this.$file);
    if (csharp__WEBPACK_IMPORTED_MODULE_0__.System.IO.File.Exists(file)) {
      try {
        const stream = new csharp__WEBPACK_IMPORTED_MODULE_0__.System.IO.StreamReader(file);
        const text = stream.ReadToEnd();
        stream.Close();
        stream.Dispose();
        this._items = JSON.parse(text);
      } catch (error) {
        throw new Error("Cannot open storage file " + file);
      }
    }
  }
  flush() {
    if (!csharp__WEBPACK_IMPORTED_MODULE_0__.System.IO.File.Exists(this.$directory)) {
      csharp__WEBPACK_IMPORTED_MODULE_0__.System.IO.Directory.CreateDirectory(this.$directory);
    }
    const stream = new csharp__WEBPACK_IMPORTED_MODULE_0__.System.IO.StreamWriter(this.$file);
    if (stream) {
      let text = JSON.stringify(this._items, void 0, "	");
      stream.Write(text);
      stream.Flush();
      stream.Dispose();
    } else {
      throw new Error("Cannot open storage file " + this.$file);
    }
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  exports: {
    Storage: _storage__WEBPACK_IMPORTED_MODULE_1__.Storage,
    sessionStorage: new _storage__WEBPACK_IMPORTED_MODULE_1__.Storage(),
    localStorage: new LocalStorage()
  }
});


/***/ }),

/***/ "./src/addons/webapi/xhr/url.ts":
/*!**************************************!*\
  !*** ./src/addons/webapi/xhr/url.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   parse_url: () => (/* binding */ parse_url)
/* harmony export */ });
/* harmony import */ var url_parse__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! url-parse */ "./node_modules/url-parse/index.js");
/* harmony import */ var url_parse__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(url_parse__WEBPACK_IMPORTED_MODULE_0__);

function parse_url(url) {
  const ret = url_parse__WEBPACK_IMPORTED_MODULE_0___default()(url);
  Object.assign(ret, { url });
  return ret;
}


/***/ }),

/***/ "./src/addons/webapi/xhr/xhr.common.ts":
/*!*********************************************!*\
  !*** ./src/addons/webapi/xhr/xhr.common.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   XMLHttpRequestBase: () => (/* binding */ XMLHttpRequestBase),
/* harmony export */   XMLHttpRequestEventTarget: () => (/* binding */ XMLHttpRequestEventTarget),
/* harmony export */   XMLHttpRequestReadyState: () => (/* binding */ XMLHttpRequestReadyState),
/* harmony export */   XMLHttpRequestUpload: () => (/* binding */ XMLHttpRequestUpload)
/* harmony export */ });
/* harmony import */ var _event__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../event */ "./src/addons/webapi/event.ts");

class XMLHttpRequestEventTarget extends _event__WEBPACK_IMPORTED_MODULE_0__.EventTarget {
  addEventListener(type, listener, options) {
    super.addEventListener(type, listener, options);
  }
  removeEventListener(type, listener, options) {
    super.addEventListener(type, listener, options);
  }
}
class XMLHttpRequestUpload extends XMLHttpRequestEventTarget {
}
var XMLHttpRequestReadyState = /* @__PURE__ */ ((XMLHttpRequestReadyState2) => {
  XMLHttpRequestReadyState2[XMLHttpRequestReadyState2["UNSENT"] = 0] = "UNSENT";
  XMLHttpRequestReadyState2[XMLHttpRequestReadyState2["OPENED"] = 1] = "OPENED";
  XMLHttpRequestReadyState2[XMLHttpRequestReadyState2["HEADERS_RECEIVED"] = 2] = "HEADERS_RECEIVED";
  XMLHttpRequestReadyState2[XMLHttpRequestReadyState2["LOADING"] = 3] = "LOADING";
  XMLHttpRequestReadyState2[XMLHttpRequestReadyState2["DONE"] = 4] = "DONE";
  return XMLHttpRequestReadyState2;
})(XMLHttpRequestReadyState || {});
class XMLHttpRequestBase extends XMLHttpRequestEventTarget {
  constructor() {
    super(...arguments);
    this.$requestHeaders = {};
    this.$pollTicker = -1;
  }
  get url() {
    return this.$url;
  }
  /**
   * Returns client's state.
   */
  get readyState() {
    return this.$readyState;
  }
  set readyState(value) {
    if (value != this.$readyState) {
      this.$readyState = value;
      if (this.onreadystatechange) {
        let event = new _event__WEBPACK_IMPORTED_MODULE_0__.Event("readystatechange");
        this.onreadystatechange.call(this, event);
        this.dispatchEvent(event);
      }
    }
  }
  /**
   * Returns the response's body.
   */
  get response() {
    return this.$response;
  }
  /**
   * Returns the text response.
   *
   * Throws an "InvalidStateError" DOMException if responseType is not the empty string or "text".
   */
  get responseText() {
    return null;
  }
  get responseURL() {
    return null;
  }
  /**
   * Returns the document response.
   *
   * Throws an "InvalidStateError" DOMException if responseType is not the empty string or "document".
   */
  get responseXML() {
    return null;
  }
  get status() {
    return 0;
  }
  /**
   * Returns the associated XMLHttpRequestUpload object. It can be used to gather transmission information when data is transferred to a server.
   */
  get upload() {
    return this.$upload;
  }
  /**
   * Cancels any network activity.
   */
  abort() {
  }
  getAllResponseHeaders() {
    return "";
  }
  getResponseHeader(name) {
    return null;
  }
  /**
   * Sets the request method, request URL, and synchronous flag.
   *
   * Throws a "SyntaxError" DOMException if either method is not a valid HTTP method or url cannot be parsed.
   *
   * Throws a "SecurityError" DOMException if method is a case-insensitive match for `CONNECT`, `TRACE`, or `TRACK`.
   *
   * Throws an "InvalidAccessError" DOMException if async is false, current global object is a Window object, and the timeout attribute is not zero or the responseType attribute is not the empty string.
   */
  open(method, url, async, username, password) {
  }
  /**
   * Acts as if the `Content-Type` header value for response is mime. (It does not actually change the header though.)
   *
   * Throws an "InvalidStateError" DOMException if state is loading or done.
   */
  overrideMimeType(mime) {
    this.$overridedMime = mime;
  }
  /**
   * Initiates the request. The body argument provides the request body, if any, and is ignored if the request method is GET or HEAD.
   *
   * Throws an "InvalidStateError" DOMException if either state is not opened or the send() flag is set.
   */
  send(body) {
  }
  /**
   * Combines a header in author request headers.
   *
   * Throws an "InvalidStateError" DOMException if either state is not opened or the send() flag is set.
   *
   * Throws a "SyntaxError" DOMException if name is not a header name or if value is not a header value.
   */
  setRequestHeader(name, value) {
    this.$requestHeaders[name.toLowerCase()] = value;
  }
  addEventListener(type, listener, options) {
    super.addEventListener(type, listener, options);
  }
  removeEventListener(type, listener, options) {
    super.removeEventListener(type, listener, options);
  }
  $start_poll() {
    this.$stop_poll();
    const tick = this.$tick.bind(this);
    const tickLoop = () => {
      this.$pollTicker = requestAnimationFrame(tickLoop);
      tick();
    };
    this.$pollTicker = requestAnimationFrame(tickLoop);
    tick();
  }
  $stop_poll() {
    if (this.$pollTicker != -1) {
      cancelAnimationFrame(this.$pollTicker);
      this.$pollTicker = -1;
    }
  }
  $get_progress() {
    return {};
  }
  $dispatch_event(type) {
    let event = void 0;
    if (type === "progress") {
      let evt = new _event__WEBPACK_IMPORTED_MODULE_0__.ProgressEvent("progress", this.$get_progress());
      event = evt;
    } else {
      event = new _event__WEBPACK_IMPORTED_MODULE_0__.Event(type);
    }
    switch (type) {
      case "load":
        if (this.onload)
          this.onload.call(this, event);
        break;
      case "loadend":
        if (this.onloadend)
          this.onloadend.call(this, event);
        break;
      case "loadstart":
        if (this.onloadstart)
          this.onloadstart.call(this, event);
        break;
      case "progress":
        if (this.onprogress)
          this.onprogress.call(this, event);
        break;
      case "timeout":
        if (this.ontimeout)
          this.ontimeout.call(this, event);
        break;
      case "abort":
        if (this.onabort)
          this.onabort.call(this, event);
        break;
      case "error":
        if (this.onerror)
          this.onerror.call(this, event);
        break;
      default:
        break;
    }
    this.dispatchEvent(event);
  }
  $tick() {
  }
}


/***/ }),

/***/ "./src/addons/webapi/xhr/xhr.unity.ts":
/*!********************************************!*\
  !*** ./src/addons/webapi/xhr/xhr.unity.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var csharp__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! csharp */ "csharp");
/* harmony import */ var csharp__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(csharp__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var http_status_codes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! http-status-codes */ "./node_modules/http-status-codes/build/es/index.js");
/* harmony import */ var whatwg_mimetype__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! whatwg-mimetype */ "./node_modules/whatwg-mimetype/lib/mime-type.js");
/* harmony import */ var whatwg_mimetype__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(whatwg_mimetype__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _url__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./url */ "./src/addons/webapi/xhr/url.ts");
/* harmony import */ var _xhr_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./xhr.common */ "./src/addons/webapi/xhr/xhr.common.ts");





class UnityXMLHttpRequest extends _xhr_common__WEBPACK_IMPORTED_MODULE_3__.XMLHttpRequestBase {
  constructor() {
    super();
  }
  get url() {
    return this.$url;
  }
  get status() {
    return this.$status;
  }
  get responseURL() {
    if (this.url)
      return this.url.url;
    return null;
  }
  get responseXML() {
    return this.responseText;
  }
  get responseText() {
    if (this.$unityRequest && this.$unityRequest.downloadHandler) {
      return this.$unityRequest.downloadHandler.text;
    }
    return void 0;
  }
  getAllResponseHeaders() {
    let text = "";
    if (this.$internalResponsHeaders) {
      let enumerator = this.$internalResponsHeaders.GetEnumerator();
      while (enumerator.MoveNext()) {
        text += `${enumerator.Current.Key}: ${enumerator.Current.Value}\r
`;
      }
    }
    return text;
  }
  getResponseHeader(name) {
    if (this.$internalResponsHeaders) {
      if (this.$internalResponsHeaders.ContainsKey(name)) {
        return this.$internalResponsHeaders.get_Item(name);
      }
    }
    return void 0;
  }
  open(method, url, async, username, password) {
    this.$url = (0,_url__WEBPACK_IMPORTED_MODULE_2__.parse_url)(url);
    if (!this.url.port) {
      this.$url.port = this.url.protocal === "https" ? 443 : 80;
    }
    this.$method = method;
    this.$readyState = _xhr_common__WEBPACK_IMPORTED_MODULE_3__.XMLHttpRequestReadyState.UNSENT;
    this.$connectionStartAt = Date.now();
  }
  send(body) {
    const requestBody = body;
    switch (this.$method) {
      case "PUT":
        this.$unityRequest = csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Networking.UnityWebRequest.Put(this.$url.url, requestBody);
        break;
      case "POST":
        this.$unityRequest = csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Networking.UnityWebRequest.Put(this.$url.url, requestBody);
        this.$unityRequest.method = this.$method;
        break;
      case "GET":
        this.$unityRequest = csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Networking.UnityWebRequest.Get(this.$url.url);
        break;
      case "DELETE":
        this.$unityRequest = csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Networking.UnityWebRequest.Delete(this.$url.url);
        break;
      default:
        this.$unityRequest = new csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Networking.UnityWebRequest(this.$url.url, this.$method);
        break;
    }
    if (csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Networking.UnityWebRequest.certificateHandler) {
      this.$unityRequest.disposeCertificateHandlerOnDispose = false;
      this.$unityRequest.certificateHandler = csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Networking.UnityWebRequest.certificateHandler;
    }
    for (let key of Object.getOwnPropertyNames(this.$requestHeaders)) {
      const value = this.$requestHeaders[key];
      this.$unityRequest.SetRequestHeader(key, value);
    }
    if (typeof this.timeout === "number") {
      this.$timeoutUntil = Date.now() + this.timeout;
    }
    this.$internalRequest = this.$unityRequest.SendWebRequest();
    this.$dispatch_event("loadstart");
    this.$start_poll();
  }
  abort() {
    if (this.$unityRequest) {
      this.$unityRequest.Abort();
      this.$dispatch_event("abort");
      this.$stop_poll();
    }
  }
  $get_progress() {
    return {
      lengthComputable: this.$progress !== void 0,
      loaded: this.$progress,
      total: 1
    };
  }
  $tick() {
    if (this.$unityRequest) {
      this.$status = Number(this.$unityRequest.responseCode);
      if (this.$status) {
        this.readyState = _xhr_common__WEBPACK_IMPORTED_MODULE_3__.XMLHttpRequestReadyState.OPENED;
      }
      const now = Date.now();
      if (this.$timeoutUntil && now > this.$timeoutUntil) {
        this.$unityRequest.Abort();
        this.$dispatch_event("timeout");
        this.$finished_load();
        this.$status = http_status_codes__WEBPACK_IMPORTED_MODULE_4__["default"].REQUEST_TIMEOUT;
        return;
      }
      this.$status = Number(this.$unityRequest.responseCode) || http_status_codes__WEBPACK_IMPORTED_MODULE_4__["default"].CONTINUE;
      if (this.readyState === _xhr_common__WEBPACK_IMPORTED_MODULE_3__.XMLHttpRequestReadyState.OPENED) {
        this.$internalResponsHeaders = this.$unityRequest.GetResponseHeaders();
        if (this.$internalResponsHeaders && this.$internalResponsHeaders.Count) {
          this.readyState = _xhr_common__WEBPACK_IMPORTED_MODULE_3__.XMLHttpRequestReadyState.HEADERS_RECEIVED;
        }
      }
      if (this.readyState === _xhr_common__WEBPACK_IMPORTED_MODULE_3__.XMLHttpRequestReadyState.HEADERS_RECEIVED && this.$status == http_status_codes__WEBPACK_IMPORTED_MODULE_4__["default"].OK) {
        this.readyState = _xhr_common__WEBPACK_IMPORTED_MODULE_3__.XMLHttpRequestReadyState.LOADING;
      }
      if (this.$unityRequest.isDone || this.$unityRequest.result != csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Networking.UnityWebRequest.Result.InProgress) {
        this.$finished_load();
      } else if (this.$internalRequest) {
        const p = this.$internalRequest.progress;
        if (this.$progress !== p) {
          this.$progress = p;
          this.$dispatch_event("progress");
        }
      }
    }
  }
  $finished_load() {
    this.readyState = _xhr_common__WEBPACK_IMPORTED_MODULE_3__.XMLHttpRequestReadyState.DONE;
    if (this.$unityRequest.isDone || this.$unityRequest.result === csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Networking.UnityWebRequest.Result.DataProcessingError) {
      this.$internalResponsHeaders = this.$unityRequest.GetResponseHeaders();
      this.$process_response();
    }
    if (this.$unityRequest.result != csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Networking.UnityWebRequest.Result.Success) {
      this.$dispatch_event("error");
    } else {
      this.$progress = 1;
      this.$dispatch_event("progress");
      this.$dispatch_event("load");
    }
    this.$dispatch_event("loadend");
    this.$stop_poll();
    if (this.$unityRequest)
      this.$unityRequest.Dispose();
  }
  $process_response() {
    if (this.responseType === void 0) {
      const mime = new (whatwg_mimetype__WEBPACK_IMPORTED_MODULE_1___default())(this.$overridedMime || this.getResponseHeader("Content-Type") || "text/plain");
      if (mime.type === "application" && mime.subtype === "json") {
        this.responseType = "json";
      } else if (mime.type === "arraybuffer") {
        this.responseType = "arraybuffer";
      } else {
        this.responseType = "text";
      }
    }
    switch (this.responseType) {
      case "":
      case "document":
      case "text":
        this.$response = this.responseText;
        break;
      case "json":
        const text = this.responseText;
        if (text) {
          try {
            this.$response = JSON.parse(text);
          } catch (error) {
            this.responseType = "text";
            this.$response = text;
          }
        } else {
          this.$response = null;
        }
        break;
      case "arraybuffer":
        this.$response = this.$unityRequest.downloadHandler ? this.$unityRequest.downloadHandler.data : null;
      default:
        this.$response = null;
        break;
    }
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  exports: {
    XMLHttpRequestEventTarget: _xhr_common__WEBPACK_IMPORTED_MODULE_3__.XMLHttpRequestEventTarget,
    XMLHttpRequestReadyState: _xhr_common__WEBPACK_IMPORTED_MODULE_3__.XMLHttpRequestReadyState,
    XMLHttpRequestUpload: _xhr_common__WEBPACK_IMPORTED_MODULE_3__.XMLHttpRequestUpload,
    XMLHttpRequest: UnityXMLHttpRequest
  }
});


/***/ }),

/***/ "./node_modules/http-status-codes/build/es/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/http-status-codes/build/es/index.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ACCEPTED: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.ACCEPTED),
/* harmony export */   BAD_GATEWAY: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.BAD_GATEWAY),
/* harmony export */   BAD_REQUEST: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.BAD_REQUEST),
/* harmony export */   CONFLICT: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.CONFLICT),
/* harmony export */   CONTINUE: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.CONTINUE),
/* harmony export */   CREATED: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.CREATED),
/* harmony export */   EXPECTATION_FAILED: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.EXPECTATION_FAILED),
/* harmony export */   FAILED_DEPENDENCY: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.FAILED_DEPENDENCY),
/* harmony export */   FORBIDDEN: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.FORBIDDEN),
/* harmony export */   GATEWAY_TIMEOUT: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.GATEWAY_TIMEOUT),
/* harmony export */   GONE: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.GONE),
/* harmony export */   HTTP_VERSION_NOT_SUPPORTED: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.HTTP_VERSION_NOT_SUPPORTED),
/* harmony export */   IM_A_TEAPOT: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.IM_A_TEAPOT),
/* harmony export */   INSUFFICIENT_SPACE_ON_RESOURCE: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.INSUFFICIENT_SPACE_ON_RESOURCE),
/* harmony export */   INSUFFICIENT_STORAGE: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.INSUFFICIENT_STORAGE),
/* harmony export */   INTERNAL_SERVER_ERROR: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.INTERNAL_SERVER_ERROR),
/* harmony export */   LENGTH_REQUIRED: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.LENGTH_REQUIRED),
/* harmony export */   LOCKED: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.LOCKED),
/* harmony export */   METHOD_FAILURE: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.METHOD_FAILURE),
/* harmony export */   METHOD_NOT_ALLOWED: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.METHOD_NOT_ALLOWED),
/* harmony export */   MOVED_PERMANENTLY: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.MOVED_PERMANENTLY),
/* harmony export */   MOVED_TEMPORARILY: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.MOVED_TEMPORARILY),
/* harmony export */   MULTIPLE_CHOICES: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.MULTIPLE_CHOICES),
/* harmony export */   MULTI_STATUS: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.MULTI_STATUS),
/* harmony export */   NETWORK_AUTHENTICATION_REQUIRED: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.NETWORK_AUTHENTICATION_REQUIRED),
/* harmony export */   NON_AUTHORITATIVE_INFORMATION: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.NON_AUTHORITATIVE_INFORMATION),
/* harmony export */   NOT_ACCEPTABLE: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.NOT_ACCEPTABLE),
/* harmony export */   NOT_FOUND: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.NOT_FOUND),
/* harmony export */   NOT_IMPLEMENTED: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.NOT_IMPLEMENTED),
/* harmony export */   NOT_MODIFIED: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.NOT_MODIFIED),
/* harmony export */   NO_CONTENT: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.NO_CONTENT),
/* harmony export */   OK: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.OK),
/* harmony export */   PARTIAL_CONTENT: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.PARTIAL_CONTENT),
/* harmony export */   PAYMENT_REQUIRED: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.PAYMENT_REQUIRED),
/* harmony export */   PERMANENT_REDIRECT: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.PERMANENT_REDIRECT),
/* harmony export */   PRECONDITION_FAILED: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.PRECONDITION_FAILED),
/* harmony export */   PRECONDITION_REQUIRED: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.PRECONDITION_REQUIRED),
/* harmony export */   PROCESSING: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.PROCESSING),
/* harmony export */   PROXY_AUTHENTICATION_REQUIRED: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.PROXY_AUTHENTICATION_REQUIRED),
/* harmony export */   REQUESTED_RANGE_NOT_SATISFIABLE: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.REQUESTED_RANGE_NOT_SATISFIABLE),
/* harmony export */   REQUEST_HEADER_FIELDS_TOO_LARGE: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.REQUEST_HEADER_FIELDS_TOO_LARGE),
/* harmony export */   REQUEST_TIMEOUT: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.REQUEST_TIMEOUT),
/* harmony export */   REQUEST_TOO_LONG: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.REQUEST_TOO_LONG),
/* harmony export */   REQUEST_URI_TOO_LONG: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.REQUEST_URI_TOO_LONG),
/* harmony export */   RESET_CONTENT: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.RESET_CONTENT),
/* harmony export */   ReasonPhrases: () => (/* reexport safe */ _reason_phrases__WEBPACK_IMPORTED_MODULE_2__.ReasonPhrases),
/* harmony export */   SEE_OTHER: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.SEE_OTHER),
/* harmony export */   SERVICE_UNAVAILABLE: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.SERVICE_UNAVAILABLE),
/* harmony export */   SWITCHING_PROTOCOLS: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.SWITCHING_PROTOCOLS),
/* harmony export */   StatusCodes: () => (/* reexport safe */ _status_codes__WEBPACK_IMPORTED_MODULE_1__.StatusCodes),
/* harmony export */   TEMPORARY_REDIRECT: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.TEMPORARY_REDIRECT),
/* harmony export */   TOO_MANY_REQUESTS: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.TOO_MANY_REQUESTS),
/* harmony export */   UNAUTHORIZED: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.UNAUTHORIZED),
/* harmony export */   UNPROCESSABLE_ENTITY: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.UNPROCESSABLE_ENTITY),
/* harmony export */   UNSUPPORTED_MEDIA_TYPE: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.UNSUPPORTED_MEDIA_TYPE),
/* harmony export */   USE_PROXY: () => (/* reexport safe */ _legacy__WEBPACK_IMPORTED_MODULE_3__.USE_PROXY),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   getReasonPhrase: () => (/* reexport safe */ _utils_functions__WEBPACK_IMPORTED_MODULE_0__.getReasonPhrase),
/* harmony export */   getStatusCode: () => (/* reexport safe */ _utils_functions__WEBPACK_IMPORTED_MODULE_0__.getStatusCode),
/* harmony export */   getStatusText: () => (/* reexport safe */ _utils_functions__WEBPACK_IMPORTED_MODULE_0__.getStatusText)
/* harmony export */ });
/* harmony import */ var _legacy__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./legacy */ "./node_modules/http-status-codes/build/es/legacy.js");
/* harmony import */ var _utils_functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils-functions */ "./node_modules/http-status-codes/build/es/utils-functions.js");
/* harmony import */ var _status_codes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./status-codes */ "./node_modules/http-status-codes/build/es/status-codes.js");
/* harmony import */ var _reason_phrases__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./reason-phrases */ "./node_modules/http-status-codes/build/es/reason-phrases.js");
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};






/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__assign(__assign({}, _legacy__WEBPACK_IMPORTED_MODULE_3__["default"]), { getStatusCode: _utils_functions__WEBPACK_IMPORTED_MODULE_0__.getStatusCode,
    getStatusText: _utils_functions__WEBPACK_IMPORTED_MODULE_0__.getStatusText }));


/***/ }),

/***/ "./node_modules/http-status-codes/build/es/legacy.js":
/*!***********************************************************!*\
  !*** ./node_modules/http-status-codes/build/es/legacy.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ACCEPTED: () => (/* binding */ ACCEPTED),
/* harmony export */   BAD_GATEWAY: () => (/* binding */ BAD_GATEWAY),
/* harmony export */   BAD_REQUEST: () => (/* binding */ BAD_REQUEST),
/* harmony export */   CONFLICT: () => (/* binding */ CONFLICT),
/* harmony export */   CONTINUE: () => (/* binding */ CONTINUE),
/* harmony export */   CREATED: () => (/* binding */ CREATED),
/* harmony export */   EXPECTATION_FAILED: () => (/* binding */ EXPECTATION_FAILED),
/* harmony export */   FAILED_DEPENDENCY: () => (/* binding */ FAILED_DEPENDENCY),
/* harmony export */   FORBIDDEN: () => (/* binding */ FORBIDDEN),
/* harmony export */   GATEWAY_TIMEOUT: () => (/* binding */ GATEWAY_TIMEOUT),
/* harmony export */   GONE: () => (/* binding */ GONE),
/* harmony export */   HTTP_VERSION_NOT_SUPPORTED: () => (/* binding */ HTTP_VERSION_NOT_SUPPORTED),
/* harmony export */   IM_A_TEAPOT: () => (/* binding */ IM_A_TEAPOT),
/* harmony export */   INSUFFICIENT_SPACE_ON_RESOURCE: () => (/* binding */ INSUFFICIENT_SPACE_ON_RESOURCE),
/* harmony export */   INSUFFICIENT_STORAGE: () => (/* binding */ INSUFFICIENT_STORAGE),
/* harmony export */   INTERNAL_SERVER_ERROR: () => (/* binding */ INTERNAL_SERVER_ERROR),
/* harmony export */   LENGTH_REQUIRED: () => (/* binding */ LENGTH_REQUIRED),
/* harmony export */   LOCKED: () => (/* binding */ LOCKED),
/* harmony export */   METHOD_FAILURE: () => (/* binding */ METHOD_FAILURE),
/* harmony export */   METHOD_NOT_ALLOWED: () => (/* binding */ METHOD_NOT_ALLOWED),
/* harmony export */   MOVED_PERMANENTLY: () => (/* binding */ MOVED_PERMANENTLY),
/* harmony export */   MOVED_TEMPORARILY: () => (/* binding */ MOVED_TEMPORARILY),
/* harmony export */   MULTIPLE_CHOICES: () => (/* binding */ MULTIPLE_CHOICES),
/* harmony export */   MULTI_STATUS: () => (/* binding */ MULTI_STATUS),
/* harmony export */   NETWORK_AUTHENTICATION_REQUIRED: () => (/* binding */ NETWORK_AUTHENTICATION_REQUIRED),
/* harmony export */   NON_AUTHORITATIVE_INFORMATION: () => (/* binding */ NON_AUTHORITATIVE_INFORMATION),
/* harmony export */   NOT_ACCEPTABLE: () => (/* binding */ NOT_ACCEPTABLE),
/* harmony export */   NOT_FOUND: () => (/* binding */ NOT_FOUND),
/* harmony export */   NOT_IMPLEMENTED: () => (/* binding */ NOT_IMPLEMENTED),
/* harmony export */   NOT_MODIFIED: () => (/* binding */ NOT_MODIFIED),
/* harmony export */   NO_CONTENT: () => (/* binding */ NO_CONTENT),
/* harmony export */   OK: () => (/* binding */ OK),
/* harmony export */   PARTIAL_CONTENT: () => (/* binding */ PARTIAL_CONTENT),
/* harmony export */   PAYMENT_REQUIRED: () => (/* binding */ PAYMENT_REQUIRED),
/* harmony export */   PERMANENT_REDIRECT: () => (/* binding */ PERMANENT_REDIRECT),
/* harmony export */   PRECONDITION_FAILED: () => (/* binding */ PRECONDITION_FAILED),
/* harmony export */   PRECONDITION_REQUIRED: () => (/* binding */ PRECONDITION_REQUIRED),
/* harmony export */   PROCESSING: () => (/* binding */ PROCESSING),
/* harmony export */   PROXY_AUTHENTICATION_REQUIRED: () => (/* binding */ PROXY_AUTHENTICATION_REQUIRED),
/* harmony export */   REQUESTED_RANGE_NOT_SATISFIABLE: () => (/* binding */ REQUESTED_RANGE_NOT_SATISFIABLE),
/* harmony export */   REQUEST_HEADER_FIELDS_TOO_LARGE: () => (/* binding */ REQUEST_HEADER_FIELDS_TOO_LARGE),
/* harmony export */   REQUEST_TIMEOUT: () => (/* binding */ REQUEST_TIMEOUT),
/* harmony export */   REQUEST_TOO_LONG: () => (/* binding */ REQUEST_TOO_LONG),
/* harmony export */   REQUEST_URI_TOO_LONG: () => (/* binding */ REQUEST_URI_TOO_LONG),
/* harmony export */   RESET_CONTENT: () => (/* binding */ RESET_CONTENT),
/* harmony export */   SEE_OTHER: () => (/* binding */ SEE_OTHER),
/* harmony export */   SERVICE_UNAVAILABLE: () => (/* binding */ SERVICE_UNAVAILABLE),
/* harmony export */   SWITCHING_PROTOCOLS: () => (/* binding */ SWITCHING_PROTOCOLS),
/* harmony export */   TEMPORARY_REDIRECT: () => (/* binding */ TEMPORARY_REDIRECT),
/* harmony export */   TOO_MANY_REQUESTS: () => (/* binding */ TOO_MANY_REQUESTS),
/* harmony export */   UNAUTHORIZED: () => (/* binding */ UNAUTHORIZED),
/* harmony export */   UNPROCESSABLE_ENTITY: () => (/* binding */ UNPROCESSABLE_ENTITY),
/* harmony export */   UNSUPPORTED_MEDIA_TYPE: () => (/* binding */ UNSUPPORTED_MEDIA_TYPE),
/* harmony export */   USE_PROXY: () => (/* binding */ USE_PROXY),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Exporting constants directly to maintain compatability with v1
// These are deprecated. Please don't add any new codes here.
/**
 * @deprecated Please use StatusCodes.ACCEPTED
 *
 * */
var ACCEPTED = 202;
/**
 * @deprecated Please use StatusCodes.BAD_GATEWAY
 *
 * */
var BAD_GATEWAY = 502;
/**
 * @deprecated Please use StatusCodes.BAD_REQUEST
 *
 * */
var BAD_REQUEST = 400;
/**
 * @deprecated Please use StatusCodes.CONFLICT
 *
 * */
var CONFLICT = 409;
/**
 * @deprecated Please use StatusCodes.CONTINUE
 *
 * */
var CONTINUE = 100;
/**
 * @deprecated Please use StatusCodes.CREATED
 *
 * */
var CREATED = 201;
/**
 * @deprecated Please use StatusCodes.EXPECTATION_FAILED
 *
 * */
var EXPECTATION_FAILED = 417;
/**
 * @deprecated Please use StatusCodes.FAILED_DEPENDENCY
 *
 * */
var FAILED_DEPENDENCY = 424;
/**
 * @deprecated Please use StatusCodes.FORBIDDEN
 *
 * */
var FORBIDDEN = 403;
/**
 * @deprecated Please use StatusCodes.GATEWAY_TIMEOUT
 *
 * */
var GATEWAY_TIMEOUT = 504;
/**
 * @deprecated Please use StatusCodes.GONE
 *
 * */
var GONE = 410;
/**
 * @deprecated Please use StatusCodes.HTTP_VERSION_NOT_SUPPORTED
 *
 * */
var HTTP_VERSION_NOT_SUPPORTED = 505;
/**
 * @deprecated Please use StatusCodes.IM_A_TEAPOT
 *
 * */
var IM_A_TEAPOT = 418;
/**
 * @deprecated Please use StatusCodes.INSUFFICIENT_SPACE_ON_RESOURCE
 *
 * */
var INSUFFICIENT_SPACE_ON_RESOURCE = 419;
/**
 * @deprecated Please use StatusCodes.INSUFFICIENT_STORAGE
 *
 * */
var INSUFFICIENT_STORAGE = 507;
/**
 * @deprecated Please use StatusCodes.INTERNAL_SERVER_ERROR
 *
 * */
var INTERNAL_SERVER_ERROR = 500;
/**
 * @deprecated Please use StatusCodes.LENGTH_REQUIRED
 *
 * */
var LENGTH_REQUIRED = 411;
/**
 * @deprecated Please use StatusCodes.LOCKED
 *
 * */
var LOCKED = 423;
/**
 * @deprecated Please use StatusCodes.METHOD_FAILURE
 *
 * */
var METHOD_FAILURE = 420;
/**
 * @deprecated Please use StatusCodes.METHOD_NOT_ALLOWED
 *
 * */
var METHOD_NOT_ALLOWED = 405;
/**
 * @deprecated Please use StatusCodes.MOVED_PERMANENTLY
 *
 * */
var MOVED_PERMANENTLY = 301;
/**
 * @deprecated Please use StatusCodes.MOVED_TEMPORARILY
 *
 * */
var MOVED_TEMPORARILY = 302;
/**
 * @deprecated Please use StatusCodes.MULTI_STATUS
 *
 * */
var MULTI_STATUS = 207;
/**
 * @deprecated Please use StatusCodes.MULTIPLE_CHOICES
 *
 * */
var MULTIPLE_CHOICES = 300;
/**
 * @deprecated Please use StatusCodes.NETWORK_AUTHENTICATION_REQUIRED
 *
 * */
var NETWORK_AUTHENTICATION_REQUIRED = 511;
/**
 * @deprecated Please use StatusCodes.NO_CONTENT
 *
 * */
var NO_CONTENT = 204;
/**
 * @deprecated Please use StatusCodes.NON_AUTHORITATIVE_INFORMATION
 *
 * */
var NON_AUTHORITATIVE_INFORMATION = 203;
/**
 * @deprecated Please use StatusCodes.NOT_ACCEPTABLE
 *
 * */
var NOT_ACCEPTABLE = 406;
/**
 * @deprecated Please use StatusCodes.NOT_FOUND
 *
 * */
var NOT_FOUND = 404;
/**
 * @deprecated Please use StatusCodes.NOT_IMPLEMENTED
 *
 * */
var NOT_IMPLEMENTED = 501;
/**
 * @deprecated Please use StatusCodes.NOT_MODIFIED
 *
 * */
var NOT_MODIFIED = 304;
/**
 * @deprecated Please use StatusCodes.OK
 *
 * */
var OK = 200;
/**
 * @deprecated Please use StatusCodes.PARTIAL_CONTENT
 *
 * */
var PARTIAL_CONTENT = 206;
/**
 * @deprecated Please use StatusCodes.PAYMENT_REQUIRED
 *
 * */
var PAYMENT_REQUIRED = 402;
/**
 * @deprecated Please use StatusCodes.PERMANENT_REDIRECT
 *
 * */
var PERMANENT_REDIRECT = 308;
/**
 * @deprecated Please use StatusCodes.PRECONDITION_FAILED
 *
 * */
var PRECONDITION_FAILED = 412;
/**
 * @deprecated Please use StatusCodes.PRECONDITION_REQUIRED
 *
 * */
var PRECONDITION_REQUIRED = 428;
/**
 * @deprecated Please use StatusCodes.PROCESSING
 *
 * */
var PROCESSING = 102;
/**
 * @deprecated Please use StatusCodes.PROXY_AUTHENTICATION_REQUIRED
 *
 * */
var PROXY_AUTHENTICATION_REQUIRED = 407;
/**
 * @deprecated Please use StatusCodes.REQUEST_HEADER_FIELDS_TOO_LARGE
 *
 * */
var REQUEST_HEADER_FIELDS_TOO_LARGE = 431;
/**
 * @deprecated Please use StatusCodes.REQUEST_TIMEOUT
 *
 * */
var REQUEST_TIMEOUT = 408;
/**
 * @deprecated Please use StatusCodes.REQUEST_TOO_LONG
 *
 * */
var REQUEST_TOO_LONG = 413;
/**
 * @deprecated Please use StatusCodes.REQUEST_URI_TOO_LONG
 *
 * */
var REQUEST_URI_TOO_LONG = 414;
/**
 * @deprecated Please use StatusCodes.REQUESTED_RANGE_NOT_SATISFIABLE
 *
 * */
var REQUESTED_RANGE_NOT_SATISFIABLE = 416;
/**
 * @deprecated Please use StatusCodes.RESET_CONTENT
 *
 * */
var RESET_CONTENT = 205;
/**
 * @deprecated Please use StatusCodes.SEE_OTHER
 *
 * */
var SEE_OTHER = 303;
/**
 * @deprecated Please use StatusCodes.SERVICE_UNAVAILABLE
 *
 * */
var SERVICE_UNAVAILABLE = 503;
/**
 * @deprecated Please use StatusCodes.SWITCHING_PROTOCOLS
 *
 * */
var SWITCHING_PROTOCOLS = 101;
/**
 * @deprecated Please use StatusCodes.TEMPORARY_REDIRECT
 *
 * */
var TEMPORARY_REDIRECT = 307;
/**
 * @deprecated Please use StatusCodes.TOO_MANY_REQUESTS
 *
 * */
var TOO_MANY_REQUESTS = 429;
/**
 * @deprecated Please use StatusCodes.UNAUTHORIZED
 *
 * */
var UNAUTHORIZED = 401;
/**
 * @deprecated Please use StatusCodes.UNPROCESSABLE_ENTITY
 *
 * */
var UNPROCESSABLE_ENTITY = 422;
/**
 * @deprecated Please use StatusCodes.UNSUPPORTED_MEDIA_TYPE
 *
 * */
var UNSUPPORTED_MEDIA_TYPE = 415;
/**
 * @deprecated Please use StatusCodes.USE_PROXY
 *
 * */
var USE_PROXY = 305;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    ACCEPTED: ACCEPTED,
    BAD_GATEWAY: BAD_GATEWAY,
    BAD_REQUEST: BAD_REQUEST,
    CONFLICT: CONFLICT,
    CONTINUE: CONTINUE,
    CREATED: CREATED,
    EXPECTATION_FAILED: EXPECTATION_FAILED,
    FORBIDDEN: FORBIDDEN,
    GATEWAY_TIMEOUT: GATEWAY_TIMEOUT,
    GONE: GONE,
    HTTP_VERSION_NOT_SUPPORTED: HTTP_VERSION_NOT_SUPPORTED,
    IM_A_TEAPOT: IM_A_TEAPOT,
    INSUFFICIENT_SPACE_ON_RESOURCE: INSUFFICIENT_SPACE_ON_RESOURCE,
    INSUFFICIENT_STORAGE: INSUFFICIENT_STORAGE,
    INTERNAL_SERVER_ERROR: INTERNAL_SERVER_ERROR,
    LENGTH_REQUIRED: LENGTH_REQUIRED,
    LOCKED: LOCKED,
    METHOD_FAILURE: METHOD_FAILURE,
    METHOD_NOT_ALLOWED: METHOD_NOT_ALLOWED,
    MOVED_PERMANENTLY: MOVED_PERMANENTLY,
    MOVED_TEMPORARILY: MOVED_TEMPORARILY,
    MULTI_STATUS: MULTI_STATUS,
    MULTIPLE_CHOICES: MULTIPLE_CHOICES,
    NETWORK_AUTHENTICATION_REQUIRED: NETWORK_AUTHENTICATION_REQUIRED,
    NO_CONTENT: NO_CONTENT,
    NON_AUTHORITATIVE_INFORMATION: NON_AUTHORITATIVE_INFORMATION,
    NOT_ACCEPTABLE: NOT_ACCEPTABLE,
    NOT_FOUND: NOT_FOUND,
    NOT_IMPLEMENTED: NOT_IMPLEMENTED,
    NOT_MODIFIED: NOT_MODIFIED,
    OK: OK,
    PARTIAL_CONTENT: PARTIAL_CONTENT,
    PAYMENT_REQUIRED: PAYMENT_REQUIRED,
    PERMANENT_REDIRECT: PERMANENT_REDIRECT,
    PRECONDITION_FAILED: PRECONDITION_FAILED,
    PRECONDITION_REQUIRED: PRECONDITION_REQUIRED,
    PROCESSING: PROCESSING,
    PROXY_AUTHENTICATION_REQUIRED: PROXY_AUTHENTICATION_REQUIRED,
    REQUEST_HEADER_FIELDS_TOO_LARGE: REQUEST_HEADER_FIELDS_TOO_LARGE,
    REQUEST_TIMEOUT: REQUEST_TIMEOUT,
    REQUEST_TOO_LONG: REQUEST_TOO_LONG,
    REQUEST_URI_TOO_LONG: REQUEST_URI_TOO_LONG,
    REQUESTED_RANGE_NOT_SATISFIABLE: REQUESTED_RANGE_NOT_SATISFIABLE,
    RESET_CONTENT: RESET_CONTENT,
    SEE_OTHER: SEE_OTHER,
    SERVICE_UNAVAILABLE: SERVICE_UNAVAILABLE,
    SWITCHING_PROTOCOLS: SWITCHING_PROTOCOLS,
    TEMPORARY_REDIRECT: TEMPORARY_REDIRECT,
    TOO_MANY_REQUESTS: TOO_MANY_REQUESTS,
    UNAUTHORIZED: UNAUTHORIZED,
    UNPROCESSABLE_ENTITY: UNPROCESSABLE_ENTITY,
    UNSUPPORTED_MEDIA_TYPE: UNSUPPORTED_MEDIA_TYPE,
    USE_PROXY: USE_PROXY,
});


/***/ }),

/***/ "./node_modules/http-status-codes/build/es/reason-phrases.js":
/*!*******************************************************************!*\
  !*** ./node_modules/http-status-codes/build/es/reason-phrases.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ReasonPhrases: () => (/* binding */ ReasonPhrases)
/* harmony export */ });
// Generated file. Do not edit
var ReasonPhrases;
(function (ReasonPhrases) {
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.3
     *
     * The request has been received but not yet acted upon. It is non-committal, meaning that there is no way in HTTP to later send an asynchronous response indicating the outcome of processing the request. It is intended for cases where another process or server handles the request, or for batch processing.
     */
    ReasonPhrases["ACCEPTED"] = "Accepted";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.3
     *
     * This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response.
     */
    ReasonPhrases["BAD_GATEWAY"] = "Bad Gateway";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.1
     *
     * This response means that server could not understand the request due to invalid syntax.
     */
    ReasonPhrases["BAD_REQUEST"] = "Bad Request";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.8
     *
     * This response is sent when a request conflicts with the current state of the server.
     */
    ReasonPhrases["CONFLICT"] = "Conflict";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.2.1
     *
     * This interim response indicates that everything so far is OK and that the client should continue with the request or ignore it if it is already finished.
     */
    ReasonPhrases["CONTINUE"] = "Continue";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.2
     *
     * The request has succeeded and a new resource has been created as a result of it. This is typically the response sent after a PUT request.
     */
    ReasonPhrases["CREATED"] = "Created";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.14
     *
     * This response code means the expectation indicated by the Expect request header field can't be met by the server.
     */
    ReasonPhrases["EXPECTATION_FAILED"] = "Expectation Failed";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.5
     *
     * The request failed due to failure of a previous request.
     */
    ReasonPhrases["FAILED_DEPENDENCY"] = "Failed Dependency";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.3
     *
     * The client does not have access rights to the content, i.e. they are unauthorized, so server is rejecting to give proper response. Unlike 401, the client's identity is known to the server.
     */
    ReasonPhrases["FORBIDDEN"] = "Forbidden";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.5
     *
     * This error response is given when the server is acting as a gateway and cannot get a response in time.
     */
    ReasonPhrases["GATEWAY_TIMEOUT"] = "Gateway Timeout";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.9
     *
     * This response would be sent when the requested content has been permenantly deleted from server, with no forwarding address. Clients are expected to remove their caches and links to the resource. The HTTP specification intends this status code to be used for "limited-time, promotional services". APIs should not feel compelled to indicate resources that have been deleted with this status code.
     */
    ReasonPhrases["GONE"] = "Gone";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.6
     *
     * The HTTP version used in the request is not supported by the server.
     */
    ReasonPhrases["HTTP_VERSION_NOT_SUPPORTED"] = "HTTP Version Not Supported";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2324#section-2.3.2
     *
     * Any attempt to brew coffee with a teapot should result in the error code "418 I'm a teapot". The resulting entity body MAY be short and stout.
     */
    ReasonPhrases["IM_A_TEAPOT"] = "I'm a teapot";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.6
     *
     * The 507 (Insufficient Storage) status code means the method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request. This condition is considered to be temporary. If the request which received this status code was the result of a user action, the request MUST NOT be repeated until it is requested by a separate user action.
     */
    ReasonPhrases["INSUFFICIENT_SPACE_ON_RESOURCE"] = "Insufficient Space on Resource";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.6
     *
     * The server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process.
     */
    ReasonPhrases["INSUFFICIENT_STORAGE"] = "Insufficient Storage";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.1
     *
     * The server encountered an unexpected condition that prevented it from fulfilling the request.
     */
    ReasonPhrases["INTERNAL_SERVER_ERROR"] = "Internal Server Error";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.10
     *
     * The server rejected the request because the Content-Length header field is not defined and the server requires it.
     */
    ReasonPhrases["LENGTH_REQUIRED"] = "Length Required";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.4
     *
     * The resource that is being accessed is locked.
     */
    ReasonPhrases["LOCKED"] = "Locked";
    /**
     * @deprecated
     * Official Documentation @ https://tools.ietf.org/rfcdiff?difftype=--hwdiff&url2=draft-ietf-webdav-protocol-06.txt
     *
     * A deprecated response used by the Spring Framework when a method has failed.
     */
    ReasonPhrases["METHOD_FAILURE"] = "Method Failure";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.5
     *
     * The request method is known by the server but has been disabled and cannot be used. For example, an API may forbid DELETE-ing a resource. The two mandatory methods, GET and HEAD, must never be disabled and should not return this error code.
     */
    ReasonPhrases["METHOD_NOT_ALLOWED"] = "Method Not Allowed";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.2
     *
     * This response code means that URI of requested resource has been changed. Probably, new URI would be given in the response.
     */
    ReasonPhrases["MOVED_PERMANENTLY"] = "Moved Permanently";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.3
     *
     * This response code means that URI of requested resource has been changed temporarily. New changes in the URI might be made in the future. Therefore, this same URI should be used by the client in future requests.
     */
    ReasonPhrases["MOVED_TEMPORARILY"] = "Moved Temporarily";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.2
     *
     * A Multi-Status response conveys information about multiple resources in situations where multiple status codes might be appropriate.
     */
    ReasonPhrases["MULTI_STATUS"] = "Multi-Status";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.1
     *
     * The request has more than one possible responses. User-agent or user should choose one of them. There is no standardized way to choose one of the responses.
     */
    ReasonPhrases["MULTIPLE_CHOICES"] = "Multiple Choices";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-6
     *
     * The 511 status code indicates that the client needs to authenticate to gain network access.
     */
    ReasonPhrases["NETWORK_AUTHENTICATION_REQUIRED"] = "Network Authentication Required";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.5
     *
     * There is no content to send for this request, but the headers may be useful. The user-agent may update its cached headers for this resource with the new ones.
     */
    ReasonPhrases["NO_CONTENT"] = "No Content";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.4
     *
     * This response code means returned meta-information set is not exact set as available from the origin server, but collected from a local or a third party copy. Except this condition, 200 OK response should be preferred instead of this response.
     */
    ReasonPhrases["NON_AUTHORITATIVE_INFORMATION"] = "Non Authoritative Information";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.6
     *
     * This response is sent when the web server, after performing server-driven content negotiation, doesn't find any content following the criteria given by the user agent.
     */
    ReasonPhrases["NOT_ACCEPTABLE"] = "Not Acceptable";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.4
     *
     * The server can not find requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 to hide the existence of a resource from an unauthorized client. This response code is probably the most famous one due to its frequent occurence on the web.
     */
    ReasonPhrases["NOT_FOUND"] = "Not Found";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.2
     *
     * The request method is not supported by the server and cannot be handled. The only methods that servers are required to support (and therefore that must not return this code) are GET and HEAD.
     */
    ReasonPhrases["NOT_IMPLEMENTED"] = "Not Implemented";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7232#section-4.1
     *
     * This is used for caching purposes. It is telling to client that response has not been modified. So, client can continue to use same cached version of response.
     */
    ReasonPhrases["NOT_MODIFIED"] = "Not Modified";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.1
     *
     * The request has succeeded. The meaning of a success varies depending on the HTTP method:
     * GET: The resource has been fetched and is transmitted in the message body.
     * HEAD: The entity headers are in the message body.
     * POST: The resource describing the result of the action is transmitted in the message body.
     * TRACE: The message body contains the request message as received by the server
     */
    ReasonPhrases["OK"] = "OK";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7233#section-4.1
     *
     * This response code is used because of range header sent by the client to separate download into multiple streams.
     */
    ReasonPhrases["PARTIAL_CONTENT"] = "Partial Content";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.2
     *
     * This response code is reserved for future use. Initial aim for creating this code was using it for digital payment systems however this is not used currently.
     */
    ReasonPhrases["PAYMENT_REQUIRED"] = "Payment Required";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7538#section-3
     *
     * This means that the resource is now permanently located at another URI, specified by the Location: HTTP Response header. This has the same semantics as the 301 Moved Permanently HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request.
     */
    ReasonPhrases["PERMANENT_REDIRECT"] = "Permanent Redirect";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7232#section-4.2
     *
     * The client has indicated preconditions in its headers which the server does not meet.
     */
    ReasonPhrases["PRECONDITION_FAILED"] = "Precondition Failed";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-3
     *
     * The origin server requires the request to be conditional. Intended to prevent the 'lost update' problem, where a client GETs a resource's state, modifies it, and PUTs it back to the server, when meanwhile a third party has modified the state on the server, leading to a conflict.
     */
    ReasonPhrases["PRECONDITION_REQUIRED"] = "Precondition Required";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.1
     *
     * This code indicates that the server has received and is processing the request, but no response is available yet.
     */
    ReasonPhrases["PROCESSING"] = "Processing";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7235#section-3.2
     *
     * This is similar to 401 but authentication is needed to be done by a proxy.
     */
    ReasonPhrases["PROXY_AUTHENTICATION_REQUIRED"] = "Proxy Authentication Required";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-5
     *
     * The server is unwilling to process the request because its header fields are too large. The request MAY be resubmitted after reducing the size of the request header fields.
     */
    ReasonPhrases["REQUEST_HEADER_FIELDS_TOO_LARGE"] = "Request Header Fields Too Large";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.7
     *
     * This response is sent on an idle connection by some servers, even without any previous request by the client. It means that the server would like to shut down this unused connection. This response is used much more since some browsers, like Chrome, Firefox 27+, or IE9, use HTTP pre-connection mechanisms to speed up surfing. Also note that some servers merely shut down the connection without sending this message.
     */
    ReasonPhrases["REQUEST_TIMEOUT"] = "Request Timeout";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.11
     *
     * Request entity is larger than limits defined by server; the server might close the connection or return an Retry-After header field.
     */
    ReasonPhrases["REQUEST_TOO_LONG"] = "Request Entity Too Large";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.12
     *
     * The URI requested by the client is longer than the server is willing to interpret.
     */
    ReasonPhrases["REQUEST_URI_TOO_LONG"] = "Request-URI Too Long";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7233#section-4.4
     *
     * The range specified by the Range header field in the request can't be fulfilled; it's possible that the range is outside the size of the target URI's data.
     */
    ReasonPhrases["REQUESTED_RANGE_NOT_SATISFIABLE"] = "Requested Range Not Satisfiable";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.6
     *
     * This response code is sent after accomplishing request to tell user agent reset document view which sent this request.
     */
    ReasonPhrases["RESET_CONTENT"] = "Reset Content";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.4
     *
     * Server sent this response to directing client to get requested resource to another URI with an GET request.
     */
    ReasonPhrases["SEE_OTHER"] = "See Other";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.4
     *
     * The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded. Note that together with this response, a user-friendly page explaining the problem should be sent. This responses should be used for temporary conditions and the Retry-After: HTTP header should, if possible, contain the estimated time before the recovery of the service. The webmaster must also take care about the caching-related headers that are sent along with this response, as these temporary condition responses should usually not be cached.
     */
    ReasonPhrases["SERVICE_UNAVAILABLE"] = "Service Unavailable";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.2.2
     *
     * This code is sent in response to an Upgrade request header by the client, and indicates the protocol the server is switching too.
     */
    ReasonPhrases["SWITCHING_PROTOCOLS"] = "Switching Protocols";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.7
     *
     * Server sent this response to directing client to get requested resource to another URI with same method that used prior request. This has the same semantic than the 302 Found HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request.
     */
    ReasonPhrases["TEMPORARY_REDIRECT"] = "Temporary Redirect";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-4
     *
     * The user has sent too many requests in a given amount of time ("rate limiting").
     */
    ReasonPhrases["TOO_MANY_REQUESTS"] = "Too Many Requests";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7235#section-3.1
     *
     * Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.
     */
    ReasonPhrases["UNAUTHORIZED"] = "Unauthorized";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7725
     *
     * The user-agent requested a resource that cannot legally be provided, such as a web page censored by a government.
     */
    ReasonPhrases["UNAVAILABLE_FOR_LEGAL_REASONS"] = "Unavailable For Legal Reasons";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.3
     *
     * The request was well-formed but was unable to be followed due to semantic errors.
     */
    ReasonPhrases["UNPROCESSABLE_ENTITY"] = "Unprocessable Entity";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.13
     *
     * The media format of the requested data is not supported by the server, so the server is rejecting the request.
     */
    ReasonPhrases["UNSUPPORTED_MEDIA_TYPE"] = "Unsupported Media Type";
    /**
     * @deprecated
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.6
     *
     * Was defined in a previous version of the HTTP specification to indicate that a requested response must be accessed by a proxy. It has been deprecated due to security concerns regarding in-band configuration of a proxy.
     */
    ReasonPhrases["USE_PROXY"] = "Use Proxy";
    /**
     * Official Documentation @ https://datatracker.ietf.org/doc/html/rfc7540#section-9.1.2
     *
     * Defined in the specification of HTTP/2 to indicate that a server is not able to produce a response for the combination of scheme and authority that are included in the request URI.
     */
    ReasonPhrases["MISDIRECTED_REQUEST"] = "Misdirected Request";
})(ReasonPhrases || (ReasonPhrases = {}));


/***/ }),

/***/ "./node_modules/http-status-codes/build/es/status-codes.js":
/*!*****************************************************************!*\
  !*** ./node_modules/http-status-codes/build/es/status-codes.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StatusCodes: () => (/* binding */ StatusCodes)
/* harmony export */ });
// Generated file. Do not edit
var StatusCodes;
(function (StatusCodes) {
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.3
     *
     * The request has been received but not yet acted upon. It is non-committal, meaning that there is no way in HTTP to later send an asynchronous response indicating the outcome of processing the request. It is intended for cases where another process or server handles the request, or for batch processing.
     */
    StatusCodes[StatusCodes["ACCEPTED"] = 202] = "ACCEPTED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.3
     *
     * This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response.
     */
    StatusCodes[StatusCodes["BAD_GATEWAY"] = 502] = "BAD_GATEWAY";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.1
     *
     * This response means that server could not understand the request due to invalid syntax.
     */
    StatusCodes[StatusCodes["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.8
     *
     * This response is sent when a request conflicts with the current state of the server.
     */
    StatusCodes[StatusCodes["CONFLICT"] = 409] = "CONFLICT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.2.1
     *
     * This interim response indicates that everything so far is OK and that the client should continue with the request or ignore it if it is already finished.
     */
    StatusCodes[StatusCodes["CONTINUE"] = 100] = "CONTINUE";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.2
     *
     * The request has succeeded and a new resource has been created as a result of it. This is typically the response sent after a PUT request.
     */
    StatusCodes[StatusCodes["CREATED"] = 201] = "CREATED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.14
     *
     * This response code means the expectation indicated by the Expect request header field can't be met by the server.
     */
    StatusCodes[StatusCodes["EXPECTATION_FAILED"] = 417] = "EXPECTATION_FAILED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.5
     *
     * The request failed due to failure of a previous request.
     */
    StatusCodes[StatusCodes["FAILED_DEPENDENCY"] = 424] = "FAILED_DEPENDENCY";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.3
     *
     * The client does not have access rights to the content, i.e. they are unauthorized, so server is rejecting to give proper response. Unlike 401, the client's identity is known to the server.
     */
    StatusCodes[StatusCodes["FORBIDDEN"] = 403] = "FORBIDDEN";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.5
     *
     * This error response is given when the server is acting as a gateway and cannot get a response in time.
     */
    StatusCodes[StatusCodes["GATEWAY_TIMEOUT"] = 504] = "GATEWAY_TIMEOUT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.9
     *
     * This response would be sent when the requested content has been permenantly deleted from server, with no forwarding address. Clients are expected to remove their caches and links to the resource. The HTTP specification intends this status code to be used for "limited-time, promotional services". APIs should not feel compelled to indicate resources that have been deleted with this status code.
     */
    StatusCodes[StatusCodes["GONE"] = 410] = "GONE";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.6
     *
     * The HTTP version used in the request is not supported by the server.
     */
    StatusCodes[StatusCodes["HTTP_VERSION_NOT_SUPPORTED"] = 505] = "HTTP_VERSION_NOT_SUPPORTED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2324#section-2.3.2
     *
     * Any attempt to brew coffee with a teapot should result in the error code "418 I'm a teapot". The resulting entity body MAY be short and stout.
     */
    StatusCodes[StatusCodes["IM_A_TEAPOT"] = 418] = "IM_A_TEAPOT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.6
     *
     * The 507 (Insufficient Storage) status code means the method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request. This condition is considered to be temporary. If the request which received this status code was the result of a user action, the request MUST NOT be repeated until it is requested by a separate user action.
     */
    StatusCodes[StatusCodes["INSUFFICIENT_SPACE_ON_RESOURCE"] = 419] = "INSUFFICIENT_SPACE_ON_RESOURCE";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.6
     *
     * The server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process.
     */
    StatusCodes[StatusCodes["INSUFFICIENT_STORAGE"] = 507] = "INSUFFICIENT_STORAGE";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.1
     *
     * The server encountered an unexpected condition that prevented it from fulfilling the request.
     */
    StatusCodes[StatusCodes["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.10
     *
     * The server rejected the request because the Content-Length header field is not defined and the server requires it.
     */
    StatusCodes[StatusCodes["LENGTH_REQUIRED"] = 411] = "LENGTH_REQUIRED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.4
     *
     * The resource that is being accessed is locked.
     */
    StatusCodes[StatusCodes["LOCKED"] = 423] = "LOCKED";
    /**
     * @deprecated
     * Official Documentation @ https://tools.ietf.org/rfcdiff?difftype=--hwdiff&url2=draft-ietf-webdav-protocol-06.txt
     *
     * A deprecated response used by the Spring Framework when a method has failed.
     */
    StatusCodes[StatusCodes["METHOD_FAILURE"] = 420] = "METHOD_FAILURE";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.5
     *
     * The request method is known by the server but has been disabled and cannot be used. For example, an API may forbid DELETE-ing a resource. The two mandatory methods, GET and HEAD, must never be disabled and should not return this error code.
     */
    StatusCodes[StatusCodes["METHOD_NOT_ALLOWED"] = 405] = "METHOD_NOT_ALLOWED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.2
     *
     * This response code means that URI of requested resource has been changed. Probably, new URI would be given in the response.
     */
    StatusCodes[StatusCodes["MOVED_PERMANENTLY"] = 301] = "MOVED_PERMANENTLY";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.3
     *
     * This response code means that URI of requested resource has been changed temporarily. New changes in the URI might be made in the future. Therefore, this same URI should be used by the client in future requests.
     */
    StatusCodes[StatusCodes["MOVED_TEMPORARILY"] = 302] = "MOVED_TEMPORARILY";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.2
     *
     * A Multi-Status response conveys information about multiple resources in situations where multiple status codes might be appropriate.
     */
    StatusCodes[StatusCodes["MULTI_STATUS"] = 207] = "MULTI_STATUS";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.1
     *
     * The request has more than one possible responses. User-agent or user should choose one of them. There is no standardized way to choose one of the responses.
     */
    StatusCodes[StatusCodes["MULTIPLE_CHOICES"] = 300] = "MULTIPLE_CHOICES";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-6
     *
     * The 511 status code indicates that the client needs to authenticate to gain network access.
     */
    StatusCodes[StatusCodes["NETWORK_AUTHENTICATION_REQUIRED"] = 511] = "NETWORK_AUTHENTICATION_REQUIRED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.5
     *
     * There is no content to send for this request, but the headers may be useful. The user-agent may update its cached headers for this resource with the new ones.
     */
    StatusCodes[StatusCodes["NO_CONTENT"] = 204] = "NO_CONTENT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.4
     *
     * This response code means returned meta-information set is not exact set as available from the origin server, but collected from a local or a third party copy. Except this condition, 200 OK response should be preferred instead of this response.
     */
    StatusCodes[StatusCodes["NON_AUTHORITATIVE_INFORMATION"] = 203] = "NON_AUTHORITATIVE_INFORMATION";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.6
     *
     * This response is sent when the web server, after performing server-driven content negotiation, doesn't find any content following the criteria given by the user agent.
     */
    StatusCodes[StatusCodes["NOT_ACCEPTABLE"] = 406] = "NOT_ACCEPTABLE";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.4
     *
     * The server can not find requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 to hide the existence of a resource from an unauthorized client. This response code is probably the most famous one due to its frequent occurence on the web.
     */
    StatusCodes[StatusCodes["NOT_FOUND"] = 404] = "NOT_FOUND";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.2
     *
     * The request method is not supported by the server and cannot be handled. The only methods that servers are required to support (and therefore that must not return this code) are GET and HEAD.
     */
    StatusCodes[StatusCodes["NOT_IMPLEMENTED"] = 501] = "NOT_IMPLEMENTED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7232#section-4.1
     *
     * This is used for caching purposes. It is telling to client that response has not been modified. So, client can continue to use same cached version of response.
     */
    StatusCodes[StatusCodes["NOT_MODIFIED"] = 304] = "NOT_MODIFIED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.1
     *
     * The request has succeeded. The meaning of a success varies depending on the HTTP method:
     * GET: The resource has been fetched and is transmitted in the message body.
     * HEAD: The entity headers are in the message body.
     * POST: The resource describing the result of the action is transmitted in the message body.
     * TRACE: The message body contains the request message as received by the server
     */
    StatusCodes[StatusCodes["OK"] = 200] = "OK";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7233#section-4.1
     *
     * This response code is used because of range header sent by the client to separate download into multiple streams.
     */
    StatusCodes[StatusCodes["PARTIAL_CONTENT"] = 206] = "PARTIAL_CONTENT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.2
     *
     * This response code is reserved for future use. Initial aim for creating this code was using it for digital payment systems however this is not used currently.
     */
    StatusCodes[StatusCodes["PAYMENT_REQUIRED"] = 402] = "PAYMENT_REQUIRED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7538#section-3
     *
     * This means that the resource is now permanently located at another URI, specified by the Location: HTTP Response header. This has the same semantics as the 301 Moved Permanently HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request.
     */
    StatusCodes[StatusCodes["PERMANENT_REDIRECT"] = 308] = "PERMANENT_REDIRECT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7232#section-4.2
     *
     * The client has indicated preconditions in its headers which the server does not meet.
     */
    StatusCodes[StatusCodes["PRECONDITION_FAILED"] = 412] = "PRECONDITION_FAILED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-3
     *
     * The origin server requires the request to be conditional. Intended to prevent the 'lost update' problem, where a client GETs a resource's state, modifies it, and PUTs it back to the server, when meanwhile a third party has modified the state on the server, leading to a conflict.
     */
    StatusCodes[StatusCodes["PRECONDITION_REQUIRED"] = 428] = "PRECONDITION_REQUIRED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.1
     *
     * This code indicates that the server has received and is processing the request, but no response is available yet.
     */
    StatusCodes[StatusCodes["PROCESSING"] = 102] = "PROCESSING";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7235#section-3.2
     *
     * This is similar to 401 but authentication is needed to be done by a proxy.
     */
    StatusCodes[StatusCodes["PROXY_AUTHENTICATION_REQUIRED"] = 407] = "PROXY_AUTHENTICATION_REQUIRED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-5
     *
     * The server is unwilling to process the request because its header fields are too large. The request MAY be resubmitted after reducing the size of the request header fields.
     */
    StatusCodes[StatusCodes["REQUEST_HEADER_FIELDS_TOO_LARGE"] = 431] = "REQUEST_HEADER_FIELDS_TOO_LARGE";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.7
     *
     * This response is sent on an idle connection by some servers, even without any previous request by the client. It means that the server would like to shut down this unused connection. This response is used much more since some browsers, like Chrome, Firefox 27+, or IE9, use HTTP pre-connection mechanisms to speed up surfing. Also note that some servers merely shut down the connection without sending this message.
     */
    StatusCodes[StatusCodes["REQUEST_TIMEOUT"] = 408] = "REQUEST_TIMEOUT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.11
     *
     * Request entity is larger than limits defined by server; the server might close the connection or return an Retry-After header field.
     */
    StatusCodes[StatusCodes["REQUEST_TOO_LONG"] = 413] = "REQUEST_TOO_LONG";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.12
     *
     * The URI requested by the client is longer than the server is willing to interpret.
     */
    StatusCodes[StatusCodes["REQUEST_URI_TOO_LONG"] = 414] = "REQUEST_URI_TOO_LONG";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7233#section-4.4
     *
     * The range specified by the Range header field in the request can't be fulfilled; it's possible that the range is outside the size of the target URI's data.
     */
    StatusCodes[StatusCodes["REQUESTED_RANGE_NOT_SATISFIABLE"] = 416] = "REQUESTED_RANGE_NOT_SATISFIABLE";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.6
     *
     * This response code is sent after accomplishing request to tell user agent reset document view which sent this request.
     */
    StatusCodes[StatusCodes["RESET_CONTENT"] = 205] = "RESET_CONTENT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.4
     *
     * Server sent this response to directing client to get requested resource to another URI with an GET request.
     */
    StatusCodes[StatusCodes["SEE_OTHER"] = 303] = "SEE_OTHER";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.4
     *
     * The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded. Note that together with this response, a user-friendly page explaining the problem should be sent. This responses should be used for temporary conditions and the Retry-After: HTTP header should, if possible, contain the estimated time before the recovery of the service. The webmaster must also take care about the caching-related headers that are sent along with this response, as these temporary condition responses should usually not be cached.
     */
    StatusCodes[StatusCodes["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.2.2
     *
     * This code is sent in response to an Upgrade request header by the client, and indicates the protocol the server is switching too.
     */
    StatusCodes[StatusCodes["SWITCHING_PROTOCOLS"] = 101] = "SWITCHING_PROTOCOLS";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.7
     *
     * Server sent this response to directing client to get requested resource to another URI with same method that used prior request. This has the same semantic than the 302 Found HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request.
     */
    StatusCodes[StatusCodes["TEMPORARY_REDIRECT"] = 307] = "TEMPORARY_REDIRECT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-4
     *
     * The user has sent too many requests in a given amount of time ("rate limiting").
     */
    StatusCodes[StatusCodes["TOO_MANY_REQUESTS"] = 429] = "TOO_MANY_REQUESTS";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7235#section-3.1
     *
     * Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.
     */
    StatusCodes[StatusCodes["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7725
     *
     * The user-agent requested a resource that cannot legally be provided, such as a web page censored by a government.
     */
    StatusCodes[StatusCodes["UNAVAILABLE_FOR_LEGAL_REASONS"] = 451] = "UNAVAILABLE_FOR_LEGAL_REASONS";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.3
     *
     * The request was well-formed but was unable to be followed due to semantic errors.
     */
    StatusCodes[StatusCodes["UNPROCESSABLE_ENTITY"] = 422] = "UNPROCESSABLE_ENTITY";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.13
     *
     * The media format of the requested data is not supported by the server, so the server is rejecting the request.
     */
    StatusCodes[StatusCodes["UNSUPPORTED_MEDIA_TYPE"] = 415] = "UNSUPPORTED_MEDIA_TYPE";
    /**
     * @deprecated
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.6
     *
     * Was defined in a previous version of the HTTP specification to indicate that a requested response must be accessed by a proxy. It has been deprecated due to security concerns regarding in-band configuration of a proxy.
     */
    StatusCodes[StatusCodes["USE_PROXY"] = 305] = "USE_PROXY";
    /**
     * Official Documentation @ https://datatracker.ietf.org/doc/html/rfc7540#section-9.1.2
     *
     * Defined in the specification of HTTP/2 to indicate that a server is not able to produce a response for the combination of scheme and authority that are included in the request URI.
     */
    StatusCodes[StatusCodes["MISDIRECTED_REQUEST"] = 421] = "MISDIRECTED_REQUEST";
})(StatusCodes || (StatusCodes = {}));


/***/ }),

/***/ "./node_modules/http-status-codes/build/es/utils-functions.js":
/*!********************************************************************!*\
  !*** ./node_modules/http-status-codes/build/es/utils-functions.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getReasonPhrase: () => (/* binding */ getReasonPhrase),
/* harmony export */   getStatusCode: () => (/* binding */ getStatusCode),
/* harmony export */   getStatusText: () => (/* binding */ getStatusText)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./node_modules/http-status-codes/build/es/utils.js");

/**
 * Returns the reason phrase for the given status code.
 * If the given status code does not exist, an error is thrown.
 *
 * @param {number|string} statusCode The HTTP status code
 * @returns {string} The associated reason phrase (e.g. "Bad Request", "OK")
 * */
function getReasonPhrase(statusCode) {
    var result = _utils__WEBPACK_IMPORTED_MODULE_0__.statusCodeToReasonPhrase[statusCode.toString()];
    if (!result) {
        throw new Error("Status code does not exist: " + statusCode);
    }
    return result;
}
/**
 * Returns the status code for the given reason phrase.
 * If the given reason phrase does not exist, undefined is returned.
 *
 * @param {string} reasonPhrase The HTTP reason phrase (e.g. "Bad Request", "OK")
 * @returns {string} The associated status code
 * */
function getStatusCode(reasonPhrase) {
    var result = _utils__WEBPACK_IMPORTED_MODULE_0__.reasonPhraseToStatusCode[reasonPhrase];
    if (!result) {
        throw new Error("Reason phrase does not exist: " + reasonPhrase);
    }
    return result;
}
/**
 * @deprecated
 *
 * Returns the reason phrase for the given status code.
 * If the given status code does not exist, undefined is returned.
 *
 * Deprecated in favor of getReasonPhrase
 *
 * @param {number|string} statusCode The HTTP status code
 * @returns {string|undefined} The associated reason phrase (e.g. "Bad Request", "OK")
 * */
var getStatusText = getReasonPhrase;


/***/ }),

/***/ "./node_modules/http-status-codes/build/es/utils.js":
/*!**********************************************************!*\
  !*** ./node_modules/http-status-codes/build/es/utils.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   reasonPhraseToStatusCode: () => (/* binding */ reasonPhraseToStatusCode),
/* harmony export */   statusCodeToReasonPhrase: () => (/* binding */ statusCodeToReasonPhrase)
/* harmony export */ });
// Generated file. Do not edit
var statusCodeToReasonPhrase = {
    "202": "Accepted",
    "502": "Bad Gateway",
    "400": "Bad Request",
    "409": "Conflict",
    "100": "Continue",
    "201": "Created",
    "417": "Expectation Failed",
    "424": "Failed Dependency",
    "403": "Forbidden",
    "504": "Gateway Timeout",
    "410": "Gone",
    "505": "HTTP Version Not Supported",
    "418": "I'm a teapot",
    "419": "Insufficient Space on Resource",
    "507": "Insufficient Storage",
    "500": "Internal Server Error",
    "411": "Length Required",
    "423": "Locked",
    "420": "Method Failure",
    "405": "Method Not Allowed",
    "301": "Moved Permanently",
    "302": "Moved Temporarily",
    "207": "Multi-Status",
    "300": "Multiple Choices",
    "511": "Network Authentication Required",
    "204": "No Content",
    "203": "Non Authoritative Information",
    "406": "Not Acceptable",
    "404": "Not Found",
    "501": "Not Implemented",
    "304": "Not Modified",
    "200": "OK",
    "206": "Partial Content",
    "402": "Payment Required",
    "308": "Permanent Redirect",
    "412": "Precondition Failed",
    "428": "Precondition Required",
    "102": "Processing",
    "407": "Proxy Authentication Required",
    "431": "Request Header Fields Too Large",
    "408": "Request Timeout",
    "413": "Request Entity Too Large",
    "414": "Request-URI Too Long",
    "416": "Requested Range Not Satisfiable",
    "205": "Reset Content",
    "303": "See Other",
    "503": "Service Unavailable",
    "101": "Switching Protocols",
    "307": "Temporary Redirect",
    "429": "Too Many Requests",
    "401": "Unauthorized",
    "451": "Unavailable For Legal Reasons",
    "422": "Unprocessable Entity",
    "415": "Unsupported Media Type",
    "305": "Use Proxy",
    "421": "Misdirected Request"
};
var reasonPhraseToStatusCode = {
    "Accepted": 202,
    "Bad Gateway": 502,
    "Bad Request": 400,
    "Conflict": 409,
    "Continue": 100,
    "Created": 201,
    "Expectation Failed": 417,
    "Failed Dependency": 424,
    "Forbidden": 403,
    "Gateway Timeout": 504,
    "Gone": 410,
    "HTTP Version Not Supported": 505,
    "I'm a teapot": 418,
    "Insufficient Space on Resource": 419,
    "Insufficient Storage": 507,
    "Internal Server Error": 500,
    "Length Required": 411,
    "Locked": 423,
    "Method Failure": 420,
    "Method Not Allowed": 405,
    "Moved Permanently": 301,
    "Moved Temporarily": 302,
    "Multi-Status": 207,
    "Multiple Choices": 300,
    "Network Authentication Required": 511,
    "No Content": 204,
    "Non Authoritative Information": 203,
    "Not Acceptable": 406,
    "Not Found": 404,
    "Not Implemented": 501,
    "Not Modified": 304,
    "OK": 200,
    "Partial Content": 206,
    "Payment Required": 402,
    "Permanent Redirect": 308,
    "Precondition Failed": 412,
    "Precondition Required": 428,
    "Processing": 102,
    "Proxy Authentication Required": 407,
    "Request Header Fields Too Large": 431,
    "Request Timeout": 408,
    "Request Entity Too Large": 413,
    "Request-URI Too Long": 414,
    "Requested Range Not Satisfiable": 416,
    "Reset Content": 205,
    "See Other": 303,
    "Service Unavailable": 503,
    "Switching Protocols": 101,
    "Temporary Redirect": 307,
    "Too Many Requests": 429,
    "Unauthorized": 401,
    "Unavailable For Legal Reasons": 451,
    "Unprocessable Entity": 422,
    "Unsupported Media Type": 415,
    "Use Proxy": 305,
    "Misdirected Request": 421
};


/***/ }),

/***/ "./node_modules/ieee754/index.js":
/*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ "./node_modules/querystringify/index.js":
/*!**********************************************!*\
  !*** ./node_modules/querystringify/index.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports) => {



var has = Object.prototype.hasOwnProperty
  , undef;

/**
 * Decode a URI encoded string.
 *
 * @param {String} input The URI encoded string.
 * @returns {String|Null} The decoded string.
 * @api private
 */
function decode(input) {
  try {
    return decodeURIComponent(input.replace(/\+/g, ' '));
  } catch (e) {
    return null;
  }
}

/**
 * Attempts to encode a given input.
 *
 * @param {String} input The string that needs to be encoded.
 * @returns {String|Null} The encoded string.
 * @api private
 */
function encode(input) {
  try {
    return encodeURIComponent(input);
  } catch (e) {
    return null;
  }
}

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
function querystring(query) {
  var parser = /([^=?#&]+)=?([^&]*)/g
    , result = {}
    , part;

  while (part = parser.exec(query)) {
    var key = decode(part[1])
      , value = decode(part[2]);

    //
    // Prevent overriding of existing properties. This ensures that build-in
    // methods like `toString` or __proto__ are not overriden by malicious
    // querystrings.
    //
    // In the case if failed decoding, we want to omit the key/value pairs
    // from the result.
    //
    if (key === null || value === null || key in result) continue;
    result[key] = value;
  }

  return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
function querystringify(obj, prefix) {
  prefix = prefix || '';

  var pairs = []
    , value
    , key;

  //
  // Optionally prefix with a '?' if needed
  //
  if ('string' !== typeof prefix) prefix = '?';

  for (key in obj) {
    if (has.call(obj, key)) {
      value = obj[key];

      //
      // Edge cases where we actually want to encode the value to an empty
      // string instead of the stringified value.
      //
      if (!value && (value === null || value === undef || isNaN(value))) {
        value = '';
      }

      key = encode(key);
      value = encode(value);

      //
      // If we failed to encode the strings, we should bail out as we don't
      // want to add invalid strings to the query.
      //
      if (key === null || value === null) continue;
      pairs.push(key +'='+ value);
    }
  }

  return pairs.length ? prefix + pairs.join('&') : '';
}

//
// Expose the module.
//
exports.stringify = querystringify;
exports.parse = querystring;


/***/ }),

/***/ "./node_modules/requires-port/index.js":
/*!*********************************************!*\
  !*** ./node_modules/requires-port/index.js ***!
  \*********************************************/
/***/ ((module) => {



/**
 * Check if we're required to add a port number.
 *
 * @see https://url.spec.whatwg.org/#default-port
 * @param {Number|String} port Port number we need to check
 * @param {String} protocol Protocol we need to check against.
 * @returns {Boolean} Is it a default port for the given protocol
 * @api private
 */
module.exports = function required(port, protocol) {
  protocol = protocol.split(':')[0];
  port = +port;

  if (!port) return false;

  switch (protocol) {
    case 'http':
    case 'ws':
    return port !== 80;

    case 'https':
    case 'wss':
    return port !== 443;

    case 'ftp':
    return port !== 21;

    case 'gopher':
    return port !== 70;

    case 'file':
    return false;
  }

  return port !== 0;
};


/***/ }),

/***/ "./node_modules/url-parse/index.js":
/*!*****************************************!*\
  !*** ./node_modules/url-parse/index.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var required = __webpack_require__(/*! requires-port */ "./node_modules/requires-port/index.js")
  , qs = __webpack_require__(/*! querystringify */ "./node_modules/querystringify/index.js")
  , controlOrWhitespace = /^[\x00-\x20\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/
  , CRHTLF = /[\n\r\t]/g
  , slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//
  , port = /:\d+$/
  , protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\\/]+)?([\S\s]*)/i
  , windowsDriveLetter = /^[a-zA-Z]:/;

/**
 * Remove control characters and whitespace from the beginning of a string.
 *
 * @param {Object|String} str String to trim.
 * @returns {String} A new string representing `str` stripped of control
 *     characters and whitespace from its beginning.
 * @public
 */
function trimLeft(str) {
  return (str ? str : '').toString().replace(controlOrWhitespace, '');
}

/**
 * These are the parse rules for the URL parser, it informs the parser
 * about:
 *
 * 0. The char it Needs to parse, if it's a string it should be done using
 *    indexOf, RegExp using exec and NaN means set as current value.
 * 1. The property we should set when parsing this value.
 * 2. Indication if it's backwards or forward parsing, when set as number it's
 *    the value of extra chars that should be split off.
 * 3. Inherit from location if non existing in the parser.
 * 4. `toLowerCase` the resulting value.
 */
var rules = [
  ['#', 'hash'],                        // Extract from the back.
  ['?', 'query'],                       // Extract from the back.
  function sanitize(address, url) {     // Sanitize what is left of the address
    return isSpecial(url.protocol) ? address.replace(/\\/g, '/') : address;
  },
  ['/', 'pathname'],                    // Extract from the back.
  ['@', 'auth', 1],                     // Extract from the front.
  [NaN, 'host', undefined, 1, 1],       // Set left over value.
  [/:(\d*)$/, 'port', undefined, 1],    // RegExp the back.
  [NaN, 'hostname', undefined, 1, 1]    // Set left over.
];

/**
 * These properties should not be copied or inherited from. This is only needed
 * for all non blob URL's as a blob URL does not include a hash, only the
 * origin.
 *
 * @type {Object}
 * @private
 */
var ignore = { hash: 1, query: 1 };

/**
 * The location object differs when your code is loaded through a normal page,
 * Worker or through a worker using a blob. And with the blobble begins the
 * trouble as the location object will contain the URL of the blob, not the
 * location of the page where our code is loaded in. The actual origin is
 * encoded in the `pathname` so we can thankfully generate a good "default"
 * location from it so we can generate proper relative URL's again.
 *
 * @param {Object|String} loc Optional default location object.
 * @returns {Object} lolcation object.
 * @public
 */
function lolcation(loc) {
  var globalVar;

  if (typeof window !== 'undefined') globalVar = window;
  else if (typeof __webpack_require__.g !== 'undefined') globalVar = __webpack_require__.g;
  else if (typeof self !== 'undefined') globalVar = self;
  else globalVar = {};

  var location = globalVar.location || {};
  loc = loc || location;

  var finaldestination = {}
    , type = typeof loc
    , key;

  if ('blob:' === loc.protocol) {
    finaldestination = new Url(unescape(loc.pathname), {});
  } else if ('string' === type) {
    finaldestination = new Url(loc, {});
    for (key in ignore) delete finaldestination[key];
  } else if ('object' === type) {
    for (key in loc) {
      if (key in ignore) continue;
      finaldestination[key] = loc[key];
    }

    if (finaldestination.slashes === undefined) {
      finaldestination.slashes = slashes.test(loc.href);
    }
  }

  return finaldestination;
}

/**
 * Check whether a protocol scheme is special.
 *
 * @param {String} The protocol scheme of the URL
 * @return {Boolean} `true` if the protocol scheme is special, else `false`
 * @private
 */
function isSpecial(scheme) {
  return (
    scheme === 'file:' ||
    scheme === 'ftp:' ||
    scheme === 'http:' ||
    scheme === 'https:' ||
    scheme === 'ws:' ||
    scheme === 'wss:'
  );
}

/**
 * @typedef ProtocolExtract
 * @type Object
 * @property {String} protocol Protocol matched in the URL, in lowercase.
 * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
 * @property {String} rest Rest of the URL that is not part of the protocol.
 */

/**
 * Extract protocol information from a URL with/without double slash ("//").
 *
 * @param {String} address URL we want to extract from.
 * @param {Object} location
 * @return {ProtocolExtract} Extracted information.
 * @private
 */
function extractProtocol(address, location) {
  address = trimLeft(address);
  address = address.replace(CRHTLF, '');
  location = location || {};

  var match = protocolre.exec(address);
  var protocol = match[1] ? match[1].toLowerCase() : '';
  var forwardSlashes = !!match[2];
  var otherSlashes = !!match[3];
  var slashesCount = 0;
  var rest;

  if (forwardSlashes) {
    if (otherSlashes) {
      rest = match[2] + match[3] + match[4];
      slashesCount = match[2].length + match[3].length;
    } else {
      rest = match[2] + match[4];
      slashesCount = match[2].length;
    }
  } else {
    if (otherSlashes) {
      rest = match[3] + match[4];
      slashesCount = match[3].length;
    } else {
      rest = match[4]
    }
  }

  if (protocol === 'file:') {
    if (slashesCount >= 2) {
      rest = rest.slice(2);
    }
  } else if (isSpecial(protocol)) {
    rest = match[4];
  } else if (protocol) {
    if (forwardSlashes) {
      rest = rest.slice(2);
    }
  } else if (slashesCount >= 2 && isSpecial(location.protocol)) {
    rest = match[4];
  }

  return {
    protocol: protocol,
    slashes: forwardSlashes || isSpecial(protocol),
    slashesCount: slashesCount,
    rest: rest
  };
}

/**
 * Resolve a relative URL pathname against a base URL pathname.
 *
 * @param {String} relative Pathname of the relative URL.
 * @param {String} base Pathname of the base URL.
 * @return {String} Resolved pathname.
 * @private
 */
function resolve(relative, base) {
  if (relative === '') return base;

  var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/'))
    , i = path.length
    , last = path[i - 1]
    , unshift = false
    , up = 0;

  while (i--) {
    if (path[i] === '.') {
      path.splice(i, 1);
    } else if (path[i] === '..') {
      path.splice(i, 1);
      up++;
    } else if (up) {
      if (i === 0) unshift = true;
      path.splice(i, 1);
      up--;
    }
  }

  if (unshift) path.unshift('');
  if (last === '.' || last === '..') path.push('');

  return path.join('/');
}

/**
 * The actual URL instance. Instead of returning an object we've opted-in to
 * create an actual constructor as it's much more memory efficient and
 * faster and it pleases my OCD.
 *
 * It is worth noting that we should not use `URL` as class name to prevent
 * clashes with the global URL instance that got introduced in browsers.
 *
 * @constructor
 * @param {String} address URL we want to parse.
 * @param {Object|String} [location] Location defaults for relative paths.
 * @param {Boolean|Function} [parser] Parser for the query string.
 * @private
 */
function Url(address, location, parser) {
  address = trimLeft(address);
  address = address.replace(CRHTLF, '');

  if (!(this instanceof Url)) {
    return new Url(address, location, parser);
  }

  var relative, extracted, parse, instruction, index, key
    , instructions = rules.slice()
    , type = typeof location
    , url = this
    , i = 0;

  //
  // The following if statements allows this module two have compatibility with
  // 2 different API:
  //
  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
  //    where the boolean indicates that the query string should also be parsed.
  //
  // 2. The `URL` interface of the browser which accepts a URL, object as
  //    arguments. The supplied object will be used as default values / fall-back
  //    for relative paths.
  //
  if ('object' !== type && 'string' !== type) {
    parser = location;
    location = null;
  }

  if (parser && 'function' !== typeof parser) parser = qs.parse;

  location = lolcation(location);

  //
  // Extract protocol information before running the instructions.
  //
  extracted = extractProtocol(address || '', location);
  relative = !extracted.protocol && !extracted.slashes;
  url.slashes = extracted.slashes || relative && location.slashes;
  url.protocol = extracted.protocol || location.protocol || '';
  address = extracted.rest;

  //
  // When the authority component is absent the URL starts with a path
  // component.
  //
  if (
    extracted.protocol === 'file:' && (
      extracted.slashesCount !== 2 || windowsDriveLetter.test(address)) ||
    (!extracted.slashes &&
      (extracted.protocol ||
        extracted.slashesCount < 2 ||
        !isSpecial(url.protocol)))
  ) {
    instructions[3] = [/(.*)/, 'pathname'];
  }

  for (; i < instructions.length; i++) {
    instruction = instructions[i];

    if (typeof instruction === 'function') {
      address = instruction(address, url);
      continue;
    }

    parse = instruction[0];
    key = instruction[1];

    if (parse !== parse) {
      url[key] = address;
    } else if ('string' === typeof parse) {
      index = parse === '@'
        ? address.lastIndexOf(parse)
        : address.indexOf(parse);

      if (~index) {
        if ('number' === typeof instruction[2]) {
          url[key] = address.slice(0, index);
          address = address.slice(index + instruction[2]);
        } else {
          url[key] = address.slice(index);
          address = address.slice(0, index);
        }
      }
    } else if ((index = parse.exec(address))) {
      url[key] = index[1];
      address = address.slice(0, index.index);
    }

    url[key] = url[key] || (
      relative && instruction[3] ? location[key] || '' : ''
    );

    //
    // Hostname, host and protocol should be lowercased so they can be used to
    // create a proper `origin`.
    //
    if (instruction[4]) url[key] = url[key].toLowerCase();
  }

  //
  // Also parse the supplied query string in to an object. If we're supplied
  // with a custom parser as function use that instead of the default build-in
  // parser.
  //
  if (parser) url.query = parser(url.query);

  //
  // If the URL is relative, resolve the pathname against the base URL.
  //
  if (
      relative
    && location.slashes
    && url.pathname.charAt(0) !== '/'
    && (url.pathname !== '' || location.pathname !== '')
  ) {
    url.pathname = resolve(url.pathname, location.pathname);
  }

  //
  // Default to a / for pathname if none exists. This normalizes the URL
  // to always have a /
  //
  if (url.pathname.charAt(0) !== '/' && isSpecial(url.protocol)) {
    url.pathname = '/' + url.pathname;
  }

  //
  // We should not add port numbers if they are already the default port number
  // for a given protocol. As the host also contains the port number we're going
  // override it with the hostname which contains no port number.
  //
  if (!required(url.port, url.protocol)) {
    url.host = url.hostname;
    url.port = '';
  }

  //
  // Parse down the `auth` for the username and password.
  //
  url.username = url.password = '';

  if (url.auth) {
    index = url.auth.indexOf(':');

    if (~index) {
      url.username = url.auth.slice(0, index);
      url.username = encodeURIComponent(decodeURIComponent(url.username));

      url.password = url.auth.slice(index + 1);
      url.password = encodeURIComponent(decodeURIComponent(url.password))
    } else {
      url.username = encodeURIComponent(decodeURIComponent(url.auth));
    }

    url.auth = url.password ? url.username +':'+ url.password : url.username;
  }

  url.origin = url.protocol !== 'file:' && isSpecial(url.protocol) && url.host
    ? url.protocol +'//'+ url.host
    : 'null';

  //
  // The href is just the compiled result.
  //
  url.href = url.toString();
}

/**
 * This is convenience method for changing properties in the URL instance to
 * insure that they all propagate correctly.
 *
 * @param {String} part          Property we need to adjust.
 * @param {Mixed} value          The newly assigned value.
 * @param {Boolean|Function} fn  When setting the query, it will be the function
 *                               used to parse the query.
 *                               When setting the protocol, double slash will be
 *                               removed from the final url if it is true.
 * @returns {URL} URL instance for chaining.
 * @public
 */
function set(part, value, fn) {
  var url = this;

  switch (part) {
    case 'query':
      if ('string' === typeof value && value.length) {
        value = (fn || qs.parse)(value);
      }

      url[part] = value;
      break;

    case 'port':
      url[part] = value;

      if (!required(value, url.protocol)) {
        url.host = url.hostname;
        url[part] = '';
      } else if (value) {
        url.host = url.hostname +':'+ value;
      }

      break;

    case 'hostname':
      url[part] = value;

      if (url.port) value += ':'+ url.port;
      url.host = value;
      break;

    case 'host':
      url[part] = value;

      if (port.test(value)) {
        value = value.split(':');
        url.port = value.pop();
        url.hostname = value.join(':');
      } else {
        url.hostname = value;
        url.port = '';
      }

      break;

    case 'protocol':
      url.protocol = value.toLowerCase();
      url.slashes = !fn;
      break;

    case 'pathname':
    case 'hash':
      if (value) {
        var char = part === 'pathname' ? '/' : '#';
        url[part] = value.charAt(0) !== char ? char + value : value;
      } else {
        url[part] = value;
      }
      break;

    case 'username':
    case 'password':
      url[part] = encodeURIComponent(value);
      break;

    case 'auth':
      var index = value.indexOf(':');

      if (~index) {
        url.username = value.slice(0, index);
        url.username = encodeURIComponent(decodeURIComponent(url.username));

        url.password = value.slice(index + 1);
        url.password = encodeURIComponent(decodeURIComponent(url.password));
      } else {
        url.username = encodeURIComponent(decodeURIComponent(value));
      }
  }

  for (var i = 0; i < rules.length; i++) {
    var ins = rules[i];

    if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
  }

  url.auth = url.password ? url.username +':'+ url.password : url.username;

  url.origin = url.protocol !== 'file:' && isSpecial(url.protocol) && url.host
    ? url.protocol +'//'+ url.host
    : 'null';

  url.href = url.toString();

  return url;
}

/**
 * Transform the properties back in to a valid and full URL string.
 *
 * @param {Function} stringify Optional query stringify function.
 * @returns {String} Compiled version of the URL.
 * @public
 */
function toString(stringify) {
  if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;

  var query
    , url = this
    , host = url.host
    , protocol = url.protocol;

  if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

  var result =
    protocol +
    ((url.protocol && url.slashes) || isSpecial(url.protocol) ? '//' : '');

  if (url.username) {
    result += url.username;
    if (url.password) result += ':'+ url.password;
    result += '@';
  } else if (url.password) {
    result += ':'+ url.password;
    result += '@';
  } else if (
    url.protocol !== 'file:' &&
    isSpecial(url.protocol) &&
    !host &&
    url.pathname !== '/'
  ) {
    //
    // Add back the empty userinfo, otherwise the original invalid URL
    // might be transformed into a valid one with `url.pathname` as host.
    //
    result += '@';
  }

  //
  // Trailing colon is removed from `url.host` when it is parsed. If it still
  // ends with a colon, then add back the trailing colon that was removed. This
  // prevents an invalid URL from being transformed into a valid one.
  //
  if (host[host.length - 1] === ':' || (port.test(url.hostname) && !url.port)) {
    host += ':';
  }

  result += host + url.pathname;

  query = 'object' === typeof url.query ? stringify(url.query) : url.query;
  if (query) result += '?' !== query.charAt(0) ? '?'+ query : query;

  if (url.hash) result += url.hash;

  return result;
}

Url.prototype = { set: set, toString: toString };

//
// Expose the URL parser and some additional properties that might be useful for
// others or testing.
//
Url.extractProtocol = extractProtocol;
Url.location = lolcation;
Url.trimLeft = trimLeft;
Url.qs = qs;

module.exports = Url;


/***/ }),

/***/ "./node_modules/whatwg-mimetype/lib/mime-type-parameters.js":
/*!******************************************************************!*\
  !*** ./node_modules/whatwg-mimetype/lib/mime-type-parameters.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


const {
  asciiLowercase,
  solelyContainsHTTPTokenCodePoints,
  soleyContainsHTTPQuotedStringTokenCodePoints
} = __webpack_require__(/*! ./utils.js */ "./node_modules/whatwg-mimetype/lib/utils.js");

module.exports = class MIMETypeParameters {
  constructor(map) {
    this._map = map;
  }

  get size() {
    return this._map.size;
  }

  get(name) {
    name = asciiLowercase(String(name));
    return this._map.get(name);
  }

  has(name) {
    name = asciiLowercase(String(name));
    return this._map.has(name);
  }

  set(name, value) {
    name = asciiLowercase(String(name));
    value = String(value);

    if (!solelyContainsHTTPTokenCodePoints(name)) {
      throw new Error(`Invalid MIME type parameter name "${name}": only HTTP token code points are valid.`);
    }
    if (!soleyContainsHTTPQuotedStringTokenCodePoints(value)) {
      throw new Error(`Invalid MIME type parameter value "${value}": only HTTP quoted-string token code points are ` +
                      `valid.`);
    }

    return this._map.set(name, value);
  }

  clear() {
    this._map.clear();
  }

  delete(name) {
    name = asciiLowercase(String(name));
    return this._map.delete(name);
  }

  forEach(callbackFn, thisArg) {
    this._map.forEach(callbackFn, thisArg);
  }

  keys() {
    return this._map.keys();
  }

  values() {
    return this._map.values();
  }

  entries() {
    return this._map.entries();
  }

  [Symbol.iterator]() {
    return this._map[Symbol.iterator]();
  }
};


/***/ }),

/***/ "./node_modules/whatwg-mimetype/lib/mime-type.js":
/*!*******************************************************!*\
  !*** ./node_modules/whatwg-mimetype/lib/mime-type.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


const MIMETypeParameters = __webpack_require__(/*! ./mime-type-parameters.js */ "./node_modules/whatwg-mimetype/lib/mime-type-parameters.js");
const parse = __webpack_require__(/*! ./parser.js */ "./node_modules/whatwg-mimetype/lib/parser.js");
const serialize = __webpack_require__(/*! ./serializer.js */ "./node_modules/whatwg-mimetype/lib/serializer.js");
const {
  asciiLowercase,
  solelyContainsHTTPTokenCodePoints
} = __webpack_require__(/*! ./utils.js */ "./node_modules/whatwg-mimetype/lib/utils.js");

module.exports = class MIMEType {
  constructor(string) {
    string = String(string);
    const result = parse(string);
    if (result === null) {
      throw new Error(`Could not parse MIME type string "${string}"`);
    }

    this._type = result.type;
    this._subtype = result.subtype;
    this._parameters = new MIMETypeParameters(result.parameters);
  }

  static parse(string) {
    try {
      return new this(string);
    } catch (e) {
      return null;
    }
  }

  get essence() {
    return `${this.type}/${this.subtype}`;
  }

  get type() {
    return this._type;
  }

  set type(value) {
    value = asciiLowercase(String(value));

    if (value.length === 0) {
      throw new Error("Invalid type: must be a non-empty string");
    }
    if (!solelyContainsHTTPTokenCodePoints(value)) {
      throw new Error(`Invalid type ${value}: must contain only HTTP token code points`);
    }

    this._type = value;
  }

  get subtype() {
    return this._subtype;
  }

  set subtype(value) {
    value = asciiLowercase(String(value));

    if (value.length === 0) {
      throw new Error("Invalid subtype: must be a non-empty string");
    }
    if (!solelyContainsHTTPTokenCodePoints(value)) {
      throw new Error(`Invalid subtype ${value}: must contain only HTTP token code points`);
    }

    this._subtype = value;
  }

  get parameters() {
    return this._parameters;
  }

  toString() {
    // The serialize function works on both "MIME type records" (i.e. the results of parse) and on this class, since
    // this class's interface is identical.
    return serialize(this);
  }

  isJavaScript({ prohibitParameters = false } = {}) {
    switch (this._type) {
      case "text": {
        switch (this._subtype) {
          case "ecmascript":
          case "javascript":
          case "javascript1.0":
          case "javascript1.1":
          case "javascript1.2":
          case "javascript1.3":
          case "javascript1.4":
          case "javascript1.5":
          case "jscript":
          case "livescript":
          case "x-ecmascript":
          case "x-javascript": {
            return !prohibitParameters || this._parameters.size === 0;
          }
          default: {
            return false;
          }
        }
      }
      case "application": {
        switch (this._subtype) {
          case "ecmascript":
          case "javascript":
          case "x-ecmascript":
          case "x-javascript": {
            return !prohibitParameters || this._parameters.size === 0;
          }
          default: {
            return false;
          }
        }
      }
      default: {
        return false;
      }
    }
  }
  isXML() {
    return (this._subtype === "xml" && (this._type === "text" || this._type === "application")) ||
           this._subtype.endsWith("+xml");
  }
  isHTML() {
    return this._subtype === "html" && this._type === "text";
  }
};


/***/ }),

/***/ "./node_modules/whatwg-mimetype/lib/parser.js":
/*!****************************************************!*\
  !*** ./node_modules/whatwg-mimetype/lib/parser.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


const {
  removeLeadingAndTrailingHTTPWhitespace,
  removeTrailingHTTPWhitespace,
  isHTTPWhitespaceChar,
  solelyContainsHTTPTokenCodePoints,
  soleyContainsHTTPQuotedStringTokenCodePoints,
  asciiLowercase,
  collectAnHTTPQuotedString
} = __webpack_require__(/*! ./utils.js */ "./node_modules/whatwg-mimetype/lib/utils.js");

module.exports = input => {
  input = removeLeadingAndTrailingHTTPWhitespace(input);

  let position = 0;
  let type = "";
  while (position < input.length && input[position] !== "/") {
    type += input[position];
    ++position;
  }

  if (type.length === 0 || !solelyContainsHTTPTokenCodePoints(type)) {
    return null;
  }

  if (position >= input.length) {
    return null;
  }

  // Skips past "/"
  ++position;

  let subtype = "";
  while (position < input.length && input[position] !== ";") {
    subtype += input[position];
    ++position;
  }

  subtype = removeTrailingHTTPWhitespace(subtype);

  if (subtype.length === 0 || !solelyContainsHTTPTokenCodePoints(subtype)) {
    return null;
  }

  const mimeType = {
    type: asciiLowercase(type),
    subtype: asciiLowercase(subtype),
    parameters: new Map()
  };

  while (position < input.length) {
    // Skip past ";"
    ++position;

    while (isHTTPWhitespaceChar(input[position])) {
      ++position;
    }

    let parameterName = "";
    while (position < input.length && input[position] !== ";" && input[position] !== "=") {
      parameterName += input[position];
      ++position;
    }
    parameterName = asciiLowercase(parameterName);

    if (position < input.length) {
      if (input[position] === ";") {
        continue;
      }

      // Skip past "="
      ++position;
    }

    let parameterValue = null;
    if (input[position] === "\"") {
      [parameterValue, position] = collectAnHTTPQuotedString(input, position);

      while (position < input.length && input[position] !== ";") {
        ++position;
      }
    } else {
      parameterValue = "";
      while (position < input.length && input[position] !== ";") {
        parameterValue += input[position];
        ++position;
      }

      parameterValue = removeTrailingHTTPWhitespace(parameterValue);

      if (parameterValue === "") {
        continue;
      }
    }

    if (parameterName.length > 0 &&
        solelyContainsHTTPTokenCodePoints(parameterName) &&
        soleyContainsHTTPQuotedStringTokenCodePoints(parameterValue) &&
        !mimeType.parameters.has(parameterName)) {
      mimeType.parameters.set(parameterName, parameterValue);
    }
  }

  return mimeType;
};


/***/ }),

/***/ "./node_modules/whatwg-mimetype/lib/serializer.js":
/*!********************************************************!*\
  !*** ./node_modules/whatwg-mimetype/lib/serializer.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


const { solelyContainsHTTPTokenCodePoints } = __webpack_require__(/*! ./utils.js */ "./node_modules/whatwg-mimetype/lib/utils.js");

module.exports = mimeType => {
  let serialization = `${mimeType.type}/${mimeType.subtype}`;

  if (mimeType.parameters.size === 0) {
    return serialization;
  }

  for (let [name, value] of mimeType.parameters) {
    serialization += ";";
    serialization += name;
    serialization += "=";

    if (!solelyContainsHTTPTokenCodePoints(value) || value.length === 0) {
      value = value.replace(/(["\\])/ug, "\\$1");
      value = `"${value}"`;
    }

    serialization += value;
  }

  return serialization;
};


/***/ }),

/***/ "./node_modules/whatwg-mimetype/lib/utils.js":
/*!***************************************************!*\
  !*** ./node_modules/whatwg-mimetype/lib/utils.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {



exports.removeLeadingAndTrailingHTTPWhitespace = string => {
  return string.replace(/^[ \t\n\r]+/u, "").replace(/[ \t\n\r]+$/u, "");
};

exports.removeTrailingHTTPWhitespace = string => {
  return string.replace(/[ \t\n\r]+$/u, "");
};

exports.isHTTPWhitespaceChar = char => {
  return char === " " || char === "\t" || char === "\n" || char === "\r";
};

exports.solelyContainsHTTPTokenCodePoints = string => {
  return /^[-!#$%&'*+.^_`|~A-Za-z0-9]*$/u.test(string);
};

exports.soleyContainsHTTPQuotedStringTokenCodePoints = string => {
  return /^[\t\u0020-\u007E\u0080-\u00FF]*$/u.test(string);
};

exports.asciiLowercase = string => {
  return string.replace(/[A-Z]/ug, l => l.toLowerCase());
};

// This variant only implements it with the extract-value flag set.
exports.collectAnHTTPQuotedString = (input, position) => {
  let value = "";

  position++;

  while (true) {
    while (position < input.length && input[position] !== "\"" && input[position] !== "\\") {
      value += input[position];
      ++position;
    }

    if (position >= input.length) {
      break;
    }

    const quoteOrBackslash = input[position];
    ++position;

    if (quoteOrBackslash === "\\") {
      if (position >= input.length) {
        value += "\\";
        break;
      }

      value += input[position];
      ++position;
    } else {
      break;
    }
  }

  return [value, position];
};


/***/ }),

/***/ "csharp":
/*!**********************************!*\
  !*** external "polyfill:csharp" ***!
  \**********************************/
/***/ ((module) => {

module.exports = globalThis["polyfill:csharp"];

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/compat get default export */
/******/ (() => {
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = (module) => {
/******/ 		var getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/global */
/******/ (() => {
/******/ 	__webpack_require__.g = (function() {
/******/ 		if (typeof globalThis === 'object') return globalThis;
/******/ 		try {
/******/ 			return this || new Function('return this')();
/******/ 		} catch (e) {
/******/ 			if (typeof window === 'object') return window;
/******/ 		}
/******/ 	})();
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!******************************************!*\
  !*** ./src/addons/webapi/index.unity.ts ***!
  \******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _animationframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./animationframe */ "./src/addons/webapi/animationframe.ts");
/* harmony import */ var _event__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./event */ "./src/addons/webapi/event.ts");
/* harmony import */ var _performance__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./performance */ "./src/addons/webapi/performance.ts");
/* harmony import */ var _misc_unity__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./misc.unity */ "./src/addons/webapi/misc.unity.ts");
/* harmony import */ var _storage_unity__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./storage.unity */ "./src/addons/webapi/storage.unity.ts");
/* harmony import */ var _xhr_xhr_unity__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./xhr/xhr.unity */ "./src/addons/webapi/xhr/xhr.unity.ts");
/* harmony import */ var _index_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./index.common */ "./src/addons/webapi/index.common.ts");







(0,_index_common__WEBPACK_IMPORTED_MODULE_6__.initialize)([
  _animationframe__WEBPACK_IMPORTED_MODULE_0__["default"],
  _event__WEBPACK_IMPORTED_MODULE_1__["default"],
  _performance__WEBPACK_IMPORTED_MODULE_2__["default"],
  _misc_unity__WEBPACK_IMPORTED_MODULE_3__["default"],
  _storage_unity__WEBPACK_IMPORTED_MODULE_4__["default"],
  _xhr_xhr_unity__WEBPACK_IMPORTED_MODULE_5__["default"]
]);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (window);

})();

globalThis.$entry = __webpack_exports__;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViYXBpLm1qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFZOztBQUVaLGtCQUFrQjtBQUNsQixtQkFBbUI7QUFDbkIscUJBQXFCOztBQUVyQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQ0FBbUMsU0FBUztBQUM1QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjLFNBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixTQUFTO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMkNBQTJDLFVBQVU7QUFDckQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7QUNySkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRVk7O0FBRVosZUFBZSxtQkFBTyxDQUFDLG9EQUFXO0FBQ2xDLGdCQUFnQixtQkFBTyxDQUFDLGdEQUFTO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGNBQWM7QUFDZCxrQkFBa0I7QUFDbEIseUJBQXlCOztBQUV6QjtBQUNBLGtCQUFrQjs7QUFFbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLG1CQUFtQjtBQUN2QztBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLFlBQVk7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLHdDQUF3QyxTQUFTO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixpQkFBaUI7QUFDakM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjLGlCQUFpQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLFNBQVM7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixTQUFTO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixTQUFTO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRCxFQUFFO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxrQkFBa0IsU0FBUztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLGVBQWU7QUFDeEM7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EseUJBQXlCLFFBQVE7QUFDakM7QUFDQSxzQkFBc0IsZUFBZTtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyxZQUFZO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxzQkFBc0IsU0FBUztBQUMvQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsc0JBQXNCLFNBQVM7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esc0JBQXNCLFNBQVM7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0Isc0JBQXNCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1CQUFtQjtBQUNuQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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O0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUCxpRUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLEVBQUM7Ozs7Ozs7Ozs7Ozs7OztBQ3RVRjtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0RBQStEO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3RkFBd0Y7QUFDeEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxzQ0FBc0M7Ozs7Ozs7Ozs7Ozs7OztBQ3pWdkM7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtEQUErRDtBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0ZBQXdGO0FBQ3hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUM7QUFBQSxFQUNWLHVEQUFlO0FBQWYsRUFDQSw4Q0FBSztBQUFMLEVBQ0Esb0RBQVc7QUFBWCxFQUNBLG1EQUFJO0FBQUosRUFDQSxzREFBTztBQUFQLEVBQ0Esc0RBQUc7QUFDSixDQUFDO0FBRUQsaUVBQWUsTUFBTSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9hZGRvbnMvd2ViYXBpL2FuaW1hdGlvbmZyYW1lLnRzIiwid2VicGFjazovLy8uL3NyYy9hZGRvbnMvd2ViYXBpL2V2ZW50LnRzIiwid2VicGFjazovLy8uL3NyYy9hZGRvbnMvd2ViYXBpL2luZGV4LmNvbW1vbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYWRkb25zL3dlYmFwaS9taXNjLnVuaXR5LnRzIiwid2VicGFjazovLy8uL3NyYy9hZGRvbnMvd2ViYXBpL3BlcmZvcm1hbmNlLnRzIiwid2VicGFjazovLy8uL3NyYy9hZGRvbnMvd2ViYXBpL3N0b3JhZ2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FkZG9ucy93ZWJhcGkvc3RvcmFnZS51bml0eS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYWRkb25zL3dlYmFwaS94aHIvdXJsLnRzIiwid2VicGFjazovLy8uL3NyYy9hZGRvbnMvd2ViYXBpL3hoci94aHIuY29tbW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9hZGRvbnMvd2ViYXBpL3hoci94aHIudW5pdHkudHMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2h0dHAtc3RhdHVzLWNvZGVzL2J1aWxkL2VzL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9odHRwLXN0YXR1cy1jb2Rlcy9idWlsZC9lcy9sZWdhY3kuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2h0dHAtc3RhdHVzLWNvZGVzL2J1aWxkL2VzL3JlYXNvbi1waHJhc2VzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9odHRwLXN0YXR1cy1jb2Rlcy9idWlsZC9lcy9zdGF0dXMtY29kZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2h0dHAtc3RhdHVzLWNvZGVzL2J1aWxkL2VzL3V0aWxzLWZ1bmN0aW9ucy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaHR0cC1zdGF0dXMtY29kZXMvYnVpbGQvZXMvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5naWZ5L2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yZXF1aXJlcy1wb3J0L2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy91cmwtcGFyc2UvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3doYXR3Zy1taW1ldHlwZS9saWIvbWltZS10eXBlLXBhcmFtZXRlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3doYXR3Zy1taW1ldHlwZS9saWIvbWltZS10eXBlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy93aGF0d2ctbWltZXR5cGUvbGliL3BhcnNlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvd2hhdHdnLW1pbWV0eXBlL2xpYi9zZXJpYWxpemVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy93aGF0d2ctbWltZXR5cGUvbGliL3V0aWxzLmpzIiwid2VicGFjazovLy9leHRlcm5hbCBnbG9iYWwgXCJwb2x5ZmlsbDpjc2hhcnBcIiIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FkZG9ucy93ZWJhcGkvaW5kZXgudW5pdHkudHMiXSwibmFtZXMiOlsiUGhhc2UiLCJYTUxIdHRwUmVxdWVzdFJlYWR5U3RhdGUiXSwic291cmNlUm9vdCI6IiJ9