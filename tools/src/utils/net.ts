const os = require('os');

export function getLocalIPv4() {
	let error: Error;
	try {
		// networkInterfaces这个方法详见：http://nodejs.cn/api/os.html#os_os_networkinterfaces
		const ipv4: string[] = [];
		const ifaces = os.networkInterfaces();
		for (const dev in ifaces) {
			for (const details of ifaces[dev] as { family: string; address: string; internal: boolean; }[]) {
				// 寻找IPv4协议族，并且地址不是本地地址或者回环地址的地址即可。
				if ((details.family === 'IPv4' || details.family == '4') && details.address !== '127.0.0.1' && !details.internal) {
					ipv4.push(details.address);
				}
			}
		}
		if (ipv4.length) {
			ipv4.sort((a, b) => {
				const p = (addr: string) => addr.startsWith('192.') ? -1 : 0;
				return p(a) - p(b);
			});
			return ipv4[0];
		}
	} catch (e) {
		error = e;
	}
	console.warn('获取局域网地址出错', error);
	return 'localhost';
}
