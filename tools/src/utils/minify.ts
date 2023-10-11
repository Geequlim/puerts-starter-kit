import * as fs from 'fs';

async function minifyFile(input: string, output: string, sourceMap = false) {
	const uglifyjs = require('uglify-js');
	const inputParam = {};
	inputParam[input] = fs.readFileSync(input).toString();
	const ret = await uglifyjs.minify(inputParam, { sourceMap, mangle: true, compress: false });
	if (ret.error) {
		throw ret.error;
	}
	fs.writeFileSync(output, ret.code);
	if (ret.map) {
		fs.writeFileSync(output + '.map', ret.map);
	}
}

export async function minify(input: string, output?: string, sourceMap = false, ignoreExists = false) {
	output = output || input.replace('.js', '.min.js');
	if (!fs.existsSync(output) || ignoreExists) {
		await minifyFile(input, output, sourceMap);
	}
}
