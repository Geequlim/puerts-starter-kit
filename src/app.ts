declare const process: { version?: string, release?: { name?: string; }; };

export interface IScriptLauncher {
	JS_start(): void;
	JS_fixedUpdate(delta: number): void;
	JS_lateUpdate(delta: number): void;
	JS_update(delta: number): void;
	JS_finalize(): void;
}

export class JavaScriptApplication {
	private static $inst: JavaScriptApplication;
	public static get inst(): JavaScriptApplication { return this.$inst; }
	constructor(readonly launcher: IScriptLauncher) {
		JavaScriptApplication.$inst = this;
		launcher.JS_start = this.start.bind(this);
		launcher.JS_fixedUpdate = this.fixedUpdate.bind(this);
		launcher.JS_update = this.update.bind(this);
		launcher.JS_lateUpdate = this.lateUpdate.bind(this);
		launcher.JS_finalize = this.finalize.bind(this);

		console.log(`已启动 JavaScript 虚拟机`, process?.release?.name || '', process?.version || '');
		this.initialize();
	}

	initialize() {

	}

	start() {

	}

	fixedUpdate(delta: number) {

	}

	update(delta: number) {
		if (typeof WebAPI === 'object') WebAPI.tick();
	}

	lateUpdate(delta: number) {

	}

	finalize() {
		if (typeof WebAPI === 'object') WebAPI.finalize();
		console.log(`关闭 JavaScript 虚拟机`);
	}
}
