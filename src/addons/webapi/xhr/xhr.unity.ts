import { IURL, parse_url } from "./url";
import MIMEType from "whatwg-mimetype";
import { XMLHttpRequestReadyState, BodyInit, XMLHttpRequestBase, XMLHttpRequestMethod, XMLHttpRequestEventTargetEventMap, XMLHttpRequestEventTarget, XMLHttpRequestUpload, HttpStatusCode } from "./xhr.common";
import { UnityEngine, System } from "csharp";

declare module 'csharp' {
	namespace UnityEngine {
		namespace Networking {
			namespace UnityWebRequest {
				let certificateHandler: CertificateHandler;
			}
		}
	}
}

class UnityXMLHttpRequest extends XMLHttpRequestBase {

	public get url(): Readonly<IURL> { return this._url; }
	protected _url: IURL;
	protected _request: UnityEngine.Networking.UnityWebRequest;
	// protected _head_request: UnityEngine.Networking.UnityWebRequest;
	protected _method: XMLHttpRequestMethod;
	protected _connect_start_time: number;
	protected _internal_request: UnityEngine.Networking.UnityWebRequestAsyncOperation;
	private _progress: number;
	private _timeout_until: number;
	private _status: HttpStatusCode;
	private _request_body?: string;
	private _internal_respons_headers: System.Collections.Generic.Dictionary$2<string, string>;
	get status(): HttpStatusCode {
		return this._status;
	}

	get responseURL(): string {
		if (this.url)
			return this.url.url;
		return null;
	}

	get responseXML(): string {
		return this.responseText;
	}

	get responseText(): string {
		if (this._request && this._request.downloadHandler) {
			return this._request.downloadHandler.text;
		}
		return undefined;
	}

	getAllResponseHeaders(): string {
		let text = '';
		if (this._internal_respons_headers) {
			let enumerator = this._internal_respons_headers.GetEnumerator();
			while (enumerator.MoveNext()) {
				text += `${enumerator.Current.Key}: ${enumerator.Current.Value}\r\n`;
			}
		}
		return text;
	}

	getResponseHeader(name: string): string {
		if (this._internal_respons_headers) {
			if (this._internal_respons_headers.ContainsKey(name)) {
				return this._internal_respons_headers.get_Item(name);
			}
		}
		return '';
	}

	constructor() {
		super();
	}

	open(method: XMLHttpRequestMethod, url: string, async?: boolean, username?: string | null, password?: string | null): void {
		this._url = parse_url(url);
		if (!this.url.port) {
			this._url.port = this.url.protocal === 'https' ? 443 : 80;
		}
		this._method = method;
		this._readyState = XMLHttpRequestReadyState.UNSENT;
		this._connect_start_time = Date.now();
	}

	send(body?: BodyInit | null): void {
		if (typeof body === 'object') {
			this.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
			body = JSON.stringify(body);
		} else if (body === 'string') {
			if (!('Content-Type' in this._request_headers)) {
				this.setRequestHeader('Content-Type', 'text/plain');
			}
		}
		this._request_body = body;
		// this._head_request = UnityEngine.Networking.UnityWebRequest.Head(this._url.url);
		// for (let key of Object.getOwnPropertyNames(this._request_headers)) {
		// 	const value = this._request_headers[key];
		// 	this._head_request.SetRequestHeader(key, value);
		// }
		// this._head_request.SendWebRequest();

		switch (this._method) {
			case 'PUT':
				this._request = UnityEngine.Networking.UnityWebRequest.Put(this._url.url, this._request_body);
				break;
			case 'POST':
				// Note: 这里故意用 put 创建，因为用 POST的话 Unity 会自作主张地帮你编码 body 内容
				this._request = UnityEngine.Networking.UnityWebRequest.Put(this._url.url, this._request_body);
				this._request.method = this._method;
				break;
			case 'GET':
				this._request = UnityEngine.Networking.UnityWebRequest.Get(this._url.url);
				break;
			case 'DELETE':
				this._request = UnityEngine.Networking.UnityWebRequest.Delete(this._url.url);
				break;
			default:
				this._request = new UnityEngine.Networking.UnityWebRequest(this._url.url, this._method);
				break;
		}
		if (UnityEngine.Networking.UnityWebRequest.certificateHandler) {
			this._request.disposeCertificateHandlerOnDispose = false;
			this._request.certificateHandler = UnityEngine.Networking.UnityWebRequest.certificateHandler;
		}
		for (let key of Object.getOwnPropertyNames(this._request_headers)) {
			const value = this._request_headers[key];
			this._request.SetRequestHeader(key, value);
		}
		this._internal_request = this._request.SendWebRequest();

		if (typeof this.timeout === 'number') {
			this._timeout_until = Date.now() + this.timeout;
		}
		this.$dispatch_event('loadstart');
		this.$start_poll();
	}

