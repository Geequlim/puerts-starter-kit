interface WebAPIModule {
	tick?: (now: number) => void;
	initialize?: () => void;
	uninitialize?: () => void;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	exports?: Record<string, any>
}

let registeredModules: WebAPIModule[] = [];

export function initialize(modules: WebAPIModule[]) {
	Object.defineProperty(globalThis, 'window', { value: globalThis });
	for (const m of modules) {
		if (m.initialize) m.initialize();
		if (!m.exports) continue;
		for (const key in m.exports) {
			Object.defineProperty(window, key, { value: m.exports[key] });
		}
	}
	registeredModules = modules;
}

export function finalize() {
	for (const m of registeredModules) {
		if (m.uninitialize) m.uninitialize();
	}
}

export function tick() {
	for (const m of registeredModules) {
		if (m.tick && WebAPI.getHighResTimeStamp) {
			m.tick(WebAPI.getHighResTimeStamp());
		}
	}
}

Object.defineProperty(globalThis, 'WebAPI', { value: {
	tick,
	finalize,
	getHighResTimeStamp: Date.now,
}});
