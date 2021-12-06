import { ProgressEvent, EventTarget, Event, AddEventListenerOptions, EventListenerOptions } from "../event";
export type XMLHttpRequestResponseType = "" | "arraybuffer" | "blob" | "document" | "json" | "text";
export type XMLHttpRequestMethod = "GET" | "POST" | "DELETE";
export type BodyInit = string | Record<string, any>;

export interface XMLHttpRequestEventTargetEventMap {
	"abort": ProgressEvent<XMLHttpRequestEventTarget>;
	"error": ProgressEvent<XMLHttpRequestEventTarget>;
	"load": ProgressEvent<XMLHttpRequestEventTarget>;
	"loadend": ProgressEvent<XMLHttpRequestEventTarget>;
	"loadstart": ProgressEvent<XMLHttpRequestEventTarget>;
	"progress": ProgressEvent<XMLHttpRequestEventTarget>;
	"timeout": ProgressEvent<XMLHttpRequestEventTarget>;
}

export interface XMLHttpRequestEventMap extends XMLHttpRequestEventTargetEventMap {
	"readystatechange": Event;
}

export class XMLHttpRequestEventTarget extends EventTarget {

	onabort: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
	onerror: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
	onload: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
	onloadend: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
	onloadstart: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
	onprogress: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
	ontimeout: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;