	abort(): void {
		if (this._request) {
			this._request.Abort();
			this.$dispatch_event('abort');
			this.$stop_poll();
		}
	}

	protected $get_progress(): ProgressEventInit {
		return {
			lengthComputable: this._progress !== undefined,
			loaded: this._progress,
			total: 1
		};
	}

	public $tick() {
		if (this._request) {

			this._status = Number(this._request.responseCode) as HttpStatusCode;
			if (this._status) {
				this.readyState = XMLHttpRequestReadyState.OPENED;
			}

			const now = Date.now();
			if (this._timeout_until && now > this._timeout_until) {
				this._request.Abort();
				this.$dispatch_event('timeout');
				this.$finished_load();
				this._status = HttpStatusCode.RequestTimeout;
				return;
			}

			this._status = Number(this._request.responseCode) || HttpStatusCode.Continue;
			if (this.readyState === XMLHttpRequestReadyState.OPENED) {
				this._internal_respons_headers = this._request.GetResponseHeaders();
				if (this._internal_respons_headers && this._internal_respons_headers.Count) {
					this.readyState = XMLHttpRequestReadyState.HEADERS_RECEIVED;
				}
			}

			if (this.readyState === XMLHttpRequestReadyState.HEADERS_RECEIVED && this._status == HttpStatusCode.OK) {
				this.readyState = XMLHttpRequestReadyState.LOADING;
			}

			if (this._request.isDone || this._request.result != UnityEngine.Networking.UnityWebRequest.Result.InProgress) {
				this.$finished_load();
			} else if (this._internal_request) {
				if (this._progress !== this._internal_request.progress) {
					this._progress = this._internal_request.progress;
					this.$dispatch_event('progress');
				}
			}
		}
	}

	private $finished_load() {
		this.readyState = XMLHttpRequestReadyState.DONE;
		if (this._request.isDone || this._request.result === UnityEngine.Networking.UnityWebRequest.Result.DataProcessingError) {
			this._internal_respons_headers = this._request.GetResponseHeaders();
			this.$process_response();
		}
		if (this._request.result != UnityEngine.Networking.UnityWebRequest.Result.Success) {
			this.$dispatch_event('error');
		} else {
			this._progress = 1;
			this.$dispatch_event('progress');
			this.$dispatch_event('load');
		}
		this.$dispatch_event('loadend');
		this.$stop_poll();
	}

	protected $process_response() {
		if (this.responseType === undefined) {
			const mime = new MIMEType(this._overrided_mime || this.getResponseHeader("Content-Type") || 'text/plain');
			if (mime.type === 'application' && mime.subtype === 'json') {
				this.responseType = 'json';
			} else if (mime.type === 'text') {
				this.responseType = 'text';
			} else if (mime.isXML() || mime.isHTML() || mime.isJavaScript()) {
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
				this._response = this._request.downloadHandler ? this._request.downloadHandler.data : null;
				break;
		}
	}
}

export default {
	exports: {
		XMLHttpRequestEventTarget,
		XMLHttpRequestReadyState,
		XMLHttpRequestUpload,
		XMLHttpRequest: UnityXMLHttpRequest,
	}
};
