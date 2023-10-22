// @ts-nocheck
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const workspace = path.resolve(__dirname);

const scriptOutputRoot = 'Assets/Scripts/Resources/scripts';
const polyfillOutputRoot = 'Assets/Scripts/Resources/polyfills';

const entries = {
	'source-map-support': {
		input: 'src/framework/polyfills/source-map-support.unity.ts',
		path: polyfillOutputRoot,
		filename: 'source-map-support.mjs',
		externals: {
			fs: 'global polyfill:fs',
			path: 'global polyfill:path',
		}
	},
	'console': {
		input: 'src/framework/polyfills/console.unity.ts',
		path: polyfillOutputRoot,
		filename: 'console.mjs'
	},
	webapi: {
		input: 'src/framework/webapi/index.unity.ts',
		path: polyfillOutputRoot,
		filename: 'webapi.mjs'
	},
	bundle: {
		input: 'src/main.ts',
		path: scriptOutputRoot,
		filename: 'bundle.mjs'
	},
	'platform-editor': {
		input: 'src/framework/unity/platform/platform.unity.editor.ts',
		path: polyfillOutputRoot,
		filename: 'platform.editor.mjs'
	},
	tinysdk: {
		input: 'src/framework/tinysdk/index.ts',
		path: polyfillOutputRoot,
		filename: 'tinysdk.mjs',
		tsConfigFile: 'tsconfig.json'
	},
	editor: {
		input: 'src/editor.ts',
		path: scriptOutputRoot,
		filename: 'editor.bundle.mjs'
	},
	test: {
		input: 'src/test/index.ts',
		path: scriptOutputRoot,
		filename: 'bundle.mjs'
	},
};

entries['dev'] = [entries['platform-editor'], entries.tinysdk, entries.webapi, entries.bundle];

/** 生成版本信息 */
class HashGeneratorPlugin {
	constructor(options) {
		this.options = options;
	}

	apply(compiler) {
		compiler.hooks.afterEmit.tap('HashGenerator', (compilation) => {
			fs.writeFileSync(this.options.output, JSON.stringify({ hash: compilation.fullHash, time: Date.now() }, undefined, '\t'), 'utf-8');
		});
	}
}

module.exports = (env) => {
	if (!env) {
		env = {
			production: false,
			analyze: false,
			target: 'ES2020',
			esbuild: true,
			backend: 'v8',
			entry: 'bundle'
		};
	}
	env.production = JSON.parse(env.production || 'false');
	env.analyze = JSON.parse(env.analyze || 'false');
	env.esbuild = JSON.parse(env.esbuild || 'true');
	env.entry = env.entry || 'bundle';
	env.target = env.target || 'ES2020';
	env.backend = env.backend || 'v8';
	console.log('Compile config:', env);


	const isNode = env.backend === 'node';
	const isPollify = env.path === polyfillOutputRoot;

	const tsConfigFile = path.join(workspace, 'tsconfig.json');
	if (env.target) {
		const tsconfig = JSON.parse(fs.readFileSync(tsConfigFile).toString('utf-8'));
		tsconfig.compilerOptions.target = env.target;
		fs.writeFileSync(tsConfigFile, JSON.stringify(tsconfig, undefined, '\t'));
	}

	const targets = entries[env.entry];
	if (!targets) throw new Error(`未找到构建配置: ${env.entry}`);
	const options = Array.isArray(targets) ? targets : [targets];
	const ret = options.map(option => {
		const target = {
			target: 'es2020',
			entry: [path.join(workspace, option.input)],
			output: {
				path: path.join(workspace, option.path),
				filename: option.filename
			},
			module: {
				rules: [
					{ test: /\.(md|txt|glsl)$/, use: 'raw-loader' },
					{ test: /\.ya?ml$/, use: 'yaml-loader' },
					(env.esbuild ? { // ESBuild 构建
						test: /\.(jsx?|tsx?)$/,
						loader: 'esbuild-loader',
						exclude: /(node_modules|bower_components)/,
						options: { loader: 'tsx' }
					}
						// ts-loader 构建
						: { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ }
					),
				]
			},
			plugins: [
				new HashGeneratorPlugin({ output: path.join(entries.bundle.path, 'version.json') }),
				env.production ? null : new (require('webpackbar'))(),
				env.analyze ? new (require('webpack-bundle-analyzer')).BundleAnalyzerPlugin() : null,
				env.circularDetect ? new (require('circular-dependency-plugin'))(require('../tools/circular-dependency')) : null,
				// 相当于 C++ 的宏定义，键名会被替换为值的字符串
				new webpack.DefinePlugin({
					BUILD_TIME: JSON.stringify(Date.now()),
					PRODUCTION: JSON.stringify(env.production == true)
				}),
				// ESBuild 不会自动检查TS语法，这里添加相关插件
				env.esbuild && option === entries.bundle ? new (require('fork-ts-checker-webpack-plugin'))() : null,
				new webpack.SourceMapDevToolPlugin({
					noSources: !env.production,
					filename: env.production ? `${option.filename}.map` : undefined
				})
			].filter(p => p != null),
			devtool: false,
			resolve: {
				extensions: ['.tsx', '.ts', '.js', 'glsl', 'md', 'txt'],
				plugins: [
					new (require('tsconfig-paths-webpack-plugin'))({ configFile: tsConfigFile }),
				],
				fallback: {
					util: require.resolve('util/')
				}
			},
			mode: env.production ? 'production' : 'development',
			externals: [
				{
					csharp: 'global polyfill:csharp',
					puerts: 'global polyfill:puerts',
					path: 'global polyfill:path'
				},
				option.externals,
			].filter(e => e),
		};

		if (isNode) {
			target.target = 'node';
			target.externals.push(nodeExternals({}));
		} else {
			target.plugins.push(new webpack.ProvidePlugin({ Buffer: ['buffer', 'Buffer'] }));
		}

		if (isPollify) {
			target.output.library = { type: 'module' };
		} else {
			target.output.library = { type: 'global', name: '$entry' };
		}

		if (target.target === 'es2020') {
			target.experiments = { outputModule: true };
		}
		return target;
	});
	return ret;
};
