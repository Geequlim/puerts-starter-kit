export interface IURL {
	url: string;
	hostname?: string;
	path?: string;
	port?: number;
	protocal?: string;
}
// @ts-ignore
import Url from './thirdpart/url-parser/url-parser'

export function parse_url(url: string): IURL {
	// const regex = /^([a-z]+?)\:\/\/([^\/?#:]+)(:(\d+))?(?:[\/?#]|$)(.*)/i;
	// const matches = url.match(regex);
	// if (matches) {
	// 	return {
	// 		url,
	// 		protocal: matches[1],
	// 		hostname: matches[2],
	// 		port: matches[4] ? parseInt(matches[4]) : undefined,
	// 		path: matches[5],
	// 	};
	// } else {
	// 	return {
	// 		url
	// 	};
	// }
	const u = new Url(url);
	u.url = url;
	return u;
}


