export interface IURL {
	url: string;
	hostname?: string;
	path?: string;
	port?: number;
	protocal?: string;
}
import parse from 'url-parse';
export function parse_url(url: string): IURL {
	const ret = parse(url);
	Object.assign(ret, { url });
	return ret as unknown as IURL;
}


