/******/ var __webpack_modules__ = ({

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

/***/ "./src/addons/webapi/console.unity.ts":
/*!********************************************!*\
  !*** ./src/addons/webapi/console.unity.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var csharp__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! csharp */ "csharp");
/* harmony import */ var csharp__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(csharp__WEBPACK_IMPORTED_MODULE_0__);

const LogType = {
  "error": 0,
  "assert": 1,
  "warn": 2,
  "log": 3,
  "exception": 4
};
const emptyResources = new csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Object();
const isUnityEditor = csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Application.isEditor;
function print(type, showStack, ...args) {
  let message = "";
  for (let i = 0; i < args.length; i++) {
    const element = args[i];
    if (typeof element === "object" && console["LOG_OBJECT_TO_JSON"]) {
      if (element instanceof Error) {
        message += element.message;
      } else {
        message += JSON.stringify(element, void 0, "  ");
      }
    } else {
      message += element;
    }
    if (i < args.length - 1) {
      message += " ";
    }
  }
  const unityLogTarget = emptyResources;
  if (showStack || csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Application.isEditor) {
    const stacks = new Error().stack.split("\n");
    for (let i = 3; i < stacks.length; i++) {
      let line = stacks[i];
      message += "\n";
      if (isUnityEditor) {
        const matches = line.match(/at\s.*?\s\((.*?)\:(\d+)/);
        if (matches && matches.length >= 3) {
          let file = matches[1].replace(/\\/g, "/");
          if (console["STACK_REMAP"]) {
            file = console["STACK_REMAP"](file);
          }
          const lineNumber = matches[2];
          line = line.replace(/\s\(/, ` (<a href="${file}" line="${lineNumber}">`);
          line = line.replace(/\)$/, " </a>)");
          line = line.replace(matches[1], file);
        }
      }
      message += line;
    }
  }
  message = message.replace(/{/gm, "{{");
  message = message.replace(/}/gm, "}}");
  csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Debug.LogFormat(LogType[type], csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.LogOption.NoStacktrace, unityLogTarget || emptyResources, message);
}
const globalConsole = globalThis["console"];
if (typeof globalConsole === "undefined") {
  Object.defineProperty(globalThis, "console", {
    value: {
      log: (...args) => print("log", false, ...args),
      info: (...args) => print("log", true, ...args),
      trace: (...args) => print("log", true, ...args),
      warn: (...args) => print("warn", true, ...args),
      error: (...args) => print("error", true, ...args),
      LOG_OBJECT_TO_JSON: false
    },
    enumerable: true,
    configurable: true,
    writable: false
  });
} else {
  for (const key in LogType) {
    const func = globalConsole[key];
    if (typeof func === "function") {
      globalConsole[key] = function() {
        func.apply(globalConsole, arguments);
        print(key, key != "log", ...arguments);
      };
    }
  }
}


/***/ }),

/***/ "./src/addons/webapi/event.ts":
/*!************************************!*\
  !*** ./src/addons/webapi/event.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Event": () => (/* binding */ Event),
/* harmony export */   "EventTarget": () => (/* binding */ EventTarget),
/* harmony export */   "Phase": () => (/* binding */ Phase),
/* harmony export */   "ProgressEvent": () => (/* binding */ ProgressEvent),
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
    this._type = type;
    if (eventInitDict) {
      this._bubbles = eventInitDict.bubbles;
      this._cancelable = eventInitDict.cancelable;
      this._composed = eventInitDict.composed;
    }
  }
  /**
   * Returns true or false depending on how event was initialized. True if event goes through its target's ancestors in reverse tree order, and false otherwise.
   */
  get bubbles() {
    return this._bubbles;
  }
  /**
   * Returns true or false depending on how event was initialized. Its return value does not always carry meaning, but true can indicate that part of the operation during which event was dispatched, can be canceled by invoking the preventDefault() method.
   */
  get cancelable() {
    return this._cancelable;
  }
  /**
   * Returns true or false depending on how event was initialized. True if event invokes listeners past a ShadowRoot node that is the root of its target, and false otherwise.
   */
  get composed() {
    return this._composed;
  }
  /**
   * Returns the object whose event listener's callback is currently being invoked.
   */
  get currentTarget() {
    return this._currentTarget;
  }
  /**
   * Returns true if preventDefault() was invoked successfully to indicate cancelation, and false otherwise.
   */
  get defaultPrevented() {
    return this._defaultPrevented;
  }
  /**
   * Returns the event's phase, which is one of NONE, CAPTURING_PHASE, AT_TARGET, and BUBBLING_PHASE.
   */
  get eventPhase() {
    return this._eventPhase;
  }
  /**
   * Returns true if event was dispatched by the user agent, and false otherwise.
   */
  get isTrusted() {
    return this._isTrusted;
  }
  /**
   * Returns the object to which event is dispatched (its target).
   */
  get target() {
    return this._target;
  }
  /**
   * Returns the event's timestamp as the number of milliseconds measured relative to the time origin.
   */
  get timeStamp() {
    return this._timeStamp;
  }
  /**
   * Returns the type of event, e.g. "click", "hashchange", or "submit".
   */
  get type() {
    return this._type;
  }
  /**
   * Returns the invocation target objects of event's path (objects on which listeners will be invoked), except for any nodes in shadow trees of which the shadow root's mode is "closed" that are not reachable from event's currentTarget.
   */
  composedPath() {
    return [];
  }
  initEvent(type, bubbles, cancelable) {
    this._type = type;
    this._bubbles = bubbles;
    this._cancelable = cancelable;
  }
  /**
   * If invoked when the cancelable attribute value is true, and while executing a listener for the event with passive set to false, signals to the operation that caused event to be dispatched that it needs to be canceled.
   */
  preventDefault() {
    if (this.cancelable) {
      this._defaultPrevented = true;
    }
  }
  /**
   * Invoking this method prevents event from reaching any registered event listeners after the current one finishes running and, when dispatched in a tree, also prevents event from reaching any other objects.
   */
  stopImmediatePropagation() {
    this._defaultPrevented = true;
    this.cancelBubble = false;
  }
  /**
   * When dispatched in a tree, invoking this method prevents event from reaching any objects other than the current object.
   */
  stopPropagation() {
    if (this._bubbles) {
      this.cancelBubble = true;
    }
  }
}
class ProgressEvent extends Event {
  constructor(type, eventInitDict) {
    super(type, eventInitDict);
    if (eventInitDict) {
      this._lengthComputable = eventInitDict.lengthComputable;
      this._loaded = eventInitDict.loaded;
      this._total = eventInitDict.total;
    }
  }
  get lengthComputable() {
    return this._lengthComputable;
  }
  get loaded() {
    return this._loaded;
  }
  get total() {
    return this._total;
  }
}
class EventTarget {
  constructor() {
    this._listeners = {};
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
    if (!(type in this._listeners)) {
      this._listeners[type] = [];
    }
    let recorder = { listener };
    if (typeof options === "boolean") {
      recorder.capture = options;
    } else if (typeof options === "object") {
      recorder = __spreadProps(__spreadValues({}, options), { listener });
    }
    this._listeners[type].push(recorder);
  }
  /**
   * Dispatches a synthetic event event to target and returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise.
   */
  dispatchEvent(event) {
    if (!event || typeof event.type != "string")
      return true;
    const origin_recorders = this._listeners[event.type];
    if (!origin_recorders)
      return true;
    const recorders = origin_recorders.slice();
    if (!recorders.length)
      return !event.defaultPrevented;
    event["_target"] = this;
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
    if (!listener || !(type in this._listeners))
      return;
    const recorders = this._listeners[type];
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
      this._listeners[type] = void 0;
    } else if (typeof type === "undefined") {
      this._listeners = {};
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
/* harmony export */   "finalize": () => (/* binding */ finalize),
/* harmony export */   "initialize": () => (/* binding */ initialize),
/* harmony export */   "tick": () => (/* binding */ tick)
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
/* harmony import */ var csharp__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! csharp */ "csharp");
/* harmony import */ var csharp__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(csharp__WEBPACK_IMPORTED_MODULE_0__);

function btoa(text) {
  return csharp__WEBPACK_IMPORTED_MODULE_0__.System.Convert.ToBase64String(csharp__WEBPACK_IMPORTED_MODULE_0__.System.Text.Encoding.UTF8.GetBytes(text));
}
function atob(base64) {
  let data = csharp__WEBPACK_IMPORTED_MODULE_0__.System.Convert.FromBase64String(base64);
  let base64Decoded = csharp__WEBPACK_IMPORTED_MODULE_0__.System.Text.Encoding.ASCII.GetString(data);
  return base64Decoded;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  initialize: function() {
    Object.setPrototypeOf(csharp__WEBPACK_IMPORTED_MODULE_0__.System.Text.Encoding.ASCII, csharp__WEBPACK_IMPORTED_MODULE_0__.System.Text.Encoding.prototype);
    Object.setPrototypeOf(csharp__WEBPACK_IMPORTED_MODULE_0__.System.Text.Encoding.UTF8, csharp__WEBPACK_IMPORTED_MODULE_0__.System.Text.Encoding.prototype);
  },
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
/* harmony export */   "Storage": () => (/* binding */ Storage),
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

/***/ "./src/addons/webapi/timer.ts":
/*!************************************!*\
  !*** ./src/addons/webapi/timer.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
let global_timer_id = 0;
const pending_timers = /* @__PURE__ */ new Map();
const processing_timers = /* @__PURE__ */ new Map();
const removing_timers = /* @__PURE__ */ new Set();
function timer_loop() {
  const now = WebAPI.getHighResTimeStamp();
  for (const [id, timer] of pending_timers) {
    processing_timers.set(id, timer);
  }
  pending_timers.clear();
  for (const id of removing_timers) {
    processing_timers.delete(id);
  }
  removing_timers.clear();
  for (const [id, timer] of processing_timers) {
    if (timer.next_time <= now) {
      try {
        if (timer.handler)
          timer.handler.apply(null, timer.args);
      } catch (error) {
        console.error(`Error in timer handler: ${error.message}
${error.stack}`);
      }
      if (timer.oneshot) {
        removing_timers.add(id);
      } else {
        timer.next_time = now + timer.timeout;
      }
    }
  }
  timer_loop_id = requestAnimationFrame(timer_loop);
}
function make_timer(handler, timeout, ...args) {
  return {
    handler,
    timeout,
    next_time: WebAPI.getHighResTimeStamp() + (timeout || 0),
    args
  };
}
function pend_timer(timer) {
  pending_timers.set(++global_timer_id, timer);
  return global_timer_id;
}
function setTimeout(handler, timeout, ...args) {
  const timer = make_timer(handler, timeout, ...args);
  timer.oneshot = true;
  return pend_timer(timer);
}
function clearTimeout(handle) {
  removing_timers.add(handle);
}
function setInterval(handler, timeout, ...args) {
  return pend_timer(make_timer(handler, timeout, ...args));
}
function clearInterval(handle) {
  removing_timers.add(handle);
}
let timer_loop_id = 0;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  initialize() {
    timer_loop_id = requestAnimationFrame(timer_loop);
  },
  uninitialize() {
    cancelAnimationFrame(timer_loop_id);
  },
  exports: {
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval
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
/* harmony export */   "parse_url": () => (/* binding */ parse_url)
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
/* harmony export */   "HttpStatusCode": () => (/* binding */ HttpStatusCode),
/* harmony export */   "XMLHttpRequestBase": () => (/* binding */ XMLHttpRequestBase),
/* harmony export */   "XMLHttpRequestEventTarget": () => (/* binding */ XMLHttpRequestEventTarget),
/* harmony export */   "XMLHttpRequestReadyState": () => (/* binding */ XMLHttpRequestReadyState),
/* harmony export */   "XMLHttpRequestUpload": () => (/* binding */ XMLHttpRequestUpload)
/* harmony export */ });
/* harmony import */ var _event__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../event */ "./src/addons/webapi/event.ts");

