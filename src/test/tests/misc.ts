import UnitTest from "test/UnitTest";

export function testWebapiMisc() {
	const group = 'webapi.misc';
	const raw = 'Hello World!';
	UnitTest.test('btoa', btoa(raw) === 'SGVsbG8gV29ybGQh', group);
	UnitTest.test('atob', atob(btoa(raw)) === raw, group);
}
