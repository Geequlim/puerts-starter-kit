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
			esbuild: false,
			backend: 'v8',
			entry: 'bundle'
		};
	}
	env.production = JSON.parse(env.production || 'false');
	env.analyze = JSON.parse(env.analyze || 'false');
	env.esbuild = JSON.parse(env.esbuild || 'false');
	env.entry = env.entry || 'bundle';
	env.target = env.target || 'ES2020';
	env.backend = env.backend || 'v8';
	console.log('Compile config:', env);

	const entry = entries[env.entry];
	const isNode = env.backend === 'node';
	const isPollify = env.path === polyfillOutputRoot;

	const tsConfigFile = path.join(workspace, 'tsconfig.json');
	if (env.target) {
		const tsconfig = JSON.parse(fs.readFileSync(tsConfigFile).toString('utf-8'));
		tsconfig.compilerOptions.target = env.target;
		fs.writeFileSync(tsConfigFile, JSON.stringify(tsconfig, undefined, '\t'));
	}

	const target = {
		target: 'es2020',
		entry: [path.join(workspace, entries[env.entry].input)],
		output: {
			path: path.join(workspace, entries[env.entry].path),
			filename: entries[env.entry].filename
		},
		module: {
			rules: [
				{ test: /\.(md|txt|glsl)$/, use: 'raw-loader' },
				{ test: /\.ya?ml$/, type: 'json', use: 'yaml-loader' },
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
				PRODUCTION: JSON.stringify(env.production == true)
			}),
			// ESBuild 不会自动检查TS语法，这里添加相关插件
			env.esbuild ? new (require('fork-ts-checker-webpack-plugin'))() : null,
			new webpack.SourceMapDevToolPlugin({
				noSources: !env.production,
				filename: env.production ? `${entries[env.entry].filename}.map` : undefined
			})
		].filter(p => p != null),
		devtool: false,
		resolve: {
			extensions: ['.tsx', '.ts', '.js', 'glsl', 'md', 'txt'],
			plugins: [
				new (require('tsconfig-paths-webpack-plugin'))({ configFile: tsConfigFile }),
			]
		},
		mode: env.production ? 'production' : 'development',
		externals: [
			{
				csharp: 'global polyfill:csharp',
				puerts: 'global polyfill:puerts',
			},
			entry.externals,
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
};
