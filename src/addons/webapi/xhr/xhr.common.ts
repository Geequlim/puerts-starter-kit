import { ProgressEvent, EventTarget, Event, AddEventListenerOptions, EventListenerOptions } from "../event";
import { IURL } from "./url";
export type XMLHttpRequestResponseType = "" | "arraybuffer" | "blob" | "document" | "json" | "text";
export type XMLHttpRequestMethod = "GET" | "POST" | "PUT" | "CREATE" | "DELETE";
export type BodyInit = string | Record<string, any>;
export enum HttpStatusCode { Continue = 100, SwitchingProtocols = 101, OK = 200, Created = 201, Accepted = 202, NonAuthoritativeInformation = 203, NoContent = 204, ResetContent = 205, PartialContent = 206, MultipleChoices = 300, Ambiguous = 300, MovedPermanently = 301, Moved = 301, Found = 302, Redirect = 302, SeeOther = 303, RedirectMethod = 303, NotModified = 304, UseProxy = 305, Unused = 306, TemporaryRedirect = 307, RedirectKeepVerb = 307, BadRequest = 400, Unauthorized = 401, PaymentRequired = 402, Forbidden = 403, NotFound = 404, MethodNotAllowed = 405, NotAcceptable = 406, ProxyAuthenticationRequired = 407, RequestTimeout = 408, Conflict = 409, Gone = 410, LengthRequired = 411, PreconditionFailed = 412, RequestEntityTooLarge = 413, RequestUriTooLong = 414, UnsupportedMediaType = 415, RequestedRangeNotSatisfiable = 416, ExpectationFailed = 417, UpgradeRequired = 426, InternalServerError = 500, NotImplemented = 501, BadGateway = 502, ServiceUnavailable = 503, GatewayTimeout = 504, HttpVersionNotSupported = 505 }

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

	onabort: ((this: XMLHttpRequestBase, ev: ProgressEvent) => any) | null;
	onerror: ((this: XMLHttpRequestBase, ev: ProgressEvent) => any) | null;
	onload: ((this: XMLHttpRequestBase, ev: ProgressEvent) => any) | null;
	onloadend: ((this: XMLHttpRequestBase, ev: ProgressEvent) => any) | null;
	onloadstart: ((this: XMLHttpRequestBase, ev: ProgressEvent) => any) | null;
	onprogress: ((this: XMLHttpRequestBase, ev: ProgressEvent) => any) | null;
	ontimeout: ((this: XMLHttpRequestBase, ev: ProgressEvent) => any) | null;

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
export class XMLHttpRequestBase extends XMLHttpRequestEventTarget {

	onreadystatechange: ((this: XMLHttpRequestBase, ev: Event) => any) | null;

	public get url() : Readonly<IURL> { return this._url; }
	protected _url : IURL;
	protected _method: XMLHttpRequestMethod;
	protected _request_headers: {[key: string]: string} = {};
	protected _connect_start_time: number;

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
	get responseText(): string | null { return null; }

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
	get responseURL(): string { return null; }

	/**
	 * Returns the document response.
	 *
	 * Throws an "InvalidStateError" DOMException if responseType is not the empty string or "document".
	 */
	get responseXML(): string { return null} ;
	get status(): HttpStatusCode { return 0; };
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
	setRequestHeader(name: string, value: string): void {
		this._request_headers[name.toLowerCase()] = value;
	}

	addEventListener<K extends keyof XMLHttpRequestEventMap>(type: K, listener: (this: XMLHttpRequestBase, ev: XMLHttpRequestEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void {
		super.addEventListener(type as any, listener, options);
	}

	removeEventListener<K extends keyof XMLHttpRequestEventMap>(type: K, listener: (this: XMLHttpRequestBase, ev: XMLHttpRequestEventMap[K]) => any, options?: boolean | EventListenerOptions): void {
		super.removeEventListener(type as any, listener, options);
	}


	private _poll_task_id: number = -1;
	protected $start_poll() {
		this.$stop_poll();
		this._poll_task_id = requestAnimationFrame(this.$tick.bind(this));
	}

	protected $stop_poll() {
		if (this._poll_task_id != -1) {
			cancelAnimationFrame(this._poll_task_id);
			this._poll_task_id = -1;
		}
	}

	protected $get_progress(): ProgressEventInit {
		return {};
	}

	protected $dispatch_event(type: keyof XMLHttpRequestEventTargetEventMap) {
		let event: Event = undefined;
		if (type === 'progress') {
			let evt = new ProgressEvent('progress', this.$get_progress());
			event = evt;
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

	protected $tick() {}
}