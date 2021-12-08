import UnitTest from "test/UnitTest";

export function testTimer() {
	const group = 'timer';
	UnitTest.test('setTimeout', new Promise((resolve, reject) => {
		setTimeout(resolve, 1000);
	}), group);

	UnitTest.test('setInterval', new Promise<void>((resolve, reject) => {
		let sum = 0;
		let id = setInterval(() => {
			sum++;
			if (sum >= 3) {
				resolve();
				clearInterval(id);
			}
		}, 100);
	}), group);

	UnitTest.test('clearTimeout', new Promise<void>((resolve, reject) => {
		let value = 0;
		const id = setTimeout(() => value = 100);
		clearTimeout(id);
		setTimeout(() => {
			if (value === 0) {
				resolve();
			} else {
				reject();
			}
		}, 100);
	}), group);

	UnitTest.test('定时器传参', new Promise<void>((resolve, reject) => {
		setTimeout((a: number, b: number) => {
			if (a === 1 && b === 2) {
				resolve();
			} else {
				reject();
			}
		}, 100, 1, 2);
	}), group);
}
