import UnitTest from "test/UnitTest";

export function testNPM() {
	const group = 'NPM 库';
	UnitTest.test("js-yaml", new Promise<unknown>((resolve, reject) => {
		const yaml = require('js-yaml');
		if (yaml) {
			const obj = yaml.load('a: 123') as { a: number; };
			resolve(obj.a === 123);
		} else {
			reject();
		}
	}), group);
}
