/******/ var __webpack_modules__ = ({

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
/*!**************************************************!*\
  !*** ./src/framework/polyfills/console.unity.ts ***!
  \**************************************************/
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
const REMAP_FUNC = "STACK_REMAP";
console[REMAP_FUNC] = (path) => {
  const parts = path.split("webpack:///");
  let r = parts[parts.length - 1] || path;
  r = r.replace(csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Application.dataPath, "Assets");
  r = r.replace("webpack-internal:///./", "");
  return r;
};
let workspace = "";
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
    if (!workspace)
      workspace = csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Application.dataPath.replace("Assets", "");
    const stacks = new Error().stack.split("\n");
    for (let i = 3; i < stacks.length; i++) {
      let line = stacks[i];
      message += "\n";
      if (isUnityEditor) {
        const matches = line.match(/at\s(.*?\s\()?(.*?)(:(\d+))(:(\d+))?/);
        if (matches && matches.length >= 3) {
          let file = matches[2].replace(/\\/g, "/");
          if (console[REMAP_FUNC]) {
            file = console[REMAP_FUNC](file);
          }
          const column = matches.length >= 6 ? matches[6] : "";
          const lineNumber = matches.length >= 4 ? matches[4] : "1";
          const path = `${workspace}/${file}`.replace(/\/\//g, "/");
          const pos = `:${lineNumber}${column ? ":" + column : ""}`;
          const href = `<a href="${path}" line="${lineNumber}" column="${column}">${matches[2]}${pos}</a>`;
          line = line.replace(`${matches[2]}${pos}`, href);
          line = line.replace(matches[2], file);
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

})();

globalThis.$entry = __webpack_exports__;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUcsSUFBSSxXQUFZO0FBQ2hDLGFBQUssTUFBTSxlQUFlLFNBQVM7QUFDbkMsY0FBTSxLQUE2QixPQUFPLE9BQU8sR0FBRyxTQUFTO0FBQUEsTUFDOUQ7QUFBQSxJQUNEO0FBQUEsRUFDRDtBQUNEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL2V4dGVybmFsIGdsb2JhbCBcInBvbHlmaWxsOmNzaGFycFwiIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vLi9zcmMvZnJhbWV3b3JrL3BvbHlmaWxscy9jb25zb2xlLnVuaXR5LnRzIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9