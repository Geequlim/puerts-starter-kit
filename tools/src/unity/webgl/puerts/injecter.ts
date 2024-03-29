import fs from 'fs';
import path from 'path';
import { getFiles } from '../../../utils';
const babel = require('./babel');

export async function injectPuerts2WebGL(root: string) {
	const frameworkJS = path.join(root, 'Build/webgl.framework.js');
	const HEADER = `/* Generated by ts-game-kit */\n\n`;
	let frameworkJSContent = fs.readFileSync(frameworkJS, 'utf-8');
	if (frameworkJSContent.startsWith(HEADER)) {
		return;
	}

	let injectContent = `// 定义 global 用于兼容抖音小游戏 Android-WebGL 环境
var global = (function() { return this; })(); var window = global;
`;

	const injectJSCode = (code: string, desc: string = '') => {
		injectContent += `\n(()=>{${desc ? `// ${desc}` : ''}\n${code}\n})();\n`;
	};
	const PUERTS_JS_RESOURCES_CODE = await generateJSResources(getJSModules());
	injectJSCode(PUERTS_JS_RESOURCES_CODE, 'PUERTS_JS_RESOURCES 定义');
	injectJSCode(fs.readFileSync('tools/src/unity/webgl/puerts/template/puerts-runtime.js', 'utf-8'), 'puerts-runtime.js');


	frameworkJSContent = `${HEADER}
${injectContent}
${frameworkJSContent}
`;
	fs.writeFileSync(frameworkJS, frameworkJSContent, 'utf-8');
}

export async function injectPuerts2WXMinigame(root: string) {
	const dir = path.join(root, 'puerts_minigame_js_resources');
	for (const file of getJSModules()) {
		const filename = path.basename(file);
		const basename = path.basename(path.dirname(file));
		const outfile = path.join(dir, basename, filename.endsWith('.js') ? filename : `${filename}.js`);
		if (!fs.existsSync(path.dirname(outfile))) {
			fs.mkdirSync(path.dirname(outfile), { recursive: true });
		}
		fs.copyFileSync(file, outfile);
	}

	fs.copyFileSync('tools/src/unity/webgl/puerts/template/puerts-runtime.js', path.join(root, 'puerts-runtime.js'));

	const PUERTS_RUNTIME_IMPORTER = `import './puerts-runtime.js'`;
	const gameJSFile = path.join(root, 'game.js');
	let gameJS = fs.readFileSync(gameJSFile, 'utf-8');
	if (gameJS.indexOf(PUERTS_RUNTIME_IMPORTER) == -1) {
		const injectAt = gameJS.indexOf(`import './unity-sdk/index.js';`);
		if (injectAt != -1) {
			gameJS = gameJS.slice(0, injectAt) + PUERTS_RUNTIME_IMPORTER + '\n' + gameJS.slice(injectAt);
			fs.writeFileSync(gameJSFile, gameJS, 'utf-8');
		}
	}
}

function getJSModules() {
	const modules = getFiles([
		'Library/PackageCache/com.tencent.puerts.core@*/Runtime/Resources/puerts/*.mjs',
		'Assets/Scripts/Resources/polyfills/puerts.tiny.mjs',
		'Assets/Scripts/Resources/scripts/bootstrap.mjs',
		'Assets/Scripts/Resources/scripts/bundle.mjs'
	]);
	return modules;
}

async function generateJSResources(modules: string[]) {
	const codes = await Promise.all(modules.map(file => buildForBrowser(file)));
	const PUERTS_JS_RESOURCES = {} as Record<string, string>;
	for (let i = 0; i < modules.length; i++) {
		const file = modules[i];
		const code = codes[i];
		const filename = path.basename(file);
		const basename = path.basename(path.dirname(file));
		PUERTS_JS_RESOURCES[`${basename}/${filename}`] = code;
	}

	const PUERTS_JS_RESOURCES_CODE = `\
window.PUERTS_JS_RESOURCES = {
${Object.keys(PUERTS_JS_RESOURCES).map(resourceName => `"${resourceName}": ${PUERTS_JS_RESOURCES[resourceName]}`).join(',\n')}
};
`;
	return PUERTS_JS_RESOURCES_CODE;
}

async function buildForBrowser(file: string) {
	const src = fs.readFileSync(file, 'utf-8');
	const ret = await babel.transform(src, {
		presets: [['@babel/preset-env', { targets: { chrome: '84', esmodules: false } }]]
	});
	return `(function(exports, require, module, __filename, __dirname) {${ret.code}})`;
}

