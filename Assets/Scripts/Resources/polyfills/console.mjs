var e={};(e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})})(e);const n=globalThis["polyfill:csharp"],t={error:0,assert:1,warn:2,log:3,exception:4},o=new n.UnityEngine.Object,l=n.UnityEngine.Application.isEditor,i="STACK_REMAP";console[i]=e=>{let t=e.split("webpack:///")[1]||e;return t=t.replace(n.UnityEngine.Application.dataPath,"Assets"),t=t.replace("webpack-internal:///./",""),t};let r="";function a(e,a,...c){let s="";for(let e=0;e<c.length;e++){const n=c[e];"object"==typeof n&&console.LOG_OBJECT_TO_JSON?n instanceof Error?s+=n.message:s+=JSON.stringify(n,void 0,"  "):s+=n,e<c.length-1&&(s+=" ")}const g=o;if(a||n.UnityEngine.Application.isEditor){r||(r=n.UnityEngine.Application.dataPath.replace("Assets",""));const e=(new Error).stack.split("\n");for(let n=3;n<e.length;n++){let t=e[n];if(s+="\n",l){const e=t.match(/at\s.*?\s\((.*?)\:(\d+)(:(\d+))?/);if(e&&e.length>=3){let n=e[1].replace(/\\/g,"/");console[i]&&(n=console[i](n));let o=e.length>=5?e[4]:"0";const l=e[2],a=`${r}/${n}`.replace(/\/\//g,"/");t=t.replace(/\s\(/,` (<a href="${a}" line="${l}" column="${o}">`),t=t.replace(/\)$/," </a>)"),t=t.replace(e[1],n)}}s+=t}}s=s.replace(/{/gm,"{{"),s=s.replace(/}/gm,"}}"),n.UnityEngine.Debug.LogFormat(t[e],n.UnityEngine.LogOption.NoStacktrace,g||o,s)}const c=globalThis.console;if(void 0===c)Object.defineProperty(globalThis,"console",{value:{log:(...e)=>a("log",!1,...e),info:(...e)=>a("log",!0,...e),trace:(...e)=>a("log",!0,...e),warn:(...e)=>a("warn",!0,...e),error:(...e)=>a("error",!0,...e),LOG_OBJECT_TO_JSON:!1},enumerable:!0,configurable:!0,writable:!1});else for(const e in t){const n=c[e];"function"==typeof n&&(c[e]=function(){n.apply(c,arguments),a(e,"log"!=e,...arguments)})}globalThis.$entry=e;
//# sourceMappingURL=console.mjs.map