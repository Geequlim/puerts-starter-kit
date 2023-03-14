const csharp = globalThis.CS;

const fs = {
	existsSync(path) {
		return csharp.System.IO.File.Exists(path);
	},
	readFileSync(path) {
		return csharp.System.IO.File.ReadAllText(path);
	},
};

const path = {
	dirname(path) {
		return csharp.System.IO.Path.GetDirectoryName(path).replace(/\\/g, "/");
	},
	resolve(dir, url) {
		while (url.startsWith("../")) {
			dir = csharp.System.IO.Path.GetDirectoryName(dir);
			url = url.substr(3);
		}
		return `${dir}/${url}`.replace(/\\/g, "/");
	}
};

Object.defineProperty(globalThis, 'polyfill:csharp', { value: globalThis.CS, enumerable: true, configurable: false, writable: false });
Object.defineProperty(globalThis, 'polyfill:puerts', { value: globalThis.puer, enumerable: true, configurable: false, writable: false });
Object.defineProperty(globalThis, 'polyfill:fs', { value: fs, enumerable: true, configurable: false, writable: false });
Object.defineProperty(globalThis, 'polyfill:path', { value: path, enumerable: true, configurable: false, writable: false });
globalThis.process = typeof process === 'object' ? process : { platform: CS.UnityEngine.Application.platform };
