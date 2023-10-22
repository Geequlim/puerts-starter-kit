import UnitTest from 'test/UnitTest';

export async function testStorage() {
	const group = 'Storage';
	UnitTest.test('sessionStorage 存在', sessionStorage instanceof Storage, group);
	sessionStorage.setItem('hello', 'Hello World');
	UnitTest.test('sessionStorage 存取值', sessionStorage.getItem('hello') === 'Hello World', group);
	UnitTest.test('localStorage 存在', localStorage instanceof Storage, group);
	UnitTest.test('localStorage 取值', localStorage.getItem('hello') === 'Hello World', group);
	localStorage.setItem('hello', 'Hello World');
	UnitTest.test('localStorage 顺序', localStorage.key(localStorage.length - 1) === 'hello', group);
}
