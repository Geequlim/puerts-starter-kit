
export type TestBlock = boolean | (() => boolean) | Promise<unknown>;

interface ITestEntry {
	description: string;
	blcok: TestBlock;
}

const TEST_ENTRIES = new Map<string, ITestEntry[]>();

function test(description: string, blcok: TestBlock, group: string = 'default') {
	const entries: ITestEntry[] = TEST_ENTRIES.get(group) || [ ];
	entries.push({ description, blcok });
	TEST_ENTRIES.set(group, entries);
}

function runEntry(entry: ITestEntry): Promise<boolean> {
	return new Promise((resolve, reject) => {
		switch (typeof(entry.blcok)) {
			case 'boolean':
				resolve(entry.blcok);
				break;
			case 'function':
				resolve(entry.blcok());
				break;
			case 'object':
				if (entry.blcok instanceof Promise) {
					entry.blcok.then(()=>{
						resolve(true);
					}).catch(err=>{
						resolve(false);
					});
				}
				break;
			default:
				resolve(false);
				break;
		}
	});
}

async function run() {
	let count = 0;
	let passed = 0;
	for (const [group, entries] of TEST_ENTRIES) {
		console.log(`开始测试 ${group}`);
		count += entries.length;
		let groupCount = 0;
		for (let i = 0; i < entries.length; i++) {
			const entry = entries[i];
			const ret = await runEntry(entry);
			if (ret) {
				passed++;
				groupCount++;
				console.log(`\t[${i+1}/${entries.length}][ √ ] ${entry.description}`);
			} else {
				console.error(`\t[${i+1}/${entries.length}][ X ] ${entry.description}`);
			}
		}
		const logFunc2 = groupCount == entries.length ? console.log: console.warn;
		logFunc2(`\t${group} 测试完毕: ${groupCount}/${entries.length} 通过测试`);
	}
	const logFunc = passed == count ? console.log: console.warn;
	logFunc(`测试完毕: ${passed}/${count} 通过测试`);
}

export default {
	test,
	run,
};
