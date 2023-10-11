const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const ws = require('ws');
const crypto = require('crypto');

/** 生成版本信息 */
class HashGeneratorPlugin {
	static hash = {};
	static clients = [];
	sendInterval = 500;
	timerID = null;

	constructor(options) {
		this.options = options;
	}

	apply(compiler) {
		compiler.hooks.afterEmit.tap('HashGenerator', (compilation) => {
			HashGeneratorPlugin.hash[this.options.filename] = compilation.fullHash;
			const shasum = crypto.createHash('sha1');
			shasum.update(Object.values(HashGeneratorPlugin.hash).join(''));
			const hash = shasum.digest('hex');
			const data = { hash: hash, time: Date.now() };
			const json = JSON.stringify(data, undefined, '\t');
			if (this.timerID) clearTimeout(this.timerID);
			this.timerID = setTimeout(() => {
				this.timerID = null;
				HashGeneratorPlugin.clients.forEach(c => c.send(json));
			}, this.sendInterval);
			fs.writeFileSync(this.options.output, json, 'utf-8');
		});
	}
}

function parseBuildEnv(env) {
	if (!env) {
		env = {
			production: false,
			analyze: false,
			target: 'ES2015',
			esbuild: false,
			obfuscate: false,
		};
	}
	env.production = JSON.parse(env.production || 'false');
	env.analyze = JSON.parse(env.analyze || 'false');
	env.esbuild = JSON.parse(env.esbuild || 'false');
	env.obfuscate = env.obfuscate === 'false' ? false : env.production;
	env.target = env.target || 'ES2015';

	if (!env.production && env.WEBPACK_WATCH && env.ws) {
		const wss = new ws.WebSocketServer({ port: parseInt(env.ws + '') });
		wss.on('connection', ws => {
			HashGeneratorPlugin.clients.push(ws);
			ws.on('close', ws => HashGeneratorPlugin.clients = HashGeneratorPlugin.clients.filter(s => s != ws));
		});
		process.on('beforeExit', () => wss.close());
		wss.on('listening', () => console.log('已启动编译推送通知', `ws://localhost:${env.ws}`));
	}
	return env;
}

function makeBuildAction(workspace, env, options) {
	const tsConfigFile = path.join(workspace, options.tsConfigFile || 'tsconfig.json');
	if (env.target) {
		const tsconfig = JSON.parse(fs.readFileSync(tsConfigFile).toString('utf-8'));
		tsconfig.compilerOptions.target = env.target;
		fs.writeFileSync(tsConfigFile, JSON.stringify(tsconfig, undefined, '\t'));
	}
	const tsChecker = new (require('fork-ts-checker-webpack-plugin'))({ typescript: { configFile: tsConfigFile } });

	const inputs = Array.isArray(options.input) ? options.input : [options.input];
	return ({
		...(options.rawOptions || {}),
		entry: inputs.map(i => {
			let file = path.join(workspace, i);
			if (!fs.existsSync(file)) file = i;
			return file;
		}),
		output: {
			path: path.join(workspace, options.path),
			filename: options.filename,
			libraryTarget: options.libraryTarget
		},
		module: {
			rules: [
				{ test: /\.(html|md|txt|glsl)$/, use: 'raw-loader' },
				{ test: /\.ya?ml$/, use: 'yaml-loader' },
				(env.esbuild ?
					// ESBuild 构建
					{ test: /\.(jsx?|tsx?)$/, loader: 'esbuild-loader', exclude: /(node_modules|bower_components)/, options: { loader: 'ts' } }
					// ts-loader 构建
					: { test: /\.(jsx?|tsx?)$/, loader: 'ts-loader', options: { configFile: tsConfigFile }, exclude: /node_modules/ }
				),
			]
		},
		plugins: [
			// @ts-ignore
			env.production ? null : new (require('webpackbar'))(),
			new HashGeneratorPlugin({ filename: options.filename, output: path.join(workspace, options.path, 'version.json') }),
			env.analyze ? new (require('webpack-bundle-analyzer')).BundleAnalyzerPlugin() : null,
			// 相当于 C++ 的宏定义，键名会被替换为值的字符串
			new webpack.DefinePlugin({
				PRODUCTION: JSON.stringify(env.production == true),
				BUILD_TIME: JSON.stringify(Date.now()),
			}),
			// ESBuild 不会自动检查TS语法，这里添加相关插件
			env.esbuild ? (env.production == true || options.filename == 'bundle.js' ? tsChecker : null) : null,
			(env.production && env.obfuscate) ? new (require('webpack-obfuscator'))({ rotateStringArray: true, sourceMap: true }) : null,
			new webpack.ProvidePlugin({ Buffer: ['buffer', 'Buffer'] }),
			new webpack.SourceMapDevToolPlugin({
				// noSources: !env.production,
				filename: (env.production || !options.inlineSourceMap) ? `${options.filename}.map` : undefined
			}),
			env.circular ? require('./circular-dependency-plugin') : null,
		].filter(p => p != null),
		devtool: false,
		resolve: {
			extensions: ['.tsx', '.ts', '.js', 'glsl', 'md', 'txt'],
			plugins: [
				// @ts-ignore
				new (require('tsconfig-paths-webpack-plugin'))({ configFile: tsConfigFile }),
			],
			fallback: {
				buffer: require.resolve('buffer'),
			},
		},
		mode: env.production ? 'production' : 'development'
	});
}

module.exports = {
	parseBuildEnv,
	makeBuildAction,
};
