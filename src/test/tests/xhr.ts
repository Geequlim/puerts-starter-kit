import UnitTest from "test/UnitTest";

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
		req.onload = () => {
			if (req.response) {
				resolve();
			}
			reject();
		};
		req.open("GET", "https://www.baidu.com");
		req.send();
		setTimeout(reject, 2000);
	}), group);

	UnitTest.test('ReadyState 状态', new Promise<void>((resolve, reject) => {
		const req = new XMLHttpRequest();
		const states: XMLHttpRequestReadyState[] = [];
		req.onreadystatechange = function(ev: Event) {
			states.push(this.readyState);
		};
		req.addEventListener("loadend", () => {
			if (states.length === 4) {
				resolve();
			}
			reject();
		});
		req.open("GET", "https://www.baidu.com");
		req.send();
		setTimeout(reject, 2000);
	}), group);

	UnitTest.test('请求进度', new Promise<void>((resolve, reject) => {
		const req = new XMLHttpRequest();
		req.onprogress = (evt: ProgressEvent) => {
			if (evt.loaded > 0) {
				resolve();
				req.abort();
			}
		};
		req.open("GET", "https://speed.hetzner.de/100MB.bin");
		req.send();
		setTimeout(reject, 2000);
	}), group);

	UnitTest.test('请求超时检测', new Promise((resolve, reject) => {
		const req = new XMLHttpRequest();
		req.timeout = 0;
		req.ontimeout = resolve;
		req.open("GET", "https://speed.hetzner.de/100MB.bin");
		req.send();
		setTimeout(reject, 2000);
	}), group);

	UnitTest.test('HTTP 错误', new Promise<void>((resolve, reject) => {
		const req = new XMLHttpRequest();
		req.onerror = ()=>{
			if (req.status > 400 && req.response) {
				resolve();
			} else {
				reject();
			}
		};
		req.open("GET", "http://www.example.org/example.txt");
		req.send();
		setTimeout(reject, 2000);
	}), group);

	UnitTest.test('loadstart', new Promise((resolve, reject) => {
		const req = new XMLHttpRequest();
		req.onloadstart = resolve;
		req.open("GET", "https://speed.hetzner.de/100MB.bin");
		req.send();
		setTimeout(()=> req.abort(), 100);
		setTimeout(reject, 2000);
	}), group);

	UnitTest.test('abort', new Promise((resolve, reject) => {
		const req = new XMLHttpRequest();
		req.onabort = resolve;
		req.open("GET", "https://speed.hetzner.de/100MB.bin");
		req.send();
		setTimeout(()=> req.abort(), 100);
		setTimeout(reject, 2000);
	}), group);

	UnitTest.test('application/json 解析为对象', new Promise<void>((resolve, reject) => {
		const req = new XMLHttpRequest();
		req.onloadend = function(evt) {
			if (typeof(this.response) === 'object') {
				resolve();
			} else {
				reject();
			}
		};
		req.open("GET", "https://postman-echo.com/get?foo1=bar1&foo2=bar2");
		req.send();
		setTimeout(reject, 2000);
	}), group);

	UnitTest.test('POST JSON 对象', new Promise<void>((resolve, reject) => {
		const req = new XMLHttpRequest();
		req.onload = function(evt) {
			if (typeof(this.response) === 'object' && this.response.data.hello === 'world') {
				resolve();
			} else {
				reject();
			}
		};
		req.open("POST", "https://postman-echo.com/post");
		req.send({
			"hello": "world"
		});
		setTimeout(reject, 2000);
	}), group);
}