	addEventListener<K extends keyof XMLHttpRequestEventTargetEventMap>(type: K, listener: (this: XMLHttpRequestEventTarget, ev: XMLHttpRequestEventTargetEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void {
		super.addEventListener(type, listener, options);
	}

	removeEventListener<K extends keyof XMLHttpRequestEventTargetEventMap>(type: K, listener: (this: XMLHttpRequestEventTarget, ev: XMLHttpRequestEventTargetEventMap[K]) => any, options?: boolean | EventListenerOptions): void {
		super.addEventListener(type, listener, options);
	}
}

export class XMLHttpRequestUpload extends XMLHttpRequestEventTarget {}

export enum XMLHttpRequestReadyState {
	UNSENT,
	OPENED,
	HEADERS_RECEIVED,
	LOADING,
	DONE,
}

/** Use XMLHttpRequest (XHR) objects to interact with servers. You can retrieve data from a URL without having to do a full page refresh. This enables a Web page to update just part of a page without disrupting what the user is doing. */
export class XMLHttpRequest extends XMLHttpRequestEventTarget {

	onreadystatechange: ((this: XMLHttpRequest, ev: Event) => any) | null;

	/**
	 * Returns client's state.
	 */
	get readyState(): XMLHttpRequestReadyState { return this._readyState; }
	set readyState(value: XMLHttpRequestReadyState) {
		if (value != this._readyState) {
			this._readyState = value;
			if (this.onreadystatechange) {
				let event = new Event('readystatechange');
				this.onreadystatechange.call(this, event);
				this.dispatchEvent(event);
			}
		}
	}

	protected _readyState: XMLHttpRequestReadyState;

	/**
	 * Returns the response's body.
	 */
	get response(): any { return this._response; }
	protected _response: any;

	/**
	 * Returns the text response.
	 *
	 * Throws an "InvalidStateError" DOMException if responseType is not the empty string or "text".
	 */
	readonly responseText: string;

	/**
	 * Returns the response type.
	 *
	 * Can be set to change the response type. Values are: the empty string (default), "arraybuffer", "blob", "document", "json", and "text".
	 *
	 * When set: setting to "document" is ignored if current global object is not a Window object.
	 *
	 * When set: throws an "InvalidStateError" DOMException if state is loading or done.
	 *
	 * When set: throws an "InvalidAccessError" DOMException if the synchronous flag is set and current global object is a Window object.
	 */
	responseType: XMLHttpRequestResponseType;

	readonly responseURL: string;

	/**
	 * Returns the document response.
	 *
	 * Throws an "InvalidStateError" DOMException if responseType is not the empty string or "document".
	 */
	readonly responseXML: string | null;
	readonly status: number;
	readonly statusText: string;
	/**
	 * Can be set to a time in milliseconds. When set to a non-zero value will cause fetching to terminate after the given time has passed. When the time has passed, the request has not yet completed, and the synchronous flag is unset, a timeout event will then be dispatched, or a "TimeoutError" DOMException will be thrown otherwise (for the send() method).
	 *
	 * When set: throws an "InvalidAccessError" DOMException if the synchronous flag is set and current global object is a Window object.
	 */
	timeout: number;

	/**
	 * Returns the associated XMLHttpRequestUpload object. It can be used to gather transmission information when data is transferred to a server.
	 */
	get upload(): XMLHttpRequestUpload { return this._upload; }
	protected _upload: XMLHttpRequestUpload;

	/**
	 * True when credentials are to be included in a cross-origin request. False when they are to be excluded in a cross-origin request and when cookies are to be ignored in its response. Initially false.
	 *
	 * When set: throws an "InvalidStateError" DOMException if state is not unsent or opened, or if the send() flag is set.
	 */
	withCredentials: boolean;

	/**
	 * Cancels any network activity.
	 */
	abort(): void {}

	getAllResponseHeaders(): string { return ""; }

	getResponseHeader(name: string): string | null { return null; }

	/**
	 * Sets the request method, request URL, and synchronous flag.
	 *
	 * Throws a "SyntaxError" DOMException if either method is not a valid HTTP method or url cannot be parsed.
	 *
	 * Throws a "SecurityError" DOMException if method is a case-insensitive match for `CONNECT`, `TRACE`, or `TRACK`.
	 *
	 * Throws an "InvalidAccessError" DOMException if async is false, current global object is a Window object, and the timeout attribute is not zero or the responseType attribute is not the empty string.
	 */
	open(method: XMLHttpRequestMethod, url: string, async?: boolean, username?: string | null, password?: string | null): void {}

	/**
	 * Acts as if the `Content-Type` header value for response is mime. (It does not actually change the header though.)
	 *
	 * Throws an "InvalidStateError" DOMException if state is loading or done.
	 */
	overrideMimeType(mime: string): void {
		this._overrided_mime = mime;
	}
	protected _overrided_mime: string;

	/**
	 * Initiates the request. The body argument provides the request body, if any, and is ignored if the request method is GET or HEAD.
	 *
	 * Throws an "InvalidStateError" DOMException if either state is not opened or the send() flag is set.
	 */
	send(body?: BodyInit | null): void {}

	/**
	 * Combines a header in author request headers.
	 *
	 * Throws an "InvalidStateError" DOMException if either state is not opened or the send() flag is set.
	 *
	 * Throws a "SyntaxError" DOMException if name is not a header name or if value is not a header value.
	 */
	setRequestHeader(name: string, value: string): void {}

	addEventListener<K extends keyof XMLHttpRequestEventMap>(type: K, listener: (this: XMLHttpRequest, ev: XMLHttpRequestEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void {
		super.addEventListener(type as any, listener, options);
	}

	removeEventListener<K extends keyof XMLHttpRequestEventMap>(type: K, listener: (this: XMLHttpRequest, ev: XMLHttpRequestEventMap[K]) => any, options?: boolean | EventListenerOptions): void {
		super.removeEventListener(type as any, listener, options);
	}

}


import { IURL, parse_url } from "./url";
import MIMEType from "./thirdpart/mimetype/mime-type";
import * as querystring from "./thirdpart/querystring/querystring";

const { ResponseCode, Status, Method } = godot.HTTPClient;

const CRLF = '\r\n';
const RequestMethodMap: {[key: string]: number } = {
	"GET": Method.METHOD_GET,
	"POST": Method.METHOD_POST,
	"DELETE": Method.METHOD_DELETE,
};

interface InternalRequetTask {
	path: string;
	method: number;
	body?: BodyInit;
	length?: number;
	loaded_length?: number;
	update_time?: number;
}

interface InternalResponse {
	data: godot.PoolByteArray;
	headers: object;
	code: number;
	headers_list: string[];
}

class GodotXMLHttpRequest extends XMLHttpRequest {
	readonly client: godot.HTTPClient;

	public get url() : Readonly<IURL> { return this._url; }
	protected _url : IURL;

	get internal_response(): Readonly<InternalResponse> { return this._internal_response; }
	protected _internal_response: InternalResponse;

	private _poll_task_id = -1;
	protected _method: XMLHttpRequestMethod;
	protected _request_headers: {[key: string]: string} = {};
	protected _pending_task: InternalRequetTask;
	protected _loading_task: InternalRequetTask
	protected _connec_start_time: number;

	constructor() {
		super();
		this.client = new godot.HTTPClient();
		this.client.read_chunk_size = 81920;
		this._readyState = XMLHttpRequestReadyState.UNSENT;
	}

	get status(): number {
		return this._internal_response?.code;
	}

	get responseText(): string {
		if (this.responseType === 'text' || this.responseType === 'json' || this.responseType === '') {
			if (this.internal_response) {
				return this.internal_response.data.get_string_from_utf8();
			}
		}
		return null;
	}

	open(method: XMLHttpRequestMethod, url: string, async?: boolean, username?: string | null, password?: string | null): void {
		this._url = parse_url(url);
		if (!this.url.port) {
			this._url.port = this.url.protocal === 'https' ? 443 : 80;
		}
		this._method = method;
		this._readyState = XMLHttpRequestReadyState.UNSENT;
		this._connec_start_time = Date.now();
		this.client.connect_to_host(this.url.hostname, this.url.port, this.url.port === 443);
		this.start_poll();
	}

	send(body?: BodyInit): void {
		this._pending_task = {
			path: '/' + this.url.path,
			method: RequestMethodMap[this._method],
			body
		};
	}

	setRequestHeader(name: string, value: string): void {
		this._request_headers[name.toLowerCase()] = value;
	}

	protected start_poll() {
		this.stop_poll();
		this._poll_task_id = requestAnimationFrame(this.poll.bind(this));
	}

	protected stop_poll() {
		if (this._poll_task_id != -1) {
			cancelAnimationFrame(this._poll_task_id);
			this._poll_task_id = -1;
		}
	}

	public abort() {
		this.client.close();
		this.dispatch_event('abort');
		this.start_poll();
	}

	getAllResponseHeaders(): string {
		return this.internal_response.headers_list.join(CRLF);
	}

	getResponseHeader(name: string): string | null {
		return this.internal_response.headers[name];
	}

	public poll() {
		this.client.poll();
		if (this._internal_response) this._internal_response.code = this.client.get_response_code();

		const now = Date.now();
		let status = this.client.get_status();
		switch (status) {
			case Status.STATUS_CONNECTED: {
				switch (this.readyState) {
					case XMLHttpRequestReadyState.UNSENT:
						this.readyState = XMLHttpRequestReadyState.OPENED;
						break;
					case XMLHttpRequestReadyState.LOADING: {
						if (this._loading_task.loaded_length >= this._loading_task.length) {
							this.process_response();
							this.readyState = XMLHttpRequestReadyState.DONE;
							if (this._internal_response.code >= ResponseCode.RESPONSE_OK && this._internal_response.code <= ResponseCode.RESPONSE_MULTIPLE_CHOICES) {
								this.dispatch_event('load');
							} else if (this._internal_response.code >= ResponseCode.RESPONSE_BAD_REQUEST) {
								this.dispatch_event('error');
							}
							this.dispatch_event('loadend');
						}
					} break;
				}
			} break;
			case Status.STATUS_BODY: {
				this._internal_response.code = ResponseCode.RESPONSE_CONTINUE;
				if (this.readyState === XMLHttpRequestReadyState.OPENED) {
					const headers = this.client.get_response_headers();
					if (headers.size()) {
						this._internal_response.headers = {};
						for (let i = 0; i < headers.size(); i++) {
							const header = headers.get(i);
							this.internal_response.headers_list.push(header);
							let cidx = header.indexOf(":");
							this.internal_response.headers[ header.substring(0, cidx) ] = header.substring(cidx + 1).trim();
						}
						this.readyState = XMLHttpRequestReadyState.HEADERS_RECEIVED;
					}
				} else if (this.readyState === XMLHttpRequestReadyState.LOADING || this.readyState === XMLHttpRequestReadyState.HEADERS_RECEIVED) {
					this.readyState = XMLHttpRequestReadyState.LOADING;
					const chunk = this.client.read_response_body_chunk();
					const size = chunk.size();
					this._loading_task.length = this.client.get_response_body_length();
					if (size) {
						this.internal_response.data.append_array(chunk);
						this._loading_task.loaded_length += size;
						this._loading_task.update_time = now;
						this.dispatch_event('progress');
					}
				}
			} break;
			case Status.STATUS_CONNECTING:
				if (now - this._connec_start_time > this.timeout) {
					this.dispatch_event('timeout');
					this.stop_poll();
				} break;
			case Status.STATUS_CANT_CONNECT:
			case Status.STATUS_CANT_RESOLVE:
			case Status.STATUS_DISCONNECTED:
				if (this.readyState != XMLHttpRequestReadyState.DONE) {
					this.readyState = XMLHttpRequestReadyState.DONE;
					this.dispatch_event('error');
					this.dispatch_event('loadend');
					this.stop_poll();
				}
				break;
			default:
				break;
		}

		// start load pending
		if (this.readyState == XMLHttpRequestReadyState.OPENED && this._pending_task) {
			if (this.start_load_task(this._pending_task)) {
				this._pending_task = null;
			}
		}
		if (this._loading_task) {
			if (this.readyState == XMLHttpRequestReadyState.LOADING && now - this._loading_task.update_time > this.timeout) {
				this.dispatch_event('timeout');
				this.dispatch_event('loadend');
				this.stop_poll();
			}
		}
	}

	protected start_load_task(task: InternalRequetTask) {
		if (this.readyState == XMLHttpRequestReadyState.OPENED) {

			const headers: string[] = [];
			let body: string = '';
			if (typeof task.body === 'object') {
				// this.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
				// body = querystring.encode(task.body);
				this.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
				body = JSON.stringify(task.body);
			} else if (task.body === 'string') {
				body = task.body;
				if (!('Content-Type' in this._request_headers)) {
					this.setRequestHeader('Content-Type', 'text/plain');
				}
			}

			for (let key of Object.getOwnPropertyNames(this._request_headers)) {
				const value = this._request_headers[key];
				const header = `${key}: ${value}`;
				headers.push(header);
			}

			if (godot.OK == this.client.request(task.method, task.path, headers as any, body)) {
				this.init_load_task(task);
				this.dispatch_event('loadstart');
				return true;
			}
		}
		return false;
	}

	protected init_load_task(task: InternalRequetTask) {
		this._loading_task = task;
		this._loading_task.loaded_length = 0;
		this._loading_task.update_time = Date.now();
		this._response = undefined;
		this._internal_response = {
			code: 0,
			data: new godot.PoolByteArray(),
			headers: {},
			headers_list: [],
		};
	}

	protected dispatch_event(type: keyof XMLHttpRequestEventTargetEventMap) {
		let event: Event= undefined;
		if (type === 'progress') {
			event = new ProgressEvent(type, {
				total: this._loading_task.length,
				loaded: this._loading_task.loaded_length,
				lengthComputable: this._loading_task.length > 0
			});
		} else {
			event = new Event(type);
		}

		switch (type) {
			case 'load':
				if (this.onload) this.onload.call(this, event);
				break;
			case 'loadend':
				if (this.onloadend) this.onloadend.call(this, event);
				break;
			case 'loadstart':
				if (this.onloadstart) this.onloadstart.call(this, event);
				break;
			case 'progress':
				if (this.onprogress) this.onprogress.call(this, event);
				break;
			case 'timeout':
				if (this.ontimeout) this.ontimeout.call(this, event);
				break;
			case 'abort':
				if (this.onabort) this.onabort.call(this, event);
				break;
			case 'error':
				if (this.onerror) this.onerror.call(this, event);
				break;
			default:
				break;
		}

		this.dispatchEvent(event);
	}

	protected process_response() {
		if (this.responseType === undefined) {
			const mime = new MIMEType(this._overrided_mime || this.getResponseHeader("Content-Type") || 'text/plain');
			if (mime.type === 'application' && mime.subtype === 'json') {
				this.responseType = 'json';
			} else if (mime.type === 'text') {
				this.responseType = 'text';
			} else {
				this.responseType = 'arraybuffer';
			}
		}

		switch (this.responseType) {
			case '':
			case 'document':
			case 'text':
				this._response = this.responseText;
				break;
			case 'json':
				const text = this.responseText;
				if (text) {
					this._response = JSON.parse(text);
				} else {
					this._response = null;
				}
				break;
			default:
				this._response = null;
				break;
		}
	}
}

export default {
	exports: {
		XMLHttpRequestEventTarget,
		XMLHttpRequestReadyState,
		XMLHttpRequestUpload,
		XMLHttpRequest: GodotXMLHttpRequest,
	}
};
