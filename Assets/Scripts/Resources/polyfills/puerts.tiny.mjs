const csharp = globalThis.CS;

const fs = {
	existsSync(path) {
		let exists = csharp.System.IO.File.Exists(path);
		if (!exists && path.endsWith('.mjs')) { // 特殊处理一下 SourceMap 解析
			exists = csharp.System.IO.File.Exists(csharp.tiny.main.inst.DebuggerRoot + '/' + path);
		}
		return exists;
	},
	readFileSync(path) {
		let exists = csharp.System.IO.File.Exists(path);
		if (!exists && path.endsWith('.mjs')) { // 特殊处理一下 SourceMap 解析
			const file = csharp.tiny.main.inst.DebuggerRoot + '/' + path;
			if (csharp.System.IO.File.Exists(file)) {
				return csharp.System.IO.File.ReadAllText(file);
			}
			throw new Error(`File not found: ${path}`);
		}
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
