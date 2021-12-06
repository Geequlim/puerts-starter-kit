import { UnityEngine, UnityEditor } from 'csharp';
import { $typeof } from 'puerts';
enum LogType {
	Error = 0,
	Assert = 1,
	Warning = 2,
	Log = 3,
	Exception = 4
}

const scriptResources = new Map<string, UnityEngine.Object>();
const emptyResources = new UnityEngine.Object();
const isUnityEditor = UnityEngine.Application.isEditor;

function print(type: LogType, showStack : boolean, ...args: unknown[]) {
	let message = '';
	for (let i = 0; i < args.length; i++) {
		const element = args[i];
		if (typeof element === 'object' && console.LOG_OBJECT_TO_JSON) {
			message += JSON.stringify(element);
		} else {
			message += element;
		}
		if (i < args.length - 1) {
			message += ' ';
		}
	}
	let unityLogTarget: UnityEngine.Object = null;
	if (showStack || UnityEngine.Application.isEditor) {
		var stacks = new Error().stack.split('\n');
		for (let i = 3; i < stacks.length; i++) {
			let line = stacks[i];
			message += '\n';
			if (isUnityEditor) {
				const matches = line.match(/at\s.*?\s\((.*?)\:(\d+)/);
				if (matches && matches.length >= 3) {
					let file = matches[1].replace(/\\/g, '/');
					if (console.STACK_REMAP) {
						file = console.STACK_REMAP(file);
					}
					const lineNumber = matches[2];
					line = line.replace(/\s\(/, ` (<a href="${file}" line="${lineNumber}">`);
					line = line.replace(/\)$/, ' </a>)');
					line = line.replace(matches[1], file);
					if (!unityLogTarget) {
						if (!scriptResources.has(file)) {
							scriptResources.set(file, UnityEditor.AssetDatabase.LoadAssetAtPath(file, $typeof(UnityEngine.Object)));
						}
						unityLogTarget = scriptResources.get(file);
					}
				}
			}
			message += line;
		}
	}
	message = message.replace(/{/gm, '{{');
	message = message.replace(/}/gm, '}}');
	UnityEngine.Debug.LogFormat(type, UnityEngine.LogOption.NoStacktrace, unityLogTarget || emptyResources, message);
}

const ConsoleObject = {
	log: (...args: unknown[]) => print(LogType.Log, false, ...args),
	info: (...args: unknown[]) => print(LogType.Log, true, ...args),
	trace: (...args: unknown[]) => print(LogType.Log, true, ...args),
	warn: (...args: unknown[]) => print(LogType.Warning, true, ...args),
	error: (...args: unknown[]) => print(LogType.Error, true, ...args),
	LOG_OBJECT_TO_JSON: false,
};

if (typeof(console) === 'undefined') {
	Object.defineProperty(globalThis, 'console', {
		value: ConsoleObject,
		enumerable: true,
		configurable: true,
		writable: false
	});
} else {
	let globalConsole = (globalThis as unknown)['console'];
	for (const key in ConsoleObject) {
		Object.defineProperty(globalConsole, key, { value: ConsoleObject[key], enumerable: true, configurable: true, writable: typeof(ConsoleObject[key]) !== 'function' });
	}
}
