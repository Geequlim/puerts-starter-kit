// @ts-nocheck
const path = require('path');
const webpack = require('webpack');
const workspace = path.resolve(__dirname);
const fs = require('fs');

/** 忽略编辑的第三方库 */
const externals = {
	csharp: "csharp",
	puerts: "puerts",
	path: "path",
	fs: "fs",
};

const entries = {
	'source-map-support': {
		input: 'src/addons/source-map-support.unity.js',
		path: 'Assets/StreamingAssets/scripts',
		filename: 'source-map-support.js'
	},
	bundle: {
		input: 'src/main.ts',
		path: 'Assets/StreamingAssets/scripts',
		filename: 'bundle.js'
	},
	webapi: {
		input: 'src/addons/webapi/index.unity.ts',
		path: 'Assets/StreamingAssets/scripts',
		filename: 'webapi.js'
	},
	test: {
		input: 'src/test/index.ts',
		path: 'Assets/StreamingAssets/scripts',
		filename: 'bundle.js'
	},
};

/** 生成版本信息 */
class HashGeneratorPlugin {
	constructor(options) {
		this.options = options;
	}

	apply(compiler) {
		compiler.hooks.afterEmit.tap("HashGenerator", (compilation) => {
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
			entry: 'bundle'
		};
	}
	env.production = JSON.parse(env.production || 'false');
	env.analyze = JSON.parse(env.analyze || 'false');
	env.esbuild = JSON.parse(env.esbuild || 'false');
	env.entry = env.entry || 'bundle';
	env.target = env.target || 'ES2020';
	console.log("Compile config:", env);


	const tsConfigFile = path.join(workspace, 'tsconfig.json');
	if (env.target) {
		const tsconfig = JSON.parse(fs.readFileSync(tsConfigFile).toString('utf-8'));
		tsconfig.compilerOptions.target = env.target;
		fs.writeFileSync(tsConfigFile, JSON.stringify(tsconfig, undefined, '\t'));
	}

	return ({
		entry: [path.join(workspace, entries[env.entry].input)],
		output: {
			path: path.join(workspace, entries[env.entry].path),
			filename: entries[env.entry].filename,
			libraryTarget: 'commonjs',
		},
		module: {
			rules: [
				{ test: /\.(md|txt|glsl)$/, use: "raw-loader" },
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
			env.production ? new webpack.DefinePlugin({}) : new (require('webpackbar'))(),
			env.analyze ? new (require('webpack-bundle-analyzer')).BundleAnalyzerPlugin() : new webpack.DefinePlugin({}),
			env.circularDetect ? new (require('circular-dependency-plugin'))(require('../tools/circular-dependency')) : new webpack.DefinePlugin({}),
			// 相当于 C++ 的宏定义，键名会被替换为值的字符串
			new webpack.DefinePlugin({
				PRODUCTION: JSON.stringify(env.production == true)
			}),
			// ESBuild 不会自动检查TS语法，这里添加相关插件
			env.esbuild ? new (require('fork-ts-checker-webpack-plugin'))() : new webpack.DefinePlugin({}),
			new webpack.ProvidePlugin({ Buffer: ['buffer', 'Buffer'] }),
			new webpack.SourceMapDevToolPlugin({
				noSources: !env.production,
				// sourceRoot: workspace,
				filename: env.production ? `${entries[env.entry].filename}.map` : undefined
			})
		],
		devtool: false,
		resolve: {
			extensions: ['.tsx', '.ts', '.js', 'glsl', 'md', 'txt'],
			plugins: [
				new (require('tsconfig-paths-webpack-plugin'))({ configFile: tsConfigFile }),
			],
			fallback: {
				buffer: require.resolve('buffer'),
			},
		},
		// devtool: env.production ? "source-map" : "inline-nosources-cheap-module-source-map",
		mode: env.production ? "production" : "development",
		externals,
	});
};
