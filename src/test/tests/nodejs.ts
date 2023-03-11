import { UnityEngine } from 'csharp';
import { type PlatformPath } from 'path';
import UnitTest from "test/UnitTest";

function normalizePath(path: string): string {
	return path.replace(/\\/g, '/');
}

export function testNodeJS() {
	const group = 'NodeJS';
	let inNodeJS = typeof process.platform === 'string' && typeof process.versions === 'object';
	UnitTest.test("NodeJS 环境", inNodeJS, group);
	if (inNodeJS) {
		const path: PlatformPath = require('path');
		UnitTest.test("NodeJS 内置模块", typeof path != 'undefined' && path != null, group);
		const projectRoot = normalizePath(path.dirname(UnityEngine.Application.dataPath));
		const cwd = normalizePath(process.cwd());
		UnitTest.test("工作目录在项目根目录", projectRoot === cwd, group);

		UnitTest.test("NodeJS 第三方模块", new Promise<unknown>((resolve, reject) => {
			const yaml = require('js-yaml');
			if (yaml) {
				const obj = yaml.load('a: 1') as { a: number; };
				resolve(obj.a === 1);
			} else {
				reject();
			}
		}), group);

		// 会导致 Unity 崩溃
		// UnitTest.test("NodeJS 第三方C++模块", new Promise((resolve, reject) => {
		// 	const sqlite3 = require('sqlite3').verbose() as sqlite3;
		// 	const db = new sqlite3.Database(':memory:');
		// 	db.serialize(() => {
		// 		db.run("CREATE TABLE lorem (info TEXT)");
		// 		const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
		// 		for (let i = 0; i < 10; i++) {
		// 			stmt.run("Ipsum " + i);
		// 		}
		// 		stmt.finalize();
		// 		db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
		// 			console.log(row.id + ": " + row.info);
		// 		});
		// 	});
		// 	db.close();
		// }), group);
		//
	}
}
