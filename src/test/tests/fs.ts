import { UnityEngine } from 'csharp';
import { UnityStreamingAssetsFileSystem, UnityFileSystem } from 'framework/unity/tiny/utils/fs/fs.unity';
import path from 'path';
import UnitTest from 'test/UnitTest';

export function testFileSystem() {

	const group = 'fs';
	const fs = new UnityFileSystem();

	const root = path.join(UnityEngine.Application.persistentDataPath, 'test', 'tmp');
	UnitTest.test('fs.mkdir', () => fs.mkdir(root, true), group);
	UnitTest.test('fs.existsSync', () => fs.existsSync(root), group);

	const textFile = path.join(root, 'data.txt');
	const textContent = 'Hello World!';
	const binFile = path.join(root, 'data.bin');
	const binData = new ArrayBuffer(256);
	const binView = new Uint8Array(binData);
	for (let i = 0; i < binView.length; i++) {
		binView[i] = i;
	}

	UnitTest.test('fs.writeFile text', () => fs.writeFile(textFile, textContent, 'utf-8'), group);
	UnitTest.test('fs.writeFile binary', () => fs.writeFile(binFile, binData, 'binary'), group);

	UnitTest.test('fs.stat directory', async () => {
		const stat = await fs.stat(root);
		return stat.isDirectory();
	}, group);

	UnitTest.test('fs.stat file', async () => {
		const stat = await fs.stat(binFile);
		return stat.isFile() && stat.size === binView.length;
	}, group);

	UnitTest.test('fs.readFile text', async () => {
		const text = await fs.readFile(textFile, 'utf-8');
		return text === textContent;
	}, group);

	UnitTest.test('fs.readFile binary', async () => {
		const buffer = await fs.readFile(binFile, 'binary');
		const view = new Uint8Array(buffer);
		if (view.length !== binView.length) {
			return false;
		}
		for (let i = 0; i < view.length; i++) {
			if (view[i] !== binView[i]) {
				return false;
			}
		}
		return true;
	}, group);
	UnitTest.test('fs.rmdir', () => fs.rmdir(root, true), group);

	const streamingFS = new UnityStreamingAssetsFileSystem();
	UnitTest.test('fs.readFile streaming', async () => {
		const text = await streamingFS.readFile('version.json', 'utf-8');
		const json = JSON.parse(text);
		return json && typeof json === 'object';
	}, group);
}
