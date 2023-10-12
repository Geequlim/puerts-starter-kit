const path = require('path');
const workspace = path.resolve(__dirname);
const { makeBuildAction, parseBuildEnv } = require('./webpack/webpack-tools');
const nodeExternals = require('webpack-node-externals');

const entries = {
	tools: {
		input: ['source-map-support/register', 'esm-hook', 'src/index.ts'],
		path: 'bin',
		filename: 'cli.js',
		tsConfigFile: 'tsconfig.json',
		rawOptions: {
			target: 'node',
			devtool: false,
			mode: 'none',
			externals: [nodeExternals({})],
			experiments: {
				asyncWebAssembly: true,
			},
		}
	}
};

module.exports = (env) => {
	env = parseBuildEnv(env);
	console.log('Webpack Build Options:', env);
	env.entry = env.entry || 'tools';
	const target = entries[env.entry];
	if (!target) throw new Error(`未找到构建配置: ${env.entry}`);
	const options = Array.isArray(target) ? target : [target];
	return options.map(option => makeBuildAction(workspace, env, option));
};
