/* eslint-disable prefer-rest-params */
import { UnityEngine } from 'csharp';
const LogType = {
	'error': 0,
	'assert': 1,
	'warn': 2,
	'log': 3,
	'exception': 4
};

const emptyResources = new UnityEngine.Object();
const isUnityEditor = UnityEngine.Application.isEditor;

function print(type: keyof typeof LogType, showStack: boolean, ...args: unknown[]) {
	let message = '';
	for (let i = 0; i < args.length; i++) {
		const element = args[i];
		if (typeof element === 'object' && console.LOG_OBJECT_TO_JSON) {
			if (element instanceof Error) {
				message += element.message;
			} else {
				message += JSON.stringify(element, undefined, '  ');
			}
		} else {
			message += element;
		}
		if (i < args.length - 1) {
			message += ' ';
		}
	}
	const unityLogTarget: UnityEngine.Object = emptyResources;
	if (showStack || UnityEngine.Application.isEditor) {
		const stacks = new Error().stack.split('\n');
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
				}
			}
			message += line;
		}
	}
	message = message.replace(/{/gm, '{{');
	message = message.replace(/}/gm, '}}');
	UnityEngine.Debug.LogFormat(LogType[type], UnityEngine.LogOption.NoStacktrace, unityLogTarget || emptyResources, message);
}

const globalConsole = (globalThis as unknown)['console'];

if (typeof (globalConsole) === 'undefined') {
	Object.defineProperty(globalThis, 'console', {
		value: {
			log: (...args: unknown[]) => print('log', false, ...args),
			info: (...args: unknown[]) => print('log', true, ...args),
			trace: (...args: unknown[]) => print('log', true, ...args),
			warn: (...args: unknown[]) => print('warn', true, ...args),
			error: (...args: unknown[]) => print('error', true, ...args),
			LOG_OBJECT_TO_JSON: false,
		},
		enumerable: true,
		configurable: true,
		writable: false
	});
} else {
	for (const key in LogType) {
		const func: (...args: any[]) => void = globalConsole[key];
		if (typeof func === 'function') {
			globalConsole[key] = function () {
				func.apply(globalConsole, arguments);
				print(key as keyof typeof LogType, key != 'log', ...arguments);
			};
		}
	}
}
