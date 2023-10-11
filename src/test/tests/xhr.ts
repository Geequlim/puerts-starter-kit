import UnitTest from 'test/UnitTest';

enum XMLHttpRequestReadyState {
	UNSENT = 0,
	OPENED = 1,
	HEADERS_RECEIVED = 2,
	LOADING = 3,
	DONE = 4
}

export function testXHR() {
	const group = 'XMLHTTPRequest';

	UnitTest.test('请求 https://www.baidu.com', new Promise<void>((resolve, reject) => {
		const req = new XMLHttpRequest();
		const timer = setTimeout(reject, 2000);
		req.onload = () => {
			clearTimeout(timer);
			if (req.response) {
				resolve();
				return;
			}
			reject();
		};
		req.open('GET', 'https://www.baidu.com');
		req.send();

	}), group);

	UnitTest.test('ReadyState 状态', new Promise<void>((resolve, reject) => {
		const timer = setTimeout(reject, 2000);
		const req = new XMLHttpRequest();
		const states: XMLHttpRequestReadyState[] = [];
		req.onreadystatechange = function (ev: Event) {
			states.push(this.readyState);
		};
		req.addEventListener('loadend', () => {
			clearTimeout(timer);
			if (states.length === 4) {
				resolve();
				return;
			}
			reject();
		});
		req.open('GET', 'https://www.baidu.com');
		req.send();
	}), group);

	UnitTest.test('请求进度', new Promise<void>((resolve, reject) => {
		const req = new XMLHttpRequest();
		const timer = setTimeout(reject, 3000);
		req.onprogress = (evt: ProgressEvent) => {
			if (evt.loaded > 0) {
				resolve();
				req.abort();
				clearTimeout(timer);
			}
		};
		req.open('GET', 'https://speed.hetzner.de/100MB.bin');
		req.send();
	}), group);

	UnitTest.test('请求超时检测', new Promise<void>((resolve, reject) => {
		const timer = setTimeout(reject, 2000);
		const req = new XMLHttpRequest();
		req.timeout = 0;
		req.ontimeout = () => {
			clearTimeout(timer);
			resolve();
		};
		req.open('GET', 'https://speed.hetzner.de/100MB.bin');
		req.send();
	}), group);

	UnitTest.test('HTTP 错误', new Promise<void>((resolve, reject) => {
		const timer = setTimeout(reject, 2000);
		const req = new XMLHttpRequest();
		req.onerror = () => {
			clearTimeout(timer);
			if (req.status > 400 && req.response) {
				resolve();
			} else {
				reject();
			}
		};
		req.open('GET', 'http://www.example.org/example.txt');
		req.send();
	}), group);

	UnitTest.test('loadstart', new Promise<void>((resolve, reject) => {
		const timer = setTimeout(reject, 2000);
		const req = new XMLHttpRequest();
		req.onloadstart = () => {
			resolve();
			clearTimeout(timer);
		};
		req.open('GET', 'https://speed.hetzner.de/100MB.bin');
		req.send();
		setTimeout(() => req.abort(), 100);
	}), group);

	UnitTest.test('abort', new Promise<void>((resolve, reject) => {
		const timer = setTimeout(reject, 2000);
		const req = new XMLHttpRequest();
		req.onabort = () => {
			resolve();
			clearTimeout(timer);
		};
		req.open('GET', 'https://speed.hetzner.de/100MB.bin');
		req.send();
		setTimeout(() => req.abort(), 100);
	}), group);

	UnitTest.test('application/json 解析为对象', new Promise<void>((resolve, reject) => {
		const timer = setTimeout(reject, 2000);
		const req = new XMLHttpRequest();
		req.onloadend = function (evt) {
			clearTimeout(timer);
			if (this.response && typeof (this.response) === 'object') {
				resolve();
			} else {
				reject();
			}
		};
		req.open('GET', 'https://postman-echo.com/get?foo1=bar1&foo2=bar2');
		req.send();
	}), group);

	UnitTest.test('POST JSON 对象', new Promise<void>((resolve, reject) => {
		const timer = setTimeout(reject, 2000);
		const req = new XMLHttpRequest();
		req.onload = function (evt) {
			clearTimeout(timer);
			if (typeof (this.response) === 'object' && this.response.data.hello === 'world') {
				resolve();
			} else {
				reject();
			}
		};
		req.open('POST', 'https://postman-echo.com/post');
		req.send({
			'hello': 'world'
		});
	}), group);
}
