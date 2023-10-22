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
	const file100MB = 'http://ping.virtua.cloud/100MB.bin';

	UnitTest.test('请求 https://www.baidu.com', () => {
		return new Promise<void>((resolve, reject) => {
			const req = new XMLHttpRequest();
			const timer = setTimeout(reject, 3000);
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
		});
	}, group);

	UnitTest.test('ReadyState 状态', () => {
		return new Promise<void>((resolve, reject) => {
			const timer = setTimeout(reject, 3000);
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
		});
	}, group);

	UnitTest.test('请求进度', () => new Promise<void>((resolve, reject) => {
		const req = new XMLHttpRequest();
		const timer = setTimeout(reject, 3000);
		req.onprogress = (evt: ProgressEvent) => {
			if (evt.loaded > 0) {
				resolve();
				req.abort();
				clearTimeout(timer);
			}
		};
		req.open('GET', file100MB);
		req.send();
	}), group);

	UnitTest.test('请求超时检测', () => new Promise<void>((resolve, reject) => {
		const timer = setTimeout(reject, 2000);
		const req = new XMLHttpRequest();
		req.timeout = 50;
		req.ontimeout = () => {
			clearTimeout(timer);
			resolve();
		};
		req.open('GET', file100MB);
		req.send();
	}), group);

	UnitTest.test('HTTP 错误', () => new Promise<void>((resolve, reject) => {
		const timer = setTimeout(reject, 3000);
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

	UnitTest.test('loadstart', () => new Promise<void>((resolve, reject) => {
		const timer = setTimeout(reject, 3000);
		const req = new XMLHttpRequest();
		req.onloadstart = () => {
			resolve();
			clearTimeout(timer);
		};
		req.open('GET', 'https://www.baidu.com');
		req.send();
		setTimeout(() => req.abort(), 100);
	}), group);

	UnitTest.test('abort', () => new Promise<void>((resolve, reject) => {
		const timer = setTimeout(reject, 2000);
		const req = new XMLHttpRequest();
		req.onabort = () => {
			resolve();
			clearTimeout(timer);
		};
		req.open('GET', file100MB);
		req.send();
		setTimeout(() => req.abort(), 100);
	}), group);

	UnitTest.test('application/json 解析为对象', () => new Promise<void>((resolve, reject) => {
		const timer = setTimeout(reject, 3000);
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

	UnitTest.test('自定义Header', () => new Promise<void>((resolve, reject) => {
		const timer = setTimeout(reject, 3000);
		const req = new XMLHttpRequest();
		req.onloadend = function (evt) {
			clearTimeout(timer);
			if (this.response && typeof (this.response) === 'object' && this.response.headers['x-tiny'] === 'good luck') {
				resolve();
			} else {
				reject();
			}
		};
		req.setRequestHeader('x-tiny', 'good luck');
		req.open('GET', 'https://postman-echo.com/get');
		req.send();
	}), group);

	UnitTest.test('POST JSON 对象', () => new Promise<void>((resolve, reject) => {
		const timer = setTimeout(reject, 3000);
		const req = new XMLHttpRequest();
		req.onload = function (evt) {
			clearTimeout(timer);
			if (typeof (this.response) === 'object') {
				if (this.response.data && this.response.data.hello === 'world' && this.response.args.foo === 'bar') {
					resolve();
				} else {
					reject();
				}
			} else {
				reject();
			}
		};
		req.open('POST', 'https://postman-echo.com/post?foo=bar');
		req.setRequestHeader('Content-Type', 'application/json');
		req.send(JSON.stringify({ 'hello': 'world' }));
	}), group);

	UnitTest.test('POST Form 表单', () => new Promise<void>((resolve, reject) => {
		const timer = setTimeout(reject, 3000);
		const req = new XMLHttpRequest();
		req.onload = function (evt) {
			clearTimeout(timer);
			if (typeof (this.response) === 'object') {
				if (this.response.form && this.response.form.hello === 'world' && this.response.form.foo === 'bar') {
					resolve();
				} else {
					reject();
				}
			} else {
				reject();
			}
		};
		req.open('POST', 'https://postman-echo.com/post');
		req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		req.send(`hello=world&foo=bar`);
	}), group);

	UnitTest.test('GET ArrayBuffer 图像内容', () => new Promise<void>((resolve, reject) => {
		const timer = setTimeout(reject, 5000);
		const req = new XMLHttpRequest();
		req.onload = function (evt) {
			clearTimeout(timer);
			if (this.response instanceof ArrayBuffer) {
				const PNG = [0x89, 0x50, 0x4E, 0x47];
				const view = new Uint8Array(this.response);
				for (let i = 0; i < PNG.length; i++) {
					if (PNG[i] !== view[i]) {
						reject();
						return;
					}
				}
				resolve();
			} else {
				reject();
			}
		};
		req.open('POST', 'https://res.wx.qq.com/mpres/zh_CN/htmledition/pages/login/loginpage/images/bg_banner.5951b696977.png');
		req.send(`hello=world&foo=bar`);
	}), group);

	UnitTest.test('PUT ArrayBuffer', () => new Promise<void>((resolve, reject) => {
		const timer = setTimeout(reject, 5000);
		const req = new XMLHttpRequest();
		const PNG = [0x50, 0x4E, 0x47];
		const view = new Uint8Array(PNG.length);
		for (let i = 0; i < PNG.length; i++) {
			view[i] = PNG[i];
		}
		const buffer = view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength);
		req.onload = function (evt) {
			clearTimeout(timer);
			if (this.response && typeof this.response == 'object') {
				const body = this.response.body;
				if (typeof body === 'string' && body.length == PNG.length) {
					for (let i = 0; i < PNG.length; i++) {
						if (PNG[i] !== body.charCodeAt(i)) {
							reject();
							return;
						}
					}
				}
				resolve();
			} else {
				reject();
			}
		};
		req.setRequestHeader('Content-Type', 'application/octet-stream');
		req.open('PUT', 'https://echo.zuplo.io/');
		req.send(buffer);
	}), group);

	UnitTest.test('Status Code 404', () => new Promise<void>((resolve, reject) => {
		const timer = setTimeout(reject, 3000);
		const req = new XMLHttpRequest();
		req.onloadend = function (evt) {
			clearTimeout(timer);
			if (this.status === 404) {
				resolve();
			} else {
				reject();
			}
		};
		req.open('GET', 'https://postman-echo.com/get233');
		req.send();
	}), group);
}
