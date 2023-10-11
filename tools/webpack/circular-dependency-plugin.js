// @ts-nocheck
const CircularDependencyPlugin = require('circular-dependency-plugin');
const MAX_CYCLES = 5;
let numCyclesDetected = 0;

module.exports = new CircularDependencyPlugin({
	onStart({ compilation }) {
		numCyclesDetected = 0;
	},
	onDetected({ module: webpackModuleRecord, paths, compilation }) {
		compilation.warnings.push(new Error(paths.join(' -> ')));
	},
	onEnd({ compilation }) {
		if (numCyclesDetected > MAX_CYCLES) {
			compilation.errors.push(new Error(
				`Detected ${numCyclesDetected} cycles which exceeds configured limit of ${MAX_CYCLES}`
			));
		}
	},
});