var HttpStatusCode = /* @__PURE__ */ ((HttpStatusCode2) => {
  HttpStatusCode2[HttpStatusCode2["Continue"] = 100] = "Continue";
  HttpStatusCode2[HttpStatusCode2["SwitchingProtocols"] = 101] = "SwitchingProtocols";
  HttpStatusCode2[HttpStatusCode2["OK"] = 200] = "OK";
  HttpStatusCode2[HttpStatusCode2["Created"] = 201] = "Created";
  HttpStatusCode2[HttpStatusCode2["Accepted"] = 202] = "Accepted";
  HttpStatusCode2[HttpStatusCode2["NonAuthoritativeInformation"] = 203] = "NonAuthoritativeInformation";
  HttpStatusCode2[HttpStatusCode2["NoContent"] = 204] = "NoContent";
  HttpStatusCode2[HttpStatusCode2["ResetContent"] = 205] = "ResetContent";
  HttpStatusCode2[HttpStatusCode2["PartialContent"] = 206] = "PartialContent";
  HttpStatusCode2[HttpStatusCode2["MultipleChoices"] = 300] = "MultipleChoices";
  HttpStatusCode2[HttpStatusCode2["Ambiguous"] = 300] = "Ambiguous";
  HttpStatusCode2[HttpStatusCode2["MovedPermanently"] = 301] = "MovedPermanently";
  HttpStatusCode2[HttpStatusCode2["Moved"] = 301] = "Moved";
  HttpStatusCode2[HttpStatusCode2["Found"] = 302] = "Found";
  HttpStatusCode2[HttpStatusCode2["Redirect"] = 302] = "Redirect";
  HttpStatusCode2[HttpStatusCode2["SeeOther"] = 303] = "SeeOther";
  HttpStatusCode2[HttpStatusCode2["RedirectMethod"] = 303] = "RedirectMethod";
  HttpStatusCode2[HttpStatusCode2["NotModified"] = 304] = "NotModified";
  HttpStatusCode2[HttpStatusCode2["UseProxy"] = 305] = "UseProxy";
  HttpStatusCode2[HttpStatusCode2["Unused"] = 306] = "Unused";
  HttpStatusCode2[HttpStatusCode2["TemporaryRedirect"] = 307] = "TemporaryRedirect";
  HttpStatusCode2[HttpStatusCode2["RedirectKeepVerb"] = 307] = "RedirectKeepVerb";
  HttpStatusCode2[HttpStatusCode2["BadRequest"] = 400] = "BadRequest";
  HttpStatusCode2[HttpStatusCode2["Unauthorized"] = 401] = "Unauthorized";
  HttpStatusCode2[HttpStatusCode2["PaymentRequired"] = 402] = "PaymentRequired";
  HttpStatusCode2[HttpStatusCode2["Forbidden"] = 403] = "Forbidden";
  HttpStatusCode2[HttpStatusCode2["NotFound"] = 404] = "NotFound";
  HttpStatusCode2[HttpStatusCode2["MethodNotAllowed"] = 405] = "MethodNotAllowed";
  HttpStatusCode2[HttpStatusCode2["NotAcceptable"] = 406] = "NotAcceptable";
  HttpStatusCode2[HttpStatusCode2["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
  HttpStatusCode2[HttpStatusCode2["RequestTimeout"] = 408] = "RequestTimeout";
  HttpStatusCode2[HttpStatusCode2["Conflict"] = 409] = "Conflict";
  HttpStatusCode2[HttpStatusCode2["Gone"] = 410] = "Gone";
  HttpStatusCode2[HttpStatusCode2["LengthRequired"] = 411] = "LengthRequired";
  HttpStatusCode2[HttpStatusCode2["PreconditionFailed"] = 412] = "PreconditionFailed";
  HttpStatusCode2[HttpStatusCode2["RequestEntityTooLarge"] = 413] = "RequestEntityTooLarge";
  HttpStatusCode2[HttpStatusCode2["RequestUriTooLong"] = 414] = "RequestUriTooLong";
  HttpStatusCode2[HttpStatusCode2["UnsupportedMediaType"] = 415] = "UnsupportedMediaType";
  HttpStatusCode2[HttpStatusCode2["RequestedRangeNotSatisfiable"] = 416] = "RequestedRangeNotSatisfiable";
  HttpStatusCode2[HttpStatusCode2["ExpectationFailed"] = 417] = "ExpectationFailed";
  HttpStatusCode2[HttpStatusCode2["UpgradeRequired"] = 426] = "UpgradeRequired";
  HttpStatusCode2[HttpStatusCode2["InternalServerError"] = 500] = "InternalServerError";
  HttpStatusCode2[HttpStatusCode2["NotImplemented"] = 501] = "NotImplemented";
  HttpStatusCode2[HttpStatusCode2["BadGateway"] = 502] = "BadGateway";
  HttpStatusCode2[HttpStatusCode2["ServiceUnavailable"] = 503] = "ServiceUnavailable";
  HttpStatusCode2[HttpStatusCode2["GatewayTimeout"] = 504] = "GatewayTimeout";
  HttpStatusCode2[HttpStatusCode2["HttpVersionNotSupported"] = 505] = "HttpVersionNotSupported";
  return HttpStatusCode2;
})(HttpStatusCode || {});
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
    this._request_headers = {};
    this._poll_task_id = -1;
  }
  get url() {
    return this._url;
  }
  /**
   * Returns client's state.
   */
  get readyState() {
    return this._readyState;
  }
  set readyState(value) {
    if (value != this._readyState) {
      this._readyState = value;
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
    return this._response;
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
    return this._upload;
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
    this._overrided_mime = mime;
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
    this._request_headers[name.toLowerCase()] = value;
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
      this._poll_task_id = requestAnimationFrame(tickLoop);
      tick();
    };
    this._poll_task_id = requestAnimationFrame(tickLoop);
  }
  $stop_poll() {
    if (this._poll_task_id != -1) {
      cancelAnimationFrame(this._poll_task_id);
      this._poll_task_id = -1;
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
/* harmony import */ var _url__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./url */ "./src/addons/webapi/xhr/url.ts");
/* harmony import */ var whatwg_mimetype__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! whatwg-mimetype */ "./node_modules/whatwg-mimetype/lib/mime-type.js");
/* harmony import */ var whatwg_mimetype__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(whatwg_mimetype__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _xhr_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./xhr.common */ "./src/addons/webapi/xhr/xhr.common.ts");
/* harmony import */ var csharp__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! csharp */ "csharp");
/* harmony import */ var csharp__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(csharp__WEBPACK_IMPORTED_MODULE_3__);




class UnityXMLHttpRequest extends _xhr_common__WEBPACK_IMPORTED_MODULE_2__.XMLHttpRequestBase {
  constructor() {
    super();
  }
  get url() {
    return this._url;
  }
  get status() {
    return this._status;
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
    if (this._request && this._request.downloadHandler) {
      return this._request.downloadHandler.text;
    }
    return void 0;
  }
  getAllResponseHeaders() {
    let text = "";
    if (this._internal_respons_headers) {
      let enumerator = this._internal_respons_headers.GetEnumerator();
      while (enumerator.MoveNext()) {
        text += `${enumerator.Current.Key}: ${enumerator.Current.Value}\r
`;
      }
    }
    return text;
  }
  getResponseHeader(name) {
    if (this._internal_respons_headers) {
      if (this._internal_respons_headers.ContainsKey(name)) {
        return this._internal_respons_headers.get_Item(name);
      }
    }
    return "";
  }
  open(method, url, async, username, password) {
    this._url = (0,_url__WEBPACK_IMPORTED_MODULE_0__.parse_url)(url);
    if (!this.url.port) {
      this._url.port = this.url.protocal === "https" ? 443 : 80;
    }
    this._method = method;
    this._readyState = _xhr_common__WEBPACK_IMPORTED_MODULE_2__.XMLHttpRequestReadyState.UNSENT;
    this._connect_start_time = Date.now();
  }
  send(body) {
    if (typeof body === "object") {
      this.setRequestHeader("Content-Type", "application/json; charset=utf-8");
      body = JSON.stringify(body);
    } else if (body === "string") {
      if (!("Content-Type" in this._request_headers)) {
        this.setRequestHeader("Content-Type", "text/plain");
      }
    }
    this._request_body = body;
    switch (this._method) {
      case "PUT":
        this._request = csharp__WEBPACK_IMPORTED_MODULE_3__.UnityEngine.Networking.UnityWebRequest.Put(this._url.url, this._request_body);
        break;
      case "POST":
        this._request = csharp__WEBPACK_IMPORTED_MODULE_3__.UnityEngine.Networking.UnityWebRequest.Put(this._url.url, this._request_body);
        this._request.method = this._method;
        break;
      case "GET":
        this._request = csharp__WEBPACK_IMPORTED_MODULE_3__.UnityEngine.Networking.UnityWebRequest.Get(this._url.url);
        break;
      case "DELETE":
        this._request = csharp__WEBPACK_IMPORTED_MODULE_3__.UnityEngine.Networking.UnityWebRequest.Delete(this._url.url);
        break;
      default:
        this._request = new csharp__WEBPACK_IMPORTED_MODULE_3__.UnityEngine.Networking.UnityWebRequest(this._url.url, this._method);
        break;
    }
    if (csharp__WEBPACK_IMPORTED_MODULE_3__.UnityEngine.Networking.UnityWebRequest.certificateHandler) {
      this._request.disposeCertificateHandlerOnDispose = false;
      this._request.certificateHandler = csharp__WEBPACK_IMPORTED_MODULE_3__.UnityEngine.Networking.UnityWebRequest.certificateHandler;
    }
    for (let key of Object.getOwnPropertyNames(this._request_headers)) {
      const value = this._request_headers[key];
      this._request.SetRequestHeader(key, value);
    }
    this._internal_request = this._request.SendWebRequest();
    if (typeof this.timeout === "number") {
      this._timeout_until = Date.now() + this.timeout;
    }
    this.$dispatch_event("loadstart");
    this.$start_poll();
  }
  abort() {
    if (this._request) {
      this._request.Abort();
      this.$dispatch_event("abort");
      this.$stop_poll();
    }
  }
  $get_progress() {
    return {
      lengthComputable: this._progress !== void 0,
      loaded: this._progress,
      total: 1
    };
  }
  $tick() {
    if (this._request) {
      this._status = Number(this._request.responseCode);
      if (this._status) {
        this.readyState = _xhr_common__WEBPACK_IMPORTED_MODULE_2__.XMLHttpRequestReadyState.OPENED;
      }
      const now = Date.now();
      if (this._timeout_until && now > this._timeout_until) {
        this._request.Abort();
        this.$dispatch_event("timeout");
        this.$finished_load();
        this._status = _xhr_common__WEBPACK_IMPORTED_MODULE_2__.HttpStatusCode.RequestTimeout;
        return;
      }
      this._status = Number(this._request.responseCode) || _xhr_common__WEBPACK_IMPORTED_MODULE_2__.HttpStatusCode.Continue;
      if (this.readyState === _xhr_common__WEBPACK_IMPORTED_MODULE_2__.XMLHttpRequestReadyState.OPENED) {
        this._internal_respons_headers = this._request.GetResponseHeaders();
        if (this._internal_respons_headers && this._internal_respons_headers.Count) {
          this.readyState = _xhr_common__WEBPACK_IMPORTED_MODULE_2__.XMLHttpRequestReadyState.HEADERS_RECEIVED;
        }
      }
      if (this.readyState === _xhr_common__WEBPACK_IMPORTED_MODULE_2__.XMLHttpRequestReadyState.HEADERS_RECEIVED && this._status == _xhr_common__WEBPACK_IMPORTED_MODULE_2__.HttpStatusCode.OK) {
        this.readyState = _xhr_common__WEBPACK_IMPORTED_MODULE_2__.XMLHttpRequestReadyState.LOADING;
      }
      if (this._request.isNetworkError || this._request.isHttpError || this._request.isDone) {
        this.$finished_load();
      } else if (this._internal_request) {
        if (this._progress !== this._internal_request.progress) {
          this._progress = this._internal_request.progress;
          this.$dispatch_event("progress");
        }
      }
    }
  }
  $finished_load() {
    this.readyState = _xhr_common__WEBPACK_IMPORTED_MODULE_2__.XMLHttpRequestReadyState.DONE;
    if (this._request.isDone || this._request.isHttpError) {
      this._internal_respons_headers = this._request.GetResponseHeaders();
      this.$process_response();
    }
    if (this._request.isNetworkError || this._request.isHttpError) {
      this.$dispatch_event("error");
    } else {
      this._progress = 1;
      this.$dispatch_event("progress");
      this.$dispatch_event("load");
    }
    this.$dispatch_event("loadend");
    this.$stop_poll();
  }
  $process_response() {
    if (this.responseType === void 0) {
      const mime = new (whatwg_mimetype__WEBPACK_IMPORTED_MODULE_1___default())(this._overrided_mime || this.getResponseHeader("Content-Type") || "text/plain");
      if (mime.type === "application" && mime.subtype === "json") {
        this.responseType = "json";
      } else if (mime.type === "text") {
        this.responseType = "text";
      } else if (mime.isXML() || mime.isHTML() || mime.isJavaScript()) {
        this.responseType = "text";
      } else {
        this.responseType = "arraybuffer";
      }
    }
    switch (this.responseType) {
      case "":
      case "document":
      case "text":
        this._response = this.responseText;
        break;
      case "json":
        const text = this.responseText;
        if (text) {
          this._response = JSON.parse(text);
        } else {
          this._response = null;
        }
        break;
      default:
        this._response = this._request.downloadHandler ? this._request.downloadHandler.data : null;
        break;
    }
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  exports: {
    XMLHttpRequestEventTarget: _xhr_common__WEBPACK_IMPORTED_MODULE_2__.XMLHttpRequestEventTarget,
    XMLHttpRequestReadyState: _xhr_common__WEBPACK_IMPORTED_MODULE_2__.XMLHttpRequestReadyState,
    XMLHttpRequestUpload: _xhr_common__WEBPACK_IMPORTED_MODULE_2__.XMLHttpRequestUpload,
    XMLHttpRequest: UnityXMLHttpRequest
  }
});


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
/* harmony import */ var _console_unity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./console.unity */ "./src/addons/webapi/console.unity.ts");
/* harmony import */ var _animationframe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./animationframe */ "./src/addons/webapi/animationframe.ts");
/* harmony import */ var _event__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./event */ "./src/addons/webapi/event.ts");
/* harmony import */ var _timer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./timer */ "./src/addons/webapi/timer.ts");
/* harmony import */ var _performance__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./performance */ "./src/addons/webapi/performance.ts");
/* harmony import */ var _misc_unity__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./misc.unity */ "./src/addons/webapi/misc.unity.ts");
/* harmony import */ var _storage_unity__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./storage.unity */ "./src/addons/webapi/storage.unity.ts");
/* harmony import */ var _xhr_xhr_unity__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./xhr/xhr.unity */ "./src/addons/webapi/xhr/xhr.unity.ts");
/* harmony import */ var _index_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./index.common */ "./src/addons/webapi/index.common.ts");









