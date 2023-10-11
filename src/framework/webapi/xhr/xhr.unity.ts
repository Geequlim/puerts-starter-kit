import { System, UnityEngine, tiny } from "csharp";
import HttpStatusCode from "http-status-codes";
import MIMEType from "whatwg-mimetype";
import { IURL, parse_url } from "./url";
import { BodyInit, XMLHttpRequestBase, XMLHttpRequestEventTarget, XMLHttpRequestMethod, XMLHttpRequestReadyState, XMLHttpRequestUpload } from "./xhr.common";
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

	public get url(): Readonly<IURL> { return this.$url; }
	protected $url: IURL;
	protected $method: XMLHttpRequestMethod;
	protected $unityRequest: UnityEngine.Networking.UnityWebRequest;
	protected $internalRequest: UnityEngine.Networking.UnityWebRequestAsyncOperation;
	protected $connectionStartAt: number;
	private $timeoutUntil: number;

	private $progress: number;
	private $status: number;
	private $internalResponsHeaders: System.Collections.Generic.Dictionary$2<string, string>;
	get status(): number {
		return this.$status;
	}

	get responseURL(): string {
		if (this.url) return this.url.url;
		return null;
	}

	get responseXML(): string {
		return this.responseText;
	}

	get responseText(): string {
		if (this.$unityRequest && this.$unityRequest.downloadHandler) {
			return this.$unityRequest.downloadHandler.text;
		}
		return undefined;
	}

	getAllResponseHeaders(): string {
		let text = '';
		if (this.$internalResponsHeaders) {
			let enumerator = this.$internalResponsHeaders.GetEnumerator();
			while (enumerator.MoveNext()) {
				text += `${enumerator.Current.Key}: ${enumerator.Current.Value}\r\n`;
			}
		}
		return text;
	}

	getResponseHeader(name: string): string {
		if (this.$internalResponsHeaders) {
			if (this.$internalResponsHeaders.ContainsKey(name)) {
				return this.$internalResponsHeaders.get_Item(name);
			}
		}
		return undefined;
	}

	constructor() {
		super();
	}

	open(method: XMLHttpRequestMethod, url: string, async?: boolean, username?: string | null, password?: string | null): void {
		this.$url = parse_url(url);
		if (!this.url.port) {
			this.$url.port = this.url.protocal === 'https' ? 443 : 80;
		}
		this.$method = method;
		this.$readyState = XMLHttpRequestReadyState.UNSENT;
		this.$connectionStartAt = Date.now();
	}

	send(body?: BodyInit | null): void {
		const requestBody = body;
		switch (this.$method) {
			case 'PUT':
				this.$unityRequest = UnityEngine.Networking.UnityWebRequest.Put(this.$url.url, requestBody as string);
				break;
			case 'POST':
				// Note: 这里故意用 put 创建，因为用 POST的话 Unity 会自作主张地帮你编码 body 内容
				this.$unityRequest = UnityEngine.Networking.UnityWebRequest.Put(this.$url.url, requestBody as string);
				this.$unityRequest.method = this.$method;
				break;
			case 'GET':
				this.$unityRequest = UnityEngine.Networking.UnityWebRequest.Get(this.$url.url);
				break;
			case 'DELETE':
				this.$unityRequest = UnityEngine.Networking.UnityWebRequest.Delete(this.$url.url);
				break;
			default:
				this.$unityRequest = new UnityEngine.Networking.UnityWebRequest(this.$url.url, this.$method);
				break;
		}
		if (UnityEngine.Networking.UnityWebRequest.certificateHandler) {
			this.$unityRequest.disposeCertificateHandlerOnDispose = false;
			this.$unityRequest.certificateHandler = UnityEngine.Networking.UnityWebRequest.certificateHandler;
		}
		for (let key of Object.getOwnPropertyNames(this.$requestHeaders)) {
			const value = this.$requestHeaders[key];
			this.$unityRequest.SetRequestHeader(key, value);
		}
		if (typeof this.timeout === 'number') {
			this.$timeoutUntil = Date.now() + this.timeout;
		}
		this.$internalRequest = this.$unityRequest.SendWebRequest();
		this.$dispatch_event('loadstart');
		this.$start_poll();
	}

	abort(): void {
		if (this.$unityRequest) {
			this.$unityRequest.Abort();
			this.$dispatch_event('abort');
			this.$stop_poll();
		}
	}

	protected $get_progress(): ProgressEventInit {
		return {
			lengthComputable: this.$progress !== undefined,
			loaded: this.$progress,
			total: 1
		};
	}

	public $tick() {
		if (this.$unityRequest) {
			this.$status = Number(this.$unityRequest.responseCode) as number;
			if (this.$status) {
				this.readyState = XMLHttpRequestReadyState.OPENED;
			}

			const now = Date.now();
			if (this.$timeoutUntil && now > this.$timeoutUntil) {
				this.$unityRequest.Abort();
				this.$dispatch_event('timeout');
				this.$finished_load();
				this.$status = HttpStatusCode.REQUEST_TIMEOUT;
				return;
			}

			this.$status = Number(this.$unityRequest.responseCode) || HttpStatusCode.CONTINUE;
			if (this.readyState === XMLHttpRequestReadyState.OPENED) {
				this.$internalResponsHeaders = this.$unityRequest.GetResponseHeaders();
				if (this.$internalResponsHeaders && this.$internalResponsHeaders.Count) {
					this.readyState = XMLHttpRequestReadyState.HEADERS_RECEIVED;
				}
			}

			if (this.readyState === XMLHttpRequestReadyState.HEADERS_RECEIVED && this.$status == HttpStatusCode.OK) {
				this.readyState = XMLHttpRequestReadyState.LOADING;
			}

			if (this.$unityRequest.isDone || this.$unityRequest.result != UnityEngine.Networking.UnityWebRequest.Result.InProgress) {
				this.$finished_load();
			} else if (this.$internalRequest) {
				const p = this.$internalRequest.progress;
				if (this.$progress !== p) {
					this.$progress = p;
					this.$dispatch_event('progress');
				}
			}
		}
	}

	private $finished_load() {
		this.readyState = XMLHttpRequestReadyState.DONE;
		if (this.$unityRequest.isDone || this.$unityRequest.result === UnityEngine.Networking.UnityWebRequest.Result.DataProcessingError) {
			this.$internalResponsHeaders = this.$unityRequest.GetResponseHeaders();
			this.$process_response();
		}
		if (this.$unityRequest.result != UnityEngine.Networking.UnityWebRequest.Result.Success) {
			this.$dispatch_event('error');
		} else {
			this.$progress = 1;
			this.$dispatch_event('progress');
			this.$dispatch_event('load');
		}
		this.$dispatch_event('loadend');
		this.$stop_poll();
		if (this.$unityRequest) this.$unityRequest.Dispose();
	}

	protected $process_response() {
		if (this.responseType === undefined) {
			const mime = new MIMEType(this.$overridedMime || this.getResponseHeader("Content-Type") || 'text/plain');
			if (mime.type === 'application' && mime.subtype === 'json') {
				this.responseType = 'json';
			} else if (mime.type === 'arraybuffer') {
				this.responseType = 'arraybuffer';
			} else {
				this.responseType = 'text';
			}
		}
		switch (this.responseType) {
			case '':
			case 'document':
			case 'text':
				this.$response = this.responseText;
				break;
			case 'json':
				const text = this.responseText;
				if (text) {
					try { this.$response = JSON.parse(text);
					} catch (error) {
						this.responseType = 'text';
						this.$response = text;
					}
				} else {
					this.$response = null;
				}
				break;
			case 'arraybuffer':
				this.$response = this.$unityRequest.downloadHandler ? this.$unityRequest.downloadHandler.data : null;
			default:
				this.$response = null;
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
