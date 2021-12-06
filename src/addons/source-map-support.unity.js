// @ts-nocheck
const csharp = require('csharp');
const puerts = require('puerts');
const fs = {
	existsSync(path) {
		return csharp.System.IO.File.Exists(path);
	},
	readFileSync(path) {
		return csharp.System.IO.File.ReadAllText(path);
	},
};
const path = {
	dirname(path) {
		return csharp.System.IO.Path.GetDirectoryName(path).replace(/\\/g, "/");
	},
	resolve(dir, url) {
		while (url.startsWith("../")) {
			dir = csharp.System.IO.Path.GetDirectoryName(dir);
			url = url.substr(3);
		}
		return `${dir}/${url}`.replace(/\\/g, "/");
	}
};
puerts.registerBuildinModule("fs", fs);
puerts.registerBuildinModule("path", path);
require('source-map-support').install();