(0,_index_common__WEBPACK_IMPORTED_MODULE_8__.initialize)([
  _animationframe__WEBPACK_IMPORTED_MODULE_1__["default"],
  _event__WEBPACK_IMPORTED_MODULE_2__["default"],
  _timer__WEBPACK_IMPORTED_MODULE_3__["default"],
  _performance__WEBPACK_IMPORTED_MODULE_4__["default"],
  _misc_unity__WEBPACK_IMPORTED_MODULE_5__["default"],
  _storage_unity__WEBPACK_IMPORTED_MODULE_6__["default"],
  _xhr_xhr_unity__WEBPACK_IMPORTED_MODULE_7__["default"]
]);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (window);

})();

var __webpack_exports__default = __webpack_exports__["default"];
export { __webpack_exports__default as default };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViYXBpLm1qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxJQUFJLG1CQUFtQjtBQUN2QixJQUFJLFVBQVUsb0JBQUksSUFBbUM7QUFDckQsSUFBSSxPQUFPLG9CQUFJLElBQW1DO0FBRWxELFNBQVMscUJBQXFCLFFBQXNCO0FBQ25ELE9BQUssT0FBTyxNQUFNO0FBQ25CO0FBRUEsU0FBUyxzQkFBc0IsVUFBeUM7QUFDdkUsT0FBSyxJQUFJLEVBQUUsa0JBQWtCLFFBQVE7QUFDckMsU0FBTztBQUNSO0FBRUEsU0FBUyxLQUFLLEtBQWE7QUFDMUIsTUFBSSxPQUFPO0FBQ1gsWUFBVTtBQUNWLFNBQU87QUFDUCxPQUFLLE1BQU07QUFDWCxhQUFXLENBQUMsR0FBRyxNQUFNLEtBQUssU0FBUztBQUNsQyxXQUFPLEdBQUc7QUFBQSxFQUNYO0FBQ0Q7QUFFQSxpRUFBZTtBQUFBLEVBQ2Q7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLEVBQ0Q7QUFDRCxDQUFDLEVBQUM7Ozs7Ozs7Ozs7Ozs7O0FDNUIwQjtBQUM1QixNQUFNLFVBQVU7QUFBQSxFQUNmLFNBQVM7QUFBQSxFQUNULFVBQVU7QUFBQSxFQUNWLFFBQVE7QUFBQSxFQUNSLE9BQU87QUFBQSxFQUNQLGFBQWE7QUFDZDtBQUVBLE1BQU0saUJBQWlCLElBQUksc0RBQWtCLENBQUM7QUFDOUMsTUFBTSxnQkFBZ0Isb0VBQWdDO0FBRXRELFNBQVMsTUFBTSxNQUE0QixjQUF1QixNQUFpQjtBQUNsRixNQUFJLFVBQVU7QUFDZCxXQUFTLElBQUksR0FBRyxJQUFJLEtBQUssUUFBUSxLQUFLO0FBQ3JDLFVBQU0sVUFBVSxLQUFLLENBQUM7QUFDdEIsUUFBSSxPQUFPLFlBQVksWUFBWSxRQUFRLG9CQUFvQixHQUFHO0FBQ2pFLFVBQUksbUJBQW1CLE9BQU87QUFDN0IsbUJBQVcsUUFBUTtBQUFBLE1BQ3BCLE9BQU87QUFDTixtQkFBVyxLQUFLLFVBQVUsU0FBUyxRQUFXLElBQUk7QUFBQSxNQUNuRDtBQUFBLElBQ0QsT0FBTztBQUNOLGlCQUFXO0FBQUEsSUFDWjtBQUNBLFFBQUksSUFBSSxLQUFLLFNBQVMsR0FBRztBQUN4QixpQkFBVztBQUFBLElBQ1o7QUFBQSxFQUNEO0FBQ0EsUUFBTSxpQkFBcUM7QUFDM0MsTUFBSSxhQUFhLG9FQUFnQyxFQUFFO0FBQ2xELFVBQU0sU0FBUyxJQUFJLE1BQU0sRUFBRSxNQUFNLE1BQU0sSUFBSTtBQUMzQyxhQUFTLElBQUksR0FBRyxJQUFJLE9BQU8sUUFBUSxLQUFLO0FBQ3ZDLFVBQUksT0FBTyxPQUFPLENBQUM7QUFDbkIsaUJBQVc7QUFDWCxVQUFJLGVBQWU7QUFDbEIsY0FBTSxVQUFVLEtBQUssTUFBTSx5QkFBeUI7QUFDcEQsWUFBSSxXQUFXLFFBQVEsVUFBVSxHQUFHO0FBQ25DLGNBQUksT0FBTyxRQUFRLENBQUMsRUFBRSxRQUFRLE9BQU8sR0FBRztBQUN4QyxjQUFJLFFBQVEsYUFBYSxHQUFHO0FBQzNCLG1CQUFPLFFBQVEsYUFBYSxFQUFFLElBQUk7QUFBQSxVQUNuQztBQUNBLGdCQUFNLGFBQWEsUUFBUSxDQUFDO0FBQzVCLGlCQUFPLEtBQUssUUFBUSxRQUFRLGNBQWMsZUFBZSxjQUFjO0FBQ3ZFLGlCQUFPLEtBQUssUUFBUSxPQUFPLFFBQVE7QUFDbkMsaUJBQU8sS0FBSyxRQUFRLFFBQVEsQ0FBQyxHQUFHLElBQUk7QUFBQSxRQUNyQztBQUFBLE1BQ0Q7QUFDQSxpQkFBVztBQUFBLElBQ1o7QUFBQSxFQUNEO0FBQ0EsWUFBVSxRQUFRLFFBQVEsT0FBTyxJQUFJO0FBQ3JDLFlBQVUsUUFBUSxRQUFRLE9BQU8sSUFBSTtBQUNyQyxpRUFBMkIsQ0FBQyxRQUFRLElBQUksR0FBRyxzRUFBa0MsRUFBRSxrQkFBa0IsZ0JBQWdCLE9BQU87QUFDekg7QUFFQSxNQUFNLGdCQUFpQixXQUF1QixTQUFTO0FBRXZELElBQUksT0FBUSxrQkFBbUIsYUFBYTtBQUMzQyxTQUFPLGVBQWUsWUFBWSxXQUFXO0FBQUEsSUFDNUMsT0FBTztBQUFBLE1BQ04sS0FBSyxJQUFJLFNBQW9CLE1BQU0sT0FBTyxPQUFPLEdBQUcsSUFBSTtBQUFBLE1BQ3hELE1BQU0sSUFBSSxTQUFvQixNQUFNLE9BQU8sTUFBTSxHQUFHLElBQUk7QUFBQSxNQUN4RCxPQUFPLElBQUksU0FBb0IsTUFBTSxPQUFPLE1BQU0sR0FBRyxJQUFJO0FBQUEsTUFDekQsTUFBTSxJQUFJLFNBQW9CLE1BQU0sUUFBUSxNQUFNLEdBQUcsSUFBSTtBQUFBLE1BQ3pELE9BQU8sSUFBSSxTQUFvQixNQUFNLFNBQVMsTUFBTSxHQUFHLElBQUk7QUFBQSxNQUMzRCxvQkFBb0I7QUFBQSxJQUNyQjtBQUFBLElBQ0EsWUFBWTtBQUFBLElBQ1osY0FBYztBQUFBLElBQ2QsVUFBVTtBQUFBLEVBQ1gsQ0FBQztBQUNGLE9BQU87QUFDTixhQUFXLE9BQU8sU0FBUztBQUMxQixVQUFNLE9BQWlDLGNBQWMsR0FBRztBQUN4RCxRQUFJLE9BQU8sU0FBUyxZQUFZO0FBQy9CLG9CQUFjLEdBQUcsSUFBSSxXQUFZO0FBQ2hDLGFBQUssTUFBTSxlQUFlLFNBQVM7QUFDbkMsY0FBTSxLQUE2QixPQUFPLE9BQU8sR0FBRyxTQUFTO0FBQUEsTUFDOUQ7QUFBQSxJQUNEO0FBQUEsRUFDRDtBQUNEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xGTyxJQUFLLFFBQUwsa0JBQUtBLFdBQUw7QUFFTixFQUFBQSxjQUFBO0FBRUEsRUFBQUEsY0FBQTtBQUVBLEVBQUFBLGNBQUE7QUFFQSxFQUFBQSxjQUFBO0FBUlcsU0FBQUE7QUFBQTtBQTBCTCxNQUFNLE1BQU07QUFBQSxFQUVsQixZQUFZLE1BQWMsZUFBMkI7QUFDcEQsU0FBSyxRQUFRO0FBQ2IsUUFBSSxlQUFlO0FBQ2xCLFdBQUssV0FBVyxjQUFjO0FBQzlCLFdBQUssY0FBYyxjQUFjO0FBQ2pDLFdBQUssWUFBWSxjQUFjO0FBQUEsSUFDaEM7QUFBQSxFQUNEO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxJQUFJLFVBQW1CO0FBQUUsV0FBTyxLQUFLO0FBQUEsRUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBTy9DLElBQUksYUFBc0I7QUFBRSxXQUFPLEtBQUs7QUFBQSxFQUFhO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFNckQsSUFBSSxXQUFvQjtBQUFFLFdBQU8sS0FBSztBQUFBLEVBQVc7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQU1qRCxJQUFJLGdCQUE2QjtBQUFFLFdBQU8sS0FBSztBQUFBLEVBQWdCO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFNL0QsSUFBSSxtQkFBNEI7QUFBRSxXQUFPLEtBQUs7QUFBQSxFQUFtQjtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBTWpFLElBQUksYUFBb0I7QUFBRSxXQUFPLEtBQUs7QUFBQSxFQUFhO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFNbkQsSUFBSSxZQUFxQjtBQUFFLFdBQU8sS0FBSztBQUFBLEVBQVk7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQVFuRCxJQUFJLFNBQXNCO0FBQUUsV0FBTyxLQUFLO0FBQUEsRUFBUztBQUFBO0FBQUE7QUFBQTtBQUFBLEVBTWpELElBQUksWUFBb0I7QUFBRSxXQUFPLEtBQUs7QUFBQSxFQUFZO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFNbEQsSUFBSSxPQUFlO0FBQUUsV0FBTyxLQUFLO0FBQUEsRUFBTztBQUFBO0FBQUE7QUFBQTtBQUFBLEVBTXhDLGVBQThCO0FBQzdCLFdBQU8sQ0FBQztBQUFBLEVBQ1Q7QUFBQSxFQUVBLFVBQVUsTUFBYyxTQUFtQixZQUE0QjtBQUN0RSxTQUFLLFFBQVE7QUFDYixTQUFLLFdBQVc7QUFDaEIsU0FBSyxjQUFjO0FBQUEsRUFDcEI7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUtBLGlCQUF1QjtBQUN0QixRQUFJLEtBQUssWUFBWTtBQUNwQixXQUFLLG9CQUFvQjtBQUFBLElBQzFCO0FBQUEsRUFDRDtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBS0EsMkJBQWlDO0FBQ2hDLFNBQUssb0JBQW9CO0FBQ3pCLFNBQUssZUFBZTtBQUFBLEVBQ3JCO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxrQkFBd0I7QUFDdkIsUUFBSSxLQUFLLFVBQVU7QUFDbEIsV0FBSyxlQUFlO0FBQUEsSUFDckI7QUFBQSxFQUNEO0FBQ0Q7QUFTTyxNQUFNLHNCQUEyRCxNQUFNO0FBQUEsRUFVN0UsWUFBWSxNQUFjLGVBQW1DO0FBQzVELFVBQU0sTUFBTSxhQUFhO0FBQ3pCLFFBQUksZUFBZTtBQUNsQixXQUFLLG9CQUFvQixjQUFjO0FBQ3ZDLFdBQUssVUFBVSxjQUFjO0FBQzdCLFdBQUssU0FBUyxjQUFjO0FBQUEsSUFDN0I7QUFBQSxFQUNEO0FBQUEsRUFoQkEsSUFBSSxtQkFBNEI7QUFBRSxXQUFPLEtBQUs7QUFBQSxFQUFtQjtBQUFBLEVBR2pFLElBQUksU0FBaUI7QUFBRSxXQUFPLEtBQUs7QUFBQSxFQUFTO0FBQUEsRUFHNUMsSUFBSSxRQUFnQjtBQUFFLFdBQU8sS0FBSztBQUFBLEVBQVE7QUFXM0M7QUEwQk8sTUFBTSxZQUFZO0FBQUEsRUFBbEI7QUFFTixTQUFVLGFBQXFELENBQUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFlekQsaUJBQWlCLE1BQWMsVUFBOEMsU0FBbUQ7QUFDdEksUUFBSSxDQUFDO0FBQVU7QUFDZixRQUFJLEVBQUUsUUFBUSxLQUFLLGFBQWE7QUFDL0IsV0FBSyxXQUFXLElBQUksSUFBSSxDQUFDO0FBQUEsSUFDMUI7QUFDQSxRQUFJLFdBQWdDLEVBQUUsU0FBUztBQUMvQyxRQUFJLE9BQU8sWUFBWSxXQUFXO0FBQ2pDLGVBQVMsVUFBVTtBQUFBLElBQ3BCLFdBQVcsT0FBTyxZQUFZLFVBQVU7QUFDdkMsaUJBQVcsaUNBQUssVUFBTCxFQUFjLFNBQVM7QUFBQSxJQUNuQztBQUVBLFNBQUssV0FBVyxJQUFJLEVBQUUsS0FBSyxRQUFRO0FBQUEsRUFDcEM7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUtPLGNBQWMsT0FBdUI7QUFFM0MsUUFBSSxDQUFDLFNBQVMsT0FBTyxNQUFNLFFBQVE7QUFBVSxhQUFPO0FBQ3BELFVBQU0sbUJBQW1CLEtBQUssV0FBVyxNQUFNLElBQUk7QUFDbkQsUUFBSSxDQUFDO0FBQWtCLGFBQU87QUFFOUIsVUFBTSxZQUFZLGlCQUFpQixNQUFNO0FBQ3pDLFFBQUksQ0FBQyxVQUFVO0FBQVEsYUFBTyxDQUFDLE1BQU07QUFDckMsVUFBTSxTQUFTLElBQUk7QUFDbkIsUUFBSSxpQkFBd0MsQ0FBQztBQUM3QyxlQUFXLFlBQVksV0FBVztBQUNqQyxVQUFJLFdBQTBCO0FBQzlCLFVBQUssU0FBUyxTQUFpQyxhQUFhO0FBQzNELG1CQUFZLFNBQVMsU0FBaUM7QUFBQSxNQUN2RCxPQUFPO0FBQ04sbUJBQVcsU0FBUztBQUFBLE1BQ3JCO0FBRUEsVUFBSSxPQUFPLGFBQWEsWUFBWTtBQUNuQyxpQkFBUyxLQUFLLE1BQU0sS0FBSztBQUFBLE1BQzFCO0FBQ0EsVUFBSSxTQUFTLE1BQU07QUFDbEIsdUJBQWUsS0FBSyxRQUFRO0FBQUEsTUFDN0I7QUFDQSxVQUFJLE1BQU07QUFBa0I7QUFBQSxJQUM3QjtBQUVBLGFBQVMsSUFBSSxHQUFHLElBQUksZUFBZSxRQUFRLEtBQUs7QUFDL0MsdUJBQWlCLE9BQU8saUJBQWlCLFFBQVEsZUFBZSxDQUFDLENBQUMsR0FBRyxDQUFDO0FBQUEsSUFDdkU7QUFDQSxXQUFPLENBQUMsTUFBTTtBQUFBLEVBQ2Y7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUtPLG9CQUFvQixNQUFjLFVBQThDLFNBQWdEO0FBQ3RJLFFBQUksQ0FBQyxZQUFZLEVBQUUsUUFBUSxLQUFLO0FBQWE7QUFDN0MsVUFBTSxZQUFZLEtBQUssV0FBVyxJQUFJO0FBQ3RDLGFBQVMsSUFBSSxHQUFHLElBQUksVUFBVSxRQUFRLEtBQUs7QUFDMUMsWUFBTSxXQUFXLFVBQVUsQ0FBQztBQUM1QixVQUFJLFNBQVMsYUFBYSxVQUFVO0FBQ25DLFlBQUksY0FBYztBQUNsQixZQUFJLE9BQU8sWUFBWSxXQUFXO0FBQ2pDLHdCQUFjLFNBQVMsV0FBVztBQUFBLFFBQ25DLFdBQVcsT0FBTyxZQUFZLFVBQVU7QUFDdkMsd0JBQWMsU0FBUyxXQUFXLFFBQVE7QUFBQSxRQUMzQztBQUNBLFlBQUksYUFBYTtBQUNoQixvQkFBVSxPQUFPLEdBQUcsQ0FBQztBQUNyQjtBQUFBLFFBQ0Q7QUFBQSxNQUNEO0FBQUEsSUFDRDtBQUFBLEVBQ0Q7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFPTyxvQkFBb0IsTUFBcUI7QUFDL0MsUUFBSSxPQUFPLFNBQVUsVUFBVTtBQUM5QixXQUFLLFdBQVcsSUFBSSxJQUFJO0FBQUEsSUFDekIsV0FBVyxPQUFPLFNBQVUsYUFBYTtBQUN4QyxXQUFLLGFBQWEsQ0FBQztBQUFBLElBQ3BCO0FBQUEsRUFDRDtBQUNEO0FBRUEsaUVBQWU7QUFBQSxFQUNkLFNBQVM7QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRDtBQUNELENBQUMsRUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6U0YsSUFBSSxxQkFBcUMsQ0FBQztBQUVuQyxTQUFTLFdBQVcsU0FBeUI7QUFDbkQsU0FBTyxlQUFlLFlBQVksVUFBVSxFQUFFLE9BQU8sV0FBVyxDQUFDO0FBQ2pFLGFBQVcsS0FBSyxTQUFTO0FBQ3hCLFFBQUksRUFBRTtBQUFZLFFBQUUsV0FBVztBQUMvQixRQUFJLENBQUMsRUFBRTtBQUFTO0FBQ2hCLGVBQVcsT0FBTyxFQUFFLFNBQVM7QUFDNUIsYUFBTyxlQUFlLFFBQVEsS0FBSyxFQUFFLE9BQU8sRUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQUEsSUFDN0Q7QUFBQSxFQUNEO0FBQ0EsdUJBQXFCO0FBQ3RCO0FBRU8sU0FBUyxXQUFXO0FBQzFCLGFBQVcsS0FBSyxvQkFBb0I7QUFDbkMsUUFBSSxFQUFFO0FBQWMsUUFBRSxhQUFhO0FBQUEsRUFDcEM7QUFDRDtBQUVPLFNBQVMsT0FBTztBQUN0QixhQUFXLEtBQUssb0JBQW9CO0FBQ25DLFFBQUksRUFBRSxRQUFRLE9BQU8scUJBQXFCO0FBQ3pDLFFBQUUsS0FBSyxPQUFPLG9CQUFvQixDQUFDO0FBQUEsSUFDcEM7QUFBQSxFQUNEO0FBQ0Q7QUFFQSxPQUFPLGVBQWUsWUFBWSxVQUFVLEVBQUUsT0FBTztBQUFBLEVBQ3BEO0FBQUEsRUFDQTtBQUFBLEVBQ0EscUJBQXFCLEtBQUs7QUFDM0IsRUFBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZDOEI7QUFFaEMsU0FBUyxLQUFLLE1BQXNCO0FBQ25DLFNBQU8saUVBQTZCLENBQUMsc0VBQWtDLENBQUMsSUFBSSxDQUFDO0FBQzlFO0FBRUEsU0FBUyxLQUFLLFFBQXdCO0FBQ3JDLE1BQUksT0FBTyxtRUFBK0IsQ0FBQyxNQUFNO0FBQ2pELE1BQUksZ0JBQWdCLHdFQUFvQyxDQUFDLElBQUk7QUFDN0QsU0FBTztBQUNSO0FBRUEsaUVBQWU7QUFBQSxFQUNkLFlBQVksV0FBVztBQUN0QixXQUFPLGVBQWUsOERBQTBCLEVBQUUsa0VBQThCO0FBQ2hGLFdBQU8sZUFBZSw2REFBeUIsRUFBRSxrRUFBOEI7QUFBQSxFQUNoRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsRUFDRDtBQUNELENBQUMsRUFBQzs7Ozs7Ozs7Ozs7Ozs7OztBQ3JCb0M7QUFHdEMsTUFBTSxpQkFBaUI7QUFBQSxFQU10QixZQUFZLE1BQWMsV0FBbUIsV0FBbUIsV0FBVyxHQUFHO0FBQzdFLFNBQUssWUFBWTtBQUNqQixTQUFLLE9BQU87QUFDWixTQUFLLFlBQVk7QUFDakIsU0FBSyxXQUFXO0FBQUEsRUFDakI7QUFBQSxFQUVBLFNBQVM7QUFDUixXQUFPO0FBQUEsTUFDTixVQUFVLEtBQUs7QUFBQSxNQUNmLFdBQVcsS0FBSztBQUFBLE1BQ2hCLE1BQU0sS0FBSztBQUFBLE1BQ1gsV0FBVyxLQUFLO0FBQUEsSUFDakI7QUFBQSxFQUNEO0FBQ0Q7QUFFQSxNQUFNLHdCQUF3QixpQkFBaUI7QUFBQztBQUNoRCxNQUFNLDJCQUEyQixpQkFBaUI7QUFBQztBQUduRCxNQUFNLFlBQVk7QUFDbEIsTUFBTSxlQUFlO0FBRXJCLE1BQU0sb0JBQW9CLCtDQUFXLENBQUM7QUFBQSxFQVFyQyxjQUFjO0FBQ2IsVUFBTTtBQVBQLFNBQVEsV0FBVyxvQkFBSSxJQUFrQztBQVF4RCxTQUFLLGFBQWEsS0FBSyxJQUFJO0FBQUEsRUFDNUI7QUFBQSxFQVBBLE1BQU07QUFDTCxXQUFPLEtBQUssSUFBSSxJQUFJLEtBQUs7QUFBQSxFQUMxQjtBQUFBLEVBT0EsYUFBbUM7QUFDbEMsUUFBSSxNQUE0QixDQUFDO0FBQ2pDLGVBQVcsQ0FBQyxNQUFNLElBQUksS0FBSyxLQUFLLFVBQVU7QUFDekMsWUFBTSxJQUFJLE9BQU8sSUFBSTtBQUFBLElBQ3RCO0FBQ0EsV0FBTztBQUFBLEVBQ1I7QUFBQSxFQUVBLGlCQUFpQixNQUFjLE1BQXFDO0FBQ25FLFFBQUksTUFBNEIsQ0FBQztBQUNqQyxlQUFXLENBQUMsV0FBVyxJQUFJLEtBQUssS0FBSyxVQUFVO0FBQzlDLFVBQUksUUFBUSxRQUFRO0FBQVc7QUFDL0IsV0FBSyxJQUFJLE9BQUs7QUFDYixZQUFJLEVBQUUsUUFBUSxNQUFNO0FBQ25CLGNBQUksS0FBSyxDQUFDO0FBQUEsUUFDWDtBQUFBLE1BQ0QsQ0FBQztBQUFBLElBQ0Y7QUFDQSxXQUFPO0FBQUEsRUFDUjtBQUFBLEVBRUEsaUJBQWlCLE1BQW9DO0FBQ3BELFdBQU8sS0FBSyxTQUFTLElBQUksSUFBSTtBQUFBLEVBQzlCO0FBQUEsRUFFQSxLQUFLLFVBQWtCO0FBQ3RCLFVBQU0sT0FBTyxJQUFJLGdCQUFnQixVQUFVLEtBQUssSUFBSSxHQUFHLFNBQVM7QUFDaEUsUUFBSSxRQUE4QixLQUFLLFNBQVMsSUFBSSxTQUFTO0FBQzdELFFBQUksQ0FBQyxPQUFPO0FBQ1gsY0FBUSxDQUFFLElBQUs7QUFDZixXQUFLLFNBQVMsSUFBSSxXQUFXLEtBQUs7QUFBQSxJQUNuQyxPQUFPO0FBQ04sWUFBTSxLQUFLLElBQUk7QUFBQSxJQUNoQjtBQUNBLFdBQU87QUFBQSxFQUNSO0FBQUEsRUFFQSxRQUFRLGFBQXFCLFdBQW1CLFNBQWlCO0FBQ2hFLFFBQUksU0FBUyxLQUFLLGlCQUFpQixXQUFXLFNBQVM7QUFDdkQsUUFBSSxPQUFPLFVBQVU7QUFBRyxZQUFNLElBQUksTUFBTSxhQUFhLDRCQUE0QjtBQUNqRixRQUFJLE9BQU8sS0FBSyxpQkFBaUIsU0FBUyxTQUFTO0FBQ25ELFFBQUksS0FBSyxVQUFVO0FBQUcsWUFBTSxJQUFJLE1BQU0sYUFBYSwwQkFBMEI7QUFDN0UsVUFBTSxRQUFRLE9BQU8sT0FBTyxTQUFTLENBQUM7QUFDdEMsVUFBTSxNQUFNLEtBQUssS0FBSyxTQUFTLENBQUM7QUFDaEMsVUFBTSxVQUFVLElBQUksbUJBQW1CLGFBQWEsTUFBTSxXQUFXLGNBQWMsSUFBSSxZQUFZLE1BQU0sU0FBUztBQUNsSCxRQUFJLFdBQWlDLEtBQUssU0FBUyxJQUFJLFlBQVk7QUFDbkUsUUFBSSxDQUFDLFVBQVU7QUFDZCxpQkFBVyxDQUFFLE9BQVE7QUFDckIsV0FBSyxTQUFTLElBQUksY0FBYyxRQUFRO0FBQUEsSUFDekMsT0FBTztBQUNOLGVBQVMsS0FBSyxPQUFPO0FBQUEsSUFDdEI7QUFDQSxXQUFPO0FBQUEsRUFDUjtBQUFBLEVBRUEsV0FBVyxVQUF3QjtBQUNsQyxRQUFJLFFBQVEsS0FBSyxTQUFTLElBQUksU0FBUztBQUN2QyxRQUFJLE9BQU87QUFDVixjQUFRLE1BQU0sT0FBUSxPQUFLLEVBQUUsU0FBUyxRQUFTO0FBQy9DLFdBQUssU0FBUyxJQUFJLFdBQVcsS0FBSztBQUFBLElBQ25DO0FBQUEsRUFDRDtBQUFBLEVBRUEsY0FBYyxhQUEyQjtBQUN4QyxRQUFJLFdBQVcsS0FBSyxTQUFTLElBQUksU0FBUztBQUMxQyxRQUFJLFVBQVU7QUFDYixpQkFBVyxTQUFTLE9BQVEsT0FBSyxFQUFFLFNBQVMsV0FBWTtBQUN4RCxXQUFLLFNBQVMsSUFBSSxjQUFjLFFBQVE7QUFBQSxJQUN6QztBQUFBLEVBQ0Q7QUFBQSxFQUVBLFNBQVM7QUFDUixXQUFPO0FBQUEsTUFDTixZQUFZLEtBQUs7QUFBQSxJQUNsQjtBQUFBLEVBQ0Q7QUFFRDtBQUFDO0FBRUQsaUVBQWU7QUFBQSxFQUNkLFNBQVM7QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQSxhQUFhLElBQUksWUFBWTtBQUFBLEVBQzlCO0FBQ0QsQ0FBQyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDaElLLE1BQU0sUUFBUTtBQUFBLEVBQWQ7QUFFTixTQUFVLFNBQXdCLENBQUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBS25DLElBQUksU0FBaUI7QUFBRSxXQUFPLEtBQUssT0FBTztBQUFBLEVBQVE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUtsRCxRQUFjO0FBQ2IsU0FBSyxTQUFTLENBQUM7QUFDZixTQUFLLE1BQU07QUFBQSxFQUNaO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxRQUFRLEtBQTRCO0FBQ25DLGVBQVcsUUFBUSxLQUFLLFFBQVE7QUFDL0IsVUFBSSxLQUFLLFFBQVE7QUFDaEIsZUFBTyxLQUFLO0FBQUEsSUFDZDtBQUNBLFdBQU87QUFBQSxFQUNSO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxJQUFJLE9BQThCO0FBQ2pDLGFBQVMsSUFBSSxHQUFHLElBQUksS0FBSyxPQUFPLFFBQVEsS0FBSztBQUM1QyxVQUFJLE1BQU07QUFDVCxlQUFPLEtBQUssT0FBTyxDQUFDLEVBQUU7QUFBQSxJQUN4QjtBQUNBLFdBQU87QUFBQSxFQUNSO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxXQUFXLEtBQW1CO0FBQzdCLFFBQUksTUFBTTtBQUNWLGFBQVMsSUFBSSxHQUFHLElBQUksS0FBSyxPQUFPLFFBQVEsS0FBSztBQUM1QyxVQUFJLEtBQUssT0FBTyxDQUFDLEVBQUUsUUFBUSxLQUFLO0FBQy9CLGNBQU07QUFDTjtBQUFBLE1BQ0Q7QUFBQSxJQUNEO0FBQ0EsUUFBSSxPQUFPLElBQUk7QUFDZCxXQUFLLE9BQU8sT0FBTyxLQUFLLENBQUM7QUFDekIsV0FBSyxNQUFNO0FBQUEsSUFDWjtBQUFBLEVBQ0Q7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFPQSxRQUFRLEtBQWEsT0FBcUI7QUFDekMsUUFBSSxNQUFNO0FBQ1YsYUFBUyxJQUFJLEdBQUcsSUFBSSxLQUFLLE9BQU8sUUFBUSxLQUFLO0FBQzVDLFVBQUksS0FBSyxPQUFPLENBQUMsRUFBRSxRQUFRLEtBQUs7QUFDL0IsY0FBTTtBQUNOO0FBQUEsTUFDRDtBQUFBLElBQ0Q7QUFDQSxRQUFJLE9BQU8sSUFBSTtBQUNkLFVBQUksS0FBSyxPQUFPLEdBQUcsRUFBRSxTQUFTLE9BQU87QUFDcEMsYUFBSyxPQUFPLEdBQUcsRUFBRSxRQUFRO0FBQ3pCLGFBQUssTUFBTTtBQUFBLE1BQ1o7QUFBQSxJQUNELE9BQU87QUFDTixXQUFLLE9BQU8sS0FBSyxFQUFDLEtBQUssTUFBSyxDQUFDO0FBQzdCLFdBQUssTUFBTTtBQUFBLElBQ1o7QUFBQSxFQUNEO0FBQUEsRUFDVSxRQUFRO0FBQUEsRUFBQztBQUNwQjtBQUVBLGlFQUFlO0FBQUEsRUFDZCxTQUFTO0FBQUEsSUFDUjtBQUFBLElBQ0EsZ0JBQWdCLElBQUksUUFBUTtBQUFBLEVBQzdCO0FBQ0QsQ0FBQyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzRjJDO0FBQ3JCO0FBRXhCLE1BQU0scUJBQXFCLDZDQUFPLENBQUM7QUFBQSxFQUlsQyxZQUFZLE9BQWUsR0FBRyw4RUFBMEMsNkJBQTZCO0FBQ3BHLFVBQU07QUFDTixTQUFLLFFBQVE7QUFDYixTQUFLLGFBQWEsbUVBQStCLENBQUMsS0FBSyxLQUFLO0FBQzVELFFBQUkseURBQXFCLENBQUMsSUFBSSxHQUFHO0FBQ2hDLFVBQUk7QUFDSCxjQUFNLFNBQVMsSUFBSSwwREFBc0IsQ0FBQyxJQUFJO0FBQzlDLGNBQU0sT0FBTyxPQUFPLFVBQVU7QUFDOUIsZUFBTyxNQUFNO0FBQ2IsZUFBTyxRQUFRO0FBQ2YsYUFBSyxTQUFTLEtBQUssTUFBTSxJQUFJO0FBQUEsTUFDOUIsU0FBUyxPQUFQO0FBQ0QsY0FBTSxJQUFJLE1BQU0sOEJBQThCLElBQUk7QUFBQSxNQUNuRDtBQUFBLElBQ0Q7QUFBQSxFQUNEO0FBQUEsRUFFVSxRQUFRO0FBQ2pCLFFBQUksQ0FBQyx5REFBcUIsQ0FBQyxLQUFLLFVBQVUsR0FBRztBQUM1Qyw2RUFBbUMsQ0FBQyxLQUFLLFVBQVU7QUFBQSxJQUNwRDtBQUNBLFVBQU0sU0FBUyxJQUFJLDBEQUFzQixDQUFDLEtBQUssS0FBSztBQUNwRCxRQUFJLFFBQVE7QUFDWCxVQUFJLE9BQU8sS0FBSyxVQUFVLEtBQUssUUFBUSxRQUFXLEdBQUk7QUFDdEQsYUFBTyxNQUFNLElBQUk7QUFDakIsYUFBTyxNQUFNO0FBQ2IsYUFBTyxRQUFRO0FBQUEsSUFDaEIsT0FBTztBQUNOLFlBQU0sSUFBSSxNQUFNLDhCQUE4QixLQUFLLEtBQUs7QUFBQSxJQUN6RDtBQUFBLEVBQ0Q7QUFDRDtBQUVBLGlFQUFlO0FBQUEsRUFDZCxTQUFTO0FBQUEsSUFDUixPQUFPO0FBQVAsSUFDQSxnQkFBZ0IsSUFBSSw2Q0FBTyxDQUFDO0FBQUEsSUFDNUIsY0FBYyxJQUFJLGFBQWE7QUFBQSxFQUNoQztBQUNELENBQUMsRUFBQzs7Ozs7Ozs7Ozs7Ozs7O0FDdENGLElBQUksa0JBQWtCO0FBRXRCLE1BQU0saUJBQWlCLG9CQUFJLElBQW1CO0FBQzlDLE1BQU0sb0JBQW9CLG9CQUFJLElBQW1CO0FBQ2pELE1BQU0sa0JBQWtCLG9CQUFJLElBQVk7QUFFeEMsU0FBUyxhQUFhO0FBQ3JCLFFBQU0sTUFBTSxPQUFPLG9CQUFvQjtBQUV2QyxhQUFXLENBQUMsSUFBSSxLQUFLLEtBQUssZ0JBQWdCO0FBQ3pDLHNCQUFrQixJQUFJLElBQUksS0FBSztBQUFBLEVBQ2hDO0FBQ0EsaUJBQWUsTUFBTTtBQUVyQixhQUFXLE1BQU0saUJBQWlCO0FBQ2pDLHNCQUFrQixPQUFPLEVBQUU7QUFBQSxFQUM1QjtBQUNBLGtCQUFnQixNQUFNO0FBRXRCLGFBQVcsQ0FBQyxJQUFJLEtBQUssS0FBSyxtQkFBbUI7QUFDNUMsUUFBSSxNQUFNLGFBQWEsS0FBSztBQUMzQixVQUFJO0FBQ0gsWUFBSSxNQUFNO0FBQVMsZ0JBQU0sUUFBUSxNQUFNLE1BQU0sTUFBTSxJQUFJO0FBQUEsTUFDeEQsU0FBUyxPQUFQO0FBQ0QsZ0JBQVEsTUFBTSwyQkFBMkIsTUFBTTtBQUFBLEVBQVksTUFBTSxPQUFPO0FBQUEsTUFDekU7QUFDQSxVQUFJLE1BQU0sU0FBUztBQUNsQix3QkFBZ0IsSUFBSSxFQUFFO0FBQUEsTUFDdkIsT0FBTztBQUNOLGNBQU0sWUFBWSxNQUFNLE1BQU07QUFBQSxNQUMvQjtBQUFBLElBQ0Q7QUFBQSxFQUNEO0FBQ0Esa0JBQWdCLHNCQUFzQixVQUFVO0FBQ2pEO0FBRUEsU0FBUyxXQUFXLFNBQXVCLFlBQXFCLE1BQW9CO0FBQ25GLFNBQU87QUFBQSxJQUNOO0FBQUEsSUFDQTtBQUFBLElBQ0EsV0FBVyxPQUFPLG9CQUFvQixLQUFLLFdBQVc7QUFBQSxJQUN0RDtBQUFBLEVBQ0Q7QUFDRDtBQUVBLFNBQVMsV0FBVyxPQUFzQjtBQUN6QyxpQkFBZSxJQUFJLEVBQUUsaUJBQWlCLEtBQUs7QUFDM0MsU0FBTztBQUNSO0FBRUEsU0FBUyxXQUFXLFNBQXVCLFlBQXFCLE1BQXFCO0FBQ3BGLFFBQU0sUUFBUSxXQUFXLFNBQVMsU0FBUyxHQUFHLElBQUk7QUFDbEQsUUFBTSxVQUFVO0FBQ2hCLFNBQU8sV0FBVyxLQUFLO0FBQ3hCO0FBRUEsU0FBUyxhQUFhLFFBQXVCO0FBQzVDLGtCQUFnQixJQUFJLE1BQU07QUFDM0I7QUFFQSxTQUFTLFlBQVksU0FBdUIsWUFBcUIsTUFBcUI7QUFDckYsU0FBTyxXQUFXLFdBQVcsU0FBUyxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBQ3hEO0FBRUEsU0FBUyxjQUFjLFFBQXVCO0FBQzdDLGtCQUFnQixJQUFJLE1BQU07QUFDM0I7QUFFQSxJQUFJLGdCQUFnQjtBQUVwQixpRUFBZTtBQUFBLEVBQ2QsYUFBYTtBQUNaLG9CQUFnQixzQkFBc0IsVUFBVTtBQUFBLEVBQ2pEO0FBQUEsRUFDQSxlQUFlO0FBQ2QseUJBQXFCLGFBQWE7QUFBQSxFQUNuQztBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNEO0FBQ0QsQ0FBQyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3JGZ0I7QUFDWCxTQUFTLFVBQVUsS0FBbUI7QUFDNUMsUUFBTSxNQUFNLGdEQUFLLENBQUMsR0FBRztBQUNyQixTQUFPLE9BQU8sS0FBSyxFQUFFLElBQUksQ0FBQztBQUMxQixTQUFPO0FBQ1I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDWjRHO0FBS3JHLElBQUssaUJBQUwsa0JBQUtDLG9CQUFMO0FBQXNCLEVBQUFBLGdDQUFBLGNBQVcsT0FBWDtBQUFnQixFQUFBQSxnQ0FBQSx3QkFBcUIsT0FBckI7QUFBMEIsRUFBQUEsZ0NBQUEsUUFBSyxPQUFMO0FBQVUsRUFBQUEsZ0NBQUEsYUFBVSxPQUFWO0FBQWUsRUFBQUEsZ0NBQUEsY0FBVyxPQUFYO0FBQWdCLEVBQUFBLGdDQUFBLGlDQUE4QixPQUE5QjtBQUFtQyxFQUFBQSxnQ0FBQSxlQUFZLE9BQVo7QUFBaUIsRUFBQUEsZ0NBQUEsa0JBQWUsT0FBZjtBQUFvQixFQUFBQSxnQ0FBQSxvQkFBaUIsT0FBakI7QUFBc0IsRUFBQUEsZ0NBQUEscUJBQWtCLE9BQWxCO0FBQXVCLEVBQUFBLGdDQUFBLGVBQVksT0FBWjtBQUFpQixFQUFBQSxnQ0FBQSxzQkFBbUIsT0FBbkI7QUFBd0IsRUFBQUEsZ0NBQUEsV0FBUSxPQUFSO0FBQWEsRUFBQUEsZ0NBQUEsV0FBUSxPQUFSO0FBQWEsRUFBQUEsZ0NBQUEsY0FBVyxPQUFYO0FBQWdCLEVBQUFBLGdDQUFBLGNBQVcsT0FBWDtBQUFnQixFQUFBQSxnQ0FBQSxvQkFBaUIsT0FBakI7QUFBc0IsRUFBQUEsZ0NBQUEsaUJBQWMsT0FBZDtBQUFtQixFQUFBQSxnQ0FBQSxjQUFXLE9BQVg7QUFBZ0IsRUFBQUEsZ0NBQUEsWUFBUyxPQUFUO0FBQWMsRUFBQUEsZ0NBQUEsdUJBQW9CLE9BQXBCO0FBQXlCLEVBQUFBLGdDQUFBLHNCQUFtQixPQUFuQjtBQUF3QixFQUFBQSxnQ0FBQSxnQkFBYSxPQUFiO0FBQWtCLEVBQUFBLGdDQUFBLGtCQUFlLE9BQWY7QUFBb0IsRUFBQUEsZ0NBQUEscUJBQWtCLE9BQWxCO0FBQXVCLEVBQUFBLGdDQUFBLGVBQVksT0FBWjtBQUFpQixFQUFBQSxnQ0FBQSxjQUFXLE9BQVg7QUFBZ0IsRUFBQUEsZ0NBQUEsc0JBQW1CLE9BQW5CO0FBQXdCLEVBQUFBLGdDQUFBLG1CQUFnQixPQUFoQjtBQUFxQixFQUFBQSxnQ0FBQSxpQ0FBOEIsT0FBOUI7QUFBbUMsRUFBQUEsZ0NBQUEsb0JBQWlCLE9BQWpCO0FBQXNCLEVBQUFBLGdDQUFBLGNBQVcsT0FBWDtBQUFnQixFQUFBQSxnQ0FBQSxVQUFPLE9BQVA7QUFBWSxFQUFBQSxnQ0FBQSxvQkFBaUIsT0FBakI7QUFBc0IsRUFBQUEsZ0NBQUEsd0JBQXFCLE9BQXJCO0FBQTBCLEVBQUFBLGdDQUFBLDJCQUF3QixPQUF4QjtBQUE2QixFQUFBQSxnQ0FBQSx1QkFBb0IsT0FBcEI7QUFBeUIsRUFBQUEsZ0NBQUEsMEJBQXVCLE9BQXZCO0FBQTRCLEVBQUFBLGdDQUFBLGtDQUErQixPQUEvQjtBQUFvQyxFQUFBQSxnQ0FBQSx1QkFBb0IsT0FBcEI7QUFBeUIsRUFBQUEsZ0NBQUEscUJBQWtCLE9BQWxCO0FBQXVCLEVBQUFBLGdDQUFBLHlCQUFzQixPQUF0QjtBQUEyQixFQUFBQSxnQ0FBQSxvQkFBaUIsT0FBakI7QUFBc0IsRUFBQUEsZ0NBQUEsZ0JBQWEsT0FBYjtBQUFrQixFQUFBQSxnQ0FBQSx3QkFBcUIsT0FBckI7QUFBMEIsRUFBQUEsZ0NBQUEsb0JBQWlCLE9BQWpCO0FBQXNCLEVBQUFBLGdDQUFBLDZCQUEwQixPQUExQjtBQUE3OUIsU0FBQUE7QUFBQTtBQWdCTCxNQUFNLGtDQUFrQywrQ0FBVyxDQUFDO0FBQUEsRUFVMUQsaUJBQW9FLE1BQVMsVUFBOEYsU0FBbUQ7QUFDN04sVUFBTSxpQkFBaUIsTUFBTSxVQUFVLE9BQU87QUFBQSxFQUMvQztBQUFBLEVBRUEsb0JBQXVFLE1BQVMsVUFBOEYsU0FBZ0Q7QUFDN04sVUFBTSxpQkFBaUIsTUFBTSxVQUFVLE9BQU87QUFBQSxFQUMvQztBQUNEO0FBRU8sTUFBTSw2QkFBNkIsMEJBQTBCO0FBQUU7QUFFL0QsSUFBSywyQkFBTCxrQkFBS0MsOEJBQUw7QUFDTixFQUFBQSxvREFBQTtBQUNBLEVBQUFBLG9EQUFBO0FBQ0EsRUFBQUEsb0RBQUE7QUFDQSxFQUFBQSxvREFBQTtBQUNBLEVBQUFBLG9EQUFBO0FBTFcsU0FBQUE7QUFBQTtBQVNMLE1BQU0sMkJBQTJCLDBCQUEwQjtBQUFBLEVBQTNEO0FBQUE7QUFPTixTQUFVLG1CQUErQyxDQUFDO0FBcUkxRCxTQUFRLGdCQUF3QjtBQUFBO0FBQUEsRUF4SWhDLElBQVcsTUFBc0I7QUFBRSxXQUFPLEtBQUs7QUFBQSxFQUFNO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFTckQsSUFBSSxhQUF1QztBQUFFLFdBQU8sS0FBSztBQUFBLEVBQWE7QUFBQSxFQUN0RSxJQUFJLFdBQVcsT0FBaUM7QUFDL0MsUUFBSSxTQUFTLEtBQUssYUFBYTtBQUM5QixXQUFLLGNBQWM7QUFDbkIsVUFBSSxLQUFLLG9CQUFvQjtBQUM1QixZQUFJLFFBQVEsSUFBSSx5Q0FBSyxDQUFDLGtCQUFrQjtBQUN4QyxhQUFLLG1CQUFtQixLQUFLLE1BQU0sS0FBSztBQUN4QyxhQUFLLGNBQWMsS0FBSztBQUFBLE1BQ3pCO0FBQUEsSUFDRDtBQUFBLEVBQ0Q7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQU9BLElBQUksV0FBZ0I7QUFBRSxXQUFPLEtBQUs7QUFBQSxFQUFXO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBUTdDLElBQUksZUFBOEI7QUFBRSxXQUFPO0FBQUEsRUFBTTtBQUFBLEVBY2pELElBQUksY0FBc0I7QUFBRSxXQUFPO0FBQUEsRUFBTTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQU96QyxJQUFJLGNBQXNCO0FBQUUsV0FBTztBQUFBLEVBQU07QUFBQSxFQUN6QyxJQUFJLFNBQXlCO0FBQUUsV0FBTztBQUFBLEVBQUc7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQWF6QyxJQUFJLFNBQStCO0FBQUUsV0FBTyxLQUFLO0FBQUEsRUFBUztBQUFBO0FBQUE7QUFBQTtBQUFBLEVBYTFELFFBQWM7QUFBQSxFQUFFO0FBQUEsRUFFaEIsd0JBQWdDO0FBQUUsV0FBTztBQUFBLEVBQUk7QUFBQSxFQUU3QyxrQkFBa0IsTUFBNkI7QUFBRSxXQUFPO0FBQUEsRUFBTTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBVzlELEtBQUssUUFBOEIsS0FBYSxPQUFpQixVQUEwQixVQUFnQztBQUFBLEVBQUU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFPN0gsaUJBQWlCLE1BQW9CO0FBQ3BDLFNBQUssa0JBQWtCO0FBQUEsRUFDeEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFRQSxLQUFLLE1BQThCO0FBQUEsRUFBRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFTckMsaUJBQWlCLE1BQWMsT0FBcUI7QUFDbkQsU0FBSyxpQkFBaUIsS0FBSyxZQUFZLENBQUMsSUFBSTtBQUFBLEVBQzdDO0FBQUEsRUFFQSxpQkFBeUQsTUFBUyxVQUE0RSxTQUFtRDtBQUNoTSxVQUFNLGlCQUFpQixNQUFhLFVBQVUsT0FBTztBQUFBLEVBQ3REO0FBQUEsRUFFQSxvQkFBNEQsTUFBUyxVQUE0RSxTQUFnRDtBQUNoTSxVQUFNLG9CQUFvQixNQUFhLFVBQVUsT0FBTztBQUFBLEVBQ3pEO0FBQUEsRUFJVSxjQUFjO0FBQ3ZCLFNBQUssV0FBVztBQUNoQixVQUFNLE9BQU8sS0FBSyxNQUFNLEtBQUssSUFBSTtBQUNqQyxVQUFNLFdBQVcsTUFBTTtBQUN0QixXQUFLLGdCQUFnQixzQkFBc0IsUUFBUTtBQUNuRCxXQUFLO0FBQUEsSUFDTjtBQUNBLFNBQUssZ0JBQWdCLHNCQUFzQixRQUFRO0FBQUEsRUFDcEQ7QUFBQSxFQUVVLGFBQWE7QUFDdEIsUUFBSSxLQUFLLGlCQUFpQixJQUFJO0FBQzdCLDJCQUFxQixLQUFLLGFBQWE7QUFDdkMsV0FBSyxnQkFBZ0I7QUFBQSxJQUN0QjtBQUFBLEVBQ0Q7QUFBQSxFQUVVLGdCQUFtQztBQUM1QyxXQUFPLENBQUM7QUFBQSxFQUNUO0FBQUEsRUFFVSxnQkFBZ0IsTUFBK0M7QUFDeEUsUUFBSSxRQUFlO0FBQ25CLFFBQUksU0FBUyxZQUFZO0FBQ3hCLFVBQUksTUFBTSxJQUFJLGlEQUFhLENBQUMsWUFBWSxLQUFLLGNBQWMsQ0FBQztBQUM1RCxjQUFRO0FBQUEsSUFDVCxPQUFPO0FBQ04sY0FBUSxJQUFJLHlDQUFLLENBQUMsSUFBSTtBQUFBLElBQ3ZCO0FBQ0EsWUFBUSxNQUFNO0FBQUEsTUFDYixLQUFLO0FBQ0osWUFBSSxLQUFLO0FBQVEsZUFBSyxPQUFPLEtBQUssTUFBTSxLQUFLO0FBQzdDO0FBQUEsTUFDRCxLQUFLO0FBQ0osWUFBSSxLQUFLO0FBQVcsZUFBSyxVQUFVLEtBQUssTUFBTSxLQUFLO0FBQ25EO0FBQUEsTUFDRCxLQUFLO0FBQ0osWUFBSSxLQUFLO0FBQWEsZUFBSyxZQUFZLEtBQUssTUFBTSxLQUFLO0FBQ3ZEO0FBQUEsTUFDRCxLQUFLO0FBQ0osWUFBSSxLQUFLO0FBQVksZUFBSyxXQUFXLEtBQUssTUFBTSxLQUFLO0FBQ3JEO0FBQUEsTUFDRCxLQUFLO0FBQ0osWUFBSSxLQUFLO0FBQVcsZUFBSyxVQUFVLEtBQUssTUFBTSxLQUFLO0FBQ25EO0FBQUEsTUFDRCxLQUFLO0FBQ0osWUFBSSxLQUFLO0FBQVMsZUFBSyxRQUFRLEtBQUssTUFBTSxLQUFLO0FBQy9DO0FBQUEsTUFDRCxLQUFLO0FBQ0osWUFBSSxLQUFLO0FBQVMsZUFBSyxRQUFRLEtBQUssTUFBTSxLQUFLO0FBQy9DO0FBQUEsTUFDRDtBQUNDO0FBQUEsSUFDRjtBQUNBLFNBQUssY0FBYyxLQUFLO0FBQUEsRUFDekI7QUFBQSxFQUVVLFFBQVE7QUFBQSxFQUFFO0FBQ3JCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMxUHdDO0FBQ0Q7QUFDeUs7QUFDbks7QUFZN0MsTUFBTSw0QkFBNEIsMkRBQWtCLENBQUM7QUFBQSxFQXVEcEQsY0FBYztBQUNiLFVBQU07QUFBQSxFQUNQO0FBQUEsRUF2REEsSUFBVyxNQUFzQjtBQUFFLFdBQU8sS0FBSztBQUFBLEVBQU07QUFBQSxFQVlyRCxJQUFJLFNBQXlCO0FBQzVCLFdBQU8sS0FBSztBQUFBLEVBQ2I7QUFBQSxFQUVBLElBQUksY0FBc0I7QUFDekIsUUFBSSxLQUFLO0FBQ1IsYUFBTyxLQUFLLElBQUk7QUFDakIsV0FBTztBQUFBLEVBQ1I7QUFBQSxFQUVBLElBQUksY0FBc0I7QUFDekIsV0FBTyxLQUFLO0FBQUEsRUFDYjtBQUFBLEVBRUEsSUFBSSxlQUF1QjtBQUMxQixRQUFJLEtBQUssWUFBWSxLQUFLLFNBQVMsaUJBQWlCO0FBQ25ELGFBQU8sS0FBSyxTQUFTLGdCQUFnQjtBQUFBLElBQ3RDO0FBQ0EsV0FBTztBQUFBLEVBQ1I7QUFBQSxFQUVBLHdCQUFnQztBQUMvQixRQUFJLE9BQU87QUFDWCxRQUFJLEtBQUssMkJBQTJCO0FBQ25DLFVBQUksYUFBYSxLQUFLLDBCQUEwQixjQUFjO0FBQzlELGFBQU8sV0FBVyxTQUFTLEdBQUc7QUFDN0IsZ0JBQVEsR0FBRyxXQUFXLFFBQVEsUUFBUSxXQUFXLFFBQVE7QUFBQTtBQUFBLE1BQzFEO0FBQUEsSUFDRDtBQUNBLFdBQU87QUFBQSxFQUNSO0FBQUEsRUFFQSxrQkFBa0IsTUFBc0I7QUFDdkMsUUFBSSxLQUFLLDJCQUEyQjtBQUNuQyxVQUFJLEtBQUssMEJBQTBCLFlBQVksSUFBSSxHQUFHO0FBQ3JELGVBQU8sS0FBSywwQkFBMEIsU0FBUyxJQUFJO0FBQUEsTUFDcEQ7QUFBQSxJQUNEO0FBQ0EsV0FBTztBQUFBLEVBQ1I7QUFBQSxFQU1BLEtBQUssUUFBOEIsS0FBYSxPQUFpQixVQUEwQixVQUFnQztBQUMxSCxTQUFLLE9BQU8sK0NBQVMsQ0FBQyxHQUFHO0FBQ3pCLFFBQUksQ0FBQyxLQUFLLElBQUksTUFBTTtBQUNuQixXQUFLLEtBQUssT0FBTyxLQUFLLElBQUksYUFBYSxVQUFVLE1BQU07QUFBQSxJQUN4RDtBQUNBLFNBQUssVUFBVTtBQUNmLFNBQUssY0FBYyx3RUFBK0I7QUFDbEQsU0FBSyxzQkFBc0IsS0FBSyxJQUFJO0FBQUEsRUFDckM7QUFBQSxFQUVBLEtBQUssTUFBOEI7QUFDbEMsUUFBSSxPQUFPLFNBQVMsVUFBVTtBQUM3QixXQUFLLGlCQUFpQixnQkFBZ0IsaUNBQWlDO0FBQ3ZFLGFBQU8sS0FBSyxVQUFVLElBQUk7QUFBQSxJQUMzQixXQUFXLFNBQVMsVUFBVTtBQUM3QixVQUFJLEVBQUUsa0JBQWtCLEtBQUssbUJBQW1CO0FBQy9DLGFBQUssaUJBQWlCLGdCQUFnQixZQUFZO0FBQUEsTUFDbkQ7QUFBQSxJQUNEO0FBQ0EsU0FBSyxnQkFBZ0I7QUFRckIsWUFBUSxLQUFLLFNBQVM7QUFBQSxNQUNyQixLQUFLO0FBQ0osYUFBSyxXQUFXLDhFQUEwQyxDQUFDLEtBQUssS0FBSyxLQUFLLEtBQUssYUFBYTtBQUM1RjtBQUFBLE1BQ0QsS0FBSztBQUVKLGFBQUssV0FBVyw4RUFBMEMsQ0FBQyxLQUFLLEtBQUssS0FBSyxLQUFLLGFBQWE7QUFDNUYsYUFBSyxTQUFTLFNBQVMsS0FBSztBQUM1QjtBQUFBLE1BQ0QsS0FBSztBQUNKLGFBQUssV0FBVyw4RUFBMEMsQ0FBQyxLQUFLLEtBQUssR0FBRztBQUN4RTtBQUFBLE1BQ0QsS0FBSztBQUNKLGFBQUssV0FBVyxpRkFBNkMsQ0FBQyxLQUFLLEtBQUssR0FBRztBQUMzRTtBQUFBLE1BQ0Q7QUFDQyxhQUFLLFdBQVcsSUFBSSwwRUFBc0MsQ0FBQyxLQUFLLEtBQUssS0FBSyxLQUFLLE9BQU87QUFDdEY7QUFBQSxJQUNGO0FBQ0EsUUFBSSw2RkFBeUQsRUFBRTtBQUM5RCxXQUFLLFNBQVMscUNBQXFDO0FBQ25ELFdBQUssU0FBUyxxQkFBcUIsNkZBQXlEO0FBQWxCLElBQzNFO0FBQ0EsYUFBUyxPQUFPLE9BQU8sb0JBQW9CLEtBQUssZ0JBQWdCLEdBQUc7QUFDbEUsWUFBTSxRQUFRLEtBQUssaUJBQWlCLEdBQUc7QUFDdkMsV0FBSyxTQUFTLGlCQUFpQixLQUFLLEtBQUs7QUFBQSxJQUMxQztBQUNBLFNBQUssb0JBQW9CLEtBQUssU0FBUyxlQUFlO0FBRXRELFFBQUksT0FBTyxLQUFLLFlBQVksVUFBVTtBQUNyQyxXQUFLLGlCQUFpQixLQUFLLElBQUksSUFBSSxLQUFLO0FBQUEsSUFDekM7QUFDQSxTQUFLLGdCQUFnQixXQUFXO0FBQ2hDLFNBQUssWUFBWTtBQUFBLEVBQ2xCO0FBQUEsRUFFQSxRQUFjO0FBQ2IsUUFBSSxLQUFLLFVBQVU7QUFDbEIsV0FBSyxTQUFTLE1BQU07QUFDcEIsV0FBSyxnQkFBZ0IsT0FBTztBQUM1QixXQUFLLFdBQVc7QUFBQSxJQUNqQjtBQUFBLEVBQ0Q7QUFBQSxFQUVVLGdCQUFtQztBQUM1QyxXQUFPO0FBQUEsTUFDTixrQkFBa0IsS0FBSyxjQUFjO0FBQUEsTUFDckMsUUFBUSxLQUFLO0FBQUEsTUFDYixPQUFPO0FBQUEsSUFDUjtBQUFBLEVBQ0Q7QUFBQSxFQUVPLFFBQVE7QUFDZCxRQUFJLEtBQUssVUFBVTtBQUVsQixXQUFLLFVBQVUsT0FBTyxLQUFLLFNBQVMsWUFBWTtBQUNoRCxVQUFJLEtBQUssU0FBUztBQUNqQixhQUFLLGFBQWEsd0VBQStCO0FBQU4sTUFDNUM7QUFFQSxZQUFNLE1BQU0sS0FBSyxJQUFJO0FBQ3JCLFVBQUksS0FBSyxrQkFBa0IsTUFBTSxLQUFLLGdCQUFnQjtBQUNyRCxhQUFLLFNBQVMsTUFBTTtBQUNwQixhQUFLLGdCQUFnQixTQUFTO0FBQzlCLGFBQUssZUFBZTtBQUNwQixhQUFLLFVBQVUsc0VBQTZCO0FBQzVDO0FBQUEsTUFDRDtBQUVBLFdBQUssVUFBVSxPQUFPLEtBQUssU0FBUyxZQUFZLEtBQUssZ0VBQXVCO0FBQzVFLFVBQUksS0FBSyxlQUFlLHdFQUErQixFQUFFO0FBQ3hELGFBQUssNEJBQTRCLEtBQUssU0FBUyxtQkFBbUI7QUFDbEUsWUFBSSxLQUFLLDZCQUE2QixLQUFLLDBCQUEwQixPQUFPO0FBQzNFLGVBQUssYUFBYSxrRkFBeUM7QUFBaEIsUUFDNUM7QUFBQSxNQUNEO0FBRUEsVUFBSSxLQUFLLGVBQWUsa0ZBQXlDLElBQUksS0FBSyxXQUFXLDBEQUFpQixFQUFFO0FBQ3ZHLGFBQUssYUFBYSx5RUFBZ0M7QUFBUCxNQUM1QztBQUVBLFVBQUksS0FBSyxTQUFTLGtCQUFrQixLQUFLLFNBQVMsZUFBZSxLQUFLLFNBQVMsUUFBUTtBQUN0RixhQUFLLGVBQWU7QUFBQSxNQUNyQixXQUFXLEtBQUssbUJBQW1CO0FBQ2xDLFlBQUksS0FBSyxjQUFjLEtBQUssa0JBQWtCLFVBQVU7QUFDdkQsZUFBSyxZQUFZLEtBQUssa0JBQWtCO0FBQ3hDLGVBQUssZ0JBQWdCLFVBQVU7QUFBQSxRQUNoQztBQUFBLE1BQ0Q7QUFBQSxJQUNEO0FBQUEsRUFDRDtBQUFBLEVBRVEsaUJBQWlCO0FBQ3hCLFNBQUssYUFBYSxzRUFBNkI7QUFDL0MsUUFBSSxLQUFLLFNBQVMsVUFBVSxLQUFLLFNBQVMsYUFBYTtBQUN0RCxXQUFLLDRCQUE0QixLQUFLLFNBQVMsbUJBQW1CO0FBQ2xFLFdBQUssa0JBQWtCO0FBQUEsSUFDeEI7QUFDQSxRQUFJLEtBQUssU0FBUyxrQkFBa0IsS0FBSyxTQUFTLGFBQWE7QUFDOUQsV0FBSyxnQkFBZ0IsT0FBTztBQUFBLElBQzdCLE9BQU87QUFDTixXQUFLLFlBQVk7QUFDakIsV0FBSyxnQkFBZ0IsVUFBVTtBQUMvQixXQUFLLGdCQUFnQixNQUFNO0FBQUEsSUFDNUI7QUFDQSxTQUFLLGdCQUFnQixTQUFTO0FBQzlCLFNBQUssV0FBVztBQUFBLEVBQ2pCO0FBQUEsRUFFVSxvQkFBb0I7QUFDN0IsUUFBSSxLQUFLLGlCQUFpQixRQUFXO0FBQ3BDLFlBQU0sT0FBTyxJQUFJLHdEQUFRLENBQUMsS0FBSyxtQkFBbUIsS0FBSyxrQkFBa0IsY0FBYyxLQUFLLFlBQVk7QUFDeEcsVUFBSSxLQUFLLFNBQVMsaUJBQWlCLEtBQUssWUFBWSxRQUFRO0FBQzNELGFBQUssZUFBZTtBQUFBLE1BQ3JCLFdBQVcsS0FBSyxTQUFTLFFBQVE7QUFDaEMsYUFBSyxlQUFlO0FBQUEsTUFDckIsV0FBVyxLQUFLLE1BQU0sS0FBSyxLQUFLLE9BQU8sS0FBSyxLQUFLLGFBQWEsR0FBRztBQUNoRSxhQUFLLGVBQWU7QUFBQSxNQUNyQixPQUFPO0FBQ04sYUFBSyxlQUFlO0FBQUEsTUFDckI7QUFBQSxJQUNEO0FBQ0EsWUFBUSxLQUFLLGNBQWM7QUFBQSxNQUMxQixLQUFLO0FBQUEsTUFDTCxLQUFLO0FBQUEsTUFDTCxLQUFLO0FBQ0osYUFBSyxZQUFZLEtBQUs7QUFDdEI7QUFBQSxNQUNELEtBQUs7QUFDSixjQUFNLE9BQU8sS0FBSztBQUNsQixZQUFJLE1BQU07QUFDVCxlQUFLLFlBQVksS0FBSyxNQUFNLElBQUk7QUFBQSxRQUNqQyxPQUFPO0FBQ04sZUFBSyxZQUFZO0FBQUEsUUFDbEI7QUFDQTtBQUFBLE1BQ0Q7QUFDQyxhQUFLLFlBQVksS0FBSyxTQUFTLGtCQUFrQixLQUFLLFNBQVMsZ0JBQWdCLE9BQU87QUFDdEY7QUFBQSxJQUNGO0FBQUEsRUFDRDtBQUNEO0FBRUEsaUVBQWU7QUFBQSxFQUNkLFNBQVM7QUFBQSxJQUNSLHlCQUF5QjtBQUF6QixJQUNBLHdCQUF3QjtBQUF4QixJQUNBLG9CQUFvQjtBQUFwQixJQUNBLGdCQUFnQjtBQUFBLEVBQ2pCO0FBQ0QsQ0FBQyxFQUFDOzs7Ozs7Ozs7OztBQzNQVzs7QUFFYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhLGFBQWE7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWEsYUFBYTtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLGFBQWE7Ozs7Ozs7Ozs7O0FDckhBOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxlQUFlO0FBQzFCLFdBQVcsUUFBUTtBQUNuQixhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7OztBQ3JDYTs7QUFFYixlQUFlLG1CQUFPLENBQUMsNERBQWU7QUFDdEMsU0FBUyxtQkFBTyxDQUFDLDhEQUFnQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxlQUFlO0FBQzFCLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQSxlQUFlOztBQUVmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGVBQWU7QUFDMUIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLHFCQUFNLDhCQUE4QixxQkFBTTtBQUM1RDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EseURBQXlEO0FBQ3pELElBQUk7QUFDSixzQ0FBc0M7QUFDdEM7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsWUFBWSxTQUFTO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLFFBQVE7QUFDdEIsY0FBYyxTQUFTO0FBQ3ZCLGNBQWMsUUFBUTtBQUN0Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLFlBQVksaUJBQWlCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixZQUFZLFFBQVE7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxlQUFlO0FBQzFCLFdBQVcsa0JBQWtCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxTQUFTLHlCQUF5QjtBQUNsQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFB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REFBZTtBQUFmLEVBQ0EsOENBQUs7QUFBTCxFQUNBLDhDQUFLO0FBQUwsRUFDQSxvREFBVztBQUFYLEVBQ0EsbURBQUk7QUFBSixFQUNBLHNEQUFPO0FBQVAsRUFDQSxzREFBRztBQUNKLENBQUM7QUFFRCxpRUFBZSxNQUFNLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvYWRkb25zL3dlYmFwaS9hbmltYXRpb25mcmFtZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYWRkb25zL3dlYmFwaS9jb25zb2xlLnVuaXR5LnRzIiwid2VicGFjazovLy8uL3NyYy9hZGRvbnMvd2ViYXBpL2V2ZW50LnRzIiwid2VicGFjazovLy8uL3NyYy9hZGRvbnMvd2ViYXBpL2luZGV4LmNvbW1vbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYWRkb25zL3dlYmFwaS9taXNjLnVuaXR5LnRzIiwid2VicGFjazovLy8uL3NyYy9hZGRvbnMvd2ViYXBpL3BlcmZvcm1hbmNlLnRzIiwid2VicGFjazovLy8uL3NyYy9hZGRvbnMvd2ViYXBpL3N0b3JhZ2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FkZG9ucy93ZWJhcGkvc3RvcmFnZS51bml0eS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYWRkb25zL3dlYmFwaS90aW1lci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYWRkb25zL3dlYmFwaS94aHIvdXJsLnRzIiwid2VicGFjazovLy8uL3NyYy9hZGRvbnMvd2ViYXBpL3hoci94aHIuY29tbW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9hZGRvbnMvd2ViYXBpL3hoci94aHIudW5pdHkudHMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5naWZ5L2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yZXF1aXJlcy1wb3J0L2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy91cmwtcGFyc2UvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3doYXR3Zy1taW1ldHlwZS9saWIvbWltZS10eXBlLXBhcmFtZXRlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3doYXR3Zy1taW1ldHlwZS9saWIvbWltZS10eXBlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy93aGF0d2ctbWltZXR5cGUvbGliL3BhcnNlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvd2hhdHdnLW1pbWV0eXBlL2xpYi9zZXJpYWxpemVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy93aGF0d2ctbWltZXR5cGUvbGliL3V0aWxzLmpzIiwid2VicGFjazovLy9leHRlcm5hbCBnbG9iYWwgXCJwb2x5ZmlsbDpjc2hhcnBcIiIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FkZG9ucy93ZWJhcGkvaW5kZXgudW5pdHkudHMiXSwibmFtZXMiOlsiUGhhc2UiLCJIdHRwU3RhdHVzQ29kZSIsIlhNTEh0dHBSZXF1ZXN0UmVhZHlTdGF0ZSJdLCJzb3VyY2VSb290IjoiIn0=